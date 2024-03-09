import Pointer from "./ptr.js"
import GL from "./ptr_gl.js"

node = null
init = ( buffer ) ->
    Pointer::buffer = buffer

    node = new Pointer self.name
    node.setOnlineState 1

    postMessage node

bc.addEventListener "message", (e) ->
    console.warn new Pointer e.data

addEventListener "message", ({ data }) ->
    unless data instanceof SharedArrayBuffer
        return console.log forked: new Pointer data
    init data
