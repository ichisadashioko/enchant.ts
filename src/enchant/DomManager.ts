import Core from './Core'
import ENV from './Env'
import DomlessManager from './DomlessManager'
import Matrix from './Matrix'
import Group from './Group'
import DomLayer from './DomLayer'
import Node from './Node'

type HTMLElementTagName = keyof HTMLElementTagNameMap

export default class DomManager {

    targetNode: Node
    layer: DomLayer | null
    element: HTMLElement
    style: CSSStyleDeclaration

    constructor(node: Node, elementDefinition: HTMLElement | HTMLElementTagName) {
        let core = Core.instance
        this.layer = null
        this.targetNode = node

        if (typeof elementDefinition === 'string') {
            this.element = document.createElement(elementDefinition)
        } else if (elementDefinition instanceof HTMLElement) {
            this.element = elementDefinition
        } else {
            throw new Error(`Invalid element definition ${elementDefinition}!`)
        }

        this.style = this.element.style
        this.style.position = 'absolute' // TODO
        this.style.transformOrigin = '0px 0px'

        if (core._debug) {
            this.style.border = '1px solid blue'
            this.style.margin = '-1px'
        }

        this._setDomTarget = this._setDomTarget.bind(this)
        this._attachEvent()
    }

    _setDomTarget() {
        if (this.layer == null) {
            throw new Error(`layer is not set!`)
        }

        this.layer._touchEventTarget = this.targetNode
    }

    getDomElement() {
        return this.element
    }

    getDomElemenetAsNext() {
        return this.element
    }

    getNextManager(manager: DomManager) {
        if (this.targetNode.parentNode == null) {
            throw new Error(`this.targetNode.parentNode is ${this.targetNode.parentNode}!`)
        }

        let i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode)
        if (i !== this.targetNode.parentNode.childNodes.length - 1) {
            return this.targetNode.parentNode.childNodes[i + 1]._domManager
        } else {
            return null
        }
    }

    addManager(childManager, nextManager) {
        let nextElement
        if (nextManager) {
            nextElement = nextManager.getDomElementAsNext()
        }

        let element = childManager.getDomElement()
        if (element instanceof Array) {
            element.forEach(function (child) {
                if (nextElement) {
                    this.element.insertBefore(child, nextElement)
                } else {
                    this.element.appendChild(child)
                }
            }, this)
        } else {
            if (nextElement) {
                this.element.insertBefore(element, nextElement)
            } else {
                this.element.appendChild(element)
            }
        }

        this.setLayer(this.layer)
    }

    removeManager(childManager: DomManager | DomlessManager) {
        if (childManager instanceof DomlessManager) {
            let that = this
            childManager._domRef.forEach(function (element) {
                that.element.removeChild(element)
            })
        } else {
            this.element.removeChild(childManager.element)
        }

        this.setLayer(this.layer)
    }

    setLayer(layer) {
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

    render(inheritMat) {
        let node = this.targetNode
        let matrix = Matrix.instance
        let stack = matrix.stack
        let dest = []
        matrix.makeTransformMatrix(node, dest)
        matrix.multiply(stack[stack.length - 1], dest, dest)
        matrix.multiply(inheritMat, dest, inheritMat)
        node._matrix = inheritMat
        let ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0
        let oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0
        let vec = [ox, oy]
        matrix.multiply(dest, vec, vec)

        node._offsetX = vec[0] - ox
        node._offsetY = vec[1] - oy

        if (node.parentNode && !(node.parentNode instanceof Group)) {
            node._offsetX += node.parentNode._offsetX
            node._offsetY += node.parentNode._offsetY
        }

        if (node._dirty) {
            this.style.transform = `matrix(${dest[0].toFixed(10)},${dest[1].toFixed(10)},${dest[2].toFixed(10)},${dest[3].toFixed(10)},${dest[4].toFixed(10)},${dest[5].toFixed(10)})`
        }

        this.domRender()
    }

    domRender() {
        let node = this.targetNode
        if (!node._style) {
            node._style = {}
        }

        if (!node.__styleStatus) {
            node.__styleStatus = {}
        }

        if (node.width !== null) {
            node._style.width = node.width + 'px'
        }

        if (node.height !== null) {
            node._style.height = node.height + 'px'
        }

        node._style.opacity = node._opacity
        // TODO
        node._style['background-color'] = node._backgroundColor

        if (typeof node._visible !== 'undefined') {
            node._style.display = node._visible ? 'block' : 'none'
        }

        // TODO
        if (typeof node.domRender === 'function') {
            node.domRender(this.element)
        }

        let value
        for (let prop in node._style) {
            value = node._style[prop]
            if (node.__styleStatus[prop] !== value && value != null) {
                this.style.setProperty(prop, '' + value)
                node.__styleStatus[prop] = value
            }
        }
    }

    _attachEvent() {
        if (ENV.TOUCH_ENABLED) {
            this.element.addEventListener('touchstart', this._setDomTarget, true)
        }

        this.element.addEventListener('mousedown', this._setDomTarget, true)
    }

    _detachEvent() {
        if (ENV.TOUCH_ENABLED) {
            this.element.removeEventListener('touchstart', this._setDomTarget, true)
        }

        this.element.addEventListener('mousedown', this._setDomTarget, true)
    }

    remove() {
        this._detachEvent()

        // TODO check for side effects
        // @ts-ignore
        this.element = null
        // @ts-ignore
        this.style = null
        // @ts-ignore
        this.targetNode = null
    }
}