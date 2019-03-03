const SysData = require("../../lib/systemdataget");
const io = require("socket.io-client");

const socket = io("http://localhost:9999"); //@TODO

console.log(":: ZMonitor client");

SysData.FirstData(() => {
    socket.emit("client:hello", SysData.FirstGet());

    setInterval(() => {
        SysData.UpdateData();
    }, 5000);

    setInterval(() => {
        socket.emit("client:alive", SysData.Get());
    }, 60000);

    socket.on('connect', () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        console.log(":: Connected to server.");
    });

    socket.on('disconnect', () => {
        console.log(":: Server lost, exiting.");

        process.exit(); //Might change in the future for a proper standby "reconnection" state
    })

    var tries = 0;

    setInterval(() => {
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
    }, 500);
});