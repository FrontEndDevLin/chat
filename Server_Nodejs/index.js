const HTTP = require("http");
const SIO = require("socket.io");
const Mark = require("./Mark");
const PORT = 3000;

let httpServ = HTTP.createServer().listen(PORT, ()=>{
    console.log(`Socket.io server is listen on ${PORT}`);
})

let io = SIO(httpServ);

io.on("connection", (socketSer)=>{
    socketSer.on(Mark.SEND, (data)=>{
        if(!data) return;
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log(error)
        }
        socketSer.emit(Mark.RECV, {PTC_MAIN: Mark.PTC_MAIN.STATE, PTC_SUB: Mark.STATE.CONN_CHECK_RESPONSE});
    });

    socketSer.on("disconnect", ()=>{
        console.log('disconn');
    })
})