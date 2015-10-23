// TODO: Find a cleaner solution for subscriptions. Probably a cleaner solution.
if(Meteor.isClient)
{
  Deps.autorun(function() {
  if (Meteor.user()) {
    Meteor.subscribe('orders');
    Meteor.subscribe('matters');
    Meteor.subscribe('causelists');
    Meteor.subscribe('displayboard');
  }
  });
}

Router.route('/',{
	name : 'projects',
 });

Router.route('/tour', {
  name: 'tour'
});

Router.route('/landing', {
  name: 'landing'
});

Router.route('/projects/add',{
	name : 'addProject'
});

Router.route('/displayboard', {
  name: 'displayBoard'
});

Router.route('/projects/edit/:_id',{
	name : 'editProject',
   // waitOn: function() {
   //    return Meteor.subscribe('matters')
   // },
	data : function() {
      //debugger;
      console.log(Projects.findOne({'_id' : this.params._id}));
      window.pj = Projects.findOne({'_id' : this.params._id});
		return pj;
	}
});

Router.route('/login', {
  name: 'signin',
  template: 'login',
  onBeforeAction: function(){
    if(Meteor.user() && !Meteor.loggingIn())
      Router.go('projects');
    else
      this.next();
  }
})
// AccountsTemplates.configureRoute('signIn', {
//     name: 'signin',
//     path: '/login',
//     template: 'login',
//     redirect: '/projects',
// });

// TODO: Remove this _init call
//AccountsTemplates._init();

// // // Check if user authenticated
// Router.onRun(function() {
//   if (!Meteor.user() && this.ready())
//     return this.redirect('/login');
//   this.next();
// }, {except: ['/login']});
Router.configure({
  'loadingTemplate': 'loading'
});

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('landing');
  } else {
    this.next();
  }
};


Router.onBeforeAction(mustBeSignedIn, {except: ['signin','landing']});
