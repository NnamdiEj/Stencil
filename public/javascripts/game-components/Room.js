// ========= Room Class ========= //

// Import needed modules
const Team = require('./Team');

//  Room Constructor
function Room (roomName, roomPrivacy, roomPassword, io) {
    this.roomName = roomName;
    this.roomPrivacy = roomPrivacy;
    this.roomPassword = roomPassword;
    this.io = io;
    this.gameStarted = false;
    this.team1 = new Team("team1");
    this.team2 = new Team("team2");
    this.roundTimer = 0;
    this.drawingTimer = 0;
    this.wordTimer = 0;
    this.round = 0;
    this.currentWord = '';
    this.usedWords = new Array();
}

Room.prototype.getRoomName = function() {
    return this.roomName;
};

Room.prototype.getRoomPrivacy = function() {
    return this.roomPrivacy;
};

Room.prototype.getRoomPassword = function() {
    return this.roomPassword;
};

Room.prototype.getGameStarted = function() {
    return this.gameStarted;
};

Room.prototype.getTeamOne = function() {
    return this.team1;
};

Room.prototype.getTeamTwo = function() {
    return this.team2;
};

Room.prototype.resetRoundTimer = function() {
    this.roundTimer = 180;
    const roundTimer = setInterval(function() {
        this.updateTimers('round');
    }, 1000);
    if (this.roundTimer === 0) {
        clearInterval(roundTimer);
    }
};

Room.prototype.updateTimers = function(timerType) {
    if (timerType === 'round') {
        this.roundTimer--;
    } else if (timerType === 'word') {
        this.wordTimer--;
    } else if (timerType === 'drawing') {
        this.drawingTimer--;
    }

    socket.emit('updateTimer', {
        roundTimer: this.roundTimer,
        wordTimer: this.wordTimer,
        drawingTimer: this.drawingTimer
    });

    if (this.roundTimer === 0) {
        this.round++;
        this.resetRoundTimer();
        this.resetWordTimer();
        this.resetDrawingTimer();
    } else if (this.drawingTimer === 0) {
        this.updateCurrentDrawer();
    } else if (this.wordTimer === 0) {
        // TODO: Generate a new word and reset the counter
    }

};

Room.prototype.resetWordTimer = function() {
    this.wordTimer = 90;
    setInterval(function() {
        this.updateTimers('word');
    }, 1000);
};

Room.prototype.resetDrawingTimer = function() {
    this.drawingTimer = 15;
    setInterval(function() {
        this.updateTimers('drawing');
    }, 1000);
};

Room.prototype.startGame = function() {

};

Room.prototype.endGame = function() {
    // TODO: If game ends naturally, send a message and set a timer to start a new game
    // TODO: If game ends because there aren't enough people, send a message and wait until more people join
};

Room.prototype.startRound = function() {
    this.resetRoundTimer();
    this.resetWordTimer();
    this.resetDrawingTimer();
};

Room.prototype.endRound = function() {

};

Room.prototype.resetTimers = function() {
    this.resetRoundTimer();
    this.resetWordTimer();
    this.resetDrawingTimer();
};

Room.prototype.updateCurrentDrawer = function() {
    if (this.getTeamOne().isActive()) {
        for (let i = 0; i < this.getTeamOne().getNumberOfPlayers(); i++) {
            if (this.getTeamOne().getPlayers()[i].getPlayerDrawing()) {
                this.getTeamOne().getPlayers()[i].setPlayerDrawing(false);
                i++;
                if (i > this.getTeamOne().getNumberOfPlayers()) {
                    i = 0;
                }
                if (this.getTeamOne().getPlayers()[i].getPlayerGuessing()) {
                    i++;
                    if (i > this.getTeamOne().getNumberOfPlayers()) {
                        i = 0;
                    }
                }
                this.getTeamOne().getPlayers()[i].setPlayerDrawing(true);
                break;
            }
        }
    } else if (this.getTeamTwo().isActive()) {
        for (let i = 0; i < this.getTeamTwo().getNumberOfPlayers(); i++) {
            if (this.getTeamTwo().getPlayers()[i].getPlayerDrawing()) {
                this.getTeamTwo().getPlayers()[i].setPlayerDrawing(false);
                i++;
                if (i > this.getTeamTwo().getNumberOfPlayers()) {
                    i = 0;
                }
                if (this.getTeamTwo().getPlayers()[i].getPlayerGuessing()) {
                    i++;
                    if (i > this.getTeamTwo().getNumberOfPlayers()) {
                        i = 0;
                    }
                }
                this.getTeamTwo().getPlayers()[i].setPlayerDrawing(true);
                break;
            }
        }
    }
};

Room.prototype.setCurrentWord = function (currentWord) {
    this.currentWord = currentWord;
};

Room.prototype.checkGuess = function(data) {
    if (data.message === this.currentWord) {
        socket.emit('correctGuess', {
            username: data.username,
            team1points: this.get
        })
    }
};

Room.prototype.setGameStarted = function (gameStarted) {
    this.gameStarted = gameStarted;
};

Room.prototype.addWord = function(newWord) {
    this.usedWords.push(newWord);
};

Room.prototype.getNumberOfPlayers = function() {
    return this.team1.getNumberOfPlayers() + this.team2.getNumberOfPlayers();
};

module.exports = Room;