/**
 * @scope enchant.InputManager.prototype
 */
enchant.InputManager = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.InputManager
     * @class
     * Class for managing input.
     * @param {*} valueStore object that store input state.
     * @param {*} [source=this] source that will be added to event object.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(valueStore, source) {
        enchant.EventTarget.call(this);

        /**
         * Array that store event target.
         * @type enchant.EventTarget[]
         */
        this.broadcastTarget = [];
        /**
         * Object that store input state.
         * @type Object
         */
        this.valueStore = valueStore;
        /**
         * source that will be added to event object.
         * @type Object
         */
        this.source = source || this;

        this._binds = {};

        this._stateHandler = function(e) {
            var id = e.source.identifier;
            var name = this._binds[id];
            this.changeState(name, e.data);
        }.bind(this);
    },
    /**
     * Name specified input.
     * Input can be watched by flag or event.
     * @param {enchant.InputSource} inputSource input source.
     * @param {String} name input name.
     */
    bind: function(inputSource, name) {
        inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        this._binds[inputSource.identifier] = name;
    },
    /**
     * Remove binded name.
     * @param {enchant.InputSource} inputSource input source.
     */
    unbind: function(inputSource) {
        inputSource.removeEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        delete this._binds[inputSource.identifier];
    },
    /**
     * Add event target.
     * @param {enchant.EventTarget} eventTarget broadcast target.
     */
    addBroadcastTarget: function(eventTarget) {
        var i = this.broadcastTarget.indexOf(eventTarget);
        if (i === -1) {
            this.broadcastTarget.push(eventTarget);
        }
    },
    /**
     * Remove event target.
     * @param {enchant.EventTarget} eventTarget broadcast target.
     */
    removeBroadcastTarget: function(eventTarget) {
        var i = this.broadcastTarget.indexOf(eventTarget);
        if (i !== -1) {
            this.broadcastTarget.splice(i, 1);
        }
    },
    /**
     * Dispatch event to {@link enchant.InputManager#broadcastTarget}.
     * @param {enchant.Event} e event.
     */
    broadcastEvent: function(e) {
        var target = this.broadcastTarget;
        for (var i = 0, l = target.length; i < l; i++) {
            target[i].dispatchEvent(e);
        }
    },
    /**
     * Change state of input.
     * @param {String} name input name.
     * @param {*} data input state.
     */
    changeState: function(name, data) {
    }
});
