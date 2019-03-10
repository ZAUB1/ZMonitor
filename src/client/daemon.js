const SysData = require("../../lib/systemdataget");
const Shutdown = require("../../lib/shutdown");
const Socket = require("zsockets");

const Client = new Socket.Client("127.0.0.1", 500);

console.log(":: ZMonitor client");

SysData.FirstData(() => {
    SysData.UpdateData();

    Client.Emit("client:hello", SysData.FirstGet());

    setInterval(() => {
        SysData.UpdateData();
    }, 5000);

    setInterval(() => {
        Client.Emit("client:alive", SysData.Get());
    }, 60000);

    Client.On('connect', () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        console.log(":: Connected to server.");
    });

    Client.On('disconnect', () => {
        console.log(":: Server lost, trying to reconnect.");
    })

    Client.On("shutdown", () => {
        Shutdown.Shutdown();
    });

    Client.On("reboot", () => {
        Shutdown.Reboot();
    });

    Client.On("insysup", () => {
        setInterval(() => {
            SysData.UpdateData();
            Client.Emit("client:updata", SysData.Get());
        }, 1000);
    });

    var tries = 0;

    /* setInterval(() => {
        if (!socket.connected)
        {
            socket.open();

            tries += 1;

            process.stdout.clearLine();
            process.stdout.cursorTo(0);

            console.log(":: Server not found yet, trying reconnection (" + tries + ")");

            if (tries >= 3)
            {
                console.log(":: Server not found, exiting.");
                process.exit();
            }
        }
        else
        {
            tries = 0;
        }
    }, 30000);

    var iy = 0;

    setInterval(() => {
        if (!socket.connected)
        {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);

            iy = (iy + 1) % 4;
            const dots = new Array(iy + 1).join(".");

            process.stdout.write("Connecting " + dots);
        }
    }, 500); */
});