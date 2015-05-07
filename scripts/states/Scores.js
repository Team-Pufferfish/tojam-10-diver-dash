var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by furrot on 2015-05-02.
 *
 */
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
var Scores = (function (_super) {
    __extends(Scores, _super);
    function Scores() {
        _super.call(this);
        this.maxLevel = 4;
    }
    Scores.prototype.init = function (gameState) {
        this.gameState = gameState;
    };
    Scores.prototype.create = function () {
        console.log("Hey you won or you all died");
        var playerCount = 1;
        var aVictory = false;
        var title = "";
        var summary = "";
        var guide = "";
        this.gameState.playerDeaths.forEach(function (playerDeath) {
            if (!playerDeath.isVictorius) {
                console.log("Player " + playerCount + " died of " + playerDeath.reason + " after " + playerDeath.time);
                summary += "Player " + playerCount + " died of " + playerDeath.reason + " after " + playerDeath.time + "s\n";
            }
            else {
                console.log("Player " + playerCount + " escaped with " + playerDeath.gold + " gold in " + playerDeath.time);
                summary += "Player " + playerCount + " escaped with " + playerDeath.gold + " gold in " + playerDeath.time + "s\n";
                this.gameState.teamScore += playerDeath.gold;
                aVictory = true;
            }
            playerCount++;
        }, this);
        if (aVictory) {
            console.log("Level Complete Team Score: " + this.gameState.teamScore);
            title = "Level " + this.gameState.level + " Complete!";
            this.game.time.events.add(5000, this.startGame, this);
        }
        else {
            console.log("You Lose! Team Score: " + this.gameState.teamScore);
            title = "Level " + this.gameState.level + " Failed!";
            this.game.time.events.add(5000, this.restartGame, this);
        }
        if (this.gameState.level + 1 <= this.maxLevel && aVictory) {
            guide = "Good luck on the next level!";
        }
        else {
            guide = "Game over, thanks for playing!";
        }
        this.scoreTitle = this.game.add.text(this.game.width / 2, this.game.height / 2 - 300, title, { font: '72px Arial', fill: '#ffffff' });
        this.scoreTitle.fixedToCamera = true;
        this.scoreTitle.anchor.setTo(0.5, 0.5);
        this.scoreSummary = this.game.add.text(this.game.width / 2, this.game.height / 2 - 100, summary, { font: '48px Arial', fill: '#ffffff' });
        this.scoreSummary.fixedToCamera = true;
        this.scoreSummary.anchor.setTo(0.5, 0.5);
        this.scoreTeam = this.game.add.text(this.game.width / 2, this.game.height / 2 + 100, "Team Score: " + this.gameState.teamScore, { font: '48px Arial', fill: '#ffffff' });
        this.scoreTeam.fixedToCamera = true;
        this.scoreTeam.anchor.setTo(0.5, 0.5);
        this.scoreGuide = this.game.add.text(this.game.width / 2, this.game.height / 2 + 200, guide, { font: '48px Arial', fill: '#ffffff' });
        this.scoreGuide.fixedToCamera = true;
        this.scoreGuide.anchor.setTo(0.5, 0.5);
    };
    Scores.prototype.startGame = function () {
        this.gameState.playerDeaths = [];
        this.gameState.level += 1;
        if (this.gameState.level <= this.maxLevel) {
            console.log("Start Level: " + this.gameState.level);
            this.game.state.start('Game', true, false, this.gameState);
        }
        else {
            console.log("Game over, all levels done");
            this.restartGame();
        }
    };
    Scores.prototype.restartGame = function () {
        this.game.state.start('MainMenu');
    };
    return Scores;
})(Phaser.State);
//# sourceMappingURL=Scores.js.map