Template.viewOrderLink.events({
    'click .view-order': function (event, template) {
        Orders.update(this._id, {$set: {viewed: true}});
        pdfCacheOrOpen(this.link);
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