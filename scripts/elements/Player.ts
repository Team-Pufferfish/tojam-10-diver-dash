/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>

class Player  {

    MAX_BREATH :number = 200;
    MIN_BREATH :number = 50;

    MAX_SPEED : number = 200;
    ROTATION_SPEED : number = 120;
    ACCELERATION : number = 100;
    DRAG : number = 150;

    SHOW_DEBUG : boolean = false;

    name: string;
    colour: string;
    game: Phaser.Game;
    sprite: Phaser.Sprite;
    cursors = Phaser.CursorKeys;
    oxyText: Phaser.Text;

    heart: Heart;
    oxygenTank: OxygenTank;

    initialTime: number;
    changed: boolean = false;
    constructor(x:number,y:number,game: Phaser.Game, colour? : string, group?:Phaser.Group){

        this.game = game;
        this.sprite = this.game.add.sprite(x,y,'player');
        this.sprite.anchor.setTo(0.5,0.5);
        this.game.physics.arcade.enable(this.sprite);


        this.setupModel();
        this.setupDebug();
        this.setupControls();
    }

    private setupDebug() {
        if (this.SHOW_DEBUG){
            this.initialTime = this.game.time.time;
            this.oxyText = this.game.add.text(0, 0, 'oxy:', {});
            this.oxyText.fill = '#000';
            this.oxyText.stroke = '#fff';
            this.oxyText.strokeThickness = 2;
            this.oxyText.fontSize = 20;
        }

    }

    private setupModel() {
        this.oxygenTank = new OxygenTank(60000);
        var onBreath = (bpm) => {

            var totalBreath = this.MAX_BREATH - bpm;

            if (totalBreath < this.MIN_BREATH) {
                totalBreath = this.MIN_BREATH;
            }

            this.oxygenTank.use(totalBreath);
        };
        this.heart = new Heart(80, onBreath, this.game.time);
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
        this.updateControls();

        if (this.SHOW_DEBUG){
            this.oxyText.x = this.sprite.x;
            this.oxyText.y = this.sprite.y;
            this.oxyText.text = 'oxy:' + this.oxygenTank.level;
        }

        if (this.game.time.elapsedSecondsSince(this.initialTime) >= 10 && this.changed === false){
            this.heart.changeHeartRateTo(240);
            this.changed = true;
        }



    }

    private updateControls() {
        if (this.cursors.up.isDown)
        {
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation - 1.5, this.MAX_SPEED, this.sprite.body.acceleration);
        }
        else
        {
            this.sprite.body.acceleration.set(0);
        }

        if (this.cursors.left.isDown)
        {
            this.sprite.body.angularVelocity = -this.ROTATION_SPEED;
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.body.angularVelocity = this.ROTATION_SPEED;
        }
        else
        {
            this.sprite.body.angularVelocity = 0;
        }
    }

    private setupControls() {
        // Define motion constants

        // Set maximum velocity
        this.sprite.body.maxVelocity.setTo(this.MAX_SPEED); // x, y
        this.sprite.body.drag.setTo(this.DRAG);
        // Capture certain keys to prevent their default actions in the browser.
        // This is only necessary because this is an HTML5 game. Games on other
        // platforms may not need code like this.
        //  Game input
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

}