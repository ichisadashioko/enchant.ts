import Entity from './Entity'
import Surface from './Surface'
import Event from './Event'
import { SpriteFrame } from './types'

/**
 * @example
 * var bear = new Sprite(32, 32);
 * bear.image = core.assets['chara1.gif'];
 */
export default class Sprite extends Entity {

    _image: Surface | null

    /**
     * Image displayed in the Sprite.
     */
    get image() {
        return this._image
    }

    set image(value: Surface | null) {
        if (value === undefined) {
            throw new Error(
                'Assigned value on Sprite.image is undefined. '
                + 'Please double-check image path, and check if the '
                + 'image you want to use is preload before use.'
            )
        }

        if (value === this._image) {
            return
        }

        this._image = value
        this._computeFramePosition()
    }

    _frame: number | null

    /**
     * Index of the frame to be displayed.
     * Frames with the same width and height as Sprite will be arrayed from upper left corner of the
     * {@link enchant.Sprite.image} image. When a sequence of numbers is provided, the displayed frame
     * will switch automatically. At the end of the array the sequence will restart. By setting
     * a value within the sequence to null, the frame switching is stopped.
     * 
     * @example
     * var sprite = new Scrite(32, 32);
     * sprite.frame = [0, 1, 0, 2]
     * //-> 0, 1, 0, 2, 0, 1, 0, 2, etc.
     * sprite.frame = [0, 1, 0, 2, null]
     * //-> 0, 1, 0, 2, (2, 2, etc. :stop)
     */
    get frame() {
        return this._frame
    }

    set frame(value: SpriteFrame) {
        let isTheSameFrame = (this._frameSequence == null) && (this._frame === value)
        if (isTheSameFrame || (this._deepCompareToPreviousFrame(value))) {
            return
        }

        if (value instanceof Array) {
            this._frameSequence = value
        } else {
            this._frameSequence = null
            this._frame = value
            this._computeFramePosition()
        }
    }

    _originalFrameSequence?: Array<number | null> | null
    __frameSequence: Array<number | null> | null

    get _frameSequence() {
        return this.__frameSequence
    }

    set _frameSequence(value: Array<number | null> | null) {
        if (value && !this.__frameSequence) {
            this.addEventListener(Event.ENTER_FRAME, this._rotateFrameSequence)
        } else if (!value && this.__frameSequence) {
            this.removeEventListener(Event.ENTER_FRAME, this._rotateFrameSequence)
        }

        if (value) {
            this.__frameSequence = value.slice()
            this._originalFrameSequence = value.slice()
            this._rotateFrameSequence()
        } else {
            this.__frameSequence = null
            this._originalFrameSequence = null
        }
    }

    _width: number

    get width() {
        return this._width
    }

    set width(value: number) {
        this._width = value
        this._computeFramePosition()
        this._dirty = true
    }

    _height: number

    get height() {
        return this._height
    }

    set height(value: number) {
        this._height = value
        this._computeFramePosition()
        this._dirty = true
    }

    _frameLeft: number
    _frameTop: number

    constructor(width: number, height: number) {
        super()

        // TODO add dirty and recompute
        this._width = width
        this._height = height
        this._image = null
        this._debugColor = '#ff0000'
        this._frameLeft = 0
        this._frameTop = 0
        this._frame = 0
        this.__frameSequence = null
    }

    /**
     * If we are setting the same frame Array as animation,
     * just continue animating.
     */
    _deepCompareToPreviousFrame(frame: number | Array<number | null> | null) {
        if (frame === this._originalFrameSequence) {
            return true
        }

        if (frame == null || this._originalFrameSequence == null) {
            return false
        }

        if (!(frame instanceof Array)) {
            return false
        }

        if (frame.length !== this._originalFrameSequence.length) {
            return false
        }

        for (let i = 0; i < frame.length; i++) {
            if (frame[i] !== this._originalFrameSequence[i]) {
                return false
            }
        }

        return true
    }

    _computeFramePosition() {
        let image = this._image
        if (image != null) {
            let row = image.width / this._width | 0
            let rowIndex = (this._frame == null) ? 0 : this._frame / row
            let colIndex = (this._frame == null) ? 0 : this._frame % row

            this._frameLeft = colIndex * this._width
            this._frameTop = rowIndex * this._height % image.height
        }
    }

    _rotateFrameSequence() {
        let frameSequence = this._frameSequence
        if (frameSequence && frameSequence.length !== 0) {
            let nextFrame = frameSequence.shift()
            if (nextFrame == null) {
                this._frameSequence = null
                this.dispatchEvent(new Event(Event.ANIMATION_END))
            } else {
                if (nextFrame === undefined) {
                    throw new Error('There is problem here! Call someone for help!')
                }

                this._frame = nextFrame
                this._computeFramePosition()
                frameSequence.push(nextFrame)
            }
        }
    }

    cvsRender(ctx: CanvasRenderingContext2D) {
        let image = this._image
        let w = this._width
        let h = this._height

        if (image && w !== 0 && h !== 0) {
            let iw = image.width
            let ih = image.height

            if (iw < w || ih < h) {
                ctx.fillStyle = Surface._getPattern(image)
                ctx.fillRect(0, 0, w, h)
            } else {
                let elem = image._element
                let sx = this._frameLeft
                let sy = Math.min(this._frameTop, ih - h)
                // IE9 doesn't allow for negative or 0 widths/heights when drawing on the Canvas element
                let sw = Math.max(0.01, Math.min(iw - sx, w))
                let sh = Math.max(0.01, Math.min(ih - sy, h))
                ctx.drawImage(elem, sx, sy, sw, sh, 0, 0, w, h)
            }
        }
    }

    domRender() {
        if (this._image) {
            if (this._image._css) {
                this._style.backgroundImage = this._image._css
                this._style.backgroundPosition = `${-this._frameLeft}px -${-this._frameTop}px`
            } else if (this._image._element) { }
        }
    }
}