const net = require("net")

class Server {
    constructor(port)
    {
        this.events = [];

        //Usual events
        this.events["connection"] = [];
        this.events["error"] = [];
        this.events["disconnected"] = [];
        this.events["cerror"] = [];

        //Creating the server
        this.server = net.createServer((c) => {
            this.InternalEvent("connection", new ServerClient(c));
        });

        this.server.listen(port);

        this.server.on("error", (err) => {
            this.InternalEvent("error", err);
        });

        this.OnInternal("connection", (c) => {
            c.c.on("end", () => {
                this.InternalEvent("disconnected", new ServerClient(c));
            });

            c.c.on("error", (err) => {
                if (err.message.includes('ECONNRESET')) //Error which happends when the client exists randomly so yeah we handle it as disconnection
                    this.InternalEvent("disconnected", new ServerClient(c));
                else
                    this.InternalEvent("cerror", err);
            })
        })
    }

    InternalEvent(n, ...args)
    {
        if (this.events[n])
        {
            for (let i = 0; i < this.events[n].length; i++)
                this.events[n][i](...args);
        }
    }

    OnInternal(n, cb)
    {
        if (this.events[n])
            this.events[n][this.events[n].length] = cb;
    }
};

class ServerClient {
    constructor(c)
    {
        this.c = c;
        this.ip = c.remoteAddress;
    }

    Emit(n, obj)
    {
        this.c.write(JSON.stringify({n: n, obj: obj}), "utf-8");
    }
}

class Client {
    constructor(ip, port)
    {
        this.client = new net.Socket();

        this.client.connect(port, ip);
    }
};

module.exports = {
    Server: Server,
    Client: Client
};