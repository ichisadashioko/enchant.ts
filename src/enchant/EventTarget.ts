import Event from './Event.ts'
import { SpriteFrame } from './types.ts'

/**
 * A class for implementation of events similar to DOM Events.
 * However, it does not include the concept of phases.
 */
export default class EventTarget {

    _offsetX: number
    _offsetY: number
    _listeners: Record<string, Array<(e: Event) => void>>

    constructor() {
        this._offsetX = 0
        this._offsetY = 0
        this._listeners = {}
    }

    /**
     * Add a new event listener which will be executed when the event is dispatched.
     * @param type Type of the events.
     * @param listener Event listener to be added.
     */
    addEventListener(type: string, listener: (e: Event) => void) {
        var listeners = this._listeners[type]
        if (listeners == null) {
            this._listeners[type] = [listener]
        } else if (listeners.indexOf(listener) === -1) {
            listeners.unshift(listener)
        }
    }

    /**
     * Synonym for addEventListener.
     * @param type Type of the events.
     * @param listener Event listener to be added.
     */
    on(type: string, listener: (e: Event) => void) {
        this.addEventListener.apply(this, [type, listener])
    }

    /**
     * Delete an event listener.
     * @param type Type of the events.
     * @param listener Event listener to be deleted.
     */
    removeEventListener(type: string, listener: (e: Event) => void) {
        var listeners = this._listeners[type] as Array<Function>
        if (listeners != null) {
            var i = listeners.indexOf(listener)
            if (i !== -1) {
                listeners.splice(i, 1)
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
            delete this._listeners[type]
        } else {
            this._listeners = {}
        }
    }

    /**
     * Issue an event.
     * @param e Event to be issued.
     */
    dispatchEvent(e: Event) {
        e.target = this

        e.localX = e.x - this._offsetX
        e.localY = e.y - this._offsetY

        // TODO attach as listener instead of using dirty reflection
        // throw new Error('Fix the dirty reflection code!')
        // @ts-ignore
        if (this['on' + e.type] != null) {
            // @ts-ignore
            this['on' + e.type](e)
        }

        var listeners = this._listeners[e.type]
        if (listeners != null) {
            listeners = listeners.slice()
            for (let i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e)
            }
        }
    }
}
