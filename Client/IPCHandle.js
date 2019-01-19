/**
 * create by Lin_HR at 2019/1/15
 * 原生操作模块, 路由分派
 */

const ipcMain = require('electron').ipcMain;
const N_Mark = require('./Mark');
let Gb = require("./Global");

function IPC(){
    var ipcEvent = null;
    this.start = function(){
        ipcMain.on("NT", (event, protocol_main, protocol_sub, data)=>{
            ipcEvent = event;
            OnParse(protocol_main, protocol_sub, data)
        })
    }

    // 回传给前端
    function FESend(protocol_main, protocol_sub, data){
        if(!ipcEvent) return;
        if(data){
            try {
                data = JSON.stringify(data);
            } catch (error) {
                throw error;
            }
        }
        ipcEvent.sender.send("FE", protocol_main, protocol_sub, data);
    }

    function OnParse(protocol_main, protocol_sub, data){
        switch (protocol_main) {
            case N_Mark.PTC_MAIN.WINDOW: {
                OnWindow(protocol_sub, data);
            } break;
            case N_Mark.PTC_MAIN.FILE: {
                OnFile(protocol_sub, data);
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
            case N_Mark.WINDOW.MIN: {
                Gb.mainWin.minimize();
            } break;
            case N_Mark.WINDOW.MAX: {
                Gb.mainWin.maximize();
                // FESend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MAX, {"name": "Lin"});
            } break;
            case N_Mark.WINDOW.CLOSE: {
                Gb.app.quit();
            } break;
            case N_Mark.WINDOW.REDU: {
                Gb.mainWin.unmaximize();
            } break;

            default:
                break;
        }
    }

    function OnFile(protocol_sub, data){
        if(data){
            try{
                data = JSON.parse(data);
            }catch(error){
                throw error;
            }
        }
        switch (protocol_sub) {
            case N_Mark.FILE.SHOW_CONT: {
                // TODO:
            } break;
            default:
                break;
        }
    }

}

module.exports = new IPC();