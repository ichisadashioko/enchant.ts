import EventTarget from './EventTarget'
import Event from './Event'
import Node from './Node'
import ParallelAction from './ParallelAction'
import Action from './Action'

/**
 * Time-line class.
 * 
 * Class for managing the action.
 * 
 * For one node to manipulate the timeline of one must correspond.
 * Time-line class has a method to add a variety of actions to itself,
 * entities can be animated and various operations by using these briefly.
 * You can choose time based and frame based (default) animation.
 */
export default class Timeline extends EventTarget {
    node: Node
    queue: Action[]
    paused: boolean
    looped: boolean
    isFrameBased: boolean
    _parallel: ParallelAction | null
    _activated: boolean

    /**
     * @param node target node.
     */
    constructor(node: Node) {
        super()

        this.node = node
        this.queue = []
        this.paused = false
        this.looped = false
        this.isFrameBased = true
        this._parallel = null
        this._activated = false

        this._nodeEventListener = this._nodeEventListener.bind(this)
        this._onenterframe = this._onenterframe.bind(this)

        this.addEventListener(Event.ENTER_FRAME, this._onenterframe)
    }

    _nodeEventListener(e: Event) {
        this.dispatchEvent(e)
    }

    _deactivateTimeline() {
        if (this._activated) {
            this._activated = false
            this.node.removeEventListener(Event.ENTER_FRAME, this._nodeEventListener)
        }
    }

    _activateTimeline() {
        if (!this._activated && !this.paused) {
            this.node.addEventListener(Event.ENTER_FRAME, this._nodeEventListener)
            this._activated = true
        }
    }

    _onenterframe(e: Event) {
        if (this.paused) {
            return
        }

        if (e.elapsed === undefined) {
            throw new Error('Event does not contain elapsed property!')
        }

        this.tick(this.isFrameBased ? 1 : e.elapsed)
    }

    setFrameBased() {
        this.isFrameBased = true
    }

    setTimeBased() {
        this.isFrameBased = false
    }

    next(remainingTime: number) {
        let e: Event
        let action = this.queue.shift()

        if (action) {
            e = new Event(Event.ACTION_END)
            e.timeline = this
            action.dispatchEvent(e)

            e = new Event(Event.REMOVED_FROM_TIMELINE)
            e.timeline = this
            action.dispatchEvent(e)

            if (this.looped) {
                this.add(action)
            }
        }

        if (this.queue.length === 0) {
            this._deactivateTimeline()
            return
        }

        let nextTarget = this.queue[0]
        let nextTargetRemainingTime = (nextTarget instanceof Action) ? nextTarget.time : undefined
        if (remainingTime > 0 || (nextTarget && nextTargetRemainingTime === 0)) {
            e = new Event(Event.ACTION_TICK)
            e.elapsed = remainingTime
            e.timeline = this
            nextTarget.dispatchEvent(e)
        }
    }

    /**
     * 
     * @param elapsed 
     */
    tick(elapsed: number) {
        if (this.queue.length > 0) {
            let action = this.queue[0]
            if (action.frame === 0) {
                let f = new Event(Event.ACTION_START)
                f.timeline = this
                action.dispatchEvent(f)
            }

            let e = new Event(Event.ACTION_TICK)
            e.timeline = this
            e.elapsed = elapsed
            action.dispatchEvent(e)
        }
    }

    add(action: Action) {
        this._activateTimeline()

        if (this._parallel) {
            this._parallel.actions.push(action)
            this._parallel = null
        } else {
            this.queue.push(action)
        }

        action.frame = 0

        let e = new Event(Event.ADDED_TO_TIMELINE)
        e.timeline = this
        action.dispatchEvent(e)

        e = new Event(Event.ACTION_ADDED)
        e.action = action
        this.dispatchEvent(e)

        return this
    }
}
