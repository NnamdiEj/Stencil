// ========== Player Class ========== //

// Player Constructor
function Player (playerName) {
    this.name = playerName;
    this.drawingActive = false;
    this.guessingActive = false;
}

// ====== Player Getters ====== //
Player.prototype.getName = function() {
    return this.name;
};

Player.prototype.getPlayerDrawing = function() {
    return this.drawingActive;
};

Player.prototype.getPlayerGuessing = function() {
    return this.guessingActive;
};

// ====== Player Setters ====== //
Player.prototype.setPlayerDrawing = function(drawing) {
    this.drawingActive = drawing;
};

Player.prototype.setPlayerGuessing = function(guessing) {
    this.guessingActive = guessing;
};

module.exports = Player;