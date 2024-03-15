import Pointer from "./ptr.coffee"
import { Vertex, Angle3, Scale3, Color4, OffsetPointer } from "./ptr.coffee"

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

KEYEXTEND_CLEARMASK = [ 16640 ] : new (class DEPTH_N_COLOR_BIT extends Number) 16640

export class GL extends Pointer

    @byteLength     = 4 * 48

    @typedArray     = Uint32Array

    draw            : ->

        arr = Float32Array.of(...arguments[0])
        size = arr.length * arr.BYTES_PER_ELEMENT

        @gl.bindBuffer @gl.ARRAY_BUFFER, @glBuffer
        @gl.bufferData @gl.ARRAY_BUFFER, size, @gl.STATIC_DRAW


        @gl.bufferSubData @gl.ARRAY_BUFFER, 0, arr
        a.enable() for a in @programAttribs

        @gl.drawArrays @gl.POINTS, 0, 3
        @gl.drawArrays @gl.LINES, 0, 3
        @gl.drawArrays @gl.TRIANGLES, 0, 3

        arr


    redraw          : ( ptr ) ->
        @gl.bufferSubData @gl.ARRAY_BUFFER, 0, ptr.array
        a.enable() for a in @programAttribs

        @gl.drawArrays @gl.POINTS, 0, 3
        @gl.drawArrays @gl.LINES, 0, 3
        @gl.drawArrays @gl.TRIANGLES, 0, 3

    drawww          : ( o3 ) ->
        buffer = @allBuffers.at 0

        console.warn buffer
        console.warn o3
        console.warn buffer.alloc o3 


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
    
    #TODO new pointer
    rgbClearColor   : -> @rgbColor4 OFFSET_CLEAR_COLOR
    
    getClearColor   : -> @getColour4 OFFSET_CLEAR_COLOR
    
    setClearColor   : -> @setColour4 OFFSET_CLEAR_COLOR     , arguments[0] ; this

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

    Object.defineProperties this::,

        gl              : get : GL::getLinkedNode

        glError         : get : GL::getGLError

        program         : get : GL::getProgram

        programVertex   : get : GL::getVertShader

        programFragment : get : GL::getFragShader

        programAttribs  : get : GL::getAttributes

        programUniforms : get : GL::getUniforms

        glBuffer        : get : GL::getGLBuffer

        allBuffers      : get : GL::getAllBuffers 

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

    Object.defineProperties Program.registerClass()::,

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
    
    getByteSource       : -> @getTArray OFFSET_SOURCE_TEXT , Uint8Array

    setByteSource       : -> @setTArray OFFSET_SOURCE_TEXT , arguments[0] , Uint8Array ; this

    getIsUploaded       : -> @getUint8  OFFSET_IS_UPLOADED
    
    setIsUploaded       : -> @setUint8  OFFSET_IS_UPLOADED , arguments[0]

    getIsCompiled       : -> @getUint8  OFFSET_IS_COMPILED
    
    setIsCompiled       : -> @setUint8  OFFSET_IS_COMPILED , arguments[0]

    getIsAttached       : -> @getUint8  OFFSET_IS_ATTACHED
    
    setIsAttached       : -> @setUint8  OFFSET_IS_ATTACHED , arguments[0]

    getAllVariables     : -> @findAllChilds().filter (i) -> i instanceof ShaderKey

    getAttributes       : -> @findAllChilds().filter (i) -> i instanceof Attribute

    getUniforms         : -> @findAllChilds().filter (i) -> i instanceof Uniform

    Object.defineProperties Shader.registerClass()::,

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

export class ShaderKey extends Pointer

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

Object.defineProperties ShaderKey.registerClass()::,

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

export class Attribute extends ShaderKey

    Object.defineProperties Attribute.registerClass(),
        
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
            key.setNormalize    no
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

Object.defineProperties Attribute::,

    glLocation          : get : Attribute::getGLLocation

    location            : get : Attribute::getLocation      , set : Attribute::setLocation

    stride              : get : Attribute::getStride        , set : Attribute::setStride

    offset              : get : Attribute::getOffset        , set : Attribute::setOffset

    normalize           : get : Attribute::getNormalize     , set : Attribute::setNormalize

export class Uniform extends ShaderKey

    Object.defineProperties Uniform.registerClass(),
        
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

Object.defineProperties Uniform::,

    glLocation          : get : Uniform::getGLLocation

    location            : get : Uniform::getGLLocation

OFFSET_MODE_TYPEGLCODE  = 4 * 0

OFFSET_MODE_DRAWOFFSET  = 4 * 1

OFFSET_MODE_DRAWLENGTH  = 4 * 2

OFFSET_MODE_BYTE_ALLOC  = 4 * 3

OFFSET_MODE_BYTELENGTH  = 4 * 4

OFFSET_MODE_ATTR_START  = 4 * 5

OFFSET_MODE_ATTR_COUNT  = 4 * 6

OFFSET_MODE_DST_OFFSET  = 4 * 7

OFFSET_MODE_COMPONENTS  = 4 * 8

OFFSET_MODE_FIRSTINDEX  = 4 * 9

KEYEXTEND_OBJECT3D      = 0 : new (class POINTS extends Number) WebGL2RenderingContext.POINTS


export class BufferMode extends Pointer

Object.defineProperties BufferMode.registerClass(),

    byteLength          : value : 4 * 9

    typedArray          : value : Uint32Array

Object.defineProperties BufferMode::,

    malloc              : value : ->

        object3d = arguments[ 0 ]
        vertices = object3d.getVertexArray()
        components = @getComponents()

        count = vertices.length / 3
        length = count * components
        byteLength = length * vertices.BYTES_PER_ELEMENT
        mallocOffset = @addMallocByte byteLength
        destOffset = @getModeOffset() + mallocOffset

        object3d . setBufferOffset destOffset 
        object3d . setCopyBegin destOffset / 4
        object3d . setCopyLength length

        @addModeLength length 
        @addDrawLength count

        this

Object.defineProperties BufferMode::,

    getAttrCount        : value : -> @getUint32 OFFSET_MODE_ATTR_COUNT

    setAttrCount        : value : -> @setUint32 OFFSET_MODE_ATTR_COUNT, arguments[0]

    getAttrStart        : value : -> @getUint32 OFFSET_MODE_ATTR_START

    setAttrStart        : value : -> @setUint32 OFFSET_MODE_ATTR_START, arguments[0]

    getMallocByte       : value : -> @getUint32 OFFSET_MODE_BYTE_ALLOC
    
    addMallocByte       : value : -> @addUint32 OFFSET_MODE_BYTE_ALLOC, arguments[0]

    setMallocByte       : value : -> @setUint32 OFFSET_MODE_BYTE_ALLOC, arguments[0]

    keyTypeGLCode       : value : -> @keyUint16 OFFSET_MODE_TYPEGLCODE, KEYEXTEND_OBJECT3D

    getTypeGLCode       : value : -> @getUint16 OFFSET_MODE_TYPEGLCODE

    setTypeGLCode       : value : -> @setUint16 OFFSET_MODE_TYPEGLCODE, arguments[0]

    getModeOffset       : value : -> @getUint32 OFFSET_MODE_DRAWOFFSET

    setModeOffset       : value : -> @setUint32 OFFSET_MODE_DRAWOFFSET, arguments[0]

    getFirstIndex       : value : -> @getUint32 OFFSET_MODE_FIRSTINDEX

    setFirstIndex       : value : -> @setUint32 OFFSET_MODE_FIRSTINDEX, arguments[0]

    getModeLength       : value : -> @getUint32 OFFSET_MODE_BYTELENGTH
    
    addModeLength       : value : -> @addUint32 OFFSET_MODE_BYTELENGTH, arguments[0]

    setModeLength       : value : -> @setUint32 OFFSET_MODE_BYTELENGTH, arguments[0]

    getDrawLength       : value : -> @getUint32 OFFSET_MODE_DRAWLENGTH

    addDrawLength       : value : -> @addUint32 OFFSET_MODE_DRAWLENGTH, arguments[0]
    
    setDrawLength       : value : -> @setUint32 OFFSET_MODE_DRAWLENGTH, arguments[0]

    getDestOffset       : value : -> @getUint32 OFFSET_MODE_DST_OFFSET

    setDestOffset       : value : -> @setUint32 OFFSET_MODE_DST_OFFSET, arguments[0]

    getComponents       : value : -> @getUint8  OFFSET_MODE_COMPONENTS

    setComponents       : value : -> @setUint8  OFFSET_MODE_COMPONENTS, arguments[0]

Object.defineProperties BufferMode::,

    type                : get   : BufferMode::keyTypeGLCode , set   : BufferMode::setTypeGLCode

    alloc               : get   : BufferMode::getMallocByte , set   : BufferMode::setMallocByte

    first               : get   : BufferMode::getFirstIndex , set   : BufferMode::setFirstIndex
    
    count               : get   : BufferMode::getDrawLength , set   : BufferMode::setDrawLength
    
    offset              : get   : BufferMode::getModeOffset , set   : BufferMode::setModeOffset 
    
    components          : get   : BufferMode::getComponents , set   : BufferMode::setComponents

OFFSET_BINDING_TARGET   = 4 * 0

OFFSET_BINDING_STATUS   = 4 * 0 + 2

OFFSET_BUF_BYTELENGTH   = 4 * 1 # total usabe reserved on gpu

OFFSET_BUF_MODEOFFSET   = 4 * 2 # allocated bytes of vertices 

OFFSET_BUF_DRAWOFFSET   = 4 * 3 # offset on SharedArrayBuffer

OFFSET_BUFFER_OFFSET    = 4 * 12

export class Buffer extends Pointer

    @byteLength         : 4 * 256 * 256

    @typedArray         : Float32Array

    Object.defineProperties this::,

        ARRAY_BUFFER    : value : WebGL2RenderingContext.ARRAY_BUFFER

        ELEMENT_BUFFER  : value : WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER

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
        @setBindStatus 1 ; this

    load                : -> @create() ; @bind() ; this

    #* allocation for mode
    malloc              : ->
        @addModeOffset arguments[0]

    #* allocation for object
    alloc               : ->
        object3d = arguments[ 0 ]
        typeCode = object3d . getTypeGLCode()

        vertexCount = object3d.getVertexCount()
        numComponents = 7
        bytesPerElement = 4
        bytesPerAttribute = numComponents * bytesPerElement  
        attrByteLength = vertexCount * numComponents * bytesPerElement

        MODETYPE = object3d.type.constructor.name

        mode = null
        for mode in @findAllChilds()
            1


        unless mode 
            #? no mode matched need to allocate in buffer
            log "NO_MODE_MATCHED_FOR_#{MODETYPE}_ALLOCATING"

            modeByteOffset = this . malloc attrByteLength
            firstAttrIndex = modeByteOffset / bytesPerAttribute

            mode = new BufferMode()

            mode . setTypeGLCode typeCode
            mode . setComponents numComponents
            mode . setModeOffset modeByteOffset
            mode . setFirstIndex firstAttrIndex

            console.log first: mode.getFirstIndex()
            console.log offset: mode.getModeOffset()

            mode . malloc object3d

            console.log first: mode.getFirstIndex()
            console.log offset: mode.getModeOffset()

        else #TODO move to right
            2 

        console.warn mode
        
        mode



    delete              : -> @setBindStatus @getGL().deleteBuffer @getLinkedNode() ; @

    getGL               : -> @getParentPtrO()

    getGLBuffer         : -> @getLinkedNode() or @setGLBuffer @create()

    setGLBuffer         : -> @setLinkedNode arguments[0]

    getGLIsBuffer       : -> @getGL().isBuffer @getLinkedNode()

    getGLParameter      : -> @getGL().getParameter arguments[0]

    getGLBindings       : ->

        ARRAY_BUFFER    : @getGLParameter @getGL().ARRAY_BUFFER_BINDING

        ELEMENT_BUFFER  : @getGLParameter @getGL().ELEMENT_ARRAY_BUFFER_BINDING

    isArrayBuffer       : -> @ELEMENT_BUFFER isnt @getBindTarget()

    keyBindTarget       : -> @keyUint16 OFFSET_BINDING_TARGET

    getBindTarget       : -> @getUint16 OFFSET_BINDING_TARGET

    setBindTarget       : -> @setUint16 OFFSET_BINDING_TARGET , arguments[0]

    getBindStatus       : -> @getUint16 OFFSET_BINDING_STATUS

    setBindStatus       : -> @setUint16 OFFSET_BINDING_STATUS , arguments[0]

    getModeOffset       : -> @getUint32 OFFSET_BUF_MODEOFFSET

    addModeOffset       : -> @addUint32 OFFSET_BUF_MODEOFFSET , arguments[0] 
    
    setModeOffset       : -> @setUint32 OFFSET_BUF_MODEOFFSET , arguments[0] 

Object.defineProperties Buffer.registerClass()::,

    gl                  : get : Buffer::getGL

    glBindings          : get : Buffer::getGLBindings

    glValidate          : get : Buffer::getGLIsBuffer 

    glBuffer            : get : Buffer::getGLBuffer     , set : Buffer::setGLBuffer

    type                : get : Buffer::keyBindTarget   , set : Buffer::setBindTarget 

    status              : get : Buffer::getBindStatus   , set : Buffer::setBindStatus

OFFSET_O3_DRAWTYPE      = 4 * 0

OFFSET_O3_DRAWTYP2      = 4 * 0 + 2

OFFSET_O3_COLOR_4D      = 4 * 1

OFFSET_O3_POSITION      = 4 * 6

OFFSET_O3_ROTATION      = 4 * 10

OFFSET_O3_SCALE_3D      = 4 * 14

OFFSET_BUFFER_OFFSET    = 4 * 18

OFFSET_O3_COPY_BEGIN    = 4 * 19

OFFSET_O3_COPYLENGTH    = 4 * 20

OFFSET_ATTRIB_LENGTH    = 4 * 21

OFFSET_ATTRIB_STRIDE    = 4 * 21 + 2

export class Vertices   extends Pointer

Object.defineProperties Vertices.registerClass(),

    typedArray          : value : Float32Array
    
    fromArray           : value : ->
        len = arguments[ 0 ] . length
        ptr = this . malloc len * this . BYTES_PER_ELEMENT
        ptr . array.set ptr . setLinkedNode arguments[ 0 ]
        ptr

Object.defineProperties Vertices::,

    type                : get   : -> @keyStatic WebGL2RenderingContext.FLOAT

export class Attributes extends Pointer

    @typedArray         : Float32Array

export class Object3    extends Pointer


    bind                : ->
        shader = arguments[0]
        shader.add this

        [ vertex, color4 ] = shader.getAttributes()
        
        pointCount = @bufferArray.length / vertex.components
        allocLength = pointCount * shader.sumComponents
        ptrByteLength = allocLength * Attributes.BYTES_PER_ELEMENT

        ptr = Attributes.malloc ptrByteLength

        stride = shader.sumComponents
        tarray = ptr.array
        offset = -stride
        sarray = @bufferArray
        carray = @color.array

        for i in [ 0 ... pointCount ]
            tarray
                .subarray offset += stride, offset + stride
                .set [
                    ...sarray.subarray( i * 3, i * 3 + 3 )
                    ...carray
                ]

        ptr

Object.defineProperties Object3.registerClass(),

    byteLength          : value : 4 * 32

    typedArray          : value : Float32Array

Object.defineProperties Object3::,

    getBufferObject     : value : -> new OffsetPointer this

    getBufferOffset     : value : -> @getUint32 OFFSET_BUFFER_OFFSET

    setBufferOffset     : value : -> @setUint32 OFFSET_BUFFER_OFFSET , arguments[0]


    getAttibLength      : value : -> @getUint16 OFFSET_ATTRIB_LENGTH

    setAttibLength      : value : -> @setUint16 OFFSET_ATTRIB_LENGTH , arguments[0]

    
    getAttibStride      : value : -> @getUint8  OFFSET_ATTRIB_STRIDE

    setAttibStride      : value : -> @setUint8  OFFSET_ATTRIB_STRIDE , arguments[0]

    
    getVertexCount      : value : -> (@length - @constructor.LENGTH_OF_POINTER) / 3

    getVertexArray      : value : -> @subarray( @constructor.LENGTH_OF_POINTER)

    setVertexArray      : value : -> @set(      @constructor.LENGTH_OF_POINTER, arguments[ 0 ])



    getCopyBegin        : value : -> @getUint32 OFFSET_O3_COPY_BEGIN

    setCopyBegin        : value : -> @setUint32 OFFSET_O3_COPY_BEGIN , arguments[0]


    getCopyLength       : value : -> @getUint32 OFFSET_O3_COPYLENGTH

    setCopyLength       : value : -> @setUint32 OFFSET_O3_COPYLENGTH , arguments[0]


    keyTypeGLCode       : value : -> @keyUint16 OFFSET_O3_DRAWTYPE , KEYEXTEND_OBJECT3D

    getTypeGLCode       : value : -> @getUint16 OFFSET_O3_DRAWTYPE

    setTypeGLCode       : value : -> @setUint16 OFFSET_O3_DRAWTYPE , arguments[0]
    

    getPosition         : value : -> new Vertex @byteOffset + OFFSET_O3_POSITION

    getRotation         : value : -> new Angle3 @byteOffset + OFFSET_O3_ROTATION

    getScale            : value : -> new Scale3 @byteOffset + OFFSET_O3_SCALE_3D
    
    getColor            : value : -> new Color4 @byteOffset + OFFSET_O3_COLOR_4D

    setPosition         : value : -> @setArray3 OFFSET_O3_POSITION , arguments[0]
    
    setRotation         : value : -> @setArray3 OFFSET_O3_ROTATION , arguments[0]
    
    setScale            : value : -> @setArray3 OFFSET_O3_SCALE_3D , arguments[0]
    
    setColor            : value : -> @setArray4 OFFSET_O3_COLOR_4D , arguments[0]

Object.defineProperties Object3::,

    vertexCount         : get : Object3::getVertexCount
    
    vertexArray         : get : Object3::getVertexArray   , set : Object3::setVertexArray

    attribStride        : get : Object3::getAttibStride   , set : Object3::setAttibStride
    
    attribLength        : get : Object3::getAttibLength   , set : Object3::setAttibLength

    bufferOffset        : get : Object3::getBufferOffset  , set : Object3::setBufferOffset
    
    bufferObject        : get : Object3::getBufferObject
    
    copyBegin           : get : Object3::getCopyBegin  , set : Object3::setCopyBegin

    copyLength          : get : Object3::getCopyLength , set : Object3::setCopyLength

    position            : get : Object3::getPosition   , set : Object3::setPosition
    
    rotation            : get : Object3::getRotation   , set : Object3::setRotation
    
    scale               : get : Object3::getScale      , set : Object3::setScale
    
    color               : get : Object3::getColor      , set : Object3::setColor
    
    type                : get : Object3::keyTypeGLCode , set : Object3::setTypeGLCode
