# TODO this works only WINDOW
# ???? removed from worker ->

import Pointer from "./ptr.js"
import GL from "./ptr_gl.js"

export default init = ( buffer ) ->
    Pointer::buffer = buffer
    ptr_gl = new GL()

    setTimeout =>
        ptr_gl.syncWorkers()
    , 200
    
    console.error ptr_gl
    