export default interface IAuthorizationResult<P> {
    authorized: boolean;
    /**
     * This payload will be sent when `authorized` is false. If you leave it empty, the command will not answer with anything
     */
    payload?: P;
}
