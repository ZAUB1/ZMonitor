const SysDataLib = require("../../lib/systemdataget");
const SysData = new SysDataLib;

SysData.FirstData(() => {
    setInterval(() => {
        SysData.UpdateData();
    }, 5000);
});