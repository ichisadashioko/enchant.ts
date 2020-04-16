import Core from './Core'
import Group from './Group'

interface NodeMap {
    [type: string]: Node;
}

/**
 * Class that becomes the root of the display object tree.
 * 
 * Child `Entity` objects are distributed to the Scene layer 
 * according to the drawing method.
 * The DOM of each Scene layer has an `enchant.DOMLayer` 
 * and an `enchant.CanvasLayer` and is drawn using the Canvas.
 * 
 * Scenes are drawn in the order that they are added.
 * 
 * @example
 * var scene = new Scene();
 * scene.addChild(player);
 * scene.addChild(enemy);
 * core.pushScene(scene);
 */
export class Scene extends Group {

    _element: HTMLElement
    _layers: NodeMap
    _layerPriority: []

    _backgroundColor: string

    get backgroundColor(): string {
        return this._backgroundColor
    }

    set backgroundColor(color: string) {
        this._backgroundColor = this._element.style.backgroundColor = color;
    }

    constructor() {
        super();

        let core = Core.instance;

        // All nodes (entities, groups, scenes) have reference to 
        // the scene that it belongs to.
        this.scene = this;
        this._backgroundColor = null;

        // Create div tag which prossesses its layers
        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style.transformOrigin = '0 0';

        this._layers = {};
        this._layerPriority = [];

        this.addEventListener(Event.CHILD_ADDED, this._onchildadded);
        this.addEventListener(Event.CHILD_REMOVED, this._onchildremoved);
        this.addEventListener(Event.ENTER, this._onenter);
        this.addEventListener(Event.EXIT, this._onexit);

        this.addEventListener(Event.CORE_RESIZE, this._oncoreresize);

        this._oncoreresize(core);
    }

    _dispatchExitframe() {
        let layer;
        for (let prop in this._layers) {
            layer = this._layers[prop];
            layer.dispatchEvent(new enchant.Event(Event.EXIT_FRAME));
        }
    }

    set x(x: number) {
        this._x = x;
        for (let type in this._layers) {
            this._layers[type].x = x;
        }
    }

    set y(y: number) {
        this._y = y;
        for (let type in this._layers) {
            this._layers[type].y = y;
        }
    }

    set width(width: number) {
        this._width = width;
        for (let type in this._layers) {
            this._layers[type].width = width;
        }
    }

    set height(height: number) {
        this._height = height;
        for (let type in this._layers) {
            this._layers[type].height = height;
        }
    }

    set rotation(rotation: number) {
        this._rotation = rotation;
        for (let type in this._layers) {
            this._layers[type].rotation = rotation;
        }
    }

    set scaleX(scale: number) {
        this._scaleX = scale;
        for (let type in this._layers) {
            this._layers[type].scaleX = scale;
        }
    }

    set scaleY(scale: number) {
        this._scaleY = scale;
        for (let type in this._layers) {
            this._layers[type].scaleY = scale;
        }
    }

    remove() {
        this.clearEventListener();
        while (this.childNodes.length > 0) {
            this.childNodes[0].remove();
        }

        return enchant.Core.instance.removeScene(this);
    }

    _oncoreresize(e: enchant.Core) {
        this._element.style.width = e.width + 'px';
        this.width = e.width;
        this._element.style.height = e.height + 'px';
        this.height = e.height;
        this._element.style.transform = `scale(${e.scale})`;

        for (let type in this._layers) {
            this._layers[type].dispatchEvent(e);
        }
    }

    _onchildadded(e: Event) {
        let child = e.node;
        let next = e.next;
        let target: string, i: number;
        if (child._element) {
            target = 'Dom';
            i = 1;
        } else {
            target = 'Canvas';
            i = 0;
        }
        if (!this._layers[target]) {
            this.addLayer(target, i);
        }
        child._layer = this._layers[target];
        this._layers[target].insertBefore(child, next);
        child.parentNode = this;
    }

    _onchildremoved(e: Event) {
        let child = e.node;
        child._layer.removeChild(child);
        child._layer = null;
    }

    _onenter() {
        for (let type in this._layers) {
            this._layers[type]._startRendering();
        }
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    }

    _onexit() {
        for (let type in this._layers) {
            this._layers[type]._stopRendering();
        }
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
}
