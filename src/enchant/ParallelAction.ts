import Action from './Action'
import { ActionParams } from './types'
import Event from './Event'

/**
 * Actions to be executed in parallel. It's possible to have more than one child action.
 */
export default class ParallelAction extends Action {

    actions: Array<Action>
    endedActions: Array<Action>

    constructor(param: ActionParams) {
        super(param)

        this.actions = []
        this.endedActions = []

        let that = this

        this.addEventListener(Event.ACTION_START, function (evt) {
            for (let i = 0, l = that.actions.length; i < l; i++) {
                that.actions[i].dispatchEvent(evt)
            }
        })
    }
}