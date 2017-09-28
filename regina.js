#!/usr/bin/env node

//Config
var discreet = false;
var debug = true;

var db = process.argv[2]?process.argv[2]:'localhost:27017/reginadb';
var port = process.argv[3]?process.argv[3]:3009;

//express http server
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//mongo stuffs
var mongo = require('mongodb');
var monk = require('monk');

//internal machinery
var R = require('./R')
var Type = require('./Type')
var Role = require('./Role')
var utils = require('./utils')
var compiler = require('./compiler')


//regina
var regina = monk(db); //database handler

//Home page
app
.get('/', function(req, res){
  res.send(discreet ? '' : '<h1>Regina<h1>'); 
});



io.on('connection', function (socket) {
  console.log('Regina : socket \''+socket.id+'\' just connected');
  
  socket.on('disconnect', function(){
    console.log('Regina : socket \''+socket.id+'\' just disconnected');
  });
  
  
  
  /**
  * aggregate  */
  socket.on(R.aggregate.toString,(coll, p, opt, meta, ack) => {
    if(!compiler.isValidACK(ack)) 
      return emitNoackCallbackError(socket);
    
    let status = compiler.check(
      R.aggregate.toString,[
        { val : coll, role : Role.coll },
        { val : p, role : Role.p },
        { val : opt, role : Role.opt },
        { val : meta, role : Role.meta }
      ]);
      
      let ctx = {"op":R.aggregate.toCRUD,"coll":coll,"p":p,"opt":opt,"meta":meta}
      
      if(!status.valid)
        return reply(R.aggregate.toString,ack,status.error,null,ctx)
      
      regina.get(coll).aggregate(p,opt)
      .then((res) => {
        reply(R.aggregate.toString,ack,null,res,ctx)
        //  ||
        notifyFollowers(socket,res,ctx)
      }).catch((e) =>{
        reply(R.aggregate.toString,ack,e,null,ctx)
      });
      //end : socket.on('aggregate
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
          { val : meta, role : Role.meta }
        ]);
        
        let ctx = {"op":R.find.toCRUD,"coll":coll,"q":q,"opt":opt,"meta":meta}
        
        if(!status.valid)
          return reply(R.find.toString,ack,status.error,null,ctx)
        
        regina.get(coll).find(q,opt)
        .then((res) => {
          reply(R.find.toString,ack,null,res,ctx)
          //  ||
          notifyFollowers(socket,res,ctx)
        }).catch((e) =>{
          reply(R.find.toString,ack,e,null,ctx)
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
            { val : meta, role : Role.meta }
          ]
        );
        
        let ctx = {"op":R.count.toCRUD,"coll":coll,"q":q,"opt":opt,"meta":meta}
        
        if(!status.valid)
          return reply(R.count.toString,ack,status.error,null,ctx)  
        
        regina.get(coll).count(q,opt)
        .then((res) => {
          reply(R.count.toString,ack,null,res,ctx)
          //  ||
          notifyFollowers(socket,res,ctx)
        }).catch((e) =>{
          reply(R.count.toString,ack,e,null,ctx)
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
            { val : meta, role : Role.meta }
          ]
        );
        
        let ctx = {"op":R.insert.toCRUD,"coll":coll,"docs":docs,"opt":opt,"meta":meta}
        
        if(!status.valid)
          return reply(R.insert.toString,ack,status.error,null,ctx)
        
        regina.get(coll).insert(docs,opt)
        .then((res) => {
          reply(R.insert.toString,ack,null,res,ctx)
          //  ||
          notifyFollowers(socket,res,ctx)    
        }).catch((e) =>{
          reply(R.insert.toString,ack,e,null,ctx)
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
            { val : meta, role : Role.meta }
          ]
        );
        
        let ctx = {"op":R.update.toCRUD,"coll":coll,"q":q,"u":u,"opt":opt,"meta":meta}
        
        if(!status.valid)
          return reply(R.update.toString,ack,status.error,null,ctx)
        
        regina.get(coll).update(q,u,opt)
        .then((res) => {
          reply(R.update.toString,ack,null,res,ctx)
          //  ||
          notifyFollowers(socket,res,ctx)
        }).catch((e) =>{
          reply(R.update.toString,ack,e,null,ctx)
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
            { val : meta, role : Role.meta }
          ]
        );
        
        let ctx = {"op":R.remove.toCRUD,"coll":coll,"q":q,"opt":opt,"meta":meta}
        
        if(!status.valid)
          return reply(R.remove.toString,ack,status.error,null,ctx)
        
        regina.get(coll).remove(q,opt)
        .then((res) => {
          reply(R.remove.toString,ack,null,res,ctx)
          //  ||
          notifyFollowers(socket,res,ctx)
        }).catch((e) =>{
          reply(R.remove.toString,ack,e,null,ctx)
        });
        //end : socket.on('remove
      });
      
      
      //end : io.on('connection'
    });
    
    
    
    
    //utilities
    const reply=(method,ack,err,res,ctx) => {
      ack(err,res,ctx);
      if(debug)
        console.log("<- '"+method+"'","replied :[\n",err,res,ctx,"\n]")
    }
    
    
    /**
    * It is not important to execute notifyFollowers before the reply's callback.
    * We are already sure that the result of the write action is ready */
    const notifyFollowers = (socket,res,ctx) => {
      let meta = utils.soften(ctx.meta)
      console.log("meta", meta) //debug
      let tags = Type.arr.valid(meta.tags) ? meta.tags : []
      console.log("tags", tags) //debug
      for(tag of tags) {
        let val = tag.val
        let kind = tag.kind
        console.log("tag-kind", kind) //debug
        console.log("tag-val", val) //debug
        switch(kind) {
          case "emit":{
            socket.emit(val,res,ctx); 
            console.log('notifyFollowers : ',kind, 'of \''+val+'\'')
            break
          }
          case "broadcast": {
            socket.broadcast.emit(val,res,ctx);
            console.log('notifyFollowers : ',kind, 'of \''+val+'\'')
            break
          }
          case "io": {
            io.emit(val,res,ctx); 
            console.log('notifyFollowers : ',kind, 'of \''+val+'\'')
            break
          }
          default: { //All by default
            io.emit(val,res,ctx); 
            console.log('notifyFollowers : ','io', 'of \''+val+'\'')
            break
          }
        } 
      }
    }
    
    
    const emitNoackCallbackError = (socket) => {
      console.log("Invalid request : ack callback is not defined.")
      socket.emit(
        'regina_noack_callback_error',
        "Error : no ack callback provided. "
        +"Can't send request acknoledgement : request canceled."
      );
    }
    
    
    
    //server config
    
    app
    .use(function(req, res, next){
      res.setHeader('Content-Type', 'text/plain');
      res.send(404, 'Not Found !'); 
    });
    
    
    server
    .listen(port, function(){
      console.log("Regina is ready to talk with MongoDB about '"+db+"' on port '"+port+"' !");
    });
    