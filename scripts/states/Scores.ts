/**
 * Created by furrot on 2015-05-02.
 *
 */
 /// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
class Scores extends Phaser.State {
    gameState: gameData;
    level: number;

    init(gameState){
        this.gameState = gameState;
    }

    constructor() {
        super();
    }

    create() {
        console.log("Hey you won or you all died");
        var playerCount = 1;
        this.gameState.playerDeaths.forEach(function(playerDeath){
            if (playerDeath.isDead)
                console.log("Player "+ playerCount + " died of " + playerDeath.reason + " at " + playerDeath.time);
            else {
                console.log("Player " + playerCount + " escaped with " + playerDeath.gold + " gold in " + playerDeath.time);
                this.gameState.teamScore += playerDeath.gold;
            }
            playerCount++;
        },this);

        this.startGame();
    }

    private startGame(){
        this.gameState.playerDeaths = [];
        this.gameState.level += 1;
        this.game.state.start('Game',true,false,this.gameState);
    }
}