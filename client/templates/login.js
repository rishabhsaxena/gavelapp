Template.login.events({
	'click .fbBtn': function(){
		Meteor.loginWithFacebook();
	},
	'click .gBtn': function(){
		Meteor.loginWithGoogle();
	},
	'submit #login-form': function(event, template){
		event.preventDefault();
		var passwordElement = template.find("#login-password"),
			usernameElement = template.find("#login-username");
		var username = trimInput(usernameElement.value),
			password = passwordElement.value;
		if(username.length)
			if(isValidPassword(password))
				Meteor.loginWithPassword(username, password, function(err){
					if(err)
						Materialize.toast(err.reason, 2000);
					else
						Router.go('projects');
				})
			else{
				$(passwordElement).removeClass('invalid').addClass('invalid');
				if(password.length)
					Materialize.toast('Minimum 6 characters required!', 2000)
				else
					Materialize.toast('Password is required!', 2000);
			}
		else{
			$(usernameElement).removeClass('invalid').addClass('invalid');
			Materialize.toast('Username is required!', 2000)
		}
		return false;
	}
})
var trimInput = function(val) {
	return val.replace(/^\s*|\s*$/g, "");
}
var isValidPassword = function(val) {
	return val.length >= 6;
}