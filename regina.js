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

//internal machinery
var R = require('./R')
var Role = require('./Role')
var utils = require('./utils')
var compiler = require('./compiler')



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
  socket.on(R.find.toString,(coll, q, opt, meta, ack) => {
    if(!compiler.isValidACK(ack)) 
      return emitNoackCallbackError(socket);
    
    let status = compiler.check(
      R.find.toString,[
        { val : coll, role : Role.coll },
        { val : q, role : Role.q },
        { val : opt, role : Role.opt },
        { val : meta, role : Role.meta },
        { val : ack, role : Role.ack }
      ]);
      
      if(!status.valid)
        return reply(R.find.toString,ack,status.error)
      
      regina.get(coll).find(q,opt)
      .then((res) => {
        reply(R.find.toString,ack,null,res)
        //  ||
        notifyFollowers(
          R.find.toCRUD,socket,res,
          {"coll":coll,"q":q,"opt":opt,"meta":meta}
        )
      }).catch((e) =>{
        reply(R.find.toString,ack,e)
      });
      //end : socket.on('find
    });
    





    
    /**
    * count  */
    socket.on(R.count.toString,(coll, q, opt, meta, ack) => {
      if(!compiler.isValidACK(ack)) 
        return emitNoackCallbackError(socket);
      
      let status = compiler.check(
        R.count.toString,[
          { val : coll, role : Role.coll },
          { val : q, role : Role.q },
          { val : opt, role : Role.opt },
          { val : meta, role : Role.meta },
          { val : ack, role : Role.ack }
        ]
      );
      
      if(!status.valid)
        return reply(R.count.toString,ack,status.error)    
      
      regina.get(coll).count(q,opt)
      .then((res) => {
        reply(R.count.toString,ack,null,res)
        //  ||
        notifyFollowers(
          R.count.toCRUD,socket,res,
          {"coll":coll,"q":q,"opt":opt,"meta":meta}
        )
      }).catch((e) =>{
        reply(R.count.toString,ack,e)
      });
      //end : socket.on('count
    });
    
    





    /**
    * insert  */
    socket.on(R.insert.toString,(coll, docs, opt, meta, ack) => {
      if(!compiler.isValidACK(ack)) 
        return emitNoackCallbackError(socket);
      
      let status = compiler.check(
        R.insert.toString,[
          { val : coll, role : Role.coll },
          { val : docs, role : Role.docs },
          { val : opt, role : Role.opt },
          { val : meta, role : Role.meta },
          { val : ack, role : Role.ack }
        ]
      );
      
      if(!status.valid)
        return reply(R.insert.toString,ack,status.error)
      
      regina.get(coll).insert(docs,opt)
      .then((res) => {
        reply(R.insert.toString,ack,null,res)
        //  ||
        notifyFollowers(
          R.insert.toCRUD,socket,res,
          {"coll":coll,"docs":docs,"opt":opt,"meta":meta}
        )
      }).catch((e) =>{
        reply(R.insert.toString,ack,e)
      });
      //end : socket.on('insert
    });
    
    





    /**
    * update  */
    socket.on(R.update.toString,(coll, q, u, opt, meta, ack) => {
      if(!compiler.isValidACK(ack)) 
        return emitNoackCallbackError(socket);

      let status = compiler.check(
        R.update.toString,[
          { val : coll, role : Role.coll },
          { val : q, role : Role.q },
          { val : u, role : Role.u },
          { val : opt, role : Role.opt },
          { val : meta, role : Role.meta },
          { val : ack, role : Role.ack }
        ]
      );
      
      if(!status.valid)
        return reply(R.update.toString,ack,status.error)
      
      regina.get(coll).update(q,u,opt)
      .then((res) => {
        reply(R.update.toString,ack,null,res)
        //  ||
        notifyFollowers(
          R.update.toCRUD,socket,res,
          {"coll":coll,"q":q,"u":u,"opt":opt,"meta":meta}
        )
      }).catch((e) =>{
        reply(R.update.toString,ack,e)
      });
      //end : socket.on('update
    });
    





    
    /**
    * remove  */
    socket.on(R.remove.toString,(coll, q, opt, meta, ack) => {
      if(!compiler.isValidACK(ack)) 
        return emitNoackCallbackError(socket);

      let status = compiler.check(
        R.remove.toString,[
          { val : coll, role : Role.coll },
          { val : q, role : Role.q },
          { val : opt, role : Role.opt },
          { val : meta, role : Role.meta },
          { val : ack, role : Role.ack }
        ]
      );
      
      if(!status.valid)
        return reply(R.remove.toString,ack,status.error)
       
      regina.get(coll).remove(q,opt)
      .then((res) => {
        reply(R.remove.toString,ack,null,res)
        //  ||
        notifyFollowers(
          R.remove.toCRUD,socket,res,
          {"coll":coll,"q":q,"opt":opt,"meta":meta}
        )
      }).catch((e) =>{
        reply(R.remove.toString,ack,e)
      });
      //end : socket.on('remove
    });
    
    
    //end : io.on('connection'
  });
  
  
  
  
  //utilities
  const reply=(method,ack,err,res) => {
    ack(err,res);
    if(debug)
      console.log("<- '"+method+"'","replied :[\n",err,res,"\n]")
  }
  
  
  /**
  * It is not important to execute notifyFollowers before the reply's callback.
  * We are already sure that the result of the write action is ready */
  const notifyFollowers = (op,socket,res,ctx) => {
    let meta = ctx.meta
    if(isTaged(meta))
      socket.broadcast.emit(meta.tag,op,res,ctx);
  }
  
  
  const emitNoackCallbackError = (socket) => {
    socket.emit(
      'regina_noack_callback_error',
      "Error : no ack callback provided. "
      +"Can't send request acknoledgement : request canceled."
    );
  }
  
  
  const isTaged = (meta) => {
    console.log("isTaged0",typeof(meta)); //debug TODO rem in prod
    if(typeof(meta) !== 'object') return false
      console.log("isTaged1",utils.soften(meta).tag != null);
    return utils.soften(meta).tag != null //debug TODO rem in prod
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
  