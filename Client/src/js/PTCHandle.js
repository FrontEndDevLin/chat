/**
 * create by Lin_HR at 2019/1/20
 * 网络请求协议处理模块
 */

function PTCHandle() {
    var G_space = require("./global");
    var N_Mark = require("./Native_Mark");
    var NT_Mark = require("./Net_Mark");
    var ipc = require("./IPCEntry");
    var Net = require("./NETEntry");

    this.start = function () {
        var socketCli = G_space.GetSocketCli();
        if (!socketCli) {
            throw 'socketCli is not defined';
        }
        socketCli.on(NT_Mark.IO_EVENT.DATA, function (oData) {
            oData = JSON.parse(oData);
            var ptc_main = oData["PTC_MAIN"],
                ptc_sub = oData["PTC_SUB"],
                data = oData.data;
            OnHandle(ptc_main, ptc_sub, data);
        })
    }

    function OnHandle(ptc_main, ptc_sub, data) {
        switch (ptc_main) {
            case NT_Mark.PTC_MAIN.STATE: {
                OnState(ptc_sub, data);
            } break;
            case NT_Mark.PTC_MAIN.AUTH: {
                OnAuth(ptc_sub, data);
            } break;
            case NT_Mark.PTC_MAIN.INIT: {
                OnInit(ptc_sub, data);
            } break;
            case NT_Mark.PTC_MAIN.CHAT: {
                OnChat(ptc_sub, data);
            }
        }
    }

    function OnState(ptc_sub, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw error;
            }
        }
        switch (ptc_sub) {
            case NT_Mark.STATE.CONNECT_ACCESS: {
                $("#logo").html("连接服务器成功");
            } break;
            default:
                break;
        }
    }

    function OnAuth(ptc_sub, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw error;
            }
        }
        switch (ptc_sub) {
            case NT_Mark.AUTH.LOGIN_RESPONSE_SUCC: {
                var sn = data["sn"];
                G_space.SetSN(sn);
                ipc.NTSend(N_Mark.PTC_MAIN.STATE, N_Mark.STATE.LOGIN_ACCESS);
                $("#loginframe").hide();
                $(".globalWin").show();
                var avtDir = G_space.base64ToImgDir(data["avatar"]);
                $("#avatar").attr("src", avtDir);
                G_space.SetAvatar(avtDir);

                Net.send(NT_Mark.PTC_MAIN.INIT, NT_Mark.INIT.GET_RECENTCONTACT);
                Net.send(NT_Mark.PTC_MAIN.INIT, NT_Mark.INIT.GET_FRIENDSLIST);
            } break;
            case NT_Mark.AUTH.LOGIN_RESPONSE_FAIL: {
                alert('用户名或密码错误');
            } break;
            default:
                break;
        }
    }

    function OnInit(ptc_sub, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw (error)
            }
        }
        switch (ptc_sub) {
            case NT_Mark.INIT.RES_FRIENDSLIST: {
                G_space.showFriendsList(data);
            } break;

            default:
                break;
        }
    }

    function OnChat(ptc_sub, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw (error)
            }
        }
        switch (ptc_sub) {
            case NT_Mark.CHAT.RECV_MESSAGE: {
                // console.log(data);
                if( !G_space.GetConversation(data["fromSN"]) ){
                    G_space.joinConversation(data["fromSN"], true);
                }
                G_space.printMsg(data);
                Net.send(NT_Mark.PTC_MAIN.CHAT, NT_Mark.CHAT.READED_MSG, {"msgId": data["msgId"]});
                if( G_space.getDestSN() != data["fromSN"] ){
                    ipc.FlashWindow();
                }
            } break;
            case NT_Mark.CHAT.RES_TARGET_AVATAR: {
                G_space.SetChatDetail(data["sn"], { "avatar": G_space.base64ToImgDir(data["avatar"]) });
                // console.log(G_space.GetChatDeatil(data["sn"]));
            } break;
            case NT_Mark.CHAT.MSG_HISTORY_RESPONSE: {
                console.log(data);
            } break;
            default:
                break;
        }
    }
}

module.exports = new PTCHandle();