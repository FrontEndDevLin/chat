/**
 * create by Lin_HR at 2019/1/15
 * 原生操作模块, 路由分派
 */

const ipcMain = require('electron').ipcMain;
const { BrowserWindow } = require('electron');
const N_Mark = require('./Mark');
const ini = require("ini");
const fs = require("fs");
let Gb = require("./Global");

function IPC() {
    var ipcEvent = null;
    this.start = function () {
        ipcMain.on("NT", (event, protocol_main, protocol_sub, data) => {
            ipcEvent = event;
            OnParse(protocol_main, protocol_sub, data)
        });

        ipcMain.on("NTSYNC", (event, protocol_main, protocol_sub, data) => {
            ipcEvent = event;
            OnParse(protocol_main, protocol_sub, data)
        });
    }

    // 同步回传给前端
    function FESendSync(data) {
        if (!ipcEvent || !data) return;
        ipcEvent.returnValue = data;
    }

    function OnParse(protocol_main, protocol_sub, data) {
        switch (protocol_main) {
            case N_Mark.PTC_MAIN.WINDOW: {
                OnWindow(protocol_sub, data);
            } break;
            case N_Mark.PTC_MAIN.FILE: {
                OnFile(protocol_sub, data);
            } break;
            case N_Mark.PTC_MAIN.STATE: {
                OnState(protocol_sub, data);
            } break;
            default:
                break;
        }
    }

    function OnWindow(protocol_sub, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw error;
            }
        }
        switch (protocol_sub) {
            case N_Mark.WINDOW.MIN: {
                Gb.win.minimize();
            } break;
            case N_Mark.WINDOW.MAX: {
                Gb.win.maximize();
                // FESend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MAX, {"name": "Lin"});
            } break;
            case N_Mark.WINDOW.CLOSE: {
                Gb.app.quit();
            } break;
            case N_Mark.WINDOW.REDU: {
                Gb.win.unmaximize();
            } break;
            case N_Mark.WINDOW.FLASH_FRAME: {
                // console.log(72)
                Gb.win.flashFrame(true);
            } break;
            default:
                break;
        }
    }

    function OnFile(protocol_sub, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw error;
            }
        }
        switch (protocol_sub) {
            case N_Mark.FILE.GET_HOST: {
                var info = ini.parse(fs.readFileSync("./sys/config.ini", 'UTF-8'));
                var ptc = info["host"]["main_host_ptc"],
                    host = info["host"]["main_host_addr"],
                    port = info["host"]["main_host_port"];
                var serverHost = `${ptc}://${host}:${port}`;
                FESendSync(serverHost);
            } break;
            default:
                break;
        }
    }

    function OnState(protocol_sub, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                throw error;
            }
        }
        switch (protocol_sub) {
            case N_Mark.STATE.LOGIN_ACCESS: {
                Gb.win.setSize(900, 620);
                Gb.win.center();
            } break;

            default:
                break;
        }
    }
}

module.exports = new IPC();