Template.viewOrderLink.events({
    'click .view-order': function (event, template) {
        Orders.update(this._id, {$set: {viewed: true}});
        var url = this.link;
        if (url.split('.').slice(-1)[0].toLowerCase() == 'pdf') {
            if (Meteor.isCordova) {
                var filename = url.substring(url.lastIndexOf('/') + 1);
                var store = cordova.file.externalRootDirectory + '/Download/';
                var appStart = function () {
                    cordova.plugins.fileOpener2.open(store + filename, 'application/pdf', {
                        error: function (e) {
                            if (e.message.indexOf("Activity not found") > -1) {
                                if (confirm("Sorry, no application available to open this file. Confirm to open with google pdf viewer.")) {
                                    window.open('https://docs.google.com/viewer?url=' + url, '_system');
                                }
                            } else if (e.message.indexOf("File not found") > -1) {
                                Materialize.toast("File is missing", 1000);
                            }
                            else {
                                Materialize.toast("Some error occured", 1000);
                            }
                        }
                    });
                };
                window.resolveLocalFileSystemURL(store + filename, appStart, function () {
                    Materialize.toast("Downloading...", 1000);
                    new FileTransfer().download(url, store + filename, appStart, function (err) {
                        Materialize.toast("Some error occurred in downloading file", 1000);
                    });
                });
            }
            else {
                window.open('https://docs.google.com/viewer?url=' + url, '_system');
            }
        }
        else {
            window.open(url);
        }
    }
});

Template.orderWidget.helpers({
    'yo': function () {
        debugger;
    },
    'orders': function () {
        return this.orders();
    },
    'orderFetched': function () {
        if (this.orders().length > 0) {
            return true;
        } else {
            return false;
        }
    }
});