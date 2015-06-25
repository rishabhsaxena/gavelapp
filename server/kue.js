var kue = Meteor.npmRequire('kue')

queue = kue.createQueue();

// global error handler for the job queue
queue.on( 'error', function( err ) {
  console.log( 'Oops... ', err );
});

kue.app.listen(3003);


// Add and test a job
//var job1 = queue.create('addScraper', data).ttl(1000).save();

// Job processing functions are written in the format job, cb
var addEmailProcessor = Meteor.bindEnvironment(function(job, ctx, done) {
    log.info("addEmailProcessor:", "Processing email tasks", job.data);
    debugger;
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
    debugger;
    // Give the poor little project his helpers back
    console.log('scraping orders');
    log.info("Scraping orders");
    console.log(job.data._id, job.data.project);
    var project = Projects.findOne(job.data._id);
    log.info("project is:", project, job.data);

    // if project does not exist, delete the job
    if(!project){
    	job.remove();
    	done();
    }
    // otherwise create a new job to scrape the same project again 4 hours later
    else{

    }

    var emailLawyers = Meteor.bindEnvironment(function(links) {
        //var lawyers = project.lawyers(); Notify the lawyers

        // if new links, notify lawyers or whatever group there is that new orders have been fetched
        if(checkNewLinks(project, links)){
            console.log()
            log.info("Inserting orders")
            project.insertOrders(links);
            project = Projects.findOne(project._id);
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

var jobOptions = {
    concurrency: 4,
    payload: 1,
    pollInterval: 4000,
    prefetch: 1
};

var emailWorkers = myJobs.processJobs('addEmail', jobOptions, addEmailProcessor);
var scraperWorkers = myJobs.processJobs('addScraper', jobOptions, addScraperProcessor);

// Processor for email task
queue.process('addEmail', addEmailProcessor);

// Processfor for scraper task
queue.process('addScraper', addScraperProcessor);