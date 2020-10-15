import Event from './Event.ts'
import CanvasLayer from './CanvasLayer.ts'

export default class CanvasRenderer {

    render(ctx: CanvasRenderingContext2D, node: CanvasLayer, e: Event) {
        // TODO
    }

    detectRender(ctx: CanvasRenderingContext2D, node: CanvasLayer) {
        // TODO
    }

    transform(ctx: CanvasRenderingContext2D, node: CanvasLayer) {
        // TODO
    }

    static instance = new CanvasRenderer()
}
