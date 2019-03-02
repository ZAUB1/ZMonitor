# ZMonitor
A standalone, free & open-source monitoring solutions for multiple servers / workstations

Currently under development..

## First setup :
```sh
# Install dependencies
$ npm install
```

## Usage (server)

Here are the basic commands to start the server in a few different ways :

|                |Command                        |What for ?                   |
|----------------|-------------------------------|-----------------------------|
|Start           |`npm run server-start`         |Starts the server deamon and stores the process ID in a file.            |
|Stop            |`npm run server-stop`          |Stops the server (:warning: Will only work if the server is running via the deamon).            |
|Start (verbose) |`npm run server-verbose`       |Launches the server in a non daemonized way with a verbose log of what's happening.|
|Start (console) |`npm run server-console`       |Launches the server in a non daemonized way with a verbose log of what's happening and a console with a few different possibilities.|

In console commands :

|Command                        |What for ?                   |
|-------------------------------|-----------------------------|
|`web [start / stop]`           |Starts / stops the web interface (default port: **9999**).         |
|`clear`          		|Clears the console.|
|`exit`       			|Exits.|
|`help`       			|Shows all available commands.|

