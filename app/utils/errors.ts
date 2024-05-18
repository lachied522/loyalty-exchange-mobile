

export class NotLoggedInError extends Error {
    constructor(message?: string, ...args: any) {
        super(message, ...args);
        this.name = "NotLoggedInError";
    }
}

export class FetchError extends Error {
    constructor(message?: string, ...args: any) {
        super(message, ...args);
        this.name = "FetchError";
    }
}