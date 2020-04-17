import Event from './Event'

/**
 * A class for implementation of events similar to DOM Events.
 * However, it does not include the concept of phases.
 */
export default class EventTarget {
    _offsetX: number;
    _offsetY: number;
    _listeners;

    frame?: number;

    constructor() {
        this._listeners = {}
    }

    /**
     * Add a new event listener which will be executed when the event is dispatched.
     * @param type Type of the events.
     * @param {Function(enchant.Event)} listener Event listener to be added.
     */
    addEventListener(type: string, listener: Function) {
        var listeners = this._listeners[type] as Array<Function>;
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) === -1) {
            listeners.unshift(listener);
        }
    }

    /**
     * Synonym for addEventListener.
     * @param {String} type Type of the events.
     * @param {Function(enchant.Event)} listener Event listener to be added.
     */
    on() {
        this.addEventListener.apply(this, arguments);
    }

    /**
     * Delete an event listener.
     * @param type Type of the events.
     * @param {Function(enchant.Event)} listener Event listener to be deleted.
     */
    removeEventListener(type: string, listener: Function) {
        var listeners = this._listeners[type] as Array<Function>;
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i !== -1) {
                listeners.splice(i, 1);
            }
        }
    }

    /**
     * Clear all defined event listeners of a given type.
     * If no type is given, all listeners will be removed.
     * @param type Type of the events.
     */
    clearEventListener(type?: string) {
        if (type != null) {
            delete this._listeners[type];
        } else {
            this._listeners = {};
        }
    }

    /**
     * Issue an event.
     * @param e Event to be issued.
     */
    dispatchEvent(e: Event) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null) {
            this['on' + e.type](e);
        }
        var listeners = this._listeners[e.type] as Array<Function>;
        if (listeners != null) {
            listeners = listeners.slice();
            for (let i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
}
