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


io.on('connection', function (socket) {
  console.log('Regina : socket \''+socket.id+'\' just connected');

  socket.on('disconnect', function(){
    console.log('Regina : socket \''+socket.id+'\' just disconnected');
  });

  /**
  * find  */
  socket.on('find',(coll, q, opt, meta, ack) => {
    welcome('find',coll, q, opt, ack)

    if(ack == null) return handlErr(0,'find',socket)

    if(coll == null) return handlErr(1,'find',socket,ack)

    regina.get(coll).find(q,opt)
    .then((docs) => {
      reply('find',ack,null,docs)
      //  ||
      notifyFollowers(
        0,meta,socket,docs,
        {"coll":coll,"q":q,"opt":opt,"meta":meta}
      )
    }).catch((e) =>{
      reply('find',ack,e)
    });
    //end : socket.on('find
  });


  /**
  * count  */
  socket.on('count',(coll, q, opt, meta, ack) => {
    welcome('count',coll, q, opt, ack)

    if(ack == null) return handlErr(0,'count',socket)

    if(coll == null) return handlErr(1,'count',socket,ack)

    regina.get(coll).count(q,opt)
    .then((res) => {
      reply('count',ack,null,res)
      //  ||
      notifyFollowers(
        0,meta,socket,res,
        {"coll":coll,"q":q,"opt":opt,"meta":meta}
      )
    }).catch((e) =>{
      reply('count',ack,e)
    });
    //end : socket.on('count
  });


  /**
  * insert  */
  socket.on('insert',(coll, docs, opt, meta, ack) => {
    welcome('insert',coll, docs, opt, ack)

    if(ack == null) return handlErr(0,'insert',socket)

    if(coll == null) return handlErr(1,'insert',socket,ack)

    if(docs == null) return handlErr(2,'insert',socket,ack)

    regina.get(coll).insert(docs,opt)
    .then((res) => {
      reply('insert',ack,null,res)
      //  ||
      notifyFollowers(
        1,meta,socket,res,
        {"coll":coll,"docs":docs,"opt":opt,"meta":meta}
      )
    }).catch((e) =>{
      reply('insert',ack,e)
    });
    //end : socket.on('insert
  });


  /**
  * update  */
  socket.on('update',(coll, q, u, opt, meta, ack) => {
    welcome('update',coll, q, opt, ack, u)

    if(ack == null) return handlErr(0,'update',socket)

    if(coll == null) return handlErr(1,'update',socket,ack)

    if(q == null) return handlErr(3,'update',socket,ack)

    if(u == null) return handlErr(4,'update',socket,ack)

    regina.get(coll).update(q,u,opt)
    .then((res) => {
      reply('update',ack,null,res)
      //  ||
      notifyFollowers(
        2,meta,socket,res,
        {"coll":coll,"q":q,"u":u,"opt":opt,"meta":meta}
      )
    }).catch((e) =>{
      reply('update',ack,e)
    });
    //end : socket.on('update
  });


  /**
  * remove  */
  socket.on('remove',(coll, q, opt, meta, ack) => {
    welcome('remove',coll, q, opt, ack)

    if(ack == null) return handlErr(0,'remove',socket)

    if(coll == null) return handlErr(1,'remove',socket,ack)

    if(q == null) return handlErr(3,'remove',socket,ack)

    regina.get(coll).remove(q,opt)
    .then((res) => {
      reply('remove',ack,null,res)
      //  ||
      notifyFollowers(
        -1,meta,socket,res,
        {"coll":coll,"q":q,"opt":opt,"meta":meta}
      )
    }).catch((e) =>{
      reply('remove',ack,e)
    });
    //end : socket.on('remove
  });


  //end : io.on('connection'
});




//utilities
const reply=(f,ack,err,res) => {
  ack(err,res);
  if(debug)console.log("<- '"+f+"'","replied :[\n",err,res,"\n]")
}

const handlErr = (code, f, socket, ack) => {
  switch(code) {
    case 0: noack(socket,f); break;
    case 1: ack({error : "'coll' is undefined on '"+f+"'"}); break;
    case 2: ack({error : "'docs' is undefined on '"+f+"'"}); break;
    case 3: ack({error : "'q' is undefined on '"+f+"'"}); break;
    case 4: ack({error : "'u' is undefined on '"+f+"'"}); break;

    default: break;
  }
}


/**
* It is not important to execute notifyFollowers before the reply's callback.
* We are already sure that the result of the write action is ready */
const notifyFollowers = (action,meta,socket,res,ctx) => {
  if(isTaged(meta))
  socket.broadcast.emit(meta.tag,action,res,ctx);
}

const isTaged = (meta) => {
  console.log("isTaged0",typeof(meta)); //debug TODO rem in prod
  if(typeof(meta) !== 'object') return false
  console.log("isTaged1",soften(meta).tag != null);
  return soften(meta).tag != null //debug TODO rem in prod
}

const noack = (socket,f) => {
  socket.emit('warning',"Warning : use of undefined 'ack' callback on '"+f+"'");
}

const welcome = (f,coll,x,opt,ack,u) => {
  console.log("-> '"+f+"' received :[\n",coll,x,opt,ack,u,"\n]"); //debug
}

const soften = (obj) => {
  return obj == null ? {} : obj;
}



//server config

app
.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.send(404, 'Not Found !'); //TODO : 404.html
});


server
.listen(port, function(){
  console.log("Regina is ready to talk with MongoDB about '"+db+"' on port '"+port+"' !");
});
