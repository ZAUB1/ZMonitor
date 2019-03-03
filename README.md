
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
|`list`|Shows a list of connected clients with their host name and main IP|
|`clear`          		|Clears the console.|
|`exit`       			|Exits.|
|`help`       			|Shows all available commands.|

## Usage (client)

Here are the basic commands to start / stop the client in a few different ways :

|                |Command                        |What for ?                   |
|----------------|-------------------------------|-----------------------------|
|Start           |`npm run client-start`         |Starts the client deamon and stores the process ID in a file.|
|Stop            |`npm run client-stop`          |Stops the server (:warning: Will only work if the client is running via the deamon).|
|Start (verbose) |`npm run client-verbose`       |Launches the client in a non daemonized way with a verbose log of what's happening.|

:pushpin: The client has a "reconnection feature", it will try 3 times (90 seconds) before exiting in case the server isn't available yet or has crashed for some reason.
