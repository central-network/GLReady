BUFFER   = null
DATAVIEW = null
U32ARRAY = null


INDEX_BYTEOFFSET             =  0
INDEX_BYTELENGTH             =  1
INDEX_BYTEFINISH             =  2
INDEX_LENGTH                 =  3
INDEX_BEGIN                  =  5
INDEX_END                    =  6
INDEX_TYPED_ARRAY_ID         =  7
INDEX_BYTES_PER_ELEMENT      =  8
INDEX_PTR_PARENT             =  9
INDEX_PTR_CHILDREN           = 10

OFFSET_BYTEOFFSET            =  0 * 4
OFFSET_BYTELENGTH            =  1 * 4
OFFSET_BYTEFINISH            =  2 * 4
OFFSET_LENGTH                =  3 * 4
OFFSET_BEGIN                 =  5 * 4
OFFSET_END                   =  6 * 4
OFFSET_TYPED_ARRAY_ID        =  7 * 4
OFFSET_BYTES_PER_ELEMENT     =  8 * 4
OFFSET_PTR_PARENT            =  9 * 4
OFFSET_PTR_CHILDREN          = 10 * 4



POINTER_LENGTH               = 16
POINTER_BYTELENGTH           =  4 * POINTER_LENGTH

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

export class Pointer extends Number

    @byteLength     : byteLength
    @TypedArray     : Uint32Array
    @BYTES_PER_ELEMENT : 4
    
    [ Symbol.iterator ] : ( i = -1 ) ->
        yield @at( i ) while i++ < @length

    constructor     : ( offset = -1 ) ->
        if  0 > super offset then return new @constructor(
            mallocAtomic @constructor.byteLength
        )
        @init()

    init            : -> this

    Object.defineProperties this::,
        byteOffset  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTEOFFSET, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTEOFFSET, arguments[ 0 ], LE
            
        byteLength  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTELENGTH, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTELENGTH, arguments[ 0 ], LE
                        
        byteFinish  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_BYTEFINISH, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_BYTEFINISH, arguments[ 0 ], LE
            
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
            get     : -> DATAVIEW.getUint32 this + OFFSET_PTR_PARENT, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_PTR_PARENT, arguments[ 0 ], LE

        children    :
            get     : -> DATAVIEW.getUint32 this + OFFSET_PTR_CHILDREN, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_PTR_CHILDREN, arguments[ 0 ], LE

        getPointer  :
            value   : ( offset, Ptr ) ->
                new Ptr p if p = @getUint32 offset, LE

        setPointer  :
            value   : ( offset, ptr ) ->
                @setUint32 offset, ptr * 1, LE

        grow        :
            value   : ( byteLength ) ->
                [ begin, end, @byteLength, @byteOffset ] =
                    [ @begin, @end, byteLength, mallocAtomic byteLength ]
            
                @reloadPointer()
                    .copyBytesFrom begin, end

        move        :
            value   : ( byteOffset ) ->

                [ begin, end, @byteOffset ] =
                    [ @begin, @end, byteOffset ]
                
                @reloadPointer()
                    .copyBytesFrom begin, end


    Object.defineProperties this::,
        array               : get : -> new this.TypedArray BUFFER, @byteOffset, @length
        TypedArray          : get : -> @constructor.TypedArray
        BYTES_PER_ELEMENT   : get : -> @TypedArray.BYTES_PER_ELEMENT

    reloadPointer   : ->
        @byteFinish = @byteOffset + @byteLength

        @length     = @byteLength / @BYTES_PER_ELEMENT
        @begin      = @byteOffset / @BYTES_PER_ELEMENT

        @end        = @begin + @length ; @

    copyBytesFrom   : ( begin, end ) ->
        U32ARRAY.copyWithin @begin, begin, end ; @

    getUint8        : ( byteOffset ) ->
        DATAVIEW.getUint8 @byteOffset + byteOffset

    setUint8        : ( byteOffset, value ) ->
        DATAVIEW.setUint8 @byteOffset + byteOffset, value

    subUint8        : ( byteOffset, length ) ->
        new Uint8Array @buffer, @byteOffset + byteOffset, length

    getInt32        : ( byteOffset ) ->
        DATAVIEW.getInt32 @byteOffset + byteOffset, LE

    setInt32        : ( byteOffset, value ) ->
        DATAVIEW.setInt32 @byteOffset + byteOffset, value, LE

    subInt32        : ( byteOffset, length ) ->
        new Int32Array @buffer, @byteOffset + byteOffset, length

    getUint32       : ( byteOffset ) ->
        DATAVIEW.getUint32 @byteOffset + byteOffset, LE

    setUint32       : ( byteOffset, value ) ->
        DATAVIEW.setUint32 @byteOffset + byteOffset, value, LE

    subUint32       : ( byteOffset, length ) ->
        new Uint32Array @buffer, @byteOffset + byteOffset, length

    getFloat32      : ( byteOffset ) ->
        DATAVIEW.getFloat32 @byteOffset + byteOffset, LE

    setFloat32      : ( byteOffset, value ) ->
        DATAVIEW.setFloat32 @byteOffset + byteOffset, value, LE

    subFloat32      : ( byteOffset, length ) ->
        new Float32Array @buffer, @byteOffset + byteOffset, length

    erase           : ( byteOffset, byteLength ) ->
        @subUint8( byteOffset, byteLength ).fill( 0 ) ; @

    subarray        : -> @array.subarray( ...arguments )
    fill            : -> @array    .fill( ...arguments ); @
    set             : -> @array     .set( ...arguments ); @
    at              : -> @array      .at( ...arguments )


export default self.Pointer = Pointer

self.memory = ( buffer ) ->
    BUFFER   = buffer
    DATAVIEW = new DataView buffer
    U32ARRAY = new Uint32Array buffer

    Object.defineProperties Pointer::,
        buffer : value : buffer

    Atomics.or U32ARRAY, 1, 4 * 50000
    Atomics.or U32ARRAY, 0, 8

    this

self.alloc = ( allocLength ) ->
    Atomics.add U32ARRAY, 1, allocLength

self.palloc = ( allocOffset, allocLength, Ptr = Pointer ) ->
    ptr = new Ptr Atomics.add U32ARRAY, 0, POINTER_BYTELENGTH

    ptr.byteOffset = allocOffset
    ptr.byteLength = allocLength

    ptr.reloadPointer()

self.malloc = ( allocLength, Ptr = Pointer ) ->
    ptr = new Ptr Atomics.add U32ARRAY, 0, POINTER_BYTELENGTH

    
    ptr.byteOffset = Atomics.add U32ARRAY, 1, allocLength
    ptr.byteLength = allocLength

    ptr.reloadPointer()

self.mallocAtomic = ( allocLength, Ptr = Pointer ) ->

    iptr = .25 * Atomics.add U32ARRAY, 0, POINTER_BYTELENGTH
    BPel = Ptr.TypedArray.BYTES_PER_ELEMENT

    allocOffset = Atomics.add U32ARRAY, 1, allocLength
    allocFinish = allocOffset + allocLength

    Atomics.store U32ARRAY, iptr + INDEX_BYTEOFFSET , allocOffset
    Atomics.store U32ARRAY, iptr + INDEX_BYTELENGTH , allocLength
    Atomics.store U32ARRAY, iptr + INDEX_BYTEFINISH , allocFinish 
    Atomics.store U32ARRAY, iptr + INDEX_LENGTH     , allocLength / BPel
    Atomics.store U32ARRAY, iptr + INDEX_BEGIN      , allocOffset / BPel
    Atomics.store U32ARRAY, iptr + INDEX_END        , allocFinish / BPel

    new Ptr iptr * 4