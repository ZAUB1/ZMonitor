$(() => {
    var systems;
    var inpage = 0;
    var lastcl;

    $.post('/sysget', "", (data) => {
        systems = JSON.parse(data);
    });

    arrowhover = function(_this)
    {
        const arrow = _this.childNodes[1];
        arrow.style.opacity = 1;
    }

    arrowaway = function(_this)
    {
        const arrow = _this.childNodes[1];

        if (arrow.classList[0] == "arrow1" && inpage == 1)
        {
            arrow.style.opacity = 1;
            lastcl = arrow;
        }
        else if (arrow.classList[0] == "arrow2" && inpage == 2)
        {
            arrow.style.opacity = 1;
            lastcl = arrow;
        }
        else
            arrow.style.opacity = 0;
    }

    const title = document.getElementById("titletext");
    const systemsc = document.getElementById("systems")

    selectmenu = function(id)
    {
        switch (id)
        {
            case 0:
                changetitle("ZMonitor");

                systemsc.style.opacity = 0;

                break;
            case 1:
                changetitle("ZMonitor : Systems");
                showsystems();
                systemsc.style.opacity = 1;

                $.post('/insys', "", (data) => {
                    setInterval(() => {
                        $.post('/sysget', "", (data) => {
                            systems = JSON.parse(data);
                        });

                        showsystems();
                    }, 500);
                });

                break;
            case 2:
                intypezone = true;

                break;
        }

        if (lastcl)
        {
            lastcl.style.opacity = 0;
            lastcl = null;
        }
    }

    changetitle = function(str)
    {
        title.style.opacity = 0;

        setTimeout(() => {
            title.innerHTML = str;
            title.style.opacity = 1;
        }, 200);
    }

    showsystems = function()
    {
        var context = "";

        for (let i = 0; i < systems.length; i++)
        {
            var oslogo = "";
            var avgmem = 0.0;

            for (let ii = 0; ii < systems[i].usedmemavg.length; ii++)
                avgmem += parseInt(systems[i].usedmemavg[ii]);

            avgmem = (avgmem / systems[i].usedmemavg.length).toFixed(2);

            switch (systems[i].platform)
            {
                case "win32":
                    oslogo = "windows";
                    break;

                case "linux":
                    oslogo = "linux";
                    break;

                case "darwin":
                    oslogo = "apple";
                    break;
            }

            context += "<div id=system>\
                    <div id=machinelogo>\
                        <span class='mdi mdi-" + oslogo + "' aria-hidden></span>\
                    </div>\
                    <div id=litsep></div>\
                    <div id=hostname>Hostname : " + systems[i].hostname + " </div>\
                    <div id=ip>IP : " + systems[i].ifips[0].addr + " </div>\
                    <div id=uptime>Uptime : " + systems[i].uptime + "</div>\
                    <div id=cpu>CPU : " + systems[i].cpumodel + " (" + systems[i].cpuload + "%) </div>\
                    <div id=memory>Memory: " + systems[i].usedmem + " / "+ systems[i].totalmem + "Gb (avg: " + avgmem + "Gb)</div>\
                    <div id=os>OS : " + systems[i].platform + " </div>\
                    <div id=comsep></div>\
                    <div id=shutdown onclick='sendshutdown( " + i + " )'><span class='mdi mdi-power' aria-hidden></span><div id=shuttext>Shutdown</div></div>\
                    <div id=reboot onclick='sendreboot( " + i + " )'><span class='mdi mdi-rotate-right' aria-hidden></span><div id=shuttext>Reboot</div></div>\
                </div>";
        }

        systemsc.innerHTML = context;
    }

    sendshutdown = function(machine)
    {
        $.post('/shutdown', JSON.stringify({machine: machine}), (data) => {
            //
        });
    }

    sendreboot = function(machine)
    {
        $.post('/reboot', JSON.stringify({machine: machine}), (data) => {
            //
        });
    }
});