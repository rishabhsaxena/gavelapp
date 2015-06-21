orderSchema = new SimpleSchema({
	'link' : {
		type: String,
		optional : true,
		label : 'Name'
	},
	'caseId' : {
		type : String,
		label : 'case',
		optional : true
	},
	'viewed': {
		type: Boolean,
		defaultValue: false
	},
	'userId' : {
		type : String,
		optional : true
	},
	'date': {
		type: Date
	}
	
	});

Orders = new Meteor.Collection('orders')
Orders.attachSchema(orderSchema);