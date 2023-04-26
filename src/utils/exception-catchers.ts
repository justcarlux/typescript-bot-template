export default () => {

    const ignoredErrors = (stack: any): boolean => {

        if (stack.toString().includes("Unknown interaction")) {
            console.log(`[Exception] Laggy interaction (Unknown interaction)`);
            return true;
        }

        return false;
    
    }
    
    process.on('uncaughtException', (err: Error) => {
        if (ignoredErrors(err.stack)) return;
        console.log(`[Uncaught Exception]\n${err.stack}`);
    });
    
    process.on('unhandledRejection', (reason: any) => {
        if (ignoredErrors(reason.stack)) return;
        console.log(`[Unhandled Rejection]\n${reason.stack ? reason.stack : reason}`);
    });

}