import Entity from './Entity'

export default class Label extends Entity {

    _text: string
    _width: number

    font: string
    textAlign: string

    _debugColor: string
    _boundWidth: number
    _boundHeight: number
    _boundOffset: number
    _splitText: Array<{ text: string, width: number, height: number }>

    constructor(text: string) {
        super()

        // initialize properties
        // TODO check to see if this may lead to any side effects
        this._text = ''
        this._width = 0
        this._boundWidth = 0
        this._boundHeight = 0
        this._boundOffset = 0
        this._splitText = []

        this.text = text || ''
        this.width = 300
        this.font = '14px serif'
        this.textAlign = 'left'

        this._debugColor = '#ff0000'
    }

    get text(): string {
        return this._text
    }

    set text(value: string) {
        value = '' + value

        if (this._text === value) {
            return
        }

        this._text = value
        value = value.replace(/<br ?\/?>/gi, '<br/>')
        let splitText = value.split('<br/>')
        this._splitText = []

        this.updateBoundArea()

        for (let i = 0; i < splitText.length; i++) {
            value = splitText[i]
            let metrics = this.getMetrics(value)
            this._splitText[i] = {
                text: value,
                height: metrics.height,
                width: metrics.width,
            }
        }
    }

    get width(): number {
        return this._width
    }

    set width(value: number) {
        this._width = value
        this._dirty = true
        this.updateBoundArea()
    }

    cvsRender() {
        // TODO
    }

    domRender() {
        // TODO
    }

    detectRender() {
        // TODO
    }

    updateBoundArea() {
        let metrics = this.getMetrics()
        this._boundWidth = metrics.width
        this._boundHeight = metrics.height
        if (this.textAlign === 'right') {
            this._boundOffset = this.width - this._boundWidth
        } else if (this.textAlign === 'center') {
            this._boundOffset = (this.width - this._boundWidth) / 2
        } else {
            this._boundOffset = 0
        }
    }

    getMetrics(text?: string): { width: number, height: number } {
        let ret = {
            width: 0,
            height: 0,
        }

        if (document.body) {
            let div = document.createElement('div')
            for (let prop in this._style) {
                if (prop !== 'width' && prop !== 'height') {
                    div.style[prop] = this._style[prop]
                }
            }

            text = text || this._text
            div.innerHTML = text.replace(/ /g, '&nbsp;')
            div.style.whiteSpace = 'noWrap'
            div.style.lineHeight = '1'
            document.body.appendChild(div)
            let computedStyle = getComputedStyle(div)
            ret.height = parseInt(computedStyle.height, 10) + 1
            div.style.position = 'absolute'
            ret.width = parseInt(computedStyle.width, 10) + 1
            document.body.removeChild(div)
        } else {
            ret.width = this.width
            ret.height = this.height
        }

        return ret
    }
}
