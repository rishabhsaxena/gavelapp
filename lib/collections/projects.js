projectSchema = new SimpleSchema({
	'ctype' : {
		type : String
	},
	'cyear' : {
		type : String
	},
	'cno' : {
		type : String
	},
	'title' : {
		type : String
	},
  	'orderIds' : {
	    optional: true,
	    type: [String],
	    defaultValue: []
  	},
  	'userId' : {
  		type : String
  	}
});

Projects = new Meteor.Collection('projects');
Projects.attachSchema(projectSchema);

Projects.helpers({
	insertOrders: function(orders){
	    var ids = [];
	    for(var i=0; i<orders.length; i++){
	      orders[i].caseId = this._id;
	      orders[i].userId = this.userId;
	      orders[i].date = new Date();
	      var id = Orders.insert(orders[i]);
	      ids.push(id);
	    }
	    // Do not trigger update event in collection hook. Otherwise results in infinite loop of updates
	    Projects.update({_id: this._id}, {$set: {orderIds: ids}});
  	},
  	orders: function(){
 		var timeAgoTransform = function(doc){
 			doc.timeAgo = moment(doc.date).fromNow();
 			return doc;
 		}

    		return Orders.find({_id: {$in:this.orderIds}}, {transform: timeAgoTransform}).fetch();
  	},
  	userEmail : function(){
  			console.log('isServer',Meteor.isServer,'isClient',Meteor.isClient);
  			debugger;
  			var user = Meteor.users.findOne({'_id' : this.userId})
	  		if (user.services){
		  		service = _.keys(user.services)[0];
		      	if (service == "google" || service == "facebook"){
			        email = user.services[service].email;
			        return email;
		    	}else{
		    		console.log('isServer:',Meteor.isServer,' isClient:',Meteor.isClient);
		    		return user.emails[0].address;
		    	}
		    }
  	},
  	unreadCount: function(){
  		return Orders.find({_id: {$in:this.orderIds}, 'viewed': false}).count();
  	}
})

Projects.after.insert(function (userId, doc) {
	if(Meteor.isServer)
  		addScraperJob(doc);
  	console.log('client',Meteor.isClient,'server',Meteor.isServer);
});

Projects.after.update(function(id, doc, fieldNames, modifier){
	addScraperJob(doc);
	doc = Projects._transform(doc);
})
