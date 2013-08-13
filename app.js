
/**
 * Module dependencies.
 * Test Commit
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , MongoClient = require('mongodb').MongoClient
  , connection_string = 'mongodb://mitb_user:mitb1234@ds039088.mongolab.com:39088/mitb_todos';

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
    
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var todo_collection;
MongoClient.connect(connection_string, function(err, db) {
    todo_collection = db.collection('todos');
});

app.param('id', function(req, res, next, id){
    todo_collection.findOne({
        id: parseFloat(id)
    }, function(err, todo) {
        if (err) {
            next(err);
        } else if (todo) {
            req.todo = todo;
        next();
        } else {
            next(new Error('failed to load todo'));
        }
    });
});
    
app.get('/', function (req, res) {
  res.redirect('/index.html');
});
app.get('/users', user.list);
    
app.get('/todos', function(req, res) {
    todo_collection.find().toArray(function(err, todos) {
        if (!err) {
            res.json(todos);
        } else {
            res.json([]);
        }
    });
});

app.post('/todos', function(req, res) {
    todo_collection.insert({
        title: req.body.title,
        completed: req.body.completed,
        id: req.body.id
    }, {
        w: 1
    }, function(err, result) {
        if (!err) {
            res.json({
                result: 'success'
            });
        } else {
            res.json({
                result: 'failed',
                error: err
            });
        }
    });
});
    
app.delete('/todos/:id', function(req, res) {
    var todo = req.todo;
    todo_collection.findAndRemove(todo, [['id', 1]], function(err, doc) {
        if (!err) {
            res.json({
                result: 'success'
            });
        } else {
            res.json({
                result: 'failed',
                error: err
            });
        }
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;