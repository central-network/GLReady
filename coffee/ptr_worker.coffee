import { WorkerPointer } from "./ptr.coffee"
import Pointer from "./ptr.js"
import { GL, Program, Shader } from "./ptr_gl.js"

worker = null
forker = null 

init = ( buffer ) ->
    return unless buffer
    Pointer.setBuffer buffer

    worker = new WorkerPointer self.name
    forker = worker.getParentPtrP()

    log worker: worker, forker: forker
    log [ "locked request'n response", "gl.FLOAT", forker.gl.FLOAT ]

addEventListener "message", ({ data }) ->

    log "triggering worker init"
    init data

, once : yes
