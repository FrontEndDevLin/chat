/**
 * create by Lin_HR at 2019/1/20
 * class CNTEntry: connection entry 
 * 保存socket信息的类
 */

function CNTEntry(socket){
    var oSocket = socket, id = socket["id"], sn;
    this.GetSocket = function () {
        return oSocket;
    }

    var activeTime = new Date().getTime();
    this.IsTimeout = function () {
        return new Date().getTime() - activeTime >= 180000 ? true : false;
    }

    this.UpdateActiveTime = function () {
        activeTime = new Date().getTime();
    }

    this.GetSocketId = function () {
        return id;
    }

    this.BindSocketSN = function (token) {
        sn = token;
    }

    this.GetSocketSN = function () {
        return sn;
    }
}

module.exports = CNTEntry;