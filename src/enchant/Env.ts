export type ControlKeyType = 'left' | 'right' | 'up' | 'down'

const KEY_BIND_TABLE: Record<number, ControlKeyType> = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
}

/**
 * `enchant` environment variables.
 * 
 * Execution settings can be changed by modifying these before calling new Core().
 */
export default {
    /**
     * Identifier of the current browser.
     */
    BROWSER: (function (ua) {
        if (/Eagle/.test(ua)) {
            return 'eagle'
        } else if (/Opera/.test(ua)) {
            return 'opera'
        } else if (/MSIE|Trident/.test(ua)) {
            return 'ie'
        } else if (/Chrome/.test(ua)) {
            return 'chrome'
        } else if (/(?:Macintosh|Windows).*AppleWebKit/.test(ua)) {
            return 'safari'
        } else if (/(?:iPhone|iPad|iPod).*AppleWebKit/.test(ua)) {
            return 'mobilesafari'
        } else if (/Firefox/.test(ua)) {
            return 'firefox'
        } else if (/Android/.test(ua)) {
            return 'android'
        } else {
            return ''
        }
    }(navigator.userAgent)),

    VENDOR_PREFIX: (function () {
        let ua = navigator.userAgent
        if (ua.indexOf('Opera') !== -1) {
            return 'O'
        } else if (/MSIE|Trident/.test(ua)) {
            return 'ms'
        } else if (ua.indexOf('WebKit') !== -1) {
            return 'webkit'
        } else if (navigator.product === 'Gecko') {
            return 'Moz'
        } else {
            return ''
        }
    }()),

    /**
     * Determines if the current browser supports touch.
     */
    TOUCH_ENABLED: (function () {
        var div = document.createElement('div')
        div.setAttribute('ontouchstart', 'return')
        return typeof div.ontouchstart === 'function'
    }()),

    /**
     * Determines if the current browser is an iPhone with a retina display.
     * True, if this display is a retina display.
     */
    RETINA_DISPLAY: (function () {
        if (navigator.userAgent.indexOf('iPhone') !== -1 && window.devicePixelRatio === 2) {
            var viewport = document.querySelector('meta[name="viewport"]')
            if (viewport == null) {
                viewport = document.createElement('meta')
                document.head.appendChild(viewport)
            }
            viewport.setAttribute('content', 'width=640')
            return true
        } else {
            return false
        }
    }()),

    /**
     * Determines if for current browser Flash should be used to play 
     * sound instead of the native audio class.
     * True, if flash should be used.
     */
    USE_FLASH_SOUND: (function () {
        var ua = navigator.userAgent
        var vendor = navigator.vendor || ""
        // non-local access, not on mobile mobile device, not on safari
        return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1)
    }()),

    /**
     * If click/touch event occure for these tags the setPreventDefault() method will not be called.
     */
    USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],

    /**
     * Method names of CanvasRenderingContext2D that will be defined as Surface method.
     */
    CANVAS_DRAWING_METHODS: [
        'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
        'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
    ],

    /**
     * Keybind Table.
     * You can use 'left', 'up', 'right', 'down' for preset event.
     * @example
     * enchant.ENV.KEY_BIND_TABLE = {
     *     37: 'left',
     *     38: 'up',
     *     39: 'right',
     *     40: 'down',
     *     32: 'a', //-> use 'space' key as 'a button'
     * }
     */
    KEY_BIND_TABLE: KEY_BIND_TABLE,

    /**
     * If keydown event occure for these keycodes the setPreventDefault() method will be called.
     */
    PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40],

    /**
     * Determines if Sound is enabled on Mobile Safari.
     */
    SOUND_ENABLED_ON_MOBILE_SAFARI: true,

    /**
     * Determines if "touch to start" scene is enabled.
     * It is necessary on Mobile Safari because WebAudio Sound is
     * muted by browser until play any sound in touch event handler.
     * If set it to false, you should control this behavior manually.
     */
    USE_TOUCH_TO_START_SCENE: true,

    /**
     * Determines if WebAudioAPI is enabled. (true: use WebAudioAPI instead of Audio element if possible)
     */
    USE_WEBAUDIO: (function () {
        return location.protocol !== 'file:'
    }()),

    /**
     * Determines if animation feature is enabled. (true: Timeline instance will be generated in new Node)
     */
    USE_ANIMATION: true,

    /**
     * Specifies range of the touch detection.
     * The detection area will be (COLOR_DETECTION_LEVEL * 2 + 1)px square.
     */
    COLOR_DETECTION_LEVEL: 2,
}
