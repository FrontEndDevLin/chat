/**
 * create by Lin_HR at 2019/1/21
 * 协议路由分派模块
 */

const Mark = require("./Mark");
let MG = require("./MongoDB");
let User = require("./UserInterface");
let CNT = require("./CNTInterface");
let UConf = require("./UConfInterface");
let fs = require("fs");

let NetResp = (socket, ptc_main, ptc_sub, data) => {
    if (!socket) return;
    if (data) {
        try {
            data = JSON.stringify(data);
        } catch (error) {
            console.log(error)
        }
    }
    let packge = { PTC_MAIN: ptc_main, PTC_SUB: ptc_sub, data: data };
    socket.emit(Mark.IO_EVENT.DATA, JSON.stringify(packge));
}

class PTCParser {
    constructor() {

    }

    OnParse(oData, socket) {
        try {
            oData = JSON.parse(oData);
        } catch (error) {
            throw "first param must be a json"
        }
        switch (oData.PTC_MAIN) {
            case Mark.PTC_MAIN.STATE: {
                this.OnState(oData, socket)
            } break;
            case Mark.PTC_MAIN.AUTH: {
                this.OnAuth(oData, socket);
            } break;
            case Mark.PTC_MAIN.INIT: {
                this.OnInit(oData, socket);
            } break;
            case Mark.PTC_MAIN.CHAT: {
                this.OnChat(oData, socket);
            } break;
        }
    }

    OnState(oData, socket) {
        let param = oData.data;
        if (param) {
            try {
                param = JSON.parse(param);
            } catch (error) {
                console.log(error);
            }
        }
        switch (oData.PTC_SUB) {
            case Mark.STATE.CONNECT_REQUEST: {
                NetResp(socket, Mark.PTC_MAIN.STATE, Mark.STATE.CONNECT_ACCESS);
            } break;
        }
    }

    OnAuth(oData, socket) {
        let param = oData.data;
        if (param) {
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
                // User.Insert({id: "13650728004", name: "小弟弟", pwd: "123abc"}, function(err, sn){
                //     UConf.Insert(sn);
                // });
                // return;
                User.Auth(id, pwd, (err, result) => {
                    if (err) {
                        NetResp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.LOGIN_RESPONSE_FAIL);
                    } else {
                        CNT.BindSNToConnection(socket, result["sn"]);
                        fs.readFile(result["avatar"], "base64", (err, base64)=>{
                            result["avatar"] = base64;
                            NetResp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.LOGIN_RESPONSE_SUCC, result);
                        })
                    }
                });
            } break;
            case Mark.AUTH.REGIST_REQUEST: {
                let id = param["token"],
                    pwd = param["pwd"],
                    name = param["name"];
                if (!id.trim() || !pwd || !name.trim()) {
                    return;
                }
                let doc = { "name": name, "pwd": pwd, "id": id };
                User.Insert(doc, (err, sn) => {
                    if (err) {
                        console.log(err)
                    }
                    if (sn) {
                        UConf.Insert(sn);                        
                        NetResp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.REGIST_RESPONSE_SUCC)
                    } else {
                        NetResp(socket, Mark.PTC_MAIN.AUTH, Mark.AUTH.REGIST_RESPONSE_FAIL)
                    }
                })
            } break;
        }
    }

    OnInit(oData, socket) {
        let param = oData["data"];
        if (param) {
            try {
                param = JSON.parse(param);
            } catch (error) {
                console.log(error)
            }
        }
        switch (oData.PTC_SUB) {
            case Mark.INIT.GET_FRIENDSLIST: {
                let sn = CNT.GetConnectionBySocket(socket).GetSN();
                if (sn) {
                    UConf.GetFriends(sn, (err, oAyFriendsInfo) => {
                        if (err) throw err;
                        for(let info of oAyFriendsInfo){
                            let avatarDir = info["avatar"];
                            info["avatar"] = fs.readFileSync(avatarDir, "base64");
                        }
                        NetResp(socket, Mark.PTC_MAIN.INIT, Mark.INIT.RES_FRIENDSLIST, oAyFriendsInfo);
                    });
                }
            } break;
        }
    }

    OnChat(oData, socket) {
        let param = oData["data"];
        if (param) {
            try {
                param = JSON.parse(param);
            } catch (error) {
                console.log(error);
            }
        }
        switch (oData.PTC_SUB) {
            case Mark.CHAT.SEND_MESSAGE: {
                let dSN = param["destSN"], msg = param["msg"];
                if(!dSN || !msg) return;
                let destConnection = CNT.GetConnectionBySN(dSN);
                if(destConnection) {
                    let sn = CNT.GetConnectionBySocket(socket).GetSN();
                    User.GetInfoBySN(sn, { "name": 1, "_id": 0 }, (err, result) => {
                        let data = { "fromSN": sn, "name": result["name"], "msg": msg };
                        NetResp(destConnection.GetSocket(), Mark.PTC_MAIN.CHAT, Mark.CHAT.RECV_MESSAGE, data)
                    })
                }
            } break;
            case Mark.CHAT.GET_TARGET_AVATAR: {
                let dSN = param["destSN"];
                if(!dSN) return;
                let sn = CNT.GetConnectionBySocket(socket).GetSN();
                User.GetInfoBySN(dSN, { "avatar": 1, "_id": 0 }, (err, result) => {
                    if (err) return;
                    let path = result["avatar"];
                    fs.readFile(path, "base64", (err, base64Data) => {
                        if (err) throw err;
                        Object.assign(result, {
                            avatar: base64Data,
                            sn: dSN
                        });
                        NetResp(socket, Mark.PTC_MAIN.CHAT, Mark.CHAT.RES_TARGET_AVATAR, result);
                    })
                })
            } break;
        }
    }
}

module.exports = new PTCParser();