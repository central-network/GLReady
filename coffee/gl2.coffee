Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI

#? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
export class M4 extends Float32Array
    
    @Camera     : class Camera extends this
        constructor : ( width, height, depth, fudge ) ->
            super M4.multiply [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, fudge,
                0, 0, 0, 1,
              ], [ # Note: This matrix flips the Y axis so 0 is at the top.
                 2 / width,   0, 0, 0,
                 0, -2 / height, 0, 0,
                 0,  0,  2 / depth, 0,
                -1,  1,  0,  1,
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
    


export default class GL2 extends EventTarget

    vertexShaderSource    : '
        attribute vec4     a_Vertex;
        attribute vec3     a_Color;
        uniform   float    u_PointSize;
        uniform   float    u_FudgeFactor;
        uniform   mat4     u_Camera;
        varying   vec4     v_Color;

        void main() {
            vec4  vPos   = u_Camera * a_Vertex;
            float zDiv   = 1.0 + vPos.z * u_FudgeFactor;

            gl_Position  =  vec4( vPos.xyz, zDiv );
            gl_PointSize =  u_PointSize;
            v_Color      =  vec4( a_Color, 1.0 );
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
    pointCount  : 0
    rendering   : yes

    constructor : ( canvas ) ->

        Object.defineProperties super(),
            gl              : value : canvas.getContext "webgl2" 
            canvas          : value : canvas
            boundingRect    : get   : -> canvas.getBoundingClientRect()
            pixelRatio      : get   : -> window?.devicePixelRatio or 1

        Object.defineProperties this,
            width           : get   : -> @boundingRect.width
            height          : get   : -> @boundingRect.height
            depth           : get   : -> @boundingRect.width / 2
            left            : get   : -> @boundingRect.x
            top             : get   : -> @boundingRect.y

            vFactor         : value : @width  / Math.PI
            hFactor         : value : @height / Math.PI    
            zFactor         : value : 400   

            deltaY          : set   : ( dz ) -> @pointerZ = dz * @zFactor
            offsetX         : set   : ( dx ) -> @pointerX = dx * @pixelRatio
            offsetY         : set   : ( dy ) -> @pointerY = dy * @pixelRatio

        Object.defineProperties this,
            fudge           : get : @getFudge,      set : @setFudge
            
            dxCamera        : get : @getdxCamera,   set : @setdxCamera
            dyCamera        : get : @getdyCamera,   set : @setdyCamera
            dzCamera        : get : @getdzCamera,   set : @setdzCamera
            
            rxCamera        : get : @getrxCamera,   set : @setrxCamera
            ryCamera        : get : @getryCamera,   set : @setryCamera
            rzCamera        : get : @getrzCamera,   set : @setrzCamera

            sxCamera        : get : @getsxCamera,   set : @setsxCamera
            syCamera        : get : @getsyCamera,   set : @setsyCamera
            szCamera        : get : @getszCamera,   set : @setszCamera

        Object.assign @canvas,
            width           : @width  * @pixelRatio
            height          : @height * @pixelRatio

        Object.defineProperties this,
            program         : value :   @gl.createProgram()
            vertexBuffer    : value :   @gl.createBuffer()
            vertexShader    : value :   @gl.createShader( @gl.VERTEX_SHADER )
            colorBuffer     : value :   @gl.createBuffer()
            fragmentShader  : value :   @gl.createShader( @gl.FRAGMENT_SHADER )

        Object.defineProperties this,
            pointSize       : value :   2
            vertices        : value :   new Float32Array 3 * 1e5
            colors          : value :   new Float32Array 3 * 1e5
            clearColor      : value :   new Float32Array [ 15/0xff, 17/0xff, 26/0xff, 1 ]
            camera          : value :   new M4.Camera @width, @height, @depth, @fudge
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
        
        @fudge                          = 1

        @dxCamera                       = 400
        @dyCamera                       = 300
        @dzCamera                       = 0

        @rxCamera                       = Math.rad 20
        @ryCamera                       = Math.rad 50
        @rzCamera                       = Math.rad 80

        @sxCamera                       = 1
        @syCamera                       = 1
        @szCamera                       = 1

        @dump()
        @bindEvents()

    dump        : ->
        setInterval =>
            console.warn { @scene, this: @ }
        , 3000 ; @
   
    upload      : ->
        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @vertexBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @vertices, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Vertex
        @gl.vertexAttribPointer         @a_Vertex, 3, @gl.FLOAT, no, 12, 0

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @colorBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @colors, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Color
        @gl.vertexAttribPointer         @a_Color, 3, @gl.FLOAT, no, 12, 0

    render      : =>

        if  @rendering
            @scene[0]++

            @gl.clear @clearMask
            @gl.drawArrays @gl.TRIANGLES, 0, @pointCount
            @gl.drawArrays @gl.POINTS, 0, @pointCount

        requestAnimationFrame @render


    bindEvents  : ->
        addEventListener "visibilitychange", =>
            @rendering = document.visibilityState is "visible"
    
        addEventListener "pagehide", (e) => console.warn "onunload: quit-nonblock:", e
        addEventListener "pageshow", (e) => e.persisted and console.warn "backtab:", e

        @canvas.addEventListener "wheel", ({ @deltaY }) =>, { passive: !0 }
        @canvas.addEventListener "pointermove", ({ @offsetX, @offsetY }) =>, { passive: !0 }


    updateCamera    : ->
        @gl.uniformMatrix4fv @u_Camera, no,
            @camera
                .translate @dxCamera, @dyCamera, @dzCamera
                .rotate @rxCamera, @ryCamera, @rzCamera
                .scale @sxCamera, @syCamera, @szCamera

    updateFudge     : ->
        @gl.uniform1f @u_FudgeFactor, @fudge        


    INDEX_FUDGE     : 1
    getFudge        : -> @scene.at @INDEX_FUDGE
    setFudge        : -> @updateFudge @scene[ @INDEX_FUDGE ] = arguments[0]
    
    INDEX_CAMERA    : 2
    getdxCamera     : -> @scene.at @INDEX_CAMERA + 0
    setdxCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 0 ] = arguments[0]

    getdyCamera     : -> @scene.at @INDEX_CAMERA + 1
    setdyCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 1 ] = arguments[0]

    getdzCamera     : -> @scene.at @INDEX_CAMERA + 2
    setdzCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 2 ] = arguments[0]

    getrxCamera     : -> @scene.at @INDEX_CAMERA + 3
    setrxCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 3 ] = arguments[0]

    getryCamera     : -> @scene.at @INDEX_CAMERA + 4
    setryCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 4 ] = arguments[0]

    getrzCamera     : -> @scene.at @INDEX_CAMERA + 5
    setrzCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 5 ] = arguments[0]

    getsxCamera     : -> @scene.at @INDEX_CAMERA + 6
    setsxCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 6 ] = arguments[0]

    getsyCamera     : -> @scene.at @INDEX_CAMERA + 7
    setsyCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 7 ] = arguments[0]

    getszCamera     : -> @scene.at @INDEX_CAMERA + 8
    setszCamera     : -> @updateCamera @scene[ @INDEX_CAMERA + 8 ] = arguments[0]

    