/**
 * create by Lin_HR at 2019/1/17
 * 调用原生功能入口文件
 */

function IPC(){
    var ipcRender = require('electron').ipcRenderer;

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
}

module.exports = new IPC();