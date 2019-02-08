/**
 * create by Lin_HR at 2019/1/20
 * 全局存储空间，复用方法
 */
var NT_Mark = require("./Net_Mark");

function G_space() {
    var static_host = null;
    var static_IO = null;
    var static_sn = null;
    var static_avatar = null;
    var static_chatDeatil = {};

    this.SetHost = function (host) {
        static_host = host;
    }
    this.GetHost = function () {
        return static_host;
    }

    this.SetSocketCli = function (socketClient) {
        static_IO = socketClient;
    }
    this.GetSocketCli = function () {
        return static_IO;
    }

    this.SetSN = function (SN) {
        static_sn = SN;
    }
    this.GetSN = function () {
        return static_sn;
    }

    this.SetAvatar = function (avtDir) {
        static_avatar = avtDir;
    }
    this.GetAvatar = function (avtDir) {
        return static_avatar;
    }

    this.AddChatDetail = function (destSN) {
        if (!destSN) return;
        destSN = parseInt(destSN);
        static_chatDeatil[destSN] = { iptVal: "", name: "", avatar: "" };
    }

    this.SetChatDetail = function (destSN, option) {
        if (!destSN) return;
        destSN = parseInt(destSN);
        var destDetail = static_chatDeatil[destSN];
        if (!destDetail) return;
        for (var key in option) {
            destDetail[key] = option[key];
        }
    }

    this.GetChatDeatil = function (destSN) {
        return static_chatDeatil[destSN];
    }
}

G_space.prototype = {
    base64ToImgDir: function (base64String, imgType) {
        imgType = imgType || "jpg";
        return "data:image/" + imgType + ";base64," + base64String;
    },

    showFriendsList: function (oAyFriendsInfo) {
        var strFriendList = "";
        for (var i = 0; i < oAyFriendsInfo.length; i++) {
            var items = oAyFriendsInfo[i];
            var name = items["mkname"] ? items["mkname"] : items["name"];
            strFriendList += "<li class='friend__content clear' data-sn='" + items["sn"] + "'>" +
                "<div class='friend__avatar'>" +
                "<img src='" + this.base64ToImgDir(items["avatar"]) + "'>" +
                "</div>" +
                " <div class='friend__name'>" +
                "<span>" + name + "</span>" +
                "</div>" +
                "</li>"
        }
        $("#friendsList").html(strFriendList ? strFriendList : "你没朋友");
    },

    GetConversation: function (destSN) {
        var dom = $("#chatlist").find("li[data-sn='" + destSN + "']")[0];
        return dom ? dom : null;
    },

    joinConversation: function (destSN, isAuto) {
        if ($("#chatlist").css("display") == "none") {
            $("#chatlist").show().siblings().hide();
            $(".functab--active").removeClass("functab--active").siblings().addClass("functab--active")
        }
        if (!isAuto) {
            $("#chatlist ul li").removeClass("chatitem___content--active");
        }
        var Conv = this.GetConversation(destSN);
        if (Conv) {
            $(Conv).addClass("chatitem___content--active").prependTo("#chatlist ul");
        } else {
            var tar = $("#addreslist li[data-sn='" + destSN + "']");
            var avt = $(tar).find(".friend__avatar img").attr("src"),
                name = $(tar.find(".friend__name span")).html();
            var activeClass = !isAuto ? "chatitem___content--active" : "";
            var html = "<li class='chatitem___content " + activeClass + " clear' data-sn='" + destSN + "'>" +
                "<div class='chatitem___avatar lf'>" +
                "<img src='" + avt + "'>" +
                "</div>" +
                "<div class='chatitem___detail lf'>" +
                "<span>" + name + "</span>" +
                "<p></p>" +
                "</div>" +
                "<div class='chatitem__time rt'>" +
                "<span></span>" +
                "</div>" +
                "</li>";
            this.appendSession(destSN, isAuto);
            this.AddChatDetail(destSN);
            this.SetChatDetail(destSN, { "name": name, "avatar": avt });
            var Net = require("./NETEntry");
            Net.send(NT_Mark.PTC_MAIN.CHAT, NT_Mark.CHAT.GET_TARGET_AVATAR, { "destSN": destSN });
            $("#chatlist ul").prepend(html);
        }

        if (!isAuto) {
            this.loadChatLog(destSN);
        }
    },

    appendSession: function (destSN, isAuto) {
        var sessionHtml = "";
        if (!isAuto) {
            sessionHtml = "<div class='chatwin__session clear' data-sn='" + destSN + "'><p class='session__loadmore'><span>查看更多消息</span></p></div>";
            $(".chatwin__session").hide();
        } else {
            sessionHtml = "<div class='chatwin__session clear' data-sn='" + destSN + "' style='display: none;'><p class='session__loadmore'><span>查看更多消息</span></p></div>";
        }
        $("#session").append(sessionHtml);
    },

    loadChatLog: function (destSN) {
        if ($("#chatwinCover").css("display") == "block") {
            $("#chatwinCover").hide();
            $("#chatMsgWin").show();
            $("#chatwinEditor").show();
        }
        $("#session div[data-sn='" + destSN + "']").show().siblings().hide();
        var detail = this.GetChatDeatil(destSN);
        $("#chatwin_target").html(detail["name"]);
        $("#editor").html(detail["iptVal"]);
    },

    sendMsg: function () {
        var msg = $("#editor").html().trim();
        var destSN = this.getDestSN();
        if (msg && destSN) {
            var Net = require("./NETEntry");
            var data = { "destSN": destSN, "msg": msg };
            Net.send(NT_Mark.PTC_MAIN.CHAT, NT_Mark.CHAT.SEND_MESSAGE, data);
            data["fromSN"] = this.GetSN();
            this.printMsg(data);
            $("#editor").html("");
        }
    },

    printMsg: function (option) {
        var senderSn = option["fromSN"],
            msg = option["msg"];
        var isSelf = senderSn == this.GetSN() ? true : false;
        var destSN, avatar, identClassName;
        if (isSelf) {
            destSN = this.getDestSN();
            avatar = this.GetAvatar();
            identClassName = "right";
        } else {
            destSN = senderSn;
            avatar = this.GetChatDeatil(destSN)["avatar"];
            identClassName = "left";
        }
        var strHtmlMsg = "<div class='msgitem clear " + identClassName + "'>" +
            "<img src='" + avatar + "' class='msgitem__avatar'>" +
            "<div class='content__outer'>" +
            "<div class='msgitem__content'>" + msg + "</div>" +
            "</div></div>";
        $("#session div[data-sn='" + destSN + "']").append(strHtmlMsg);
    },

    // Current activity target
    getDestSN: function () {
        return $("#chatlist .chatitem___content--active").data("sn");
    }
}

module.exports = new G_space();