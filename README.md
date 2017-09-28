# Regina : Real-time database using MongoDB and Socket.IO

* Regina allows you to run MongoDB 
`'insert'`, `'find'`, `'update'`, `'delete'`, `'count'`, and `'aggregate'` methods directly from the client side (such as firebase).

* Regina can track `tags` based events and send back messages containing the `result` of the requests and their `context` to client's sockets subscribed to these tags.

* Regina uses [Socket.IO](https://socket.io/) for client-server communication and event tracking.


## Installation

* `npm install -g regina`


## Usage

### Server side

> Run with the default settings (`db='localhost:27017/reginadb'` and `port=3009`) : 
1. `mongod`
2. `regina`
3. open your browser at `localhost:3009` and check that you are on the regina home page. 


> Run with custom settings :
1. `mongod --port 5000`
2. `regina 'localhost:5000/mydb' 6000` 
3. open your browser at `localhost:6000` check that you are on the regina home page.


### Client side

> Import [socket.io client](https://socket.io/blog/) and follow these instructions : 
1. create a socket instance with the regina server address :
* `var socket = io('http://localhost:3009/');`
2. send requests to the regina server using one of these type of requests :
* `socket.emit('insert', collection, docs, options, meta, ack);`
* `socket.emit('find', collection, query, options, meta, ack);`
* `socket.emit('count', collection, query, options, meta, ack);`
* `socket.emit('update', collection, query, update, options, meta, ack);`
* `socket.emit('remove', collection, query, options, meta, ack);`
* `socket.emit('aggregate', collection, pipeline, options, meta, ack);`

> It is also possible to use [IOS](https://github.com/socketio/socket.io-client-swift) and [Java](https://github.com/socketio/socket.io-client-java) clients

#### Example 

JS Client (index.html) 

```JavaScript
  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>

  <script>
    //create a socket instance with the regina server address 
    var socket = io('http://localhost:3009/');
    
    //be aware of the misuse of regina methods
    socket.on('regina_noack_callback_error', (msg)=>{console.log(msg);})
    
    //send a find request to the regina server with the 'find-users' tag
    socket.emit('find', 'users', {}, {"username":1}, {"tags":[{"val" : "find-users"}]} 
      ,(err,res,ctx)=>{ console.log(err,res,ctx);}
    );
    
    //follow the 'find-users' tag
    socket.on('find-users', (res, ctx) => {
      console.log(res,ctx);
    });    
  </script>
```

#### Use of tags

> You can use any tag you want except socket.io **[reserved events](https://socket.io/docs/emit-cheatsheet/#)**.
In the `meta` parameter, simply add an object containing the `tags` key and an array of objects each containing the `val` key.
* `{"tags":[{"val":"find-users"}, {"val":"@users-coll"}, {"val":"#users"}]}`

> You can also specify the `kind` (scope) for each tag : 
* `{"tags":[{"val":"find-users","kind":"emit"}, {"val":"#users","kind":"broadcast"}]}`

> There are 3 kinds of scopes:
* `emit` : sends a message only to the client that sent the request to the server.
* `broadcast` : sends a message to all connected clients except the client that sent the request to the server.
* `io` : sends a message to all connected clients including the client that sent the request to the server. By default the scope is `io`.
