# enchant.ts

This project aims to port the game library [enchant.js](https://github.com/wise9/enchant.js) to TypeScript.

## Checklist

- [ ] `header.js`
  - [ ] `Object.defineProperty`
  - [ ] `Object.defineProperties`
  - [ ] `Object.create`
  - [ ] `Object.getPrototypeOf`
  - [ ] `Function.prototype.bind`
  - [x] `getTime`
  - [ ] `window.requestAnimationFrame`
  - [ ] `enchant`
  - [ ] `window.addEventListener('message')`
- [ ] `Class.js`
  - [ ] `Class`
  - [ ] `create`
  - [ ] `getInheritanceTree`
- [ ] `Env.js`
  - [ ] `ENV`
    - [ ] `VERSION`
    - [ ] `BROWSER`
    - [ ] `VENDOR_PREFIX`
    - [ ] `TOUCH_ENABLED`
    - [ ] `RETINA_DISPLAY`
    - [ ] `USE_FLASH_SOUND`
    - [ ] `USE_DEFAULT_EVENT_TAGS`
    - [ ] `CANVAS_DRAWING_METHODS`
    - [ ] `KEY_BIND_TABLE`
    - [ ] `PREVENT_DEFAULT_KEY_CODES`
    - [ ] `SOUND_ENABLED_ON_MOBILE_SAFARI`
    - [ ] `USE_TOUCH_TO_START_SCENE`
    - [ ] `USE_WEB_AUDIO`
    - [ ] `USE_ANIMATION`
    - [ ] `COLOR_DETECTION_LEVEL`
- [ ] `Event.js`
  - [x] `initialize`
  - [x] `_initPosition`
  - [x] `LOAD`
  - [x] `ERROR`
  - [x] `CORE_RESIZE`
  - [x] `PROGRESS`
  - [x] `ENTER_FRAME`
  - [x] `EXIT_FRAME`
  - [x] `ENTER`
  - [x] `EXIT`
  - [x] `CHILD_ADDED`
  - [x] `ADDED`
  - [x] `ADDED_TO_SCENE`
  - [x] `CHILD_REMOVE`
  - [x] `REMOVED`
  - [x] `REMOVED_FROM_SCENE`
  - [x] `TOUCH_START`
  - [x] `TOUCH_MOVE`
  - [x] `TOUCH_END`
  - [x] `RENDER`
  - [x] `INPUT_START`
  - [x] `INPUT_CHANGE`
  - [x] `INPUT_END`
  - [x] `INPUT_STATE_CHANGED`
  - [x] `LEFT_BUTTON_DOWN`
  - [x] `LEFT_BUTTON_UP`
  - [x] `RIGHT_BUTTON_DOWN`
  - [x] `RIGHT_BUTTON_UP`
  - [x] `UP_BUTTON_DOWN`
  - [x] `UP_BUTTON_UP`
  - [x] `DOWN_BUTTON_DOWN`
  - [x] `DOWN_BUTTON_UP`
  - [x] `A_BUTTON_DOWN`
  - [x] `A_BUTTON_UP`
  - [x] `B_BUTTON_DOWN`
  - [x] `B_BUTTON_UP`
  - [x] `ADDED_TO_TIMELINE`
  - [x] `REMOVED_FROM_TIMELINE`
  - [x] `ACTION_START`
  - [x] `ACTION_END`
  - [x] `ACTION_TICK`
  - [x] `ACTION_ADDED`
  - [x] `ACTION_REMOVED`
  - [x] `ANIMATION_END`
- [x] `EventTarget.js`
- [ ] `Core.js`
  - [ ] `initialize`
    - [ ] `detectAssets` from plugins
  - [x] `_dispatchCoreResizeEvent`
  - [x] `_oncoreresize`
  - [x] `preload`
  - [ ] `load`
  - [ ] `start`
  - [ ] `_requestPreload`
  - [ ] `_createTouchToStartScene`
  - [ ] `debug`
  - [ ] `_requestNextFrame`
  - [ ] `_callTick`
  - [ ] `_tick`
  - [x] `getTime`
  - [x] `stop`
  - [x] `pause`
  - [x] `resume`
  - [x] `pushScene`
  - [x] `popScene`
  - [ ] `replaceScene`
  - [ ] `removeScene`
  - [ ] `_buttonListener`
  - [ ] `keybind`
  - [ ] `keyunbind`
  - [ ] `changeButtonState`
  - [ ] `getElapsedTime`
  - [x] `findExt`
- [x] `Game.js`
- [x] `InputManager.js`
  - [x] `initialize`
  - [x] `bind`
  - [x] `unbind`
  - [x] `addBroadcastTarget`
  - [x] `removeBroadcastTarget`
  - [x] `broadcastEvent`
  - [x] `changeState`
- [x] `InputSource.js`
- [x] `BinaryInputManager.js`
  - [x] `bind`
  - [x] `unbind`
  - [x] `changeState`
  - [x] `_down`
  - [x] `_up`
- [x] `BinaryInputSource.js`
- [ ] `KeyboardInputManager.js`
- [x] `KeyboardInputSource.js`
  - [x] `initialize`
  - [x] `getByKeyCode`
- [x] `Node.js`
- [ ] `Entity.js`
- [ ] `Sprite.js`
- [ ] `Label.js`
  - [ ] `initialize`
  - [ ] `width`
  - [ ] `text`
  - [ ] `textAlign`
  - [ ] `font`
  - [ ] `color`
  - [ ] `cvsRender`
  - [ ] `domRender`
  - [ ] `detectRender`
  - [ ] `updateBoundArea`
  - [ ] `getMetrics`
- [ ] `Map.js`
- [x] `Group.js`
  - [x] `initialize`
  - [x] `addChild`
  - [x] `insertBefore`
  - [x] `removeChild`
  - [x] `firstChild`
  - [x] `lastChild`
  - [x] `rotation`
  - [x] `scaleX`
  - [x] `scaleY`
  - [x] `originX`
  - [x] `originY`
  - [x] `_dirty`
- [x] `Matrix.js`
- [ ] `DetectColorManager.js`
  - [ ] `initialize`
- [ ] `DomManager.js`
- [ ] `DomLayer.js`
- [ ] `CanvasLayer.js`
  - [ ] `initialize`
  - [ ] `_stopRendering`
  - [x] `_setImageSmoothingEnable`
- [ ] `CanvasRenderer.js`
- [ ] `Scene.js`
  - [x] `initialize`
  - [x] `remove`
  - [x] `_oncoreresize`
  - [ ] `addLayer`
  - [ ] `_determineEventTarget`
  - [x] `_onchildadded`
  - [x] `_onchildremoved`
  - [x] `_onenter`
  - [x] `_onexit`
- [ ] `LoadingScene.js`
- [ ] `CanvasScene.js`
- [ ] `DOMScene.js`
- [x] `Surface.js`
- [ ] `Deferred.js`

__sound support__

- [x] `DOMSound.js`
- [x] `WebAudioSound.js`
- [x] `Sound.js`

__animation feature__

- [ ] `Easing.js`
- [ ] `ActionEventTarget.js`
- [ ] `Timeline.js`
- [ ] `Action.js`
- [ ] `ParallelAction.js`
- [ ] `Tween.js`

## Contribution

- How to get started?
  - Create issues to ask questions about what you want to ask about the project.
  - Take a look at [Gruntfile.coffee](./original-enchant.js/Gruntfile.coffee) for list of modules and convert them to TypeScript.

## Development guide

- VSCode (optional)
- Install Node.JS, Yarn, and Python (optional).
- Run `yarn` to install dependencies.
- Run `yarn add -g typescript` or `npm i -g typescript` to install `TypeScript` globally in order to use the `tsc` command. Otherwise, you have to put your command in `package.json`'s `scripts` and use `npm run ...`.
- Run `tsc` to compile `src/index.ts` to `build/index.js`.
- Run a web server at root project (e.g. `python3 -m http.server 8080`).
- Browser to `build` to try `build/index.js` (e.g. [http://localhost:8080/build](http://localhost:8080/build)).
- Browser to `original-enchant.js/dev` to compare the behavior with `enchant.js` (e.g. [http://localhost:8080/original-enchant.js/dev](http://localhost:8080/original-enchant.js/dev)).
