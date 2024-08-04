const express= require('express');
const {Server} = require('socket.io');
const http = require('http');
const path = require('path');




const app = express();
const server= http.createServer(app);
const io = new Server(server);
const PORT= process.env.PORT || 5000


app.use(express.static('frontend/dist'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})


const userSocketMap={}; 

function getAllConnectedClients(roomId){
    // return a map and then  .from converts map into array and then we map over the array 

    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username: userSocketMap[socketId]
        }
    })
}


io.on("connection", (socket)=>{

    console.log("a new connection: ",socket.id)

    socket.on('join', ({roomId, username})=>{
        userSocketMap[socket.id]=username;


        socket.join(roomId);

        const clients= getAllConnectedClients(roomId);


        clients.forEach(({socketId})=>{
            io.to(socketId).emit('joined',{
                clients,
                username:username,
                socketId: socket.id
            })
        })
    })


    socket.on('code-change', ({ roomId, code})=>{
        socket.in(roomId).emit('code-change',{ code })
    })

    socket.on('sync-code', ({ socketId, code})=>{
        io.to(socketId).emit('code-change',{ code })
    })



    socket.on('disconnecting', ()=>{
        const rooms=[...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit('disconnected',{
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();

    })
})

server.listen(PORT,()=>{
    console.log(`server running on PORT: ${PORT}`);
})

