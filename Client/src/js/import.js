/**
 * Create by Lin_HR at 2019/1/20
 * 界面重要的DOM绑定操作
 */

function importDOM() {
    var ipc = require("./IPCEntry");
    var N_Mark = require("./Native_Mark");
    var NT_Mark = require("./Net_Mark");
    var G_space = require("./global");
    var Net = require("./NETEntry");

    $('#login_min').click(function () {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MIN)
    });
    $('#login_exit').click(function () {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.CLOSE)
    });

    $("#login").click(function () {
        var token = $("#token").val().trim(),
            pwd = $("#pwd").val().trim();
        if (token && pwd) {
            Net.send(NT_Mark.PTC_MAIN.AUTH, NT_Mark.AUTH.LOGIN_REQUEST, { "token": token, "pwd": pwd });
        }
    });

    $("#min").click(function () {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MIN);
    });

    $("#max").click(function () {
        $('#max').data('status', !($('#max').data('status')))
        if ($('#max').data('status')) {
            ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.MAX);
        } else {
            ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.REDU)
        }
    });

    $("#close").click(function () {
        ipc.NTSend(N_Mark.PTC_MAIN.WINDOW, N_Mark.WINDOW.CLOSE);
    });

    $("#funcTab li").click(function () {
        var actClass = "functab--active";
        if (!$(this).hasClass(actClass)) {
            var view = $(this).data("view");
            $(this).addClass(actClass).siblings().removeClass(actClass);
            $("#" + view).show().siblings().hide();
        }
    });

    $("#addreslist ul").on("click", function (e) {
        var tar = e.target;
        var destSN;
        while (tar != this) {
            if ($(tar).data("sn")) {
                destSN = $(tar).data("sn");
                break;
            }
            tar = $(tar).parent()[0];
        }
        if (destSN) {
            G_space.joinConversation(destSN);
        }
    });

    $("#chatlist ul").on("click", function (e) {
        var tar = e.target;
        var destSN;
        while (tar != this) {
            if ($(tar).data("sn")) {
                destSN = $(tar).data("sn");
                break;
            }
            tar = $(tar).parent()[0];
        }
        if (destSN) {
            var actClass = "chatitem___content--active";
            if ($(tar).hasClass(actClass)) {
                return;
            }
            $(tar).addClass(actClass).siblings().removeClass(actClass);
            G_space.loadChatLog(destSN);
        }
    });

    $("#editor").keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            G_space.sendMsg();
        }
    });

    $("#sendBtn").click(function () {
        G_space.sendMsg();
    })
}

module.exports = importDOM();