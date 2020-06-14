import EventTarget from './EventTarget'
import Core from './Core'
import Event from './Event'

/**
 * Class that wraps canvas elements.
 * 
 * Can be used to set the `enchant.Sprite` and `enchant.Map` image properties to be displayed.
 * If you wish to access Canvas API use the `enchant.Surface.context` property.
 * 
 * @example
 * // Creates Sprite that displays a circle.
 * var ball = new Sprite(50, 50)
 * var surface = new Surface(50, 50)
 * surface.context.beginPath()
 * surface.context.arc(25, 25, 25, 0, Math.PI*2, true)
 * surface.context.fill()
 * ball.image = surface
 */
export default class Surface extends EventTarget {

    /**
     * Surface width.
     */
    width: number

    /**
     * Surface height.
     */
    height: number

    context: CanvasRenderingContext2D

    // TODO check to see `_element` should be add to super class
    _element: HTMLCanvasElement

    _pattern?: CanvasPattern

    _css?: string

    _dirty: boolean = true

    constructor(width: number, height: number) {
        super()

        this.width = Math.ceil(width)
        this.height = Math.ceil(height)

        this._element = document.createElement('canvas')
        this._element.width = width
        this._element.height = height
        this._element.style.position = 'absolute'
        this.context = this._element.getContext('2d')!

        let that = this

        // TODO
        let putImageData = this.context.putImageData
        this.context.putImageData = function () {
            // @ts-ignore
            putImageData.apply(that.context, arguments)
            that._dirty = true
        }

        let drawImage = this.context.drawImage
        this.context.drawImage = function () {
            // @ts-ignore
            drawImage.apply(that.context, arguments)
            that._dirty = true
        }

        let fill = this.context.fill
        this.context.fill = function () {
            // @ts-ignore
            fill.apply(that.context, arguments)
            that._dirty = true
        }

        let stroke = this.context.stroke
        this.context.stroke = function () {
            // @ts-ignore
            stroke.apply(that.context, arguments)
            that._dirty = true
        }

        let clearRect = this.context.clearRect
        this.context.clearRect = function () {
            // @ts-ignore
            clearRect.apply(that.context, arguments)
            that._dirty = true
        }

        let fillRect = this.context.fillRect
        this.context.fillRect = function () {
            // @ts-ignore
            fillRect.apply(that.context, arguments)
            that._dirty = true
        }

        let strokeRect = this.context.strokeRect
        this.context.strokeRect = function () {
            // @ts-ignore
            strokeRect.apply(that.context, arguments)
            that._dirty = true
        }

        let fillText = this.context.fillText
        this.context.fillText = function () {
            // @ts-ignore
            fillText.apply(that.context, arguments)
            that._dirty = true
        }

        let strokeText = this.context.strokeText
        this.context.strokeText = function () {
            // @ts-ignore
            strokeText.apply(that.context, arguments)
            that._dirty = true
        }
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
            // TODO better TS overloading
            // @ts-ignore
            this.context.drawImage.apply(this.context, args)
        }
    }

    /**
     * The copied Surface.
     */
    clone() {
        let clone = new Surface(this.width, this.height)
        clone.draw(this)
        return clone
    }

    /**
     * Creates a data URI scheme from this Surface.
     * 
     * @return The data URI schema that identifies this Surface 
     * and can be used to include this Surface into a DOM tree.
     */
    toDataURL() {
        return this._element.toDataURL()
    }

    /**
     * Loads an image and creates a Surface object out of it.
     * 
     * It is not possible to access properties or methods of the `enchant.Surface.context`,
     * or to call methods using the Canvas API - like `enchant.Surface.draw`, 
     * `enchant.Surface.clear`, `enchant.Surface.getPixel`, `enchant.Surface.setPixel` - 
     * of the wrapped image created with this method.
     * 
     * However, it is possible to use this surface to draw it to another surface 
     * using the `ehchant.Surface.draw` method.
     * The resulting surface can then be manipulated (when loading images 
     * in a cross-origin resource sharing environment, pixel acquisition 
     * and other image manipulation might be limited).
     * 
     * @param src The file path of the image to be loaded.
     * @param callback on load callback.
     * @param onerror on error callback.
     */
    static load(src: string, callback?: (e: Event) => void, onerror?: (e: Event) => void): Surface {
        let image = new Image()
        // TODO improve typescript standard libraries
        let surface = Object.create(Surface.prototype, {
            // @ts-ignore
            context: null,
            // @ts-ignore
            _css: `url(${src})`,
            // @ts-ignore
            _element: image,
        })

        callback = callback || function () { }
        onerror = onerror || function () { }
        surface.addEventListener('load', callback)
        surface.addEventListener('error', onerror)
        image.onerror = function () {
            let e = new Event(Event.ERROR)
            e.message = `Cannot load an assets: ${image.src}`
            Core.instance.dispatchEvent(e)
            surface.dispatchEvent(e)
        }

        image.onload = function () {
            surface.width = image.width
            surface.height = image.height
            surface.dispatchEvent(new Event(Event.LOAD))
        }

        image.src = src
        return surface
    }

    static _staticCanvas2DContext = document.createElement('canvas').getContext('2d')!

    static _getPattern(surface: Surface, force?: boolean) {
        if (!surface._pattern || force) {
            surface._pattern = Surface._staticCanvas2DContext!.createPattern(surface._element, 'repeat')!
        }

        return surface._pattern
    }
}