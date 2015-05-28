Router.route('/',{
	name : 'projects'
});

Router.route('/projects/add',{
	name : 'addProject'
});

Router.route('/projects/:_id',{
	 name : 'detailsProject',//,
	// waitOn : function(){
	// 	return Projects.find({'_id' : this.params._id});
	// }
	data : function() {
		return Projects.findOne({'_id' : this.params._id});
	}
});