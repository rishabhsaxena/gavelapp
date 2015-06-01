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
	},
  	'orderIds' : {
	    optional: true,
	    type: [String],
	    defaultValue: []
  	}	
});

Projects = new Meteor.Collection('projects');
Projects.attachSchema(projectSchema);

Projects.helpers({
	insertOrders: function(orders){
	    var ids = [];
	    for(var i=0; i<orders.length; i++){
	      orders[i].caseId = this._id;
	      var id = Orders.insert(orders[i]);
	      ids.push(id);
	    }
	    // Do not trigger update event in collection hook. Otherwise results in infinite loop of updates
	    Projects.update({_id: this._id}, {$set: {orderIds: ids}});
  	},
  	orders: function(){
    	return Orders.find({_id: {$in:this.orderIds}}).fetch();
  	}
})

Projects.after.insert(function (userId, doc) {
  	addScraperJob(doc);
});

Projects.after.update(function(id, doc, fieldNames, modifier){
	addScraperJob(doc);
	doc = Projects._transform(doc);
})