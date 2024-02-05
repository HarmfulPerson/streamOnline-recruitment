const http = require("http");
const { createIntervalCron } = require("./cronFunctions.js");

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/test") {
        res.writeHead(200, { "Content-Type": "text/plain" });

        const stopJob = createIntervalCron(job1, "* * * * * *");
        res.end("ok");
    } else {
        createIntervalCron(job2, "* * * * * *");
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const PORT = 5555;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
