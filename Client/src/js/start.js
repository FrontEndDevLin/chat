(function(){
    window.jQuery = window.$ = require("./js/jquery-3.2.1.js");
    var ipc = require("./js/IPCEntry");
    require("./js/IPCParser").start();
    var G_space = require("./js/global");

    G_space.SetHost(ipc.GetServ());

    var host = G_space.GetHost();
    G_space.SetSocketCli(io(host));
    
    var socketClient = G_space.GetSocketCli();
    socketClient.emit("Z", JSON.stringify({MOD: 2, PTC: 11}));
    socketClient.on('Z', function(data){});

})()