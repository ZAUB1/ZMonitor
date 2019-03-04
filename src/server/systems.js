const fs = require("fs");
const verb = require("../../lib/verbose");

class Systems {
    constructor()
    {
        this.systems = [];
        this.socks = [];

        fs.readFile("systems.json", 'utf8', (err, data) => {
            if (err)
                this.UpdateDb();
            else
                this.systems = JSON.parse(data);
        });
    }

    UpdateDb()
    {
        const arr = JSON.stringify(this.systems);

        fs.writeFile("systems.json", arr, (err) => {
            if (err)
                verb.log("Error while creating systems DB: " + err.message)

            verb.log("F OK");
        });
    }

    AddSystem(slot, data, sock)
    {
        this.systems[slot] = {
            cpumodel: data.cpumodel,
            arch: data.arch,
            hostname: data.hostname,
            corecount: data.corecount,
            totalmem: data.totalmem,
            cpufreq: data.cpufreq,

            loadavg: data.loadavg,
            uptime: data.uptime,

            usedmem: data.usedmem,
            cpuload: data.cpuloadper,

            usedmemavg: [data.usedmem],
            cpuloadavg: [data.cpuloadper],

            ifips: data.ifips,

            sock: sock.id,
            ///sockthing: sock
        }

        this.socks[slot] = sock;
    }

    RmSystem(sock)
    {
        this.systems.splice(this.systems.findIndex(x => x.sock == sock), 1);
    }

    UpdateSystem(slot, data)
    {
        this.systems[slot].usedmem = data.usedmem;
        this.systems[slot].cpuload = data.cpuloadper;

        this.systems[slot].usedmemavg[this.systems[slot].usedmemavg.length] = data.usedmem;
        this.systems[slot].cpuloadavg[this.systems[slot].cpuloadavg.length] = data.cpuloadper;
    }

    GetSystems()
    {
        return this.systems;
    }

    GetSock(machine)
    {
        return this.socks[machine];
    }
};

module.exports  = new Systems;