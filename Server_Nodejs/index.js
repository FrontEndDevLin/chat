const HTTP = require("http");
const SIO = require("socket.io");

const PORT = 3000;

let httpServ = HTTP.createServer().listen(PORT, ()=>{
    console.log(`Socket.io server is listen on ${PORT}`);
})

let io = SIO(httpServ);

io.on("connection", (socketSer)=>{
    socketSer.on("Z", (data)=>{
        if(!data) return;
        try {
            data = JSON.parse(data);
        } catch (error) {
            let oRsp = {MOD: MARK.MODULE.FAIL, PTC: MARK.FAIL.PARAM_ERROR};
            socketSer.emit("Z", JSON.stringify(oRsp));
        }

        console.log(data);
    })
})