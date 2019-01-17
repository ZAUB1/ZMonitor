const app = require("http").createServer(handler);
const io = require("socket.io")(app);
const fs = require("fs");

const Systems = require("./systems");
const verb = require("../../lib/verbose");

function handler(req, res)
{
    fs.readFile(__dirname + "/index.html",

    (err, data) => {
        if (err)
        {
            res.writeHead(500);
            return res.end("Error loading index.html");
        }

        res.writeHead(200);
        res.end(data);
    });
}

app.listen(9999);

io.on("connection", (sock) => {
    verb.log("-> Client connected : " + sock.id + ", " + sock.handshake.address);

    sock.on("disconnect", () => {
        verb.log("-> Client disconnected : " + sock.id + ", " + sock.handshake.address);
    });
});