import Pointer from "./ptr.js"
import "./ptr_gl.js"

worker = null
forker = null

addEventListener "message", ({ data }) ->
    #log "triggering worker init"
    init data
, once : yes

init = ( buffer ) ->
    return unless buffer
    Pointer.setBuffer buffer

    worker = new Pointer self.name
    forker = worker.getParentPtrP()

    log gl = forker
    
    for buffer in gl.getAllBuffers()
        for mode in buffer
            console.log mode
