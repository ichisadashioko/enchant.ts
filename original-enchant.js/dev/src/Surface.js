/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Surface
     * @class
     * Class that wraps canvas elements.
     *
     * Can be used to set the {@link enchant.Sprite} and {@link enchant.Map}'s image properties to be displayed.
     * If you wish to access Canvas API use the {@link enchant.Surface#context} property.
     *
     * @example
     * // Creates Sprite that displays a circle.
     * var ball = new Sprite(50, 50);
     * var surface = new Surface(50, 50);
     * surface.context.beginPath();
     * surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     * surface.context.fill();
     * ball.image = surface;
     *
     * @param {Number} width Surface width.
     * @param {Number} height Surface height.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var core = enchant.Core.instance;

        /**
         * Surface width.
         * @type Number
         */
        this.width = Math.ceil(width);
        /**
         * Surface height.
         * @type Number
         */
        this.height = Math.ceil(height);
        /**
         * Surface drawing context.
         * @type CanvasRenderingContext2D
         */
        this.context = null;

        var id = 'enchant-surface' + core._surfaceID++;
        if (document.getCSSCanvasContext) {
            this.context = document.getCSSCanvasContext('2d', id, width, height);
            this._element = this.context.canvas;
            this._css = '-webkit-canvas(' + id + ')';
            var context = this.context;
        } else if (document.mozSetImageElement) {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._css = '-moz-element(#' + id + ')';
            this.context = this._element.getContext('2d');
            document.mozSetImageElement(id, this._element);
        } else {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';
            this.context = this._element.getContext('2d');

            enchant.ENV.CANVAS_DRAWING_METHODS.forEach(function(name) {
                var method = this.context[name];
                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                };
            }, this);
        }
    },
    /**
     * Returns 1 pixel from the Surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @return {Number[]} An array that holds pixel information in [r, g, b, a] format.
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     * Sets one pixel within the surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @param {Number} r The pixel's red level.
     * @param {Number} g The pixel's green level.
     * @param {Number} b The pixel's blue level.
     * @param {Number} a The pixel's transparency.
     */
    setPixel: function(x, y, r, g, b, a) {
        var pixel = this.context.createImageData(1, 1);
        pixel.data[0] = r;
        pixel.data[1] = g;
        pixel.data[2] = b;
        pixel.data[3] = a;
        this.context.putImageData(pixel, x, y);
    },
    /**
     * Clears all Surface pixels and makes the pixels transparent.
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
     * Draws the content of the given Surface onto this surface.
     *
     * Wraps Canvas API drawImage and if multiple arguments are given,
     * these are getting applied to the Canvas drawImage method.
     *
     * @example
     * var src = core.assets['src.gif'];
     * var dst = new Surface(100, 100);
     * dst.draw(src);         // Draws source at (0, 0)
     * dst.draw(src, 50, 50); // Draws source at (50, 50)
     * // Draws just 30 horizontal and vertical pixels of source at (50, 50)
     * dst.draw(src, 50, 50, 30, 30);
     * // Takes the image content in src starting at (10,10) with a (Width, Height) of (40,40),
     * // scales it and draws it in this surface at (50, 50) with a (Width, Height) of (30,30).
     * dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image Surface used in drawing.
     */
    draw: function(image) {
        image = image._element;
        if (arguments.length === 1) {
            this.context.drawImage(image, 0, 0);
        } else {
            var args = arguments;
            args[0] = image;
            this.context.drawImage.apply(this.context, args);
        }
    },
    /**
     [lang:ja]
     * Surfaceを複製する.
     * @return {enchant.Surface} 複製されたSurface.
     [/lang]
     [lang:en]
     * Copies Surface.
     * @return {enchant.Surface} The copied Surface.
     [/lang]
     [lang:de]
     * Kopiert diese Surface.
     * @return {enchant.Surface} Die kopierte Surface.
     [/lang]
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    },
    /**
     * Creates a data URI scheme from this Surface.
     * @return {String} The data URI scheme that identifies this Surface and
     * can be used to include this Surface into a dom tree.
     */
    toDataURL: function() {
        var src = this._element.src;
        if (src) {
            if (src.slice(0, 5) === 'data:') {
                return src;
            } else {
                return this.clone().toDataURL();
            }
        } else {
            return this._element.toDataURL();
        }
    }
});

/**
 * Loads an image and creates a Surface object out of it.
 *
 * It is not possible to access properties or methods of the {@link enchant.Surface#context}, or to call methods using the Canvas API -
 * like {@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.. -
 * of the wrapped image created with this method.
 * However, it is possible to use this surface to draw it to another surface using the {@link enchant.Surface#draw} method.
 * The resulting surface can then be manipulated. (when loading images in a cross-origin resource sharing environment,
 * pixel acquisition and other image manipulation might be limited).
 *
 * @param {String} src The file path of the image to be loaded.
 * @param {Function} callback on load callback.
 * @param {Function} [onerror] on error callback.
 * @static
 * @return {enchant.Surface} Surface
 */
enchant.Surface.load = function(src, callback, onerror) {
    var image = new Image();
    var surface = Object.create(enchant.Surface.prototype, {
        context: { value: null },
        _css: { value: 'url(' + src + ')' },
        _element: { value: image }
    });
    enchant.EventTarget.call(surface);
    onerror = onerror || function() {};
    surface.addEventListener('load', callback);
    surface.addEventListener('error', onerror);
    image.onerror = function() {
        var e = new enchant.Event(enchant.Event.ERROR);
        e.message = 'Cannot load an asset: ' + image.src;
        enchant.Core.instance.dispatchEvent(e);
        surface.dispatchEvent(e);
    };
    image.onload = function() {
        surface.width = image.width;
        surface.height = image.height;
        surface.dispatchEvent(new enchant.Event('load'));
    };
    image.src = src;
    return surface;
};
enchant.Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');

enchant.Surface._getPattern = function(surface, force) {
    if (!surface._pattern || force) {
        surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
    }
    return surface._pattern;
};
