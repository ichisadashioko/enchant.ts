import EventTarget from './EventTarget'

/**
 * EventTarget which can change the context of event listeners.
 */
export default class ActionEventTarget extends EventTarget {

    constructor() {
        super()
    }

    dispatchEvent(e) {
        let target = this.node ? this.node : this

        e.target = target
        e.localX = e.x - target._offsetX
        e.localY = e.y - target._offsetY

        if (this['on' + e.type] != null) {
            this['on' + e.type].call(target, e)
        }
        let listeners = this._listeners[e.type]
        if (listeners != null) {
            listeners = listeners.slice()
            for (let i = 0; i < listeners.length; i++) {
                listeners[i].call(target, e)
            }
        }
    }
}