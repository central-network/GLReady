import "./ptr_self.coffee"

LE = no
OBJECTS = []

buf = u32 = f32 = dvw =
palloc = malloc = false

INDEX_BUF           = 0
INDEX_PTR           = 1

POINTERS_BYTELENGTH = 4 * 1e5
POINTERS_BYTEOFFSET = 8

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

Object.defineProperties DataView::,

    setObject : value : ( offset, object ) ->
        if -1 is i = OBJECTS.indexOf object
            i += OBJECTS.push object
            @setUint32 offset, object, LE
        ; i

    getObject : value : ( offset ) ->
        OBJECTS[ @getUint32 offset, LE ]

    toPointer : value : ( offset ) ->
        new Pointer @getUint32 offset

#? POINTER STARTS
LENGTH_OF_POINTER   = 16
BYTES_PER_POINTER   = 4 * LENGTH_OF_POINTER
OFFSET_BYTEOFFSET   = 4 * 1
OFFSET_BYTELENGTH   = 4 * 2
OFFSET_PROTOCLASS   = 4 * 3
OFFSET_LINKEDNODE   = 4 * 4
OFFSET_PARENT_PTR   = 4 * 5

OFFSET_PTRCLASS_0   = 4 * 6
OFFSET_PTRCLASS_1   = 4 * 7
OFFSET_PTRCLASS_2   = 4 * 8
OFFSET_PTRCLASS_3   = 4 * 9
OFFSET_PTRCLASS_4   = 4 * 10

POINTER_PROTOTYPE   = [,]

export default class Pointer extends Number
    constructor : ( ptr = palloc BYTES_PER_POINTER ) ->
        
        super ptr

        if  shadow = arguments.length
            Object.setPrototypeOf this,
                POINTER_PROTOTYPE[ @getProtoClass() ]::
        else
            this
                .setByteLength @constructor.byteLength
                .setProtoClass @constructor.protoClass
                .setByteOffset malloc @getByteLength()
                
            @init()

    sync        : -> bc.postMessage this

    init        : -> this

    fork        : ( workerCount = 1 ) ->
        @add new WorkerPointer()
        
        setTimeout =>
            bc.postMessage this
        , 1000

    add         : ( ptr ) -> ptr.setParentPtri this

        
export class BufferPointer extends Pointer
export class OffsetPointer extends Pointer
export class ObjectPointer extends Pointer
export class AtomicPointer extends Pointer
export class WorkerPointer extends Pointer

Object.defineProperties Pointer,

    registerClass   : value : -> @protoClass or= -1 + POINTER_PROTOTYPE.push this ; @


Object.defineProperties Pointer::,

    getHeader       : value : -> dvw.getUint32 this + arguments[0] * 4

    findAllChilds   : value : ->
        offset = POINTERS_BYTEOFFSET + OFFSET_PARENT_PTR
        finish = Atomics.load u32, INDEX_PTR
        number = this * 1
        childs = []

        while offset < finish
            if -0 is number - dvw.getUint32 offset, LE
                childs.push new Pointer offset - OFFSET_PARENT_PTR
            offset += BYTES_PER_POINTER

        childs

    getAllHeaders   : value : -> [ 0 ... LENGTH_OF_POINTER ].map @getHeader.bind this    
    
    setAllHeaders   : value : -> @getAllHeaders().set arguments[0]

    getByteOffset   : value : -> dvw.getUint32 this + OFFSET_BYTEOFFSET, LE

    setByteOffset   : value : -> dvw.setUint32 this + OFFSET_BYTEOFFSET, arguments[0], LE ; @

    getByteLength   : value : -> dvw.getUint32 this + OFFSET_BYTELENGTH, LE

    setByteLength   : value : -> dvw.setUint32 this + OFFSET_BYTELENGTH, arguments[0], LE ; @

    getProtoClass   : value : -> dvw.getUint32 this + OFFSET_PROTOCLASS, LE

    setProtoClass   : value : -> dvw.setUint32 this + OFFSET_PROTOCLASS, arguments[0], LE ; @

    getLinkedNode   : value : -> dvw.getObject this + OFFSET_LINKEDNODE, LE

    setLinkedNode   : value : -> dvw.setObject this + OFFSET_LINKEDNODE, arguments[0], LE ; @

    getParentPtri   : value : -> dvw.getUint32 this + OFFSET_PARENT_PTR, LE

    setParentPtri   : value : -> dvw.setUint32 this + OFFSET_PARENT_PTR, arguments[0], LE ; @

    getParentPtrO   : value : -> dvw.getObject this + OFFSET_PARENT_PTR, LE

    setParentPtrO   : value : -> dvw.setObject this + OFFSET_PARENT_PTR, arguments[0], LE ; @

    getParentPtrP   : value : -> dvw.toPointer this + OFFSET_PARENT_PTR, LE



Object.defineProperties Pointer::,

    buffer          : set : initbuf, get : -> buf

    children        : get : Pointer::findAllChilds

    headers         : get : Pointer::getAllHeaders , set : Pointer::setAllHeaders

    byteOffset      : get : Pointer::getByteOffset , set : Pointer::setByteOffset
    
    byteLength      : get : Pointer::getByteLength , set : Pointer::setByteLength
    
    #protoClass     : get : Pointer::getProtoClass , set : Pointer::setProtoClass

    linkedNode      : get : Pointer::getLinkedNode , set : Pointer::setLinkedNode
    
    parent          : get : Pointer::getParentPtrP , set : Pointer::setParentPtri



Object.defineProperties WorkerPointer,
    
    byteLength      : value : 4 * 64

Object.defineProperties WorkerPointer::,
    
    init            : value : ->
        @create()

    create          : value : ->
        worker =new Worker "./ptr_worker.js", { type: "module" }
        worker.postMessage @buffer
        
        @setLinkedNode worker
        @setOnlineState 1

        ; @
        

Object.defineProperties WorkerPointer::,
    
    getOnlineState  : value : -> dvw.getUint32 this + OFFSET_PTRCLASS_0, LE

    setOnlineState  : value : -> dvw.setUint32 this + OFFSET_PTRCLASS_0, arguments[0], LE ; @


Object.defineProperties WorkerPointer::,

    onlineState     : get : WorkerPointer::getOnlineState, set : WorkerPointer::setOnlineState

WorkerPointer.registerClass()
