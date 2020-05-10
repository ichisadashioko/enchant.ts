import EventTarget from './EventTarget'
import { InputStateChangedEvent } from './Event'
/**
 * Class that wrap input.
 */
export default class InputSource extends EventTarget {
    /**
     * identifier of InputSource.
     */
    identifier: string

    /**
     * @param identifier identifier of InputSource
     */
    constructor(identifier: string) {
        super()
        this.identifier = identifier
    }

    /**
     * Notify state change by event.
     * @param data state
     */
    notifyStateChange(data: boolean) {
        let e = new InputStateChangedEvent(data, this)
        this.dispatchEvent(e)
    }
}
