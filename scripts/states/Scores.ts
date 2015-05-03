/**
 * Created by furrot on 2015-05-02.
 *
 */
 /// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
class Scores extends Phaser.State {
    gameState: gameData;
    level: number;
    maxLevel: number = 2;

    scoreTitle: Phaser.Text;
    scoreSummary: Phaser.Text;

    scoreTeam: Phaser.Text;
    scoreGuide: Phaser.Text;

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
        var title = "";
        var summary = "";
        var guide = "";

        this.gameState.playerDeaths.forEach(function(playerDeath){
            if (!playerDeath.isVictorius) {
                console.log("Player " + playerCount + " died of " + playerDeath.reason + " after " + playerDeath.time);
                summary += "Player "+ playerCount + " died of " + playerDeath.reason + " after " + playerDeath.time + "s\n";
            }else {
                console.log("Player " + playerCount + " escaped with " + playerDeath.gold + " gold in " + playerDeath.time);
                summary += "Player " + playerCount + " escaped with " + playerDeath.gold + " gold in " + playerDeath.time + "s\n";
                this.gameState.teamScore += playerDeath.gold;
                aVictory = true;
            }
            playerCount++;
        },this);

        if (aVictory) {
            console.log("Level Complete Team Score: " + this.gameState.teamScore);
            title = "Level " + this.gameState.level + " Complete!";
            this.game.time.events.add(5000,this.startGame,this);
        }else{
            console.log("You Lose! Team Score: " + this.gameState.teamScore);
            title = "Level "+this.gameState.level+" Failed!";
            this.game.time.events.add(5000,this.restartGame,this);
        }

        if (this.gameState.level+1 <= this.maxLevel && aVictory) {
            guide = "Good luck on the next level!";
        }else{
            guide = "Game over, thanks for playing!"
        }

        this.scoreTitle = this.game.add.text(this.game.width/2,this.game.height/2-300,title, {font: '72px Arial', fill:'#ffffff'});
        this.scoreTitle.fixedToCamera = true;
        this.scoreTitle.anchor.setTo(0.5,0.5);

        this.scoreSummary = this.game.add.text(this.game.width/2,this.game.height/2-100,summary, {font: '48px Arial', fill:'#ffffff'});
        this.scoreSummary.fixedToCamera = true;
        this.scoreSummary.anchor.setTo(0.5,0.5);

        this.scoreTeam = this.game.add.text(this.game.width/2,this.game.height/2+100,"Team Score: " +this.gameState.teamScore, {font: '48px Arial', fill:'#ffffff'});
        this.scoreTeam.fixedToCamera = true;
        this.scoreTeam.anchor.setTo(0.5,0.5);

        this.scoreGuide= this.game.add.text(this.game.width/2,this.game.height/2+200,guide, {font: '48px Arial', fill:'#ffffff'});
        this.scoreGuide.fixedToCamera = true;
        this.scoreGuide.anchor.setTo(0.5,0.5);
    }

    private startGame() {
        this.gameState.playerDeaths = [];
        this.gameState.level += 1;

        if (this.gameState.level <= this.maxLevel) {
            console.log("Start Level: " + this.gameState.level);
            this.game.state.start('Game', true, false, this.gameState);
        }else{
            console.log("Game over, all levels done");
            this.restartGame();
        }
    }

    private restartGame() {
        this.game.state.start('MainMenu');
    }
}