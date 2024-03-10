import Pointer from "./ptr.js"
import GL from "./ptr_gl.js"

worker = null
forker = null 

init = ( buffer ) ->

    Pointer.setBuffer buffer

    worker = new Pointer self.name
    forker = worker.getParentPtrP()
    worker . setOnlineState 1

    log worker: worker, forker: forker
    log [ "locked request'n response", "gl.FLOAT", forker.gl.FLOAT ]

addEventListener "message", ({ data }) ->

    log "triggering worker init"
    init data

, once : yes
