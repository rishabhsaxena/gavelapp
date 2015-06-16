Template.login.events({
    'click .fbBtn': function () {
        Meteor.loginWithFacebook();
    },
    'click .gBtn': function () {
        Meteor.loginWithGoogle();
    },
    'submit #login-form': function (event, template) {
        event.preventDefault();
        var passwordElement = template.find("#login-password"),
            emailElement = template.find("#login-email");
        var email = trimInput(emailElement.value),
            password = passwordElement.value;
        if(email.length)
            if (isValidPassword(password)){
                var currentSubmitButton = event.originalEvent.explicitOriginalTarget.id;
                if(currentSubmitButton=="login-btn")
                    Meteor.loginWithPassword(email, password, function (err) {
                        if (err)
                            Materialize.toast(err.reason, 2000);
                        else
                            Router.go('projects');
                    });
                else if (currentSubmitButton == "register-btn")
                    Accounts.createUser({email: email, password: password}, function (err) {
                        if (err)
                            Materialize.toast(err.reason, 2000);
                        else
                            Router.go('projects');
                    });
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
        return false;
    }
});
var trimInput = function (val) {
    return val.replace(/^\s*|\s*$/g, "");
};
var isValidPassword = function (val) {
    return val.length >= 6;
};