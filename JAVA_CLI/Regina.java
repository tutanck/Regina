package com.aj.aladdin.tools.regina;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by joan on 18/09/2017.
 */

public class Regina {

    public final String serverURL;

    public final Socket socket;


    public Regina(
            String serverURL
            , SocketClientEventDelegate delegate
    ) throws URISyntaxException {
        socket = IO.socket(serverURL);
        this.serverURL = serverURL;

        //Events handling

        socket.on(SocketClientEvent.CONNECT.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.CONNECT);
            }
        }).on(SocketClientEvent.CONNECTING.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.CONNECTING);
            }
        }).on(SocketClientEvent.DISCONNECT.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.DISCONNECT);
            }
        }).on(SocketClientEvent.ERROR.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.ERROR);
            }
        }).on(SocketClientEvent.MESSAGE.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.MESSAGE);
            }
        }).on(SocketClientEvent.RECONNECT.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.RECONNECT);
            }
        }).on(SocketClientEvent.RECONNECTING.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.RECONNECTING);
            }
        }).on(SocketClientEvent.RECONNECT_ATTEMPT.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.RECONNECT_ATTEMPT);
            }
        }).on(SocketClientEvent.RECONNECT_FAILED.toString(), new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                delegate.handle(SocketClientEvent.RECONNECT_FAILED);
            }
        });


        //regina_warning

        /*socket.on(ReginaEvent.noack.rawValue) {
            dataArray, ack in
            delegate.handle(reginaEvent: .noack, message :dataArray[0] as !String) //TODO TEST
        }*/

    }


    //SocketIO io communication convenience methods
    public final void connect() {
        socket.connect();
    }

    public final void disconnect() {
        socket.disconnect();
    }


    /**
     * REGINA aggregate
     *
     * @param coll
     * @param pipeline
     * @param opt
     * @param meta
     * @param ack
     */
    public final void aggregate(
            String coll
            , JSONArray pipeline
            , JSONObject opt
            , JSONObject meta
            , Ack ack
    ) throws NullRequiredParameterException {
        socket.emit("aggregate", checkSTR(coll, "coll"), checkJAR(pipeline, "pipeline"), softenJO(opt), softenJO(meta), checkACK(ack, "ack"));
    }


    /**
     * REGINA find
     *
     * @param coll
     * @param query
     * @param opt
     * @param meta
     * @param ack
     */
    public final void find(
            String coll
            , JSONObject query
            , JSONObject opt
            , JSONObject meta
            , Ack ack
    ) throws NullRequiredParameterException {
        socket.emit("find", checkSTR(coll, "coll"), checkJO(query, "query"), softenJO(opt), softenJO(meta), checkACK(ack, "ack"));
    }


    /**
     * REGINA count
     *
     * @param coll
     * @param query
     * @param opt
     * @param meta
     * @param ack
     */
    public final void count(
            String coll
            , JSONObject query
            , JSONObject opt
            , JSONObject meta
            , Ack ack
    ) throws NullRequiredParameterException {
        socket.emit("count", checkSTR(coll, "coll"), checkJO(query, "query"), softenJO(opt), softenJO(meta), checkACK(ack, "ack"));
    }


    /**
     * REGINA insert
     *
     * @param coll
     * @param doc
     * @param opt
     * @param meta
     * @param ack
     */
    public final void insert(
            String coll
            , JSONObject doc
            , JSONObject opt
            , JSONObject meta
            , Ack ack
    ) throws NullRequiredParameterException {
        socket.emit("insert", checkSTR(coll, "coll"), checkJO(doc, "doc"), softenJO(opt), softenJO(meta), checkACK(ack, "ack"));
    }


    /**
     * REGINA insert
     *
     * @param coll
     * @param docs
     * @param opt
     * @param meta
     * @param ack
     */
    public final void insert(
            String coll
            , JSONArray docs
            , JSONObject opt
            , JSONObject meta
            , Ack ack
    ) throws NullRequiredParameterException {
        /** todo optional j8
         * if(opt == null)
         opt = new JSONObject();
         if(meta == null)
         meta = new JSONObject();**/
        socket.emit("insert", checkSTR(coll, "coll"), checkJAR(docs, "docs"), softenJO(opt), softenJO(meta), checkACK(ack, "ack"));
    }


    /**
     * REGINA update
     *
     * @param coll
     * @param query
     * @param update
     * @param opt
     * @param meta
     * @param ack
     */
    public final void update(
            String coll
            , JSONObject query
            , JSONObject update
            , JSONObject opt
            , JSONObject meta
            , Ack ack
    ) throws NullRequiredParameterException {
        socket.emit("update", checkSTR(coll, "coll"), checkJO(query, "query"), checkJO(update, "update"), softenJO(opt), softenJO(meta), checkACK(ack, "ack"));
    }


    /**
     * REGINA remove
     *
     * @param coll
     * @param query
     * @param opt
     * @param meta
     * @param ack
     */
    public final void remove(
            String coll
            , JSONObject query
            , JSONObject opt
            , JSONObject meta
            , Ack ack
    ) throws NullRequiredParameterException {
        socket.emit("remove", checkSTR(coll, "coll"), checkJO(query, "query"), softenJO(opt), softenJO(meta), checkACK(ack, "ack"));
    }


    //INTERNALS

    public enum ReginaEvent {
        NOACK("regina_noack_callback_error");

        private String value = "";

        ReginaEvent(String value) {
            this.value = value;
        }

        public String toString() {
            return value;
        }
    }


    public enum Amplitude {
        IO("io"),
        EMIT("emit"),
        BROADCAST("broadcast");

        private String value = "";

        Amplitude(String value) {
            this.value = value;
        }

        public String toString() {
            return value;
        }
    }


    public enum SocketClientEvent {
        CONNECT(Socket.EVENT_CONNECT),
        CONNECTING(Socket.EVENT_CONNECTING),
        DISCONNECT(Socket.EVENT_DISCONNECT),
        ERROR(Socket.EVENT_ERROR),
        MESSAGE(Socket.EVENT_MESSAGE),
        RECONNECT(Socket.EVENT_RECONNECT),
        RECONNECTING(Socket.EVENT_RECONNECTING),
        RECONNECT_ATTEMPT(Socket.EVENT_RECONNECT_ATTEMPT),
        RECONNECT_FAILED(Socket.EVENT_RECONNECT_FAILED),
        CONNECT_ERROR(Socket.EVENT_CONNECT_ERROR),
        CONNECT_TIMEOUT(Socket.EVENT_CONNECT_TIMEOUT),
        RECONNECT_ERROR(Socket.EVENT_RECONNECT_ERROR),
        PING(Socket.EVENT_PING),
        PONG(Socket.EVENT_PONG);

        private String value = "";

        SocketClientEvent(String value) {
            this.value = value;
        }

        public String toString() {
            return value;
        }
    }


    public String toString() {
        return serverURL;
    }


    public interface SocketClientEventDelegate {
        void handle(SocketClientEvent clientEvent);

        void handle(ReginaEvent reginaEvent, String message);
    }


    private JSONObject jo() {
        return new JSONObject();
    }


    private JSONObject softenJO(
            JSONObject json
    ) {
        return json == null ? jo() : json;
    }


    private String checkSTR(
            String str
            , String param
    ) throws NullRequiredParameterException {
        if (str == null)
            throw new NullRequiredParameterException(param);
        return str;
    }

    private JSONObject checkJO(
            JSONObject jo
            , String param
    ) throws NullRequiredParameterException {
        if (jo == null)
            throw new NullRequiredParameterException(param);
        return jo;
    }

    private JSONArray checkJAR(
            JSONArray jar
            , String param
    ) throws NullRequiredParameterException {
        if (jar == null)
            throw new NullRequiredParameterException(param);
        return jar;
    }

    private Ack checkACK(
            Ack ack
            , String param
    ) throws NullRequiredParameterException {
        if (ack == null)
            throw new NullRequiredParameterException(param);
        return ack;
    }

    public class NullRequiredParameterException extends Exception {
        public NullRequiredParameterException(String param) {
            super("Parameter :  " + param + " is required but found 'null'");
        }
    }

    public class ReginaException extends Exception {
        public ReginaException(Throwable throwable) {
            super(throwable);
        }

        public ReginaException(JSONObject json) {
            super(String.valueOf(json));
        }

        public ReginaException(String msg) {
            super(msg);
        }
    }
}





