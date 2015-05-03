/**
 * Created by furrot on 2015-05-02.
 *
 */
 /// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
interface gameData {
    playerCount: number;
    playerDeaths: death[];
    level: number;
    teamScore: number;
}


class MainMenu extends Phaser.State {
    gameState: gameData;

    constructor() {
        super();
    }

    create() {

        this.startGame();
    }

    private startGame(){
        this.gameState = {playerCount: 4,playerDeaths:[],level:1,teamScore:0};

        this.game.state.start('Game',true,false,this.gameState);
    }
}