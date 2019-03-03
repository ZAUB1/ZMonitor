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
        console.log(":: Connected to server.");
    });

    socket.on('disconnect', () => {
        console.log(":: Server lost, exiting.");

        process.exit(); //Might change in the future for a proper standby "reconnection" state
    })
});