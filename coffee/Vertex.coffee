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

export class Attribute extends Vertex
    @byteLength : VALUES_PER_VERTEX * BYTES_PER_VALUE

    Object.defineProperties this::,
        r       :
            get : -> @getFloat32 OFFSET_R
            set : -> @setFloat32 OFFSET_R, arguments[0]

        g       :
            get : -> @getFloat32 OFFSET_G
            set : -> @setFloat32 OFFSET_G, arguments[0]

        b       :
            get : -> @getFloat32 OFFSET_B
            set : -> @setFloat32 OFFSET_B, arguments[0]

        a       :
            get : -> @getFloat32 OFFSET_A
            set : -> @setFloat32 OFFSET_A, arguments[0]

        sx      :
            get : -> @getFloat32 OFFSET_SX
            set : -> @setFloat32 OFFSET_SX, arguments[0]

        sy      :
            get : -> @getFloat32 OFFSET_SY
            set : -> @setFloat32 OFFSET_SY, arguments[0]


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

        drawBegin   :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_1, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_1, arguments[ 0 ], LE

        drawOffset  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_2, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_2, arguments[ 0 ], LE

        drawLength  :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_3, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_3, arguments[ 0 ], LE

        drawMode    :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_4, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_4, arguments[ 0 ], LE

        rotation    :
            get     : -> DATAVIEW.getUint32 this + OFFSET_OBJECT_5, LE
            set     : -> DATAVIEW.setUint32 this + OFFSET_OBJECT_5, arguments[ 0 ], LE

        position    :
            get     : -> Vertex.maybePointer OFFSET_OBJECT_6, this
            set     : -> @position.set arguments[0]

        VALUES_PER_VERTEX : value : VALUES_PER_VERTEX
        BYTES_PER_VALUE : value : BYTES_PER_VALUE


export default Vertex