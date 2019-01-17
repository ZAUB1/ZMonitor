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
};

module.exports = new Verb;