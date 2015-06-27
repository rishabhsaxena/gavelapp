// Sample helper to insert multiple projects to run and test scraper with
insertProjects = function(n){
    var projectData = {
        ctype: 'FAO(OS)',
        cno: '34',
        cyear: '2015',
        userId: 'dqKi4v74ahZ8gSKK7'
    };

    for(var i=0; i<=n; i++){
        projectData.title = i+'';
        Projects.insert(projectData)
    }
}

removeAllProjects = function(){
    var projects = Projects.find().fetch()
    var pjs = _.map(projects, function(p){return p._id})
    _.each(pjs, function(id){Projects.remove(id)})
}