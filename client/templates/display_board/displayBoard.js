Template.displayBoard.helpers({
	'courtItems': function(){
		return DisplayBoard.find({}, {sort: {courtNo: 1}});
	}
})