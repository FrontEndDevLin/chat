let mongoose = require("mongoose");

let uri = "mongodb://superAdmin:123abc@localhost:27017/Venssage?authSource=admin";

mongoose.connect(uri, {useNewUrlParser: true}, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log("Mongoose connection open to " + uri);
});

module.exports = mongoose;