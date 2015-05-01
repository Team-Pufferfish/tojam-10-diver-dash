/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>

class Player  {

    MAX_BREATH :number = 150;

    name: string;
    colour: string;
    game: Phaser.Game;
    sprite: Phaser.Sprite;

    heart: Heart;
    oxygenTank: OxygenTank;

    constructor(x:number,y:number,game: Phaser.Game, colour? : string, group?:Phaser.Group){

        this.game = game;
        this.sprite = this.game.add.sprite(x,y,'player');
        this.game.physics.arcade.enable(this.sprite);

        this.oxygenTank = new OxygenTank(100);
        this.heart = new Heart(80,this.breath,this.game.time);
    }

    public setColour(colour: string){
        this.colour = colour; //eventually we should set the sprite colour here in a subroutine

    }

    public setInitialOxygenLevel(initialLevel: number) :void{
        this.oxygenTank = new OxygenTank(initialLevel);
    }

    update() {
        this.heart.update();
        this.oxygenTank.update();
    }

    private breath(bpm : number){
        this.oxygenTank.use(this.MAX_BREATH - bpm);
    }

}