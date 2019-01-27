function importDOM() {
    var ipc = require("./IPCEntry");
    var N_Mark = require("./Native_Mark");
    var NT_Mark = require("./Net_Mark");
    var G_space = require("./global");
    var Net = require("./NETEntry");

    $('#login_min').click(() => {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW,N_Mark.WINDOW.MIN)
    });
    $('#login_exit').click(() => { 
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW,N_Mark.WINDOW.CLOSE)
    });

    $("#login").click(function(){
        var token = $("#token").val().trim(),
            pwd = $("#pwd").val().trim();
        if(token && pwd){
            Net.send(NT_Mark.PTC_MAIN.AUTH, NT_Mark.AUTH.LOGIN_REQUEST, {"token": token, "pwd": pwd});
        }
    })

    $("#min").click(() => {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MIN);
    })

    $("#max").click(() => {
        $('#max').data('status', !($('#max').data('status')))
        if ($('#max').data('status')) {
            ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MAX);
        } else {
            ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.REDU)
        }
    })

    $("#close").click(() => {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.CLOSE);
    })
}

module.exports = importDOM();