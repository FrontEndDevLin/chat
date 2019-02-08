let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let fs = require("fs");

function User() {
    let self = this;
    let UserSchema = new Schema({
        _id: { type: String },
        name: { type: String },
        pwd: { type: String },
        sn: { type: Number },
        avatar: { type: String }
    }, {
        versionKey: false
    });
    let UserModel = mongoose.model("Users", UserSchema);

    this.Insert = (doc, callback) => {
        let n = doc["name"], p = doc["pwd"], id = doc["id"];
        if (!n || !p || !id) {
            return callback("missing params", false);
        }
        GetAutoIncreaseSN((sn) => {
            self.GetInfoById(id, { "_id": 1 }, (err, info) => {
                if (err) {
                    return callback(err, false);
                }
                if (!info) {
                    let avatars = fs.readdirSync("./src/default/avatar");
                    let long = avatars.length;
                    let user = new UserModel({
                        _id: id,
                        name: n,
                        pwd: p,
                        sn: sn,
                        avatar: `./src/default/avatar/${avatars[parseInt(Math.random() * long)]}`
                    });
                    user.save( (err, result) => {
                        if (err) {
                            return callback(err, false);
                        }
                        if (result) {
                            console.log(`regist user ${n} sn ${sn}`);
                            return callback(null, sn);
                        } else {
                            return callback("insert err", false);
                        }
                    })
                } else {
                    return callback("token is exists", false);
                }
            })
        })
    }

    this.Find = (selector, option, callback) => {
        UserModel.find(selector, option, callback);
    }

    this.GetInfoBySN = (sn, option, callback) => {
        UserModel.findOne({ "sn": sn }, option || null, (err, result) => {
            return callback(err, result);
        })
    }

    this.GetInfoById = (id, option, callback) => {
        UserModel.findById(id, option || null, (err, result) => {
            return callback(err, result)
        })
    }

    this.UpdateOneBySN = (sn, doc, callback) => {
        UserModel.updateOne({ "sn": sn }, { "$set": doc }, (err, result) => {
            return callback(err, result);
        })
    }

    this.Auth = (token, pwd, callback) => {
        UserModel.findOne({ "_id": token, "pwd": pwd }, { "sn": 1, "name": 1, "avatar": 1 }, (err, result) => {
            if (err) {
                return callback(-200)
            } else {
                if (result) {
                    return callback(null, result)
                } else {
                    return callback(-100)
                }
            }
        })
    }

    /**
     * Auto increase sn
     */
    let AutoSNSchema = new Schema({
        _id: { type: String },
        sn: { type: Number }
    }, {
        versionKey: false
    });

    let AutoSNModel = mongoose.model("AutoSN", AutoSNSchema);
    function createAutoSNCol(callback){
        let field = new AutoSNModel({_id: "AUTOIncreaseSN", sn: 10001});
        field.save((err, result) => {
            if(err) throw err;
            return callback(result);
        });
    }

    function GetAutoIncreaseSN(callback){
        AutoSNModel.findById("AUTOIncreaseSN", (err, result) => {
            if(err) throw err;
            if(result) {
                SetAutoIncreaseSN(result["sn"], () => {});
                return callback(result["sn"]);
            } else {
                createAutoSNCol((result) => {
                    SetAutoIncreaseSN(result["sn"], () => {});
                    return callback(result["sn"])
                })
            }
        })
    }

    function SetAutoIncreaseSN(currentSN, callback){
        AutoSNModel.updateOne({ "_id": "AUTOIncreaseSN"}, {"$set": {"sn": ++currentSN}}, callback)
    }
}

module.exports = new User();