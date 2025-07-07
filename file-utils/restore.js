const fs = require("fs");
const http = require("http");
const os = require("os");
const zlib = require("zlib");

const port = 3000;
const file = process.argv[2];

if (!fs.existsSync(file)) {
    console.log("File doesn't exist");
    process.exit(1);
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/octet-stream");

    const readStream = fs.createReadStream(file);
    const gunzip = zlib.createGunzip();

    readStream.pipe(gunzip).pipe(res);
});

server.listen(port, () => {
    const interfaces = os.networkInterfaces();
    const names = Object.keys(interfaces);

    loop: for (const name of names) {
        for (const entry of interfaces[name]) {
            if (entry.family == "IPv4" && !entry.internal) {
                console.log(`${entry.address}:${port}`);
                break loop;
                break;
            }
        }
    }
});
