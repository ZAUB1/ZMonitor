$(() => {
    var systems;
    var inpage = 0;
    var lastcl;
    var wclients;

    const WClient = new WebSocketWebClient(location.origin.split("http://").pop().split(":")[0], 8080);

    WClient.On("connected", () => {
        WClient.Emit("getsystems");
    });

    WClient.On("systemscb", (sys) => {
        console.log("Shit received")
        systems = sys;
    });

    WClient.On("webconnections", (webclients) => {
        wclients = webclients;

        console.log(wclients)

        const generatelabels = () => {
            let arr = [];

            for (let i = 0; i < wclients.length; i++)
                arr[i] = i + 1;

            return arr;
        };

        const ctx = document.getElementById("ingraph");
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: generatelabels(),
                datasets: [{
                    label: 'Web Connections',
                    data: wclients,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                legend: {
                    labels: {
                        fontColor: 'white'
                    },
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                }
            }
        });
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
    const systemsc = document.getElementById("systems");
    const home = document.getElementById("home");
    const counter = document.getElementById("connectedclients");

    selectmenu = function(id)
    {
        switch (id)
        {
            case 0:
                changetitle("ZMonitor");
                counter.innerHTML = systems.length;

                systemsc.style.opacity = 0;
                home.style.opacity = 1;

                break;
            case 1:
                changetitle("ZMonitor : Systems");
                showsystems();

                home.style.opacity = 0;
                systemsc.style.opacity = 1;

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