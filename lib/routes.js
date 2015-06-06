Router.route('/projects',{
	name : 'projects',
	waitOn : function(){
    if (Meteor.userId()){
      return Meteor.subscribe('matters');
    }		
	}
});

Router.route('/', function () {
  this.render('projects');
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

Router.onBeforeAction(function() {
  debugger;
  if (! Meteor.userId()) {
    Router.go('/login');
  } else {
    this.next();
  }
}, {except: ['signin']});