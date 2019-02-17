/**
 * create by Lin_HR in 2019/1/31
 */

function IoSrvEntry(){
    const Mark = require("./Mark");
    let IOMob = require("./IOModle");
    let CNT = require("./CNTInterface");
    let PTC = require("./PTCParser");

    this.NetStart = function(){
        IOMob.IoStart((ioEvent, socket, data)=>{
            switch (ioEvent) {
                case Mark.IO_EVENT.LISTENING: {
                    let port = data;
                    OnListening(port);
                } break;
                case Mark.IO_EVENT.CONNECTION: {
                    OnConnection(socket);
                } break;
                case Mark.IO_EVENT.DATA: {
                    OnData(socket, data);
                } break;
                case Mark.IO_EVENT.CLOSE: {
                    OnClose(socket);
                } break;
                case Mark.IO_EVENT.ERROR: {
                    let err = data;
                    OnError(socket, err);
                } break;
            }
        })
    }

    function OnListening(port){
        console.log(`Socket.IO server is listening on ${port}`)
    }

    function OnConnection(socket){
        CNT.PushConnection(socket);
    }

    function OnData(socket, data){
        PTC.OnParse(data, socket);
    }

    function OnClose(socket){
        let socketId = socket["id"];
        CNT.RemoveConnectById(socketId);
    }

    function OnError(scoket, error){
        console.log(error.toString());
    }
}

module.exports = new IoSrvEntry();