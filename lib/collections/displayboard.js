displayBoardSchema = new SimpleSchema({
	'courtNo' : {
		type: Number,
		optional : false,
		unique: true
	},
	'item': {
		type: String,
		optional: false
	}
});

DisplayBoard = new Meteor.Collection('displayboard')
DisplayBoard.attachSchema(displayBoardSchema);

deleteDisplayBoardItems = function(courtNumbers){
	DisplayBoard.remove({courtNo: {$in: courtNumbers}});
}
insertDisplayBoardItems = function(items){
	for(var i=0,length=items.length;i<length;i++){
		DisplayBoard.insert(items[i]);
	}
}
updateDisplayBoardItems = function(items){
	for(var i=0,length=items.length;i<length;i++){
		DisplayBoard.update({courtNo: items[i].courtNo}, {$set: {item: items[i].item}});
	}
}