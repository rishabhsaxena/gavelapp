Nightmare = Meteor.npmRequire('nightmare')

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

getDisplayBoardDiffs = function(courtItems){
	log.info("checkDisplayBoardUpdates:", "checking display board updates");
	var oldDisplayBoard = DisplayBoard.find({}).fetch();

	var compare = function(a, b){
		if(a.courtNo < b.courtNo)
			return 1;
		else(a.courtNo > b.courtNo)
			return -1;
		return 0;
	}

	oldDisplayBoard.sort(compare);
	courtItems.sort(compare);

	var diffs = {
		'insert': [],
		'delete': [],
		'update': []
	};

	if(courtItems.length){
		while(oldDisplayBoard.length && courtItems.length){
			var old = oldDisplayBoard.pop(), newValue = courtItems.pop();
			if(old.courtNo < newValue.courtNo){
				diffs['delete'].push(old.courtNo);
				courtItems.push(newValue);
			}
			else if(old.courtNo > newValue.courtNo){
				diffs['insert'].push(newValue);
				oldDisplayBoard.push(old)
			}
			else if(old.item != newValue.item)
				diffs['update'].push(newValue);
		}
		diffs['delete'] = diffs['delete'].concat(_.map(oldDisplayBoard, function(obj){return obj.courtNo;}));
		diffs['insert'] = diffs['insert'].concat(courtItems);
	}

	return diffs;
}

scrapeDisplayBoard = function(cb){
	log.info("scrapeDisplayBoard", "running scraper", "callback:");
	var nm = new Nightmare(),
		data = [];
	nm.on('error', function(msg, trace){
		console.log(msg, trace);
		if(cb)
			cb.call(this, null);
	})
	var parseLink = function(){
		var tableCells = document.querySelectorAll("td[id^='Td']");
		var courts = [];
		for(var i=0, length = tableCells.length;i<length;i+=2){
			courts.push({
				courtNo: parseInt($(tableCells[i]).text().trim()),
				item: $(tableCells[i+1]).text().trim()
			})
		}
		return courts;
	}
	var saveResult = function(result){
		log.info("got display board items", result);
		data = result;
	}
	var handleRequest = function(){
		log.info("finally done");
		if(cb && data){
			log.info("assigning court items", "callback is");
			cb.call(this, data);
		}
	}
	nm.goto('http://delhihighcourt.nic.in/displayboard.asp')
		    .evaluate(parseLink, saveResult)
		    .run(handleRequest);
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