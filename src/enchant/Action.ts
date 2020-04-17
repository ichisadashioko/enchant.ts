import ActionEventTarget from './ActionEventTarget'
import EventType from './EventType'

export default class Action extends ActionEventTarget {
    time
    frame: number
    timeline
    node

    /**
     * Actions are units that make up the timeline.
     * It is a unit used to specify the action you want to perform.
     * 
     * Actions that have been added to the timeline are performed in sequential order.
     * The transition from one action to the next occurs automatically after the number of frames specified by the time parameter have elapsed.
     * 
     * An actionstart event is fired when the action has started.
     * An actionend event is fired when the action has stopped.
     * For each frame that elapses, an actiontick event is fired.
     */
    constructor(param) {
        super()
        this.time = null
        this.frame = 0

        let action = this
        this.timeline = null
        this.node = null

        this.addEventListener(EventType.ADDED_TO_TIMELINE, function (evt) {
            action.timeline = evt.timeline
            action.node = evt.timeline.node
            action.frame = 0
        })

        this.addEventListener(EventType.REMOVED_FROM_TIMELINE, function () {
            action.timeline = null
            action.node = null
            action.frame = 0
        })

        this.addEventListener(EventType.ACTION_TICK, function (evt) {
            let remaining = action.time - (action.frame + evt.elapsed)
            if (action.time != null && remaining <= 0) {
                action.frame = action.time
                evt.timeline.next(-remaining)
            } else {
                action.frame += evt.elapsed
            }
        })
    }
}
