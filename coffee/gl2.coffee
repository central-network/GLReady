Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI
    powsum          : value : ( arr, pow = 2 ) ->
        [ ...arr ].flat().reduce (a, b) -> a + Math.pow b, pow



BYTES_PER_ELEMENT   = 4
HEADER_ITEM_COUNT   = 40
ITEMS_PER_VERTEX    = 7
DRAW_LENGTH         = 3e6 + 4
BUFFER              = new SharedArrayBuffer 1e8
DRAW_COUNT          = DRAW_LENGTH / 7

i32 = new Int32Array BUFFER
f32 = new Float32Array BUFFER

self.objects = new Object()

export class Attribute extends Float32Array
export class Attributes extends Attribute

export class Pointer extends Number
    base    : new Float32Array BUFFER

    put     : ( index, value ) -> @base[ @begin + index ] = value
    get     : ( index ) -> @base[ @begin + index ]
    set     : ( array ) -> @array.set array ; @

    [ Symbol.iterator ] : ->
        yield @get i for i in [ 0 ... @length ]    

    Object.defineProperties this::,
        array   : get : -> @base.subarray @begin, @end
        begin   : get : -> @index + @byteOffset / 4
        end     : get : -> @begin + @length
        index   : get : -> this / 4
        length  : get : -> @byteLength / 4

export class AtomicPointer extends Pointer
    base        : new Int32Array BUFFER

    put     : ( index, value ) -> Atomics.store @base, @begin + index, value
    get     : ( index ) -> Atomics.load @base, @begin + index
    set     : ( array ) -> @put i, array[i] for i in [ 0 ... @length ] ; @


export class Headers    extends AtomicPointer
    byteOffset  : 0
    byteLength  : 40 * 4

export class Position   extends Pointer
    byteOffset  : 80
    byteLength  : 12

    for key, index in [ "x", "y", "z" ]
        Object.defineProperty this::, key, ((i)->
            get : -> @get i
            set : -> @put i, arguments[0]
        ) index

export class Rotation   extends Pointer
    byteOffset  : 64
    byteLength  : 12

    for key, index in [ "x", "y", "z" ]
        Object.defineProperty this::, key, ((i)->
            get : -> @get i
            set : -> @put i, arguments[0]
        ) index

export class Color extends Pointer
    byteOffset  : 48
    byteLength  : 16

    for key, index in [ "r", "g", "b", "a" ]
        Object.defineProperty this::, key, ((i)->
            get : -> @get i
            set : -> @put i, arguments[0]
        ) index

    set         : ( value ) ->
        super Color.parse value
   
    @parse      : ( any ) ->
        if  any instanceof this
            return any

        if  "function" is typeof any.fill
            arr = [ 1, 1, 1, 1 ]

            for v, i in any
                arr[i] = if v > 1 then v/255
                else v
            
            return arr

        if  "function" is typeof any.trim

            if  "#" is any.at 0
                return Color.parse any.substring 1

            if  "x" is any.at 1
                return Color.parse any.substring 2

                any = any.replace( /\W+/g, '' )

            if  any.length is 3
                return Color.parse any.split("").map((i) -> i+i).join("")

            if  any.length <= 5
                return Color.parse any.padStart 6, 0

            return any.padEnd( 8, "ff" ).match( /.{1,2}/g )
                .map( (n) -> parseInt( n, 16 ) / 0xff )

export class ColorAttribute     extends Color
    byteOffset  : 12

export class PositionAttribute  extends Position
    byteOffset  : 0

#? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
export class M4 extends Float32Array

    Object.defineProperty this, "identity", get : ->
        new M4 [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            0,  0,  0,  1,
        ] 
    
    @Camera     : class Camera extends this
        constructor : ( yFov, rAspect, zNear, zFar ) ->

            f = Math.tan Math.PI/2 - yFov/2
            rangeInv = 1.0 / ( zNear - zFar )

            super [
                f / rAspect,   0,                             0,    0,
                0,             f,                             0,    0,
                0,             0,     (zNear + zFar) * rangeInv,   -1,
                0,             0, (zNear * zFar) * rangeInv * 2,    0
            ]

    @fromVec3   = ( vec3 ) ->
        new M4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
              ... vec3,  1,
        ]

    modifyVertex : ( vec3 ) ->
        vec3.set M4.multiply( this, Float32Array.from [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            ...vec3.subarray(0, 3),  1,
       ] ).subarray( 12, 15 ) ; vec3

    multiply    : ( b ) -> @set( M4.multiply @, b ); this

    @multiply   = ( a, b ) ->
        a00 = a[0 * 4 + 0]; a01 = a[0 * 4 + 1]; a02 = a[0 * 4 + 2]; a03 = a[0 * 4 + 3]
        a10 = a[1 * 4 + 0]; a11 = a[1 * 4 + 1]; a12 = a[1 * 4 + 2]; a13 = a[1 * 4 + 3]
        a20 = a[2 * 4 + 0]; a21 = a[2 * 4 + 1]; a22 = a[2 * 4 + 2]; a23 = a[2 * 4 + 3] 
        a30 = a[3 * 4 + 0]; a31 = a[3 * 4 + 1]; a32 = a[3 * 4 + 2]; a33 = a[3 * 4 + 3]

        b00 = b[0 * 4 + 0]; b01 = b[0 * 4 + 1]; b02 = b[0 * 4 + 2]; b03 = b[0 * 4 + 3] 
        b10 = b[1 * 4 + 0]; b11 = b[1 * 4 + 1]; b12 = b[1 * 4 + 2]; b13 = b[1 * 4 + 3] 
        b20 = b[2 * 4 + 0]; b21 = b[2 * 4 + 1]; b22 = b[2 * 4 + 2]; b23 = b[2 * 4 + 3] 
        b30 = b[3 * 4 + 0]; b31 = b[3 * 4 + 1]; b32 = b[3 * 4 + 2]; b33 = b[3 * 4 + 3]
        
        new M4 [
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
        ]

    translation : ( tx = 0, ty = 0, tz = 0 ) ->
        [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
            tx, ty, tz,  1,
        ]

    xTranslation : ( tx = 0 ) ->
        new M4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
            tx,  0,  0,  1,
        ]

    yTranslation : ( ty = 0 ) ->
        new M4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
             0, ty,  0,  1,
        ]

    zTranslation : ( tz = 0 ) ->
        new M4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
             0,  0, tz,  1,
        ]

    xRotation   : ( angleInRadians = 0 ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians

        new M4 [
             1,  0,  0,  0,
             0,  c,  s,  0,
             0, -s,  c,  0,
             0,  0,  0,  1,
        ]

    yRotation   : ( angleInRadians = 0 ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians
        
        new M4 [
             c,  0, -s,  0,
             0,  1,  0,  0,
             s,  0,  c,  0,
             0,  0,  0,  1,
        ]

    zRotation   : ( angleInRadians = 0 ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians
        
        new M4 [
             c,  s,  0,  0,
            -s,  c,  0,  0,
             0,  0,  1,  0,
             0,  0,  0,  1,
        ]

    scaling     : ( sx, sy, sz ) ->
        sz ?= ( sy ?= ( sx ?= 1 ) ) 
        new M4 [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ]

    translate   : ( tx, ty, tz ) ->
        @multiply @translation tx, ty, tz

    rotate      : ( rx, ry, rz ) ->
        this
            .xRotate rx
            .yRotate ry
            .zRotate rz
    
    scale       : ( sx, sy, sz ) ->
        @multiply @scaling sx, sy, sz
        
    xRotate     : ( rx ) ->
        @multiply @xRotation rx
    
    yRotate     : ( ry ) ->
        @multiply @yRotation ry

    zRotate     : ( rz ) ->
        @multiply @zRotation rz

        
    xTranslate  : ( tx ) ->
        @multiply @xTranslation tx
    
    yTranslate  : ( ty ) ->
        @multiply @yTranslation ty

    zTranslate  : ( tz ) ->
        @multiply @zTranslation tz


Float32Array::sub = Float32Array::subarray
Object.defineProperties Float32Array::,
    sub     : value : -> @subarray( ...arguments )
    vertex  : get : -> @sub 0, 3
    color   : get : -> @sub 3, 7
    index   : get : -> @byteOffset / @byteLength % DRAW_COUNT

export class Point              extends Pointer
    byteLength : 7 * 4

    for prop, i in [ "x", "y", "z", "r", "g", "b", "a" ]
        Object.defineProperty this::, prop, ((index)->
            get : -> @get index
            set : -> @put index, arguments[0]
        )(i)

    Object.defineProperties this::,
        color   :
            get : -> new ColorAttribute this
            set : -> @color.set arguments[0]

        vertex  :
            get : -> new PositionAttribute this
            set : -> @vertex.set arguments[0]

        vLength : 
            get : -> Math.sqrt Math.powsum @array.sub 0, 3

        index   :
            get : -> ( @byteOffset % DRAW_COUNT ) / @byteLength

        byteOffset : 
            get : -> this * 1

        begin   :
            get : -> @byteOffset / 4
    

    applyMatrix : ( mat4 ) ->
        mat4.modifyVertex [ ...@vertex ]

    isNeighbour : ( point ) ->
        Point.isNeighbours this, point

    @isNeighbours : ( p0, p1 ) ->
        [ a, b, c ] = p0
        [ x, y, z ] = p1

        dx = x - a
        dy = y - b
        dz = z - c

        return dx if  dx and !dy and !dz
        return dy if !dx and  dy and !dz
        return dz if !dx and !dy and  dz

    @distance2d  : ( p0, p1 ) ->
        [ a, b, c ] = p0    
        [ x, y, z ] = p1
        
        dx = Math.abs a - x
        dy = Math.abs b - y
        dz = Math.abs c - z

        return 0 if !dx and !dy and !dz 
        return dx if dx and !dy and !dz
        return dy if dy and !dz and !dx
        return dz if dz and !dx and !dy

        throw [ "POINTS_ARE_NOT_IN_SAME_PLANE", p0, p1 ]

    nearest     : ( points ) ->
        distance = +Infinity
        nearest = null

        for point in points
            continue if !dist = Point.distance2d this, point
            continue if distance < dist
            distance = dist
            nearest = point

        nearest

DRAW_BUFFER         = new Float32Array BUFFER, 0, DRAW_LENGTH * 3
DRAW_FINISH         = DRAW_BUFFER.byteOffset + DRAW_BUFFER.byteLength

FIRST_TRIANGLES     = 0
INDEX_TRIANGLES     = 0
BYTE_TRIANGLES      = 0

FIRST_POINTS        = DRAW_COUNT
INDEX_POINTS        = DRAW_LENGTH
BYTE_POINTS         = INDEX_POINTS * 4

FIRST_LINES         = DRAW_COUNT  * 2
INDEX_LINES         = DRAW_LENGTH * 2
BYTE_LINES          = INDEX_LINES * 4

COUNT_TRIANGLES     = 0
COUNT_POINTS        = 0
COUNT_LINES         = 0

HEADERS_OFFSET      = DRAW_FINISH
HEADERS_INDEX       = DRAW_FINISH / 4

HEADERS             = new Int32Array BUFFER, HEADERS_OFFSET, 1e6

        

COUNT_HEADERS       = 0
LENGTH_HEADERS      = 0


r  = 
g  = 
b  = 
a  =
rx = ry = rz =
dx = dy = dz =
UNUSED  = 0

[
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33,
    m40, m41, m42, m43
] = M4.identity



export class Vertex     extends Float32Array
export class Vertices   extends Array
export class Points     extends Array
export class Triangle   extends Array

export class Mesh extends Number

    point               : ( i ) ->
        begin = @begin + ITEMS_PER_VERTEX * i
        new Point begin * 4

    triangle            : ( i ) ->
        [ @point(i), @point(i+1), @point(i+2) ]

    applyMatrix         : ( mat4 ) ->
        unless mat4
            @matrix.set M4.identity
            @matrix.rotate ...@rotation
            @matrix.translate ...@position
            mat4 = @matrix

        for p in @points
            mat4.modifyVertex p.vertex.array

        @needsUpload = 1 ; @                    

    neighbours          : ( point ) ->
        neighs = []
        for i in [ 0 ... @count ]
            p = @point i
            if  Point.isNeighbours p.vertex.array, point.vertex.array
                neighs.push p
        neighs

    Object.defineProperties this::,

        drawAs          :
            get : -> GL2::[ @headers.get 7 ]
            set : -> @headers.put 7, arguments[0]

        byteOffset      :
            get : -> @headers.get 0
            set : -> @headers.put 0, arguments[0]

        byteLength      :
            get : -> @headers.get 1
            set : -> @headers.put 1, arguments[0]
        
        count           :
            get : -> @headers.get 2
            set : -> @headers.put 2, arguments[0]

        length          :
            get : -> @headers.get 3
            set : -> @headers.put 3, arguments[0]

        begin           :
            get : -> @headers.get 4
            set : -> @headers.put 4, arguments[0]

        end             :
            get : -> @headers.get 5
            set : -> @headers.put 5, arguments[0]

        hIndex          :
            get : -> @headers.get 6
            set : -> @headers.put 6, arguments[0]

        enabled         :
            get : -> @headers.get 8
            set : -> @headers.put 8, arguments[0]

        needsUpload     :
            get : -> @headers.get 9
            set : -> @headers.put 9, arguments[0]
            
        attributes      :
            get : -> new Attributes BUFFER, @byteOffset, @length
            set : -> @attributes.set arguments[0]

        color           :
            get : -> new Color this
            set : -> @color.set      arguments[0] ; @needsUpload = 1

        headers         :
            get : -> new Headers this
            set : -> @headers.set    arguments[0] ; @applyMatrix()

        rotation        :
            get : -> new Rotation this
            set : -> @rotation.set   arguments[0] ; @applyMatrix()

        position        :
            get : -> new Position this 
            set : -> @position.set   arguments[0] ; @applyMatrix()

        matrix          :
            get : -> new M4 BUFFER, this + 96, 16
            set : -> @matrix.set     arguments[0] ; @applyMatrix()

        points          :
            get : ->
                @point i for i in [ 0 ... @count ]

        triangles       :
            get : -> @triangle i for i in [ 0 ... @count/3 ]

        [ Symbol("(dump)") ] :
            get : -> {
                @byteOffset, @byteLength,
                @count, @length,
                @begin, @end, @id,
                @drawAs, @enabled, @needsUpload,
                @color, @rotation, @position, @matrix
            }
        
        [ Symbol.iterator  ] :
            value : -> yield @point i for i in [ 0 ... @count ]

export class GL2 extends EventTarget

    vertexShaderSource    : '
        attribute vec4     a_Vertex;
        attribute vec4     a_Color;
        uniform   float    u_PointSize;
        uniform   mat4     u_Camera;
        varying   vec4     v_Color;

        void main() {
            gl_Position  =  u_Camera * a_Vertex;
            gl_PointSize =  u_PointSize;
            v_Color      =  a_Color;
        }
    ';

    fragmentShaderSource  : '
        precision highp    float;
        varying   vec4     v_Color;

        void main() {
            gl_FragColor = v_Color;
        }
    '

    scene       : new Float32Array 256
    count       : 0
    rendering   : yes

    yFov        : Math.rad 90
    zNear       : 0.01
    zFar        : 1000

    @corners    : ( shape ) ->
        points  = []
        for point in shape.points
            [ vx, vy, vz ] = point
            found = no
            for [ px, py, pz ] in points.slice()
                x = px is vx
                y = py is vy
                z = pz is vz
                break if found = x and y and z
            unless found then points.push [ vx, vy, vz ]
        Float32Array.from points.flat()

    @edges      : ( shape ) ->
        i = 0
        pairs = []
        points = [] 

        for point, i in shape.points
            neighs = shape.neighbours point
            vertex = point.array.sub 0, 3
                
            for neigh in neighs
                pair = [ c = neigh.index, d = point.index ]
                found = no

                for [ a, b ] in pairs
                    break if found = (c is a) and (d is b)
                    break if found = (c is b) and (d is a)

                if found then continue
                else pairs.push pair

                points.push(
                    ...vertex,  
                    ...neigh.vertex.array
                )

        Float32Array.from points.flat()


    constructor : ( canvas ) ->

        Object.defineProperties super(),
            gl              : value : canvas.getContext "webgl2" 
            canvas          : value : canvas
            onceQueue       : value : new Array
            renderQueue     : value : new Array
            preProcess      : value : new Array
            postProcess     : value : new Array
            boundingRect    : get   : -> canvas.getBoundingClientRect()
            rAspect         : get   : -> @width / @height   
            rPixel          : get   : -> window?.devicePixelRatio or 1

        Object.defineProperties this,
            width           : get   : -> @boundingRect.width
            height          : get   : -> @boundingRect.height
            depth           : get   : -> @boundingRect.width / 2
            left            : get   : -> @boundingRect.x
            top             : get   : -> @boundingRect.y

        Object.defineProperties this,
            vFactor         : value : @width  / Math.PI
            hFactor         : value : @height / Math.PI    
            zFactor         : value : 400

            deltaY          : set   : ( dz ) -> @pointerZ = dz * @zFactor
            offsetX         : set   : ( dx ) -> @pointerX = dx * @rPixel
            offsetY         : set   : ( dy ) -> @pointerY = dy * @rPixel

        Object.defineProperties this,
            dxCamera        : get : @get_dxCamera,   set : @set_dxCamera
            dyCamera        : get : @get_dyCamera,   set : @set_dyCamera
            dzCamera        : get : @get_dzCamera,   set : @set_dzCamera
            
            rxCamera        : get : @get_rxCamera,   set : @set_rxCamera
            ryCamera        : get : @get_ryCamera,   set : @set_ryCamera
            rzCamera        : get : @get_rzCamera,   set : @set_rzCamera

            sxCamera        : get : @get_sxCamera,   set : @set_sxCamera
            syCamera        : get : @get_syCamera,   set : @set_syCamera
            szCamera        : get : @get_szCamera,   set : @set_szCamera

        Object.assign @canvas,
            width           : @width  * @rPixel
            height          : @height * @rPixel
            style           : "background: rgb(15, 17, 26)"

        Object.defineProperties this,
            buffer          : value :   @gl.createBuffer()
            program         : value :   @gl.createProgram()
            vertexShader    : value :   @gl.createShader( @gl.VERTEX_SHADER )
            fragmentShader  : value :   @gl.createShader( @gl.FRAGMENT_SHADER )

        Object.defineProperties this,
            clearColor      : value :   new Float32Array [ 15/0xff, 17/0xff, 26/0xff, 1 ]
            camera          : value :   new M4.Camera @yFov, @rAspect, @zNear, @zFar
            clearMask       : value :   @gl.DEPTH_BUFFER_BIT | @gl.COLOR_BUFFER_BIT
            pointSize       :
                get         : -> @gl.getUniform @program, @u_PointSize
                set         : -> @gl.uniform1f @u_PointSize, arguments[0]

        @gl.shaderSource                @vertexShader, @vertexShaderSource
        @gl.compileShader               @vertexShader
        @gl.attachShader                @program, @vertexShader
        
        @gl.shaderSource                @fragmentShader, @fragmentShaderSource
        @gl.compileShader               @fragmentShader
        @gl.attachShader                @program, @fragmentShader

        @gl.enable                      @gl.BLEND
        @gl.blendFunc                   @gl.SRC_COLOR, @gl.DST_COLOR
        @gl.blendEquation               @gl.FUNC_ADD
        
        @gl.enable                      @gl.DEPTH_TEST
        @gl.depthFunc                   @gl.LEQUAL        
        @gl.depthMask                   no
        @gl.clearDepth                  1

        @gl.enable                      @gl.CULL_FACE
        @gl.cullFace                    @gl.BACK
        @gl.frontFace                   @gl.CCW

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @buffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, DRAW_BUFFER, @gl.STATIC_DRAW

        @gl.vertexAttribPointer         @a_Vertex, 3, @gl.FLOAT, no, 28, 0
        @gl.vertexAttribPointer         @a_Color, 4, @gl.FLOAT, no, 28, 12
        
        @gl.enableVertexAttribArray     @a_Vertex
        @gl.enableVertexAttribArray     @a_Color

        @gl.viewport                    0, 0, @canvas.width, @canvas.height
        @gl.linkProgram                 @program
        @gl.useProgram                  @program


        Object.defineProperties this,
            a_Vertex        : value :   @gl.getAttribLocation  @program, "a_Vertex"
            a_Color         : value :   @gl.getAttribLocation  @program, "a_Color"
            u_Camera        : value :   @gl.getUniformLocation @program, "u_Camera"
            u_PointSize     : value :   @gl.getUniformLocation @program, "u_PointSize"
            u_FudgeFactor   : value :   @gl.getUniformLocation @program, "u_FudgeFactor"

        
        @dxCamera                       = 0
        @dyCamera                       = 0
        @dzCamera                       = -360

        @rxCamera                       = Math.rad 180
        @ryCamera                       = Math.rad 0
        @rzCamera                       = Math.rad 0

        @sxCamera                       = 1
        @syCamera                       = 1
        @szCamera                       = 1

        @bindEvents()

    dump        : ->
        console.warn { @scene, this: @ }
   
    upload      : ( ptr ) ->
        if !ptr then @gl.bufferData     @gl.ARRAY_BUFFER, DRAW_BUFFER, @gl.STATIC_DRAW
        else @gl.bufferSubData          @gl.ARRAY_BUFFER, ptr.byteOffset, DRAW_BUFFER, ptr.begin, ptr.length

        @gl.vertexAttribPointer         @a_Vertex, 3, @gl.FLOAT, no, 28, 0
        @gl.vertexAttribPointer         @a_Color, 4, @gl.FLOAT, no, 28, 12

        @gl.enableVertexAttribArray     @a_Vertex
        @gl.enableVertexAttribArray     @a_Color

    TRIANGLES   : new (class TRIANGLES extends Number) WebGL2RenderingContext::TRIANGLES
    POINTS      : new (class POINTS extends Number) WebGL2RenderingContext::POINTS
    LINES       : new (class LINES extends Number) WebGL2RenderingContext::LINES
    
    Object.defineProperties this::,
        [ WebGL2RenderingContext::TRIANGLES ] : get : -> @TRIANGLES
        [ WebGL2RenderingContext::POINTS ]    : get : -> @POINTS
        [ WebGL2RenderingContext::LINES ]     : get : -> @LINES


    malloc          : ( count, drawAs = @TRIANGLES ) ->

        if      drawAs is @TRIANGLES
            
            begin             = INDEX_TRIANGLES
            length            = ITEMS_PER_VERTEX * count

            byteOffset        = BYTE_TRIANGLES
            byteLength        = BYTES_PER_ELEMENT * length
            
            INDEX_TRIANGLES  += length
            COUNT_TRIANGLES  += count
            BYTE_TRIANGLES   += byteLength
    
        else if drawAs is @POINTS
            
            begin             = INDEX_POINTS
            length            = ITEMS_PER_VERTEX * count

            byteOffset        = BYTE_POINTS
            byteLength        = BYTES_PER_ELEMENT * length

            INDEX_POINTS     += length
            COUNT_POINTS     += count
            BYTE_POINTS      += byteLength

        else if drawAs is @LINES
            
            begin             = INDEX_LINES
            length            = ITEMS_PER_VERTEX * count

            byteOffset        = BYTE_LINES
            byteLength        = BYTES_PER_ELEMENT * length

            INDEX_LINES      += length
            COUNT_LINES      += count
            BYTE_LINES       += byteLength

        else throw [ "UNDEFINED_DRAW_METHOD:", drawAs ]

        headersOffset = HEADERS_OFFSET + LENGTH_HEADERS * 4
        LENGTH_HEADERS += HEADER_ITEM_COUNT

        headers = new Headers headersOffset
        headers.set [
            byteOffset,
            byteLength,
            count,
            length,
            begin,
            end         = begin + length, 
            hIndex      = LENGTH_HEADERS,
            drawAs,
            enabled     = 1,
            needsUpload = 1,
            UNUSED, UNUSED, 
            
            r, g, b, a,
            rx, ry, rz, UNUSED,
            dx, dy, dz, UNUSED,

        ] 
        
        mesh = new Mesh headersOffset
        mesh.matrix.set M4.identity

        objects[ headersOffset ] = mesh

    render      : ( t ) =>

        if  @rendering

            if len = @onceQueue.length
                for job in @onceQueue.splice 0, len
                    job.call this

            for job in @renderQueue.slice 0
                job.call this, t

            for hIndex, object of objects
                continue unless object.needsUpload
                @upload object; object.needsUpload = 0

            @gl.drawArrays @gl.TRIANGLES, FIRST_TRIANGLES, COUNT_TRIANGLES
            @gl.drawArrays @gl.POINTS,  FIRST_POINTS,  COUNT_POINTS
            @gl.drawArrays @gl.LINES, FIRST_LINES, COUNT_LINES

            for job in @postProcess.slice 0
                job.call this, t

            ++@scene[0]

        requestAnimationFrame @render


    bindEvents      : ->
        addEventListener "visibilitychange", =>
            @rendering = document.visibilityState is "visible"
        addEventListener "pagehide", (e) => console.warn "onunload: quit-nonblock:", e
        addEventListener "pageshow", (e) => e.persisted and console.warn "backtab:", e

    uploadCamera    : -> @onceQueue.push ->
        @gl.uniformMatrix4fv @u_Camera, no,
            @camera.slice()
                .translate @dxCamera, @dyCamera, @dzCamera
                .rotate @rxCamera, @ryCamera, @rzCamera
                .scale @sxCamera, @syCamera, @szCamera
        
    queue           : ( fn ) -> @renderQueue.push( fn ) - 1
    
    INDEX_CAMERA    : 2

    get_dxCamera    : -> @scene.at @INDEX_CAMERA + 0
    set_dxCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 0 ] = arguments[0]

    get_dyCamera    : -> @scene.at @INDEX_CAMERA + 1
    set_dyCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 1 ] = arguments[0]

    get_dzCamera    : -> @scene.at @INDEX_CAMERA + 2
    set_dzCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 2 ] = arguments[0]

    get_rxCamera    : -> @scene.at @INDEX_CAMERA + 3
    set_rxCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 3 ] = arguments[0]

    get_ryCamera    : -> @scene.at @INDEX_CAMERA + 4
    set_ryCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 4 ] = arguments[0]

    get_rzCamera    : -> @scene.at @INDEX_CAMERA + 5
    set_rzCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 5 ] = arguments[0]

    get_sxCamera    : -> @scene.at @INDEX_CAMERA + 6
    set_sxCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 6 ] = arguments[0]

    get_syCamera    : -> @scene.at @INDEX_CAMERA + 7
    set_syCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 7 ] = arguments[0]

    get_szCamera    : -> @scene.at @INDEX_CAMERA + 8
    set_szCamera    : -> @uploadCamera @scene[ @INDEX_CAMERA + 8 ] = arguments[0]

    