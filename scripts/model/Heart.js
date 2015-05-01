/**
 * Created by myabko on 15-05-01.
 */
var Heart = (function () {
    function Heart(initialBpm, onBeat, clock) {
        this.bpm = this.InitialBpm = initialBpm;
        this.onBeat = onBeat;
        this.clock = clock;
        this.setupBeatLoop();
    }
    Heart.prototype.changeHeartRateTo = function (bpm) {
        //TODO: would be neat if this lowerered slowly instead of immediately
        this.bpm = bpm;
        this.setupBeatLoop();
    };
    Heart.prototype.setupBeatLoop = function () {
        this.lastBeat = this.clock.time;
    };
    Heart.prototype.beat = function () {
        this.lastBeat = this.clock.time;
        this.onBeat(this.bpm);
    };
    Heart.prototype.update = function () {
        var elaspedSince = this.clock.elapsedSecondsSince(this.lastBeat);
        if (elaspedSince > (this.bpm / 60)) {
            this.beat();
        }
    };
    return Heart;
})();
//# sourceMappingURL=Heart.js.map