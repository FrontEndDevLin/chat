const HTTP = require("http");
const SIO = require("socket.io");
const Mark = require("./Mark");
const PORT = 3000;

let httpServ = HTTP.createServer().listen(PORT, ()=>{
    console.log(`Socket.io server is listen on ${PORT}`);
})

let io = SIO(httpServ);
let CNTEntry = require("./CNTEntry");
let PTC = require("./PTCParser");

io.on("connection", (socketSer)=>{
    var cnt = new CNTEntry(socketSer);
    // console.log(14);
    socketSer.on(Mark.SEND, (data)=>{
        if(!data) return;
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log(error)
        }
        PTC.OnParse(data, socketSer);
    });

    socketSer.on("disconnect", ()=>{
        console.log('disconn');
    })
})