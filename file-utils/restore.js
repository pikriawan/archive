const fs = require("fs");
const http = require("http");
const os = require("os");
const zlib = require("zlib");

const port = 3000;
const backupFile = process.argv[2];

if (!fs.existsSync(backupFile)) {
    console.log("File doesn't exists");
    process.exit(1);
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/octet-stream");

    const readStream = fs.createReadStream(backupFile);
    const unzip = zlib.createGunzip();

    readStream
        .on("error", (err) => {
            console.log("Read error: ". err);
            res.statusCode = 500;
            res.end("Internal server error");
        })
        .pipe(unzip)
        .on("error", (err) => {
            console.error("Gunzip error: ", err);
            res.statusCode = 500;
            res.end("Internal server error");
        })
        .pipe(res);
});

server.listen(port, () => {
    const interfaces = os.networkInterfaces();
    const names = Object.keys(interfaces);

    console.log("File: " + backupFile);
    console.log("Port: " + port);
    console.log("Addresses:");

    for (const name of names) {
        console.log("  - " + name + ":");

        for (const entry of interfaces[name]) {
            console.log("    - " + entry.address);
        }
    }
});
