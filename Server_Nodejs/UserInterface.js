let mongoose = require("./MongoDB"),
    Schema = mongoose.Schema;
    
function User(){
    let UserSchema = new Schema({
        _id: {type: String},
        name: {type: String},
        pwd: {type: String},
        sn: {type: Number}
    });
    let UserModel = mongoose.model("Users", UserSchema);

    this.Insert = function(doc, callback){
        let n = doc["name"], p = doc["pwd"], id = doc["id"];
        let sn = 10001;
        if(!n || !p || !id){
            return callback("missing document");
        }
        var user = new UserModel({
            _id: id,
            name: n,
            pwd: p,
            sn: sn
        });
        user.save( function(err, result) {
            if(callback){
                return callback(err, result);
            }
        })
    }
}

module.exports = new User();