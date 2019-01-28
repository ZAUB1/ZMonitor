const SysData = require("../../lib/systemdataget");
const io = require("socket.io-client");

const socket = io("http://localhost:9999"); //@TODO

SysData.FirstData(() => {
    socket.emit("client:hello", SysData.FirstGet());

    setInterval(() => {
        SysData.UpdateData();
    }, 5000);

    setInterval(() => {
        socket.emit("client:alive", SysData.Get());
    }, 60000);
});