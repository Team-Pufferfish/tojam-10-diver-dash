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

interface nervousness {
    callout: string;
    calloutIntensity: calloutIntensity;
    startTime: number;
    multiplier: number;
    timeout : number;
    name: string;
}
interface death {
    time: number;
    reason: string;
    isDead: boolean;
}

class Player  {

    MAX_BREATH :number = 200;
    MIN_BREATH :number = 50;

    MAX_SPEED : number = 100;
    ROTATION_SPEED : number = 140;
    ACCELERATION : number = 100;
    DRAG : number = 45;

    TANK_SIZE: number = 8000;
    INITIAL_HEART_RATE: number = 20;
    BULLET_SPEED: number = 200;

    SHOW_DEBUG : boolean = false;

    name: string;
    colour: string;
    mortality: death;
    game: Phaser.Game;
    sprite: Phaser.Sprite;
    cursors:Phaser.CursorKeys;
    gamepad: Phaser.SinglePad;
    oxyText: Phaser.Text;
    otherPlayers: Player[];
    currentCallout: Phaser.Sprite;
    currentCalloutText: Phaser.Text;
    nervousnesses: nervousness[] = [];
    lastGoldThrow: number = 0;
    nervousLevel: number = 0;

    bubbleEmmiter;
    ui: Phaser.Sprite;

    heart: Heart;
    oxygenTank: OxygenTank;

    gold: number = 0;
    itemsPointer: Phaser.Group;

    initialTime: number;

    constructor(x:number,y:number,game: Phaser.Game,gamepad: Phaser.SinglePad, name:string,colour? : string, group?:Phaser.Group){

        this.name = name;
        this.game = game;
        this.gamepad = gamepad;


        this.mortality = {isDead: false, time: null, reason: null};
        this.setupSprite(x,y);
        this.setupModel();
        this.setupDebug();
        this.setupControls();
    }

    private setupDebug() {
        if (this.SHOW_DEBUG){
            this.initialTime = this.game.time.time;
            this.oxyText = this.game.add.text(0, 0, 'oxy:', {font: '8px Arial'});
            this.oxyText.fill = '#000';
            this.oxyText.stroke = '#fff';
            this.oxyText.strokeThickness = 1;
            this.oxyText.fontSize = 12;
        }

    }


    public setupUI(){
        
        var scale = 0.45;
        var padding = 10;
        
       if (this.name === "Player 1"){
           this.ui = this.game.add.sprite(padding,padding,'ui');
           this.ui.scale.setTo(scale,scale);
           this.ui.fixedToCamera = true;
       }
        if (this.name === "Player 2") {
            this.ui = this.game.add.sprite(this.game.width - padding,padding,'ui');
            this.ui.anchor.setTo(1,0);
            this.ui.scale.setTo(scale,scale);
            this.ui.fixedToCamera = true;
        }

        if (this.name === "Player 3"){
            this.ui = this.game.add.sprite(padding,this.game.height - padding,'ui');
            this.ui.anchor.setTo(0,1);
            this.ui.scale.setTo(scale,scale);
            this.ui.fixedToCamera = true;
        }
        if (this.name === "Player 4"){
            this.ui = this.game.add.sprite(this.game.width - padding,this.game.height - padding,'ui');
            this.ui.anchor.setTo(1,1);
            this.ui.scale.setTo(scale,scale);
            this.ui.fixedToCamera = true;
        }
    }
    public makeDead(reason: string){
        if (!this.mortality.isDead) {
            //run animation, and whatever here
            console.log(this.name + "has died because of ->" + reason);
            this.mortality.reason = reason;
            this.mortality.isDead = true;
            this.mortality.time = this.game.time.time;
            this.sprite.body.angularVelocity = 0;

            this.sprite.animations.stop('swim');
            var deathAnimation = this.sprite.animations.play('death',3);

            deathAnimation.onComplete.add(function deathAnimationFinished(sprite,animation){
                this.sprite.loadTexture('tank');
                this.sprite.body.velocity = 0;
            },this);
        }
    }

    private setupSprite(x,y){
        this.sprite = this.game.add.sprite(x,y,'player');
        this.sprite.anchor.setTo(0.5,0.5);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(15, 19);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.player = this;
        this.sprite.animations.add('swim',[1,2,3,4,5,4,3,2]);
        this.sprite.animations.add('rest',[0]);
        this.sprite.animations.add('death',[6]);

        this.bubbleEmmiter = this.game.add.emitter(0,0,15);

        this.bubbleEmmiter.makeParticles('bubble');

        this.bubbleEmmiter.setRotation(0, 1);
        this.bubbleEmmiter.setAlpha(1, 0, 3000);
        this.bubbleEmmiter.setXSpeed(-7,7);
        this.bubbleEmmiter.setYSpeed(-7,7);
        this.bubbleEmmiter.gravity = -10;
        this.bubbleEmmiter.setScale(0.1, 1, 0.1, 1, 3000, Phaser.Easing.Quintic.Out);
    }

    public setupCallout(){
        this.currentCallout = this.game.add.sprite(0,0,'callout-speech');
        this.currentCallout.alpha = 0;
        this.currentCallout.scale = {x: 3, y: 3};

        this.currentCalloutText = this.game.add.text(0, 0, 'We\'re trapped!', {font: '14px Arial'});
        this.currentCalloutText.alpha = 0;
    }

    public addNervousness(attributes: nervousness, doCallout: boolean=true){
        attributes.startTime = this.game.time.time;
        var found = false;
        this.nervousnesses.forEach((nerve,index) =>{
           if(nerve.name === attributes.name){
               nerve.startTime = attributes.startTime;
               found = true;
               if (doCallout)
                this.callout(attributes.callout,attributes.calloutIntensity);
           }
        });
        if (!found){
            this.nervousnesses.push(attributes);
        }


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

            var totalBreath = bpm;

            if (this.SHOW_DEBUG)
                this.oxyText.text = 'bpm:' + this.oxygenTank.level / totalBreath;

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

        if (!this.mortality.isDead) {

            this.heart.update();
            this.oxygenTank.update();
            this.updateControls();

            if (this.oxygenTank.level <= 0) {
                this.makeDead("ran out of air");
            }

            if (this.SHOW_DEBUG) {
                this.oxyText.x = this.sprite.x;
                this.oxyText.y = this.sprite.y;

            }
            this.checkDistancesToFriends();

            var nervousnessMultiplier = 1;
            this.nervousnesses.forEach((nerve) => {

                if (this.game.time.elapsedSince(nerve.startTime) < nerve.timeout || nerve.timeout === -1)
                    nervousnessMultiplier *= nerve.multiplier;
            });

            this.heart.changeHeartRateTo((this.INITIAL_HEART_RATE + (this.sprite.body.speed / 2.0)) * nervousnessMultiplier);

            this.bubbleEmmiter.x = this.sprite.x + Math.cos(this.sprite.rotation - Math.PI / 2) * 15;
            this.bubbleEmmiter.y = this.sprite.y + Math.sin(this.sprite.rotation - Math.PI / 2) * 15;
        }
    }

    updateCallout(){
        this.currentCallout.x = this.sprite.x - 55;
        this.currentCallout.y = this.sprite.y - 70;
        this.currentCalloutText.x = this.currentCallout.x + 50;
        this.currentCalloutText.y = this.currentCallout.y + 10;
    }

    private checkDistancesToFriends(){
        var safeLight = 175;
        var numPlayers = 4;
        var scaredDistance = safeLight * 2;
        var avgDistance = 0;
        var closestPlayer = 100000;

        var nervousnessWorried = {callout: "Getting separated...",
            calloutIntensity: calloutIntensity.speech,
            startTime: this.game.time.now,
            multiplier: 1.1, timeout: 1000, name: 'worried'};

        var nervousnessScared = {callout: "Wait for me guys!",
            calloutIntensity: calloutIntensity.yell,
            startTime: this.game.time.now,
            multiplier: 1.5, timeout: 1000, name: 'scared'};

        this.otherPlayers.forEach(function(otherPlayer){
            var howFar = Phaser.Math.distance(this.sprite.x,this.sprite.y,otherPlayer.sprite.x,otherPlayer.sprite.y);
            avgDistance += howFar;
            if (howFar < closestPlayer)
                howFar = closestPlayer;
        },this);

        avgDistance = avgDistance / numPlayers;

        if (avgDistance >= scaredDistance || closestPlayer >= scaredDistance){
            if (this.nervousLevel < 2) {
                this.addNervousness(nervousnessScared, true);
            }else {
                this.addNervousness(nervousnessScared, false);
            }
            this.nervousLevel = 2;
        }
        else if (avgDistance >= safeLight || closestPlayer >= safeLight){
            if (this.nervousLevel < 1) {
                this.addNervousness(nervousnessWorried, true);
            }else {
                this.addNervousness(nervousnessWorried, false);
            }
            this.nervousLevel = 1;
        }else {
            this.nervousLevel = 0;
        }
    }



    private updateControls() {

        if (this.cursors.up.isDown || this.gamepad.isDown(Phaser.Gamepad.XBOX360_A))
        {
            this.sprite.animations.play('swim',10,true);
            var goldSpeed = -this.MAX_SPEED * (this.gold / 5);
            goldSpeed = (goldSpeed > -this.MAX_SPEED) ? goldSpeed : -this.MAX_SPEED + 20;
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation - 1.5, this.MAX_SPEED + goldSpeed, this.sprite.body.acceleration);

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
                this.sprite.body.angularVelocity = -this.sprite.body.speed * 2 - this.gold;
            }


        }

        else if (this.cursors.right.isDown || this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
        {
            if (this.sprite.body.speed <= 100) {
                this.sprite.body.angularVelocity = this.ROTATION_SPEED;
            }
            else {
                this.sprite.body.angularVelocity = this.sprite.body.speed * 2 - this.gold;
            }
        }
        else
        {
            this.sprite.body.angularVelocity = 0;
        }

        if (this.sprite.body.speed <= 20){

            this.sprite.animations.play('rest',10,true);
        }

        if ((this.gamepad.isDown(Phaser.Gamepad.XBOX360_B)|| this.cursors.down.isDown) && (this.game.time.elapsedSecondsSince(this.lastGoldThrow) > 0.2 || this.lastGoldThrow === 0)){
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
            this.lastGoldThrow = this.game.time.time;
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
