const { customCron } = require("./cron");

process.on("message", (message) => {
    if (message.type === "start") {
        const { cronExpression, jobName } = message;
        const stopJob = customCron(cronExpression, jobName);

        // Listen for messages to stop the process if needed
        process.on("message", (message) => {
            if (message === "stop") {
                stopJob();
                process.exit();
            }
        });
    }
});
