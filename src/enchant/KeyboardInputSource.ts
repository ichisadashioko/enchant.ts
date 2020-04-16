
export default class KeyboardInputSource extends BinaryInputSource {
    static _instances = {};

    static getByKeyCode(keyCode: string) {
        if (!this._instances[keyCode]) {
            this._instances[keyCode] = new enchant.KeyboardInputSource(keyCode);
        }
        return this._instances[keyCode];
    }

    constructor(keyCode: string) {
        super(keyCode);
    }
}
