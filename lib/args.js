class ArgsLaunch {
    constructor()
    {
        this.needverbose = false;

        process.argv.forEach((val, index, array) => {
            switch (val)
            {
                case "-v":
                    this.needverbose = true;
                    break;

                case "-c":
                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    console.log("[\x1b[31m%s\x1b[0m] :: Prompt active", " WARN ");

                    setTimeout(() => {
                        process.stdout.write("\n");
                        process.stdout.write(":: => ");

                        readline.on("line", (input) => {
                            switch (input)
                            {

                                default:
                                    console.log(`:: Command not found: ${input}`);
                            };

                            process.stdout.write(":: => ");
                        });
                    }, 250);

                    break;

                default:
                    //
            }
        });
    }
}

module.exports = new ArgsLaunch;