const child_process = require("child_process");
const fs = require("fs");
const http = require("http");
const os = require("os");
const zlib = require("zlib");

const partition = process.argv[2];
const port = 3000;

if (!partition) {
    console.log("Partition required");
    process.exit(1);
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment;filename=backup.img.gz");

    const dd = child_process.spawn("dd", ["if=" + partition]);
    const zip = zlib.createGzip();

    dd
        .stdout
        .pipe(zip)
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

    console.log("Partition: " + partition);
    console.log("Port: " + port);
    console.log("Addresses:");

    for (const name of names) {
        console.log("  - " + name + ":");

        for (const entry of interfaces[name]) {
            console.log("    - " + entry.address);
        }
    }
});
