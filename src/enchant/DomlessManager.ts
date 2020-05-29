import Matrix from './Matrix'
import Entity from './Entity'
import Node from './Node'
import DomLayer from './DomLayer'
import DomManager from './DomManager'
import Scene from './Scene'

/**
 * TODO Most of the code for DomlessManager are dead code from examples
 * inspection so there is not example usages. There is some from the
 * integration tests.
 */
export default class DomlessManager {

    _domRef: HTMLElement[]
    targetNode: Node
    layer: DomLayer | null

    constructor(node: Node) {
        this._domRef = []
        this.targetNode = node

        // TODO check for side effects
        this.layer = null
    }

    _register(element: HTMLElement | HTMLElement[], nextElement: HTMLElement | null) {
        let i = -1

        if (nextElement) { this._domRef.indexOf(nextElement) }

        if (element instanceof Array) {
            // TODO check to see if `...` perform deep copy
            if (i === -1) {
                this._domRef.push(...element)
            } else {
                this._domRef.splice(1, 0, ...element)
            }
        } else {
            if (i === -1) {
                this._domRef.push(element)
            } else {
                this._domRef.splice(i, 0, element)
            }
        }
    }

    getNextManager(manager: DomManager | DomlessManager) {
        if (this.targetNode.parentNode) {
            let i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode)

            if (i !== (this.targetNode.parentNode.childNodes.length - 1)) {
                return this.targetNode.parentNode.childNodes[i + 1]._domManager
            }
        }

        return null
    }

    getDomElement() {
        let ret: HTMLElement[] = []
        this.targetNode.childNodes?.forEach(function (child) {
            if (child._domManager) {
                ret = ret.concat(child._domManager.getDomElement())
            }
        })

        return ret
    }

    getDomElementAsNext() {
        if (this._domRef.length) {
            return this._domRef[0]
        } else {
            let nextManager = this.getNextManager(this)
            if (nextManager) {
                if (nextManager instanceof DomManager) {
                    return nextManager.element
                }
            }
        }

        return null
    }

    addManager(childManager: DomManager, nextManager?: DomManager | DomlessManager | null) {
        let parentNode = this.targetNode.parentNode

        if (parentNode) {
            if (!nextManager) {
                nextManager = this.getNextManager(this)
            }

            if (parentNode instanceof Scene) {
                parentNode._layers.Dom._domManager?.addManager(childManager, nextManager)
            } else {
                parentNode._domManager?.addManager(childManager, nextManager)
            }
        }

        let nextElement = nextManager ? nextManager.getDomElementAsNext() : null
        this._register(childManager.getDomElement(), nextElement)
        this.setLayer(this.layer)
    }

    removeManager(childManager: DomManager | DomlessManager) {
        let i = -1
        if (childManager instanceof DomManager) {
            i = this._domRef.indexOf(childManager.element)
        }

        if (i !== -1) {
            let dom = this._domRef[i]
            dom.parentNode?.removeChild(dom)
            this._domRef.splice(i, 1)
        }

        this.setLayer(this.layer)
    }

    setLayer(layer: DomLayer | null) {
        this.layer = layer
        let node = this.targetNode

        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let manager = node.childNodes[i]._domManager
                if (manager) {
                    manager.setLayer(layer)
                }
            }
        }
    }

    render(inheritMat: number[]) {
        let matrix = Matrix.instance
        let stack = matrix.stack
        let node = this.targetNode
        let dest: number[] = []
        matrix.makeTransformMatrix(node, dest)
        matrix.multiply(stack[stack.length - 1], dest, dest)
        matrix.multiply(inheritMat, dest, inheritMat)
        node._matrix = inheritMat
        let ox = (typeof node._originX === 'number') ? node._originX : ((typeof node.width === 'number') ? node.width / 2 : 0)
        let oy = (typeof node._originY === 'number') ? node._originY : ((typeof node.height === 'number') ? node.height / 2 : 0)
        let vec = [ox, oy]

        matrix.multiply(dest, vec, vec)
        node._offsetX = vec[0] - ox
        node._offsetY = vec[1] - oy
        stack.push(dest)
    }

    remove() {
        this._domRef = []

        // TODO check for side effects
        // @ts-ignore
        this.targetNode = null
    }
}