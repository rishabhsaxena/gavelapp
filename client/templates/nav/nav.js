Template.nav.rendered = function () {
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
    });

};
Template.nav.events({
    'click .logout': function () {
        Meteor.logout();
    },
    'click .tour': function () {
        Router.go('tour');
    },
    'click .causelist': function () {
        var causelist = CauseLists.findOne();
        if(causelist)
            pdfCacheOrOpen(causelist.link);
        else
            Materialize.toast('Sorry no link is available at this moment!', 2000);
    }
});