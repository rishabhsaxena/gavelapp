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
	templateGestures: {
		'swipeleft li' : function(event, templateInstance) {
			if(confirm("Confirm Delete?")) {
				Projects.remove(this._id);
				Materialize.toast('<span>Project Deleted</span>', 5000);
			}
		}
	}
});

Template.collapseList.rendered = function(event) {
	$('.collapsible').collapsible();
};

// Template.collapseList.rendered = function(event) {
// 	$("li").on("swipe", function(event) {
// 		if(confirm("Confirm Delete?")) {
// 			Projects.remove(this._id);
// 			Materialize.toast('<span>Project Deleted</span>', 5000);
// 		}
// 	})
// }
