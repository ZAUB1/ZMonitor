const daemon = require("daemonize2").setup({
    main: "daemon.js",
    name: "client",
    pidfile: "deamonc.pid"
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