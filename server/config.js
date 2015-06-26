Meteor.startup(function() {
	// Mandrill config
    Meteor.Mandrill.config({
        username: "thegreatshasha@gmail.com",
        key: "2hd3_l9CBJE5Q-DR5QG5RA"
    });

    myJobs.startJobs();

    Accounts.loginServiceConfiguration.remove({
    service: "facebook"
	});

	Accounts.loginServiceConfiguration.remove({
    service: "google"
	});

    Accounts.loginServiceConfiguration.insert({
	  service: "google",
	  clientId: "787040311837-qv38rca8h6oi5upq1nqpobjp8ig4g62h.apps.googleusercontent.com",
	  secret: "SLm3bVGlBGdND5kcHpykXgIb",
	  loginStyle : "redirect"
	});

    Accounts.loginServiceConfiguration.insert({
	  service: "facebook",
	  appId: "857171747708137",
	  secret: "60e60e7ae0aa3de143f447a8c2845a54"
	});

    Kadira.connect('SZE3JbqATezv5yT4m', '1b3a1f5a-c2f6-4e78-9e58-bf9851094fa3')

});

log = Winston;

log.add( Winston_Papertrail, {
	levels: {
	    debug: 0,
	    info: 1,
	    warn: 2,
	    error: 3,
	    auth: 4
	},
	colors: {
	    debug: 'blue',
	    info: 'green',
	    warn: 'red',
	    error: 'red',
	    auth: 'red'
	},

	host: "logs2.papertrailapp.com",
	port: 42353, 
	handleExceptions: true,
	json: true,
	colorize: true,
	logFormat: function(level, message) {
	    return level + ': ' + message;
	}
});