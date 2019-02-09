/**
 * Create by Lin_HR in 2019/1/31
 * The socket.io server model
 */

const HTTP = require("http");
const SIO = require("socket.io");
const Mark = require("./Mark");

function IoModle() {
    this.IoStart = function (Callback) {
        let PORT = 3000;
        let httpServ = HTTP.createServer().listen(PORT, () => {
            Callback(Mark.IO_EVENT.LISTENING, null, PORT);
        });
        let io = SIO(httpServ);
        io.on("connection", (socket) => {

            Callback(Mark.IO_EVENT.CONNECTION, socket);

            socket.on("data", (packge) => {
                Callback(Mark.IO_EVENT.DATA, socket, packge);
            });

            socket.on("disconnect", () => {
                Callback(Mark.IO_EVENT.CLOSE, socket);
            });

            socket.on("error", (err) => {
                Callback(Mark.IO_EVENT.ERROR, socket, err);
            });
        })
    }
}

module.exports = new IoModle();