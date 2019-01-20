/**
 * create by Lin_HR at 2019/1/20
 * 网络请求协议处理模块
 */

function PTCHandle(){
    var G_space = require("./global");
    var NT_Mark = require("./Net_Mark");
    this.start = function(){
        var socketCli = G_space.GetSocketCli();
        if(!socketCli){
            throw 'socketCli is not defined';
        }
        socketCli.on(NT_Mark.RECV, function(oData){
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
        
            default:
                break;
        }
    }

    function OnState(ptc_sub, data){
        if(data){
            try {
                data = JSON.stringify(data);
            } catch (error) {
                throw error;
            }
        }
        switch (ptc_sub) {
            case NT_Mark.STATE.CONN_CHECK_RESPONSE: {
                $("#logo").html("连接服务器成功");
            } break;
            default:
                break;
        }
    }
}

module.exports = new PTCHandle();