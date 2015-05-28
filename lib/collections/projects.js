projectSchema = new SimpleSchema({
	'ctype' : {
		type : String
	},
	'cyear' : {
		type : Number
	},
	'cnum' : {
		type : Number
	},
	'title' : {
		type : String
	}	
});

Projects = new Meteor.Collection('projects');
//Projects.attachSchema(projectSchema);