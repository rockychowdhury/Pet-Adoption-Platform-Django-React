class AuthObserver {
    constructor() {
        this.listeners = [];
    }
    subscribe(fn) {
        this.listeners.push(fn);
    }
    unsubscribe(fn) {
        this.listeners = this.listeners.filter(l => l !== fn);
    }
    notify() {
        this.listeners.forEach(fn => fn());
    }
}
export const authObserver = new AuthObserver();
