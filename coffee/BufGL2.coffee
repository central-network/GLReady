import Pointer from "./Pointer.js"

ARRAY_UINT32 = null
export class BufGL2 extends EventTarget

    constructor : ( buffer = new SharedArrayBuffer 1e8 ) ->
        super( "BufGL2" )

        Pointer.setSourceBuffer buffer

        ARRAY_UINT32 = new Uint32Array buffer

        Atomics.add ARRAY_UINT32, 0, 1e6
        Atomics.add ARRAY_UINT32, 1, 24

    malloc      : ( byteLength ) ->
        byteOffset = Atomics.add ARRAY_UINT32, 0, byteLength 
        pointerOffset = Atomics.add ARRAY_UINT32, 1, Pointer.byteLength

        ptr = new Pointer pointerOffset

        ptr.byteOffset  = byteOffset
        ptr.byteLength  = byteLength

        ptr.update()

        ptr

Object.defineProperties BufGL2::,
    context     :
        get     : -> @gl
        set     : -> Object.defineProperty this, "gl", { value: arguments[0] }

export default BufGL2