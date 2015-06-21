if (Meteor.isClient) {

    Template.nav.rendered = function () {
        // Initialize collapse button
        $(".button-collapse").sideNav();
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        //$('.collapsible').collapsible();
    }

    Template.addProject.rendered = function () {
        $('select').material_select();
    }

    Template.addProject.events({
        'submit form': function (event) {
            debugger;
            event.preventDefault();
            Projects.insert({
                'title': event.target.children[0].children[0].children[0].value,
                'ctype': event.target.children[0].children[1].children[0].children[3].value,
                'cno': event.target.children[0].children[2].children[0].value,
                'cyear': event.target.children[0].children[3].children[0].children[3].value,
                'userId': Meteor.userId()
            });
            Router.go('projects');
        }
    });

    Template.projectsList.helpers({
        'projects': function () {
            return Projects.find();
        }
    });

    Template.projectsList.events({
        'click .projectRow': function (event, template) {
            debugger;
            Router.go('detailsProject', {_id: this._id});
        }
    })

    Template.addButton.events({
        'click .btn-floating': function () {
            Router.go('addProject');
        }
    });

    Template.detailsProject.helpers({
        'yo': function () {
            debugger;
        },
        'orders': function () {
            return this.orders();
        },
        'orderFetched': function () {
            if (this.orders().length > 0) {
                return true;
            } else {
                return false;
            }
        }
    });

    Template.nav.rendered = function () {
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false // Displays dropdown below the button
        });

    };

    Template.nav.events({
        'click .logout': function () {
            Meteor.logout();
        },
        'click .tour': function () {
            Router.go('tour');
        }
    });
    Template.detailsProject.events({
        'click .order-link': function () {
            if (Meteor.isCordova) {
                var url = this.link;
                var filename = url.substring(url.lastIndexOf('/') + 1);
                var store = cordova.file.externalRootDirectory + '/Download/';
                var appStart = function () {
                    cordova.plugins.fileOpener2.open(store + filename, 'application/pdf', {
                        error: function (e) {
                            if (e.message.indexOf("Activity not found") > -1) {
                                if (confirm("Sorry, no application available to open this file. Confirm to open with google pdf viewer."))
                                    window.open('https://docs.google.com/viewer?url=' + url, '_system');
                            } else if (e.message.indexOf("File not found") > -1)
                                Materialize.toast("File is missing", 1000);
                            else
                                Materialize.toast("Some error occured", 1000);
                        }
                    });
                };
                window.resolveLocalFileSystemURL(store + filename, appStart, function () {
                    Materialize.toast("Downloading...", 1000);
                    new FileTransfer().download(url, store + filename, appStart, function (err) {
                        Materialize.toast("Some error occurred in downloading file", 1000);
                    });
                });
            }
            else
                window.open(this.link, '_system');
        }
    })
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}