/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../../bower_components/phaser/typescript/phaser.comments.d.ts"/>
/// <reference path="../model/Heart.ts"/>
/// <reference path="../model/OxygenTank.ts"/>

enum calloutIntensity { thought, yell, speech};

class Player  {

    MAX_BREATH :number = 200;
    MIN_BREATH :number = 50;

    MAX_SPEED : number = 100;
    ROTATION_SPEED : number = 140;
    ACCELERATION : number = 100;
    DRAG : number = 45;

    TANK_SIZE: number = 8000;
    INITIAL_HEART_RATE: number = 75;
    BULLET_SPEED: number = 200;

    SHOW_DEBUG : boolean = false;

    name: string;
    colour: string;
    game: Phaser.Game;
    sprite: Phaser.Sprite;
    cursors:Phaser.CursorKeys;
    gamepad: Phaser.SinglePad;
    oxyText: Phaser.Text;
    otherPlayers: Player[];
    currentCallout: Phaser.Sprite;
    currentCalloutText: Phaser.Text;

    bubbleEmmiter;

    heart: Heart;
    oxygenTank: OxygenTank;

    gold: number = 0;
    itemsPointer: Phaser.Group;

    initialTime: number;

    constructor(x:number,y:number,game: Phaser.Game,gamepad: Phaser.SinglePad, colour? : string, group?:Phaser.Group){

        this.game = game;
        this.gamepad = gamepad;

        this.setupSprite(x,y);
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

    private setupSprite(x,y){
        this.sprite = this.game.add.sprite(x,y,'player');
        this.sprite.anchor.setTo(0.5,0.5);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.player = this;
        this.sprite.animations.add('swim',[1,2,3,4,5,4,3,2]);
        this.sprite.animations.add('rest',[0]);

        this.bubbleEmmiter = this.game.add.emitter(0,0,15);

        this.bubbleEmmiter.makeParticles('bubble');

        this.bubbleEmmiter.setRotation(0, 1);
        this.bubbleEmmiter.setAlpha(1, 0, 3000);
        this.bubbleEmmiter.setXSpeed(0,7);
        this.bubbleEmmiter.setYSpeed(0,7);
        this.bubbleEmmiter.gravity = -10;
        this.bubbleEmmiter.setScale(0.1, 1, 0.1, 1, 3000, Phaser.Easing.Quintic.Out);

        this.currentCallout = this.game.add.sprite(0,0,'callout-speech');
        this.currentCallout.alpha = 0;
        this.currentCallout.scale = {x: 3, y: 3};

        this.currentCalloutText = this.game.add.text(0, 0, 'AHHHHH!', {font: '14px Arial'});
        this.currentCalloutText.alpha = 0;

    }

   public callout(text: string, intensity: calloutIntensity){
       this.currentCalloutText.text = text;
       this.currentCallout.alpha = 0.8;
       this.currentCalloutText.alpha = 0.8;

        this.game.add.tween(this.currentCalloutText).to({ alpha: 0},1500, Phaser.Easing.Quartic.In,true);
       this.game.add.tween(this.currentCallout).to({ alpha: 0},1500,Phaser.Easing.Quartic.In,true);
   }


    private setupModel() {
        this.oxygenTank = new OxygenTank(this.TANK_SIZE);
        var onBreath = (bpm) => {

            var totalBreath = this.MAX_BREATH - bpm;

            if (totalBreath < this.MIN_BREATH) {
                totalBreath = this.MIN_BREATH;
            }

            this.oxygenTank.use(totalBreath);
            this.bubbleEmmiter.flow(3000,150,2,5);
        };
        this.heart = new Heart(this.INITIAL_HEART_RATE, onBreath, this.game.time);
    }

    public setColour(colour: string){
        this.colour = colour; //eventually we should set the sprite colour here in a subroutine

    }

    public changeGold(gold: number){
        this.gold += gold;
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

        this.heart.changeHeartRateTo(this.sprite.body.speed / 4);


        //position over head
        this.bubbleEmmiter.x = this.sprite.x + Math.cos(this.sprite.rotation-Math.PI/2)*15;
        this.bubbleEmmiter.y = this.sprite.y + Math.sin(this.sprite.rotation-Math.PI/2)*15;

        //var trackemitter = this.game.add.sprite(this.bubbleEmmiter.x,this.bubbleEmmiter.y,"bubble");


      this.currentCallout.x = this.sprite.x - 55;
      this.currentCallout.y = this.sprite.y - 70;
      this.currentCalloutText.x = this.currentCallout.x + 50;
      this.currentCalloutText.y = this.currentCallout.y + 10;

    }



    private updateControls() {

        if (this.cursors.up.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_A))
        {
            this.sprite.animations.play('swim',10,true);
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation - 1.5, this.MAX_SPEED, this.sprite.body.acceleration);
        }
        else
        {
            this.sprite.body.acceleration.set(0);
        }

        if (this.cursors.left.isDown || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
        {
            if (this.sprite.body.speed <= 100) {
                this.sprite.body.angularVelocity = -this.ROTATION_SPEED;
            }
            else {
                this.sprite.body.angularVelocity = -this.sprite.body.speed * 2;
            }


        }

        else if (this.cursors.right.isDown || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
        {
            if (this.sprite.body.speed <= 100) {
                this.sprite.body.angularVelocity = this.ROTATION_SPEED;
            }
            else {
                this.sprite.body.angularVelocity = this.sprite.body.speed * 2;
            }
        }
        else
        {
            this.sprite.body.angularVelocity = 0;
        }

        if (this.sprite.body.speed <= 20){

            this.sprite.animations.play('rest',10,true);
        }

        if (this.cursors.down.justDown){
            this.throwGold();
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
        this.cursors.up.onDown.add(()=>{

        },this)
    }

    private throwGold() {
        if (this.gold > 0)
        {
            var bullet = this.game.add.sprite(0, 0, 'gold');

            // Set its pivot point to the center of the bullet
            bullet.anchor.setTo(0.5, 0.5);

            this.itemsPointer.add(bullet);

            // Enable physics on the bullet
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

            bullet.body.setSize(10,10);

            // Set the bullet position to the gun position.
            bullet.reset(this.sprite.x + Math.cos(this.sprite.rotation-Math.PI/2)*25, this.sprite.y + Math.sin(this.sprite.rotation-Math.PI/2)*25);

            // Shoot it
            bullet.body.velocity.x = Math.cos(this.sprite.rotation-Math.PI/2)*this.BULLET_SPEED;
            bullet.body.velocity.y = Math.sin(this.sprite.rotation-Math.PI/2)*this.BULLET_SPEED;

            this.changeGold(-1);
        }

    }

}