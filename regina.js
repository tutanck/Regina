//Config
var port = 3009;
var discreet = false;
var db = 'localhost:27017/reginadb'; //TODO : configurable

//express http server
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//mongo stuffs
var mongo = require('mongodb');
var monk = require('monk');

//regina
var regina = monk(db); //database handler

//Home page //TODO
app
.get('/', function(req, res){
  res.sendfile(discreet ? 'index.html' : 'index.html'); //TODO : discreet.html(white page)
});


io.sockets.on('connection', function (socket) {

  /*
  * Find
  */
  socket.on('find',(coll, q, opt, ack) => {
    console.log("* find request received :[\n",coll,q,opt,ack,"\n]"); //debug

    if(ack == null){
      return noack(socket);
    }
    if(coll == null){
      return ack({
        error : "'coll' is undefined"
      });
    }
    else
    regina.get(coll).find(q,opt).then((docs) => {
      console.log(docs)
      ack(null,docs);
    })
    //end : socket.on('find'
  });





  //end : io.sockets.on('connection'
});



const soften = (obj) => {
  return obj == null ? {} : obj;
}

const noack = (socket)=>{
  socket.emit('regina warning',"Warning : use of undefined 'ack' function on 'find'");
}

/*app
.get('/find/:coll/:q/:opt', function(req, res) {
regina.get(req.params.coll)
.find(JSON.parse(req.params.q),JSON.parse(req.params.opt))
.then((docs) => {
res.json(docs);
})
})
;*/





/*
* FindOne
*
regina
.get('/findone/:coll', function(req, res) {
db.get(req.params.coll)
.findOne({})
.then((docs) => {
res.json(docs);
})
})
.get('/findone/:coll/:q', function(req, res) {
db.get(req.params.coll)
.findOne(JSON.parse(req.params.q))
.then((docs) => {
res.json(docs);
})
})
.get('/findone/:coll/:q/:opt', function(req, res) {
db.get(req.params.coll)
.findOne(JSON.parse(req.params.q),JSON.parse(req.params.opt))
.then((docs) => {
res.json(docs);
})
})
;



/*
* Insert
*
regina
.post('/insert/:coll', function(req, res) {
db.get(req.params.coll)
.insert(req.body.docs,req.body.opt === undefined ?{} : req.body.opt)
.then((docs) => {
res.setHeader('Content-Type', 'text/plain');
res.send(200, 'OK!');
})
})
;
*/




app
.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.send(404, 'Not Found !'); //TODO : 404.html
});


server
.listen(port, function(){
  console.log("Regina is ready to talk with MongoDB about '"+db+"' on port '"+port+"' !");
});
