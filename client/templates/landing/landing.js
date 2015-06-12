Template.landing.rendered = function() {
  $('.slider').slider({full_width: true});
};

Template.landing.events({
	'click .myButton' : function(event){
		event.preventDefault();
		Router.go('/login');
	}
})

