//Config
var port = 3009;
var discreet = false;
var debug = true;
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

  /**
  * find  */
  socket.on('find',(coll, q, opt, ack) => {
    welcome('find',coll, q, opt, ack)

    if(ack == null) return handlErr(0,'find',socket)

    if(coll == null) return handlErr(1,'find',socket,ack)

    else regina.get(coll).find(q,opt).then((docs) => {
      reply('find',ack,null,docs)
    })
    //end : socket.on('find
  });


  /**
  * findOne  */
  socket.on('findOne',(coll, q, opt, ack) => {
    welcome('findOne',coll, q, opt, ack)

    if(ack == null) return handlErr(0,'findOne',socket)

    if(coll == null) return handlErr(1,'findOne',socket,ack)

    else regina.get(coll).findOne(q,opt).then((docs) => {
      reply('findOne',ack,null,docs)
    })
    //end : socket.on('findOne
  });


  /**
  * insert  */
  socket.on('insert',(coll, docs, opt, ack) => {
    welcome('insert',coll, docs, opt, ack)

    if(ack == null) return handlErr(0,'insert',socket)

    if(coll == null) return handlErr(1,'insert',socket,ack)

    if(docs == null) return handlErr(2,'insert',socket,ack)

    else regina.get(coll).insert(docs,opt).then((res) => {
      reply('insert',ack,null,res)
    })
    //end : socket.on('insert
  });


  /**
  * update  */
  socket.on('update',(coll, q, u, opt, ack) => {
    welcome('update',coll, q, opt, ack, u)

    if(ack == null) return handlErr(0,'update',socket)

    if(coll == null) return handlErr(1,'update',socket,ack)

    if(q == null) return handlErr(3,'update',socket,ack)

    if(u == null) return handlErr(4,'update',socket,ack)


    else regina.get(coll).update(q,u,opt).then((res) => {
      reply('update',ack,null,res)
    })
    //end : socket.on('update
  });




  //end : io.sockets.on('connection'
});




//utilities
const reply=(f,ack,err,res)=>{
  ack(err,res);
  if(debug)console.log("<- '"+f+"'","replied :[\n",err,res,"\n]")
}

const handlErr = (code, f, socket, ack)=>{
  switch(code) {
    case 0: noack(socket,f); break;
    case 1: ack({error : "'coll' is undefined on '"+f+"'"}); break;
    case 2: ack({error : "'docs' is undefined on '"+f+"'"}); break;
    case 3: ack({error : "'q' is undefined on '"+f+"'"}); break;
    case 4: ack({error : "'u' is undefined on '"+f+"'"}); break;

    default: break;
  }
}

const noack = (socket,f)=>{
  socket.emit('regina warning',"Warning : use of undefined 'ack' callback on '"+f+"'");
}

const welcome = (f,coll,x,opt,ack,u) =>{
  console.log("-> '"+f+"' received :[\n",coll,x,opt,ack,u,"\n]"); //debug
}

const soften = (obj) => {
  return obj == null ? {} : obj;
}



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
