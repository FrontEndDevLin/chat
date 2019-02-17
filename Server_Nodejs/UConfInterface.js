/**
 * Create by Lin_HR at 2019/2/4
 * 用户好友、群组关系， 接入历史接口文件
 */

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let User = require("./UserInterface");

function UserConf() {
    let UserConfSchema = new Schema({
        _id: { type: Number },
        friends: { type: Array },
        groups: { type: Array },
        cth: { type: Array }
    }, {
            versionKey: false
        });

    let UserConfModel = mongoose.model("UserConf", UserConfSchema);

    this.Insert = (sn, callback) => {
        if (!sn) return;
        let confItem = new UserConfModel({
            _id: sn,
            friends: [],
            groups: [],
            cth: []
        });

        confItem.save((err, result) => {
            if (callback) {
                return callback(err, result);
            }
        });
    }

    this.GetFriends = (sn, callback) => {
        UserConfModel.findById(sn, { "friends": 1, "_id": 0 }, (err, result) => {
            if (err) throw err;
            let friends = result["friends"];
            if (!friends.length) {
                return callback(null, friends);
            } else {
                let selector = { "$or": [] };
                for (let tmp of friends) {
                    selector["$or"].push({ "sn": tmp["sn"] });
                }
                // console.log(JSON.stringify(selector));
                User.Find(selector, { "sn": 1, "name": 1, "avatar": 1 }, (err, result) => {
                    result = JSON.parse(JSON.stringify(result));
                    for (let tmp of result) {
                        for (let fir of friends) {
                            if (fir["sn"] == tmp["sn"]) {
                                tmp["mkname"] = fir["mkname"];
                                break;
                            }
                        }
                    }
                    return callback(err, result)
                })
            }
        })
    }

    this.BecomeFriends = (sn1, sn2, callback) => {
        let progress = 0;
        UserConfModel.updateOne({ "_id": sn1 }, { "$push": { "friends": { "sn": sn2, "mkname": "" } } }, (err, result) => {
            if (err) throw err;
            if (result["ok"] == 1) {
                progress += 50;
                if (progress == 100) {
                    return callback(true);
                }
            }
        });

        UserConfModel.updateOne({ "_id": sn2 }, { "$push": { "friends": { "sn": sn1, "mkname": "" } } }, (err, result) => {
            if (err) throw err;
            if (result["ok"] == 1) {
                progress += 50;
                if (progress == 100) {
                    return callback(true);
                }
            }
        });
    }

    this.SetRecentContacts = (sn, destSN, callback) => {
        // let progress = 0;
        UserConfModel.findById(sn, { "_id": 0, "cth": 1 }, (err, result) => {
            if (err) throw err;
            let contactHis = JSON.parse(JSON.stringify(result["cth"]));
            let exists = false;
            for (let contactHisItem of contactHis) {
                if (contactHisItem["sn"] == destSN) {
                    contactHisItem["t"] = new Date().getTime();
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                contactHis.push({ "sn": destSN, "t": new Date().getTime() });
            } else {
                contactHis = contactHis.sort(compare("t"));
            }
            if (contactHis.length > 30) {
                let splitCount = contactHis.length - 30;
                contactHis.splice(30, splitCount);
            }
            UserConfModel.updateOne({ "_id": sn }, { "$set": { "cth": contactHis } }, (err, result) => {
                if (callback) {
                    return callback(err, result);
                }
            })
        });
    }

    this.GetRecentContacts = (sn, callback) => {
        UserConfModel.findById(sn, {"cth": 1, "_id": 0}, (err, result) => {
            if(err) {
                return callback(err, null);
            } else {
                return callback(null, result["cth"]);
            }
        })
    }

    function compare(property, num) {
        return function (obj1, obj2) {
            let value1 = obj1[property];
            let value2 = obj2[property];
            if (!num || num == -1) {
                return value2 - value1;     // 降序
            } else if (num == 1) {
                return value1 - value2;
            }
        }
    }
}

module.exports = new UserConf();