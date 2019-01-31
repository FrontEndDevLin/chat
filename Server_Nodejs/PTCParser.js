/**
 * create by Lin_HR in 2019/1/21
 * 协议路由分派模块
 */

const Mark = require("./Mark");
let MG = require("./MongoDB");
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
                User.Auth(id, pwd, function(err, result){
                    if(err) {
                        Net.Resp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.LOGIN_RESPONSE_FAIL);
                    } else {
                        Net.Resp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.LOGIN_RESPONSE_SUCC, result);
                    }
                });
            } break;
            case Mark.AUTH.REGIST_REQUEST: {
                let id = param["token"],
                    pwd = param["pwd"],
                    name = param["name"];
                if( !id.trim() || !pwd || !name.trim() ) {
                    return;
                }
                let doc = {"name": name, "pwd": pwd, "id": id};
                User.Insert(doc, function(err, isSucc){
                    if(err){
                        console.log(err)
                    }
                    if(isSucc) {
                        Net.Resp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.REGIST_RESPONSE_SUCC)
                    } else {
                        Net.Resp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.REGIST_RESPONSE_FAIL)
                    }
                })
            } break;
            default:
                break;
        }
    }
}

module.exports = new PTCParser();