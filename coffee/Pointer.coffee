BUFFER          = null
DATAVIEW        = null
ATOMICU32       = null

OFFSET_BYTEOFFSET            = 0 * 4
OFFSET_BYTELENGTH            = 1 * 4
OFFSET_BYTEFINISH            = 2 * 4
OFFSET_LENGTH                = 3 * 4
OFFSET_BEGIN                 = 5 * 4
OFFSET_END                   = 6 * 4
OFFSET_TYPED_ARRAY_ID        = 7 * 4
OFFSET_BYTES_PER_ELEMENT     = 8 * 4

TypedArraysIds =
    [ Float32Array ] : 1
    [ Uint32Array ] : 2
    [ Int32Array ] : 3

    [ 1 ] : Float32Array
    [ 2 ] : Uint32Array
    [ 3 ] : Int32Array

export length               = 16
export byteLength           = length * 4
export littleEndian         = yes

export class Pointer extends Number

    @byteLength     : byteLength
    @TypedArray     : Float32Array
    
    [ Symbol.iterator ] : ( i = -1 ) ->
        yield @at( i ) while i++ < @length

    constructor     : ( pointerOffset ) ->
        if  isNaN super pointerOffset
            return malloc @constructor.byteLength, @constructor
        @init()

    init            : -> this

    Object.defineProperties this::,
        byteOffset  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTEOFFSET
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTEOFFSET, arguments[ 0 ]
            
        byteLength  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTELENGTH
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTELENGTH, arguments[ 0 ]
                        
        byteFinish  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTEFINISH
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTEFINISH, arguments[ 0 ]
            
        length      :
            get     : -> DATAVIEW.getUint32 this + OFFSET_LENGTH
            set     : -> DATAVIEW.setUint32 this + OFFSET_LENGTH, arguments[ 0 ]
            
        begin       :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BEGIN
            set     : -> DATAVIEW.setUint32 this + OFFSET_BEGIN, arguments[ 0 ]
            
        end         :
            get     : -> DATAVIEW.getUint32 this + OFFSET_END
            set     : -> DATAVIEW.setUint32 this + OFFSET_END, arguments[ 0 ]

        TYPED_ARRAY_ID :
            get     : -> DATAVIEW.getUint32 this + OFFSET_TYPED_ARRAY_ID
            set     : -> DATAVIEW.setUint32 this + OFFSET_TYPED_ARRAY_ID, arguments[ 0 ]            

        BYTES_PER_ELEMENT :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTES_PER_ELEMENT
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTES_PER_ELEMENT, arguments[ 0 ]            


    Object.defineProperties this::,
        TypedArray  : get : -> TypedArraysIds[ @TYPED_ARRAY_ID ] or @constructor.TypedArray
        array       : get : -> new this.TypedArray BUFFER, @byteOffset, @length

    updatePointer   : ( TypedArray = @TypedArray ) ->
        @TYPED_ARRAY_ID     = TypedArraysIds[ TypedArray ]
        @BYTES_PER_ELEMENT  = TypedArray.BYTES_PER_ELEMENT

        @byteFinish = @byteOffset + @byteLength

        @length     = @byteLength / @BYTES_PER_ELEMENT
        @begin      = @byteOffset / @BYTES_PER_ELEMENT
        @end        = @begin + @length
        
        @init() ; @

    getUint8        : ( byteOffset ) ->
        DATAVIEW.getUint8 @byteOffset + byteOffset

    setUint8        : ( byteOffset, value ) ->
        DATAVIEW.setUint8 @byteOffset + byteOffset, value

    subUint8        : ( byteOffset, length ) ->
        new Uint8Array BUFFER, @byteOffset + byteOffset, length

    getInt32        : ( byteOffset ) ->
        DATAVIEW.getInt32 @byteOffset + byteOffset, littleEndian

    setInt32        : ( byteOffset, value ) ->
        DATAVIEW.setInt32 @byteOffset + byteOffset, value, littleEndian

    subInt32        : ( byteOffset, length ) ->
        new Int32Array BUFFER, @byteOffset + byteOffset, length

    getUint32       : ( byteOffset ) ->
        DATAVIEW.getUint32 @byteOffset + byteOffset, littleEndian

    setUint32       : ( byteOffset, value ) ->
        DATAVIEW.setUint32 @byteOffset + byteOffset, value, littleEndian

    subUint32       : ( byteOffset, length ) ->
        new Uint32Array BUFFER, @byteOffset + byteOffset, length

    getFloat32      : ( byteOffset ) ->
        DATAVIEW.getFloat32 @byteOffset + byteOffset, littleEndian

    setFloat32      : ( byteOffset, value ) ->
        DATAVIEW.setFloat32 @byteOffset + byteOffset, value, littleEndian

    subFloat32      : ( byteOffset, length ) ->
        new Float32Array BUFFER, @byteOffset + byteOffset, length

    erase           : ( byteOffset, byteLength ) ->
        @subUint8( byteOffset, byteLength ).fill( 0 ) ; @

    fill            : ->
        @array.fill ...arguments ; @

    subarray        : ->
        @array.subarray ...arguments

    set             : ->
        @array.set ...arguments ; @

    at              : ->
        @array.at ...arguments

export default Pointer

self.memory = ( buffer ) ->
    BUFFER       = buffer
    DATAVIEW     = new DataView buffer
    ATOMICU32    = new Uint32Array buffer

    Object.defineProperties Pointer::,
        buffer : value : buffer

    Atomics.or ATOMICU32, 1, 4 * 50000
    Atomics.or ATOMICU32, 0, 4 * 4

    this

self.malloc = ( allocLength, Ptr = Pointer ) ->
    ptr = new Ptr Atomics.add ATOMICU32, 0, byteLength

    ptr.byteOffset  = Atomics.add ATOMICU32, 1, allocLength 
    ptr.byteLength  = allocLength

    ptr.updatePointer()

self.realloc = ( allocOffset, allocLength, Ptr = Pointer ) ->
    ptr = new Ptr Atomics.add ATOMICU32, 0, byteLength

    ptr.byteOffset  = allocOffset
    ptr.byteLength  = allocLength

    ptr.updatePointer()
