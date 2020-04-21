import EventTarget from './EventTarget'
import EventType from './EventType'
import Event from './Event'
/**
 * Class that wrap input.
 */
export default class InputSource extends EventTarget {
    /**
     * identifier of InputSource.
     */
    identifier: string;

    /**
     * @param identifier identifier of InputSource
     */
    constructor(identifier: string) {
        super();
        this.identifier = identifier;
    }

    /**
     * Notify state change by event.
     * @param data state
     */
    notifyStateChange(data: any) {
        let e = new Event(EventType.INPUT_STATE_CHANGED);
        e.data = data;
        e.source = this;
        this.dispatchEvent(e);
    }
}
