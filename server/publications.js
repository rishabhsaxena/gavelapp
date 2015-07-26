  Meteor.publish("matters", function () {
  	if(this.userId)
    	return Projects.find({'userId' : this.userId});
  });

  Meteor.publish("orders",function() {
  	return Orders.find({'userId' : this.userId});
  });

  Meteor.publish("causelists",function() {
  	return CauseLists.find({});
  });

  Meteor.publish("displayboard", function() {
  	return DisplayBoard.find({});
  })