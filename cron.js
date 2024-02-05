const MINUTE_MULTIPLIER = 60;
const HOUR_MULTIPLIER = 60 * 60;
const DAY_MULTIPLIER = 60 * 60 * 24;
const WEEK_MULTIPLIER = 60 * 60 * 24 * 7;

module.exports.oneTimeRun = (usersFunction, date) => {
    const currentDate = new Date().getTime();
    const inputDate = new Date(date).getTime();

    if (inputDate < currentDate) {
        throw Error("The date is in past");
    }
    const timeLeft = inputDate - currentDate;
    setTimeout(usersFunction, timeLeft);
};

const splitTimeValuesWithMultiplierIfNeeded = (timeValue, multiplier = 1) =>
    timeValue.includes("/") ? +(timeValue.split("/")[1] * multiplier) - 1 : 0;

const checkSecondsOrMinutesValidation = (timeString) => {
    const secondOrMinutesRegex =
        /^(\*\/(0?[2-9]|[1-5][0-9])|(?:[0-9]|[1-5][0-9])|(0?[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])-(0?[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*)$/;

    if (!secondOrMinutesRegex.test(timeString)) throw new Error("Not valid");
};

const checkHourValidation = (timeString) => {
    const hourRegex =
        /^(\*\/(0?[0-9]|1[0-9]|2[0-3])|(?:[0-9]|1[0-9]|2[0-3])|(0?[0-9]|1[0-9]|2[0-3])-(0?[0-9]|1[0-9]|2[0-3])|\*)$/;

    if (!hourRegex.test(timeString)) throw new Error("Not valid");
};

const checkDayValidation = (timeString) => {
    const dayRegex =
        /^(\*|\*\/[1-9]|(?:[1-9]|1[0-9]|2[0-9]|3[0-1])|(0?[1-9]|1[0-9]|2[0-9]|3[0-1])-(0?[1-9]|1[0-9]|2[0-9]|3[0-1])|([1-9](?:,[1-9])+))$/;

    if (!dayRegex.test(timeString)) throw new Error("Not valid");
};

const checkDayOfWeekValidation = (timeString) => {
    const weekRegex =
        /^(\*\/[1-7]|(?:[1-7])|(0?[1-7])-(0?[1-7])|([1-7](?:,[1-7])+)|\*)$/;

    if (!weekRegex.test(timeString)) throw new Error("Not valid");
};

const checkMonthValidation = (timeString) => {
    const monthRegex =
        /^(?:(?:\*|[1-9]|1[0-2])(?:,(?:(?!13)(?:\*|[1-9]|1[0-2])))?|(?:\*|[1-9]|1[0-2])-(?:\*|[1-9]|1[0-2]))$/;

    if (!monthRegex.test(timeString)) throw new Error("Not valid");
};

module.exports.validateInput = (cronParts) => {
    const cronPartsSplitted = cronParts.split(" ");
    const [seconds, minutes, hours, dayOfMonth, dayOfWeek, month] =
        cronPartsSplitted;

    checkSecondsOrMinutesValidation(seconds);
    checkSecondsOrMinutesValidation(minutes);
    checkHourValidation(hours);
    checkDayValidation(dayOfMonth);
    checkDayOfWeekValidation(dayOfWeek);
    checkMonthValidation(month);
};

module.exports.customCron = (cronExpression, jobName) => {
    const cronParts = cronExpression.split(" ");
    const [seconds, minutes, hours, dayOfMonth, dayOfWeek, month] = cronParts;
    let timeIntervalKeeper = {
        seconds: splitTimeValuesWithMultiplierIfNeeded(seconds),
        minutes: splitTimeValuesWithMultiplierIfNeeded(
            minutes,
            MINUTE_MULTIPLIER
        ),
        hours: splitTimeValuesWithMultiplierIfNeeded(hours, HOUR_MULTIPLIER),
        dayOfMonth: splitTimeValuesWithMultiplierIfNeeded(
            dayOfMonth,
            DAY_MULTIPLIER
        ),
        dayOfWeek: splitTimeValuesWithMultiplierIfNeeded(
            dayOfWeek,
            WEEK_MULTIPLIER
        ),
    };
    const intervalId = setInterval(() => {
        const now = new Date();
        const currentSeconds = now.getSeconds();
        const currentMinutes = now.getMinutes();
        const currentHours = now.getHours();
        const currentDayOfMonth = now.getDate();
        const currentMonth = now.getMonth() + 1;
        const currentDayOfWeek = now.getDay() === 0 ? 7 : now.getDay() + 1;
        const areSecondsOk = checkCronPartSeconds(
            currentSeconds,
            seconds,
            timeIntervalKeeper
        );
        const areMinutesOk = checkCron({
            currentValue: currentMinutes,
            cronPart: minutes,
            timeIntervalObject: timeIntervalKeeper,
            typeOfTime: "minutes",
            typeOfMultiplier: MINUTE_MULTIPLIER,
        });
        const areHoursOk = checkCron({
            currentValue: currentHours,
            cronPart: hours,
            timeIntervalObject: timeIntervalKeeper,
            typeOfTime: "hours",
            typeOfMultiplier: HOUR_MULTIPLIER,
        });
        const areDaysOk = checkCron({
            currentValue: currentDayOfMonth,
            cronPart: dayOfMonth,
            timeIntervalObject: timeIntervalKeeper,
            typeOfTime: "dayOfMonth",
            typeOfMultiplier: DAY_MULTIPLIER,
        });
        const areWeeksOk = checkCron({
            currentValue: currentDayOfWeek,
            cronPart: dayOfWeek,
            timeIntervalObject: timeIntervalKeeper,
            typeOfTime: "dayOfWeek",
            typeOfMultiplier: WEEK_MULTIPLIER,
        });
        const areMonthsOk = checkCronPartMonths(currentMonth, month);
        const isMatching =
            areSecondsOk &&
            areMinutesOk &&
            areHoursOk &&
            areDaysOk &&
            areWeeksOk &&
            areMonthsOk;
        if (isMatching) {
            process.send({ type: "runFunction", jobName });
        }
    }, 1000);

    return function stopJob() {
        clearInterval(intervalId);
    };
};

const checkCronPartMonths = (currentValue, cronPart) => {
    if (cronPart === "*") {
        return true;
    }

    const { hasInterval, hasConcreteValues } = returnStatements(cronPart);

    if (hasInterval) {
        return hasInterval.includes(currentValue);
    } else if (hasConcreteValues) {
        return hasConcreteValues.includes(currentValue);
    } else if (Number.isInteger(+cronPart) && +cronPart === currentValue) {
        return true;
    }

    return false;
};

const checkCron = ({
    currentValue,
    cronPart,
    timeIntervalObject,
    typeOfTime,
    typeOfMultiplier,
}) => {
    if (cronPart === "*") {
        return true;
    }

    const { hasInterval, hasEveryStatement, hasConcreteValues } =
        returnStatements(cronPart);

    if (hasInterval) {
        return hasInterval.includes(currentValue);
    } else if (hasConcreteValues) {
        return hasConcreteValues.includes(currentValue);
    } else if (hasEveryStatement) {
        if (timeIntervalObject[typeOfTime] > 0) {
            timeIntervalObject[typeOfTime] = timeIntervalObject[typeOfTime] - 1;

            return false;
        } else {
            if (timeIntervalObject[typeOfTime] === 0) {
                timeIntervalObject[typeOfTime] =
                    -hasEveryStatement * typeOfMultiplier;

                return false;
            } else if (timeIntervalObject.hours === -1) {
                timeIntervalObject[typeOfTime] =
                    hasEveryStatement * typeOfMultiplier - 1;

                return true;
            }
            timeIntervalObject[typeOfTime] = timeIntervalObject[typeOfTime] + 1;
            return true;
        }
    } else if (Number.isInteger(+cronPart) && +cronPart === currentValue) {
        return true;
    }

    return false;
};

const checkCronPartSeconds = (currentValue, cronPart, timeIntervalObject) => {
    if (cronPart === "*") {
        return true;
    }
    const { hasInterval, hasEveryStatement, hasConcreteValues } =
        returnStatements(cronPart);

    if (hasInterval) {
        return hasInterval.includes(currentValue);
    } else if (hasConcreteValues) {
        return hasConcreteValues.includes(currentValue);
    } else if (hasEveryStatement) {
        if (timeIntervalObject.seconds === 0) {
            timeIntervalObject.seconds = hasEveryStatement - 1;
            return true;
        } else {
            timeIntervalObject.seconds = timeIntervalObject.seconds - 1;
            return false;
        }
    } else if (Number.isInteger(+cronPart) && +cronPart === currentValue) {
        return true;
    }

    return false;
};

const returnStatements = (cronPart) => {
    const hasInterval =
        cronPart.includes("-") &&
        Array.from(
            { length: +cronPart.split("-")[1] - +cronPart.split("-")[0] + 1 },
            (_, index) => +cronPart.split("-")[0] + index
        );
    const hasEveryStatement = cronPart.includes("/") && cronPart.split("/")[1];
    const hasConcreteValues =
        cronPart.includes(",") && cronPart.split(",").map((value) => +value);

    return { hasInterval, hasEveryStatement, hasConcreteValues };
};
