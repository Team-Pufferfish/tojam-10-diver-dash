/**
 * Created by furrot on 2015-05-02.
 *
 */
 /// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
class Scores extends Phaser.State {
    level: number;

    init(level){
        this.level = level + 1;
    }

    constructor() {
        super();
    }

    create() {
        console.log("Hey you won or you all died");
        this.startGame();
    }

    private startGame(){
        this.game.state.start('Game',true,false,this.level);
    }
}