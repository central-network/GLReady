import { BufGL2Screen } from "./BufGL2Screen.coffee"

export class BufGL2 extends EventTarget

    constructor : ( buffer = new SharedArrayBuffer 1e8 ) ->
        Object.defineProperties super( "BufGL2" ),
            screen : value : new BufGL2Screen buffer

Object.defineProperties BufGL2::,
    canvas      :
        get     : -> @gl.canvas
        set     : ->
            canvas = arguments[ 0 ]
            context = value : canvas.getContext "webgl2"

            Object.defineProperty this, "gl", context
                .screen.readCanvas canvas

    background  :
        get     : -> @screen.background
        set     : -> @screen.background = arguments[0]

export default BufGL2