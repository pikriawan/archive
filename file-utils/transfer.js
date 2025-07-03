const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");

const file = process.argv[2];
const port = 3000;

if (!fs.existsSync(file)) {
    console.log("File doesn't exists");
    process.exit(1);
}

const server = http.createServer((req, res) => {
    fs.stat(file, (err, stat) => {
        if (err) {
            res.statusCode = 500;
            res.end("Internal server error");
            return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Length", stat.size);
        res.setHeader("Content-Disposition", "attachment; filename=\"" + path.basename(file) + "\"");

        const stream = fs.createReadStream(file);
        stream.pipe(res);
    });
});

server.listen(port, () => {
    const interfaces = os.networkInterfaces();
    const names = Object.keys(interfaces);

    console.log("File: " + file);
    console.log("Port: " + port);
    console.log("Addresses:");

    for (const name of names) {
        console.log("  - " + name + ":");

        for (const entry of interfaces[name]) {
            console.log("    - " + entry.address);
        }
    }
});
