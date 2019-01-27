/**
 * create by Lin_HR at 2019/1/21
 * 协议路由分派模块
 */

const Mark = require("./Mark");
let User = require("./UserInterface");

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
        socket.emit(Mark.RECV, JSON.stringify(packge));
    }
}

let ACC = {
    "13650728002": {
        _id: "13650728002",
        name: "Lin_HR",
        pwd: "123abc",
        sn: 10001
    },
    "13535272749": {
        _id: "13535272749",
        name: "Lucy",
        pwd: "abc123",
        sn: 10002
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
            case Mark.PTC_MAIN.AUTH: {
                this.OnAuth(oData, socket);
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
            case Mark.STATE.CONNECT_REQUEST: {
                Net.Resp(socket, Mark.PTC_MAIN.STATE, Mark.STATE.CONNECT_ACCESS);
            } break;
            default:
                break;
        }
    }

    OnAuth(oData, socket){
        let param = oData.data;
        if(param){
            try {
                param = JSON.parse(param);
            } catch (error) {
                console.log(error);
            }
        }
        switch (oData.PTC_SUB) {
            case Mark.AUTH.LOGIN_REQUEST: {
                let id = param["token"],
                    pwd = param["pwd"];
                if(ACC[id] && ACC[id]["pwd"] == pwd){
                    let resData = {"name": ACC[id]["name"], "sn": ACC[id]["sn"]};
                    Net.Resp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.LOGIN_RESPONSE_SUCC, resData);
                } else {
                    Net.Resp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.LOGIN_RESPONSE_FAIL);
                }
            } break;
        
            default:
                break;
        }
    }
}

module.exports = new PTCParser();