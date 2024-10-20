import logger from "./logger";

const ignoredErrors = (stack: any): boolean => {
    if (stack.toString().includes("Unknown interaction")) {
        logger.run(`\n[Exception] Laggy interaction (Unknown interaction)\n`, {
            color: "red",
            stringBefore: "\n",
            scope: "Uncaught Exception"
        });
        return true;
    }

    return false;
};

process.on("uncaughtException", (err: Error) => {
    if (ignoredErrors(err.stack)) return;
    logger.run(`\n${err.stack}\n`, {
        color: "red",
        stringBefore: "\n",
        scope: "Uncaught Exception"
    });
});

process.on("unhandledRejection", (reason: any) => {
    if (ignoredErrors(reason.stack)) return;
    logger.run(`\n${reason.stack ? reason.stack : reason}\n`, {
        color: "red",
        stringBefore: "\n",
        scope: "Unhandled Rejection"
    });
});
