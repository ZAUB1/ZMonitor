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
const url = require("url");
const path = require("path");

const Systems = require("./systems");
const verb = require("../../lib/verbose");

var webclients = [0];
var webclientcur = 0;

var lram = 0.0;
var lcpu = 0.0;

function handler(req, res)
{
    const pathname = url.parse(req.url).pathname;
    const ext = path.extname(pathname);
    if (ext)
    {
        if(ext === ".css")
        {
            res.writeHead(200, {"Content-Type": "text/css"});
            res.write(fs.readFileSync(__dirname + pathname, "utf8"));
        }
        else if (ext === ".js")
        {
            res.writeHead(200, {"Content-Type": "text/javascript"});
            res.write(fs.readFileSync(__dirname + pathname, "utf8"));
        }
    }
    else
    {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(fs.readFileSync(__dirname + "/panel/index.html", "utf8"));
    }

    res.end();
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
        c.Emit("avg", {ram: lram, cpu: lcpu});
    });
});

Server.OnInternal("disconnected", (c) => {
    Systems.RmSystem(c.id);
    verb.log("-> Client disconnected : " + c.id + ", " + c.ip);
});

setInterval(() => {
    webclients[webclients.length] = webclientcur;
    webclientcur = 0;

    const sys = Systems.GetSystems();

    lram = 0.0;

    for (let i = 0; i < sys.length; i++)
        lram += parseFloat(sys[i].usedmem);

    lram = lram / sys.length;

    lcpu = 0.0;

    for (let i = 0; i < sys.length; i++)
        lcpu += parseFloat(sys[i].cpuload);

    lcpu = (lcpu / sys.length).toFixed(1);
}, 6000);