const HTTP = require("http");
const SIO = require("socket.io");
const Mark = require("./Mark");

function IoModle(){
    this.IoStart = function(Callback){
        let PORT = 3000;
        let httpServ = HTTP.createServer().listen(PORT);
        let io = SIO(httpServ);
        io.on("connection", (socket)=>{

            Callback(Mark.IO_EVENT.CONNECTION, socket);

            socket.on("data", (packge)=>{
                Callback(Mark.IO_EVENT.DATA, socket, packge);
            });

            socket.on("close", ()=>{
                Callback(Mark.IO_EVENT.CLOSE, socket);
            });

            socket.on(error, (err)=>{
                Callback(Mark.IO_EVENT.ERROR, err);
            });
        })
    }
}

module.exports = new IoModle();