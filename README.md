# Regina : Real-time database using mongoDB and Socket.io

* Regina allows you to run mongodb methods : 
`'insert'`, `'find'`, `'update'`, `'delete'`, `'count'`, `'aggregate'` directly from the client side (as with firebase).
* Regina can track `tags` based events and send back messages containing the `result` of the requests and their `context` to client's sockets subscribed to these tags.
* Regina uses [Socket.IO](https://socket.io/) for client-server communication and event tracking.


## Installation

* `npm install regina` or
*  Download from [Github](https://github.com/tutanck/Regina).


## Usage

### Server side

> run with the default settings (db='localhost:27017/reginadb' and port=3009) : 
1. `mongod`
2. `node regina.js`
3. open your browser at localhost:3009 and check that you are on the regina home page. 


> run with custom settings :
1. `mongod --port 2540`
2. `node regina.js 'localhost:2540/mydb' 6980` 
3. open your browser at localhost:6980 check that you are on the regina home page.


### Client side

> import [socket.io client](https://socket.io/blog/) and follow this step by step instructions : 
1. creates a socket instance with the regina server address :
`var socket = io('http://localhost:3009/');`
2. sends requests to the regina server using one of these type of requests :
* `socket.emit('insert', collection, docs, options, meta, ack);`
* `socket.emit('find', collection, query, options, meta, ack);`
* `socket.emit('count', collection, query, options, meta, ack);`
* `socket.emit('update', collection, update, options, meta, ack);`
* `socket.emit('remove', collection, query, options, meta, ack);`
* `socket.emit('aggregate', collection, pipeline, options, meta, ack);`

#### Example 

Client (index.html) 

```
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>

<h1>Test<h1>
  <script>
    var socket = io('http://localhost:3009/');
    
    //be aware of the misuse of regina methods
    socket.on('regina_noack_callback_error', (msg)=>{console.log(msg);})
    
    //sends a find request to the regina server
    socket.emit(
    'find'
    ,'regina-tests'
    ,{} 
    ,{"username":1}
    ,{"tags":[{"val" : "find-users"}]} 
    ,(err,res,ctx)=>{ 
      console.log(err,res,ctx);
    });
    
    //follow the tag `find-users`
    socket.on('find-users', (res, ctx) => {
      console.log(res,ctx);
    });    
  </script>
  <body></body>
  </html>
```
        
