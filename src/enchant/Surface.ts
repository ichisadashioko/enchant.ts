import EventTarget from './EventTarget'
import CanvasSurface from './CanvasSurface'
import ImageSurface from './ImageSurface'
import Core from './Core'
import EventType from './EventType'
import Event from './Event'

/**
 * Class that wraps canvas elements.
 * 
 * Can be used to set the `enchant.Sprite` and `enchant.Map` image properties to be displayed.
 * If you wish to access Canvas API use the `enchant.Surface.context` property.
 * 
 * @example
 * // Creates Sprite that displays a circle.
 * var ball = new Sprite(50, 50);
 * var surface = new Surface(50, 50);
 * surface.context.beginPath();
 * surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
 * surface.context.fill();
 * ball.image = surface;
 */
export default abstract class Surface extends EventTarget {

    /**
     * Surface width.
     */
    width: number;

    /**
     * Surface height.
     */
    height: number;

    _element: HTMLCanvasElement | HTMLImageElement;
    _pattern?: CanvasPattern;

    /**
     * The copied Surface.
     */
    clone() {
        let clone = new CanvasSurface(this.width, this.height);
        clone.draw(this);
        return clone;
    }

    /**
     * Creates a data URI scheme from this Surface.
     * @return The data URI schema that identifies this Surface 
     * and can be used to include this Surface into a DOM tree.
     */
    abstract toDataURL(): string;

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
    static load(src: string, callback: Function, onerror?: Function): ImageSurface {
        let image = new Image();
        let surface = new ImageSurface(image, `url(${src})`);

        onerror = onerror || function () { };
        surface.addEventListener('load', callback);
        surface.addEventListener('error', onerror);
        image.onerror = function () {
            let e = new Event(EventType.ERROR);
            e.message = `Cannot load an assets: ${image.src}`;
            Core.instance.dispatchEvent(e);
            surface.dispatchEvent(e);
        };
        image.onload = function () {
            surface.width = image.width;
            surface.height = image.height;
            surface.dispatchEvent(new Event(EventType.LOAD));
        };
        image.src = src;
        return surface;
    }

    static _staticCanvas2DContext = document.createElement('canvas').getContext('2d');

    static _getPattern(surface: Surface, force: boolean) {
        if (!surface._pattern || force) {
            surface._pattern = CanvasSurface._staticCanvas2DContext.createPattern(surface._element, 'repeat');
        }
        return surface._pattern;
    }
}