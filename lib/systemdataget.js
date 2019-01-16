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

        this.loadpercent = 0;
        this.currcpufreq = 0;
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

        this.UpdateData();

        cb();
    }

    UpdateData()
    {
        const cpuinfo = os.cpus();

        this.freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        this.usedmem = (this.totalmem - this.freemem).toFixed(2);
        this.cpus = cpuinfo;

        var tu = 0.0;
        var ti = 0.0;
        var sp = 0.0;

        for (let i = 0; i < this.corecount; i++)
        {
            tu += cpuinfo[i].times.user;
            tu += cpuinfo[i].times.nice;
            tu += cpuinfo[i].times.sys;

            ti += cpuinfo[i].times.idle;

            sp += cpuinfo[i].speed;
        }

        this.loadpercent = ((tu / (tu + ti)) * 100).toFixed(1);
        this.currcpufreq = sp / this.corecount;

        this.uptime = os.uptime();
        this.loadavg = os.loadavg();
    }
}

module.exports = SysData;