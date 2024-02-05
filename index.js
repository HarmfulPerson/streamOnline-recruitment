const http = require("http");
const { createIntervalCron } = require("./cronFunctions.js");
const job1 = () => console.log("job executed");
const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/test") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            const cron = JSON.parse(data || "{}").cron;
            if (!cron) {
                res.end("Invalid payload");
            } else {
                const stopJob = createIntervalCron(job1, cron);

                res.end("ok");
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const PORT = 5555;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
