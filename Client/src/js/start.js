(function(){
    window.jQuery = window.$ = require("./js/jquery-3.2.1.js");
    var ipc = require("./js/IPCEntry");
    require("./js/IPCParser").start();
    var G_space = require("./js/global");
    G_space.SetHost(ipc.GetServ());
    var host = G_space.GetHost();
    G_space.SetSocketCli(io(host));
    
    var Net = require("./js/net");
    
    Net.send(NT_Mark.PTC_MAIN.STATE, NT_Mark.STATE.CONNECTION_REQUEST);

})()