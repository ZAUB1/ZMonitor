const os = require("os");

class SysData {
    constructor()
    {
        this.cpumodel = "";
        this.arch = "";
        this.hostname = "";
        this.platform = "";
        //this.basecpufreq;
        this.corecount = 0;

        this.totalmem = 0;
        this.cpufreq;
        this.freemem;
        this.cpus = [];
        this.loadavg;
        this.uptime = 0;

        this.cpuloadper = 0;

        this.net;
        this.ifips = [];
    }

    FirstData(cb)
    {
        const cpuinfo = os.cpus();

        this.cpumodel = cpuinfo[0].model;
        this.corecount = cpuinfo.length;
        this.cpufreq = cpuinfo[0].speed;

        this.totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        this.arch = os.arch();
        this.hostname = os.hostname();
        this.platform = os.platform();

        this.net = os.networkInterfaces();

        Object.keys(this.net).forEach((ifname) => {
            let alias = 0;

            this.net[ifname].forEach((iface) => {
                if ('IPv4' !== iface.family || iface.internal !== false) //Internal IPs
                    return;

                if (alias >= 1)
                    this.ifips[this.ifips.length] = {n: ifname + " : " + alias, addr: iface.address};
                else
                    this.ifips[this.ifips.length] = {n: ifname, addr: iface.address};

                ++alias;
            });
        });

        this.UpdateData();

        if (cb)
            cb();
    }

    CpuLoad(cores)
    {
        let cbt = 0;
        let cwt = 0;

        cores.forEach(core => {
            cbt += core.times.user + core.times.nice + core.times.sys;
            cwt += core.times.idle;
        });

        cwt += cbt;

        const wtd = cwt - this._prevWorkTime;
        const load = !wtd ? wtd : 100 * (cbt - this._prevBusyTime) / (wtd);

        this._prevWorkTime = cwt;
        this._prevBusyTime = cbt;

        return load;
    }

    UpdateData()
    {
        const cpuinfo = os.cpus();

        this.freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        this.usedmem = (this.totalmem - this.freemem).toFixed(2);
        this.cpus = cpuinfo;

        this.cpuloadper = this.CpuLoad(cpuinfo).toFixed(1);

        this.uptime = os.uptime();
        this.loadavg = os.loadavg();
    }

    FirstGet()
    {
        return {
            cpumodel: this.cpumodel,
            arch: this.arch,
            hostname: this.hostname,
            corecount: this.corecount,
            totalmem: this.totalmem,
            cpufreq: this.cpufreq,
            freemem: this.freemem,
            cpus: this.cpus,
            loadavg: this.loadavg,
            uptime: this.uptime,
            cpuloadper: this.cpuloadper,
            ifips: this.ifips
        };
    }

    Get()
    {
        return {
            freemem: this.freemem,
            usedmem: this.usedmem,
            cpus: this.cpus,
            loadavg: this.loadavg,
            uptime: this.uptime,
            cpuloadper: this.cpuloadper,
        };
    }
}

module.exports = new SysData;
