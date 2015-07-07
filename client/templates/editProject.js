Template.editProject.rendered = function() {
   // debugger;
   console.log('test');
   $('select').material_select();
};

Template.editProject.events({
   'submit form': function(event) {
      event.preventDefault();
      Projects.update(
         {_id: this._id},
         {$set:
            {
               'title': $(event.target).find('[name=case_title]').val(),
               'ctype': $(event.target).find('[name=case_type]').val(),
               'cno': $(event.target).find('[name=case_number]').val(),
               'cyear': $(event.target).find('[name=case_year]').val(),
               'userId': Meteor.userId()
            }
         },
         function(error){
            if (error) {
               alert(error.reason);
            }
         }
      )
      Router.go('projects');
   }
})
