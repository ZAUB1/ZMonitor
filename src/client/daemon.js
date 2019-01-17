const SysData = require("../../lib/systemdataget");
const io = require("socket.io-client");

const socket = io("http://localhost:9999"); //@TODO

SysData.FirstData(() => {
    setInterval(() => {
        SysData.UpdateData();
    }, 5000);
});