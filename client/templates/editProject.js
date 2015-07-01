Template.editProject.rendered = function() {
   $('select').material_select();
};

Template.editProject.events({
   'submit form': function(event) {
      event.preventDefault();
      Projects.update(
         {_id: this._id},
         {$set:
            {
               'title': event.target.children[0].children[0].children[0].value,
               'ctype': event.target.children[0].children[1].children[0].children[3].value,
               'cno': event.target.children[0].children[2].children[0].value,
               'cyear': event.target.children[0].children[3].children[0].children[3].value,
               'userId': Meteor.userId()
            }
         },
         function(error){
            if (error) {
               alert(error.reason);
            }
         })
      Router.go('projects');
   }
})
