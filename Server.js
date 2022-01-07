const dgram = require('dgram');
const socket = dgram.Socket;
const express = require('express');
let http = require("http");
let path = require("path");
const app = express();
let server = http.createServer(app);
const io = require('socket.io')(server);
const mongodb = require('mongodb');

const url = 'mongodb://localhost:27017';

const client = new mongodb.MongoClient(url);

let dbName = 'miniproject';
async function mainSend(msg,id){
    var collectionName="User";
    await client.connect();
    const db = client.db(dbName);
    insertMsgSend(db,msg,collectionName,id)
}

async function insertMsgSend(db,msg,collectionName,id){
    temp={
        "user":id,
        "msg":msg
    }
    const result = await db.collection(collectionName).insertOne(temp);
    console.log(result);
}
async function insertMsgReceive(db,msg,collectionName){
    temp={
        "msg":msg,
        "method":"receive"
    }
    const result = await db.collection(collectionName).insertOne(temp);
    console.log(result);
}


server.listen(3000);

app.get("/",function(req,res ){
    res.sendFile(path.join(__dirname+'/home.html'));

})
app.get("/style.css",function(req,res ){
    res.sendFile(path.join(__dirname+'/style.css'));
})
app.get("/chat.png",function(req,res ){
    res.sendFile(path.join(__dirname+'/chat.png'));
})
app.get("/Background.jpg",function(req,res ){
    res.sendFile(path.join(__dirname+'/Background.jpg'));
})


io.on('connection', (socket)=> {
    
    socket.on("message",(data) => {
        var id=socket.id;
        socket.broadcast.emit('message',data);
        mainSend(data,id)
            .catch(error => console.log(error))
    })
})