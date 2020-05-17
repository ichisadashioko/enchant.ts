import ActionEventTarget from './ActionEventTarget'
import { ActionParams } from './types'
import Event from './Event'
import Timeline from './Timeline'
import Node from './Node'

export default class Action extends ActionEventTarget {
    time: number
    frame: number
    timeline: Timeline | null
    node: Node | null
    onactionstart: (e: Event) => void
    onactiontick: (e: Event) => void
    onactionend: (e: Event) => void

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
     * 
     * You can specify a listener for these events to perform specific events when they occur.
     */
    constructor(param: ActionParams) {
        super()
        this.frame = 0

        this.time = param.time
        this.onactionstart = param.onactionstart
        this.onactiontick = param.onactiontick
        this.onactionend = param.onactionend

        let action = this
        this.timeline = null
        this.node = null

        this.addEventListener(Event.ADDED_TO_TIMELINE, function (evt) {
            if (evt.timeline == null) {
                throw new Error(`${Event.ADDED_TO_TIMELINE} requires timeline property!`)
            }

            action.timeline = evt.timeline
            action.node = evt.timeline.node
            action.frame = 0
        })

        this.addEventListener(Event.REMOVED_FROM_TIMELINE, function () {
            action.timeline = null
            action.node = null
            action.frame = 0
        })

        this.addEventListener(Event.ACTION_TICK, function (evt) {
            if (evt.elapsed == null || evt.timeline == null) {
                throw new Error(`${Event.ACTION_TICK} requires elapsed and timeline properties!`)
            }

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
