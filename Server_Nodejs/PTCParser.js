/**
 * create by Lin_HR at 2019/1/21
 * 协议路由分派模块
 */

const Mark = require("./Mark");

let Net = {
    Resp: (socket, ptc_main, ptc_sub, data)=>{
        if(!socket) return;
        if(data) {
            try {
                data = JSON.stringify(data);
            } catch (error) {
                console.log(error)
            }
        }
        let packge = {PTC_MAIN: ptc_main, PTC_SUB: ptc_sub, data: data}
        socket.emit(Mark.RECV, packge);
    }
}

class PTCParser {
    constructor(){
        
    }

    OnParse(oData, socket){
        switch (oData.PTC_MAIN) {
            case Mark.PTC_MAIN.STATE: {
                this.OnState(oData, socket)
            } break;
        
            default:
                break;
        }
    }

    OnState(oData, socket){
        let param = oData.data;
        if(param){
            try {
                param = JSON.parse(param);
            } catch (error) {
                console.log(error);
            }
        }
        switch (oData.PTC_SUB) {
            case Mark.STATE.CONN_CHECK_REQUEST: {
                Net.Resp(socket, Mark.PTC_MAIN.STATE, Mark.STATE.CONN_CHECK_RESPONSE);
            } break;
            case Mark.STATE.CONNECT_REQUEST: {

            } break;
            default:
                break;
        }
    }
}

module.exports = new PTCParser();