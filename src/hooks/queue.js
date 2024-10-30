class Queue {
    constructor() {
        this.queue = [];  
    }

    getQueue() {
        return this.queue;
    }

    addPlayer(username) {
        
        if (!this.containsPlayer(username)) {
            this.queue.push(username);
            return true;
        }
        return false;
        
    }

    removePlayer(username) {
        
        const index = this.queue.indexOf(username)
        if (index > -1) {
            this.queue.splice(index, 1);
            return true;
        }
        return false;

    }

    containsPlayer(username) {
        return this.queue.includes(username);
    }

    getFirstPlayer() {
        return this.queue.length > 0 ? this.queue[0] : null;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    displayQueue() {
        console.log('Current queue:', this.queue);
    }
}

module.exports = new Queue();
