export BUFFER   = null
export DATAVIEW = null
export U32ARRAY = null

INDEX_BYTEOFFSET             =  0
INDEX_BYTELENGTH             =  1
INDEX_PTRCLASSID             =  2
INDEX_LENGTH                 =  3
INDEX_BEGIN                  =  5
INDEX_END                    =  6
INDEX_TYPED_ARRAY_ID         =  7
INDEX_BYTES_PER_ELEMENT      =  8
INDEX_PTR_PARENT             =  9
INDEX_PTR_CLASS_ID           = 10

OFFSET_BYTEOFFSET            =  0 * 4
OFFSET_BYTELENGTH            =  1 * 4
OFFSET_PTRCLASSID            =  2 * 4
OFFSET_LENGTH                =  3 * 4
OFFSET_BEGIN                 =  5 * 4
OFFSET_END                   =  6 * 4
OFFSET_PTR_PARENT            =  7 * 4
OFFSET_PTR_OBJECT            =  8 * 4

export OFFSET_OBJECT_0       =  9 * 4
export OFFSET_OBJECT_1       = 10 * 4
export OFFSET_OBJECT_2       = 11 * 4
export OFFSET_OBJECT_3       = 12 * 4
export OFFSET_OBJECT_4       = 13 * 4
export OFFSET_OBJECT_5       = 14 * 4
export OFFSET_OBJECT_6       = 15 * 4


POINTERS_BEGIN               = 8
POINTER_LENGTH               = 16
POINTER_BYTELENGTH           =  4 * POINTER_LENGTH

PTR_PROTOTYPE = [ null ]
OBJECTS_ARRAY = {}
OBJECTS = [ null ]
CLASS_ID = [,]

OBJECTS.index = ( o ) ->
    for p , i in this
        unless p instanceof Number
            return i if p is o
        else if 0 is p - o then return i 
    return -1 + @push o

TypedArraysIds =
    [ Float32Array ] : 1
    [ Uint32Array ] : 2
    [ Int32Array ] : 3

    [ 1 ] : Float32Array
    [ 2 ] : Uint32Array
    [ 3 ] : Int32Array

export length     = 16
export byteLength = length * 4
export LE         = yes
export $ptr       = '∆'

vals = Object.values WebGL2RenderingContext
keys = Object.keys WebGL2RenderingContext
vars = {}

for val, i in vals
    key = keys.at i
    cls = eval("(class #{key} extends Number {})")
    vars[ val ] = new cls(val)

self.keyOf = ( val ) ->
    vars[ val ] or val

getCaller = ( val ) ->
    stack = new Error().stack.toString()#* 3 -> 2 -> 1 : fn.called
    [ , js, line ] = stack.split(/\n/g).at(3).split(":")
    line *= 1
    lines = (await (await fetch(js)).text()).split(/\n/g, line)
    for l in lines.slice( -10 )
        continue if /return|get|set/.test l
        continue unless l.match /\:/
        break if name = l.replace(/\W+/gui, "")
    cls = eval("(class #{name} extends Number {})")
    val = new cls val

export class Pointer extends Number

    @byteLength         : byteLength
    @TypedArray         : Uint32Array
    @BYTES_PER_ELEMENT  : 4

    [ Symbol.iterator ] : ( i = -1 ) ->
        yield @at( i ) while i++ < @length

    constructor     : ( offset = -1 ) ->
        if  0 > super offset 
            o = mallocAtomic @constructor.byteLength, @constructor
            p = new @constructor o ; p.init() ; return p

    @malloc         : ( byteLength ) ->
        mallocAtomic byteLength, this

    @maybePointer   : ( offset, pointer = this ) ->
        unless ptr = DATAVIEW.getUint32 pointer + offset
            DATAVIEW.setUint32 pointer + offset, ptr =
                mallocAtomic this.byteLength, pointer
                
        new this ptr

    init            : -> this

    Object.defineProperties this::,
        byteOffset  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTEOFFSET, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTEOFFSET, arguments[ 0 ], LE
            
        byteLength  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTELENGTH, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTELENGTH, arguments[ 0 ], LE
                
        classId     :
            get     : -> DATAVIEW.getUint32 this + OFFSET_PTRCLASSID, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_PTRCLASSID, arguments[ 0 ], LE
                        
        length      :
            get     : -> DATAVIEW.getUint32 this + OFFSET_LENGTH, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_LENGTH, arguments[ 0 ], LE
            
        begin       :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BEGIN, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_BEGIN, arguments[ 0 ], LE
            
        end         :
            get     : -> DATAVIEW.getUint32 this + OFFSET_END, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_END, arguments[ 0 ], LE

        parent      :
            get     : -> OBJECTS[ DATAVIEW.getUint32 this + OFFSET_PTR_PARENT, LE ]
            set     : -> DATAVIEW.setUint32 this + OFFSET_PTR_PARENT, arguments[0], LE

        object      :
            get     : -> OBJECTS[ DATAVIEW.getUint32 this + OFFSET_PTR_OBJECT, LE ]
            set     : -> DATAVIEW.setUint32 this + OFFSET_PTR_OBJECT, OBJECTS.index(arguments[0]), LE

        children    :
            get     : -> OBJECTS.filter ( obj ) => 0 is this - obj?.parent

        add         :
            value   : ( child ) ->
                unless child instanceof Number
                    OBJECTS.index child
                child.parent = OBJECTS.index this

        grow        :
            value   : ( byteLength ) ->
                [ begin, end, @byteLength, @byteOffset ] =
                    [ @begin, @end, byteLength, mallocAtomic byteLength, @constructor ]
            
                @reloadPointer()
                    .copyBytesFrom begin, end

        move        :
            value   : ( byteOffset ) ->

                [ begin, end, @byteOffset ] =
                    [ @begin, @end, byteOffset ]
                
                @reloadPointer()
                    .copyBytesFrom begin, end


    Object.defineProperties this,
        BYTES_PER_ELEMENT   : get : -> @TypedArray.BYTES_PER_ELEMENT

    Object.defineProperties this::,
        array               : get : -> new this.TypedArray BUFFER, @byteOffset, @length
        TypedArray          : get : -> @constructor.TypedArray
        BYTES_PER_ELEMENT   : get : -> @TypedArray.BYTES_PER_ELEMENT
        [ "∆" ]             : get : -> U32ARRAY.subarray this/4, this/4 + POINTER_LENGTH
    
    reloadPointer   : ->
        @length     = @byteLength / @BYTES_PER_ELEMENT
        @begin      = @byteOffset / @BYTES_PER_ELEMENT
        @end        = @begin + @length ; @

    copyBytesFrom   : ( begin, end ) ->
        U32ARRAY.copyWithin @begin, begin, end ; @

    getUint8        : ( byteOffset ) ->
        DATAVIEW.getUint8 @byteOffset + byteOffset

    setUint8        : ( byteOffset, value ) ->
        DATAVIEW.setUint8 @byteOffset + byteOffset, value ; value

    subUint8        : ( byteOffset, length ) ->
        new Uint8Array @buffer, @byteOffset + byteOffset, length

    getInt32        : ( byteOffset ) ->
        DATAVIEW.getInt32 @byteOffset + byteOffset, LE

    setInt32        : ( byteOffset, value ) ->
        DATAVIEW.setInt32 @byteOffset + byteOffset, value, LE ; value

    subInt32        : ( byteOffset, length ) ->
        new Int32Array @buffer, @byteOffset + byteOffset, length

    getUint32       : ( byteOffset ) ->
        DATAVIEW.getUint32 @byteOffset + byteOffset, LE

    keyUint32       : ( byteOffset ) ->
        keyOf DATAVIEW.getUint32 @byteOffset + byteOffset, LE

    setUint32       : ( byteOffset, value ) ->
        DATAVIEW.setUint32 @byteOffset + byteOffset, value, LE ; value

    getColor4       : ( byteOffset ) ->
        new Color4 DATAVIEW.getUint32 @byteOffset + byteOffset, LE

    setColor4       : ( byteOffset, value ) ->
        DATAVIEW.setUint32 @byteOffset + byteOffset, value, LE ; value

    subUint32       : ( byteOffset, length ) ->
        new Uint32Array @buffer, @byteOffset + byteOffset, length

    getFloat32      : ( byteOffset ) ->
        DATAVIEW.getFloat32 @byteOffset + byteOffset, LE

    setFloat32      : ( byteOffset, value ) ->
        DATAVIEW.setFloat32 @byteOffset + byteOffset, value, LE ; value

    subFloat32      : ( byteOffset, length ) ->
        new Float32Array @buffer, @byteOffset + byteOffset, length

    setObject       : ( byteOffset, object ) ->
        DATAVIEW.setUint32 @byteOffset + byteOffset, OBJECTS.index( object ), LE

    getObject       : ( byteOffset ) ->
        OBJECTS[ DATAVIEW.getUint32 @byteOffset + byteOffset, LE ]

    getHeader       : ( byteOffset, isObject ) ->
        value = DATAVIEW.getUint32 this + byteOffset, LE
        return value unless isObject ; OBJECTS[ value ]

    keyHeader       : ( byteOffset ) ->
        keyOf DATAVIEW.getUint32 this + byteOffset, LE

    setHeader       : ( byteOffset, value, isObject ) ->
        value = OBJECTS.index value if isObject
        DATAVIEW.setUint32 this + byteOffset, value, LE ; value

    erase           : ( byteOffset, byteLength ) ->
        @subUint8( byteOffset, byteLength ).fill( 0 ) ; @

    subarray        : -> @array.subarray( ...arguments )
    fill            : -> @array    .fill( ...arguments ); @
    map             : -> @array     .map( ...arguments )
    at              : -> @array      .at( ...arguments )
    set             : -> @array.set( [ ...arguments ].flat() ); @


Object.defineProperties DataView::,
    setObject : value : ( byteOffset, object, littleEndian = LE ) ->
        @setUint32 byteOffset, OBJECTS.index( object ), littleEndian ; object

    getObject : value : ( byteOffset, littleEndian = LE ) ->
        OBJECTS[ @getUint32 byteOffset, littleEndian ]

export class ObjectPointer extends Number

    @array : []
    @count : 0

    @of         : ( i ) -> @array[ i ]

    constructor : ( object, index = ++ObjectPointer.count ) ->
        ObjectPointer.array[ super index ] = object


export class IndexPointer extends Pointer

    Object.defineProperties this::,
        [ "begin" ]      : get : -> @parent . begin + ( this * @length )
        [ "end" ]        : get : -> @length + @begin
        [ "byteOffset" ] : get : -> @parent . byteOffset + ( this * @byteLength )
        [ "byteLength" ] : get : -> @constructor . byteLength
        [ "length" ]     : get : -> @byteLength / @BYTES_PER_ELEMENT        
        [ "parent" ]     : configurable: yes, writable: yes
        [ "children" ]   : configurable: yes
        [ $ptr ]         : configurable: yes

    @of : ( parent ) ->
        return Ptr if Ptr = parent[ @name ]

        count = parent.byteLength / @byteLength
        items = [ 0 ... count ]
        label = @name + "Elements"

        Object.defineProperties parent.constructor.prototype ,
            [ @name ]  : value  : Ptr = class at extends this
                parent : parent
                @at    : (i) ->
                    return new Ptr i unless i >= count
                    throw "Index is out of bounds #{i} of #{count}." 
            [ label ]  : get    : -> items.map Ptr.at 

        return Ptr
    
    Reflect.deleteProperty this, $ptr
    Reflect.deleteProperty this, 'children'

class Color4 extends Number
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


Object.defineProperties WebGL2RenderingContext,
    DEPTH_N_COLOR_BIT : value : (
        WebGL2RenderingContext.DEPTH_BUFFER_BIT |
        WebGL2RenderingContext.COLOR_BUFFER_BIT
    )

Object.defineProperties Float32Array::,
    toUint32        : value : ->
        new Uint32Array( Uint8Array.of(
            @at(0) * 0xff, @at(1) * 0xff, @at(2) * 0xff, @at(3) * 0xff
        ).buffer ).at( 0 )

    toRGBAHex       : value : ->
        "#" + [ ...new Uint8Array( [ ...this ].map (n) -> n * 255 ) ].map (n) ->
            n.toString(16).padStart(2,0)
        .join ""

    toRGBA255       : value : ->
        new Uint8Array( @toRGBA0x1().map (n) -> n * 255 )

    toRGBA0x1       : value : ->
        [ ...this ]

    toRGBAcss       : value : ->
        [ r, g, b, a ] = @toRGBA255()
        ( a = ( a / 2.55 ).toFixed(2) )
        "rgba( #{r} #{g} #{b} / #{a}% )"

Object.defineProperties Float32Array,
    fromUint32      : value : -> arguments[0].toFloat32Array()

Object.defineProperties Number::,
    toUint32Number  : value : ->
        
        new DataView buf = new ArrayBuffer 4
            .setUint32 0, this, LE

        parseInt "0x" + [ 
            ...new Uint8Array( buf )
        ].map( (m) -> m.toString(16).padStart(2, 0) ).join("")

    toFloat32Array  : value : ( normalized = yes )  ->
        dv = new DataView new ArrayBuffer 4
        dv.setUint32 0, this, LE

        i8 = new Uint8Array dv.buffer
        i8.reverse() if LE 

        di = 1
        di = 255 if normalized

        Float32Array.of ...[ ...i8 ].map (n) -> n/di

    toRGBA          : value : ->
        @toFloat32Array ...arguments


export default self.Pointer = Pointer

self.memory  = ( buffer ) ->
    BUFFER   = buffer
    DATAVIEW = new DataView buffer
    U32ARRAY = new Uint32Array buffer

    Object.defineProperties Pointer::,
        buffer : value : buffer

    Atomics.or U32ARRAY, 1, 4 * 50000
    Atomics.or U32ARRAY, 0, POINTERS_BEGIN

    this

self.alloc = ( allocByteLength ) ->
    Atomics.add U32ARRAY, 1, allocByteLength

self.palloc = ( allocByteOffset, allocByteLength, Ptr = Pointer ) ->
    ptr = new Ptr Atomics.add U32ARRAY, 0, POINTER_BYTELENGTH

    ptr.byteOffset = allocByteOffset
    ptr.byteLength = allocByteLength

    ptr.reloadPointer()

self.malloc = ( allocByteLength, Ptr = Pointer ) ->
    ptr = new Ptr Atomics.add U32ARRAY, 0, POINTER_BYTELENGTH

    ptr.byteOffset = Atomics.add U32ARRAY, 1, allocByteLength
    ptr.byteLength = allocByteLength

    ptr.reloadPointer()

self.mallocAtomic = ( allocByteLength, Ptr = Pointer ) ->
    iptr = .25 * Atomics.add U32ARRAY, 0, POINTER_BYTELENGTH
    BPel = Ptr.TypedArray.BYTES_PER_ELEMENT

    allocByteOffset = Atomics.add U32ARRAY, 1, allocByteLength
    allocByteFinish = allocByteOffset + allocByteLength

    Ptr.ClassId or= -1 + CLASS_ID.push Ptr

    Atomics.store U32ARRAY, iptr + INDEX_BYTEOFFSET , allocByteOffset
    Atomics.store U32ARRAY, iptr + INDEX_BYTELENGTH , allocByteLength
    Atomics.store U32ARRAY, iptr + INDEX_PTRCLASSID , Ptr.ClassId 
    Atomics.store U32ARRAY, iptr + INDEX_LENGTH     , allocByteLength / BPel
    Atomics.store U32ARRAY, iptr + INDEX_BEGIN      , allocByteOffset / BPel
    Atomics.store U32ARRAY, iptr + INDEX_END        , allocByteFinish / BPel

    new Ptr iptr * 4