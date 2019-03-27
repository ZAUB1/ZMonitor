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

function handler(req, res)
{
    //verb.logok("-> Web Client connecting");

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

    /* const pathname = url.parse(req.url).pathname;
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

    res.end(); */

    if (req.method === 'POST')
    {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            switch (req.url)
            {
                case "/sysget":
                    const sys = JSON.stringify(Systems.GetSystems());
                    res.end(sys);

                    break;
                
                case "/shutdown":
                    const sockm = Systems.GetSock(JSON.parse(body).machine);
                    sockm.Emit("shutdown");

                    res.end();

                    break;

                case "/reboot":
                    const sockmr = Systems.GetSock(JSON.parse(body).machine);
                    sockmr.Emit("reboot");

                    res.end();

                    break;

                case "/insys":
                    Server.EmitToAll("insysup");

                    res.end();

                    break;

                default:

                    break;
            }
        });
    }
}

app.listen(9999);

const Server = new Sockets.Server(500, () => {
    verb.logok("-> Server listening on port : " + 9999);
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

    c.On("getsystems", () => {
        c.Emit("systemscb", Systems.GetSystems());
    });
});

Server.OnInternal("disconnected", (c) => {
    Systems.RmSystem(c.id);
    verb.log("-> Client disconnected : " + c.id + ", " + c.ip);
})