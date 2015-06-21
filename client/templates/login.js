Template.login.rendered = function () {
    $(this.findAll('ul.tabs')).tabs();
};
Template.login.events({
    'click .fbBtn': function () {
        Meteor.loginWithFacebook();
    },
    'click .gBtn': function () {
        Meteor.loginWithGoogle();
    }
});
Template.login_form.events({
    "submit #login-form": function (event, template) {
        event.preventDefault();
        loginRegisterUser(template, false, function (email, password) {
            Meteor.loginWithPassword(email, password, function (err) {
                if (err)
                    Materialize.toast(err.reason, 2000);
                else
                    Router.go('projects');
            });
        });
    }
});
Template.register_form.events({
    "submit #register-form": function (event, template) {
        event.preventDefault();
        loginRegisterUser(template, true, function (email, password) {
            Accounts.createUser({email: email, password: password}, function (err) {
                if (err)
                    Materialize.toast(err.reason, 2000);
                else
                    Router.go('projects');
            });
        });
    }
});
var loginRegisterUser = function (template, isRegister, callback) {
    var passwordElement = template.find("#password"),
        emailElement = template.find("#email");
    var email = trimInput(emailElement.value),
        password = passwordElement.value;
    if (email.length)
        if (isValidPassword(password)) {
            if (isRegister) {
                var confirmPasswordElement = template.find("#confirm-password");
                if (passwordElement.value == confirmPasswordElement.value)
                    callback(email, password);
                else {
                    $(confirmPasswordElement).removeClass('invalid').addClass('invalid');
                    Materialize.toast('Confirm Password doesn\'t match!', 2000)
                }
            }
            else
                callback(email, password);
        }
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