# TODO this works only WINDOW
# ???? removed from worker ->

import Pointer from "./ptr.js"
import GL from "./ptr_gl.js"

export default init = ( buffer ) ->
    Pointer::buffer = buffer
    ptr_gl = new GL()
    ptr_gl.fork 1

    ptr_gl.cullFace = WebGL2RenderingContext.CULL_FACE

    console.error ptr_gl
    