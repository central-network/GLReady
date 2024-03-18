import "./ptr_self.coffee"

LE = ! new Uint8Array( Float32Array.of( 1 ).buffer )[ 0 ]
OBJECTS = [,]
SYM_LOOP = Symbol.iterator

###
    CoffeeScript	JavaScript
    is	            ===
    isnt	        !==
    not	            !
    and	            &&
    or	            ||
    true, yes, on	true
    false, no, off 	false
    @, this	        this
    a in b	        [].indexOf.call(b, a) >= 0
    a of b	        a in b
    for a from b	for (a of b)
    a ** b	        a ** b
    a // b	        Math.floor(a / b)
    a %% b	        (a % b + b) % b

    <imporssible>   to ->
    [
        first,      <
        chars...,   impossible
        close       >
    ] = tag.split("")


 |- if  this.studyingEconomics
 |___   buy()  while supply > demand
    |   sell() until supply > demand
    |
    |
    '-> if (this.studyingEconomics) {
            while (supply > demand) {
                buy();
            }
            while (!(supply > demand)) {
                sell();
            }
        }

###

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

KEYED = {}
KEYEX = 0 : new (class NONE extends Number) 0

do -> for k , v of WebGL2RenderingContext then KEYED[ v ] =
    eval "new (class #{k} extends Number {})(#{v})"

Object.defineProperty Object, "define", value : ->
    try [ proto, prop, desc ] = [ ...arguments ]
    if desc then @define proto , [ prop ] : desc
    else @defineProperties proto , prop , ( desc )
    return proto

Object.defineProperty Object, "symbol", value : ->
    try [ proto, prop, desc ] = [ ...arguments ]
    if desc then @symbol proto , [ prop ] : desc
    else for key , desc of prop
        symbol = switch key
            when "primitive" then Symbol.toPrimitive
            when "instance" then Symbol.hasInstance
            when "iterate" then Symbol.iterator
            else Symbol[ key ]
        try @define proto , symbol , desc
        catch fail then throw fail
    return proto

Object.defineProperty Object, "hidden", value : ->

    try [ proto , ...props ] = [ ...arguments ]
    finally desc = configurable : on
    for prop in props
        { get , set } = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf( proto:: ) , prop
        )

        @define proto::, prop, value : ( ( getter, setter ) -> ->
            return getter.call( this ) if ! arguments[0]
            setter.call this, arguments[0] ; return this
        )( get, set )

    proto  

Object.define Array::,

    sumAttrib : value : ->
        n = arguments[ s = 0 ]
        s += v for { [n]: v } in @ ; s

    getAttrib : value : ->
        [ func , value ] = arguments
        ( this . find (v) -> 0 is v[ func ]() - value )

Object.define DataView::,
    
    setObject : value : ( offset, object ) ->
        if -1 is i = OBJECTS.indexOf object
            i += OBJECTS.push object
            @setUint32 offset, i, LE
        OBJECTS[ i ]

    delObject : value : ( offset ###: number ### ) ->
        OBJECTS.splice offset, 1 ; 0

    getObject : value : ( offset ) ->
        return unless i = @getUint32 offset , LE
        unless o = OBJECTS[ i ]
            return OBJECTS[ i ] = proxy i unless window?
            return new Pointer i
        return o

    toPointer : value : ( offset, Prototype = Pointer ) ->
        new Prototype i if i = @getUint32 offset, LE

    keyUint16 : value : ( offset, extend = KEYEX ) ->
        extend[ v = @getUint16 offset, LE ] or KEYED[ v ] 

    keyUint32 : value : ( offset, extend = KEYEX ) ->
        extend[ v = @getUint32 offset, LE ] or KEYED[ v ] 

export class Vector extends Number

export class Angle3 extends Vector

export class Vertex extends Vector

export class Scale3 extends Vector

export class Color4 extends Number

export class Color4Number  extends Number

export class OffsetPointer extends Number

Object.define OffsetPointer,

    typedArray      : value : Float32Array

Object.define OffsetPointer::,

    getArrayLength  : value : ->
        @getLinkedNode().getTypedLength() -
        @getLinkedNode().constructor.LENGTH_OF_POINTER

    getTypedArray   : value : ->
        @getLinkedNode().subarray -@getArrayLength()

    getByteOffset   : value : ->
        @getLinkedNode().getByteOffset()

    getLinkedNode   : value : ->
        new Pointer this * 1

    getBufferOffset : value : ->
        @getLinkedNode().getBufferOffset()

Object.define OffsetPointer::,

    link            : get   : OffsetPointer::getLinkedNode          

Object.define Vector,

    byteLength      : value : 4 * 3

    length          : value : 3

Object.symbol Vector::,

    iterate         : value : ->
        length = i = -4 + this
        offset = Uint32Array.of(
            length += 4 , length += 4,
            length += 4
        ).reverse()

        next : =>
            value = if done = length is i then @
            else dvw.getFloat32 i = 4 + i , LE
            return { done , value }  
    
Object.define Vector::,

    getTypedArray   : value   : -> new Float32Array dvw.buffer, this, 3

    set             : value   : -> @getTypedArray().set( [ ...arguments ].flat() ) ; this

Object.define Vector::,

    getX            : value : -> dvw.getFloat32 this     , LE

    getY            : value : -> dvw.getFloat32 this + 4 , LE
    
    getZ            : value : -> dvw.getFloat32 this + 8 , LE
    
    setX            : value : -> dvw.setFloat32 this     , arguments[0], LE

    setY            : value : -> dvw.setFloat32 this + 4 , arguments[0], LE
    
    setZ            : value : -> dvw.setFloat32 this + 8 , arguments[0], LE

Object.define Vector::,

    x               : get   : Vector::getX , set : Vector::setX

    y               : get   : Vector::getY , set : Vector::setY
    
    z               : get   : Vector::getZ , set : Vector::setZ

export class RGBA extends Uint8Array

    Object.define RGBA::,

        getRed          : value : -> this[0]

        setRed          : value : -> this[0] = arguments[0]

        getGreen        : value : -> this[1]

        setGreen        : value : -> this[1] = arguments[0]

        getBlue         : value : -> this[2]

        setBlue         : value : -> this[2] = arguments[0]

        getAlpha        : value : -> this[3]

        setAlpha        : value : -> this[3] = arguments[0]

    Object.define RGBA::,

        red             : get   : RGBA::getRed      , set : RGBA::setRed

        green           : get   : RGBA::getGreen    , set : RGBA::setGreen
        
        blue            : get   : RGBA::getBlue     , set : RGBA::setBlue

        alpha           : get   : RGBA::getAlpha    , set : RGBA::setAlpha

Object.define Color4,

    byteLength          : value : 4 * 4

    length              : value : 4

    fromAny             : value : ( any ) ->
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
    
Object.symbol Color4::,

    iterate             : value : ->
        length = i = -4 + this
        offset = Uint32Array.of(
            length += 4 , length += 4,
            length += 4 , length += 4
        ).reverse()

        next : =>
            value = if done = length is i then @
            else dvw.getFloat32 i = 4 + i , LE
            return { done , value }  

Object.define Color4::,
    
    getTypedArray   : value : -> new Float32Array dvw.buffer, this, 4

    set             : value : ->
        if  arguments[0] and !arguments[0].map and arguments.length is 1
            dv = new DataView new ArrayBuffer 4
            dv . setUint32 0, argv, LE

            i8 = new Uint8Array dv.buffer
            i8.reverse() if LE 
            di = 255
            color = Float32Array.of ...[ ...i8 ].map (n) -> n/di

        else
            color = [ ...arguments ].flat().slice(0, 4)

        [ r, g, b, a ] = color

        if (r > 1) or (g > 1) or (b > 1) or (a > 1)
            a = 0xff if isNaN a ; a /= 0xff 
            @setRed(r / 0xff).setGreen(g / 0xff).setBlue(b / 0xff).setAlpha( a )

        else
        if ( 0 <= r <= 1 ) or ( 0 <= g <= 1 ) or ( 0 <= b <= 1 )
            a = 1 if isNaN a
            @setRed(r).setGreen(g).setBlue(b).setAlpha(a)

        this

    getRed          : value : -> dvw.getFloat32 this      , LE

    getGreen        : value : -> dvw.getFloat32 this +  4 , LE
    
    getBlue         : value : -> dvw.getFloat32 this +  8 , LE
    
    getAlpha        : value : -> dvw.getFloat32 this + 12 , LE
    

    setRed          : value : -> dvw.setFloat32 this      , arguments[0], LE ; @

    setGreen        : value : -> dvw.setFloat32 this +  4 , arguments[0], LE ; @
    
    setBlue         : value : -> dvw.setFloat32 this +  8 , arguments[0], LE ; @

    setAlpha        : value : -> dvw.setFloat32 this + 12 , arguments[0], LE ; @

    toString        : value : -> @hex

Object.define Color4::,

    f32 : get : ->
        new Float32Array dvw.buffer, this, 4

    ui8 : get : ->
        Uint8Array.from [ ...@f32 ].map (v) -> v * 0xff

    hex : get : ->
        "0x" + [ ...@ui8 ].map (n) ->
            n.toString(16).padStart(2,0)
        .join ""

    css : get : ->
        [ r, g, b, a ] = @ui8
        ( a = ( a / 2.55 ).toFixed(2) )
        "rgba( #{r} #{g} #{b} / #{a}% )"

    u32 : get : ->
        parseInt @hex, 16

    rgb : get : -> 
        RGBA.of(
            @getRed()   * 0xff,
            @getGreen() * 0xff,
            @getBlue()  * 0xff,
            @getAlpha() * 0xff,
        )

Object.define Color4Number::,

    f32 : get : ->
        dv = new DataView new ArrayBuffer 4
        dv . setUint32 0, this, LE

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

    hex : Object.getOwnPropertyDescriptor Color4::, "hex"

    css : Object.getOwnPropertyDescriptor Color4::, "css"

    Object.define Number::,

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
OFFSET_PROTOCLASS   = 4 * INDEX_PROTOCLASS = 3
OFFSET_LINKEDNODE   = 4 * INDEX_LINKEDNODE = 4
OFFSET_PARENT_PTR   = 4 * INDEX_PARENT_PTR = 5
OFFSET_RESVERVEDS   = 4 * 6

OFFSET_PTRCLASS_0   = 4 * 6
OFFSET_PTRCLASS_1   = 4 * 7
OFFSET_PTRCLASS_2   = 4 * 8
OFFSET_PTRCLASS_3   = 4 * 9
OFFSET_PTRCLASS_4   = 4 * 10

POINTER_PROTOTYPE   = [,]

export class Pointer        extends Number

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

                unless proto = POINTER_PROTOTYPE[ @getProtoClass() ]
                    throw [ "PROTOCLASS_NOT_FOUND", this ]

                Object.setPrototypeOf this, proto::
        else
            byteLength = @constructor.byteLength
            
            dvw.setUint32 this + OFFSET_BYTELENGTH, byteLength, LE
            dvw.setUint32 this + OFFSET_PROTOCLASS, @constructor.protoClass, LE
            dvw.setUint32 this + OFFSET_BYTEOFFSET, malloc( byteLength ), LE
                
            this.init()

    @from       : ->
        arr = [ arguments... ].flat() 
        ptr = @malloc( @byteLength + @BYTES_PER_ELEMENT * arr.length )
        ptr .subarray( @byteLength / @BYTES_PER_ELEMENT ) . set arr
        ptr

    @malloc     : ( byteLength ) ->
        ptrAllocAt = palloc BYTES_PER_POINTER
        byteOffset = malloc byteLength + ( 4 - byteLength % 4 )
        protoClass = this . protoClass

        dvw.setUint32 ptrAllocAt + OFFSET_BYTELENGTH, byteLength, LE
        dvw.setUint32 ptrAllocAt + OFFSET_PROTOCLASS, protoClass, LE
        dvw.setUint32 ptrAllocAt + OFFSET_BYTEOFFSET, byteOffset, LE

        new this( ptrAllocAt ).init()

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

    add         : -> arguments[ 0 ].setParentPtri this
        
    set         : -> @getTypedArray().set arguments... ; this

    subarray    : -> @getTypedArray().subarray arguments...

    slice       : -> @getTypedArray().slice arguments...

export class Matrix4        extends Pointer

export class WorkerPointer  extends Pointer

Object.symbol Pointer::,

    iterate             : value : ->

        obj = this
        min = @getByteOffset()
        len = @getByteLength()
        max = min + len

        [ stride , reader ] = switch this.constructor.typedArray
            when Int32Array     then [ 4, DataView::getInt32 ]
            when Uint8Array     then [ 1, DataView::getUint8 ]
            when Uint16Array    then [ 2, DataView::getUint16 ]
            when Uint32Array    then [ 4, DataView::getUint32 ]
            when Float32Array   then [ 4, DataView::getFloat32 ]
            else throw [ "UNDEFINED_ITERATOR_FOR_POINTER", this ]

        i = min - stride

        next : ->
            value = if done = max < i then obj
            else reader.call( dvw , i += stride , LE )
            return { done , value }

Object.define Pointer,

    registerClass   : value : -> ( @protoClass or= -1 + POINTER_PROTOTYPE.push this  ); @

    setDataBuffer   : value : -> [ @prototype.buffer ] = arguments ; @

    removePointer   : value : -> ( arguments[ 0 ].delParentPtri() ); this    
    
    BYTES_PER_ELEMENT : get : -> ( this.typedArray . BYTES_PER_ELEMENT )

    LENGTH_OF_POINTER : get : -> ( this.byteLength / this.BYTES_PER_ELEMENT )  

Object.define Pointer::,

    getNextChild    : value : ->

        parent = this * 1
        finish = Atomics.load u32, INDEX_PTR

        [   offset = POINTERS_BYTEOFFSET,
            stride = OFFSET_PARENT_PTR ] = arguments

        offset += stride

        while finish > offset += BYTES_PER_POINTER
            unless parent - dvw.getUint32 offset, LE
                return new Pointer offset - stride

        null  

    getHeader       : value : -> dvw.getUint32 this + arguments[0] * 4, LE    

    getTypedArray   : value : -> new this.constructor.typedArray @buffer, @getByteOffset(), @getTypedLength()
    
    getTypedLength  : value : -> @getByteLength() / @constructor.typedArray . BYTES_PER_ELEMENT

    findAllLinks    : value : -> @findAllChilds OFFSET_LINKEDNODE

    findAllChilds   : value : ->
        stride = arguments[0] or OFFSET_PARENT_PTR
        offset = POINTERS_BYTEOFFSET + stride
        finish = Atomics.load u32, INDEX_PTR
        number = this * 1
        childs = []

        while offset < finish
            if -0 is number - dvw.getUint32 offset, LE
                childs.push new Pointer offset - stride
            offset += BYTES_PER_POINTER

        childs

    getAllHeaders   : value : -> [ 0 ... LENGTH_OF_POINTER ].map @getHeader.bind this    
    
    setAllHeaders   : value : -> @getAllHeaders().set arguments[0]

    getByteOffset   : value : -> (arguments[0] or 0) + dvw.getUint32 this + OFFSET_BYTEOFFSET, LE

    setByteOffset   : value : -> dvw.setUint32 this + OFFSET_BYTEOFFSET, arguments[0], LE ; @

    getByteLength   : value : -> dvw.getUint32 this + OFFSET_BYTELENGTH, LE

    setByteLength   : value : -> dvw.setUint32 this + OFFSET_BYTELENGTH, arguments[0], LE ; @

    getProtoClass   : value : -> dvw.getUint32 this + OFFSET_PROTOCLASS, LE

    setProtoClass   : value : -> dvw.setUint32 this + OFFSET_PROTOCLASS, arguments[0], LE ; @
    
    getLinkedPtri   : value : -> dvw.getUint32 this + OFFSET_LINKEDNODE, LE
    
    setLinkedPtri   : value : -> dvw.setUint32 this + OFFSET_LINKEDNODE, arguments[0], LE
    
    getLinkedNode   : value : -> dvw.getObject this + OFFSET_LINKEDNODE

    setLinkedNode   : value : -> dvw.setObject this + OFFSET_LINKEDNODE, arguments[0]
    
    delLinkedNode   : value : -> dvw.delObject this + OFFSET_LINKEDNODE

    getParentPtri   : value : -> dvw.getUint32 this + OFFSET_PARENT_PTR, LE

    setParentPtri   : value : -> dvw.setUint32 this + OFFSET_PARENT_PTR, arguments[0], LE ; arguments[0]
    
    delParentPtri   : value : -> dvw.setUint32 this + OFFSET_PARENT_PTR, @delParentPtrO(), LE

    delParentPtrO   : value : -> dvw.delObject this . getParentPtri() + OFFSET_LINKEDNODE ; 0

    getParentPtrO   : value : -> dvw.getObject this . getParentPtri() + OFFSET_LINKEDNODE

    setParentPtrO   : value : -> dvw.setObject this + OFFSET_PARENT_PTR, arguments[0]

    getParentPtrP   : value : -> dvw.toPointer this + OFFSET_PARENT_PTR, arguments[0] or Pointer
    
    ptrLinkedNode   : value : -> new Pointer dvw.getUint32 this + OFFSET_LINKEDNODE, LE

    ptrParentNode   : value : -> new Pointer dvw.getUint32 this + OFFSET_PARENT_PTR, LE

    ptrResvUint32   : value : -> new Pointer dvw.getUint32 this + OFFSET_RESVERVEDS + arguments[0] * 4, LE
    
    keyResvUint32   : value : -> dvw.keyUint32 this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1]
    
    getResvUint32   : value : -> dvw.getUint32 this + OFFSET_RESVERVEDS + arguments[0] * 4, LE
    
    setResvUint32   : value : -> dvw.setUint32 this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1], LE ; arguments[ 1 ]
    
    addResvUint32   : value : -> dvw.setUint32 this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1] + o = @getResvUint32( arguments[0] ), LE ; o
    
    keyResvUint16   : value : -> dvw.keyUint16 this + OFFSET_RESVERVEDS + arguments[0] * 2, arguments[1]
    
    getResvUint16   : value : -> dvw.getUint16 this + OFFSET_RESVERVEDS + arguments[0] * 2, LE
    
    setResvUint16   : value : -> dvw.setUint16 this + OFFSET_RESVERVEDS + arguments[0] * 2, arguments[1], LE
    
    addResvUint16   : value : -> dvw.setUint16 this + OFFSET_RESVERVEDS + arguments[0] * 2, arguments[1] + o = @getResvUint16( arguments[0] ), LE ; o

Object.define Pointer::,

    getTArray       : value : ->
        [ offset, byteLength = @getByteLength(), TypedArray = @constructor.typedArray ] = arguments
        
        byteOffset  = @getByteOffset offset
        length      = byteLength / TypedArray . BYTES_PER_ELEMENT

        new TypedArray( @buffer, byteOffset, length )

    setTArray       : value : ->
        [ offset, value, TypedArray = @constructor . typedArray ] = arguments
        ( @getTArray offset, @getByteLength(), TypedArray ).set value ; this

    getFloat32      : value : -> dvw.getFloat32 @getByteOffset( arguments[0] ), LE
        
    setFloat32      : value : -> dvw.setFloat32 @getByteOffset( arguments[0] ), arguments[1], LE ; arguments[1]

    getUint8        : value : -> dvw.getUint8   @getByteOffset( arguments[0] )
    
    setUint8        : value : -> dvw.setUint8   @getByteOffset( arguments[0] ), arguments[1] ; arguments[1]

    keyStatic       : value : -> KEYED[ this ]

    keyUint16       : value : -> dvw.keyUint16  @getByteOffset( arguments[0] ), arguments[1] , arguments[2]

    getUint16       : value : -> dvw.getUint16  @getByteOffset( arguments[0] ), LE
    
    setUint16       : value : -> dvw.setUint16  @getByteOffset( arguments[0] ), arguments[1], LE ; arguments[1]

    getUint32       : value : -> dvw.getUint32  @getByteOffset( arguments[0] ), LE
    
    setUint32       : value : -> dvw.setUint32  @getByteOffset( arguments[0] ), arguments[1], LE ; arguments[1]
    
    addUint32       : value : -> dvw.setUint32  @getByteOffset( arguments[0] ), arguments[1] + ( v = @getUint32 arguments[0], LE ), LE ; v


    setArray3       : value : ->

        byteOffset = @getByteOffset( arguments[0] )

        unless isNaN value = arguments[1]
            x = y = z = value
        else if value[ Symbol.iterator ]
            [ x = 0, y = 0, z = 0 ] = value
        else x = y = z = parseFloat( value ) or 0

        console.warn { x, y, z }

        dvw.setFloat32 byteOffset      , x , LE
        dvw.setFloat32 byteOffset  + 4 , y , LE
        dvw.setFloat32 byteOffset  + 8 , z , LE
        
        this

    setArray4       : value : ->

        byteOffset = @getByteOffset( arguments[0] )

        unless isNaN value = arguments[1]
            x = y = z = w = value
        else if value[ Symbol.iterator ]
            [ x = 0, y = 0, z = 0, w = 1 ] = value
        else x = y = z = w = parseFloat( value ) or 1

        dvw.setFloat32 byteOffset      , x , LE
        dvw.setFloat32 byteOffset +  4 , y , LE
        dvw.setFloat32 byteOffset +  8 , z , LE
        dvw.setFloat32 byteOffset + 12 , w , LE
        
        this

    getString       : value : ->
        [ startOffset , lengthOffset ] = [ ...arguments ]
        ( startOffset = @getByteOffset startOffset )

        tarray = new Uint8Array @buffer, startOffset, @getByteLength()

        if !lengthOffset or !(length = @getUint16 lengthOffset, LE)
            for length in [ tarray.length .. 0 ]
                break if tarray[ length ] and length++
            
        new TextDecoder().decode tarray.slice 0, length

    setString       : value : ->
        [ startOffset, stringSource, lengthOffset ] = [ ...arguments ]

        source = new TextEncoder().encode stringSource 
        tarray = new Uint8Array @buffer, @getByteOffset(), @getByteLength()
        
        tarray.set source, startOffset
        @setUint16 lengthOffset, source.byteLength, LE if lengthOffset

        ; @

Object.define Pointer::,

    length          : get   : Pointer::getTypedLength

    array           : get   : Pointer::getTypedArray

    children        : get   : Pointer::findAllChilds

    headers         : get   : Pointer::getAllHeaders , set : Pointer::setAllHeaders

    byteOffset      : get   : Pointer::getByteOffset , set : Pointer::setByteOffset
    
    byteLength      : get   : Pointer::getByteLength , set : Pointer::setByteLength
    
    protoClass      : get   : Pointer::getProtoClass , set : Pointer::setProtoClass

    link            : get   : Pointer::getLinkedNode , set : Pointer::setLinkedNode
    
    parent          : get   : Pointer::getParentPtrP , set : Pointer::setParentPtri

Object.define Matrix4.registerClass(),

    byteLength      : value : 4 * 16

    typedArray      : value : Float32Array

    identity        : value : Float32Array.of(
        1,  0,  0,  0,
        0,  1,  0,  0,
        0,  0,  1,  0,
        0,  0,  0,  1        
    )

    multiply        : value : ->
        [ a, b ] = arguments

        a00 = a[0 * 4 + 0]; a01 = a[0 * 4 + 1]; a02 = a[0 * 4 + 2]; a03 = a[0 * 4 + 3]
        a10 = a[1 * 4 + 0]; a11 = a[1 * 4 + 1]; a12 = a[1 * 4 + 2]; a13 = a[1 * 4 + 3]
        a20 = a[2 * 4 + 0]; a21 = a[2 * 4 + 1]; a22 = a[2 * 4 + 2]; a23 = a[2 * 4 + 3] 
        a30 = a[3 * 4 + 0]; a31 = a[3 * 4 + 1]; a32 = a[3 * 4 + 2]; a33 = a[3 * 4 + 3]

        b00 = b[0 * 4 + 0]; b01 = b[0 * 4 + 1]; b02 = b[0 * 4 + 2]; b03 = b[0 * 4 + 3] 
        b10 = b[1 * 4 + 0]; b11 = b[1 * 4 + 1]; b12 = b[1 * 4 + 2]; b13 = b[1 * 4 + 3] 
        b20 = b[2 * 4 + 0]; b21 = b[2 * 4 + 1]; b22 = b[2 * 4 + 2]; b23 = b[2 * 4 + 3] 
        b30 = b[3 * 4 + 0]; b31 = b[3 * 4 + 1]; b32 = b[3 * 4 + 2]; b33 = b[3 * 4 + 3]
        
        Float32Array.of(
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        )

    xRotation       : value : ->

        c = Math.cos arguments[0] or 0
        s = Math.sin arguments[0] or 0

        Float32Array.of(
             1,  0,  0,  0,
             0,  c,  s,  0,
             0, -s,  c,  0,
             0,  0,  0,  1,
        )

    yRotation       : value : ->
        c = Math.cos arguments[0] or 0
        s = Math.sin arguments[0] or 0
        
        Float32Array.of(
             c,  0, -s,  0,
             0,  1,  0,  0,
             s,  0,  c,  0,
             0,  0,  0,  1,
        )

    zRotation       : value : ->
        c = Math.cos arguments[0] or 0
        s = Math.sin arguments[0] or 0
        
        Float32Array.of(
             c,  s,  0,  0,
            -s,  c,  0,  0,
             0,  0,  1,  0,
             0,  0,  0,  1,
        )   

    translation     : value : ->
        [ dx = 0, dy = 0, dz = 0 ] =
            if arguments[1] then arguments
            else arguments[0]

        Float32Array.of(
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
           dx, dy, dz,  1,
        )

    xTranslation    : value : ->
        Float32Array.of(
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
             arguments[0] or 0,  0,  0,  1,
        )

    yTranslation    : value : ->
        Float32Array.of(
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
             0, arguments[0] or 0,  0,  1,
        )

    zTranslation    : value : ->
        Float32Array.of(
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
             0,  0, arguments[0] or 0,  1,
        )

    scalation       : value : ->
        [ sx, sy, sz ] =
            if arguments[1] then arguments
            else if arguments[0] . slice then arguments[0]
            else [ arguments[0] , arguments[0] , arguments[0] ]

        Float32Array.of(
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        )

    xScale          : value : ->
        Float32Array.of(
            arguments[0] or 0,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            0,  0,  0,  1
        )

    yScale          : value : ->
        Float32Array.of(
            1,  0,  0,  0,
            0, arguments[0] or 0,  0,  0,
            0,  0,  1,  0,
            0,  0,  0,  1
        )        

    zScale          : value : ->
        Float32Array.of(
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0, arguments[0] or 0,  0,
            0,  0,  0,  1
        )

Object.define Matrix4::,

    getIsUpdated    : value : -> @getResvUint32 0
    
    setIsUpdated    : value : -> @setResvUint32 0, arguments[0] ; this

Object.define Matrix4::,

    rotateX         : value : -> @multiply @slice(), Matrix4.xRotation arguments[0]

    rotateY         : value : -> @multiply @slice(), Matrix4.yRotation arguments[0]

    rotateZ         : value : -> @multiply @slice(), Matrix4.zRotation arguments[0]

    translateX      : value : -> @multiply @slice(), Matrix4.xTranslation arguments[0]
    
    translateY      : value : -> @multiply @slice(), Matrix4.yTranslation arguments[0]

    translateZ      : value : -> @multiply @slice(), Matrix4.zTranslation arguments[0]

    scaleX          : value : -> @multiply @slice(), Matrix4.xScale arguments[0]
    
    scaleY          : value : -> @multiply @slice(), Matrix4.yScale arguments[0]

    scaleZ          : value : -> @multiply @slice(), Matrix4.zScale arguments[0]

Object.define Matrix4::,

    reset           : value : -> @set Matrix4.identity

    apply           : value : -> arguments[0].set Matrix4.multiply arguments[0], @slice() ; arguments[0]

    multiply        : value : -> @set Matrix4.multiply @slice(), arguments[0]

    translate       : value : -> @multiply Matrix4.translation arguments...

    scale           : value : -> @multiply Matrix4.scalation arguments...

    rotate          : value : ->
        [ rx, ry, rz ] =
            if arguments[1] then arguments
            else arguments[0]

        this . xRotate rx if rx
        this . yRotate ry if ry
        this . yRotate rz if rz

        this

Object.define Matrix4::,

    isUpdated       : get   : Matrix4::getIsUpdated , set   : Matrix4::setIsUpdated

Object.define WorkerPointer.registerClass(),
    
    byteLength      : value : 4 * 64

Object.define WorkerPointer::,

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

Object.define WorkerPointer::,
    
    getOnlineState  : value : -> @getResvUint32 0

    setOnlineState  : value : -> @setResvUint32 0, arguments[0] ; this

Object.define WorkerPointer::,

    onlineState     :
        get : WorkerPointer::getOnlineState,
        set : WorkerPointer::setOnlineState

if window? then Pointer.setBuffer()

if window?

    ival = 0

    document?.body.setAttribute(
        "title",
        "Click body to activate debugger."
    )
    
    document?.body.ondblclick = ->

        if ival
            ival = clearInterval ival
        else ival = setInterval dump, 90

    document?.body.onclick = ->
        dump clearInterval ival
        
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
                ptr         : child * 1  
                object      : child
                parent      : child.parent * 1 or null
                type        : child.type
                classId     : child.getProtoClass()
                link        : child.getLinkedNode()
                offset      : child.getByteOffset()
                allocated   : child.getByteLength(),
                array       : child.getTypedArray()
                childs      : child.children.length or null
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

        console.warn fill if ival
        console.table hist
        console.table dumpArray

export default Pointer