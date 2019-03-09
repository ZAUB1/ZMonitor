const platform = require("os").platform();

switch (platform)
{
    case "win32":
        const spawn = require('child_process').spawn;
        const path = require('path');

        const Action = (args) => {
            if (typeof args === 'string')
                args = [ args ];

            const prog = path.join(process.env.SystemRoot, 'System32', 'shutdown.exe');
            const child = spawn(prog, args, {});

            child.on('error', (err) => {
                return;
            });

            child.on('exit', (code) => {
                console.info("Exit code: ", code);
                return;
            });

            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);

            return child;
        };

        module.exports = {
            Shutdown: function()
            {
                Action([ '/s', '/d', 'u:4:5', '/f', '/t', '0' ]);
            },

            Reboot: function()
            {
                Action([ '/r', '/d', 'u:4:5', '/f', '/t', '0' ]);
            },
        };

        break;

    case "linux":
        const exec = require("child_process").exec;

        module.exports = {
            Shutdown: function()
            {
                exec("shutdown -h now", (error, stdout, stderr) => {
                    console.log(stdout);
                });
            },

            Reboot: function()
            {
                exec("shutdown -r now", (error, stdout, stderr) => {
                    console.log(stdout);
                });
            }
        };

        break;
}