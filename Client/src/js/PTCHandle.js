/**
 * create by Lin_HR at 2019/1/20
 * 网络请求协议处理模块
 */

function PTCHandle(){
    var G_space = require("./global");
    var N_Mark = require("./Native_Mark");
    var NT_Mark = require("./Net_Mark");
    var ipc = require("./IPCEntry");
    this.start = function(){
        var socketCli = G_space.GetSocketCli();
        if(!socketCli){
            throw 'socketCli is not defined';
        }
        socketCli.on(NT_Mark.RECV, function(oData){
            oData = JSON.parse(oData);
            var ptc_main = oData["PTC_MAIN"],
                ptc_sub = oData["PTC_SUB"],
                data = oData.data;
            OnHandle(ptc_main, ptc_sub, data);
        })
    }

    function OnHandle(ptc_main, ptc_sub, data){
        switch (ptc_main) {
            case NT_Mark.PTC_MAIN.STATE: {
                OnState(ptc_sub, data);
            } break;
            case NT_Mark.PTC_MAIN.AUTH: {
                OnAuth(ptc_sub, data);
            }
            default:
                break;
        }
    }

    function OnState(ptc_sub, data){
        if(data){
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

    function OnAuth(ptc_sub, data){
        if(data){
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
            } break;
            case NT_Mark.AUTH.LOGIN_RESPONSE_FAIL: {
                alert('用户名或密码错误');
            } break;
            default:
                break;
        }
    }
}

module.exports = new PTCHandle();