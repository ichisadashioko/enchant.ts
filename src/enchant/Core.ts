import EventTarget from './EventTarget.ts'
import Deferred from './Deferred.ts'
import { getTime } from './header.ts'
import KeyboardInputManager from './KeyboardInputManager.ts'
import LoadingScene from './LoadingScene.ts'
import Scene from './Scene.ts'
import Event from './Event.ts'
import ENV from './Env.ts'
import Label from './Label.ts'
import Surface from './Surface.ts'
import Sound from './Sound.ts'
import WebAudioSound from './WebAudioSound.ts'
import DOMSound from './DOMSound.ts'

/**
 * A class for controlling the core's main loop and scenes.
 *
 * There can be only one instance at a time.
 * When the constructor is executed while an instance exists,
 * the existing instance will be overwritten.
 * The existing instance can be accessed from `enchant.Core.instance`.
 */
export default class Core extends EventTarget {

    static instance: Core

    _calledTime: number
    _mousedownID: number
    _surfaceID: number
    _soundID: number
    _pageX: number
    _pageY: number
    _element: HTMLElement
    _width: number
    _height: number
    _scale: number

    /**
     * The frame rate of the core.
     */
    fps: number

    /**
     * The number of frames processed since the core was started.
     */
    frame: number

    /**
     * Indicates whether or not the core can be executed.
     */
    ready: boolean

    /**
     * Indicates whether or not the core is currently running.
     */
    running: boolean

    /**
     * Object which stores loaded assets using their paths as keys.
     */
    assets: Record<string, Surface | DOMSound | WebAudioSound | string>

    _assets: []
    _scenes: Scene[]

    /**
     * The `Scene` which is currently displayed. This `Scene` is on top of the `Scene` stack.
     */
    currentScene!: Scene

    /**
     * The root Scene. The Scene at the bottom of the Scene stack.
     */
    rootScene: Scene

    /**
     * The Scene to be displayed during loading.
     */
    loadingScene: LoadingScene

    /**
     * Indicates whether or not `echant.Core.start` has been called.
     */
    _activated: boolean

    /**
     * Object that saves the current input state for the core.
     *
     * TODO rename to more meaningful name
     */
    input: Record<string, boolean>

    keyboardInputManager: KeyboardInputManager
    _keybind: Record<string, string>

    /**
     * intialized in {@link Core#start}
     */
    currentTime!: number
    _actualFps?: number

    _debug?: boolean

    _touchEventTarget!: Record<number, EventTarget>

    /**
     * called by EventTarget listeners
     */
    onload?: Function

    constructor(width?: number, height?: number) {

        if (window.document.body == null) {
            // TODO postpone initialization after `window.onload`
            throw new Error('document.body is null. Please excute `new Core()` in window.onload.')
        }

        super()

        let initial = true
        if (Core.instance) {
            initial = false
            Core.instance.stop()
        }

        Core.instance = this

        this._calledTime = 0
        this._mousedownID = 0
        this._surfaceID = 0
        this._soundID = 0

        this._scenes = []

        width = width || 320
        height = height || 320

        const stageId = 'enchant-stage'

        let stage = document.getElementById(stageId)

        // TODO compute scale for every frame for dynamic resizing.
        let scale: number, sWidth: number, sHeight: number
        if (!stage) {
            stage = document.createElement('div')
            stage.id = stageId
            stage.style.position = 'absolute'

            if (document.body.firstChild) {
                document.body.insertBefore(stage, document.body.firstChild)
            } else {
                document.body.appendChild(stage)
            }

            scale = Math.min(
                window.innerWidth / width,
                window.innerHeight / height,
            )

            this._pageX = stage.getBoundingClientRect().left
            this._pageY = stage.getBoundingClientRect().top
        } else {
            let style = window.getComputedStyle(stage)
            sWidth = parseInt(style.width, 10)
            sHeight = parseInt(style.height, 10)
            if (sWidth && sHeight) {
                scale = Math.min(
                    sWidth / width,
                    sHeight / height,
                )
            } else {
                scale = 1
            }

            while (stage.firstChild) {
                stage.removeChild(stage.firstChild)
            }

            stage.style.position = 'relative'

            let bounding = stage.getBoundingClientRect()
            this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left)
            this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top)
        }

        stage.style.fontSize = '12px'
        stage.style.webkitTextSizeAdjust = 'none'
        stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)'
        this._element = stage

        this.addEventListener('coreresize', this._oncoreresize)

        // TODO set dirty and call compute something
        this._width = width
        this._height = height
        this._scale = scale

        this.fps = 30
        this.frame = 0
        this.ready = false
        this.running = false
        this.assets = {}
        this._assets = []

        // TODO load plugins' assets

        this.rootScene = new Scene()
        this.pushScene(this.rootScene)
        this.loadingScene = new LoadingScene()
        this._activated = false

        this._offsetX = 0
        this._offsetY = 0

        this.input = {}

        this.keyboardInputManager = new KeyboardInputManager(window.document.body, this.input)
        this.keyboardInputManager.addBroadcastTarget(this)
        this._keybind = this.keyboardInputManager._binds

        for (let prop in ENV.KEY_BIND_TABLE) {
            const keycode = Number.parseInt(prop)
            this.keybind(keycode, ENV.KEY_BIND_TABLE[keycode])
        }

        if (initial) {
            stage = Core.instance._element

            document.addEventListener('keydown', function (ev) {
                Core.instance.dispatchEvent(new Event('keydown'))
                if (ENV.PREVENT_DEFAULT_KEY_CODES.indexOf(ev.keyCode) !== -1) {
                    ev.preventDefault()
                    ev.stopPropagation()
                }
            }, true)

            if (ENV.TOUCH_ENABLED) {
                stage.addEventListener('touchstart', function (ev) {
                    let target = ev.target as HTMLElement
                    if (!target.tagName) { return }
                    let tagName = (target.tagName).toLowerCase()
                    if (ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        ev.preventDefault()
                        if (!Core.instance.running) {
                            ev.stopPropagation()
                        }
                    }
                })

                stage.addEventListener('touchmove', function (ev) {
                    let target = ev.target as HTMLElement
                    if (!target.tagName) { return }
                    let tagName = (target.tagName).toLowerCase()
                    if (ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        ev.preventDefault()
                        if (!Core.instance.running) {
                            ev.stopPropagation()
                        }
                    }
                })

                stage.addEventListener('touchend', function (ev) {
                    let target = ev.target as HTMLElement
                    if (!target.tagName) { return }
                    let tagName = (target.tagName).toLowerCase()
                    if (ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        ev.preventDefault()
                        if (!Core.instance.running) {
                            ev.stopPropagation()
                        }
                    }
                })
            }

            stage.addEventListener('mousedown', function (ev) {
                let target = ev.target as HTMLElement
                if (!target.tagName) { return }
                let tagName = (target.tagName).toLowerCase()
                if (ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                    ev.preventDefault()
                    Core.instance._mousedownID++
                    if (!Core.instance.running) {
                        ev.stopPropagation()
                    }
                }
            }, true)

            stage.addEventListener('mousemove', function (ev) {
                let target = ev.target as HTMLElement
                if (!target.tagName) { return }
                let tagName = (target.tagName).toLowerCase()
                if (ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                    ev.preventDefault()
                    if (!Core.instance.running) {
                        ev.stopPropagation()
                    }
                }
            }, true)

            stage.addEventListener('mouseup', function (ev) {
                let target = ev.target as HTMLElement
                if (!target.tagName) { return }
                let tagName = (target.tagName).toLowerCase()
                if (ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                    ev.preventDefault()
                    if (!Core.instance.running) {
                        ev.stopPropagation()
                    }
                }
            }, true)

            Core.instance._touchEventTarget = {}

            if (ENV.TOUCH_ENABLED) {
                stage.addEventListener('touchstart', function (ev) {
                    let evt = new Event(Event.TOUCH_START)
                    let touches = ev.changedTouches

                    let touch: Touch
                    let target

                    for (let i = 0, l = touches.length; i < l; i++) {
                        touch = touches[i]
                        evt._initPosition(touch.pageX, touch.pageY)
                        target = Core.instance.currentScene._determineEventTarget(evt)
                        Core.instance._touchEventTarget[touch.identifier] = target
                        target.dispatchEvent(evt)
                    }
                })
            }
        }
    }

    /**
     * The width of the core screen.
     */
    get width() {
        return this._width
    }

    set width(w: number) {
        this._width = w
        this._dispatchCoreResizeEvent()
    }

    /**
     * The height of the core screen.
     */
    get height() {
        return this._height
    }

    set height(h: number) {
        this._height = h
        this._dispatchCoreResizeEvent()
    }

    /**
     * The scaling of the core rendering.
     */
    get scale() {
        return this._scale
    }

    set scale(s: number) {
        this._scale = s
        this._dispatchCoreResizeEvent()
    }

    get actualFps() {
        return this._actualFps || this.fps
    }

    _dispatchCoreResizeEvent() {
        let e = new Event(Event.CORE_RESIZE)
        e.core = this

        this.dispatchEvent(e)
    }

    _oncoreresize(e: Event) {
        // TODO Test the resize function as the original library did not resize at all.
        this._element.style.width = Math.floor(this._width * this._scale) + 'px'
        this._element.style.height = Math.floor(this._height * this._scale) + 'px'

        // notify all the scenes of the resize event
        let scene
        for (let i = 0, l = this._scenes.length; i < l; i++) {
            scene = this._scenes[i]
            scene.dispatchEvent(e)
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
    preload(assets: string | string[]) {
        if (!(assets instanceof Array)) {
            assets = Array.prototype.slice.call(arguments)
        }
        Array.prototype.push.apply(this._assets, assets)
        return this
    }

    /**
     * Loads a file.
     * @param src File path of the resource to be loaded.
     * @param alias Name you want to designate for the resource to be loaded.
     * @param callback Function to be called if the resource to be loaded.
     * @param onerror Function to be called if the file fails to load.
     */
    load(src: string, alias?: string, callback?: Function, onerror?: Function) {
        let assetName = (typeof alias === 'string') ? alias : src

        let ext = Core.findExt(src)

        return Deferred.next(function () {
            let d = new Deferred()

            let _callback = function (e: Event) {
                d.call(e)

                if (callback) {
                    callback(e)
                }
            }

            let _onerror = function (e: Event) {
                d.fail(e)

                if (onerror) {
                    onerror(e)
                }
            }

            if (ext && Core._loadFuncs[ext]) {
                Core.instance.assets[assetName] = Core._loadFuncs[ext](src, ext, _callback, _onerror)
            } else {
                let xhr = new XMLHttpRequest()
                xhr.open('GET', src, true)
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200 && xhr.status !== 0) {
                            // throw new Error(`${xhr.status}: Cannot load an asset: ${src}`)
                            let e = new Event(Event.ERROR)
                            e.message = `${xhr.status}: Cannot load an asset: ${src}`
                            _onerror.call(Core.instance, e)
                        }

                        let type = xhr.getResponseHeader('Content-Type') || ''
                        if (type.match(/^image/)) {
                            Core.instance.assets[assetName] = Surface.load(src, _callback, _onerror)
                        } else if (type.match(/^audio/)) {
                            Core.instance.assets[assetName] = Sound.load(src, type, _callback, _onerror)
                        } else {
                            Core.instance.assets[assetName] = xhr.responseText
                            _callback.call(Core.instance, new Event(Event.LOAD))
                        }
                    }
                }

                xhr.send()
            }

            return d
        })
    }

    /**
     * Start the core.
     *
     * Sets the framerate of the {@link Core.currentScene} according to
     * the value stored in {@link Core.core.fps}. If there are images to
     * preload, loading will begin and the loading screen will be
     * displayed.
     */
    start(deferred?: Deferred) {
        let that = this

        let onloadTimeSetter = function () {
            that.frame = 0
            that.removeEventListener(Event.LOAD, onloadTimeSetter)
        }

        this.addEventListener(Event.LOAD, onloadTimeSetter)

        this.currentTime = getTime()
        this.running = true
        this.ready = true

        if (!this._activated) {
            this._activated = true
            if (ENV.BROWSER === 'mobilesafari' && ENV.USE_WEBAUDIO && ENV.USE_TOUCH_TO_START_SCENE) {
                // enable iPhone devices to debug this code
                let d = new Deferred()
                let scene = this._createTouchToStartScene()

                let core = Core.instance
                let that = this

                scene.addEventListener(Event.TOUCH_START, function waitTouch() {
                    that.removeEventListener(Event.TOUCH_START, waitTouch)
                    let a = new WebAudioSound()
                    a.buffer = WebAudioSound.audioContext.createBuffer(1, 1, 48000)
                    a.play()
                    core.removeScene(scene)
                    core.start(d)
                } /**,false */) // TODO this is not Web API addEventListener so the last argument may not be processed.

                core.pushScene(scene)
                return d
            }
        }

        this._requestNextFrame(0)

        let ret = this._requestPreload().next(function () {
            Core.instance.loadingScene.dispatchEvent(new Event(Event.LOAD))
        })

        if (deferred) {
            ret.next(function (args: any) {
                deferred.call(args)
            }).error(function (args: any) {
                deferred.fail(args)
            })
        }

        return ret
    }

    _requestPreload() {
        let o: Record<string, Deferred> = {}
        let loaded = 0
        let len = 0
        function loadFunc() {
            let e = new Event(Event.PROGRESS)
            e.loaded = ++loaded
            e.total = len
            Core.instance.loadingScene.dispatchEvent(e)
        }

        let that = this

        this._assets.reverse().forEach(function (asset: string | string[]) {
            let src: string
            let name: string

            if (asset instanceof Array) {
                src = asset[0]
                name = asset[1]
            } else {
                src = name = asset
            }

            if (!o[name]) {
                o[name] = that.load(src, name, loadFunc)
                len++
            }
        })

        this.pushScene(this.loadingScene)
        return Deferred.parallel(o)
    }

    _createTouchToStartScene() {
        let label = new Label('Touch to Start')
        let size = Math.round(this.width / 10)
        let scene = new Scene()

        label.color = '#fff'
        label.font = (size - 1) + 'px bold Helvetica,Arial,sans-serif'
        label.textAlign = 'center'
        label.width = this.width
        label.height = label._boundHeight
        label.y = (this.height - label.height) / 2

        scene.backgroundColor = '#000'
        scene.addChild(label)

        return scene
    }

    /**
     * Start application in debug mode.
     *
     * Core debug mode can be turned on even if the
     * {@link enchant.Core._debug} flag is already set to true.
     */
    debug() {
        this._debug = true
        return this.start()
    }

    /**
     * Request the next frame.
     * @param delay Amount of time to delay before calling `requestAnimationFrame`.
     */
    _requestNextFrame(delay: number) {
        if (!this.ready) {
            return
        }
        if (this.fps >= 60 || delay <= 16) {
            this._calledTime = getTime()
            window.requestAnimationFrame(this._callTick)
        } else {
            setTimeout(function () {
                let core = Core.instance
                core._calledTime = getTime()
                window.requestAnimationFrame(core._callTick)
            }, Math.max(0, delay))
        }
    }

    _callTick() {
        Core.instance._tick()
    }

    _tick() {
        let now = getTime()
        let elapsed = now - this.currentTime
        this.currentTime = now
        let e = new Event(Event.ENTER_FRAME)
        e.elapsed = elapsed

        this._actualFps = elapsed > 0 ? (1000 / elapsed) : 0

        let nodes = this.currentScene.childNodes.slice()
        while (nodes.length) {
            let node = nodes.pop()!

            node.age++
            node.dispatchEvent(e)
            if (node.childNodes) {
                nodes.push(...node.childNodes)
            }
        }

        this.currentScene.age++
        this.currentScene.dispatchEvent(e)
        this.dispatchEvent(e)

        this.dispatchEvent(new Event(Event.EXIT_FRAME))
        this.frame++
        now = getTime()

        this._requestNextFrame(1000 / this.fps - (now - this._calledTime))
    }

    /**
     * Stops the core.
     *
     * The frame will not be updated, and player input will not be accepted anymore.
     * Core can be restarted using {@link enchant.Core.resume}
     */
    stop() {
        this.ready = false
        this.running = false
    }

    /**
     * Stops the core.
     *
     * The frame will not be updated, add player input will not be accepted anymore.
     * Core can be started again using `enchant.Core.resume`.
     */
    pause() {
        this.ready = false
    }

    resume() {
        if (this.ready) {
            return
        }
        this.currentTime = getTime()
        this.ready = true
        this.running = true
        this._requestNextFrame(0)
    }

    /**
     * Switches to a new Scene.
     *
     * Scenes are controlled using a stack,
     * with the top scene on the stack being the one displayed.
     *
     * When `enchant.Core.pushScene` is executed,
     * the Scene is placed on top of the stack.
     * Frames will be only updated for the Scene which is on the top of the stack.
     *
     * @param scene The new scene to display.
     */
    pushScene(scene: Scene) {
        this._element.appendChild(scene._element)

        if (this.currentScene) {
            this.currentScene.dispatchEvent(new Event(Event.EXIT))
        }

        this.currentScene = scene
        this.currentScene.dispatchEvent(new Event(Event.ENTER))
        return this._scenes.push(scene)
    }

    /**
     * Ends the current Scene and returns to the previous Scene.
     *
     * Scenes are controlled using a stack, with the top scene on the stack being the one displayed.
     * When `enchant.Core.popScene` is executed, the Scene at the top of the stack is removed and returned.
     *
     * @return Removed Scene.
     */
    popScene() {
        if (this.currentScene === this.rootScene) {
            return this.currentScene
        }

        this._element.removeChild(this.currentScene._element)
        this.currentScene.dispatchEvent(new Event(Event.EXIT))
        this.currentScene = this._scenes[this._scenes.length - 2]
        this.currentScene.dispatchEvent(new Event(Event.ENTER))
        return this._scenes.pop()
    }

    /**
     * Overwrite the current Scene with a new Scene.
     *
     * Execute `enchant.Core.popScene` and `enchant.Core.pushScene` one
     * after another to replace the current scene with the new scene.
     *
     * @param scene The new scene with which to replace the current scene.
     */
    replaceScene(scene: Scene) {
        this.popScene()
        return this.pushScene(scene)
    }

    /**
     * Remove a Scene from the Scene stack.
     *
     * If the scene passed in as a parameter is not the current scene,
     * the stack will be searched for the given scene. If the given
     * scene does not exist anywhere in the stack, this method returns null.
     *
     * @param scene Scene to be removed.
     * @returns The deleted Scene.
     */
    removeScene(scene: Scene) {
        if (this.currentScene === scene) {
            return this.popScene()
        } else {
            let i = this._scenes.indexOf(scene)
            if (i !== -1) {
                this._scenes.splice(i, 1)
                this._element.removeChild(scene._element)
                return scene
            } else {
                return null
            }
        }
    }

    _buttonListener(e: Event) {
        this.currentScene.dispatchEvent(e)
    }

    /**
     * Bind a key to an enchant.js button.
     *
     * Binds the given key code to the given enchant.js button
     * ('left', 'right', 'up', 'down', 'a', 'b').
     *
     * @param key Key code for the button to be bound.
     * @param button An enchant.js button.
     */
    keybind(key: number, button: 'left' | 'right' | 'up' | 'down' | 'a' | 'b') {
        this.keyboardInputManager.keybind(key, button)
        this.addEventListener(button + 'buttondown', this._buttonListener)
        this.addEventListener(button + 'buttonup', this._buttonListener)
        return this
    }

    /**
     * Delete the key binding for the given key.
     *
     * @param key Key code whose binding is to be deleted.
     */
    keyunbind(key: number) {
        let button = this._keybind[key]
        this.keyboardInputManager.keyunbind(key)
        this.removeEventListener(button + 'buttondown', this._buttonListener)
        this.removeEventListener(button + 'buttonup', this._buttonListener)
        return this
    }

    changeButtonState(button: 'left' | 'right' | 'up' | 'down' | 'a' | 'b', bool: boolean) {
        this.keyboardInputManager.changeState(button, bool)
    }

    /**
     * Get the core time (not actual) elapsed since {@link enchant.Core.start} was called.
     *
     * @returns Time elapsed (in seconds).
     */
    getElapsedTime() {
        return this.frame / this.fps
    }

    static _loadImage(src: string, ext: string, callback?: (e: Event) => void, onerror?: (e: Event) => void) {
        return Surface.load(src, callback, onerror)
    }

    static _loadSound(src: string, ext: string, callback?: (e: Event) => void, onerror?: (e: Event) => void) {
        return Sound.load(src, 'audio/' + ext, callback, onerror)
    }

    static _loadFuncs: Record<string, Function> = {
        // image
        'jpg': Core._loadImage,
        'jpeg': Core._loadImage,
        'gif': Core._loadImage,
        'png': Core._loadImage,
        'bmp': Core._loadImage,
        // sound
        'mp3': Core._loadSound,
        'aac': Core._loadSound,
        'm4a': Core._loadSound,
        'wav': Core._loadSound,
        'ogg': Core._loadSound,
    }

    /**
     * Get the file extension from a path.
     * @param path file path.
     */
    static findExt(path: string) {
        let matched = path.match(/\.\w+$/)
        if (matched && matched.length > 0) {
            return matched[0].slice(1).toLowerCase()
        }

        // for data URI
        if (path.indexOf('data:') === 0) {
            return path.split(/[\/]/)[1].toLowerCase()
        }

        return null
    }
}
