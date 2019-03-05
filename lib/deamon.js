const fs = require("fs");
const path = require("path");
const spawn = require("child_process").spawn;
const verb = require("./verbose");

function Deamon() {
    const PidFile = () => {

    };

    const PidExists = () => {
        fs.readFile("app.pid", "utf8", (err, data) => {
            if (err)
                return false;

            return data;
        });
    };

    this.Start = () => {
        if (PidExists())
        {
            verb.log("[\x1b[31m%s\x1b[0m] -> Process already running", " WARN ");
            return;
        }


    };

    this.Stop = () => {
        if (!PidExists())
        {
            verb.log("[\x1b[31m%s\x1b[0m] -> Process not running", " WARN ");
            return;
        }
    };
};