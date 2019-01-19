(function () {
    var ipc = require("./js/IPCEntry");
    require("./js/IPCParser").start();

    window.jQuery = window.$ = require("./js/jquery-3.2.1.js");

    $("#min").click(() => {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MIN);
    })

    $("#max").click(() => {
        $('#max').data('status', !($('#max').data('status')))
        if($('#max').data('status')){
            ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MAX);
        }else{
            ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.REDU)
        }
    })

    $("#close").click(() => {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.CLOSE);
    })

    // $("#file").click(()=>{
    //     ipc.NTSend(N_Mark.PTC_MAIN.FILE, N_Mark.FILE.SHOW_CONT);
    // })
})()