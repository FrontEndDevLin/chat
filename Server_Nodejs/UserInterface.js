let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

function User() {
    let self = this;
    let UserSchema = new Schema({
        _id: { type: String },
        name: { type: String },
        pwd: { type: String },
        sn: { type: Number }
    });
    let UserModel = mongoose.model("Users", UserSchema);

    this.Insert = (doc, callback) => {
        let n = doc["name"], p = doc["pwd"], id = doc["id"];
        let sn = 10001; //TODO:
        if (!n || !p || !id) {
            return callback("missing params", false);
        }
        self.GetInfoById(id, { "_id": 1 }, (err, info) => {
            if (err) {
                return callback(err, false);
            }
            if (!info) {
                var user = new UserModel({
                    _id: id,
                    name: n,
                    pwd: p,
                    sn: sn
                });
                user.save( (err, result) => {
                    if (err) {
                        return callback(err, false);
                    }
                    if (result) {
                        return callback(null, true);
                    } else {
                        return callback("insert err", false);
                    }
                })
            } else {
                return callback("token is exists", false);
            }
        })

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
        UserModel.findOne({ "_id": token, "pwd": pwd }, { "sn": 1, "name": 1 }, (err, result) => {
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
}

module.exports = new User();