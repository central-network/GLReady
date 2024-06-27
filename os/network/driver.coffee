console.log "network device driver thread"

dev = null
addEventListener "message", ({ data }) ->
    console.warn "device driver got msg", data, dev

methods = []
imports =
    socket :
        tcp : ->
            1

            
for r, l of imports then for f of l
    methods.push "#{r}.#{f}" 


fetch( "./device.wasm" )
    .then ( data ) -> data.arrayBuffer()
    .then ( buff ) -> WebAssembly.instantiate buff, imports
    .then ( wasm ) -> dev = wasm; postMessage methods
