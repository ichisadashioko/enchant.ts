import Node from './Node'
import Core from './Core'
import Event from './Event'

export default class Entity extends Node {

    /**
     * Entityを描画する際の合成処理を設定する.
     * Canvas上に描画する際のみ有効.
     * CanvasのコンテキストのglobalCompositeOperationにセットされる.
     */
    compositeOperation: string | null

    /**
     * Defines this Entity as a button.
     * When touched or clicked the corresponding button event is dispatched.
     * Valid buttonModes are: left, right, up, down, a, b.
     */
    buttonMode: 'left' | 'right' | 'a' | 'b' | null

    /**
     * Indicates if this Entity is being clicked.
     * Only works when {@link enchant.Entity.buttonMode} is set.
     */
    buttonPressed: boolean

    _width: number

    /**
     * The width of Entity.
     */
    get width() { return this._width }

    set width(value: number) {
        if (this._width !== value) {
            this._width = value
            this._dirty = true
        }
    }

    _height: number

    /**
     * The height of the Entity.
     */
    get height() { return this._height }

    set height(value: number) {
        if (this._height !== value) {
            this._height = value
            this._dirty = true
        }
    }

    _backgroundColor: string

    /**
     * The Entity background color.
     * Must be provided in the same format as the CSS 'color' property.
     */
    get backgroundColor() { return this._backgroundColor }
    set backgroundColor(value: string) { this._backgroundColor = value }

    _debugColor: string

    /**
     * The Entity debug color.
     * Must be provided in the same format as the CSS 'color' property.
     */
    get debugColor() { return this._debugColor }
    set debugColor(value: string) { this._debugColor = value }

    _opacity: number

    /**
     * The transparency of this entity.
     * Defines the transparency level from 0 to 1
     * (0 is completely transparent, 1 is completely opaque).
     */
    get opacity() {
        return this._opacity
    }

    set opacity(value: number) {
        // @ts-ignore
        this._opacity = parseFloat(value)
    }

    _visible: boolean

    /**
     * Indicates whether or not to display this Entity.
     */
    get visible() { return this._visible }
    set visible(value: boolean) { this._visible = value }

    _style: CSSStyleDeclaration
    __styleStatus: Record<string, string>
    _touchEnabled: boolean

    /**
     * Indicates whether or not this Entity can be touched.
     */
    get touchEnabled() { return this._touchEnabled }

    set touchEnabled(value: boolean) {
        this._touchEnabled = value
        if (value) {
            this._style.pointerEvents = 'all'
        } else {
            this._style.pointerEvents = 'none'
        }
    }

    _clipping: boolean

    constructor() {
        super()

        this._rotation = 0
        this._scaleX = 1
        this._scaleY = 1

        this._touchEnabled = true
        this._clipping = false

        this._originX = null
        this._originY = null

        this._width = 0
        this._height = 0
        this._backgroundColor = ''
        this._debugColor = '#0000ff'
        this._opacity = 1
        this._visible = true
        // _buttonMode is not used anywhere!
        // this._buttonMode = null

        this._style = {} as CSSStyleDeclaration
        this.__styleStatus = {}

        this.compositeOperation = null

        this.buttonMode = null

        this.buttonPressed = false

        let core = Core.instance
        let that = this

        this.addEventListener('touchstart', function () {
            if (!that.buttonMode) {
                return
            }
            that.buttonPressed = true
            let eventType = that.buttonMode + 'buttondown'
            // @ts-ignore
            that.dispatchEvent(new Event(eventType))
            core.changeButtonState(that.buttonMode, true)
        })

        this.addEventListener('touchend', function () {
            if (!that.buttonMode) {
                return
            }

            that.buttonPressed = false
            let eventType = that.buttonMode + 'buttonup'
            // @ts-ignore
            that.dispatchEvent(new Event(eventType))
            core.changeButtonState(that.buttonMode, false)
        })
    }


    /**
     * Performs a collision detection based on whether or not the
     * bounding reactangles are intersecting.
     *
     * @param other An object like Entity, with the properties x, y,
     * width, height, which are used for the collision detection.
     * @returns True, if a collision was detected.
     */
    intersect(other: Entity) {
        if (other instanceof Entity) {
            return this._intersectOne(other)
        }

        return false
    }

    _intersectOne(other: Entity) {
        if (this._dirty) { this._updateCoordinate() }
        if (other._dirty) { other._updateCoordinate() }

        return (
            (this._offsetX < other._offsetX + other.width)
            && (other._offsetX < this._offsetX + this.width)
            && (this._offsetY < other._offsetY + other.height)
            && (other._offsetY < this._offsetY + this.height)
        )
    }

    intersectStrict(other: Entity) {
        if (other instanceof Entity) {
            return this._intersectStrictOne(other)
        }

        return false
    }

    _intersectStrictOne(other: Entity) {
        if (this._dirty) { this._updateCoordinate() }
        if (other._dirty) { other._updateCoordinate() }

        let rect1 = this.getOrientedBoundingRect()
        let rect2 = this.getOrientedBoundingRect()
        let lt1 = rect1.leftTop, rt1 = rect1.rightBottom
        let lb1 = rect1.leftBottom, rb1 = rect1.rightBottom
        let lt2 = rect2.leftTop, rt2 = rect2.rightTop
        let lb2 = rect2.leftBottom, rb2 = rect2.rightBottom
        let ltx1 = lt1[0], lty1 = lt1[1], rtx1 = rt1[0], rty1 = rt1[1]
        let lbx1 = lb1[0], lby1 = lb1[1], rbx1 = rb1[0], rby1 = rb1[1]
        let ltx2 = lt2[0], lty2 = lt2[1], rtx2 = rt2[0], rty2 = rt2[1]
        let lbx2 = lb2[0], lby2 = lb2[1], rbx2 = rb2[0], rby2 = rb2[1]
        let t1 = [rtx1 - ltx1, rty1 - lty1]
        let r1 = [rbx1 - rtx1, rby1 - rty1]
        let b1 = [lbx1 - rbx1, lby1 - rby1]
        let l1 = [ltx1 - lbx1, lty1 - lby1]
        let t2 = [rtx2 - ltx2, rty2 - lty2]
        let r2 = [rbx2 - rtx2, rby2 - rty2]
        let b2 = [lbx2 - rbx2, lby2 - rby2]
        let l2 = [ltx2 - lbx2, lty2 - lby2]
        let cx1 = (ltx1 + rtx1 + lbx1 + rbx1) >> 2
        let cy1 = (lty1 + rty1 + lby1 + rby1) >> 2
        let cx2 = (ltx2 + rtx2 + lbx2 + rbx2) >> 2
        let cy2 = (lty2 + rty2 + lby2 + rby2) >> 2

        if (
            (t1[0] * (cy2 - lty1) - t1[1] * (cx2 - ltx1) > 0)
            && (r1[0] * (cy2 - rty1) - r1[1] * (cx2 - rtx1) > 0)
            && (b1[0] * (cy2 - rby1) - b1[1] * (cx2 - rbx1) > 0)
            && (l1[0] * (cy2 - lby1) - l1[1] * (cx2 - lbx1) > 0)
        ) {
            return true
        } else if (
            (t2[0] * (cy1 - lty2) - t2[1] * (cx1 - ltx2) > 0)
            && (r2[0] * (cy1 - rty2) - r2[1] * (cx1 - rtx2) > 0)
            && (b2[0] * (cy1 - rby2) - b2[1] * (cx1 - rbx2) > 0)
            && (l2[0] * (cy1 - lby2) - l2[1] * (cx1 - lbx2) > 0)
        ) {
            return true
        } else {
            // bounding box?
            let poss1 = [lt1, rt1, rb1, lb1]
            let poss2 = [lt2, rt2, rb2, lb2]
            // direction?
            let dirs1 = [t1, r1, b1, l1]
            let dirs2 = [t2, r2, b2, l2]

            for (let i = 0; i < 4; i++) {
                let pos1 = poss1[i]
                let px1 = pos1[0]
                let py1 = pos1[1]
                let dir1 = dirs1[i]
                let dx1 = dir1[0]
                let dy1 = dir1[1]

                for (let j = 0; j < 4; j++) {
                    let pos2 = poss2[j]
                    let px2 = pos2[0]
                    let py2 = pos2[1]
                    let dir2 = dirs2[j]
                    let dx2 = dir2[0]
                    let dy2 = dir2[1]

                    let c = dx1 * dy2 - dy1 * dx2

                    if (c !== 0) {
                        let vx = px2 - px1
                        let vy = py2 - py1
                        let c1 = (vx * dy1 - vy * dx1) / c
                        let c2 = (vx * dy2 - vy * dx2) / c

                        if (0 < c1 && c1 < 1 && 0 < c2 && c2 < 1) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }

    /**
     * Performs a collision detection based on distance from the Entity's central point.
     *
     * @param other An object like Entity, with properties x, y, width, height,
     * which are used for the collision detection.
     * @param distance The greatest distance to be considered for a collision.
     * The default distance is the average of both objects width and height.
     */
    within(other: Entity, distance?: number) {
        if (this._dirty) { this._updateCoordinate() }
        if (other._dirty) { other._updateCoordinate() }

        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4
        }

        let x = this._offsetX - other._offsetX + (this.width - other.width) / 2
        let x2 = x * x
        let y = this._offsetY - other._offsetY + (this.height - other.height) / 2
        let y2 = y * y

        return (x2 + y2) < (distance * distance)

    }

    /**
     * Enlarges or shrinks this Entity.
     * @param x Scaling factor on the x axis.
     * @param y Scaling factor on the y axis.
     */
    scale(x: number, y?: number) {
        this._scaleX *= x
        this._scaleY *= (y != null) ? y : x
        this._dirty = true
    }

    /**
     * Rotate this Entity.
     * @param deg Rotation angle (degree).
     */
    rotate(deg: number) {
        this.rotation += deg
    }

    getBoundingRect() {
        let w = this.width || 0
        let h = this.height || 0
        let mat = this._matrix
        let m11w = mat[0] * w, m12w = mat[1] * w
        let m21h = mat[2] * h, m22h = mat[3] * h
        let mdx = mat[4], mdy = mat[5]
        let xw = [mdx, mdx + m11w, mdx + m21h, mdx + m11w + m21h].sort(function (a, b) { return a - b })
        let yh = [mdy, mdy + m12w, mdy + m22h, mdy + m12w + m22h].sort(function (a, b) { return a - b })

        return {
            left: xw[0],
            top: yh[0],
            width: xw[3] - xw[0],
            height: yh[3] - yh[0],
        }
    }

    getOrientedBoundingRect() {
        let w = this.width || 0
        let h = this.height || 0
        let mat = this._matrix
        let m11w = mat[0] * w, m12w = mat[1] * w
        let m21h = mat[2] * h, m22h = mat[3] * h
        let mdx = mat[4], mdy = mat[5]

        return {
            leftTop: [mdx, mdy],
            rightTop: [mdx + m11w, mdy + m12w],
            leftBottom: [mdx + m21h, mdy + m22h],
            rightBottom: [mdx + m11w + m21h, mdy + m12w + m22h],
        }
    }

    /**
     * Method signature for sub-classes.
     */
    domRender(e: HTMLElement) { }
}
