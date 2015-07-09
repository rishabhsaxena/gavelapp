Template.collapseList.helpers({
	// unreadCount: function(){
	// 	return this.unreadCount();
	// },
	orders: function(){
		return this.orders();
	},
	countunread: function() {
		if(this.unreadCount !== 0) {
			return this.unreadCount();
		}
		else{
			return false;
		}
	},
});

Template.collapseList.rendered = function() {
	$('.collapsible').collapsible();
}

Template.collapseList.events({
    'click .delete': function (event) {
    	if(confirm("Confirm Delete?")) {
			Projects.remove(this._id);
			Materialize.toast('Project Deleted!', 4000);
		}
	},
	'click .collapse': function(event) {
   	event.stopPropagation();
	}
});
