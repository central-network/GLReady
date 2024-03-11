import Pointer from "./ptr.coffee"

OFFSET_DRAW_ACTIVE  = 4 * 2
OFFSET_CULL_ENABLED = 4 * 2 + 1
OFFSET_BLEND_ACTIVE = 4 * 2 + 2
OFFSET_DEPTH_ACTIVE = 4 * 2 + 3

OFFSET_CULL_FACE    = 4 * 3
OFFSET_FRONTFACE    = 4 * 3 + 2
OFFSET_DEPTH_FUNC   = 4 * 4
OFFSET_CLEAR_MASK   = 4 * 4 + 2
OFFSET_CLEAR_DEPTH  = 4 * 5
OFFSET_CLEAR_COLOR  = 4 * 6
OFFSET_BIND_TARGET  = 4 * 7
OFFSET_BLEND_EQUATE = 4 * 7 + 2
OFFSET_BLEND_INARG  = 4 * 8
OFFSET_BLEND_OUTARG = 4 * 8 + 2
OFFSET_BLEND_FUNC   = 4 * 9
OFFSET_DEPTH_TEST   = 4 * 9 + 2

OFFSET_WALKING      = 4 * 10
OFFSET_JUMPING      = 4 * 10 + 1
OFFSET_KEY_SHIFT    = 4 * 10 + 2
OFFSET_KEY_ALT      = 4 * 10 + 3
OFFSET_KEY_CTRL     = 4 * 11
OFFSET_KEY_META     = 4 * 11 + 1
OFFSET_MOVE_FWD     = 4 * 11 + 2
OFFSET_MOVE_BACK    = 4 * 11 + 3
OFFSET_MOVE_LEFT    = 4 * 12
OFFSET_MOVE_RIGHT   = 4 * 12 + 1
OFFSET_MOVE_UP      = 4 * 12 + 2
OFFSET_MOVE_DOWN    = 4 * 12 + 3
OFFSET_LOOKING      = 4 * 13
OFFSET_ZOOMING      = 4 * 13 + 1
OFFSET_PTR_DCLICK   = 4 * 13 + 2
OFFSET_PTR_CLICK    = 4 * 13 + 3
OFFSET_PTR_BUTTON   = 4 * 14
OFFSET_ROTATING     = 4 * 15
OFFSET_DRAGGING     = 4 * 15 + 1
OFFSET_UX_ENABLED   = 4 * 15 + 2

OFFSET_X            = 4 * 21
OFFSET_Y            = 4 * 22
OFFSET_DX           = 4 * 23
OFFSET_DY           = 4 * 24
OFFSET_RX           = 4 * 25
OFFSET_RY           = 4 * 26
OFFSET_SX           = 4 * 27
OFFSET_SY           = 4 * 28
OFFSET_SZ           = 4 * 29
OFFSET_VX           = 4 * 30
OFFSET_VY           = 4 * 31
OFFSET_VZ           = 4 * 32
OFFSET_SHIFT_RATIO  = 4 * 33
OFFSET_TIME         = 4 * 34

OFFSET_WIDTH        = 4 * 40
OFFSET_HEIGHT       = 4 * 41
OFFSET_LEFT         = 4 * 42
OFFSET_TOP          = 4 * 43
OFFSET_PIXEL_RATIO  = 4 * 44
OFFSET_ASPECT_RATIO = 4 * 45

export class GL extends Pointer

    @byteLength     = 4 * 48

    @typedArray     = Uint32Array

    bindEvents      : ->
        canvas = @getCanvasNode()

        canvas . addEventListener "pointerup",    @onpointerfree.bind( @ )
        canvas . addEventListener "pointerdown",  @onpointerhold.bind( @ )
        canvas . addEventListener "pointermove",  @onpointermove.bind( @ ), passive: !0
        canvas . addEventListener "dblclick",     @ondoubleclick.bind( @ )
        canvas . addEventListener "click",        @oncanvasclick.bind( @ )
        canvas . addEventListener "wheel",        @onmousescroll.bind( @ ), passive: !0
        canvas . addEventListener "contextmenu",  @onpreventcall.bind( @ )

        this

    onpreventcall   : ->
        arguments[0].preventDefault()

    onpointerfree   : ->
        @setUint8 OFFSET_PTR_BUTTON + arguments[0].button, 0

    onpointerhold   : ->
        @setUint8 OFFSET_PTR_BUTTON + arguments[0].button, 1

    onpointermove   : ->
        { offsetX, offsetY } = arguments[0]

        @setXDelta( -@getX() + @setX offsetX )
            .setYRotate( -@getXDelta() / 100 ) % Math.PI

        @setYDelta( +@getY() - @setY offsetY )
            .setXRotate( -@getYDelta() / 100 ) % Math.PI

        @setLooking 1

    onmousescroll   : ->
        { deltaX, deltaY } = arguments[0]

        @setXScale deltaX
        @setZScale 0.01 * @setYScale deltaY
        
        @setZooming  1

    oncanvasclick   : -> @setPtrClick arguments[0].button

    ondoubleclick   : -> @setPtrDblClick arguments[0].button

    getAllPrograms  : -> @findAllChilds().filter (v) -> v instanceof Program

    getProgram      : -> @getAllPrograms().at 0 #TODO get active one

    getArrayBuffer  : -> @getTypedArray().slice().buffer

    getCanvasNode   : -> @getLinkedNode().canvas

    setCanvasNode   : -> @setLinkedNode arguments[0].getContext "webgl2" ; @

    getDrawActive   : -> @getUint8 OFFSET_DRAW_ACTIVE
    
    setDrawActive   : -> @setUint8 OFFSET_DRAW_ACTIVE, arguments[0] ; this

    getCullEnabled  : -> @getUint8 OFFSET_CULL_ENABLED
    
    setCullEnabled  : -> @setUint8 OFFSET_CULL_ENABLED, arguments[0] ; this

    getBlendActive  : -> @getUint8 OFFSET_BLEND_ACTIVE
    
    setBlendActive  : -> @setUint8 OFFSET_BLEND_ACTIVE, arguments[0] ; this

    getDepthActive  : -> @getUint8 OFFSET_DEPTH_ACTIVE
    
    setDepthActive  : -> @setUint8 OFFSET_DEPTH_ACTIVE, arguments[0] ; this

    getClearDepth   : -> @getFloat32 OFFSET_CLEAR_DEPTH
    
    setClearDepth   : -> @setFloat32 OFFSET_CLEAR_DEPTH, arguments[0] ; this

    keyDepthTest    : -> @keyUint16 OFFSET_DEPTH_TEST
    
    getDepthTest    : -> @getUint16 OFFSET_DEPTH_TEST
    
    setDepthTest    : -> @setUint16 OFFSET_DEPTH_TEST, arguments[0] ; this

    keyCullFace     : -> @keyUint16 OFFSET_CULL_FACE
    
    getCullFace     : -> @getUint16 OFFSET_CULL_FACE
    
    setCullFace     : -> @setUint16 OFFSET_CULL_FACE, arguments[0] ; this

    keyFrontFace    : -> @keyUint16 OFFSET_FRONTFACE
    
    getFrontFace    : -> @getUint16 OFFSET_FRONTFACE
    
    setFrontFace    : -> @setUint16 OFFSET_FRONTFACE, arguments[0] ; this

    keyDepthFunc    : -> @keyUint16 OFFSET_DEPTH_FUNC
    
    getDepthFunc    : -> @getUint16 OFFSET_DEPTH_FUNC
    
    setDepthFunc    : -> @setUint16 OFFSET_DEPTH_FUNC, arguments[0] ; this

    keyClearMask    : -> @keyUint16 OFFSET_CLEAR_MASK
    
    getClearMask    : -> @getUint16 OFFSET_CLEAR_MASK
    
    setClearMask    : -> @setUint16 OFFSET_CLEAR_MASK, arguments[0] ; this
    
    rgbClearColor   : -> @rgbColor4 OFFSET_CLEAR_COLOR
    
    getClearColor   : -> @getColor4 OFFSET_CLEAR_COLOR
    
    setClearColor   : -> @setColor4 OFFSET_CLEAR_COLOR, arguments[0] ; this

    keyBindTarget   : -> @keyUint16 OFFSET_BIND_TARGET
    
    getBindTarget   : -> @getUint16 OFFSET_BIND_TARGET
    
    setBindTarget   : -> @setUint16 OFFSET_BIND_TARGET, arguments[0] ; this

    keyBlendEquate  : -> @keyUint16 OFFSET_BLEND_EQUATE
    
    getBlendEquate  : -> @getUint16 OFFSET_BLEND_EQUATE
    
    setBlendEquate  : -> @setUint16 OFFSET_BLEND_EQUATE, arguments[0] ; this

    keyBlendInArg   : -> @keyUint16 OFFSET_BLEND_INARG
    
    getBlendInArg   : -> @getUint16 OFFSET_BLEND_INARG
    
    setBlendInArg   : -> @setUint16 OFFSET_BLEND_INARG, arguments[0] ; this

    keyBlendOutArg  : -> @keyUint16 OFFSET_BLEND_OUTARG
    
    getBlendOutArg  : -> @getUint16 OFFSET_BLEND_OUTARG
    
    setBlendOutArg  : -> @setUint16 OFFSET_BLEND_OUTARG, arguments[0] ; this

    keyBlendFunc    : -> @keyUint16 OFFSET_BLEND_FUNC
    
    getBlendFunc    : -> @getUint16 OFFSET_BLEND_FUNC
    
    setBlendFunc    : -> @setUint16 OFFSET_BLEND_FUNC, arguments[0] ; this
    
    getWidth        : -> @getFloat32 OFFSET_WIDTH
    
    setWidth        : -> @setFloat32 OFFSET_WIDTH, arguments[0] ; this

    getHeight       : -> @getFloat32 OFFSET_HEIGHT
    
    setHeight       : -> @setFloat32 OFFSET_HEIGHT, arguments[0] ; this

    getLeft         : -> @getFloat32 OFFSET_LEFT
    
    setLeft         : -> @setFloat32 OFFSET_LEFT, arguments[0] ; this

    getTop          : -> @getFloat32 OFFSET_TOP
    
    setTop          : -> @setFloat32 OFFSET_TOP, arguments[0] ; this

    getPixelRatio   : -> @getFloat32 OFFSET_PIXEL_RATIO
    
    setPixelRatio   : -> @setFloat32 OFFSET_PIXEL_RATIO, arguments[0] ; this

    getAspectRatio  : -> @getFloat32 OFFSET_ASPECT_RATIO
    
    setAspectRatio  : -> @setFloat32 OFFSET_ASPECT_RATIO, arguments[0] ; this

    getShiftRatio   : -> @getFloat32 OFFSET_SHIFT_RATIO
    
    setShiftRatio   : -> @setFloat32 OFFSET_SHIFT_RATIO, arguments[0] ; this

    getWalking      : -> @getUint8 OFFSET_WALKING
    
    setWalking      : -> @setUint8 OFFSET_WALKING, arguments[0] ; this

    getJumping      : -> @getUint8 OFFSET_JUMPING
    
    setJumping      : -> @setUint8 OFFSET_JUMPING, arguments[0] ; this 

    getLooking      : -> @getUint8 OFFSET_LOOKING
    
    setLooking      : -> @setUint8 OFFSET_LOOKING, arguments[0] ; this

    getZooming      : -> @getUint8 OFFSET_ZOOMING
    
    setZooming      : -> @setUint8 OFFSET_ZOOMING, arguments[0] ; this

    getDragging     : -> @getUint8 OFFSET_DRAGGING
    
    setDragging     : -> @setUint8 OFFSET_DRAGGING, arguments[0] ; this

    getRotating     : -> @getUint8 OFFSET_ROTATING
    
    setRotating     : -> @setUint8 OFFSET_ROTATING, arguments[0] ; this

    getKeyMeta      : -> @getUint8 OFFSET_KEY_META
    
    setKeyMeta      : -> @setUint8 OFFSET_KEY_META, arguments[0] ; this

    getKeyCtrl      : -> @getUint8 OFFSET_KEY_CTRL
    
    setKeyCtrl      : -> @setUint8 OFFSET_KEY_CTRL, arguments[0] ; this

    getKeyShift     : -> @getUint8 OFFSET_KEY_SHIFT
    
    setKeyShift     : -> @setUint8 OFFSET_KEY_SHIFT, arguments[0] ; this

    getKeyAlt       : -> @getUint8 OFFSET_KEY_ALT
    
    setKeyAlt       : -> @setUint8 OFFSET_KEY_ALT, arguments[0] ; this

    getMoveFwd      : -> @getUint8 OFFSET_MOVE_FWD
    
    setMoveFwd      : -> @setUint8 OFFSET_MOVE_FWD, arguments[0] ; this

    getMoveBack     : -> @getUint8 OFFSET_MOVE_BACK
    
    setMoveBack     : -> @setUint8 OFFSET_MOVE_BACK, arguments[0] ; this

    getMoveLeft     : -> @getUint8 OFFSET_MOVE_LEFT
    
    setMoveLeft     : -> @setUint8 OFFSET_MOVE_LEFT, arguments[0] ; this

    getMoveRight    : -> @getUint8 OFFSET_MOVE_RIGHT
    
    setMoveRight    : -> @setUint8 OFFSET_MOVE_RIGHT, arguments[0] ; this

    getMoveUp       : -> @getUint8 OFFSET_MOVE_UP
    
    setMoveUp       : -> @setUint8 OFFSET_MOVE_UP, arguments[0] ; this

    getMoveDown     : -> @getUint8 OFFSET_MOVE_DOWN
    
    setMoveDown     : -> @setUint8 OFFSET_MOVE_DOWN, arguments[0] ; this

    getPtrClick     : -> @getUint8 OFFSET_PTR_CLICK
    
    setPtrClick     : -> @setUint8 OFFSET_PTR_CLICK, arguments[0] ; this

    getPtrDblClick  : -> @getUint8 OFFSET_PTR_DCLICK
    
    setPtrDblClick  : -> @setUint8 OFFSET_PTR_DCLICK, arguments[0] ; this

    getUXEnabled    : -> @getUint8 OFFSET_UX_ENABLED
    
    setUXEnabled    : -> @setUint8 OFFSET_UX_ENABLED, arguments[0] ; this

    getX            : -> @getFloat32 OFFSET_X

    setX            : -> @setFloat32 OFFSET_X, arguments[0]

    getXDelta       : -> @getFloat32 OFFSET_DX

    setXDelta       : -> @setFloat32 OFFSET_DX, arguments[0] ; this

    getXRotate      : -> @getFloat32 OFFSET_RX

    setXRotate      : -> @setFloat32 OFFSET_RX, arguments[0]

    getXScale       : -> @getFloat32 OFFSET_SX

    setXScale       : -> @setFloat32 OFFSET_SX, arguments[0]

    getXVector      : -> @getFloat32 OFFSET_VX

    setXVector      : -> @setFloat32 OFFSET_VX, arguments[0]

    getY            : -> @getFloat32 OFFSET_Y

    setY            : -> @setFloat32 OFFSET_Y, arguments[0]

    getYDelta       : -> @getFloat32 OFFSET_DY

    setYDelta       : -> @setFloat32 OFFSET_DY, arguments[0] ; this

    getYRotate      : -> @getFloat32 OFFSET_RY

    setYRotate      : -> @setFloat32 OFFSET_RY, arguments[0]
    
    getYScale       : -> @getFloat32 OFFSET_SY

    setYScale       : -> @setFloat32 OFFSET_SY, arguments[0]

    getYVector      : -> @getFloat32 OFFSET_VY

    setYVector      : -> @setFloat32 OFFSET_VY, arguments[0]

    getZScale       : -> @getFloat32 OFFSET_SZ

    setZScale       : -> @setFloat32 OFFSET_SZ, arguments[0]

    getZVector      : -> @getFloat32 OFFSET_VZ

    setZVector      : -> @setFloat32 OFFSET_VZ, arguments[0]

    getVertShader   : -> @getProgram().getVertShader()

    setVertShader   : ->

        program = @getProgram()

        unless vShader = program.getVertShader()
            program.add vShader = new Shader() 

        vShader
            .setSourceText arguments[0]
            .upload().compile().attach()
            .check()

        ; @

    getFragShader   : -> @getProgram().getFragShader()

    setFragShader   : ->

        program = @getProgram()

        unless fShader = program.getFragShader()
            program.add fShader = new Shader()
            fShader.change Shader::FRAGMENT 

        fShader
            .setSourceText arguments[0]
            .upload().compile().attach()
            .check()

        ; @

    Object.defineProperties this::,

        gl              : get : GL::getLinkedNode

        nodeBuffer      : get : GL::getArrayBuffer

        nodeCanvas      : get : GL::getCanvasNode   , set : GL::setCanvasNode

        glActive        : get : GL::getDrawActive   , set : GL::setDrawActive
                
        glCullEnabled   : get : GL::getCullEnabled  , set : GL::setCullEnabled

        glCullFace      : get : GL::keyCullFace     , set : GL::setCullFace
        
        glFrontFace     : get : GL::keyFrontFace    , set : GL::setFrontFace
        
        glBlendEnabled  : get : GL::getBlendActive  , set : GL::setBlendActive
        
        glBlendEquation : get : GL::keyBlendEquate  , set : GL::setBlendEquate
        
        glBlendFunc     : get : GL::keyBlendFunc    , set : GL::setBlendFunc
        
        glBlendInArg    : get : GL::keyBlendInArg   , set : GL::setBlendInArg

        glBlendOutArg   : get : GL::keyBlendOutArg  , set : GL::setBlendOutArg
        
        glDepthEnabled  : get : GL::getDepthActive  , set : GL::setDepthActive
        
        glDepthTest     : get : GL::keyDepthTest    , set : GL::setDepthTest

        glDepthFunc     : get : GL::keyDepthFunc    , set : GL::setDepthFunc
        
        glClearMask     : get : GL::keyClearMask    , set : GL::setClearMask
        
        glBindTarget    : get : GL::keyBindTarget   , set : GL::setBindTarget
        
        glClearDepth    : get : GL::getClearDepth   , set : GL::setClearDepth
        
        glClearColor    : get : GL::getClearColor   , set : GL::setClearColor
        
        pxWidth         : get : GL::getWidth        , set : GL::setWidth
        
        pxHeight        : get : GL::getHeight       , set : GL::setHeight
        
        pxLeft          : get : GL::getLeft         , set : GL::setLeft
        
        pxTop           : get : GL::getTop          , set : GL::setTop

        ratioPixel      : get : GL::getPixelRatio   , set : GL::setPixelRatio
        
        ratioAspect     : get : GL::getAspectRatio  , set : GL::setAspectRatio
        
        ratioShift      : get : GL::getShiftRatio   , set : GL::setShiftRatio
        
        uxActive        : get : GL::getUXEnabled    , set : GL::setUXEnabled

        uxMoveWalking   : get : GL::getWalking      , set : GL::setWalking
        
        uxMoveJumping   : get : GL::getJumping      , set : GL::setJumping

        uxKeyShift      : get : GL::getKeyShift     , set : GL::setKeyShift
        
        uxKeyAlt        : get : GL::getKeyAlt       , set : GL::setKeyAlt

        uxKeyMeta       : get : GL::getKeyMeta      , set : GL::setKeyMeta

        uxKeyCtrl       : get : GL::getKeyCtrl      , set : GL::setKeyCtrl
        
        uxPtrClick      : get : GL::getPtrClick     , set : GL::setPtrClick
        
        uxPtrDblClick   : get : GL::getPtrDblClick  , set : GL::setPtrDblClick

        uxPtrLooking    : get : GL::getLooking      , set : GL::setLooking

        uxPtrZooming    : get : GL::getZooming      , set : GL::setZooming

        uxPtrDragging   : get : GL::getDragging     , set : GL::setDragging

        uxPtrRotating   : get : GL::getRotating     , set : GL::setRotating

        uxMoveFwd       : get : GL::getMoveFwd      , set : GL::setMoveFwd
        
        uxMoveBack      : get : GL::getMoveBack     , set : GL::setMoveBack
        
        uxMoveLeft      : get : GL::getMoveLeft     , set : GL::setMoveLeft
        
        uxMoveRight     : get : GL::getMoveRight    , set : GL::setMoveRight
        
        uxMoveUp        : get : GL::getMoveUp       , set : GL::setMoveUp
        
        uxMoveDown      : get : GL::getMoveDown     , set : GL::setMoveDown

        x               : get : GL::getX            , set : GL::setX

        xDelta          : get : GL::getXDelta       , set : GL::setXDelta

        xRotate         : get : GL::getXRotate      , set : GL::setXRotate

        xScale          : get : GL::getXScale       , set : GL::setXScale

        xVector         : get : GL::getXVector      , set : GL::setXVector

        y               : get : GL::getY            , set : GL::setY

        yDelta          : get : GL::getYDelta       , set : GL::setYDelta

        yRotate         : get : GL::getYRotate      , set : GL::setYRotate

        yScale          : get : GL::getYScale       , set : GL::setYScale

        yVector         : get : GL::getYVector      , set : GL::setYVector

        zScale          : get : GL::getZScale       , set : GL::setZScale

        zVector         : get : GL::getZVector      , set : GL::setZVector

        shaderVertex    : get : GL::getVertShader   , set : GL::setVertShader
        
        shaderFragment  : get : GL::getFragShader   , set : GL::setFragShader
        
export default GL.registerClass()

OFFSET_INUSE_STATUS     = 1

OFFSET_LINKED_STATUS    = 1 + 1

export class Program extends Pointer

        @byteLength     : 4 * 8

        @typedArray     : Int32Array

        link            : ->
            return if @getLinkedStatus()
            return unless gl = @getParentPtrO()
            
            gl.linkProgram @getGLProgram()
            @setLinkedStatus @getGLLinkStatus()

        create          : -> @getParentPtrO().createProgram()

        delete          : -> @getParentPtrO().deleteProgram @getGLProgram()

        getGLProgram    : -> @getLinkedNode() or @setGLProgram @create()
        
        setGLProgram    : -> @setLinkedNode( arguments[0] )

        getGLParameter  : -> @getParentPtrO().getProgramParameter @getGLProgram(), arguments[0]

        getGLLinkStatus : -> @getGLParameter WebGL2RenderingContext.LINK_STATUS 
        
        getGLValidate   : -> @getParentPtrO().validateProgram @getGLProgram() 
        
        getGLInfoLog    : -> @getParentPtrO().getProgramInfoLog @getGLProgram() 
        
        getGLIsProgram  : -> @getParentPtrO().isProgram @getGLProgram() 

        getGLShaders    : -> @getParentPtrO().getAttachedShaders @getGLProgram()

        getInUseStatus  : -> @getUint8 OFFSET_INUSE_STATUS

        setInUseStatus  : -> @getUint8 OFFSET_INUSE_STATUS, arguments[0]

        getLinkedStatus : -> @getUint8 OFFSET_LINKED_STATUS
        
        setLinkedStatus : -> @getUint8 OFFSET_LINKED_STATUS, arguments[0]

        getAllShaders   : -> @findAllChilds().filter (v) -> v instanceof Shader

        getVertShader   : -> @getAllShaders().find (v) -> v.isVertexShader() #TODO is active??

        setVertShader   : -> #TODO --> parse if it is a source text for type

        getGLVertShader : -> @getVertShader().getGLShader()

        getFragShader   : -> @getAllShaders().find (v) -> !v.isVertexShader() #TODO is active??

        setFragShader   : -> #TODO --> parse if it is a source text for type

        getGLFragShader : -> @getFragShader().getGLShader()

    Object.defineProperties Program.registerClass()::,

        gl              : get : Program::getParentPtrO

        glLinkStatus    : get : Program::getGLLinkStatus

        glShaders       : get : Program::getGLShaders

        glValidate      : get : Program::getGLValidate
        
        glInfoLog       : get : Program::getGLInfoLog

        glIsProgram     : get : Program::getGLIsProgram

        glVertexShader  : get : Program::getGLVertShader

        glProgram       : get : Program::getGLProgram
        
        shaders         : get : Program::getAllShaders

        isLinked        : get : Program::getLinkedStatus , set : Program::setLinkedNode
        
        isIsUse         : get : Program::getInUseStatus  , set : Program::setInUseStatus

        vertexShader    : get : Program::getVertShader   , set : Program::setVertShader
        
        fragmentShader  : get : Program::getFragShader   , set : Program::setFragShader


OFFSET_SHADER_TYPE      = 4 * 0

OFFSET_IS_UPLOADED      = 4 * 0 + 2

OFFSET_IS_COMPILED      = 4 * 0 + 3

OFFSET_IS_ATTACHED      = 4 * 1

OFFSET_IS_BUFFERED      = 4 * 1 + 1

OFFSET_CHAR_LENGTH      = 4 * 1 + 2

OFFSET_SOURCE_TEXT      = 4 * 2

export class Shader extends Pointer

    @byteLength         : 256 * 256

    @typedArray         : Uint8Array

    @Fragment           : -> new this().change @FRAGMENT

    SHADER_TYPE         : WebGLRenderingContext.SHADER_TYPE
    
    COMPILE_STATUS      : WebGLRenderingContext.COMPILE_STATUS
    
    DELETE_STATUS       : WebGLRenderingContext.DELETE_STATUS
    
    VERTEX              : WebGLRenderingContext.VERTEX_SHADER
    
    FRAGMENT            : WebGLRenderingContext.FRAGMENT_SHADER
    
    LOW_FLOAT           : WebGLRenderingContext.LOW_FLOAT
    
    LOW_INT             : WebGLRenderingContext.LOW_INT
    
    MEDIUM_FLOAT        : WebGLRenderingContext.MEDIUM_FLOAT
    
    HIGH_FLOAT          : WebGLRenderingContext.HIGH_FLOAT
    
    MEDIUM_INT          : WebGLRenderingContext.MEDIUM_INT
    
    HIGH_INT            : WebGLRenderingContext.HIGH_INT

    create              : -> @getGL().createShader @getShaderType() or @setShaderType @VERTEX

    delete              : -> @getGL().deleteShader @getLinkedNode() ; @

    change              : -> @create @delete().setShaderType( arguments[0] )

    attach              : -> @getGL().attachShader @getGLProgram(), @getGLShader() ; @

    upload              : -> @getGL().shaderSource @getGLShader(), @getSourceText() ; @

    compile             : -> @getGL().compileShader @getGLShader() ; @

    check               : ->
        @setIsUploaded @getSourceText() is @getGLSource()
        @setIsCompiled @getGLCompileStatus()
        @setIsAttached @getProgram().getGLShaders().includes @getGLShader()

    getProgram          : -> @getParentPtrP()

    getGL               : -> @getParentPtrP().getParentPtrO()

    getGLParameter      : -> @getGL().getShaderParameter @getGLShader(), arguments[0]

    getGLInfoLog        : -> @getGL().getShaderInfoLog @getGLShader()
    
    getGLIsShader       : -> @getGL().isShader @getGLShader()

    getGLPrecision      : -> @getGL().getShaderPrecisionFormat arguments[0], arguments[1]

    getGLShaderType     : -> @getGLParameter @SHADER_TYPE

    getGLCompileStatus  : -> @getGLParameter @COMPILE_STATUS
    
    getGLDeleteStatus   : -> @getGLParameter @DELETE_STATUS

    getGLProgram        : -> @getParentPtrP().getGLProgram()

    getGLShader         : -> @getLinkedNode() or @setGLShader @create()

    setGLShader         : -> @setLinkedNode( arguments[0] )

    getGLSource         : -> @getGL().getShaderSource @getGLShader()

    isVertexShader      : -> @getShaderType() is @VERTEX

    keyShaderType       : -> @keyUint16 OFFSET_SHADER_TYPE

    getShaderType       : -> @getUint16 OFFSET_SHADER_TYPE

    setShaderType       : -> @setUint16 OFFSET_SHADER_TYPE, arguments[0]

    getCharLength       : -> @getUint16 OFFSET_CHAR_LENGTH

    setCharLength       : -> @setUint16 OFFSET_CHAR_LENGTH, arguments[0]

    getSourceText       : -> @getString OFFSET_SOURCE_TEXT, OFFSET_CHAR_LENGTH

    setSourceText       : -> @setString OFFSET_SOURCE_TEXT, arguments[0], OFFSET_CHAR_LENGTH

    getIsBuffered       : -> @getUint8 OFFSET_IS_BUFFERED
    
    setIsBuffered       : -> @setUint8 OFFSET_IS_BUFFERED, arguments[0]

    getIsUploaded       : -> @getUint8 OFFSET_IS_UPLOADED
    
    setIsUploaded       : -> @setUint8 OFFSET_IS_UPLOADED, arguments[0]

    getIsCompiled       : -> @getUint8 OFFSET_IS_COMPILED
    
    setIsCompiled       : -> @setUint8 OFFSET_IS_COMPILED, arguments[0]

    getIsAttached       : -> @getUint8 OFFSET_IS_ATTACHED
    
    setIsAttached       : -> @setUint8 OFFSET_IS_ATTACHED, arguments[0]

    Object.defineProperties Shader.registerClass()::,

        gl              : get : Shader::getGL

        glProgram       : get : Shader::getGLProgram

        glSource        : get : Shader::getGLSource

        glShader        : get : Shader::getGLShader     , set : Shader::setGLShader

        type            : get : Shader::keyShaderType   , set : Shader::setShaderType

        source          : get : Shader::getSourceText   , set : Shader::setSourceText

        charLength      : get : Shader::getCharLength   , set : Shader::setCharLength

        isUploaded      : get : Shader::getIsUploaded   , set : Shader::setIsUploaded

        isCompiled      : get : Shader::getIsCompiled   , set : Shader::setIsCompiledd

        isAttached      : get : Shader::getIsAttached   , set : Shader::setIsAttached

        isBuffered      : get : Shader::getIsBuffered   , set : Shader::setIsBuffered
