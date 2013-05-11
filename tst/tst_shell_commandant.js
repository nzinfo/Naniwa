/*
 * Combine Commandant with shell.
 * */

var shell = require('shell');
var Q = require('q');

var Commandant = require('../commandant/builds/commandant');

var exec = require('child_process').exec;


/* typedef command set */
// init commandant
var SceneCommandant = Commandant.define();

// define the command.
var tst_command =  {
    init: function (scope, param) {
        //console.log(JSON.stringify(scope) + ':' + param);
        //console.log('@init');
        return {
            id: 1,
            param: param
        };
    },

    // Allow position to be changed while creating.
    update: function (scope, data, param) {
        /*
         var point = canvas.points[data.id];
         point.x = x;
         point.y = y;
         return point;
         */
        console.log('@update');
        return "update";
    },

    run: function (scope, data) {
        //var point = canvas.points[data.id] = { id: data.id, x: data.x, y: data.y };
        //return point;
        //console.log('@run ' + JSON.stringify(data) );
        //console.log(JSON.stringify(scope)+'ccccc');
        scope._res.cyan('Yes, we can\n');
        return "run"
    },

    undo: function (scope, data) {
        console.log('@undo');
        return "undo";
    }
}

var tst_async_command = {
    init: function (scope, arg) {
        //++counters.init;
        var deferred = Q.defer();

        setTimeout(function () {
            deferred.resolve(arg);
        }, 5);

        return deferred.promise;
    },
    scope: function (scope) {
        //++counters.scope;
        return scope;
    },
    run: function (scope, data) {
        //++counters.run;
        /*
        data.then(function(d) {
            console.log(d + "data is ");
        });
        */

        /* It seems that when init callback is ok, pass the result as type deferred.promise.
         * */
        console.log('@run' + data);

        var deferred = Q.defer();

        setTimeout(function () {
            //console.log( JSON.stringify(data) + scope.data);
            //console.log("ccc" + data);
            scope.data = data + 10;
            //scope.data = 10000; //NOTE: the scope.data will be passed as the parameter of callback `then`.  -> via resolve ?
            deferred.resolve(scope.data);
        }, 5);

        return deferred.promise;
    },
    update: function (scope, prev, data) {
        return Q.all([this.undo(scope, prev), this.run(scope, data)])
            .then(function () {
                console.log('runs here\n');
                return data;
            });
    },
    undo: function (scope, data) {
        //++counters.undo;
        scope.data -= data + 10;
    }
}


SceneCommandant.register('POINT_ADD', tst_command);
SceneCommandant.register('POINT_INC', tst_async_command);

/* end of typedef */

var my_scene = {points: {}, id_counter: 0, mytst:'abc'};
var keen = new SceneCommandant(my_scene);

if(false) // manual execute command.
{
    var rs = keen.execute('POINT_ADD', 10);
    process.exit(0);
}

// Initialization
var app = new shell( {prompt:'naniwa:>'} )

// bind data content
app._commandar = keen; //the inner command processor
app.scope = my_scene;  // the data content

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

app.cmd('tst :param', function(req, res, next){
    /*
     * The sync version of execute command
     * */
    console.log(req.params);
    // bind res  -> you can switch to different object by switch _commandar. _commandar is an access agent of scope.
    app.scope._res = res; //FIXME: in realworld, commands do NOT needs _res, use this bind just for convenience.
    // params: system define the connection of parameters pass into command; param = the data user input.
    var rs = app._commandar.execute('POINT_ADD', req.params.param );
    next();
});

app.cmd('tsta :param', function(req, res, next){
    /*
     * The async version of execute command -> experiment feature!!!
     * */
    console.log(req.params);
    // bind res  -> you can switch to different object by switch _commandar. _commandar is an access agent of scope.
    app.scope._res = res; //FIXME: in realworld, commands do NOT needs _res, use this bind just for convenience.
    // params: system define the connection of parameters pass into command; param = the data user input.
    var pdata = req.params.param;  // should have a typecast in real world.

    //pdata = 110;
    pdata = parseInt(pdata);

    var rs = app._commandar.execute('POINT_INC', pdata ).then(function (d) {
        //console.log('do what?' + JSON.stringify(type(d)));
        console.log(typeof(d) + d);
        next();
    });
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


app.configure(function() {
    app.use(shell.help({shell: app, introduction: true}));
});

/* execute a command manually.  */
app.run('user 501');

/* end of file */