# enchant.ts

This project aims to port the game library [enchant.js](https://github.com/wise9/enchant.js) to TypeScript.

## Checklist

- [x] `header.js`
- [x] `Class.js`
- [x] `Env.js`
- [x] `Event.js`
- [x] `EventTarget.js`
- [ ] `Core.js`
- [x] `Game.js`
- [ ] `InputManager.js`
- [x] `InputSource.js`
- [ ] `BinaryInputManager.js`
- [ ] `BinaryInputSource.js`
- [ ] `KeyboardInputManager.js`
- [ ] `KeyboardInputSource.js`
- [x] `Node.js`
- [ ] `Entity.js`
- [ ] `Sprite.js`
- [ ] `Label.js`
- [ ] `Map.js`
- [x] `Group.js`
- [x] `Matrix.js`
- [ ] `DetectColorManager.js`
- [ ] `DomManager.js`
- [ ] `DomLayer.js`
- [ ] `CanvasLayer.js`
- [ ] `CanvasRenderer.js`
- [ ] `Scene.js`
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

We love contributions.

- How to get started?
    - Create issues to ask questions about what you want to ask about the project.
    - Take a look at [Gruntfile.coffee](./original-enchant.js/Gruntfile.coffee) for list of modules and convert them to TypeScript.

## Development guide

- VSCode (optional)
- Install Node.JS, Yarn, and Python (optional).
- Run `yarn` to install dependencies.
- Run `yarn add -g typescript` to install `TypeScript`.
- Run `tsc` to compile `src/index.ts` to `build/index.js`.
- Run a web server at root project (e.g. `python3 -m http.server 8080`).
- Browser to `build` to try `build/index.js` (e.g. [http://localhost:8080/build](http://localhost:8080/build)).
- Browser to `original-enchant.js/dev` to compare the behavior with `enchant.js` (e.g. [http://localhost:8080/original-enchant.js/dev](http://localhost:8080/original-enchant.js/dev)).