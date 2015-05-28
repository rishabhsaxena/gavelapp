if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.nav.rendered = function() {
    // Initialize collapse button
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    //$('.collapsible').collapsible();
  }

  Template.addProject.rendered = function(){
    $('select').material_select();
  }

  Template.addProject.events({
    'submit form': function( event ){
      event.preventDefault();
      Projects.insert({
        'title' : event.target.children[0].children[0].children[1].value,
        'ctype' : event.target.children[0].children[1].children[0].children[3].value,
        'cnum' : event.target.children[0].children[2].children[1].value,
        'cyear' : event.target.children[0].children[3].children[0].children[3].value
      });
      Router.go('projects');
    }
  }); 

  Template.projectsList.helpers({
    'projects' : function(){
      debugger;
      return Projects.find();
    }
  });

  Template.projectsList.events({
    'click .projectRow' : function(event, template){
      debugger;
      Router.go('detailsProject',{_id: this._id});     
    }
  })

  Template.addButton.events({
    'click .btn-floating' : function(){
      Router.go('addProject');
    }
  });

  Template.detailsProject.helpers({
    'yo' : function(){
      debugger;
    }
  });

  Template.nav.rendered = function() { 
      $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false // Displays dropdown below the button
      });
      
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}




