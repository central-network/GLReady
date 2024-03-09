import Pointer from "./ptr.js"
import GL from "./ptr_gl.js"

init = ( buffer ) ->
    Pointer::buffer = buffer

bc.addEventListener "message", (e) ->
    console.warn new Pointer e.data

addEventListener "message", ({ data }) ->
    unless data instanceof SharedArrayBuffer
        return handleMessage ...arguments
    init data