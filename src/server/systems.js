const fs = require("fs");
const verb = require("../../lib/verbose");

class Systems {
    constructor()
    {
        this.systems = [];

        fs.readFile("systems.json", 'utf8', (err, data) => {
            if (err)
                this.UpdateDb();
            else
                this.systems = JSON.parse(data);
        });
    }

    UpdateDb()
    {
        const arr = JSON.stringify(this.systems);

        fs.writeFile("systems.json", arr, (err) => {
            if (err)
                verb.log("Error while creating systems DB: " + err.message)

            verb.log("F OK");
        });
    }

    AddSystem(data)
    {

    }

    GetSystems()
    {
        return this.systems;
    }
};

module.exports  = new Systems;