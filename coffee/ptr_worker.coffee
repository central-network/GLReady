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
        for mode from buffer

            numCmponents = mode.numCmponents

            for draw from mode

                color = draw.object3.color
                matrix = draw.object3.matrix
                attribs = draw.attributes
                numIndex = -numCmponents

                while vertex = draw.object3.nextVertex()
                    position = matrix.apply vertex

                    attribs.set [
                        ...position,
                        ...color
                    ], numIndex += numCmponents
                    
                draw.isUpdated = 1
                mode.needUpload = 1

            mode.isUpdated = 1
            mode.needUpload = 1
            
            console.log mode

