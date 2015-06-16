// TODO: Find a cleaner solution for subscriptions. Probably a cleaner solution.
if(Meteor.isClient)
{
  Deps.autorun(function() {
  if (Meteor.user()) {
    Meteor.subscribe('orders');
    Meteor.subscribe('matters');
  }
  });
}

Router.route('/projects',{
	name : 'projects',
 });

Router.route('/', {
  name: 'home',
  onBeforeAction: function() {
    Router.go('projects');
  }
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

Router.route('/projects/:_id',{
	name : 'detailsProject',
	data : function() {
		return Projects.findOne({'_id' : this.params._id});
	}
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login',
    template: 'login',
    redirect: '/projects',
});

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


Router.onBeforeAction(function() {
  debugger;
  if (! Meteor.userId()) {
    Router.go('/landing');
  } else {
    this.next();
  }
}, {except: ['signin','landing']});
