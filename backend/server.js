const exp = require('constants')
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()

const app=express()
const server = http.createServer(app)
const wss=new WebSocket.Server({server})

app.use(cors)
app.use(express.json())

const Message=require('./models/message.js')

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true,})
    .then(()=> console.log('MongoDB connected'))
    .catch(err=> console.log(err.message))

console.log("MONGO_URI:", process.env.MONGO_URI);

server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})

const broadCast = (data)=>{
    const message=JSON.stringify(data)
    console.log(message)
    wss.clients.forEach(client=>{
        if(client.readyState==WebSocket.OPEN){
            client.send(message)
        }
    })
}

wss.on('connection',(socket)=>{
    console.log('client connected')

    socket.on('message',async (msg)=>{
        const data=JSON.parse(msg)
        switch (data.type){
            case 'join':
                socket.username=data.user
                broadCast({
                    type:'notification',
                    message:`${data.user} joined the Room`,
                    time:new Date().toISOString()

                })
                break

            case 'message':
                const saved=await Message.create({
                    user:data.user,
                    message:data.message,
                    time:new Date().toISOString()
                })
                broadCast({type:'message',...saved.toObject()})
                break;

            case 'typing':
                broadCast({
                    type:'typing',
                    user:data.user
                })
                break
            
            case 'leave':
                broadCast({
                    type: 'notification',
                    message: `${data.user} left the chat`,
                    time: new Date().toISOString()
                })
                break
            default:
                console.log(`unknown message type: ${data.type}`)
        }
    })
    socket.on('close', () => {
        if (socket.username) {                
            broadCast({
                type: 'notification',
                message: `${socket.username} left the chat`,
                time: new Date().toISOString()
            });
        }
    });
})