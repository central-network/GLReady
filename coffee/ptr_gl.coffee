import { Pointer, Vertex, Angle3, Scale3, Color4, Matrix4 } from "./ptr.coffee"

OFFSET_DRAW_ACTIVE  = 4 * 0
OFFSET_CULL_ENABLED = 4 * 0 + 1
OFFSET_BLEND_ACTIVE = 4 * 0 + 2
OFFSET_DEPTH_ACTIVE = 4 * 0 + 3

OFFSET_CULL_FACE    = 4 *  1
OFFSET_FRONTFACE    = 4 *  1 + 2
OFFSET_DEPTH_FUNC   = 4 *  2
OFFSET_CLEAR_MASK   = 4 *  2 + 2
OFFSET_CLEAR_DEPTH  = 4 *  3
OFFSET_CLEAR_COLOR  = 4 *  4
OFFSET_BIND_TARGET  = 4 *  8
OFFSET_BLEND_EQUATE = 4 *  8 + 2
OFFSET_BLEND_INARG  = 4 *  9
OFFSET_BLEND_OUTARG = 4 *  9 + 2
OFFSET_BLEND_FUNC   = 4 * 10
OFFSET_DEPTH_TEST   = 4 * 10 + 2

OFFSET_WALKING      = 4 * 11
OFFSET_JUMPING      = 4 * 11 + 1
OFFSET_KEY_SHIFT    = 4 * 11 + 2
OFFSET_KEY_ALT      = 4 * 11 + 3
OFFSET_KEY_CTRL     = 4 * 12
OFFSET_KEY_META     = 4 * 12 + 1
OFFSET_MOVE_FWD     = 4 * 12 + 2
OFFSET_MOVE_BACK    = 4 * 12 + 3
OFFSET_MOVE_LEFT    = 4 * 13
OFFSET_MOVE_RIGHT   = 4 * 13 + 1
OFFSET_MOVE_UP      = 4 * 13 + 2
OFFSET_MOVE_DOWN    = 4 * 13 + 3
OFFSET_LOOKING      = 4 * 14
OFFSET_ZOOMING      = 4 * 14 + 1
OFFSET_PTR_DCLICK   = 4 * 14 + 2
OFFSET_PTR_CLICK    = 4 * 14 + 3
OFFSET_PTR_BUTTON   = 4 * 15
OFFSET_ROTATING     = 4 * 16
OFFSET_DRAGGING     = 4 * 16 + 1
OFFSET_UX_ENABLED   = 4 * 16 + 2

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

KEYEXTEND_CLEARMASK = [ 16640 ] : new (class DEPTH_N_COLOR_BIT extends Number) 16640

export { Pointer }

export class Object3 extends Pointer

export class Draw    extends Pointer

export class Mode    extends Pointer

export class GL      extends Pointer

    @byteLength     = 4 * 48

    @typedArray     = Uint32Array

    load            : ->
        { width, height, left, top } = arguments[ 0 ].getBoundingClientRect()
        [ ratioAspect , ratioPixel ] = [ width / height, self.devicePixelRatio || 1 ]

        this.setTop         top
        this.setHeight      height
        this.setWidth       width
        this.setLeft        left
        this.setAspectRatio ratioAspect
        this.setPixelRatio  ratioPixel

        arguments[0].width  = ratioPixel * width
        arguments[0].height = ratioPixel * height

        context = arguments[0].getContext "webgl2"
        context . viewport left, top, width, height
        context

    fork            : ->
        #? Or if you know that the parent function 
        #* doesn’t require arguments, 
        #! just call super():
        
        super()
        #: return super.fork();

    clear           : ->
        @gl.clearColor @clearColor...
        @gl.clear @clearMask

    getGLBuffer     : -> @getAllBuffers().at(0).getGLBuffer()
        
    getGLError      : -> @getLinkedNode().getError()

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
    
    getAllBuffers   : -> @findAllChilds().filter (p) -> p instanceof Buffer

    getAllShaders   : -> @getAllPrograms().flatMap (p) -> p.getAllShaders()

    getProgram      : -> @getAllPrograms().find (p) -> p.getInUseStatus()

    getVertShader   : -> @getProgram().getVertShader()

    getFragShader   : -> @getProgram().getFragShader()

    getAttributes   : -> @getProgram().getAttributes()

    getUniforms     : -> @getProgram().getUniforms()

    getAllVariables : -> @getProgram().getAllVariables()

    getArrayBuffer  : -> @getTypedArray().slice().buffer

    getCanvasNode   : -> @getLinkedNode().canvas

    setCanvasNode   : -> @setLinkedNode @load arguments[0] ; @

    getDrawActive   : -> @getUint8 OFFSET_DRAW_ACTIVE
    
    setDrawActive   : -> @setUint8 OFFSET_DRAW_ACTIVE      , arguments[0] ; this

    getCullEnabled  : -> @getUint8 OFFSET_CULL_ENABLED
    
    setCullEnabled  : -> @setUint8 OFFSET_CULL_ENABLED     , arguments[0] ; this

    getBlendActive  : -> @getUint8 OFFSET_BLEND_ACTIVE
    
    setBlendActive  : -> @setUint8 OFFSET_BLEND_ACTIVE     , arguments[0] ; this

    getDepthActive  : -> @getUint8 OFFSET_DEPTH_ACTIVE
    
    setDepthActive  : -> @setUint8 OFFSET_DEPTH_ACTIVE     , arguments[0] ; this

    getClearDepth   : -> @getFloat32 OFFSET_CLEAR_DEPTH
    
    setClearDepth   : -> @setFloat32 OFFSET_CLEAR_DEPTH    , arguments[0] ; this

    keyDepthTest    : -> @keyUint16 OFFSET_DEPTH_TEST
    
    getDepthTest    : -> @getUint16 OFFSET_DEPTH_TEST
    
    setDepthTest    : -> @setUint16 OFFSET_DEPTH_TEST      , arguments[0] ; this

    keyCullFace     : -> @keyUint16 OFFSET_CULL_FACE
    
    getCullFace     : -> @getUint16 OFFSET_CULL_FACE
    
    setCullFace     : -> @setUint16 OFFSET_CULL_FACE       , arguments[0] ; this

    keyFrontFace    : -> @keyUint16 OFFSET_FRONTFACE
    
    getFrontFace    : -> @getUint16 OFFSET_FRONTFACE
    
    setFrontFace    : -> @setUint16 OFFSET_FRONTFACE       , arguments[0] ; this

    keyDepthFunc    : -> @keyUint16 OFFSET_DEPTH_FUNC
    
    getDepthFunc    : -> @getUint16 OFFSET_DEPTH_FUNC
    
    setDepthFunc    : -> @setUint16 OFFSET_DEPTH_FUNC      , arguments[0] ; this

    keyClearMask    : -> @keyUint16 OFFSET_CLEAR_MASK      , KEYEXTEND_CLEARMASK 
    
    getClearMask    : -> @getUint16 OFFSET_CLEAR_MASK
    
    setClearMask    : -> @setUint16 OFFSET_CLEAR_MASK      , arguments[0] ; this
    
    getClearColor   : -> new Color4 @getByteOffset OFFSET_CLEAR_COLOR
    
    setClearColor   : -> @getClearColor().set ...arguments

    keyBindTarget   : -> @keyUint16 OFFSET_BIND_TARGET
    
    getBindTarget   : -> @getUint16 OFFSET_BIND_TARGET
    
    setBindTarget   : -> @setUint16 OFFSET_BIND_TARGET     , arguments[0] ; this

    keyBlendEquate  : -> @keyUint16 OFFSET_BLEND_EQUATE
    
    getBlendEquate  : -> @getUint16 OFFSET_BLEND_EQUATE
    
    setBlendEquate  : -> @setUint16 OFFSET_BLEND_EQUATE    , arguments[0] ; this

    keyBlendInArg   : -> @keyUint16 OFFSET_BLEND_INARG
    
    getBlendInArg   : -> @getUint16 OFFSET_BLEND_INARG
    
    setBlendInArg   : -> @setUint16 OFFSET_BLEND_INARG     , arguments[0] ; this

    keyBlendOutArg  : -> @keyUint16 OFFSET_BLEND_OUTARG
    
    getBlendOutArg  : -> @getUint16 OFFSET_BLEND_OUTARG
    
    setBlendOutArg  : -> @setUint16 OFFSET_BLEND_OUTARG    , arguments[0] ; this

    keyBlendFunc    : -> @keyUint16 OFFSET_BLEND_FUNC
    
    getBlendFunc    : -> @getUint16 OFFSET_BLEND_FUNC
    
    setBlendFunc    : -> @setUint16 OFFSET_BLEND_FUNC      , arguments[0] ; this
    
    getWidth        : -> @getFloat32 OFFSET_WIDTH
    
    setWidth        : -> @setFloat32 OFFSET_WIDTH          , arguments[0] ; this

    getHeight       : -> @getFloat32 OFFSET_HEIGHT
    
    setHeight       : -> @setFloat32 OFFSET_HEIGHT         , arguments[0] ; this

    getLeft         : -> @getFloat32 OFFSET_LEFT
    
    setLeft         : -> @setFloat32 OFFSET_LEFT           , arguments[0] ; this

    getTop          : -> @getFloat32 OFFSET_TOP
    
    setTop          : -> @setFloat32 OFFSET_TOP            , arguments[0] ; this

    getPixelRatio   : -> @getFloat32 OFFSET_PIXEL_RATIO
    
    setPixelRatio   : -> @setFloat32 OFFSET_PIXEL_RATIO    , arguments[0] ; this

    getAspectRatio  : -> @getFloat32 OFFSET_ASPECT_RATIO
    
    setAspectRatio  : -> @setFloat32 OFFSET_ASPECT_RATIO   , arguments[0] ; this

    getShiftRatio   : -> @getFloat32 OFFSET_SHIFT_RATIO
    
    setShiftRatio   : -> @setFloat32 OFFSET_SHIFT_RATIO    , arguments[0] ; this

    getWalking      : -> @getUint8 OFFSET_WALKING
    
    setWalking      : -> @setUint8 OFFSET_WALKING          , arguments[0] ; this

    getJumping      : -> @getUint8 OFFSET_JUMPING
    
    setJumping      : -> @setUint8 OFFSET_JUMPING          , arguments[0] ; this 

    getLooking      : -> @getUint8 OFFSET_LOOKING
    
    setLooking      : -> @setUint8 OFFSET_LOOKING          , arguments[0] ; this

    getZooming      : -> @getUint8 OFFSET_ZOOMING
    
    setZooming      : -> @setUint8 OFFSET_ZOOMING          , arguments[0] ; this

    getDragging     : -> @getUint8 OFFSET_DRAGGING
    
    setDragging     : -> @setUint8 OFFSET_DRAGGING         , arguments[0] ; this

    getRotating     : -> @getUint8 OFFSET_ROTATING
    
    setRotating     : -> @setUint8 OFFSET_ROTATING         , arguments[0] ; this

    getKeyMeta      : -> @getUint8 OFFSET_KEY_META
    
    setKeyMeta      : -> @setUint8 OFFSET_KEY_META         , arguments[0] ; this

    getKeyCtrl      : -> @getUint8 OFFSET_KEY_CTRL
    
    setKeyCtrl      : -> @setUint8 OFFSET_KEY_CTRL         , arguments[0] ; this

    getKeyShift     : -> @getUint8 OFFSET_KEY_SHIFT
    
    setKeyShift     : -> @setUint8 OFFSET_KEY_SHIFT        , arguments[0] ; this

    getKeyAlt       : -> @getUint8 OFFSET_KEY_ALT
    
    setKeyAlt       : -> @setUint8 OFFSET_KEY_ALT          , arguments[0] ; this

    getMoveFwd      : -> @getUint8 OFFSET_MOVE_FWD
    
    setMoveFwd      : -> @setUint8 OFFSET_MOVE_FWD         , arguments[0] ; this

    getMoveBack     : -> @getUint8 OFFSET_MOVE_BACK
    
    setMoveBack     : -> @setUint8 OFFSET_MOVE_BACK        , arguments[0] ; this

    getMoveLeft     : -> @getUint8 OFFSET_MOVE_LEFT
    
    setMoveLeft     : -> @setUint8 OFFSET_MOVE_LEFT        , arguments[0] ; this

    getMoveRight    : -> @getUint8 OFFSET_MOVE_RIGHT
    
    setMoveRight    : -> @setUint8 OFFSET_MOVE_RIGHT       , arguments[0] ; this

    getMoveUp       : -> @getUint8 OFFSET_MOVE_UP
    
    setMoveUp       : -> @setUint8 OFFSET_MOVE_UP          , arguments[0] ; this

    getMoveDown     : -> @getUint8 OFFSET_MOVE_DOWN
    
    setMoveDown     : -> @setUint8 OFFSET_MOVE_DOWN        , arguments[0] ; this

    getPtrClick     : -> @getUint8 OFFSET_PTR_CLICK
    
    setPtrClick     : -> @setUint8 OFFSET_PTR_CLICK        , arguments[0] ; this

    getPtrDblClick  : -> @getUint8 OFFSET_PTR_DCLICK
    
    setPtrDblClick  : -> @setUint8 OFFSET_PTR_DCLICK       , arguments[0] ; this

    getUXEnabled    : -> @getUint8 OFFSET_UX_ENABLED
    
    setUXEnabled    : -> @setUint8 OFFSET_UX_ENABLED       , arguments[0] ; this

    getX            : -> @getFloat32 OFFSET_X

    setX            : -> @setFloat32 OFFSET_X              , arguments[0]

    getXDelta       : -> @getFloat32 OFFSET_DX

    setXDelta       : -> @setFloat32 OFFSET_DX             , arguments[0] ; this

    getXRotate      : -> @getFloat32 OFFSET_RX

    setXRotate      : -> @setFloat32 OFFSET_RX             , arguments[0]

    getXScale       : -> @getFloat32 OFFSET_SX

    setXScale       : -> @setFloat32 OFFSET_SX             , arguments[0]

    getXVector      : -> @getFloat32 OFFSET_VX

    setXVector      : -> @setFloat32 OFFSET_VX             , arguments[0]

    getY            : -> @getFloat32 OFFSET_Y

    setY            : -> @setFloat32 OFFSET_Y              , arguments[0]

    getYDelta       : -> @getFloat32 OFFSET_DY

    setYDelta       : -> @setFloat32 OFFSET_DY             , arguments[0] ; this

    getYRotate      : -> @getFloat32 OFFSET_RY

    setYRotate      : -> @setFloat32 OFFSET_RY             , arguments[0]
    
    getYScale       : -> @getFloat32 OFFSET_SY

    setYScale       : -> @setFloat32 OFFSET_SY             , arguments[0]

    getYVector      : -> @getFloat32 OFFSET_VY

    setYVector      : -> @setFloat32 OFFSET_VY             , arguments[0]

    getZScale       : -> @getFloat32 OFFSET_SZ

    setZScale       : -> @setFloat32 OFFSET_SZ             , arguments[0]

    getZVector      : -> @getFloat32 OFFSET_VZ

    setZVector      : -> @setFloat32 OFFSET_VZ             , arguments[0]

Object.symbol GL,

    instance        : value : ->
        
        @isPrototypeOf Object.getPrototypeOf arguments[0]

Object.define GL::,

    gl              : get : GL::getLinkedNode

    glError         : get : GL::getGLError

    program         : get : GL::getProgram

    programVertex   : get : GL::getVertShader

    programFragment : get : GL::getFragShader

    programAttribs  : get : GL::getAttributes

    programUniforms : get : GL::getUniforms

    glBuffer        : get : GL::getGLBuffer

    buffers         : get : GL::getAllBuffers 

    allShaders      : get : GL::getAllShaders

    allPrograms     : get : GL::getAllPrograms

    allVariables    : get : GL::getAllVariables

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
    
    clearMask       : get : GL::keyClearMask    , set : GL::setClearMask
    
    glBindTarget    : get : GL::keyBindTarget   , set : GL::setBindTarget
    
    glClearDepth    : get : GL::getClearDepth   , set : GL::setClearDepth
    
    clearColor      : get : GL::getClearColor   , set : GL::setClearColor
    
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

export default GL.registerClass()

OFFSET_INUSE_STATUS     = 1

OFFSET_LINKED_STATUS    = 1 + 1

OFFSET_ATTACH_STATUS    = 1 + 2

export class Program extends Pointer

        @byteLength     : 4 * 8

        @typedArray     : Int32Array

        LINK_STATUS     : WebGL2RenderingContext.LINK_STATUS

        link            : ->
            return this if @getLinkedStatus()
            @getParentPtrO().linkProgram @getGLProgram()

            return this unless @setLinkedStatus @getGLLinkStatus @getGLValidate()
            for attr in @getAttributes()
                attr    .getGLLocation()
                attr    .bindFunctions()

            return this

        use             : ->
            return this if @getUint8 OFFSET_INUSE_STATUS
            @getParentPtrO().useProgram @getLinkedNode()
            @setAttachStatus @setInUseStatus Boolean this ; this
            
        load            : -> @link().use() unless @getAttachStatus() ; this

        create          : ->
            @getParentPtrO().createProgram()

        delete          : ->
            @getParentPtrO().deleteProgram @getGLProgram()
            @setLinkedStatus @setInUseStatus 0 ; this

        getGLProgram    : -> @getLinkedNode() or @setGLProgram @create()
        
        setGLProgram    : -> @setLinkedNode( arguments[0] )

        getGLParameter  : -> @getParentPtrO().getProgramParameter @getGLProgram(), arguments[0]

        getGLLinkStatus : -> @getGLParameter @LINK_STATUS 
        
        getGLValidate   : -> @getParentPtrO().validateProgram @getGLProgram()
        
        getGLInfoLog    : -> @getParentPtrO().getProgramInfoLog @getGLProgram() 
        
        getGLIsProgram  : -> @getParentPtrO().isProgram @getGLProgram() 

        getGLShaders    : -> @getParentPtrO().getAttachedShaders @getGLProgram()

        getInUseStatus  : -> @getUint8 OFFSET_INUSE_STATUS

        setInUseStatus  : -> @setUint8 OFFSET_INUSE_STATUS, arguments[0]

        getLinkedStatus : -> @getUint8 OFFSET_LINKED_STATUS
        
        setLinkedStatus : -> @setUint8 OFFSET_LINKED_STATUS, arguments[0]

        getAttachStatus : -> @getUint8 OFFSET_ATTACH_STATUS
        
        setAttachStatus : -> @setUint8 OFFSET_ATTACH_STATUS, arguments[0]

        getAllShaders   : -> @findAllChilds().filter (v) -> v instanceof Shader

        getVertShader   : -> @getAllShaders().find (v) -> v.getIsAttached() and  v.isVertexShader()

        getFragShader   : -> @getAllShaders().find (v) -> v.getIsAttached() and !v.isVertexShader()

        getGLVertShader : -> @getVertShader().getGLShader()

        getGLFragShader : -> @getFragShader().getGLShader()

        getAttributes   : -> @getVertShader().getAttributes()

        getUniforms     : -> @getVertShader().getUniforms()
        
        getAllVariables : -> @getVertShader().getAllVariables()

        setVertShader   : ->

            unless vShader = @getVertShader()
                if  arguments[0].constructor is String
                    vShader = Shader.fromSource arguments[0] 

            if  vShader instanceof Shader
                @add vShader
                vShader.load()

            @load() if @getFragShader()

            ; @
    
        setFragShader   : ->

            unless fShader = @getFragShader()
                if  arguments[0].constructor is String
                    fShader = Shader.fromSource arguments[0]

            if  fShader instanceof Shader
                @add fShader
                fShader.load()

            @load() if @getVertShader()

            ; @

    Object.define Program.registerClass()::,

        gl              : get : Program::getParentPtrO

        glLinkStatus    : get : Program::getGLLinkStatus

        glShaders       : get : Program::getGLShaders

        glInfoLog       : get : Program::getGLInfoLog

        glIsProgram     : get : Program::getGLIsProgram

        glVertexShader  : get : Program::getGLVertShader

        glProgram       : get : Program::getGLProgram
        
        shaders         : get : Program::getAllShaders

        isLinked        : get : Program::getLinkedStatus , set : Program::setLinkedNode
        
        isIsUse         : get : Program::getInUseStatus  , set : Program::setInUseStatus
        
        isAttached      : get : Program::getAttachStatus , set : Program::setAttachStatus

        vertexShader    : get : Program::getVertShader   , set : Program::setVertShader
        
        fragmentShader  : get : Program::getFragShader   , set : Program::setFragShader

        attributes      : get : Program::getAttributes

        uniforms        : get : Program::getUniforms

        variables       : get : Program::getAllVariables

OFFSET_SHADER_TYPE      = 4 * 0

OFFSET_IS_UPLOADED      = 4 * 0 + 2

OFFSET_IS_COMPILED      = 4 * 0 + 3

OFFSET_IS_ATTACHED      = 4 * 1

OFFSET_CHAR_LENGTH      = 4 * 1 + 2

OFFSET_SOURCE_TEXT      = 4 * 2

export class Shader extends Pointer

    @byteLength         : 256 * 256

    @typedArray         : Uint8Array

    @parse              : ->
        [ ...Uniform.parse( arguments[0]), ...Attribute.parse( arguments[0] ) ]

    @fromSource         : ->
        textSource = arguments[0]
        parsedKeys = @parse textSource
        shaderType = if /gl_Frag/.test textSource
            Shader::FRAGMENT
        else Shader::VERTEX

        byteSource = new TextEncoder().encode textSource
        charLength = byteSource.byteLength
        byteLength = charLength + OFFSET_SOURCE_TEXT

        ptr = Shader.malloc byteLength
        ptr . setCharLength charLength
        ptr . setByteSource byteSource
        ptr . setShaderType shaderType

        for key in parsedKeys
            key.setParentPtri ptr

        ptr
        
    toString            : -> @getSourceText()        

    SHADER_TYPE         : WebGL2RenderingContext.SHADER_TYPE
    
    COMPILE_STATUS      : WebGL2RenderingContext.COMPILE_STATUS
    
    DELETE_STATUS       : WebGL2RenderingContext.DELETE_STATUS
    
    VERTEX              : WebGL2RenderingContext.VERTEX_SHADER
    
    FRAGMENT            : WebGL2RenderingContext.FRAGMENT_SHADER
    
    LOW_FLOAT           : WebGL2RenderingContext.LOW_FLOAT
    
    LOW_INT             : WebGL2RenderingContext.LOW_INT
    
    MEDIUM_FLOAT        : WebGL2RenderingContext.MEDIUM_FLOAT
    
    HIGH_FLOAT          : WebGL2RenderingContext.HIGH_FLOAT
    
    MEDIUM_INT          : WebGL2RenderingContext.MEDIUM_INT
    
    HIGH_INT            : WebGL2RenderingContext.HIGH_INT

    create              : -> @getGL().createShader @getShaderType() or @setShaderType arguments[0]

    delete              : -> @unload() if this . getLinkedNode() ; this

    change              : -> @unload().create( arguments[0] ).reload()

    upload              : ->
        return this if @getIsUploaded()
        @getGL().shaderSource @getGLShader(), @getSourceText()
        @setIsUploaded 1 ; return this

    compile             : ->
        return this if @getIsCompiled()
        @getGL().compileShader @getGLShader(), @getSourceText()
        @setIsCompiled 1 ; return this
        
    attach              : ->


        return this if @getIsAttached()
        @getGL().attachShader @getGLProgram(), @getGLShader()
        @setIsAttached 1 ; return this

    load                : ->

        @upload().compile().attach().check() ; @

    parse               : ->
        return this unless @isVertexShader()
        @getAllVariables().forEach Pointer.removePointer
        @add key for key in Shader.parse @getSourceText()
        ; @

    reload              : ->
        @unload().load() ; @

    unload              : ->
        @setIsCompiled @setIsAttached @setIsUploaded 0 
        @getGL().deleteShader node if node = @getLinkedNode() ; @

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

    isVertexShader      : -> @getShaderType() is @VERTEX

    getGLShader         : -> @getLinkedNode() or @setGLShader @create @VERTEX

    setGLShader         : -> @setLinkedNode( arguments[0] ) ; arguments[0]

    setGLSource         : -> @getGL().shaderSource @getGLShader(), @getSourceText() ; @

    getGLSource         : -> @getGL().getShaderSource @getGLShader()
    
    keyShaderType       : -> @keyUint16 OFFSET_SHADER_TYPE

    getShaderType       : -> @getUint16 OFFSET_SHADER_TYPE

    setShaderType       : -> @setUint16 OFFSET_SHADER_TYPE , arguments[0] ; this

    getCharLength       : -> @getUint16 OFFSET_CHAR_LENGTH

    setCharLength       : -> @setUint16 OFFSET_CHAR_LENGTH , arguments[0]

    getSourceText       : -> @getString OFFSET_SOURCE_TEXT , OFFSET_CHAR_LENGTH

    setSourceText       : -> @setString OFFSET_SOURCE_TEXT , arguments[0] , OFFSET_CHAR_LENGTH
    
    getByteSource       : -> @getTArray OFFSET_SOURCE_TEXT

    setByteSource       : -> @setTArray OFFSET_SOURCE_TEXT , arguments[0] ; this

    getIsUploaded       : -> @getUint8  OFFSET_IS_UPLOADED
    
    setIsUploaded       : -> @setUint8  OFFSET_IS_UPLOADED , arguments[0]

    getIsCompiled       : -> @getUint8  OFFSET_IS_COMPILED
    
    setIsCompiled       : -> @setUint8  OFFSET_IS_COMPILED , arguments[0]

    getIsAttached       : -> @getUint8  OFFSET_IS_ATTACHED
    
    setIsAttached       : -> @setUint8  OFFSET_IS_ATTACHED , arguments[0]

    getAllVariables     : -> @findAllChilds().filter (i) -> i instanceof ShaderKey

    getAttributes       : -> @findAllChilds().filter (i) -> i instanceof Attribute

    getUniforms         : -> @findAllChilds().filter (i) -> i instanceof Uniform

    Object.define Shader.registerClass()::,

        gl              : get : Shader::getGL

        glProgram       : get : Shader::getGLProgram

        glSource        : get : Shader::getGLSource     , set : Shader::setGLSource

        glShader        : get : Shader::getGLShader     , set : Shader::setGLShader

        type            : get : Shader::keyShaderType   , set : Shader::setShaderType

        source          : get : Shader::getSourceText   , set : Shader::setSourceText

        charLength      : get : Shader::getCharLength   , set : Shader::setCharLength

        isUploaded      : get : Shader::getIsUploaded   , set : Shader::setIsUploaded

        isCompiled      : get : Shader::getIsCompiled   , set : Shader::setIsCompiled

        isAttached      : get : Shader::getIsAttached   , set : Shader::setIsAttached

        variables       : get : Shader::getAllVariables

        uniforms        : get : Shader::getUniforms

        attributes      : get : Shader::getAttributes  
        
        sumComponents   : get : -> @attributes.sumAttrib "components"
        
        stride          : get : -> @attributes[ 0 ].stride

OFFSET_TYPE_GLCODE      = 4 * 2

OFFSET_NCOMPONENTS      = 4 * 2 + 2

OFFSET_KEY_LOCATED      = 4 * 2 + 3

OFFSET_NAME_LENGTH      = 4 * 3 + 2

OFFSET_NAME_TARRAY      = 4 * 4

export class ShaderKey  extends Pointer

    @byteLength         : 4 * 8

    @typedArray         : Uint8Array

    enable              : -> @getLinkedNode()()

    getGL               : -> @getShader().getGL()

    getShader           : -> @getParentPtrP()

    getGLShader         : -> @getShader().getGLShader()

    getGLProgram        : -> @getShader().getGLProgram()

    getProgram          : -> @getShader().getProgram()

    getNameString       : -> @getString OFFSET_NAME_TARRAY , OFFSET_NAME_LENGTH

    keyTypeGLCode       : -> @keyUint16 OFFSET_TYPE_GLCODE

    setNameString       : -> @setString OFFSET_NAME_TARRAY , arguments[0] , OFFSET_NAME_LENGTH

    getNameLength       : -> @getUint16 OFFSET_NAME_LENGTH

    setNameLength       : -> @setUint16 OFFSET_NAME_LENGTH , arguments[0]
    
    getTypeGLCode       : -> @getUint16 OFFSET_TYPE_GLCODE

    setTypeGLCode       : -> @setUint16 OFFSET_TYPE_GLCODE , arguments[0]

    getComponents       : -> @getUint8  OFFSET_NCOMPONENTS

    setComponents       : -> @setUint8  OFFSET_NCOMPONENTS , arguments[0]

    getKeyLocated       : -> @getUint8  OFFSET_KEY_LOCATED

    setKeyLocated       : -> @setUint8  OFFSET_KEY_LOCATED , arguments[0] ; arguments[0]

Object.define ShaderKey.registerClass()::,

    gl                  : get : ShaderKey::getGL

    glProgram           : get : ShaderKey::getGLProgram

    glShader            : get : ShaderKey::getGLShader
    
    program             : get : ShaderKey::getProgram

    shader              : get : ShaderKey::getShader

    name                : get : ShaderKey::getNameString    , set : ShaderKey::setNameString
    
    components          : get : ShaderKey::getComponents    , set : ShaderKey::setComponents

    type                : get : ShaderKey::keyTypeGLCode    , set : ShaderKey::setTypeGLCode

OFFSET_LOCATION_AT      = 4 * 0

OFFSET_ISNORMALIZE      = 4 * 0 + 1

OFFSET_ATTR_STRIDE      = 4 * 0 + 2

OFFSET_ATTR_OFFSET      = 4 * 0 + 3

export class Attribute  extends ShaderKey

    Object.define Attribute.registerClass(),
        
        vec3    : value : class  vec3 extends this
            @components : 3
            @protoClass : 0
            @registerClass()

        vec4    : value : class  vec4 extends this 
            @components : 4
            @protoClass : 0
            @registerClass()
        
        mat4    : value : class  mat4 extends this 
            @components : 16
            @protoClass : 0
            @registerClass()

        float   : value : class float extends this 
            @components : 1
            @protoClass : 0
            @registerClass()

    @parse              : ->
        [ source ] = arguments
        [ keys, offset ] = [ [], 0 ]

        source.split(/attribute/g).slice( 1 ).map ( line ) =>
            [ , type, name ] = line.split(/\;/g)[0].split /\s+/g
            
            keys.push key =     new Attribute[ type ]

            key.setNameString   name
            key.setComponents   key.constructor.components
            key.setTypeGLCode   WebGL2RenderingContext.FLOAT
            key.setNormalize    off
            key.setOffset       offset

            offset += key.getComponents() * 4
        
        for key in keys
            key.setStride offset 

        keys

    getGLLocation       : ->
        l = @getGL().getAttribLocation @getGLProgram(), @getNameString()
        @setKeyLocated 1 ; @setLocation l ; l
    
    getLocation         : ->
        @getGLLocation() unless @getKeyLocated()
        @getUint8 OFFSET_LOCATION_AT

    bindFunctions       : ->

        ( argv = arguments[0] ? this )

        return argv unless @getKeyLocated() 

        [ gl , at ] = [ @getGL() , @getLocation() ]
        [ attr , name ] = [ this , @name ]

        if  @getLinkedNode()
            @delLinkedNode()
            console.error "caller deleted from attribute key", this

        enable  = gl.enableVertexAttribArray.bind gl, at
        pointer = gl.vertexAttribPointer.bind(
            gl, at, @getComponents(), @getTypeGLCode(),
            @getNormalize(), @getStride(), @getOffset()
        )

        log "call defined  <-  #{name}"

        @setLinkedNode ->
            
            enable()
            pointer()

            log "attr enabled  <-  #{name}"

            ; null

        argv

    setLocation         : -> @setUint8 OFFSET_LOCATION_AT , arguments[0]

    getNormalize        : -> @getUint8 OFFSET_ISNORMALIZE

    setNormalize        : -> @setUint8 OFFSET_ISNORMALIZE , arguments[0]

    getStride           : -> @getUint8 OFFSET_ATTR_STRIDE

    setStride           : -> @setUint8 OFFSET_ATTR_STRIDE , arguments[0]

    getOffset           : -> @getUint8 OFFSET_ATTR_OFFSET

    setOffset           : -> @setUint8 OFFSET_ATTR_OFFSET , arguments[0]

Object.define Attribute::,

    glLocation          : get : Attribute::getGLLocation

    location            : get : Attribute::getLocation      , set : Attribute::setLocation

    stride              : get : Attribute::getStride        , set : Attribute::setStride

    offset              : get : Attribute::getOffset        , set : Attribute::setOffset

    normalize           : get : Attribute::getNormalize     , set : Attribute::setNormalize

export class Uniform    extends ShaderKey

    Object.define Uniform.registerClass(),
        
        vec3    : value : class  vec3 extends this
            @components : 3
            @protoClass : 0
            @registerClass()

        vec4    : value : class  vec4 extends this 
            @components : 4
            @protoClass : 0
            @registerClass()
        
        mat4    : value : class  mat4 extends this 
            @components : 16
            @protoClass : 0
            @registerClass()

        float   : value : class float extends this 
            @components : 1
            @protoClass : 0
            @registerClass()

    @parse              : ->
        
        [ source ]      = arguments

        [ keys   ]      = [ [] ]

        source.split(/uniform/g).slice( 1 ).map ( line ) =>
            [ , type, name ] = line.split(/\;/g)[0].split /\s+/g

            keys.push key =     new Uniform[ type ]
            key.setNameString   name
            key.setComponents   key.constructor.components
            key.setTypeGLCode   WebGL2RenderingContext.FLOAT

        keys

    getGLLocation       : ->
        return @getLinkedNode() if @getKeyLocated()
        return unless gl = @getGL()
        return unless program = @getGLProgram()
        return unless location = gl.getUniformLocation program, @getNameString()
        @setKeyLocated 1 ; @setLinkedNode location ; locatio

Object.define Uniform::,

    glLocation          : get : Uniform::getGLLocation

    location            : get : Uniform::getGLLocation

KEYEXTEND_OBJECT3D      =
    [ WebGL2RenderingContext        .POINTS ] : new (class           POINTS extends Number) WebGL2RenderingContext        .POINTS
    [ WebGL2RenderingContext         .LINES ] : new (class            LINES extends Number) WebGL2RenderingContext         .LINES
    [ WebGL2RenderingContext     .LINE_LOOP ] : new (class        LINE_LOOP extends Number) WebGL2RenderingContext     .LINE_LOOP
    [ WebGL2RenderingContext    .LINE_STRIP ] : new (class       LINE_STRIP extends Number) WebGL2RenderingContext    .LINE_STRIP
    [ WebGL2RenderingContext     .TRIANGLES ] : new (class        TRIANGLES extends Number) WebGL2RenderingContext     .TRIANGLES
    [ WebGL2RenderingContext  .TRIANGLE_FAN ] : new (class     TRIANGLE_FAN extends Number) WebGL2RenderingContext  .TRIANGLE_FAN
    [ WebGL2RenderingContext.TRIANGLE_STRIP ] : new (class   TRIANGLE_STRIP extends Number) WebGL2RenderingContext.TRIANGLE_STRIP

Object.define Draw.registerClass(),

    byteLength          : value : 4 * 0

    typedArray          : value : Uint32Array

Object.hidden Draw,

    "parent", "link", "array",
    "headers", "protoClass", "length",  
    "children", "byteOffset", "byteLength", 

Object.define Draw::,

    getGL               : value : -> @ptrParentNode().getGL()

    getTarget           : value : -> @ptrParentNode().ptrParentNode().getBindTarget()

    getSrcData          : value : -> @ptrParentNode().ptrParentNode().getTypedArray()

    keyTypeGLCode       : value : -> @ptrParentNode().keyTypeGLCode()

    getDstOffset        : value : -> @getResvUint32 0

    setDstOffset        : value : -> @setResvUint32 0, arguments[0]

    getModeBegin        : value : -> @getResvUint32 3
    
    setModeBegin        : value : -> @setResvUint32 3, arguments[0]

    getModeEnd          : value : -> @getResvUint32 4
    
    setModeEnd          : value : -> @setResvUint32 4, arguments[0]

    getStart            : value : -> @getResvUint32 1

    setStart            : value : -> @setResvUint32 1, arguments[0]

    getCount            : value : -> @getResvUint32 2

    setCount            : value : -> @setResvUint32 2, arguments[0]

    getAttributes       : value : -> @ptrParentNode().getAttributes().subarray( @getModeBegin(), @getModeEnd() )

    setAttributes       : value : -> @getAttributes().set arguments[0] ; this

    getVertices         : value : -> @ptrLinkedNode().getVertices()
    
    getColor            : value : -> @ptrLinkedNode().getColor()

    getMatrix           : value : -> @ptrLinkedNode().getMatrix()

    upload              : value : -> @gl.bufferSubData @target, @dstOffset, @srcData, @start, @count ; this

Object.define Draw::,

    gl                  : get   : Draw::getGL

    target              : get   : Draw::getTarget

    srcData             : get   : Draw::getSrcData

    object3             : get   : Draw::ptrLinkedNode   , set   : Draw::setLinkedPtri

    mode                : get   : Draw::ptrParentNode   , set   : Draw::setParentPtri
    
    type                : get   : Draw::keyTypeGLCode

    dstOffset           : get   : Draw::getDstOffset    , set   : Draw::setDstOffset
    
    start               : get   : Draw::getStart        , set   : Draw::setStart

    count               : get   : Draw::getCount        , set   : Draw::setCount
    
    attributes          : get   : Draw::getAttributes

    vertices            : get   : Draw::getVertices

    color               : get   : Draw::getColor

    matrix              : get   : Draw::getMatrix

Object.symbol Mode::,

    iterate             : value : ->
        draw = this ; ptri = 0.00
        next : ->
            unless ptri = draw . getNextChild ptri
                return done : on , value : draw
            return done : no , value : ptri
    
Object.define Mode.registerClass(),

    byteLength          : value : 4 * 0

    typedArray          : value : Uint32Array

Object.hidden Mode  ,

    "array", "byteLength", "byteOffset", "headers", 
    "length", "link", "protoClass"

Object.define Mode::,

    is                  : value : ->
        0 is @getTypeGLCode() - arguments[0]

    malloc              : value : ->

        obj3 = arguments[ 0 ]
        vertices = obj3.getVertices()
        components = @getComponents()

        count = vertices.length / 3
        length = count * components
        byteLength = length * vertices.BYTES_PER_ELEMENT
        mallocOffset = @addAllocBytes byteLength
        destOffset = @getModeOffset() + mallocOffset

        @addModeLength length 
        @addDrawLength count

        draw = new Draw()

        draw . setParentPtri this
        draw . setLinkedPtri obj3
        draw . setDstOffset destOffset
        draw . setStart destOffset / 4
        draw . setCount length
        draw . setModeBegin mallocOffset / 4
        draw . setModeEnd draw.getModeBegin() + length

        draw

    draw                : value : -> @gl.drawArrays @mode, @first, @count

Object.define Mode::,

    getGL               : value : -> @getParentPtrP().getGL()

    findObjects         : value : -> @findAllChilds().flatMap (v) -> v.object3

    getComponents       : value : -> @getResvUint16 0

    setComponents       : value : -> @setResvUint16 0, arguments[0]

    keyTypeGLCode       : value : -> @keyResvUint16 1, KEYEXTEND_OBJECT3D

    getTypeGLCode       : value : -> @getResvUint16 1

    setTypeGLCode       : value : -> @setResvUint16 1, arguments[0]

    getFirstIndex       : value : -> @getResvUint32 1

    setFirstIndex       : value : -> @setResvUint32 1, arguments[0]

    getModeLength       : value : -> @getResvUint32 2
    
    addModeLength       : value : -> @addResvUint32 2, arguments[0]

    setModeLength       : value : -> @setResvUint32 2, arguments[0]

    getDrawLength       : value : -> @getResvUint32 3

    addDrawLength       : value : -> @addResvUint32 3, arguments[0]
    
    setDrawLength       : value : -> @setResvUint32 3, arguments[0]
        
    getAllocBytes       : value : -> @getResvUint32 4
    
    addAllocBytes       : value : -> @addResvUint32 4, arguments[0]

    setAllocBytes       : value : -> @setResvUint32 4, arguments[0]

    getModeOffset       : value : -> @getResvUint32 5

    setModeOffset       : value : -> @setResvUint32 5, arguments[0]    
    
    getAttributes       : value : -> @getParentPtrP().getTArray @getModeOffset(), @getAllocBytes()

    setAttributes       : value : -> @getAttributes().set arguments[0] ; this

Object.define Mode::,

    gl                  : get   : Mode::getGL

    objects             : get   : Mode::findObjects

    mode                : get   : Mode::keyTypeGLCode , set   : Mode::setTypeGLCode

    first               : get   : Mode::getFirstIndex , set   : Mode::setFirstIndex
    
    count               : get   : Mode::getDrawLength , set   : Mode::setDrawLength
    
    offset              : get   : Mode::getModeOffset , set   : Mode::setModeOffset 
    
    numCmponents        : get   : Mode::getComponents , set   : Mode::setComponents

    attributes          : get   : Mode::getAttributes , set   : Mode::setAttributes

export class Buffer extends Pointer

    @byteLength         : 4 * 256 * 256

    @typedArray         : Float32Array

    Object.define this::,

        STATIC_DRAW     : value : WebGLRenderingContext.STATIC_DRAW

        DYNAMIC_DRAW    : value : WebGLRenderingContext.DYNAMIC_DRAW
        
        STREAM_DRAW     : value : WebGLRenderingContext.STREAM_DRAW

        STATIC_READ     : value : WebGL2RenderingContext.STATIC_READ

        DYNAMIC_READ    : value : WebGL2RenderingContext.DYNAMIC_READ
        
        STREAM_READ     : value : WebGL2RenderingContext.STREAM_READ
        
        STATIC_COPY     : value : WebGL2RenderingContext.STATIC_COPY
        
        DYNAMIC_COPY    : value : WebGL2RenderingContext.DYNAMIC_COPY

        STREAM_COPY     : value : WebGL2RenderingContext.STREAM_COPY

    Object.define this::,

        ARRAY_BUFFER    : value : WebGLRenderingContext.ARRAY_BUFFER

        ELEMENT_BUFFER  : value : WebGLRenderingContext.ELEMENT_ARRAY_BUFFER

        COPY_READ       : value : WebGL2RenderingContext.COPY_READ_BUFFER

        COPY_WRITE      : value : WebGL2RenderingContext.COPY_WRITE_BUFFER
        
        FEEDBACK        : value : WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER
        
        UNIFORM_BLOCK   : value : WebGL2RenderingContext.UNIFORM_BUFFER
        
        PIXEL_PACK      : value : WebGL2RenderingContext.PIXEL_PACK_BUFFER

        PIXEL_UNPACK    : value : WebGL2RenderingContext.PIXEL_UNPACK_BUFFER

    create              : ->
        return this if @getLinkedNode()
        if  buffer = @getGL().createBuffer()
            @setBindTarget arguments[0] or @ARRAY_BUFFER
        ; buffer

    bind                : ->
        return this if @getBindStatus()
        @getGL().bindBuffer @getBindTarget() , @getGLBuffer()
        @getGL().bufferData @getBindTarget() , @getTypedArray() , @getUsage() or @setUsage @STATIC_DRAW
        @setBindStatus 1 ; this

    load                : ->
        @create() ; @bind() ; this

    mode                : ->
        type = arguments[ 0 ]
        
        count = 1000
        numComponents = 7
        
        BYTES_PER_ELEMENT = 4
        BYTES_PER_ATTRIBUTE = BYTES_PER_ELEMENT * numComponents 

        byteOffset = @addModeOffset BYTES_PER_ATTRIBUTE * count
        length = count * numComponents
        first = byteOffset / BYTES_PER_ATTRIBUTE

        mode = new Mode()

        mode . setParentPtri this
        mode . setTypeGLCode type
        mode . setComponents numComponents
        mode . setModeOffset byteOffset
        mode . setFirstIndex first

        mode

    getMode             : ->
        type = arguments[ 0 ]
        for mode in this . getModes()
            return mode if mode.is type
        return this . mode type

    drawArrays          : ->
        @getMode((( arguments[1] ))).malloc arguments[0]

    drawLines           : ->
        @drawArrays arguments[0], WebGL2RenderingContext.LINES

    drawLineLoop        : ->
        @drawArrays arguments[0], WebGL2RenderingContext.LINE_LOOP

    drawLineStrip       : ->
        @drawArrays arguments[0], WebGL2RenderingContext.LINE_STRIP

    drawPoints          : ->
        @drawArrays arguments[0], WebGL2RenderingContext.POINTS

    drawTriangles       : ->
        @drawArrays arguments[0], WebGL2RenderingContext.TRIANGLES

    drawTriangleFan     : ->
        @drawArrays arguments[0], WebGL2RenderingContext.TRIANGLE_FAN

    drawTriangleStrip   : ->
        @drawArrays arguments[0], WebGL2RenderingContext.TRIANGLE_STRIP

    delete              : -> @setBindStatus @getParentPtrO().deleteBuffer @getLinkedNode() ; @

    getGL               : -> @getParentPtrO()

    getModes            : -> @findAllChilds().filter (v) -> v instanceof Mode

    getGLBuffer         : -> @getLinkedNode() or @setGLBuffer @create()

    setGLBuffer         : -> @setLinkedNode arguments[0]

    getGLIsBuffer       : -> @getParentPtrO().isBuffer @getLinkedNode()

    getGLParameter      : -> @getParentPtrO().getParameter arguments[0]

    getGLBindings       : ->

        ARRAY_BUFFER    : @getGLParameter @getParentPtrO().ARRAY_BUFFER_BINDING

        ELEMENT_BUFFER  : @getGLParameter @getParentPtrO().ELEMENT_ARRAY_BUFFER_BINDING

    isArrayBuffer       : -> @ELEMENT_BUFFER isnt @getBindTarget()

    getBindStatus       : -> @getResvUint16 0

    setBindStatus       : -> @setResvUint16 0 , arguments[0] ; this

    keyBindTarget       : -> @keyResvUint16 1

    getBindTarget       : -> @getResvUint16 1

    setBindTarget       : -> @setResvUint16 1 , arguments[0] ; arguments[0]

    keyUsage            : -> @keyResvUint16 2

    getUsage            : -> @getResvUint16 2

    setUsage            : -> @setResvUint16 2 , arguments[0] ; arguments[0]

    getModeOffset       : -> @getResvUint32 2

    addModeOffset       : -> @addResvUint32 2 , arguments[0] 
    
    setModeOffset       : -> @setResvUint32 2 , arguments[0] ; arguments[0] 

Object.hidden Buffer  ,

    "headers", "protoClass", "length",  
    "array", "byteOffset", "byteLength", 

Object.symbol Buffer::,

    iterate             : value : ->
        mode = this ; ptri = 0.00
        next : ->
            unless ptri = mode . getNextChild ptri
                return done : on , value : mode
            return done : no , value : ptri

Object.define Buffer.registerClass()::,

    target              : get : Buffer::keyBindTarget   , set : Buffer::setBindTarget 

    bound               : get : Buffer::getBindStatus   , set : Buffer::setBindStatus

    usage               : get : Buffer::keyUsage        , set : Buffer::setUsage

    attributes          : get : Buffer::getTypedArray

OFFSET_O3_COLOR_4D      = 4 * 0

OFFSET_O3_POSITION      = 4 * 4

OFFSET_O3_ROTATION      = 4 * 8

OFFSET_O3_SCALE_3D      = 4 * 12

Object.define Object3  . registerClass(),

    byteLength          : value : 4 * 12

    typedArray          : value : Float32Array

Object.hidden Object3  , 

    "array", "byteLength", "byteOffset", 
    "headers", "length", "link", "protoClass"

Object.symbol Object3::,

    iterate             : value : ->

        obj3 = @ ; ptri = 0.00 ; next : ->
            unless ptri = obj3 . getNextChild ptri
                return done : on , value : obj3
            return done : no , value : ptri

Object.define Object3::,

    getDraws            : value : -> @findAllLinks().filter (v) -> v instanceof Draw

    getVertices         : value : -> @subarray( @constructor.LENGTH_OF_POINTER )

    setVertices         : value : -> @set(      @constructor.LENGTH_OF_POINTER, arguments[ 0 ])

    getPosition         : value : -> new Vertex @getByteOffset OFFSET_O3_POSITION

    getRotation         : value : -> new Angle3 @getByteOffset OFFSET_O3_ROTATION

    getScale            : value : -> new Scale3 @getByteOffset OFFSET_O3_SCALE_3D
    
    getColor            : value : -> new Color4 @getByteOffset OFFSET_O3_COLOR_4D

    setPosition         : value : -> @getPosition().set arguments...
    
    setRotation         : value : -> @getRotation().set arguments...
    
    setScale            : value : ->    @getScale().set arguments...
    
    setColor            : value : ->    @getColor().set arguments...

    getVertexCount      : value : -> @getResvUint32( 1 ) or @setVertexCount()
    
    setVertexCount      : value : -> @setResvUint32( 1, arguments[0] or @getVertices().length / 3 )

    getMatrix           : value : ->

        if  ptri = @getResvUint32 0
            return new Matrix4 ptri

        this
            . setResvUint32 0 , mat4 = new Matrix4()
            . setLinkedNode this

        mat4
            . setIsUpdated yes
            . reset()
            . translate @getPosition()
            . rotate @getRotation()
            . scale @getScale()

    nextVertex          : value : ->
        next = @addResvUint32 2, 1
        max = @getVertexCount()
        return @setResvUint32 2, 0 if next >= max

        begin = next * 3
        end = begin + 3
        return @vertices.subarray begin, end

Object.define Object3::,
    
    vertices            : get : Object3::getVertices   , set : Object3::setVertexArray

    position            : get : Object3::getPosition   , set : Object3::setPosition
    
    rotation            : get : Object3::getRotation   , set : Object3::setRotation
    
    scale               : get : Object3::getScale      , set : Object3::setScale
    
    color               : get : Object3::getColor      , set : Object3::setColor
    
    draws               : get : Object3::getDraws

    matrix              : get : Object3::getMatrix