class State {
    constructor(initialState) {
        this.state = initialState;
        this.listeners = [];
    }
  
    // Method to subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
    }
  
    // Method to update state and notify subscribers
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach((listener) => listener(this.state));
    }
  
    // Method to get current state
    getState() {
        return this.state;
    }
}

export default State;