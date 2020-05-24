import Node from './Node'


/**
 * TODO Most of the code for DomlessManager are dead code from examples
 * inspection so there is not example usages. There is some from the
 * integration tests.
 */
export default class DomlessManager {

    _domRef: [] // TODO
    targetNode: Node

    constructor(node: Node) {
        this._domRef = []
        this.targetNode = node
    }

    getDomElement(): HTMLElement[] {
        // TODO
    }

    getDomElementAsNext(): HTMLElement | null {
        // TODO
    }
}