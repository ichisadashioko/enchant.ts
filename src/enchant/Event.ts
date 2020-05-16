import Core from './Core'
import EventType from './EventType'
import InputSource from './InputSource'
import InputManager from './InputManager'
import EventTarget from './EventTarget'
import Timeline from './Timeline'
import Node from './Node'

export default class Event {


    /**
     * The type of the event.
     */
    type: EventType | string

    /**
     * The target of the event.
     * 
     * @usedwith 'onchildadded'
     */
    target?: EventTarget

    /**
     * The x-coordinate of the event's occurrence.
     */
    x: number

    /**
     * The y-coordinate of the event's occurrence.
     */
    y: number

    /**
     * The x-coordinate of the event's occurrence relative to the object
     * which issued the event.
     */
    localX: number

    /**
     * The y-coordinate of the event's occurrence relative to the object
     * which issued the event.
     */
    localY: number

    /**
     * @usedwith 'error'
     */
    message?: string

    /**
     * @usedwith 'enterframe', 'actiontick'
     */
    elapsed?: number

    /**
     * @usedwith 'actionstart'
     */
    timeline?: Timeline

    /**
     * @usedwith 'inputstatechanged'
     */
    source?: InputSource

    /**
     * @usedwith 'inputstatechanged'
     */
    data?: boolean

    /**
     * @usedwith 'childadded'
     */
    node?: Node

    /**
     * @usedwith 'childadded'
     */
    next?: Node | null

    /**
     * A class for an independent implementation of events similar to
     * DOM Events. Does not include phase concepts.
     * @param type Event type.
     */
    constructor(type: EventType | string) {
        this.type = type
        this.x = 0
        this.y = 0
        this.localX = 0
        this.localY = 0
    }

    _initPosition(pageX: number, pageY: number) {
        let core = Core.instance
        this.x = this.localX = (pageX - core._pageX) / core.scale
        this.y = this.localY = (pageY - core._pageY) / core.scale
    }
}
