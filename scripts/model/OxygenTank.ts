/**
 * Created by myabko on 15-05-01.
 */

/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
class OxygenTank {


    InitialLevel: number;
    level: number;

    callbackAlarms : [any];

    constructor(initialLevel: number){
        this.level = this.InitialLevel = initialLevel;
    }

    use(amount: number){
        this.level = this.level - amount;
    }

    setupAlarm(levelToAlarmAt: number, callback : () => void) : void {
        this.callbackAlarms.push({callback: callback, alarmAt: levelToAlarmAt});
    }

    update() {
        this.callbackAlarms.forEach(function(alarm){
            if (alarm.alarmAt <= this.level){
                alarm.callback();
            }
        });
    }

}