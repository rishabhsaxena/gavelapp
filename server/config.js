Meteor.startup(function() {
	// Mandrill config
    Meteor.Mandrill.config({
        username: "thegreatshasha@gmail.com",
        key: "2hd3_l9CBJE5Q-DR5QG5RA"
    });

    myJobs.startJobs();
});