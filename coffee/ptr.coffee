import "./ptr_self.coffee"

LE = no
OBJECTS = [,]

buf = u32 = i32 = dvw =
palloc = malloc = false

INDEX_NOW           = 0
INDEX_HIT           = 1
INDEX_FPS           = 2
INDEX_PTR           = 3
INDEX_BUF           = 4

POINTERS_BYTELENGTH = 4 * 1e5
POINTERS_BYTEOFFSET = 4 * 16

proxy = ->
    o = WebGL2RenderingContext::
    o.i = arguments[0]
    new Proxy o,
        get : ( {i}, key ) ->

            #* request sent to window --->
            #TODO integrate arguments for fns
            postMessage proxy: i, key:key

            #* proxy locked now --->
            Atomics.wait i32, 11000, 0
            #TODO window processing request
            #TODO notify 1000 index for one time 
            #TODO when result is ready
            
            #* proxy unlocked now --->
            result = Atomics.load i32, 11000
            #TODO window written result to that index
            #TODO we need to implement more complex ones

            #TODO hey beyb: that's sync on window and worker
            return result #? awesome :))) <3

KEYED =
    0       : new (class NONE extends Number) 0
    16640   : new (class DEPTH_N_COLOR_BIT extends Number) 16640

for k, v of WebGL2RenderingContext then KEYED[ v ] =
    eval "new (class #{k} extends Number {})(#{v})"

Object.defineProperties DataView::,
    
    setObject : value : ( offset, object ) ->
        if -1 is i = OBJECTS.indexOf object
            i += OBJECTS.push object
            @setUint32 offset, i, LE
        OBJECTS[ i ]

    delObject : value : ( offset ) ->
        OBJECTS.splice offset, 1 ; 0

    getObject : value : ( offset ) ->
        return unless i = @getUint32 offset, LE
        return OBJECTS[ i ] ?= proxy i

    toPointer : value : ( offset ) ->
        new Pointer i if i = @getUint32 offset, LE

    keyUint16 : value : ( offset ) ->
        KEYED[ @getUint16 offset, LE ]

class Color4 extends Number

    Object.defineProperties this,
        u32 : value : ( any ) ->
            if isNaN any
                if  any.map
                    [ r = 0, g = 0, b = 0, a = 1 ] = any

                    if (r and r <= 1) or (g and g <= 1 ) or (b and b <= 1 )
                        r *= 0xff
                        g *= 0xff
                        b *= 0xff

                    if (a and a <= 1)
                        a *= 0xff

                    return parseInt(
                        r.toString(16).padStart(2,0) +
                        g.toString(16).padStart(2,0) +
                        b.toString(16).padStart(2,0) +
                        a.toString(16).padStart(2,0) , 16
                    )
                return parseInt any
            return any                

    Object.defineProperties this::,
        f32 : get : ->
            dv = new DataView new ArrayBuffer 4
            dv.setUint32 0, this, LE

            i8 = new Uint8Array dv.buffer
            i8.reverse() if LE 
            di = 255

            Float32Array.of ...[ ...i8 ].map (n) -> n/di
        
        ui8 : get : ->
            dv = new DataView new ArrayBuffer 4
            dv.setUint32 0, this, LE

            i8 = new Uint8Array dv.buffer
            i8.reverse() if LE 
            i8

        hex : get : ->
            "#" + [ ...@ui8 ].map (n) ->
                n.toString(16).padStart(2,0)
            .join ""

        css : get : ->
            [ r, g, b, a ] = @ui8
            ( a = ( a / 2.55 ).toFixed(2) )
            "rgba( #{r} #{g} #{b} / #{a}% )"

    Object.defineProperties Number::,

        toUint32Number  : value : ->
            return 0 unless this

            new DataView buf = new ArrayBuffer 4
                .setUint32 0, this, LE

            parseInt "0x" + [ 
                ...new Uint8Array( buf )
            ].map( (m) -> m.toString(16).padStart(2, 0) ).join("")

        toFloat32Array  : value : ( normalized = yes )  ->
            return new Float32Array(4) unless this

            dv = new DataView new ArrayBuffer 4
            dv.setUint32 0, this, LE

            i8 = new Uint8Array dv.buffer
            i8.reverse() if LE 

            di = 1
            di = 255 if normalized

            Float32Array.of ...[ ...i8 ].map (n) -> n/di

        toRGBA          : value : ->
            @toFloat32Array ...arguments

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

    @setBuffer  : ( buf, max = 1e20 ) ->

        unless arguments.length
            loop #? this blocks worker
                try buf = new SharedArrayBuffer max
                catch then continue if max = max/10
                finally buf = null
                break
            buf = new SharedArrayBuffer max
            
        u32 = new Uint32Array buf
        i32 = new Int32Array buf
        f32 = new Float32Array buf
        dvw = new DataView buf

        Atomics.or u32, INDEX_BUF, POINTERS_BYTELENGTH #byteOffset
        Atomics.or u32, INDEX_PTR, POINTERS_BYTEOFFSET #pointerOffset

        palloc = Atomics.add.bind Atomics, u32, INDEX_PTR
        malloc = Atomics.add.bind Atomics, u32, INDEX_BUF

        log "base buffer settled", buf
        log "atomics uint32 base", u32

        Reflect.defineProperty Pointer::,  "buffer", { value : buf }
        Reflect.deleteProperty Pointer, "setBuffer"

        ƒ T = 0 if window? and T = ƒ = ( t ) ->
            u32[ INDEX_NOW ] = t
            u32[ INDEX_HIT ]++ % 1e2 or
            u32[ INDEX_FPS ] = 1e5 / (-T+T=t)

            ; requestAnimationFrame ƒ

    constructor : ( ptr = palloc BYTES_PER_POINTER ) ->
        
        super ptr

        if  arguments.length
            if  this.constructor is Pointer
                Object.setPrototypeOf this,
                    POINTER_PROTOTYPE[ @getProtoClass() ]::
        else
            byteLength = @constructor.byteLength
            
            dvw.setUint32 this + OFFSET_BYTELENGTH, byteLength, LE
            dvw.setUint32 this + OFFSET_PROTOCLASS, @constructor.protoClass, LE
            dvw.setUint32 this + OFFSET_BYTEOFFSET, malloc( byteLength ), LE
                
            this.init()

    @malloc     : ( byteLength ) ->
        
        ptr = palloc BYTES_PER_POINTER

        dvw.setUint32 ptr + OFFSET_BYTELENGTH, byteLength, LE
        dvw.setUint32 ptr + OFFSET_PROTOCLASS, @protoClass, LE ; @
        dvw.setUint32 ptr + OFFSET_BYTEOFFSET, malloc( byteLength ), LE

        new this( ptr ).init()

    resize      : ->
        #TODO this clones object buffer and creates new pointer for cloned onw
        #TODO ---> no need to clone, just change byteLength and length <3 

        tarray = new Uint8Array @buffer, @byteOffset, @byteLength
        for length in [ @byteLength .. 0 ]
            break if tarray[ length ]
        tarray . slice 0, $byteLength = ++length

        $byteOffset = malloc $byteLength 
        ptr = palloc BYTES_PER_POINTER

        old = new Uint32Array( @buffer, this, LENGTH_OF_POINTER )
        tis = new Uint32Array( @buffer, ptr, LENGTH_OF_POINTER )

        tis.set old
        
        dvw.setUint32 ptr + OFFSET_BYTELENGTH, $byteLength, LE
        dvw.setUint32 ptr + OFFSET_BYTEOFFSET, $byteOffset, LE

        old = new Uint8Array( @buffer, @byteOffset, $byteLength )
        tis = new Uint8Array( @buffer, $byteOffset, $byteLength )

        tis.set old

        new this.constructor ptr

    init        : ->
        this

    fork        : ->
        @add worker = new WorkerPointer()

        worker.onmessage = ({ data }) =>
            if  i = data.proxy  #TODO is it proxy request? only one just for now
                key = data.key  #TODO what is fn's or variable's name
                result = OBJECTS[i][key] #TODO get request

                #TODO call if it is a function -- not ready yet
                if  typeof result is "function"
                    #TODO needs arguments parameter?? 
                    result = result ...data.arguments

                log request: OBJECTS[i].constructor.name + "." + key
                log result: result

                #TODO store result to Int32 array
                Atomics.store i32, 11000, result

                #TODO notify cell to unlock
                Atomics.notify i32, 11000, 1

                #* proxy unlocked now --->

    add         : ->
        arguments[0].setParentPtri this
        
export class WorkerPointer extends Pointer

Object.defineProperties Pointer,

    registerClass   : value : -> ( @protoClass or= -1 + POINTER_PROTOTYPE.push this  ); @

    setDataBuffer   : value : -> [ @prototype.buffer ] = arguments ; @

    removePointer   : value : -> ( arguments[ 0 ].delParentPtri() ); this          

Object.defineProperties Pointer::,

    getHeader       : value : -> dvw.getUint32 this + arguments[0] * 4, LE    

    getTypedArray   : value : -> new this.constructor.typedArray @buffer, @byteOffset, @length

    getTypedLength  : value : -> @byteLength / this.constructor.typedArray.BYTES_PER_ELEMENT

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

    getLinkedNode   : value : -> dvw.getObject this + OFFSET_LINKEDNODE

    setLinkedNode   : value : -> dvw.setObject this + OFFSET_LINKEDNODE, arguments[0]
    
    delLinkedNode   : value : -> dvw.delObject this + OFFSET_LINKEDNODE

    getParentPtri   : value : -> dvw.getUint32 this + OFFSET_PARENT_PTR, LE

    setParentPtri   : value : -> dvw.setUint32 this + OFFSET_PARENT_PTR, arguments[0], LE ; arguments[0]
    
    delParentPtri   : value : -> dvw.setUint32 this + OFFSET_PARENT_PTR, @delParentPtrO(), LE

    delParentPtrO   : value : -> dvw.delObject this . getParentPtri() + OFFSET_LINKEDNODE ; 0

    getParentPtrO   : value : -> dvw.getObject this . getParentPtri() + OFFSET_LINKEDNODE

    setParentPtrO   : value : -> dvw.setObject this + OFFSET_PARENT_PTR, arguments[0]

    getParentPtrP   : value : -> dvw.toPointer this + OFFSET_PARENT_PTR

Object.defineProperties Pointer::,

    getTArray       : value : ->
        [ offset = 0, TypedArray = @constructor.typedArray ] = arguments
        ( byteOffset = @byteOffset + offset )
        ( length = @byteLength / TypedArray.BYTES_PER_ELEMENT )

        new TypedArray( @buffer, byteOffset, length )

    setTArray       : value : ->
        [ offset, value, TypedArray ] = arguments
        ( @getTArray offset, TypedArray ).set value ; this

    getFloat32      : value : -> dvw.getFloat32 @byteOffset + arguments[0], LE
        
    setFloat32      : value : -> dvw.setFloat32 @byteOffset + arguments[0], arguments[1], LE ; arguments[1]

    getUint8        : value : -> dvw.getUint8   @byteOffset + arguments[0]
    
    setUint8        : value : -> dvw.setUint8   @byteOffset + arguments[0], arguments[1] ; arguments[1]

    keyUint16       : value : -> dvw.keyUint16  @byteOffset + arguments[0], arguments[1]

    getUint16       : value : -> dvw.getUint16  @byteOffset + arguments[0], LE
    
    setUint16       : value : -> dvw.setUint16  @byteOffset + arguments[0], arguments[1], LE ; arguments[1]

    setColor4       : value : -> dvw.setUint32  @byteOffset + arguments[0], Color4.u32(arguments[1]), LE ; arguments[1]

    rgbColor4       : value : -> @getColor4( ...arguments ).f32
    
    getColor4       : value : -> new Color4 @getUint32 arguments[0]    

    getString       : value : ->
        [ startOffset , lengthOffset ] = [ ...arguments ]
        ( startOffset = @byteOffset + startOffset )

        tarray = new Uint8Array @buffer, startOffset, @byteLength

        if !lengthOffset or !(length = @getUint16 lengthOffset)
            for length in [ tarray.length .. 0 ]
                break if tarray[ length ] and length++
            
        new TextDecoder().decode tarray.slice 0, length

    setString       : value : ->
        [ startOffset, stringSource, lengthOffset ] = [ ...arguments ]

        source = new TextEncoder().encode stringSource 
        tarray = new Uint8Array @buffer, @byteOffset, @byteLength
        
        tarray.set source, startOffset
        @setUint16 lengthOffset, source.byteLength if lengthOffset

        ; @

Object.defineProperties Pointer::,

    length          : get : Pointer::getTypedLength

    array           : get : Pointer::getTypedArray

    children        : get : Pointer::findAllChilds

    headers         : get : Pointer::getAllHeaders , set : Pointer::setAllHeaders

    byteOffset      : get : Pointer::getByteOffset , set : Pointer::setByteOffset
    
    byteLength      : get : Pointer::getByteLength , set : Pointer::setByteLength
    
    protoClass      : get : Pointer::getProtoClass , set : Pointer::setProtoClass

    linkedNode      : get : Pointer::getLinkedNode , set : Pointer::setLinkedNode
    
    parent          : get : Pointer::getParentPtrP , set : Pointer::setParentPtri

Object.defineProperties WorkerPointer.registerClass(),
    
    byteLength      : value : 4 * 64

Object.defineProperties WorkerPointer::,

    type            : value : "module"

    script          : value : "./ptr_worker.js"
    
    init            : value : -> @create()

    create          : value : ->
        script = this . script
        config = type : this.type , name : this
        worker = new Worker script , config

        @setLinkedNode( worker ).postMessage( @buffer )

    onmessage       : set   : -> @getLinkedNode().onmessage = arguments[0]

    send            : value : -> @getLinkedNode().postMessage ...arguments

Object.defineProperties WorkerPointer::,
    
    getOnlineState  : value : -> dvw.getUint32 this + OFFSET_PTRCLASS_0, LE

    setOnlineState  : value : -> dvw.setUint32 this + OFFSET_PTRCLASS_0, arguments[0], LE ; @

Object.defineProperties WorkerPointer::,

    onlineState     :
        get : WorkerPointer::getOnlineState,
        set : WorkerPointer::setOnlineState

Pointer.setBuffer() if window?


if  window?
    ival = 0

    document?.body.setAttribute "title", "Click body to activate debugger."
    document?.body.onclick = ->
        if ival
            ival = clearInterval ival
        else ival = setInterval dump, 90
        
    hist = [] 
    fill = "".padStart 1e2, '\n'

    dump = ->
        offset = POINTERS_BYTEOFFSET + OFFSET_PARENT_PTR
        finish = Atomics.load u32, INDEX_PTR
        childs = []

        while offset < finish
            childs . push new Pointer offset - OFFSET_PARENT_PTR
            offset += BYTES_PER_POINTER

        dumpArray = []
        byteLength = 0

        for child in childs
            dumpArray.push {
                ptr : child * 1  
                object: child
                parent : child.parent * 1 or null
                type: child.type
                class: child.getProtoClass()
                gl: child.getLinkedNode()
                offset: child.byteOffset
                byteLength: child.byteLength,
                typedArray: new child.constructor.typedArray child.length
                childrens: child.children.length or null
            }

            byteLength += child.byteLength
        freeByteLength = u32.byteLength - byteLength
        freePercent = freeByteLength / u32.byteLength * 1e2

        capacity = (u32.byteLength / Math.pow 1024, 2).toFixed(1) * 1
        freePercent = freePercent.toFixed(2) * 1
        hist.push {
            max : POINTERS_BYTELENGTH / BYTES_PER_POINTER
            count : childs.length 
            ptrOffset : Atomics.load u32, INDEX_PTR 
            byteOffset : Atomics.load u32, INDEX_BUF 
            allocated : byteLength
            [ "capacity(mb)" ] : capacity
            [ "free(%)" ] : freePercent
            [ "elapsed(ms)" ] : u32.at INDEX_NOW
            tickCount : u32.at INDEX_HIT
            fps : u32.at INDEX_FPS
        }

        hist = hist.slice -5

        console.warn fill
        console.table hist
        console.table dumpArray

