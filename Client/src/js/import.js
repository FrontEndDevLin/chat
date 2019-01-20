(function () {
    var ipc = require("./js/IPCEntry");

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
})()