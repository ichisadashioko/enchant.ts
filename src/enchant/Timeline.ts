import EventTarget from './EventTarget'
import Event from './Event'
import EventType from './EventType'
import Node from './Node'
import ParallelAction from './ParallelAction'

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
    queue: EventTarget[]
    paused: boolean
    looped: boolean
    isFrameBased: boolean
    _parallel?: ParallelAction
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
        this._activated = false

        this._nodeEventListener = this._nodeEventListener.bind(this)
        this._onenterframe = this._onenterframe.bind(this)

        this.addEventListener(EventType.ENTER_FRAME, this._onenterframe)
    }

    /**
     * 
     * @param elapsed 
     */
    tick(elapsed: number) {
        if (this.queue.length > 0) {
            let action = this.queue[0]
            if (action.frame === 0) {
                let f = new Event(EventType.ACTION_START)
                f.timeline = this
                action.dispatchEvent(f)
            }

            let e = new Event(EventType.ACTION_TICK)
            e.timeline = this
            e.elapsed = elapsed
            action.dispatchEvent(e)
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

    _nodeEventListener(e: Event) {
        this.dispatchEvent(e)
    }

    _deactivateTimeline() {
        if (this._activated) {
            this._activated = false
            this.node.removeEventListener(EventType.ENTER_FRAME, this._nodeEventListener)
        }
    }

    _activateTimeline() {
        if (!this._activated && !this.paused) {
            this.node.addEventListener(EventType.ENTER_FRAME, this._nodeEventListener)
            this._activated = true
        }
    }

}