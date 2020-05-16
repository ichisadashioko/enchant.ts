import Action from './Action'
import { ActionParams } from './types'

/**
 * Actions to be executed in parallel. It's possible to have more than one child action.
 */
export default class ParallelAction extends Action {

    constructor(param: ActionParams) {
        super(param)
    }
}