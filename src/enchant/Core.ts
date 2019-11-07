namespace enchant {
    export const STAGE_ID = 'enchant-stage';
    var core;
    export class Core extends enchant.EventTarget {
        static instance: Core;
        _calledTime: number;
        _mousedownID: number;
        _surfaceID: number;
        _soundID: number;
        _pageX: number;
        _pageY: number;
        _element: HTMLElement;

        /**
         * The width of the core screen.
         */
        _width: number;

        get width(): number {
            return this._width;
        }

        set width(w: number) {
            this._width = w;
            this._dispatchCoreResizeEvent();
        }

        /**
         * The height of the core screen.
         */
        _height: number;

        get height(): number {
            return this._height;
        }

        set height(h: number) {
            this._height = h;
            this._dispatchCoreResizeEvent();
        }

        /**
         * The scaling of the core rendering.
         */
        _scale: number;

        get scale(): number {
            return this._scale;
        }

        set scale(s: number) {
            this._scale = s;
            this._dispatchCoreResizeEvent();
        }

        /**
         * The frame rate of the core.
         */
        fps: number;

        /**
         * The number of frames processed since the core was started.
         */
        frame: number;

        /**
         * Indicates whether or not the core can be executed.
         */
        ready: boolean;

        /**
         * Indicates whether or not the core is currently running.
         */
        running: boolean;

        /**
         * Object which stores loaded assets using their paths as keys.
         */
        assets: object;

        _assets: [];
        _scenes: [];

        constructor({ width = 320, height = 320 }) {
            super();

            if (window.document.body === null) {
                // @TODO postpone initialization after `window.onload`
                throw new Error('document.body is null. Please excute `new Core()` in window.onload.');
            }

            enchant.EventTarget.call(this);
            let initial = true;
            if (core) {
                initial = false;
                core = core as Core;
                core.stop();
            }

            core = enchant.Core.instance = this;

            this._calledTime = 0;
            this._mousedownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;

            this._scenes = [];

            width = width || 320;
            height = height || 320;

            let stage = document.getElementById(enchant.STAGE_ID);

            // @TODO compute scale for every frame for dynamic resizing.
            let scale: number, sWidth: number, sHeight: number;
            if (!stage) {
                stage = document.createElement('div');
                stage.id = enchant.STAGE_ID;
                stage.style.position = 'absolute';

                if (document.body.firstChild) {
                    document.body.insertBefore(stage, document.body.firstChild);
                } else {
                    document.body.appendChild(stage);
                }

                scale = Math.min(
                    window.innerWidth / width,
                    window.innerHeight / height,
                );

                this._pageX = stage.getBoundingClientRect().left;
                this._pageY = stage.getBoundingClientRect().top;
            } else {
                let style = window.getComputedStyle(stage);
                sWidth = parseInt(style.width, 10);
                sHeight = parseInt(style.height, 10);
                if (sWidth && sHeight) {
                    scale = Math.min(
                        sWidth / width,
                        sHeight / height,
                    );
                } else {
                    scale = 1;
                }

                while (stage.firstChild) {
                    stage.removeChild(stage.firstChild);
                }

                stage.style.position = 'relative';

                let bounding = stage.getBoundingClientRect();
                this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
                this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);
            }

            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
            this._element = stage;

            this.addEventListener('coreresize', this._oncoreresize);

            this._width = width;
            this._height = height;
            this.scale = scale;

            this.fps = 30;
            this.frame = 0;
            this.ready = false;
            this.running = false;
            this.assets = {}
            let assets = this._assets = [];

            // @TODO refactor
            (function detectAssets(module: object) {
                // check whether the `module` has `assets` property.
                // if true then `preload` them.
                if (module['assets']) {
                    enchant.Core.instance.preload(module['assets']);
                }

                for (var prop in module) {
                    if (module.hasOwnProperty(prop)) {
                        if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                            detectAssets(module[prop]);
                        }
                    }
                }
            }(enchant))
        }


        _dispatchCoreResizeEvent() {
            let e = new enchant.OnResizeEvent('coreresize');
            e.width = this._width;
            e.height = this._height;
            e.scale = this._scale;
            this.dispactEvent(e);
        }

        _oncoreresize(e: enchant.Event) {
            // @TODO Test the resize function as the original library did not resize at all.
            this._element.style.width = Math.floor(this._width * this._scale) + 'px';
            this._element.style.height = Math.floor(this._height * this._scale) + 'px';

            // notify all the scenes of the resize event
            let scene;
            for (let i = 0, l = this._scenes.length; i < l; i++) {
                scene = this._scenes[i];
                scene.dispatchEvent(e);
            }
        }

        /**
         * File preloader.
         * 
         * Loads the files specified in the parameters when
         * `enchant.Core.start` is called.
         * When all files are loaded, a `enchant.Event.LOAD`
         * event is dispatched from the Core object. Depending
         * on the type of each file, different objects will be
         * created and stored in `enchant.Core.assets` variable.
         * 
         * When an image file is loaded, a `enchant.Surface` is
         * created. If a sound file is loaded, an `enchant.Sound` 
         * object is created. Any other file type will be accessible
         * as a string.
         * 
         * In addition, because this `Surface` object is created with
         * `enchant.Surface.load`, it is not possible to manipulate
         * the image directly.
         * 
         * @param assets Path of images to be preloaded.
         */
        preload(assets: string | string[] | Array<string>) {
            if (!(assets instanceof Array)) {
                assets = Array.prototype.slice.call(arguments)
            }
            Array.prototype.push.apply(this._assets, assets);
            return this;
        }
    }
}