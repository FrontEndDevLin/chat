
function net(){
    var G_space = require("./global");
    var socketClient = G_space.GetSocketCli();
    this.send = function(PTC_main, PTC_sub, data){
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

module.exports = new net();