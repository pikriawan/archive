const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");

const file = process.argv[2];
const port = 3000;

if (!fs.existsSync(file)) {
    console.log("File doesn't exist");
    process.exit(1);
}

const server = http.createServer((req, res) => {
    const stat = fs.statSync(file);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Disposition", `attachment;filename="${path.basename(file)}"`);

    const stream = fs.createReadStream(file);
    stream.pipe(res);
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
