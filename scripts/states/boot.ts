/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

class Boot extends Phaser.State {

    constructor(){
        super();
    }

    preload() {

        this.load.image('preloadbar','assets/images/preloader-bar.png');
    }

    create(){
        this.game.stage.backgroundColor = '#fff';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('Preload');
    }
}