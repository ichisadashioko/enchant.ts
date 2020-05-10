import Core from './Core'
import EventType from './EventType'
import InputSource from './InputSource'
import InputManager from './InputManager'

export default class Event {


    /**
     * The type of the event.
     */
    type: EventType | string

    /**
     * The target of the event.
     */
    target

    /**
     * The x-coordinate of the event's occurrence.
     */
    x: number

    /**
     * The y-coordinate of the event's occurrence.
     */
    y: number

    /**
     * The x-coordinate of the event's occurrence relative to the object which issued the event.
     */
    localX: number

    /**
     * The y-coordinate of the event's occurrence relative to the object which issued the event.
     */
    localY: number

    /**
     * A class for an independent implementation of events similar to DOM Events.
     * Does not include phase concepts.
     * @param type Event type.
     */
    constructor(type: EventType | string) {
        this.type = type
        this.target = null
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

export class EnterFrameEvent extends Event {
    elapsed: number

    constructor(elapsed: number) {
        super(EventType.ENTER_FRAME)
        this.elapsed = elapsed
    }
}

export class InputStateChangedEvent extends Event {
    data: boolean
    source: InputSource

    constructor(data: boolean, source: InputSource) {
        super(EventType.INPUT_STATE_CHANGED)
        this.data = data
        this.source = source
    }
}

export class InputEvent extends Event {
    source: InputManager

    constructor(type: EventType | string, source: InputManager) {
        super(type)
        this.source = source
    }
}