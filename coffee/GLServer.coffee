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
    OFFSET_OBJECT_6,
    ObjectPointer
} from "./Pointer.coffee"


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

OFFSET_SHADER_ACTIVE    = 4 * 3
OFFSET_SHADER_GLTYPE    = 4 * 4
OFFSET_UPLOADED_STAT    = 4 * 5
OFFSET_COMPILED_STAT    = 4 * 6
OFFSET_ATTACHED_STAT    = 4 * 7
OFFSET_SOURCE_LENGTH    = 4 * 8
OFFSET_SHADER_SOURCE    = 4 * 9
LENGTH_SHADER_SOURCE    = 1e5 - OFFSET_SHADER_SOURCE


OFFSET_PROGRAM_INUSE    = 4 * 0
OFFSET_PROGRAM_LINKED   = 4 * 1
OFFSET_PROGRAM_ACTIVE   = 4 * 2

export length       = 1 * 30
export byteLength   = 4 * length

export class GLPointer      extends Pointer
    oncontextrestored : -> this

    Object.defineProperties this::, 
        gl      :
            get : ->
                if !gl = @getHeader OFFSET_OBJECT_6, yes 
                    gl = @parent?.gl
                ;   gl
            set : -> @setHeader OFFSET_OBJECT_6, arguments[0], yes

export class GLVariable     extends GLPointer

    @byteLength = 24

    @TypedArray = Uint8Array

    ATTRIBUTE   : new (class ATTRIBUTE extends Number) 1

    UNIFORM     : new (class UNIFORM extends Number) 2
    
    FLOAT       : new (class FLOAT extends Number) 5126

    Object.defineProperties this,

        valueType       : value : @prototype.FLOAT

        vec3            : value : class vec3  extends this
            @itemLength : 3

        vec4            : value : class vec4  extends this
            @itemLength : 4

        mat4            : value : class mat4  extends this
            @itemLength : 16

        float           : value : class float extends this
            @itemLength : 1

    Object.defineProperties this::,

        name            :
            get : ->
                key = ""
                for code in @array.slice 0, @nameLength
                    key += String.fromCharCode code
                key

            set : ->
                @fill 0, @nameLength = arguments[0].length

                for char, i in arguments[0]
                    @setUint8 i, char.charCodeAt 0

        type            :
            get     : -> 
                unless @location instanceof Number
                    return @ATTRIBUTE
                return @UNIFORM

        shader          :
            get     : -> @parent

        nameLength      :
            get     : -> @getHeader OFFSET_OBJECT_0
            set     : -> @setHeader OFFSET_OBJECT_0, arguments[ 0 ]

        location        :
            get     : -> @getHeader OFFSET_OBJECT_1, yes
            set     : -> @setHeader OFFSET_OBJECT_1, arguments[ 0 ], yes

        itemLength      :
            get     : -> @getHeader OFFSET_OBJECT_2
            set     : -> @setHeader OFFSET_OBJECT_2, arguments[ 0 ]

        valueType       :
            get     : -> @keyHeader OFFSET_OBJECT_3
            set     : -> @setHeader OFFSET_OBJECT_3, arguments[ 0 ]

        normalize       :
            get     : -> @getHeader OFFSET_OBJECT_4
            set     : -> @setHeader OFFSET_OBJECT_4, arguments[ 0 ]

        stride          :
            get     : -> @getHeader OFFSET_OBJECT_5
            set     : -> @setHeader OFFSET_OBJECT_5, arguments[ 0 ]

        offset          :
            get     : -> @getHeader OFFSET_OBJECT_6
            set     : -> @setHeader OFFSET_OBJECT_6, arguments[ 0 ]

export class GLPositions    extends GLPointer

    @TypedArray         : Float32Array

    Object.defineProperties this,

        for : value : ( count ) ->
            new this @malloc byteLength = count * 3 * 4

        TRIANGLES       : value : WebGL2RenderingContext.TRIANGLES
        TRIANGLE_FAN    : value : WebGL2RenderingContext.TRIANGLE_FAN
        TRIANGLE_STRIP  : value : WebGL2RenderingContext.TRIANGLE_STRIP

        LINE            : value : WebGL2RenderingContext.LINE
        LINE_LOOP       : value : WebGL2RenderingContext.LINE_LOOP
        LINE_STRIP      : value : WebGL2RenderingContext.LINE_STRIP

        POINTS          : value : WebGL2RenderingContext.POINTS

            
    Object.defineProperties this::,

        drawMode        :
            get         : -> @keyHeader OFFSET_OBJECT_0
            set         : -> @setHeader OFFSET_OBJECT_0, arguments[0]


export class GLProgram      extends GLPointer

    @byteLength         : 48

    Object.defineProperties this::,

        glProgram       :
            set : -> @setHeader OFFSET_OBJECT_0, arguments[0], yes
            get : ->
                return p if p = @getHeader OFFSET_OBJECT_0, yes
                return @glProgram = @gl.createProgram() 

        shaders         :
            get : -> @children.filter (v) -> v instanceof GLShader

        vertexShader    :
            get : -> @shaders.find (s) -> s.isVertex and s.isActive
            set : ( s ) ->
                for shader in @children 
                    break if has = yes unless s - shader
                unless has then @add s
                s.isActive = yes if @isActive

        fragmentShader  :
            get : -> @shaders.find (s) -> !s.isVertex and s.isActive
            set : ( s ) ->
                for shader in @children 
                    break if has = yes unless s - shader
                unless has then @add s
                s.isActive = yes if @isActive

        isInUse         :
            get         : -> @getUint32 OFFSET_PROGRAM_INUSE
            set         : ->
                @use() if @setUint32 OFFSET_PROGRAM_INUSE, arguments[0]

        isLinked        :
            get         : -> @getUint32 OFFSET_PROGRAM_LINKED
            set         : ->
                @link() if @setUint32 OFFSET_PROGRAM_LINKED, arguments[0]

        isActive        :
            get         : -> @getUint32 OFFSET_PROGRAM_ACTIVE
            set         : -> @setUint32 OFFSET_PROGRAM_ACTIVE, arguments[0]

        activate        : get : -> @create().parent.create()            

        variables       :
            get         : -> @shaders.map( GLShader.parse ).flat()

    link                : ->
        return this if @isLinked
        @gl.linkProgram @glProgram
        @isLinked = 1 ; this

    use                 : ->
        return this if @isInUse
        @gl.useProgram @glProgram
        @isInUse = 1 ; this

    create              : ->
        @glProgram = @gl.createProgram()

        for shader in @shaders
            shader.create()

        @link().use().isActive = 1 ; @

    draw                : ( ptr ) ->
        @add ptr
        console.log ptr

export class GLBuffer   extends GLPointer

export class GLShader   extends GLPointer

    @byteLength         : 1e5

    Object.defineProperties this,

        VERTEX_SHADER   : value : WebGL2RenderingContext.VERTEX_SHADER

        FRAGMENT_SHADER : value : WebGL2RenderingContext.FRAGMENT_SHADER

        TextEncoder     : value : new TextEncoder

        TextDecoder     : value : new TextDecoder

    Object.defineProperties this::,

        glProgram       :
            get : -> @parent.glProgram

        glShader        :
            set : -> @setHeader OFFSET_OBJECT_0, arguments[0], yes
            get : ->
                return p if p = @getHeader OFFSET_OBJECT_0, yes
                return @glShader = @gl.createShader @shaderType 

        isVertex        :
            get : -> /gl_Pos/.test @source 

        source          :
            get         : ->
                unless length = @charLength
                    return ""
                
                GLShader.TextDecoder.decode(
                    @subUint8( OFFSET_SHADER_SOURCE, @charLength )
                        .slice( 0 )
                )
                
            set         : ( source ) ->
                unless source instanceof Uint8Array
                    source = GLShader.TextEncoder.encode arguments[0] 

                tarray = @subUint8 OFFSET_SHADER_SOURCE, LENGTH_SHADER_SOURCE
                tarray.fill 0
                tarray.set source

                @charLength = source.byteLength
                @shaderType = switch @isVertex
                    when true then GLShader.VERTEX_SHADER
                    when no then GLShader.FRAGMENT_SHADER

        charLength      :
            get         : -> @getUint32 OFFSET_SOURCE_LENGTH
            set         : -> @setUint32 OFFSET_SOURCE_LENGTH, arguments[0]

        isUploaded      :
            get         : -> @getUint32 OFFSET_UPLOADED_STAT
            set         : ->
                @upload() if @setUint32 OFFSET_UPLOADED_STAT, arguments[0]

        isCompiled      :
            get         : -> @getUint32 OFFSET_COMPILED_STAT
            set         : ->
                @compile() if @setUint32 OFFSET_COMPILED_STAT, arguments[0]

        isAttached      :
            get         : -> @getUint32 OFFSET_ATTACHED_STAT
            set         : ->
                @attach() if @setUint32 OFFSET_ATTACHED_STAT, arguments[0]

        shaderType      :
            get         : -> keyOf @getUint32 OFFSET_SHADER_GLTYPE
            set         : -> @setUint32 OFFSET_SHADER_GLTYPE, arguments[0]

        isActive        :
            get         : -> @getUint32 OFFSET_SHADER_ACTIVE
            set         : -> @setUint32 OFFSET_SHADER_ACTIVE, arguments[0]

        variables       :
            get : -> GLShader.parse this


    create              : ->
        @upload().compile().attach().isActive = 1 ; @       

    upload              : ->
        return this if @isUploaded
        @gl.shaderSource @glShader, @source
        @isUploaded = 1 ; this

    compile             : ->
        return this if @isCompiled
        @gl.compileShader @glShader
        @isCompiled = 1 ; this

    attach              : ->
        return unless @glProgram
        return this if @isAttached
        @gl.attachShader @glProgram, @glShader
        @isAttached = 1 ; this

    @parse              : ->
        [ shader ] = arguments
        [ keys, offset ] = [ [], 0 ]
        { source, gl, glProgram } = shader

        source.split(/attribute/g).slice( 1 ).map ( line ) =>
            [ kind, type, name ] = line.split(/\;/g)[0].split /\s+/g

            keys.push key   = new GLVariable[ type ]
            key.name        = name
            key.location    = gl.getAttribLocation glProgram, name
            key.itemLength  = key.constructor.itemLength
            key.valueType   = key.FLOAT
            key.normalize   = no
            key.offset      = offset
            key.parent      = shader

            offset += key.itemLength * 4
        
        key.stride = offset for key in keys

        source.split(/uniform/g).slice( 1 ).map ( line ) =>
            [ kind, type, name ] = line.split(/\;/g)[0].split /\s+/g

            keys.push key   = new GLVariable[ type ]
            key.name        = name
            key.location    = gl.getUniformLocation glProgram, name
            key.itemLength  = key.constructor.itemLength
            key.valueType   = key.constructor.valueType
            key.parent      = shader

        keys        

export class GLServer   extends GLPointer

    @byteLength         : 4 * 30

    init                : ->
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
        
    ticks               : 0

    nextTick            : ->
        if  @isRendering
            @ticks++
            @gl.clear @clearMask
            @gl.drawArrays @gl.POINTS, 0, 3

    create              : ->
        @updateCull()
        @updateDepth()
        @updateBlend()
        @clear()
        @isRendering = 1 ; @

    fetch               : ( GL_PARAMETER ) ->
        @gl.getParameter parameter

    clear               : ->
        [ r, g, b, a ]  =                   @clearColor.toRGBA @
        @gl.clearColor                      r, g, b, a
        @gl.clear                           @clearMask
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
        @gl.viewport left, top, width, height if @gl

    Object.defineProperties this::,

        COLOR_CLEAR_VALUE:
            get         : -> @gl.getParameter @gl.COLOR_CLEAR_VALUE

        COLOR_WRITEMASK :
            get         : -> @gl.getParameter @gl.COLOR_WRITEMASK

        canvas          :
            get : -> @gl . canvas
            set : -> @gl = arguments[0].getContext "webgl2" 

        isRendering     :
            get         : -> @getHeader OFFSET_OBJECT_0
            set         : -> @setHeader OFFSET_OBJECT_0, arguments[ 0 ]

        programs        :
            get         : -> @children.filter (o) -> o instanceof GLProgram

        shaders         :
            get         : -> @programs.filter (o) -> o instanceof GLShader

        variables       :
            get         : -> @shaders .filter (o) -> o instanceof GLVariable

        bindTarget      :
            get         : -> @keyUint32 OFFSET_BIND_TARGET
            set         : -> @setUint32 OFFSET_BIND_TARGET, arguments[0]

        clearColor      :
            get         : -> @getColor4 OFFSET_CLEAR_COLOR
            set         : -> @setColor4 OFFSET_CLEAR_COLOR, arguments[0]

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

            