Router.route('/',{
	name : 'projects',
	waitOn : function(){
		return Meteor.subscribe('matters');
	}
});

Router.route('/projects/add',{
	name : 'addProject'
});

Router.route('/projects/:_id',{
	name : 'detailsProject',//,
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
    redirect: '/',
});

// Check if user authenticated
// Router.onRun(function() {
// 	if (!Meteor.user() && this.ready())
//         return this.redirect('/login');
//     else
//     	this.next();
// }, {except: ['signin']}); 