/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * @name enchant.EventTarget
     * @class
     * A class for implementation of events similar to DOM Events.
     * However, it does not include the concept of phases.
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     * Add a new event listener which will be executed when the event
     * is dispatched.
     * @param {String} type Type of the events.
     * @param {Function(e:enchant.Event)} listener Event listener to be added.
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) === -1) {
            listeners.unshift(listener);

        }
    },
    /**
     * Synonym for addEventListener.
     * @param {String} type Type of the events.
     * @param {Function(e:enchant.Event)} listener Event listener to be added.
     * @see enchant.EventTarget#addEventListener
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },
    /**
     * Delete an event listener.
     * @param {String} [type] Type of the events.
     * @param {Function(e:enchant.Event)} listener Event listener to be deleted.
     */
    removeEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i !== -1) {
                listeners.splice(i, 1);
            }
        }
    },
    /**
     * Clear all defined event listeners of a given type.
     * If no type is given, all listeners will be removed.
     * @param {String} type Type of the events.
     */
    clearEventListener: function(type) {
        if (type != null) {
            delete this._listeners[type];
        } else {
            this._listeners = {};
        }
    },
    /**
     * Issue an event.
     * @param {enchant.Event} e Event to be issued.
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null){
            this['on' + e.type](e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
});
