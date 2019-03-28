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
const Sockets = require("zsockets");
const fs = require("fs");

const Systems = require("./systems");
const verb = require("../../lib/verbose");

var webclients = [0];
var webclientcur = 0;

function handler(req, res)
{
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

const Server = new Sockets.Server(500, () => {
    verb.logok("-> Server listening on port : " + 500);
});

const WSS = new Sockets.WebSocketServer(8080, () => {
    verb.logok("-> Web socket listening on port : " + 9999);
});

Server.OnInternal("connection", (c) => {
    const slot = Systems.systems.length;

    verb.log("-> Client connected : " + c.id + ", " + c.ip);

    c.On("client:hello", (sysdata) => {
        Systems.AddSystem(slot, sysdata, c);
    });

    c.On("client:alive", (sysdata) => {
        Systems.UpdateSystem(slot, sysdata);
    });

    c.On("client:updata", (sysdata) => {
        Systems.UpdateSystem(slot, sysdata);
    });
});

WSS.OnInternal("connection", (c) => {
    verb.log("-> Web Client connected");

    webclientcur += 1;

    c.On("getsystems", () => {
        c.Emit("systemscb", Systems.GetSystems());
        c.Emit("webconnections", webclients);
    });
});

Server.OnInternal("disconnected", (c) => {
    Systems.RmSystem(c.id);
    verb.log("-> Client disconnected : " + c.id + ", " + c.ip);
});

setInterval(() => {
    webclients[webclients.length] = webclientcur;
    webclientcur = 0;
}, 60000);