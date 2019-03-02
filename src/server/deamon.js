module.exports = {
    ChangeWeb: (stat) =>
    {
        switch (stat)
        {
            case 0:
                app.close();
                console.log("[\x1b[31m%s\x1b[0m] -> Web server stopped", " WARN ");

                break;

            case 1:
                app.listen(9999);
                verb.logok("-> Web server started");

                break;
        }
    },

    GetSys: () => {
        return Systems.GetSystems();
    }
}

const app = require("http").createServer(handler);
const io = require("socket.io")(app);
const fs = require("fs");

const Systems = require("./systems");
const verb = require("../../lib/verbose");

function handler(req, res)
{
    verb.logok("-> Web Client connecting");

    fs.readFile(__dirname + "/panel/index.html",

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

verb.logok("-> Server listening on port : " + 9999);

/* app.post("/addsystem", (req, res) => {

}); */

io.on("connection", (sock) => {
    const slot = Systems.systems.length;

    verb.log("-> Client connected : " + sock.id + ", " + sock.handshake.address);

    sock.on("client:hello", (sysdata) => {
        //if (!Systems.Known(sysdata.hostname))
            Systems.AddSystem(slot, sysdata);
    });

    sock.on("client:alive", (sysdata) => {
        Systems.UpdateSystem(slot, sysdata);
    });

    sock.on("disconnect", () => {
        verb.log("-> Client disconnected : " + sock.id + ", " + sock.handshake.address);
    });
});