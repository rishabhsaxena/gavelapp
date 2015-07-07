if (Meteor.isClient) {
    Template.nav.rendered = function () {
        // Initialize collapse button
        $(".button-collapse").sideNav();
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        //$('.collapsible').collapsible();
    };

    Template.addProject.rendered = function () {
        $(function(){
            $('select').material_select();    
        });
    };

    Template.addProject.events({
        'submit form': function (event) {
            debugger;
            event.preventDefault();
            Projects.insert({
                'title': $(event.target).find('[name=case_title]').val(),
                'ctype': $(event.target).find('[name=case_type]').val(),
                'cno': $(event.target).find('[name=case_number]').val(),
                'cyear': $(event.target).find('[name=case_year]').val(),
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
    });

    Template.addButton.events({
        'click .btn-floating': function () {
            Router.go('addProject');
        }
    });

    Template.nav.rendered = function () {
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
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
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
