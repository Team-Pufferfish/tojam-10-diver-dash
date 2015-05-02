/**
 * Created by furrot on 2015-05-02.
 *
 */
 /// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
class Menu extends Phaser.State {
    constructor() {
        super();
    }

    create() {
        this.startGame();
    }

    private startGame(){
        this.game.state.start('Game',true,false,2);
    }
}