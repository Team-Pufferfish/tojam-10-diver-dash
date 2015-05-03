/**
 * Created by furrot on 2015-05-02.
 *
 */
 /// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
class Scores extends Phaser.State {
    gameState: gameData;
    level: number;
    maxLevel: number = 2;

    init(gameState){
        this.gameState = gameState;
    }

    constructor() {
        super();
    }

    create() {
        console.log("Hey you won or you all died");
        var playerCount = 1;
        var aVictory = false;
        this.gameState.playerDeaths.forEach(function(playerDeath){
            if (!playerDeath.isVictorius)
                console.log("Player "+ playerCount + " died of " + playerDeath.reason + " at " + playerDeath.time);
            else {
                console.log("Player " + playerCount + " escaped with " + playerDeath.gold + " gold in " + playerDeath.time);
                this.gameState.teamScore += playerDeath.gold;
                aVictory = true;
            }
            playerCount++;
        },this);

        if (aVictory) {
            console.log("Team Score: " + this.gameState.teamScore);
            this.startGame();
        }else{
            this.restartGame();
        }
    }

    private startGame() {
        this.gameState.playerDeaths = [];
        this.gameState.level += 1;

        if (this.gameState.level <= this.maxLevel) {
            console.log("Start Level: " + this.gameState.level);
            this.game.state.start('Game', true, false, this.gameState);
        }else{
            console.log("Game over, all levels done");
        }
    }

    private restartGame() {
        this.gameState.playerDeaths = [];
        this.gameState.level = 0;
        this.gameState.teamScore = 0;

        if (this.gameState.level <= this.maxLevel) {
            console.log("Restart from Level: " + this.gameState.level);
            this.game.state.start('Game', true, false, this.gameState);
        }
    }
}