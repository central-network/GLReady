import { CameraServer } from "./Camera.coffee"
import { BindServer } from "./BindServer.js"
import { ScreenServer } from "./ScreenServer.js"

import Pointer from "./Pointer.coffee"
import Matrix4 from "./Matrix4.coffee"

OFFSET_RENDERING        = 4 * 0
OFFSET_FRAME            = 4 * 1
LENGTH_CLEAR_COLOR      = 4 * 4

OFFSET_BIND_TARGET      = 4 * 9
OFFSET_CLEAR_COLOR      = 4 * 10
OFFSET_CLEAR_MASK       = 4 * 11
OFFSET_POINT_SIZE       = 4 * 12

OFFSET_BLEND_ENABLED    = 4 * 13
OFFSET_BLEND_FUNC_SRC   = 4 * 14
OFFSET_BLEND_FUNC_DST   = 4 * 15
OFFSET_BLEND_EQUATION   = 4 * 16

OFFSET_DEPTH_ENABLED    = 4 * 17
OFFSET_DEPTH_FUNCTION   = 4 * 18
OFFSET_DEPTH_MASK       = 4 * 19
OFFSET_CLEAR_DEPTH      = 4 * 20

OFFSET_CULL_ENABLED     = 4 * 21
OFFSET_CULL_FACE        = 4 * 22
OFFSET_FRONT_FACE       = 4 * 23

export length       = 1 * 30
export byteLength   = 4 * length

export class Color      extends Pointer
    @byteLength : 16

export class GLClient   extends Pointer

    @byteLength : byteLength

    constructor : ( ptr ) -> super ptr 

    Object.defineProperties this::,
        moving      : get     : -> @getInt32 OFFSET_MOVING 

export class GLServer   extends Pointer

    @byteLength     : byteLength

    @TypedArray     : Uint32Array

    Camera          : Pointer

    vShaderSource   : '
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

    fShaderSource   : '
        precision highp    float;
        varying   vec4     v_Color;

        void main() {
            gl_FragColor = v_Color;
        }
    '

    init            : ->
        @blendEnabled   = WebGL2RenderingContext.BLEND
        @blendFuncSrc   = WebGL2RenderingContext.SRC_COLOR
        @blendFuncDst   = WebGL2RenderingContext.DST_COLOR
        @blendEquation  = WebGL2RenderingContext.FUNC_ADD

        @depthEnabled   = WebGL2RenderingContext.DEPTH_TEST
        @depthFunc      = WebGL2RenderingContext.LEQUAL
        @depthMask      = no
        @clearDepth     = 1
        @clearColor     = 0x0f111aff
        @clearMask      =
            WebGL2RenderingContext.DEPTH_BUFFER_BIT |
            WebGL2RenderingContext.COLOR_BUFFER_BIT

        @cullEnabled    = WebGL2RenderingContext.CULL_FACE
        @cullFace       = WebGL2RenderingContext.BACK
        @frontFace      = WebGL2RenderingContext.CCW
        @bindTarget     = WebGL2RenderingContext.ARRAY_BUFFER

        @pointSize      = 10

    bind            : ( canvas ) ->
        gl = canvas.getContext "webgl2"

        Object.defineProperties this,
            gl          : value : gl
            glBuffer    : value : gl.createBuffer()
            glProgram   : value : gl.createProgram()
            glShaders   : value : [
                gl.createShader gl.VERTEX_SHADER
                gl.createShader gl.FRAGMENT_SHADER
            ]

        @setVertexShader @vShaderSource
        @setFragmentShader @fShaderSource

        @updateCull()
        @updateDepth()
        @updateBlend()

        @runProgram()
        @bindBuffer()
        @clearSpace()

        @gl.drawArrays @gl.POINTS, 0, 3
        @gl.finish()

    downloadParameter   : ( parameter ) ->
        @gl.getParameter parameter

    clearSpace          : ( [ r, g, b, a ] = @clearColor.toRGBA @ ) ->
        @gl.clearColor                      r, g, b, a
        @gl.clear                           @clearMask
        ; @

    bindBuffer          : ->
        @gl.bindBuffer                      @bindTarget, @glBuffer
        ; @

    runProgram          : ->
        @gl.linkProgram                     @glProgram
        @gl.useProgram                      @glProgram
        ; @

    setVertexShader     : ( source ) ->
        @gl.shaderSource                    @glShaders[0], source
        @gl.compileShader                   @glShaders[0]
        @gl.attachShader                    @glProgram, @glShaders[0]
        ; @

    setFragmentShader   : ( source ) ->
        @gl.shaderSource                    @glShaders[1], source
        @gl.compileShader                   @glShaders[1]
        @gl.attachShader                    @glProgram, @glShaders[1]
        ; @

    updateCull          : ->
        if  @cullEnabled
            @gl.cullFace                    @cullFace
            @gl.enable                      @cullEnabled
            @gl.frontFace                   @frontFace
        ; @

    updateDepth         : ->
        if  @depthEnabled
            @gl.enable                      @depthEnabled
            @gl.depthFunc                   @depthFunc
            @gl.depthMask                   @depthMask
            @gl.clearDepth                  @clearDepth
        ; @

    updateBlend         : ->
        if  @blendEnabled
            @gl.enable                      @blendEnabled
            @gl.blendFunc                   @blendFuncSrc, @blendFuncDst
            @gl.blendEquation               @blendEquation
        ; @

    setViewPort         : ( width, height, left = 0, top = 0 ) ->
        @gl.viewport left, top, width, height ; @

    Object.defineProperties this::,

        COLOR_CLEAR_VALUE : get : -> @gl.getParameter @gl.COLOR_CLEAR_VALUE
        COLOR_WRITEMASK : get : -> @gl.getParameter @gl.COLOR_WRITEMASK

        bindTarget      :
            get         : -> @keyUint32 OFFSET_BIND_TARGET
            set         : -> @setUint32 OFFSET_BIND_TARGET, arguments[0]

        clearColor      :
            get         : -> @getUint32 OFFSET_CLEAR_COLOR
            set         : -> @setUint32 OFFSET_CLEAR_COLOR, arguments[0]

        clearMask       :
            get         : -> @getUint32 OFFSET_CLEAR_MASK
            set         : -> @setUint32 OFFSET_CLEAR_MASK, arguments[0]

        pointSize       :
            get         : -> @getFloat32 OFFSET_POINT_SIZE
            set         : -> @setFloat32 OFFSET_POINT_SIZE, arguments[0]

        blendEnabled    :
            get         : -> @keyUint32 OFFSET_BLEND_ENABLED
            set         : -> @setUint32 OFFSET_BLEND_ENABLED, arguments[0]

        blendFuncSrc    :
            get         : -> @keyUint32 OFFSET_BLEND_FUNC_SRC
            set         : -> @setUint32 OFFSET_BLEND_FUNC_SRC, arguments[0]

        blendFuncDst    :
            get         : -> @keyUint32 OFFSET_BLEND_FUNC_DST
            set         : -> @setUint32 OFFSET_BLEND_FUNC_DST, arguments[0]

        blendEquation   :
            get         : -> @keyUint32 OFFSET_BLEND_EQUATION
            set         : -> @setUint32 OFFSET_BLEND_EQUATION, arguments[0]
            
        depthEnabled    :
            get         : -> @keyUint32 OFFSET_DEPTH_ENABLED
            set         : -> @setUint32 OFFSET_DEPTH_ENABLED, arguments[0]

        depthFunc       :
            get         : -> @keyUint32 OFFSET_DEPTH_FUNCTION
            set         : -> @setUint32 OFFSET_DEPTH_FUNCTION, arguments[0]

        depthMask       :
            get         : -> @keyUint32 OFFSET_DEPTH_MASK
            set         : -> @setUint32 OFFSET_DEPTH_MASK, arguments[0]
            
        clearDepth      :
            get         : -> @getFloat32 OFFSET_CLEAR_DEPTH
            set         : -> @setFloat32 OFFSET_CLEAR_DEPTH, arguments[0]

        cullEnabled     :
            get         : -> @keyUint32 OFFSET_CULL_ENABLED
            set         : -> @setUint32 OFFSET_CULL_ENABLED, arguments[0]

        cullFace        :
            get         : -> @keyUint32 OFFSET_CULL_FACE
            set         : -> @setUint32 OFFSET_CULL_FACE, arguments[0]

        frontFace       :
            get         : -> @keyUint32 OFFSET_FRONT_FACE
            set         : -> @setUint32 OFFSET_FRONT_FACE, arguments[0]

            