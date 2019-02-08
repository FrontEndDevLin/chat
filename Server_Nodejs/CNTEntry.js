/**
 * create by Lin_HR in 2019/1/20
 * class CNTEntry: connection entry 
 * 保存socket信息的类
 */

function CNTEntry(socket){
    let oSocket = socket, id = socket["id"], sn;
    this.GetSocket = function () {
        return oSocket;
    }

    let activeTime = new Date().getTime();
    this.IsTimeout = function () {
        return new Date().getTime() - activeTime >= 180000;
    }

    this.UpdateActiveTime = function (timestamp) {
        activeTime = timestamp;
    }

    this.GetId = function () {
        return id;
    }

    this.SetSN = function (token) {
        sn = token;
    }

    this.GetSN = function () {
        return sn;
    }
}

module.exports = CNTEntry;