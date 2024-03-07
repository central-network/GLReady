import { Pointer, IndexPointer } from "./Pointer.coffee"
import Matrix4 from "./Matrix4.coffee"

import {
    LE,
    DATAVIEW,
    OFFSET_OBJECT_0,
    OFFSET_OBJECT_1,
    OFFSET_OBJECT_2,
    OFFSET_OBJECT_3,
    OFFSET_OBJECT_4,
    OFFSET_OBJECT_5,
    OFFSET_OBJECT_6
} from "./Pointer.coffee"

OFFSET_X  = 4 * 0
OFFSET_Y  = 4 * 1
OFFSET_Z  = 4 * 2

OFFSET_R  = 4 * 3
OFFSET_G  = 4 * 4
OFFSET_B  = 4 * 5
OFFSET_A  = 4 * 6

OFFSET_SX = 4 * 7
OFFSET_SY = 4 * 8

VALUES_PER_VERTEX = 9
BYTES_PER_VALUE = 4

export class Vertex extends IndexPointer

    @byteLength : 12
    @TypedArray : Float32Array

    Object.defineProperties this::,
        x       :
            enumerable: yes
            get : -> @getFloat32 OFFSET_X
            set : -> @setFloat32 OFFSET_X, arguments[0]

        y       :
            enumerable: yes
            get : -> @getFloat32 OFFSET_Y
            set : -> @setFloat32 OFFSET_Y, arguments[0]

        z       :
            enumerable: yes
            get : -> @getFloat32 OFFSET_Z
            set : -> @setFloat32 OFFSET_Z, arguments[0]

export class Attribute extends IndexPointer
    @byteLength : 9 * Float32Array.BYTES_PER_ELEMENT
    @TypedArray : Float32Array

    Object.defineProperties this::,
        x           :
            enumerable: yes
            get : -> @getFloat32 OFFSET_X
            set : -> @setFloat32 OFFSET_X, arguments[0]

        y           :
            enumerable: yes
            get : -> @getFloat32 OFFSET_Y
            set : -> @setFloat32 OFFSET_Y, arguments[0]

        z           :
            enumerable: yes
            get : -> @getFloat32 OFFSET_Z
            set : -> @setFloat32 OFFSET_Z, arguments[0]

        r           :
            enumerable: yes
            get : -> @getFloat32 OFFSET_R
            set : -> @setFloat32 OFFSET_R, arguments[0]
            
        g       :
            enumerable: yes
            get : -> @getFloat32 OFFSET_G
            set : -> @setFloat32 OFFSET_G, arguments[0]
            
        b       :
            enumerable: yes
            get : -> @getFloat32 OFFSET_B
            set : -> @setFloat32 OFFSET_B, arguments[0]
            
        a       :
            enumerable: yes
            get : -> @getFloat32 OFFSET_A
            set : -> @setFloat32 OFFSET_A, arguments[0]
            
        sx      :
            enumerable: yes
            get : -> @getFloat32 OFFSET_SX
            set : -> @setFloat32 OFFSET_SX, arguments[0]
            
        sy      :
            enumerable: yes
            get : -> @getFloat32 OFFSET_SY
            set : -> @setFloat32 OFFSET_SY, arguments[0]

export class DrawBuffer extends Pointer
    @byteLength : 3e7
    
    COUNT_PER_ATTRIBUTE : 9
    BYTES_PER_ATTRIBUTE : 9 * 4

    Object.defineProperties this::,

        #? total allocated bytes in one big draw buffer
        allocLength :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_3, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_3, arguments[ 0 ], LE

    malloc : ( modeBufferPtr ) ->
        ptr.attribBegin = @attribCount
        ptr.allocOffset = @allocLength
        allocByteLength = ptr.byteLength
        ptr.attribCount = allocByteLength / @BYTES_PER_ATTRIBUTE

        ptr.typedOffset = ptr.allocOffset / @BYTES_PER_ATTRIBUTE
        ptr.typedLength = allocByteLength / @BYTES_PER_ELEMENT

        @allocLength   += allocByteLength
        @attribCount   += ptr.attribCount

        ptr


export class ModeBuffer extends Pointer

    Object.defineProperties this::,

        #? one big buffer's start point 
        #* TRIANGLES | POINTS | LINES
        drawMode    :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_0, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_0, arguments[ 0 ], LE

        #? one big buffer's start point 
        #* TRIANGLES = <--->
        #* POINTS    =      <--->
        #* LINES     =           <--->
        #?          -> N    2N   3N
        ## N = @byteLength / BYTES_PER_ATTRIBUTE
        attribFirst :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_1, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_1, arguments[ 0 ], LE

        #? allocated attibutes total type length in mode
        #?                                 / 
        #?                     typed length per attibute 
        attribCount :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_2, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_2, arguments[ 0 ], LE

        #? total allocated bytes in mode buffer
        allocLength :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_3, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_3, arguments[ 0 ], LE



    malloc : ( ptr ) ->
        ptr.attribBegin = @attribCount
        ptr.allocOffset = @allocLength
        allocByteLength = ptr.byteLength
        ptr.attribCount = allocByteLength / @BYTES_PER_ATTRIBUTE

        ptr.typedOffset = ptr.allocOffset / @BYTES_PER_ATTRIBUTE
        ptr.typedLength = allocByteLength / @BYTES_PER_ELEMENT

        @allocLength   += allocByteLength
        @attribCount   += ptr.attribCount

        ptr



export class Attributes extends Pointer

    Object.defineProperties this::,

        attribBegin :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_0, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_0, arguments[ 0 ], LE

        attribCount :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_1, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_1, arguments[ 0 ], LE

        allocOffset :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_2, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_2, arguments[ 0 ], LE

        typedOffset :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_3, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_3, arguments[ 0 ], LE

        typedLength :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_4, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_4, arguments[ 0 ], LE

export class Vertices extends Pointer

    @fromVertexCount    : ( vertexCount, drawMode = WebGL2RenderingContext.POINTS ) ->
        valueCount = vertexCount * VALUES_PER_VERTEX
        byteLength = valueCount * BYTES_PER_VALUE

        ptr = new Vertices malloc byteLength

        ptr.drawMode = drawMode
        ptr.drawLength = vertexCount
        
        ptr

    @fromRectCount      : ( count ) ->
        @fromVertexCount * 6

    getVertex       : ( i ) ->
        Vertex.of( this ).at( i )

    Object.defineProperties this::,

        needsUpload :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_0, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_0, arguments[ 0 ], LE

        attrLength  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_1, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_1, arguments[ 0 ], LE

        drawPointer :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_2, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_2, arguments[ 0 ], LE

        drawMode    :
            get     : -> keyOf DATAVIEW.getUint32 this + OFFSET_OBJECT_3, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_3, arguments[ 0 ], LE

        rotation    :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_4, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_4, arguments[ 0 ], LE

        position    :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_5, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_5, arguments[ 0 ], LE

        scale       :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_6, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_6, arguments[ 0 ], LE


export default Vertex