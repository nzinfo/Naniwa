var shell = require('shell');

var exec = require('child_process').exec;


// Initialization
var app = new shell( {prompt:'naniwa:>'} )

var auth = function(req, res, next){
    /*
    if(req.params.uid == process.getuid()){
        next()
    }else{
        throw new Error('Not me');
    }
    */
    next();
}

app.configure(function() {
    /*
    app.use(function(req, res, next){
        //app.client = require('redis').createClient()
        next()
    });
    */
    app.use(shell.history({shell: app}));
    app.use(shell.completer({shell: app}));
    app.use(shell.router({ shell: app }));
    app.use(shell.help({shell: app, introduction: true}));
});

/*
app.configure('prod', function() {
    app.set('title', 'Production Mode');
});
*/

// Global parameter substitution -> do the job in command dispatch. if input is :uid, give a username
app.param('uid', function(req, res, next){
    exec('whoami', function(err, stdout, sdterr){
        req.params.username = stdout;
        next();
    });
});


app.cmd('whoami', function(req, res, next){
    res.cyan('Run this command `./ami user ' + process.getuid() + '`\n');
    next();
});

// Command with parameter
app.cmd('user :uid', auth, function(req, res, next){
    res.cyan('Yes, you are ' + req.params.username +'\n');
    //res.prompt();
    next();
});

app.on('quit', function(){
    // app.client.quit();
    console.log('quiting.');
});
/* end of file */