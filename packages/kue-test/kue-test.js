// Write your package code here!

var kue = Meteor.npmRequire ('kue');

Queue  = kue.createQueue();

kue.app.listen(3003);

Queue.on( 'error', function( err ) {
  console.log( 'Oops... ', err );
});

Queue.process('testJob',function(job, callback){
    //
    sendMail.call(this, job, callback);

});


var emailData = {
    to : 'akshay.kmr@outlook.com',
    from : 'noreply@cloudvakil.com',
    subject : 'please work',
    htmlText : '<h1>Hello !</h1> <br> <p>this works </p>'
};

var testJob = Queue.create('testJob', emailData )
              .save(function (err){
                if(err)
                    console.log(err);
                else
                    console.log(testJob.id);

              });

testJob.on('complete', function(result){
console.log('Job completed with data ', result);

}).on('failed attempt', function(errorMessage, doneAttempts){
console.log('Job failed',errorMessage);

}).on('failed', function(errorMessage){
console.log('Job failed',errorMessage);

});



sendMail = Meteor.bindEnvironment(function(job , callback){

    var result = {};

    Meteor.Mandrill.config({
        username: "thegreatshasha@gmail.com",
        key: "2hd3_l9CBJE5Q-DR5QG5RA"
    });

     debugger;
    console.log(job.data);

    console.log(Projects.find({}).count());

    // 
    var status = Meteor.Mandrill.send({
       to: job.data.to,
       from: job.data.fromEmail,
       subject: job.data.subject,
       html: job.data.htmlText
    });


    console.log('status:', status)

    if (status && status.statusCode == 200) {
        /*log.info("Sent email successfully");
        job.log("Sent successfully");
        job.done();*/
        result.status = 'email sent successfully!';
    }
    else {
        /*log.error("Sending email failed");
        job.log("Sending email failed", {
            level: 'warning'
        });
        job.fail("sending email failed");*/
        result.status=false;
    }


    if(!result.status)
        callback(new Error('mail send failure!'));
    else    
        callback(null, result);
});