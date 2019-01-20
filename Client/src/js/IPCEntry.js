/**
 * create by Lin_HR at 2019/1/17
 * 调用原生功能入口文件
 */

function IPC(){
    var ipcRender = require('electron').ipcRenderer;
    var N_Mark = require("./Native_Mark");

    this.NTSend = function(protocol_main, protocol_sub, data){
        if(data){
            try {
                data = JSON.stringify(data);
            } catch (error) {
                throw 'error';
            }
        }
        ipcRender.send("NT", protocol_main, protocol_sub, data)
    }

    this.NTSendSync = function(protocol_main, protocol_sub, data){
        if(data){
            try {
                data = JSON.stringify(data);
            } catch (error) {
                throw 'error';
            }
        }
        return ipcRender.sendSync("NTSYNC", protocol_main, protocol_sub, data)
    }

    // 常用底层方法
    this.GetServ = function(){
        return this.NTSendSync(N_Mark.PTC_MAIN.FILE, N_Mark.FILE.GET_HOST);
    }
}

module.exports = new IPC();