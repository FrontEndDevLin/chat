/**
 * create by Lin_HR at 2019/1/19
 * 底层返回的数据和事件处理 少用
 */

function IPCParser(){
    var ipcRender = require('electron').ipcRenderer;
    var ipcEvent = null;

    this.start = function(){
        ipcRender.on("FE", function(event, protocol_main, protocol_sub, data){
            ipcEvent = event;
            OnParse(protocol_main, protocol_sub, data);
        })
    }

    function OnParse(protocol_main, protocol_sub, data){
        switch (protocol_main) {
            case N_Mark.PTC_MAIN.WINDOW: {
                OnWindow(protocol_sub, data);
            } break;
        
            default:
                break;
        }
    }

    function OnWindow(protocol_sub, data){
        if(data){
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw error;
            }
        }
        switch (protocol_sub) {
            case N_Mark.WINDOW.MAX: {
            } break;
        
            default:
                break;
        }
    }
}

module.exports = new IPCParser();