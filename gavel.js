if (Meteor.isClient) {

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
      debugger;
      event.preventDefault();
      Projects.insert({
        'title' : event.target.children[0].children[0].children[0].value,
        'ctype' : event.target.children[0].children[1].children[0].children[3].value,
        'cnum' : event.target.children[0].children[2].children[0].value,
        'cyear' : event.target.children[0].children[3].children[0].children[3].value,
        'userId' : Meteor.userId()
      });
      Router.go('projects');
    }
  }); 

  Template.projectsList.helpers({
    'projects' : function(){
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
    },
    'orders' : function(){
      return this.orders();
    },
    'orderFetched' : function(){
      if (this.orders().length > 0){
        return true;
      }else{
        return false;
      }
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

  Template.nav.events({
    'click .logout' : function(e){
      e.preventDefault();
      AccountsTemplates.logout();
    },
    'click .tour' : function(){
      Router.go('tour');
    }
  }) 
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}







