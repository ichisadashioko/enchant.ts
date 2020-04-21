import Surface from './Surface'

export default class ImageSurface extends Surface {
    _element: HTMLImageElement;
    _css: string;

    constructor(element, css) {
        super();
        this._element = element;
        this._css = css;
    }

    toDataURL() {
        let src = this._element.src;
        if (src.slice(0, 5) === 'data:') {
            return src;
        } else {
            return this.clone().toDataURL();
        }
    }
}