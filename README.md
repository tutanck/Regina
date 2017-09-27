# Regina : Real-time database using mongoDB and Socket.io

* Regina allows you to run mongodb methods : 
> 'insert', 'find', 'update', 'delete', 'count', 'aggregate' directly from the client side (as with firebase).
* Regina can track tags based events and send back messages to CLIs subscribed to these tags.
* Regina comes with a Java CLI.

## Installation

`npm install regina`

## Usage

### Regina server

* run with the default settings (db='localhost:27017/reginadb' and port=3009) : 
1. mongod
2. `node regina.js`
3. open your browser at localhost:3009 and check that you are on the regina home page. 
4. use one of the JAVA CLI to send requests to database in real-time from the client side.


* run with custom settings :
1. mongod --port 2540
2. `node regina.js 'localhost:2540/mydb' 6980` 
3. open your browser at localhost:6980 check that you are on the regina home page.
4. use one of the JAVA CLI to send requests to database in real-time from the client side.


### JAVA_CLI


> Create A Singleton that implements Regina.SocketClientEventDelegate 
and initialize an new regina instance .
```
public class IO implements Regina.SocketClientEventDelegate {

    private IO(){}

    public static Regina r;
    public static Socket socket;
    static {
        try {
            r = new Regina("http://192.168.100.150:3009", new IO());
            socket = r.socket;
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }


    public void handle(Regina.SocketClientEvent clientEvent){
        System.out.println("socketClientEvent",clientEvent.toString());
    }

    public void handle(Regina.ReginaEvent reginaEvent, String message){
        System.out.println("reginaEvent",reginaEvent.toString()+" : "+message);
    }

}
```

> use the IO singleton to get regina CLI instance and make requests to the regina server
```
try {
            IO.r.find(
                    "users"
                    , new JSONObject().put("username", "luffy")
                    , new JSONObject().put(username, 1).put("_id", 0)
                    , new JSONObject().put("val","#luffy").put("kind", "io")
                    , new Ack() {
                        @Override
                        public void call(Object... args) {
                            if (args[0] != null)
                                System.out.println("result: " + args[1]);
                            else
                                System.out.println("error : " + args[0] + " context :" + args[2]);
                        }
                    }
            );
     } catch (Regina.NullRequiredParameterException | JSONException e) {
            e.printStackTrace();
     }
 ```
 
 > follow the tag "#luffy" and be aware of any request received by the server with this tag
 ```
 IO.socket.on("#luffy", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                try {
                    if (((JSONObject) args[1]).getInt("op") == 2) //update
                        System.out.println("result : "+args[0]+" context : "+args[1]);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
 
 
        
