const child_process = require("child_process");
const fs = require("fs");
const http = require("http");
const os = require("os");
const zlib = require("zlib");

const file = process.argv[2];
const port = 3000;

if (!file) {
    console.log("File required");
    process.exit(1);
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment;filename=backup.img.gz");

    const dd = child_process.spawn("dd", [`if=${file}`]);
    const gzip = zlib.createGzip();
    dd.stdout.pipe(gzip).pipe(res);
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
