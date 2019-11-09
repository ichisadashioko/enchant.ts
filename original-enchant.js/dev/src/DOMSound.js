/**
 * @scope enchant.DOMSound.prototype
 */
enchant.DOMSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.DOMSound
     * @class
     * Class to wrap audio elements.
     *
     * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
     * (Firefox and Opera play via Flash). WAVE files can be played on
     * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
     * the used codec the file will not play.
     *
     * Instances are created not via constructor but via {@link enchant.DOMSound.load}.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        /**
         * Sound file duration (seconds).
         * @type Number
         */
        this.duration = 0;
        throw new Error("Illegal Constructor");
    },
    /**
     * Begin playing.
     */
    play: function() {
        if (this._element) {
            this._element.play();
        }
    },
    /**
     * Pause playback.
     */
    pause: function() {
        if (this._element) {
            this._element.pause();
        }
    },
    /**
     * Stop playing.
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
     * Create a copy of this Sound object.
     * @return {enchant.DOMSound} Copied Sound.
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.DOMSound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if (enchant.ENV.USE_FLASH_SOUND) {
            return this;
        } else {
            clone = Object.create(enchant.DOMSound.prototype);
        }
        enchant.EventTarget.call(clone);
        return clone;
    },
    /**
     * Current playback position (seconds).
     * @type Number
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element) {
                this._element.currentTime = time;
            }
        }
    },
    /**
     * Volume. 0 (muted) ～ 1 (full volume).
     * @type Number
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element) {
                this._element.volume = volume;
            }
        }
    }
});

/**
 * Loads an audio file and creates DOMSound object.
 * @param {String} src Path of the audio file to be loaded.
 * @param {String} [type] MIME Type of the audio file.
 * @param {Function} [callback] on load callback.
 * @param {Function} [onerror] on error callback.
 * @return {enchant.DOMSound} DOMSound
 * @static
 */
enchant.DOMSound.load = function(src, type, callback, onerror) {
    if (type == null) {
        var ext = enchant.Core.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');
    callback = callback || function() {};
    onerror = onerror || function() {};

    var sound = Object.create(enchant.DOMSound.prototype);
    enchant.EventTarget.call(sound);
    sound.addEventListener('load', callback);
    sound.addEventListener('error', onerror);
    var audio = new Audio();
    if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
        enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
            audio.addEventListener('canplaythrough', function canplay() {
                sound.duration = audio.duration;
                sound.dispatchEvent(new enchant.Event('load'));
                audio.removeEventListener('canplaythrough', canplay);
            }, false);
            audio.src = src;
            audio.load();
            audio.autoplay = false;
            audio.onerror = function() {
                var e = new enchant.Event(enchant.Event.ERROR);
                e.message = 'Cannot load an asset: ' + audio.src;
                enchant.Core.instance.dispatchEvent(e);
                sound.dispatchEvent(e);
            };
            sound._element = audio;
        } else if (type === 'audio/mpeg') {
            var embed = document.createElement('embed');
            var id = 'enchant-audio' + enchant.Core.instance._soundID++;
            embed.width = embed.height = 1;
            embed.name = id;
            embed.src = 'sound.swf?id=' + id + '&src=' + src;
            embed.allowscriptaccess = 'always';
            embed.style.position = 'absolute';
            embed.style.left = '-1px';
            sound.addEventListener('load', function() {
                Object.defineProperties(embed, {
                    currentTime: {
                        get: function() {
                            return embed.getCurrentTime();
                        },
                        set: function(time) {
                            embed.setCurrentTime(time);
                        }
                    },
                    volume: {
                        get: function() {
                            return embed.getVolume();
                        },
                        set: function(volume) {
                            embed.setVolume(volume);
                        }
                    }
                });
                sound._element = embed;
                sound.duration = embed.getDuration();
            });
            enchant.Core.instance._element.appendChild(embed);
            enchant.DOMSound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
    }
    return sound;
};
