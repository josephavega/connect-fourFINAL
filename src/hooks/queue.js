class Queue {
    constructor() {
        this.queue = [];  
    }

    addPlayer(player) {
        this.queue.push(player);
        console.log(`${player} has joined the queue.`);
    }

    removePlayer(player) {
        this.queue = this.queue.filter((p) => p.username !== player.username);

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
