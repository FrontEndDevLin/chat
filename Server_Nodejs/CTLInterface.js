/**
 * Create by Lin_HR at 2019/2/8
 * Chatlog interface
 * 聊天记录接口文件
 */

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let User = require("./UserInterface");

function CTLInterface() {
    let CTLSchema = new Schema({
        from: { type: Number },
        dest: { type: Number },
        time: { type: Number },
        msg: { type: String },
        read: { type: Number },
        type: { type: String }
    }, {
            versionKey: false
        });

    let CTLModel = mongoose.model("chatlog", CTLSchema);

    this.Insert = (fromSN, destSN, msg, callback) => {
        let item = new CTLModel({
            "from": fromSN,
            "dest": destSN,
            "time": new Date().getTime(),
            "msg": msg,
            "read": 0,
            "type": "text"
        });

        item.save((err, result) => {
            if (err) throw err;
            callback(result["_id"]);
        })
    }

    this.ReadedMsg = (msgId, callback) => {
        CTLModel.updateOne({ "_id": msgId }, { "$set": { "read": 1 } }, (err, result) => {
            if (callback) return callback(err, result)
        })
    }

    /**
     * option {pno: Number, skip: Number, limit: Number}
     */
    this.GetChatLog = (sn1, sn2, option, callback) => {
        let pno = option["pno"], skip = option["skip"], limit = option["limit"], isGroup = option["isGroup"];
        if (typeof pno == "Number" && typeof skip == "Number") {
            skip = null;
        }
        skip = skip || limit * (pno - 1);

        if (!isGroup) {
            CTLModel.find(
                { "$or": [{ "from": sn1, "dest": sn2 }, { "from": sn2, "dest": sn1 }] },
                { "_id": 0, "read": 0 }
            ).sort({"time": 1}).skip(skip).limit(limit).exec(callback)
        }
    }
}

module.exports = new CTLInterface();