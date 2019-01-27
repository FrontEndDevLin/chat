
function Net(){
    var G_space = require("./global");
    var NT_Mark = require("./Net_Mark");
    this.send = function(PTC_main, PTC_sub, data){
        var socketClient = G_space.GetSocketCli();
        if(data){
            try {
                data = JSON.stringify(data);
            } catch (error) {
                throw error;
            }
        }
        var oData = {PTC_MAIN: PTC_main, PTC_SUB: PTC_sub, data: data};
        socketClient.emit(NT_Mark.SEND, JSON.stringify(oData));
    }
}

module.exports = new Net();