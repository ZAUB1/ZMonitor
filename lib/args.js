const deam = require("../src/server/deamon");

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
                    process.stdout.write('\x1b[2J');

                    process.stdout.write(":: ZMonitor starting...\n\n");

                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    console.log("[\x1b[31m%s\x1b[0m] :: Prompt active", " WARN ");

                    setTimeout(() => {
                        process.stdout.write("\n");
                        process.stdout.write(":: => ");

                        readline.on("line", (input) => {
                            if (input == "")
                            {
                                //
                            }
                            else if (input == "help")
                            {
                                console.log("\x1b[4m%s\x1b[0m%s\n", "Available commands", " :");
                                console.log("• web [\x1b[32mstart\x1b[0m|\x1b[31mstop\x1b[0m] : Start / stop the web interface");
                                console.log("• list : Lists all connected clients");
                                console.log("• clear : It's gotta be clear right ?");
                                console.log("• exit : It exits ?");
                                console.log("• help : Shows this page");
                            }
                            else if (input.includes("web"))
                            {
                                if (input.includes("start"))
                                    deam.ChangeWeb(1);
                                else if (input.includes("stop"))
                                    deam.ChangeWeb(0);
                                else
                                    console.log(":: Web Usage: [\x1b[32mstart\x1b[0m|\x1b[31mstop\x1b[0m]");
                            }
                            else if (input == "list")
                            {
                                const cursys = deam.GetSys();

                                for (let i = 0; i < cursys.length; i++)
                                {
                                    console.log(i + " : " + cursys[i].hostname + " (" + cursys[i].ifips[0].n + " : " + cursys[i].ifips[0].addr + ")");
                                }
                            }
                            else if (input == "clear")
                            {
                                process.stdout.write('\x1b[2J');
                            }
                            else if (input == "exit")
                            {
                                process.exit();
                            }
                            else
                            {
                                console.log(`:: Command not found: ${input}`);
                            }

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