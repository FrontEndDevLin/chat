/**
 * create by Lin_HR at 2019/1/29
 * connection list interface
 */

function CNTInterface(){
    var connectionList = {};

    this.Push = function (CNTEntry) {
        connectionList[CNTEntry.GetSocketId()] = CNTEntry;
    }

    this.GetConnectionList = function () {
        return connectionList;
    }

    this.GetConnectionById = function (id) {
        return connectionList(id);
    }

    this.GetConnectionBySN = function (sn) {
        for(var id in connectionList){
            if(connectionList[id].GetSocketSN() == sn) {
                return connectionList[id];
            }
        }
        return null;
    }
}