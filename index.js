const express = require("express");
const app = express(); 
const cors  = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoute);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//mongoose connection
mongoose.connect("mongodb+srv://kazama-nft-api:X33ZASGgnBjuKbWX@cluster0.iplwndz.mongodb.net/PROFILE?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log("DB Connection Successful!")
    }).catch((err) => console.log(err));

const server = app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Chat server started at port: ${process.env.PORT}`);
});

const io = socket(server,{
    cors: {
        origin: "*",
        credentials: true,
    },
});
//store all online users inside this map
global.onlineUsers =  new Map();
 
io.on("connection",(socket)=>{
    global.chatSocket = socket;

    socket.on("send-msg",(data)=>{
        socket.broadcast.emit("msg-recieved",data);
    });
});
