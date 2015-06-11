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
	'userId' : {
		type : String,
		optional : true
	}
	
	});

Orders = new Meteor.Collection('orders')
//Orders.attachSchema(orderSchema);