function G_space(){
    var static_host = null;
    var static_IO = null;
    var static_sn = null;

    this.SetHost = function(host){
        static_host = host;
    }
    this.GetHost = function(){
        return static_host;
    }

    this.SetSocketCli = function(socketClient){
        static_IO = socketClient;
    }
    this.GetSocketCli = function(){
        return static_IO;
    }

    this.SetSN = function(SN){
        static_sn = SN;
    }
    this.GetSN = function(){
        return static_sn;
    }
}

module.exports = new G_space();