(function(){
    window.jQuery = window.$ = require("./js/jquery-3.2.1.js");
    require("./js/import");
    var NT_Mark = require("./js/Net_Mark");
    var ipc = require("./js/IPCEntry");

    var G_space = require("./js/global");
    G_space.SetHost(ipc.GetServ());
    var host = G_space.GetHost();

    var ioScript = document.createElement("script");
    ioScript.src = host +"/socket.io/socket.io.js";
    document.body.appendChild(ioScript);
    ioScript.onload = function(){
        G_space.SetSocketCli(io(host));
        var Net = require("./js/NETEntry");
        
        require("./js/PTCHandle").start();
        Net.send(NT_Mark.PTC_MAIN.STATE, NT_Mark.STATE.CONNECT_REQUEST);
    }
})()