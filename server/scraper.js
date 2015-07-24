Nightmare = Meteor.npmRequire('nightmare')

addScraperJob = function(project) {
	// Logic to find relevant scrape function based on court and scrape results automatically
	// TODO: Faulty logic. Remove template from here and move this into helpers
	// remove the old scraper job here
	//removeScraperJob(project);

	// Create a new scraper job
	// var job = myJobs.createJob('addScraper', {'project': project});
	// job.repeat({
	//   repeats: Job.forever,   // Rerun this job 5 times,
	//   wait: 4*60*60*1000   // wait 50 seconds between each re-run.
	// });
	// job.repeat({
	//   schedule: myJobs.later.parse.text('every 5 hours')   // Rerun this job every 5 minutes
	// });
	//job.retry({retries: 4, wait: 4*60*60*1000});
	var data = project;
	queue.create('addScraper', data).ttl(20000).removeOnComplete( true ).save();
	log.info("addScraperJob:", "added scraper job");
	//job.save();
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

scrapeCauseList = function(cb) {
	log.info("scrapeCauseList", "running scraper", "callback:");
	var nm = new Nightmare(),
		causeListLink = null;
	nm.on('error', function(msg, trace){
		console.log(msg, trace);
		if(cb)
			cb.call(this, null);
	})
	var parseLink = function(){
		var causeListPdfIcon = document.querySelector("#pstory_bigdata a");
		var domain = window.location.origin;
		var relativeLink = causeListPdfIcon.getAttribute('href');
		var absoluteLink = [domain, relativeLink].join('/');
		return absoluteLink;
	}
	var saveResult = function(result){
		log.info("got cause list link", result);
		causeListLink = result;
	}
	var handleRequest = function(){
		log.info("finally done");
		if(cb && causeListLink){
			log.info("assigning cause list link", "callback is");
			cb.call(this, causeListLink);
		}
	}
	nm.goto('http://delhihighcourt.nic.in/causelist_NIC_PDF.asp')
		    .evaluate(parseLink, saveResult)
		    .run(handleRequest);
}

scrapeDelhiHighCourt = function(project, cb) {
	log.info("scrapeDelhiHighCourt:", "running scraper", "callback:");
	var nm = new Nightmare();
	var data = {
		orders: [],
		pdfs: []
	};
	var links = [];
	
	var handleResult = function(p){
		console.log("setting equal to", p);
		data.orders = p;
	};

	var fetchPdfs = function() {
		console.log("inside getPdfs", data.orders);

		var getIframePdf = function() {
		    var iframe = document.querySelector('iframe')
		    
		    if(iframe)
		        return iframe.src;
		    
		    var table = document.querySelector('table');
		    
		    // Check if table element exists. That means its an older orders like EXP 276 2012
		    console.log('found', window.location.href);
		    if(table)
		        return window.location.href;
		}

		var saveIframePdfs = function(pdf) {
			log.info("got pdf", pdf);
			if(pdf)
				data.pdfs.push({link: pdf});
		}

		var handleResult = function(){
			log.info("finally done", data.pdfs);
			if(cb && data.pdfs.length){
				log.info("assigning links", "callback is");
				links = data.pdfs;
				cb.call(this, links);
			}	
		};

		var nn = new Nightmare();
		
		/* Queue up all the commands */
		_.each(data.orders, function(order) {
			log.info("going to link", order.link);
			nn.goto(order.link)
			//nn.screenshot('poko.png')
			nn.wait()
			nn.evaluate(getIframePdf, saveIframePdfs)
		});

		/* Run queue with final callback */
		nn.run(handleResult);

		
	};

	var parseLinks = function(ctype, cno, cyear){
		        var els = document.querySelectorAll('button[onclick*="location\.href\="].LongCaseNoBtn');
		        var links = [];
		        for(var i=0; i<els.length; i++){
		            var oclick = els[i].getAttribute('onclick');
		            links.push({"link": oclick.replace(/(location.href=')(.+)(')/, '$2')});
		        }
		        return links;
		    }

	log.info("project:", project.ctype, project.cno, project.cyear);

	// Always have an error event in scraper
	nm.on('error', function(msg, trace){
		console.log(msg, trace);
		cb.call(this, []);
	})

	nm.goto('http://delhihighcourt.nic.in/case.asp')
			.select('select[name="ctype"]', project.ctype)
		    .type('input[name="cno"]', project.cno+'')
		    .select('select[name="cyear"]', project.cyear+'')
		    .click('input[name="submit"]')
		    .wait()
		    .click('button[onclick*="case"]')
		    .wait()
		    .evaluate(parseLinks, handleResult, project.ctype, project.cno, project.cyear)
		    .run(fetchPdfs);
}