import { byteLength } from "./Pointer.coffee"
import "./ptr_self.coffee"

LE = no

buf = u32 = 
f32 = dvw = null

palloc = null
malloc = null

INDEX_BUF = 0
INDEX_PTR = 1

POINTERS_BYTELENGTH = 4 * 1e5
POINTERS_BYTEOFFSET = 8

LENGTH_OF_POINTER   = 16
BYTES_PER_POINTER   = 4 * LENGTH_OF_POINTER
OFFSET_BYTEOFFSET   = 4 * 1
OFFSET_BYTELENGTH   = 4 * 2
OFFSET_PROTOCLASS   = 4 * 3

POINTER_PROTOTYPE   = [,]

export class Pointer extends Number
    constructor : ( ptr = palloc BYTES_PER_POINTER ) ->
        
        super ptr

        if  arguments.length
            Object.setPrototypeOf this,
                POINTER_PROTOTYPE[ @protoClass ]
                    .prototype
        else
            this
                .setByteLength @constructor.byteLength
                .setProtoClass @constructor.protoClass
                .setByteOffset malloc @byteLength

    syncWorkers : -> bc.postMessage this

export class BufferPointer extends Pointer
export class OffsetPointer extends Pointer
export class ObjectPointer extends Pointer
export class AtomicPointer extends Pointer
export default Pointer

initbuf = ( sab ) ->
    buf = sab
    u32 = new Uint32Array buf
    f32 = new Float32Array buf
    dvw = new DataView buf

    Atomics.or u32, INDEX_BUF, POINTERS_BYTELENGTH #byteOffset
    Atomics.or u32, INDEX_PTR, POINTERS_BYTEOFFSET #pointerOffset

    palloc = Atomics.add.bind Atomics, u32, INDEX_PTR
    malloc = Atomics.add.bind Atomics, u32, INDEX_BUF

    log "base buffer settled", buf
    log "atomics uint32 base", u32

Object.defineProperties Pointer,

    registerClass   : value : ->
        @protoClass or=
            -1 + POINTER_PROTOTYPE.push @
        ; @

Object.defineProperties Pointer::,

    getHeader       : value : -> dvw.getUint32 this + arguments[0] * 4

    getAllHeaders   : value : -> [ 0 ... LENGTH_OF_POINTER ].map @getHeader.bind this    
    
    setAllHeaders   : value : -> @getAllHeaders().set arguments[0]

    getByteOffset   : value : -> dvw.getUint32 this + OFFSET_BYTEOFFSET, LE

    setByteOffset   : value : -> dvw.setUint32 this + OFFSET_BYTEOFFSET, arguments[0], LE ; @

    getByteLength   : value : -> dvw.getUint32 this + OFFSET_BYTELENGTH, LE

    setByteLength   : value : -> dvw.setUint32 this + OFFSET_BYTELENGTH, arguments[0], LE ; @

    getProtoClass   : value : -> dvw.getUint32 this + OFFSET_PROTOCLASS, LE

    setProtoClass   : value : -> dvw.setUint32 this + OFFSET_PROTOCLASS, arguments[0], LE ; @


Object.defineProperties Pointer::,

    buffer          : set : initbuf, get : -> buf

    headers         : get : Pointer::getAllHeaders , set : Pointer::setAllHeaders

    byteOffset      : get : Pointer::getByteOffset , set : Pointer::setByteOffset
    
    byteLength      : get : Pointer::getByteLength , set : Pointer::setByteLength
    
    protoClass      : get : Pointer::getProtoClass , set : Pointer::setProtoClass
