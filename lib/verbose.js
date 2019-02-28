const args = require("./args");

class Verb {
    constructor()
    {
        this.log = this.Log;
    }

    Log(str)
    {
        if (args.needverbose)
            console.log(str);
    }

    logok(str)
    {
        if (args.needverbose)
            console.log("[\x1b[32m%s\x1b[0m] " + str, "  OK  ");
    }
};

module.exports = new Verb;