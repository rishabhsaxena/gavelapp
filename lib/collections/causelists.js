causeListSchema = new SimpleSchema({
	'link' : {
		type: String,
		optional : true,
		label : 'Name'
	},
	'date': {
		type: Date
	}
	});

CauseLists = new Meteor.Collection('causelists')
CauseLists.attachSchema(causeListSchema);

upsertCauseList = function(causeList) {
	var oldCauseList = CauseLists.findOne();
	if(oldCauseList)
		CauseLists.update(oldCauseList._id, {$set: causeList});
	else
		CauseLists.insert(causeList);
}