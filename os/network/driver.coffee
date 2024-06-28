console.log "network device driver thread"

wasm = null

addEventListener "message", ({ data }) ->
    console.warn "device driver got msg", data, wasm

methods = []
imports = {}

imports.socket =
    tcp : -> 1

setTimeout =>
    postMessage({
        call : "memory.malloc", 
        args : [1240]
    })
, 1000

for r, l of imports then for f of l
    methods.push "#{r}.#{f}" 

fetch( "./device.wasm" )
    .then ( data ) -> data.arrayBuffer()
    .then ( buff ) -> WebAssembly.instantiate buff, imports
    .then ( init ) -> wasm = init
    .then -> postMessage call: "methods", args: methods