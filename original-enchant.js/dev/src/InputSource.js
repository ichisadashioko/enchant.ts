/**
 * @scope enchant.InputSource.prototype
 */
enchant.InputSource = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.InputSource
     * @class
     * Class that wrap input.
     * @param {String} identifier identifier of InputSource.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(identifier) {
        enchant.EventTarget.call(this);
        /**
         * identifier of InputSource.
         * @type String
         */
        this.identifier = identifier;
    },
    /**
     * Notify state change by event.
     * @param {*} data state.
     */
    notifyStateChange: function(data) {
        var e = new enchant.Event(enchant.Event.INPUT_STATE_CHANGED);
        e.data = data;
        e.source = this;
        this.dispatchEvent(e);
    }
});
