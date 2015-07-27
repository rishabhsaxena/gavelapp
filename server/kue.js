kue = Meteor.npmRequire('kue')
kueServer = kue.app.listen(3003);

queue = kue.createQueue();

var causeListLink = null;

stopKue = function(cb) {
    log.info('stopping kue')
    queue.shutdown(function(err) {
        console.log('Kue graceful shut down.', err || '');
        //kueServer.close();
        //delete kueServer;
        if(cb)
            cb.call(this);
    });
    delete queue;
}

startKue = function(){
    log.info('starting kue')
    queue = kue.createQueue();

    // global error handler for the job queue
    queue.on( 'error', function( err ) {
      console.log( 'Oops... ', err );
    });

    // Processor for email task
    queue.process('addEmail', addEmailProcessor);

    // Processfor for scraper task
    queue.process('addScraper', addScraperProcessor);

    //Processor for cause list scraper
    queue.process('addCauseListScraper', addCauseListScraperProcessor);

    //Processor for cause list scraper
    queue.process('addDisplayBoardScraper', addDisplayBoardScraperProcessor);

    // Run global jobs which run indepentently of database hooks
    startGlobalJobs();
}

addProjectScraper = function(project, delay) {
    log.info('adding job for project: ', project.title, project._id);
    // at any state there must be at most one active and one inactive/delayed
    // if any other active/delayed job found, remove it and add a new job
    
    // Remove any other inactive jobs with same project id
    kue.Job.rangeByType( 'addScraper', 'inactive', 0, 10, 'asc', function( err, jobs ) {
        if(err)
            log.error(err);

        // you have an array of maximum n Job objects here
        var previousJobs = _.filter(jobs, function(job){ return job.data._id === project._id });

        _.each(previousJobs, function(job){
            job.remove(function(){
                log.info('removed job: ', job.id)
            });
        });
    });

    // If no other delayed jobs found, add a delayed job
    kue.Job.rangeByType( 'addScraper', 'delayed', 0, 10, 'asc', function( err, jobs ) {
        if(err)
            log.error(err);

        var previousJobs = _.filter(jobs, function(job){ return job.data._id === project._id });

        if(!previousJobs.length){
            var job = queue.create('addScraper', project).removeOnComplete( true ).ttl(4*60*1000)
            if(delay)
                job.delay(delay)
            job.save()
        }
    });
}

addCauseListScraper = function(delay) {
    log.info('adding cause list scraper', delay)
    // at any state there must be at most one active and one inactive/delayed
    // if any other active/delayed job found, remove it and add a new job
    kue.Job.rangeByType( 'addCauseListScraper', 'delayed', 0, 10, 'asc', function( err, jobs ) {
        if(err)
            log.error(err);
        // you have an array of maximum n Job objects here
        if(!jobs.length){
            var job = queue.create('addCauseListScraper').removeOnComplete( true ).ttl(4*60*1000)
            if(delay)
                job.delay(delay)
            job.save()
        }
    });
}

addDisplayBoardScraper = function(delay) {
    log.info('adding display board scraper', delay)
    // at any state there must be at most one active and one inactive/delayed
    // if any other active/delayed job found, remove it and add a new job
    kue.Job.rangeByType( 'addDisplayBoardScraper', 'delayed', 0, 10, 'asc', function( err, jobs ) {
        if(err)
            log.error(err);
        // you have an array of maximum n Job objects here
        if(!jobs.length){
            var job = queue.create('addDisplayBoardScraper').ttl(4*60*1000).removeOnComplete(true)
            if(delay)
                job.delay(delay)
            job.save()
        }
    });
    
}

startGlobalJobs = function() {
    addCauseListScraper();
    addDisplayBoardScraper();
}

restartKue = function(){
    if(queue !== {})
        stopKue(startKue);
    startKue();
}

// Restart kue every 10 mins
startKue()
setInterval(restartKue, 5*60*1000);

 var addEmailProcessor = Meteor.bindEnvironment(function(job, ctx, done) {
        log.info("addEmailProcessor:", "Processing email tasks", job.data);
        // var tos = _.map(job.data.to, function(email){
        //     if(typeof email == 'string')
        //         return {'email': email};
        //     else
        //         return {'email': email.email, 'name': email.name, 'type': email.type};
        // });
        var tos = [{'email' : job.data.to}]
        console.log('tos',tos)
        var from = job.data.replyTo || 'noreply@cloudvakil.com';
        //console.log("tos are:", job.data.tos);
        var status = Meteor.Mandrill.sendTemplate({
            // Since we want the email to come from the person
            "template_name": job.data.template,
            "template_content": [
              {
                'summary': 'An event has happened' 
              }
            ],
            "message": {
                "from_email": from,
                "from_name": "Cloudvakil Alerts",
                "global_merge_vars": job.data.merge_vars,
                // Not using customer specific merge_vars right now. Need to add support for this.
                // "merge_vars": [
                //     {
                //         "rcpt": "email@example.com",
                //         "vars": [
                //             {
                //                 "name": "fname",
                //                 "content": "John"
                //             },
                //             {
                //                 "name": "lname",
                //                 "content": "Smith"
                //             }
                //         ]
                //     }
                // ],
                "preserve_recipients": true,
                "subject": job.data.subject,
                "to": tos,//.concat({"name": "CloudVakil Tracker", "email": "mail@inbound.cloudvakil.com", "type": "cc"}),
                //"bcc_address": "",
                "headers": {
                    //"X-MC-PreserveRecipients": true
                    //"Reply-To": "mail@inbound.cloudvakil.com"
                }
            }
        });

        if (status && status.statusCode == 200) {
            log.info("Sent email successfully");
            job.log("Sent successfully");
        }
        else {
            log.error("Sending email failed");
            job.log("Sending email failed", {
                level: 'warning'
            });
            done(new Error("sending email failed"));
        }

        done();
    });

    var addScraperProcessor = Meteor.bindEnvironment(function(job, ctx, done) {
        //throw new Error('error from scraper');
        //debugger;
        // Give the poor little project his helpers back
        console.log('scraping orders');
        log.info("Scraping orders");
        console.log(job.data._id, job.data.project);
        var project = Projects.findOne(job.data._id);
        log.info("project is:", project, job.data);

        // if project does not exist, delete the job
        if(!project){
            job.remove();
                var error = new Error('project '+ job.data.title +' not found')
            done(error);
                throw error;
        }
        // otherwise create a new job to scrape the same project again 4 hours later
        else{
            log.info("creating new job");
            addProjectScraper(project, 4*60*60*1000);
        }

        var emailLawyers = Meteor.bindEnvironment(function(links) {
            //var lawyers = project.lawyers(); Notify the lawyers
            project = Projects.findOne(project._id);
                
            // if new links, notify lawyers or whatever group there is that new orders have been fetched
            if(project && checkNewLinks(project, links)){
                console.log()
                log.info("Inserting orders")
                project.insertOrders(links);
                project.orders = project.orders();
                project.unreadCount = project.unreadCount();
                // project.path = sprintf('projects/%s', project._id);
                // var subject = sprintf('[%s] New orders fetched for matter: %s', project._id, project.name)
                // console.log("orders:", project.orders, links);
                // // Insert links in database here and then notify lawyers via email
                //log.error(project.userEmail(),"user email");
                if(links.length){
                    pushNotify(project);
                    addEmailReminder(project, 'gavelorders', 'New orders have been fetched for your project:'+project.title, project.userEmail(), 'rishabh@cloudvakil.com', 'orders fetched:'+project.title, new Date())
                }
            }

            // Mark job as done and trigger callback
            log.info("Done scraping email");
            job.log("Scraped email");
            //job.done();
            debugger;
            done();
        });

        if(project.ctype && project.cno && project.cyear){
            log.info(project.ctype ,project.cno , project.cyear)
            scrapeDelhiHighCourt(project, emailLawyers);
        }
        else{
            var error = "Missing ctype, cno or cyear for project " + project._id;
            //job.log(error, {level: 'warning'});
            log.error(error);
            //job.fail(error);
            done(new Error(error));
        }
    });

var addCauseListScraperProcessor = Meteor.bindEnvironment(function(job, ctx, done) {
    console.log("Scraping cause list");
    log.info("Scraping cause list");
    log.info("creating new job");
    addCauseListScraper(4*60*60*1000);

    var notifyLawyers = Meteor.bindEnvironment(function(link) {
        //if new cause list link -> notify
        if(causeListLink !== link){
            console.log("before: ", causeListLink);
            log.info("Changing cause list link");
            
            upsertCauseList({
                'link': link,
                'date': new Date()
            })
            //notify
            console.log("before: ", causeListLink);
        }

        log.info("Done scraping cause list");
        job.log("Scraped cause list");

        done();
    });

    scrapeCauseList(notifyLawyers);
});

var addDisplayBoardScraperProcessor = Meteor.bindEnvironment(function(job, ctx, done) {
    console.log("Scrapping display board");
    log.info("Srcapping display board");
    log.info("creating new job");
    addDisplayBoardScraper(10*60*1000);

    var notifyLawyers = Meteor.bindEnvironment(function(courtItems) {
        //if new things on display board -> notify
        var diffs = getDisplayBoardDiffs(courtItems);
        if(diffs['delete'].length){
            deleteDisplayBoardItems(diffs['delete']);
        }
        if(diffs['insert'].length){
            insertDisplayBoardItems(diffs['insert']);
        }
        if(diffs['update'].length){
            updateDisplayBoardItems(diffs['update']);
        }
        log.info("Done scraping display board");
        job.log("Scraped display board");

        done();
    })

    scrapeDisplayBoard(notifyLawyers);
})