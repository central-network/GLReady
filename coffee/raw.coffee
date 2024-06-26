{ log, warn, error } = console

sab = null
cpu = []
fns =
    window  : ->
        cpu.push new Worker src, { name: "memory" }
        cpu.push new Worker src, { name: "display" }
        cpu.push new Worker src, { name: "storage" }
        cpu.push new Worker src, { name: "network" }

        sab = new SharedArrayBuffer 1002
        pu.postMessage sab for pu in cpu

    memory  : -> @onmessage = ({ data: sab }) ->
        console.warn "alive name:", name, sab

    display : -> @onmessage = ({ data: sab }) ->
        console.warn "alive name:", name, sab

    storage : -> @onmessage = ({ data: sab }) ->
        console.warn "alive name:", name, sab

    network : -> @onmessage = ({ data: sab }) ->
        console.warn "alive name:", name, sab

        
fns[ name || "window" ].call this