export default class GL2 extends EventTarget

    vertexShaderSource    : '
    precision mediump  int;
    precision mediump  float;
    attribute vec3     a_Vertex;
    attribute vec4     a_Color;
    uniform   mat4     u_Camera;
    uniform   float    u_PointSize;
    varying   vec4     v_Color;

    void main() {
        gl_Position  = u_Camera * ( vec4( a_Vertex, 1.0 ) );
        gl_PointSize = u_PointSize;
        v_Color      = a_Color;
    }
    ';

    fragmentShaderSource  : '
    precision mediump  int;
    precision mediump  float;
    varying   vec4     v_Color;

    void main() {
        gl_FragColor = v_Color;
    }
    '

    stats : new Uint32Array 256
    pointCount : 0

    constructor : ( canvas ) ->

        Object.defineProperties super(),
            gl              : value : canvas.getContext "webgl2" 
            canvas          : value : canvas
            boundingRect    : get   : -> canvas.getBoundingClientRect()
            pixelRatio      : get   : -> window?.devicePixelRatio or 1

        Object.defineProperties this,
            width           : get   : -> @boundingRect.width
            height          : get   : -> @boundingRect.height
            left            : get   : -> @boundingRect.x
            top             : get   : -> @boundingRect.y
            vertical        : value : @width  / Math.PI
            horizontal      : value : @height / Math.PI    

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
            pointSize       : value :   new Number 20
            points          : value :   new Number 1e6
            vertices        : value :   new Float32Array 3 * 1e6
            colors          : value :   new Float32Array 4 * 1e6
            clearColor      : value :   new Float32Array [ 15/100, 17/100, 26/100, 1 ]
            clearMask       : value :   new Number @gl.DEPTH_BUFFER_BIT | @gl.COLOR_BUFFER_BIT
            clearDepth      : value :   new Number 1
            camera          : value :   new Float32Array [ 1.56, 0, 0, 0, 1.73, 0, 0, 0, -1, -1, 0, 0, 4.7, 5 ]  

        @gl.shaderSource                @vertexShader, @vertexShaderSource
        @gl.compileShader               @vertexShader
        @gl.attachShader                @program, @vertexShader
        
        @gl.shaderSource                @fragmentShader, @fragmentShaderSource
        @gl.compileShader               @fragmentShader
        @gl.attachShader                @program, @fragmentShader

        @gl.enable                      @gl.DEPTH_TEST
        @gl.depthFunc                   @gl.LEQUAL
        @gl.clearDepth                  @clearDepth
        @gl.clearColor                  ...@clearColor

        @gl.linkProgram                 @program
        @gl.useProgram                  @program

        Object.defineProperties @program,
            a_Vertex        : value :   @gl.getAttribLocation  @program, "a_Vertex"
            a_Color         : value :   @gl.getAttribLocation  @program, "a_Color"
            u_Camera        : value :   @gl.getUniformLocation @program, "u_Camera"
            u_PointSize     : value :   @gl.getUniformLocation @program, "u_PointSize"

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @vertexBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @vertices, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Vertex
        @gl.vertexAttribPointer         @a_Vertex, 3, @gl.FLOAT, no, 12, 0

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @colorBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @colors, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Color
        @gl.vertexAttribPointer         @a_Color, 4, @gl.FLOAT, yes, 16, 0

        @gl.uniform1f                   @u_PointSize, @pointSize
        @gl.uniformMatrix4fv            @u_Camera, !yes, @camera

        @dump()
        @render()

    dump        : ->
        setInterval =>
            console.warn { @stats }
        , 3000 ; @
   
    reload      : ->
        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @vertexBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @vertices, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Vertex
        @gl.vertexAttribPointer         @a_Vertex, 3, @gl.FLOAT, no, 12, 0

        @gl.bindBuffer                  @gl.ARRAY_BUFFER, @colorBuffer
        @gl.bufferData                  @gl.ARRAY_BUFFER, @colors, @gl.STATIC_DRAW
        @gl.enableVertexAttribArray     @a_Color
        @gl.vertexAttribPointer         @a_Color, 4, @gl.FLOAT, yes, 16, 0

    render      : =>
        @stats[0]++
        @gl.clear @clearMask
        @gl.drawArrays @gl.TRIANGLES, 0, @pointCount
        @gl.drawArrays @gl.POINTS, 0, @pointCount
        requestAnimationFrame @render

