// ========== Team Class ========== //

// Import needed modules
const Player = require('./Player');

// Team Constructor
function Team (teamName) {
    this.name = teamName;
    this.players = new Array();
    this.points = 0;
    this.active = false;
}

// ====== Team Getters ====== //
Team.prototype.getName = function() {
    return this.name;
};

Team.prototype.getPlayers = function() {
    return this.players;
};

Team.prototype.getNumberOfPlayers = function() {
    return this.players.length;
};

Team.prototype.getPoints = function() {
    return this.points;
};

Team.prototype.isActive = function() {
    return this.active;
};

// ====== Team Setters ====== //
Team.prototype.setTurnActive = function(active) {
    this.active = active;
};

Team.prototype.addPlayer = function(playerName) {
    const player = new Player(playerName);
    this.players.push(player);
};

Team.prototype.removePlayer = function(playerName) {
    for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].getName() === playerName) {
            this.players.splice(i, 1);
            return;
        }
    }
};

Team.prototype.addPoints = function(points) {
    this.points += points;
};

module.exports = Team;