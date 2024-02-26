Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI

#? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
export class M4 extends Float32Array
    
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

    translation : ( tx, ty, tz ) ->
        [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
            tx, ty, tz,  1,
        ]

    xRotation   : ( angleInRadians ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians

        [
             1,  0,  0,  0,
             0,  c,  s,  0,
             0, -s,  c,  0,
             0,  0,  0,  1,
        ]

    yRotation   : ( angleInRadians ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians
        
        [
             c,  0, -s,  0,
             0,  1,  0,  0,
             s,  0,  c,  0,
             0,  0,  0,  1,
        ]

    zRotation   : ( angleInRadians ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians
        
        [
             c,  s,  0,  0,
            -s,  c,  0,  0,
             0,  0,  1,  0,
             0,  0,  0,  1,
        ]

    scaling     : ( sx, sy, sz ) ->
        [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ]

    translate   : ( tx, ty, tz ) ->
        M4.multiply this, @translation tx, ty, tz

    rotate      : ( rx, ry, rz ) ->
        this
            .xRotate rx
            .yRotate ry
            .zRotate rz
    
    scale       : ( sx, sy, sz ) ->
        M4.multiply this, @scaling sx, sy, sz
        
    xRotate     : ( rx ) ->
        M4.multiply this, @xRotation rx
    
    yRotate     : ( ry ) ->
        M4.multiply this, @yRotation ry

    zRotate     : ( rz ) ->
        M4.multiply this, @zRotation rz

        
export class Color extends Float32Array
export class Vertex extends Float32Array
export class Attributes extends Float32Array
export class Headers extends Float32Array
export class Vertices extends Array
export class Points extends Array

export class Point extends Float32Array
    for prop, i in [ "x", "y", "z", "r", "g", "b", "a" ]
        Object.defineProperty this::, prop, ((index)->
            get : -> this[index]
            set : -> this[index] = arguments[0]
        )(i)

    Object.defineProperties this::,
        color   :
            get : -> new Color @buffer, 12, 4
            set : -> this.set arguments[0], 3

        vertex  :
            get : -> new Vertex @buffer, 0, 3
            set : -> this.set arguments[0], 0

export default class GL2 extends EventTarget

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
    pointsCount  : 0
    rendering   : yes

    yFov        : Math.rad 90
    zNear       : 0.01
    zFar        : 1000

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

        Object.defineProperties this,
            lineBuffer      : value :   @gl.createBuffer()
            pointBuffer     : value :   @gl.createBuffer()
            vertexBuffer    : value :   @gl.createBuffer()
            colorBuffer     : value :   @gl.createBuffer()
            program         : value :   @gl.createProgram()
            vertexShader    : value :   @gl.createShader( @gl.VERTEX_SHADER )
            fragmentShader  : value :   @gl.createShader( @gl.FRAGMENT_SHADER )

        Object.defineProperties this,
            pointSize       : value :   2
            vertices        : value :   new Float32Array 3 * 1e5
            colors          : value :   new Float32Array 3 * 1e5
            lines           : value :   new Float32Array 3 * 1e5
            clearColor      : value :   new Float32Array [ 15/0xff, 17/0xff, 26/0xff, 1 ]
            camera          : value :   new M4.Camera @yFov, @rAspect, @zNear, @zFar
            clearMask       : value :   @gl.DEPTH_BUFFER_BIT | @gl.COLOR_BUFFER_BIT
            clearDepth      : value :   1

        @gl.shaderSource                @vertexShader, @vertexShaderSource
        @gl.compileShader               @vertexShader
        @gl.attachShader                @program, @vertexShader
        
        @gl.shaderSource                @fragmentShader, @fragmentShaderSource
        @gl.compileShader               @fragmentShader
        @gl.attachShader                @program, @fragmentShader

        @gl.enable                      @gl.DEPTH_TEST
        @gl.enable                      @gl.CULL_FACE
        @gl.depthFunc                   @gl.LEQUAL
        @gl.clearDepth                  @clearDepth
        @gl.clearColor                  ...@clearColor

        @gl.viewport                    0, 0, @canvas.width, @canvas.height
        @gl.linkProgram                 @program
        @gl.useProgram                  @program

        Object.defineProperties this,
            a_Vertex        : value :   @gl.getAttribLocation  @program, "a_Vertex"
            a_Color         : value :   @gl.getAttribLocation  @program, "a_Color"
            u_Camera        : value :   @gl.getUniformLocation @program, "u_Camera"
            u_PointSize     : value :   @gl.getUniformLocation @program, "u_PointSize"
            u_FudgeFactor   : value :   @gl.getUniformLocation @program, "u_FudgeFactor"

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @vertexBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @vertices, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Vertex
        @gl.vertexAttribPointer         @a_Vertex, 3, @gl.FLOAT, no, 12, 0

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @colorBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @colors, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Color
        @gl.vertexAttribPointer         @a_Color, 3, @gl.FLOAT, no, 12, 0

        @gl.uniform1f                   @u_PointSize, @pointSize
        
        @dxCamera                       = -150
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
   
    upload      : ->
        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @vertexBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @vertices, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Vertex
        @gl.vertexAttribPointer         @a_Vertex, 3, @gl.FLOAT, no, 12, 0

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @colorBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @colors, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Color
        @gl.vertexAttribPointer         @a_Color, 3, @gl.FLOAT, no, 12, 0


    TRIANGLES   : new (class TRIANGLES extends Number) WebGL2RenderingContext::TRIANGLES
    POINTS      : new (class POINTES extends Number) WebGL2RenderingContext::POINTS
    LINES       : new (class LINES extends Number) WebGL2RenderingContext::LINES
    
    Object.defineProperties this::,
        [ WebGL2RenderingContext::TRIANGLES ] : get : -> @TRIANGLES
        [ WebGL2RenderingContext::POINTS ]    : get : -> @POINTS
        [ WebGL2RenderingContext::LINES ]     : get : -> @LINES

    allocLength     : 0
    allocPoints     : new Point 1e7
    pointHeaders    : new Headers 1e6
    headersOffset   : 0

    malloc      : ( pointsCount, drawAs = @TRIANGLES ) ->
        BYTES_PER_ELEMENT   = 4
        HEADER_ITEM_COUNT   = 6
        ITEMS_PER_VERTEX    = 7
        BUFFER_OF_POINTS    = @allocPoints.buffer
        BUFFER_OF_HEADERS   = @pointHeaders.buffer

        @pointHeaders.set(
            [ @allocLength , pointsCount , drawAs ],
            ( headersOffset = @headersOffset ) / 4
        )

        @allocLength    += BYTES_PER_ELEMENT * ITEMS_PER_VERTEX * pointsCount
        @headersOffset  += BYTES_PER_ELEMENT * HEADER_ITEM_COUNT

        new ( class Mesh extends Number

            [ Symbol.iterator ] : ->
                yield @points[ i ] for i in [ 0 ... @pointsCount ]

            point               : ->
                new Point BUFFER_OF_POINTS, @byteOffset + @stride * arguments[ 0 ], ITEMS_PER_VERTEX

            Object.defineProperties this::,
                byteOffset      : get : -> @headers[0]
                pointsCount     : get : -> @headers[1]
                drawAs          : get : -> GL2::[ @headers[2] ]
                stride          : get : -> ITEMS_PER_VERTEX * BYTES_PER_ELEMENT 
                typedIndex      : get : -> @byteOffset / BYTES_PER_ELEMENT
                byteLength      : get : -> @pointsCount * @stride
                vertexCount     : get : -> @pointsCount * 3
                length          : get : -> ITEMS_PER_VERTEX * @pointsCount
                attribute       : get : -> new Attributes BUFFER_OF_POINTS, @byteOffset, @length
                headers         : get : -> new Headers BUFFER_OF_HEADERS, this, HEADER_ITEM_COUNT
                points          : 
                    set : -> @attribute.set arguments[0].flat()           
                    get : -> @point i for i in [ 0 ... @pointsCount ]

        )( headersOffset )


    render      : ( t ) =>

        if  @rendering
            @gl.clear @clearMask

            if len = @onceQueue.length
                for job in @onceQueue.splice 0, len
                    job.call this

            for job in @renderQueue.slice 0
                job.call this, t

            @gl.drawArrays @gl.TRIANGLES, 0, @pointsCount
            @gl.drawArrays @gl.POINTS, 0, @pointsCount

            for job in @postProcess.slice 0
                job.call this, t

            ++@scene[0]

        requestAnimationFrame @render


    bindEvents  : ->
        addEventListener "visibilitychange", =>
            @rendering = document.visibilityState is "visible"
    
        addEventListener "pagehide", (e) => console.warn "onunload: quit-nonblock:", e
        addEventListener "pageshow", (e) => e.persisted and console.warn "backtab:", e



    uploadCamera    : -> @onceQueue.push ->
        @gl.uniformMatrix4fv @u_Camera, no,
            @camera
                .translate @dxCamera, @dyCamera, @dzCamera
                .rotate @rxCamera, @ryCamera, @rzCamera
                .scale @sxCamera, @syCamera, @szCamera
        
    queue           : ( fn ) ->
        @renderQueue.push( fn ) - 1
    
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

    