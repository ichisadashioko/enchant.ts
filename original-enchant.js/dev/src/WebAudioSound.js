window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;

/**
 * @scope enchant.WebAudioSound.prototype
 */
enchant.WebAudioSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.WebAudioSound
     * @class
     * Sound wrapper class for Web Audio API (supported on some webkit-based browsers)
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        if (!window.AudioContext) {
            throw new Error("This browser does not support WebAudio API.");
        }
        enchant.EventTarget.call(this);
        if (!enchant.WebAudioSound.audioContext) {
          enchant.WebAudioSound.audioContext = new window.AudioContext();
          enchant.WebAudioSound.destination = enchant.WebAudioSound.audioContext.destination;
        }
        this.context = enchant.WebAudioSound.audioContext;
        this.src = this.context.createBufferSource();
        this.buffer = null;
        this._volume = 1;
        this._currentTime = 0;
        this._state = 0;
        this.connectTarget = enchant.WebAudioSound.destination;
    },
    /**
     * Begin playing.
     * @param {Boolean} [dup=false] If true, Object plays new sound while keeps last sound.
     */
    play: function(dup) {
        if (this._state === 1 && !dup) {
            this.src.disconnect();
        }
        if (this._state !== 2) {
            this._currentTime = 0;
        }
        var offset = this._currentTime;
        var actx = this.context;
        this.src = actx.createBufferSource();
        if (actx.createGain != null) {
            this._gain = actx.createGain();
        } else {
            this._gain = actx.createGainNode();
        }
        this.src.buffer = this.buffer;
        this._gain.gain.value = this._volume;

        this.src.connect(this._gain);
        this._gain.connect(this.connectTarget);
        if (this.src.start != null) {
            this.src.start(0, offset, this.buffer.duration - offset - 1.192e-7);
        } else {
            this.src.noteGrainOn(0, offset, this.buffer.duration - offset - 1.192e-7);
        }
        this._startTime = actx.currentTime - this._currentTime;
        this._state = 1;
    },
    /**
     * Pause playback.
     */
    pause: function() {
        var currentTime = this.currentTime;
        if (currentTime === this.duration) {
            return;
        }
        if (this.src.stop != null) {
            this.src.stop(0);
        } else {
            this.src.noteOff(0);
        }
        this._currentTime = currentTime;
        this._state = 2;
    },
    /**
     * Stop playing.
     */
    stop: function() {
        if (this.src.stop != null) {
            this.src.stop(0);
        } else {
            this.src.noteOff(0);
        }
        this._state = 0;
    },
    /**
     * Create a copy of this Sound object.
     * @return {enchant.WebAudioSound} Copied Sound.
     */
    clone: function() {
        var sound = new enchant.WebAudioSound();
        sound.buffer = this.buffer;
        return sound;
    },
    /**
     * Sound file duration (seconds).
     * @type Number
     */
    duration: {
        get: function() {
            if (this.buffer) {
                return this.buffer.duration;
            } else {
                return 0;
            }
        }
    },
    /**
     * Volume. 0 (muted) ～ 1 (full volume).
     * @type Number
     */
    volume: {
        get: function() {
            return this._volume;
        },
        set: function(volume) {
            volume = Math.max(0, Math.min(1, volume));
            this._volume = volume;
            if (this.src) {
                this._gain.gain.value = volume;
            }
        }
    },
    /**
     * Current playback position (seconds).
     * @type Number
     */
    currentTime: {
        get: function() {
            return Math.max(0, Math.min(this.duration, this.src.context.currentTime - this._startTime));
        },
        set: function(time) {
            this._currentTime = time;
            if (this._state !== 2) {
                this.play(false);
            }
        }
    }
});

/**
 * Loads an audio file and creates WebAudioSound object.
 * @param {String} src Path of the audio file to be loaded.
 * @param {String} [type] MIME Type of the audio file.
 * @param {Function} [callback] on load callback.
 * @param {Function} [onerror] on error callback.
 * @return {enchant.WebAudioSound} WebAudioSound
 * @static
 */
enchant.WebAudioSound.load = function(src, type, callback, onerror) {
    var canPlay = (new Audio()).canPlayType(type);
    var sound = new enchant.WebAudioSound();
    callback = callback || function() {};
    onerror = onerror || function() {};
    sound.addEventListener(enchant.Event.LOAD, callback);
    sound.addEventListener(enchant.Event.ERROR, onerror);
    function dispatchErrorEvent() {
        var e = new enchant.Event(enchant.Event.ERROR);
        e.message = 'Cannot load an asset: ' + src;
        enchant.Core.instance.dispatchEvent(e);
        sound.dispatchEvent(e);
    }
    var actx, xhr;
    if (canPlay === 'maybe' || canPlay === 'probably') {
        actx = enchant.WebAudioSound.audioContext;
        xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            actx.decodeAudioData(xhr.response, function(buffer) {
                sound.buffer = buffer;
                sound.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
            }, dispatchErrorEvent);
        };
        xhr.onerror = dispatchErrorEvent;
        xhr.send(null);
    } else {
        setTimeout(dispatchErrorEvent,  50);
    }
    return sound;
};
