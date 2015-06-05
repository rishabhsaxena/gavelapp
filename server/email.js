parseReminders = function(doc, template, subject) {
	_.each(doc.reminders, function(reminder){
		// TODO: Group emails by date to save mandrill bandwidth
		//TODO: Do this using iron router. Use a transform function here with collection helpers
		addEmailReminder(doc, template, '', [reminder.email], DEFAULT_EMAIL, subject || doc.subject(), reminder.date);
	})
}

addEmailReminder = function(doc, template, message, to, replyTo, subject, date) {
	//debugger;
	date = date || (new Date());
	
	//log.info("\n adding email reminder \n", message, to, template, replyTo);
	// TODO: Faulty logic. Remove template from here and move this into helpers
	if(doc.path)
		doc.linkurl = Meteor.absoluteUrl() + doc.path
	else
		doc.linkurl = Meteor.absoluteUrl() + template + '/' + doc._id;
	doc.message = message
	var merge_vars = toMandrillArray(doc);
	//log.info("addEmailReminder", merge_vars);
	console.log('to:',to);
	var job = myJobs.createJob('addEmail', {'name': 'Send Email', 'template': template, 'merge_vars': merge_vars, 'to': to, 'replyTo': replyTo, 'subject': subject});
	var delayMilliSeconds = Math.max(0, date - new Date());
	//log.info(delayMilliSeconds);
	job.retry({retries: 4, wait: 2*60*1000});
	job.delay(delayMilliSeconds);
	job.save();
}

toMandrillArray = function(obj) {
	var arr = [];

	for(var key in obj) {
		if(obj.hasOwnProperty(key)) {
			arr.push({name: key,content: obj[key]});	
		}
	};

	return arr;
}

