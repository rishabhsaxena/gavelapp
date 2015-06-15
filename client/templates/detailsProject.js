Template.viewOrderLink.events({
	'click .view-order': function(event, template){
		Orders.update(this._id, {$set: {viewed: true}});
		window.open('https://docs.google.com/viewer?url='+this.link, '_system');
	}
});