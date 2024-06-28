console.log /DRIVER/, "memory device driver thread"

wasm = null
methods = []
imports = {}

addEventListener "message", ({ data }) ->
    console.error "memory device driver got msg", data, wasm

    if  data.call is "memory.malloc"
        # todo check is it satisfying requirements
        # permissions is not checking in here
        1

methods.push "memory.malloc"

imports.memory =
    # malloc : -> 1
    # todo bunu wasm'ın import etmesine gerek yok
    # sadece window'a bildirmek gerekiyor ki
    # bu aygitin boyle bir metodu var
    # expose gereksiz

    new_ArrayBuffer         : ( byteLength ) ->
        # creates new array buffer from inside wasm device

    new_SharedArrayBuffer   : ( byteLength ) ->
        # creates new shared array buffer from inside wasm device


fetch( "./device.wasm" )
    .then ( data ) -> data.arrayBuffer()
    .then ( buff ) -> WebAssembly.instantiate buff, imports
    .then ( init ) -> wasm = init
    .then -> postMessage call: "methods", args: methods
