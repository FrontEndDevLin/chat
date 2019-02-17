/**
 * create by Lin_HR in 2019/1/29
 * connection list interface
 */

function CNTInterface(){
    let CNTEntry = require("./CNTEntry");
    let connectionList = {};
    let connectionAuthList = {};

    this.PushConnection = function (socket) {
        let id = socket["id"];
        if(!connectionList[id]){
            connectionList[id] = new CNTEntry(socket);
        }
    }

    this.GetConnectionBySocket = function (socket) {
        let id = socket["id"];
        return connectionList[id];
    }

    this.GetConnectionList = function () {
        return connectionList;
    }

    this.GetConnectionById = function (id) {
        return connectionList(id);
    }

    this.BindSNToConnection = function (socket, sn) {
        let id = socket["id"];
        connectionList[id].SetSN(sn);
        connectionAuthList[sn] = id;
    }

    this.GetConnectionBySN = function (sn) {
        return connectionList[connectionAuthList[sn]];
    }

    this.RemoveConnectById = function (socketId) {
        delete connectionList[socketId];
    }

    this.PrintConnectCount = function () {
        let count = 0;
        for (var k in connectionList) {
            count++;
        }
        console.log(`[Connections: ${count}]`);
    }
}

module.exports = new CNTInterface();