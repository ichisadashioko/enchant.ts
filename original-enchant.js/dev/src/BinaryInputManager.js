/**
 * @scope enchant.BinaryInputManager.prototype
 */
enchant.BinaryInputManager = enchant.Class.create(enchant.InputManager, {
    /**
     * @name enchant.BinaryInputManager
     * @class
     * Class for managing input.
     * @param {*} flagStore object that store input flag.
     * @param {String} activeEventNameSuffix event name suffix.
     * @param {String} inactiveEventNameSuffix event name suffix.
     * @param {*} [source=this] source that will be added to event object.
     * @constructs
     * @extends enchant.InputManager
     */
    initialize: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
        enchant.InputManager.call(this, flagStore, source);
        /**
         * The number of active inputs.
         * @type Number
         */
        this.activeInputsNum = 0;
        /**
         * event name suffix that dispatched by BinaryInputManager.
         * @type String
         */
        this.activeEventNameSuffix = activeEventNameSuffix;
        /**
         * event name suffix that dispatched by BinaryInputManager.
         * @type String
         */
        this.inactiveEventNameSuffix = inactiveEventNameSuffix;
    },
    /**
     * Name specified input.
     * @param {enchant.BinaryInputSource} inputSource input source.
     * @param {String} name input name.
     * @see enchant.InputManager#bind
     */
    bind: function(binaryInputSource, name) {
        enchant.InputManager.prototype.bind.call(this, binaryInputSource, name);
        this.valueStore[name] = false;
    },
    /**
     * Remove binded name.
     * @param {enchant.BinaryInputSource} inputSource input source.
     * @see enchant.InputManager#unbind
     */
    unbind: function(binaryInputSource) {
        var name = this._binds[binaryInputSource.identifier];
        enchant.InputManager.prototype.unbind.call(this, binaryInputSource);
        delete this.valueStore[name];
    },
    /**
     * Change state of input.
     * @param {String} name input name.
     * @param {Boolean} bool input state.
     */
    changeState: function(name, bool) {
        if (bool) {
            this._down(name);
        } else {
            this._up(name);
        }
    },
    _down: function(name) {
        var inputEvent;
        if (!this.valueStore[name]) {
            this.valueStore[name] = true;
            inputEvent = new enchant.Event((this.activeInputsNum++) ? 'inputchange' : 'inputstart');
            inputEvent.source = this.source;
            this.broadcastEvent(inputEvent);
        }
        var downEvent = new enchant.Event(name + this.activeEventNameSuffix);
        downEvent.source = this.source;
        this.broadcastEvent(downEvent);
    },
    _up: function(name) {
        var inputEvent;
        if (this.valueStore[name]) {
            this.valueStore[name] = false;
            inputEvent = new enchant.Event((--this.activeInputsNum) ? 'inputchange' : 'inputend');
            inputEvent.source = this.source;
            this.broadcastEvent(inputEvent);
        }
        var upEvent = new enchant.Event(name + this.inactiveEventNameSuffix);
        upEvent.source = this.source;
        this.broadcastEvent(upEvent);
    }
});
