const platform = require("os").platform();

console.log(platform)
switch (platform)
{
    case "win32":
        module.exports = {
            Shutdown: function() //Not tested
            {
                const spawn = require('child_process').spawn;
                const path = require('path');

                const args = [ '/s', '/d', 'u:4:5', '/f', '/t', '0' ];

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
            },

            Reboot: function() //Not tested
            {
                const spawn = require('child_process').spawn;
                const path = require('path');

                const args = [ '/r', '/d', 'u:4:5', '/f', '/t', '0' ];

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
            },
        };

        break;

    case "linux":
        module.exports = {
            Shutdown: function()
            {
                const exec = require("child_process").exec;

                exec("shutdown -h now", (error, stdout, stderr) => {
                    console.log(stdout);
                });
            },

            Reboot: function()
            {
                const exec = require("child_process").exec;

                exec("shutdown -r now", (error, stdout, stderr) => {
                    console.log(stdout);
                });
            }
        };

        break;
}