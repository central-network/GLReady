import { Pointer, Matrix4 } from "./ptr.js"
import "./ptr_gl.js"

worker = null
forker = null

addEventListener "message", ({ data }) ->
    #log "triggering worker init"
    init data
, once : on

init = ( buffer ) ->
    return unless buffer
    Pointer.setBuffer buffer

    worker = new Pointer self.name
    forker = worker.getParentPtrP()

    log gl = forker

    for buffer in gl.buffers when buffer.bound 
        for mode from buffer then for draw from mode
            #console.log "mode:", mode * 1, "\t  draw:", draw * 1, "\t", [mode, draw], "\ttype:", draw.type
            
            draw.object3.matrix

            while vec3 = draw.object3.nextVertex()
                mat4 = Matrix4.translation vec3
                f32m = draw.object3.matrix.apply mat4
                console.log f32m.subarray 12, 15

