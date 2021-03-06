const daemon = require("daemonize2").setup({
    main: "deamon.js",
    name: "server",
    pidfile: "deamons.pid"
});

switch (process.argv[2])
{
    case "start":
        daemon.start();
        break;

    case "stop":
        daemon.stop();
        break;
};