import ENV from './Env'
import Core from './Core'
import Surface from './Surface'

export default class CanvasSurface extends Surface {
    _element: HTMLCanvasElement

    /**
     * Surface drawing context.
     */
    context: CanvasRenderingContext2D

    _dirty: boolean

    constructor(width: number, height: number) {
        super()

        let core = Core.instance

        this.width = Math.ceil(width)
        this.height = Math.ceil(height)

        let id = 'enchant-surface' + core._surfaceID++

        this._element = document.createElement('canvas')
        this._element.width = width
        this._element.height = height
        this._element.style.position = 'absolute'
        this.context = this._element.getContext('2d')

        let that = this

        ENV.CANVAS_DRAWING_METHODS.forEach(function (name) {
            let method: Function = that.context[name]
            that.context[name] = function () {
                method.apply(that, arguments)
                that._dirty = true
            }
        })
    }

    /**
     * Return 1 pixel from the Surface.
     * @param x The pixel's x-coordinate.
     * @param y The pixel's y-coordinate.
     */
    getPixel(x: number, y: number) {
        return this.context.getImageData(x, y, 1, 1).data
    }

    /**
     * Sets one pixel within the surface.
     * @param x The pixel's x-coordinate.
     * @param y The pixel's y-coordinate.
     * @param r The pixel's red level.
     * @param g The pixel's green level.
     * @param b The pixel's blue level.
     * @param a The pixel's transparency.
     */
    setPixel(x: number, y: number, r: number, g: number, b: number, a: number) {
        let pixel = this.context.createImageData(1, 1)
        pixel.data[0] = r
        pixel.data[1] = g
        pixel.data[2] = b
        pixel.data[3] = a
        this.context.putImageData(pixel, x, y)
    }

    /**
     * Clear all Surface pixels and make the pixels transparent.
     */
    clear() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    /**
     * Draws the content of the given Surface onto this surface.
     * 
     * Wraps Canvas API drawImage and if mutiple arguments are given, 
     * these are getting applied to the Canvas drawImage method.
     * 
     * @example
     * var src = core.assets['src.gif']
     * var dst = new Surface(100, 100)
     * dst.draw(src)         // Draws source at (0, 0)
     * dst.draw(src, 50, 50) // Draws source at (50, 50)
     * // Draws just 30 horizontal and vertical pixels of source at (50, 50)
     * dst.draw(src, 50, 50, 30, 30)
     * // Takes the image content in src starting at (10, 10) with a (width, height) of (40, 40),
     * // scales it and draws it in this surface at (50, 50) with a (width, height) of (30, 30).
     * dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30)
     * 
     * @param image Surface used in drawing.
     */
    draw(image: Surface) {
        let _image = image._element
        if (arguments.length === 1) {
            this.context.drawImage(_image, 0, 0)
        } else {
            var args = arguments
            args[0] = image
            this.context.drawImage.apply(this.context, args)
        }
    }

    toDataURL() {
        return this._element.toDataURL()
    }
}