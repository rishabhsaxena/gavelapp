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