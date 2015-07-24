if (Meteor.isClient) {
    Template.addProject.rendered = function () {
        $(function(){
            $('select').material_select();
        });
    };

    Template.addProject.events({
        'submit form': function (event) {
            //debugger;
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
            //debugger;
            Router.go('detailsProject', {_id: this._id});
        }
    });

    Template.addButton.events({
        'click .btn-floating': function () {
            Router.go('addProject');
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}