/**
 * Created by myabko on 15-05-01.
 */
/*create the reference paths for our components. this allows typescript to do intellisense-like code completion. should
 * probably be added for each file/class that is referenced below*/
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
var OxygenTank = (function () {
    function OxygenTank(initialLevel) {
        this.level = this.InitialLevel = initialLevel;
        this.callbackAlarms = [];
    }
    OxygenTank.prototype.use = function (amount) {
        this.level = this.level - amount;
    };
    OxygenTank.prototype.setupAlarm = function (levelToAlarmAt, callback) {
        this.callbackAlarms.push({ callback: callback, alarmAt: levelToAlarmAt });
    };
    OxygenTank.prototype.update = function () {
        this.callbackAlarms.forEach(function (alarm) {
            if (alarm.alarmAt <= this.level) {
                alarm.callback();
            }
        });
    };
    return OxygenTank;
})();
//# sourceMappingURL=OxygenTank.js.map