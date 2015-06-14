Router.route('/projects',{
	name : 'projects',
  waitOn : function(){
    if (Meteor.userId()){
      return Meteor.subscribe('matters');
    }
	}
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
	waitOn : function(){
		return [Meteor.subscribe('orders'),Meteor.subscribe('matters')];
	},
	data : function() {
		return Projects.findOne({'_id' : this.params._id});
	}
});

Router.route('/login', {
  name: 'signin',
  template: 'login'
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


Router.onBeforeAction(function() {
  // debugger;
  if (! Meteor.userId()) {
    Router.go('/landing');
  } else {
    this.next();
  }
}, {except: ['signin','landing']});
