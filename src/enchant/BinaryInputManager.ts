import InputManager from './InputManager'
import BinaryInputSource from './BinaryInputSource'
import Event, { InputEvent } from './Event'
import EventType from './EventType'

/**
 * Class for managing input.
 */
export default class BinaryInputManager extends InputManager {
    /**
     * The number of active inputs.
     */
    activeInputsNum: number

    /**
     * event name suffix that dispatched by BinaryInputManager.
     */
    activeEventNameSuffix: string

    /**
     * event name suffix that dispatched by BinaryInputManager.
     */
    inactiveEventNameSuffix: string

    constructor(flagStore: Record<string, boolean>, activeEventNameSuffix: string, inactiveEventNameSuffix: string, source?: InputManager) {
        super(flagStore, source)
        this.activeInputsNum = 0
        this.activeEventNameSuffix = activeEventNameSuffix
        this.inactiveEventNameSuffix = inactiveEventNameSuffix
    }

    /**
     * Name specified input.
     * @param binaryInputSource input source
     * @param name input name
     */
    bind(binaryInputSource: BinaryInputSource, name: string) {
        super.bind(binaryInputSource, name)
        this.valueStore[name] = false
    }

    /**
     * Remove binded name.
     * @param binaryInputSource input source
     */
    unbind(binaryInputSource: BinaryInputSource) {
        let name = this._binds[binaryInputSource.identifier]
        super.unbind(binaryInputSource)
        delete this.valueStore[name]
    }

    /**
     * Change state of input.
     * @param name input name
     * @param bool input state
     */
    changeState(name: string, bool: boolean) {
        if (bool) {
            this._down(name)
        } else {
            this._up(name)
        }
    }

    _down(name: string) {
        let inputEvent: Event
        if (!this.valueStore[name]) {
            this.valueStore[name] = true

            const eventType = (this.activeInputsNum) ? EventType.INPUT_CHANGE : EventType.INPUT_START
            this.activeInputsNum++

            inputEvent = new InputEvent(eventType, this.source)
            this.broadcastEvent(inputEvent)
        }

        let downEvent = new InputEvent(name + this.activeEventNameSuffix, this.source)
        this.broadcastEvent(downEvent)
    }

    _up(name: string) {
        let inputEvent: Event
        if (this.valueStore[name]) {
            this.valueStore[name] = false

            this.activeInputsNum--
            const eventType = (this.activeInputsNum) ? EventType.INPUT_CHANGE : EventType.INPUT_END

            inputEvent = new InputEvent(eventType, this.source)
            this.broadcastEvent(inputEvent)
        }
        let upEvent = new InputEvent(name + this.inactiveEventNameSuffix, this.source)
        this.broadcastEvent(upEvent)
    }
}
