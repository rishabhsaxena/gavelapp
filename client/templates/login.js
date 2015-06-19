Template.login.events({
    'click .fbBtn': function () {
        Meteor.loginWithFacebook();
    },
    'click .gBtn': function () {
        Meteor.loginWithGoogle();
    },
    'click #register-btn': function(event, template){
        loginRegisterUser(template, function(email, password){
            Accounts.createUser({email: email, password: password}, function (err) {
                if (err)
                    Materialize.toast(err.reason, 2000);
                else
                    Router.go('projects');
            });
        });
    },
    'click #login-btn': function (event, template) {
        loginRegisterUser(template, function (email, password) {
            Meteor.loginWithPassword(email, password, function (err) {
                if (err)
                    Materialize.toast(err.reason, 2000);
                else
                    Router.go('projects');
            });
        });
    }
});
var loginRegisterUser = function(template, callback){
    var passwordElement = template.find("#login-password"),
        emailElement = template.find("#login-email");
    var email = trimInput(emailElement.value),
        password = passwordElement.value;
    if(email.length)
        if (isValidPassword(password))
            callback(email, password);
        else {
            $(passwordElement).removeClass('invalid').addClass('invalid');
            if (password.length)
                Materialize.toast('Minimum 6 characters required!', 2000)
            else
                Materialize.toast('Password is required!', 2000);
        }
    else {
        $(emailElement).removeClass('invalid').addClass('invalid');
        Materialize.toast('Email is required!', 2000);
    }
};
var trimInput = function (val) {
    return val.replace(/^\s*|\s*$/g, "");
};
var isValidPassword = function (val) {
    return val.length >= 6;
};