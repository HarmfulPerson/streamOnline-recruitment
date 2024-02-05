const { fork } = require("child_process");
const { validateInput } = require("./cron");

module.exports.oneTimeRun = (usersFunction, date) => {
    const currentDate = new Date().getTime();
    const inputDate = new Date(date).getTime();

    if (inputDate < currentDate) {
        throw Error("The date is in past");
    }
    const timeLeft = inputDate - currentDate;
    setTimeout(usersFunction, timeLeft);
};

module.exports.createIntervalCron = (job, cronExpression) => {
    validateInput(cronExpression);

    const customCronProcess = fork("./cronProcess.js");

    const functionMap = new Map();
    const dateToUniqueName = new Date();
    const uniqueFunctionName = `${job.name}${dateToUniqueName}`;
    functionMap.set(uniqueFunctionName, job);

    customCronProcess.send({
        type: "start",
        cronExpression,
        jobName: uniqueFunctionName,
    });
    customCronProcess.on("message", (message) => {
        if (message.type === "runFunction" && message.jobName) {
            const functionToRun = functionMap.get(message.jobName);
            functionToRun();
        }
    });

    return function stopJob() {
        functionMap.delete(uniqueFunctionName);
        customCronProcess.send("stop");
    };
};
