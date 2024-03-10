import Pointer from "./ptr.js"
import GL from "./ptr_gl.js"

worker = null
forker = null 

init = ( buffer ) ->

    Pointer.setBuffer buffer

    worker = new Pointer self.name
    forker = worker.getParentPtrP()
    worker . setOnlineState 1

    console.log worker: worker, forker: forker

    console.log "locked request gl.FLOAT:", forker.gl.FLOAT

addEventListener "message", ({ data }) ->

    log "triggering worker init"
    init data

, once : yes
