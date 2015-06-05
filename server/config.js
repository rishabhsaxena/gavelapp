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
	  secret: "SLm3bVGlBGdND5kcHpykXgIb"
	});

    Accounts.loginServiceConfiguration.insert({
	  service: "facebook",
	  appId: "857171747708137",
	  secret: "60e60e7ae0aa3de143f447a8c2845a54"
	});

});