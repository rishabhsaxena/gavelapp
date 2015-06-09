Nightmare = Meteor.npmRequire('nightmare')

addScraperJob = function(project) {
	// Logic to find relevant scrape function based on court and scrape results automatically
	// TODO: Faulty logic. Remove template from here and move this into helpers
	// remove the old scraper job here
	removeScraperJob(project);

	// Create a new scraper job
	var job = myJobs.createJob('addScraper', {'project': project});
	job.repeat({
	  repeats: Job.forever   // Rerun this job 5 times,
	  //wait: 4*60*60*1000   // wait 50 seconds between each re-run.
	});
	// job.repeat({
	//   schedule: myJobs.later.parse.text('every 5 hours')   // Rerun this job every 5 minutes
	// });
	//job.retry({retries: 4, wait: 4*60*60*1000});
	log.info("addScraperJob:", "added scraper job");
	job.save();
}

removeScraperJob = function(project) {
	log.info("removeScraperJob:", "removing jobs from scraper");
	var prevJobEntries = myJobs.find({'data.project._id': project._id, 'type':'addScraper'}).fetch();
	prevJobEntries.forEach(function(entry){
		var prevJob = new Job(myJobs, entry);
		prevJob.pause();
		prevJob.cancel();
		prevJob.remove();
	});
}

checkNewLinks = function(project, links) {
	log.info("checkNewLinks:", "checking new links");
	// Take order and return link
	//debugger;
	var mapFn = function(order) {
		return order.link;
	}
	var projectLinksArray = _.map(project.orders(), mapFn);
	var linkArray = _.map(links, mapFn)
	log.info((_.isEqual(projectLinksArray.sort(), linkArray.sort())),"new links")
	return !(_.isEqual(projectLinksArray.sort(), linkArray.sort()));
}

scrapeDelhiHighCourt = function(project, callback) {
	log.info("scrapeDelhiHighCourt:", "running scraper");
	var nm = new Nightmare();
	
	var handleResult = Meteor.bindEnvironment(function(p){
		links = p;
		log.info(links);
		if(callback && links.length)
			callback.call(this);
	})

	var parseLinks = function(ctype, cno, cyear){
		        var els = document.querySelectorAll('button[onclick*="location\.href\="].LongCaseNoBtn');
		        var links = [];
		        for(var i=0; i<els.length; i++){
		            var oclick = els[i].getAttribute('onclick');
		            var id = oclick.match(/\d+/g)[0];
		            links.push({"link": "http://delhihighcourt.nic.in/dhcqrydisp_o.asp?pn=" + id + "&yr=" + cyear});
		        }
		        return links;
		    }

	nm.goto('http://delhihighcourt.nic.in/case.asp')
		    .select('select[name="ctype"]', project.ctype)
		    .type('input[name="cno"]', project.cnum+'')
		    .select('select[name="cyear"]', project.cyear)
		    .click('input[name="submit"]')
		    .wait()
		    .click('button[onclick*="case"]')
		    .wait()
		    .evaluate(parseLinks, handleResult, project.ctype, project.cnum, project.cyear)
		    .run();
}