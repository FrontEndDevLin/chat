/**
 * create by Lin_HR at 2019/1/20
 * login界面方法文件
 */

(function(){
    window.jQuery = window.$ = require("./js/jquery-3.2.1.js");
    var ipc = require("./js/IPCEntry");
    var N_Mark = require("./js/Native_Mark");
    var NT_Mark = require("./js/Net_Mark");
    var G_space = require("./js/global");

    var host = ipc.GetServ();
    var ioScript = document.createElement("script");
    ioScript.src = host +"/socket.io/socket.io.js";
    document.body.appendChild(ioScript);
    ioScript.onload = function(){
        G_space.SetSocketCli(io(host));
        var Net = require("./js/NETEntry");
        require("./js/PTCHandle").start();
        Net.send(NT_Mark.PTC_MAIN.STATE, NT_Mark.STATE.CONN_CHECK_REQUEST);
    }

    $('#login_min').click(() => {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW,N_Mark.WINDOW.LOGINMIN)
    })
    $('#login_exit').click(() => { 
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW,N_Mark.WINDOW.LOGINCLOSE)
    });

    $("#login").click(function(){
        // 直接模拟登陆成功
        var loginRes = true;
        if(loginRes){
            ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.SWITCH_TO_MAIN);
        }
    })
})()