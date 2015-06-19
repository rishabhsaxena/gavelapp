Push.addListener('message', function(notification) {
	// Called on every message
	//if you want to add some callbacks upon recieving notifications this is the place

	if (Meteor.isCordova) {
		window.alert = navigator.notification.alert;
	}

	alert(notification.message);


	/*below is an example - not used in app*/
	/*function alertDismissed() {
		NotificationHistory.update({_id: notification.payload.historyId}, {
			$set: {
				"recievedAt": new Date()
			}
		});
	}
	alert(notification.message, alertDismissed , notification.payload.title, "Ok");*/
});