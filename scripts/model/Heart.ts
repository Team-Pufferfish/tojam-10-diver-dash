/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

type callback = (bpm: number) => void;

class Heart {

    InitialBpm: number;
    bpm: number;
    clock: Phaser.Time;
    onBeat: callback;
    lastBeat: number;

    constructor(initialBpm: number, onBeat : callback, clock: Phaser.Time){
        this.bpm = this.InitialBpm = initialBpm;
        this.onBeat = onBeat;
        this.clock = clock;

        this.setupBeatLoop();
    }

    public changeHeartRateTo(bpm: number){

        //TODO: would be neat if this lowerered slowly instead of immediately
        this.bpm = bpm;
    }

    private setupBeatLoop() : void{

        this.lastBeat = this.clock.time;
    }

    private beat() {

        this.lastBeat = this.clock.time;
        this.onBeat(this.bpm);
    }

    public update() {
        var elaspedSince = this.clock.elapsedSecondsSince(this.lastBeat);

        if (elaspedSince > (60/ this.bpm)){
            this.beat();
        }
    }

}