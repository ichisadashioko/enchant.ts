import EventTarget from './EventTarget'
import Event from './Event'

/**
 * EventTarget which can change the context of event listeners.
 */
export default class ActionEventTarget extends EventTarget {

    node?: EventTarget | null

    constructor() {
        super()
    }

    dispatchEvent(e: Event) {
        let target = this.node ? this.node : this

        e.target = target
        e.localX = e.x - target._offsetX
        e.localY = e.y - target._offsetY

        // TODO attach as listener instead of using dirty reflection
        throw new Error('Fix the commented code!')
        // if (this['on' + e.type] != null) {
        //     this['on' + e.type].call(target, e)
        // }

        let listeners = this._listeners[e.type]
        if (listeners != null) {
            listeners = listeners.slice()
            for (let i = 0; i < listeners.length; i++) {
                listeners[i].call(target, e)
            }
        }
    }
}
