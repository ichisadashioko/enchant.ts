import EventTarget from './EventTarget'
import EventType from './EventType'
import Event from './Event'
import InputSource from './InputSource'

/**
 * Class for managing input.
 */
export default class InputManager extends EventTarget {

    /**
     * Array that store event target.
     */
    broadcastTargets: EventTarget[]

    /**
     * Object that store input state.
     */
    valueStore: Record<string, boolean>

    /**
     * source that will be added to event object.
     */
    source: InputManager

    _binds: Record<string, string>

    /**
     * Class for managing input.
     * 
     * @param valueStore object that store input state.
     * @param source source that will be added to event object.
     */
    constructor(valueStore: Record<string, boolean>, source?: InputManager) {
        super()
        this.broadcastTargets = []
        this.valueStore = valueStore
        this.source = source || this
        this._binds = {}

        this._stateHandler = this._stateHandler.bind(this)
    }

    _stateHandler(e: Event) {
        if (e.source === undefined || e.data === undefined) {
            throw new Error('State changed event requires source and data properties!')
        }

        let id = e.source.identifier
        let name = this._binds[id]
        this.changeState(name, e.data)
    }

    /**
     * Name specified input.
     * Input can be watched by flag or event.
     * @param inputSource input source.
     * @param name input name.
     */
    bind(inputSource: InputSource, name: string) {
        inputSource.addEventListener(EventType.INPUT_STATE_CHANGED, this._stateHandler)
        this._binds[inputSource.identifier] = name
    }

    /**
     * Remove binded name.
     * @param inputSource input source.
     */
    unbind(inputSource: InputSource) {
        inputSource.removeEventListener(EventType.INPUT_STATE_CHANGED, this._stateHandler)
        delete this._binds[inputSource.identifier]
    }

    /**
     * Add event target.
     * @param eventTarget broadcast target.
     */
    addBroadcastTarget(eventTarget: EventTarget) {
        let i = this.broadcastTargets.indexOf(eventTarget)
        if (i === -1) {
            this.broadcastTargets.push(eventTarget)
        }
    }

    /**
     * Remove event target.
     * @param eventTarget broadcast target.
     */
    removeBroadcastTarget(eventTarget: EventTarget) {
        let i = this.broadcastTargets.indexOf(eventTarget)
        if (i !== -1) {
            this.broadcastTargets.splice(i, 1)
        }
    }

    broadcastEvent(e: Event) {
        let targets = this.broadcastTargets
        for (let i = 0, l = targets.length; i < l; i++) {
            targets[i].dispatchEvent(e)
        }
    }

    /**
     * Change state of input.
     * @param name input name.
     * @param data input state.
     */
    changeState(name: string, data: boolean) { }
}
