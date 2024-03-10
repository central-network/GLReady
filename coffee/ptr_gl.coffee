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
OFFSET_ROTATING     = 4 * 14
OFFSET_DRAGGING     = 4 * 14 + 1
OFFSET_UX_ENABLED   = 4 * 14 + 2

OFFSET_VALUES       = 4 * 20
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
OFFSET_FACTOR       = 4 * 33
OFFSET_TIME         = 4 * 34

OFFSET_WIDTH        = 4 * 40
OFFSET_HEIGHT       = 4 * 41
OFFSET_LEFT         = 4 * 42
OFFSET_TOP          = 4 * 43
OFFSET_PIXEL_RATIO  = 4 * 44
OFFSET_ASPECT_RATIO = 4 * 45

export default class GL extends Pointer

    @byteLength     = 4 * 48

    @typedArray     = Uint32Array

    getArray        : -> @array

    getArrayBuffer  : -> @array.slice().buffer

    getCanvasNode   : -> @getLinkedNode().canvas

    setCanvasNode   : -> @setLinkedNode arguments[0].getContext "webgl2"

    getDrawActive   : -> @getUint8 OFFSET_DRAW_ACTIVE
    
    setDrawActive   : -> @setUint8 OFFSET_DRAW_ACTIVE, arguments[0] 

    getCullEnabled  : -> @getUint8 OFFSET_CULL_ENABLED
    
    setCullEnabled  : -> @setUint8 OFFSET_CULL_ENABLED, arguments[0] 

    getBlendActive  : -> @getUint8 OFFSET_BLEND_ACTIVE
    
    setBlendActive  : -> @setUint8 OFFSET_BLEND_ACTIVE, arguments[0] 

    getDepthActive  : -> @getUint8 OFFSET_DEPTH_ACTIVE
    
    setDepthActive  : -> @setUint8 OFFSET_DEPTH_ACTIVE, arguments[0] 

    getClearDepth   : -> @getFloat32 OFFSET_CLEAR_DEPTH
    
    setClearDepth   : -> @setFloat32 OFFSET_CLEAR_DEPTH, arguments[0] 

    keyDepthTest    : -> @keyUint16 OFFSET_DEPTH_TEST
    
    getDepthTest    : -> @getUint16 OFFSET_DEPTH_TEST
    
    setDepthTest    : -> @setUint16 OFFSET_DEPTH_TEST, arguments[0] 

    keyCullFace     : -> @keyUint16 OFFSET_CULL_FACE
    
    getCullFace     : -> @getUint16 OFFSET_CULL_FACE
    
    setCullFace     : -> @setUint16 OFFSET_CULL_FACE, arguments[0] 

    keyFrontFace    : -> @keyUint16 OFFSET_FRONTFACE
    
    getFrontFace    : -> @getUint16 OFFSET_FRONTFACE
    
    setFrontFace    : -> @setUint16 OFFSET_FRONTFACE, arguments[0] 

    keyDepthFunc    : -> @keyUint16 OFFSET_DEPTH_FUNC
    
    getDepthFunc    : -> @getUint16 OFFSET_DEPTH_FUNC
    
    setDepthFunc    : -> @setUint16 OFFSET_DEPTH_FUNC, arguments[0] 

    keyClearMask    : -> @keyUint16 OFFSET_CLEAR_MASK
    
    getClearMask    : -> @getUint16 OFFSET_CLEAR_MASK
    
    setClearMask    : -> @setUint16 OFFSET_CLEAR_MASK, arguments[0] 
    
    rgbClearColor   : -> @rgbColor4 OFFSET_CLEAR_COLOR
    
    getClearColor   : -> @getColor4 OFFSET_CLEAR_COLOR
    
    setClearColor   : -> @setColor4 OFFSET_CLEAR_COLOR, arguments[0] 

    keyBindTarget   : -> @keyUint16 OFFSET_BIND_TARGET
    
    getBindTarget   : -> @getUint16 OFFSET_BIND_TARGET
    
    setBindTarget   : -> @setUint16 OFFSET_BIND_TARGET, arguments[0] 

    keyBlendEquate  : -> @keyUint16 OFFSET_BLEND_EQUATE
    
    getBlendEquate  : -> @getUint16 OFFSET_BLEND_EQUATE
    
    setBlendEquate  : -> @setUint16 OFFSET_BLEND_EQUATE, arguments[0] 

    keyBlendInArg   : -> @keyUint16 OFFSET_BLEND_INARG
    
    getBlendInArg   : -> @getUint16 OFFSET_BLEND_INARG
    
    setBlendInArg   : -> @setUint16 OFFSET_BLEND_INARG, arguments[0] 

    keyBlendOutArg  : -> @keyUint16 OFFSET_BLEND_OUTARG
    
    getBlendOutArg  : -> @getUint16 OFFSET_BLEND_OUTARG
    
    setBlendOutArg  : -> @setUint16 OFFSET_BLEND_OUTARG, arguments[0] 

    keyBlendFunc    : -> @keyUint16 OFFSET_BLEND_FUNC
    
    getBlendFunc    : -> @getUint16 OFFSET_BLEND_FUNC
    
    setBlendFunc    : -> @setUint16 OFFSET_BLEND_FUNC, arguments[0] 
    
    getWidth        : -> @getFloat32 OFFSET_WIDTH
    
    setWidth        : -> @setFloat32 OFFSET_WIDTH, arguments[0] 

    getHeight       : -> @getFloat32 OFFSET_HEIGHT
    
    setHeight       : -> @setFloat32 OFFSET_HEIGHT, arguments[0] 

    getLeft         : -> @getFloat32 OFFSET_LEFT
    
    setLeft         : -> @setFloat32 OFFSET_LEFT, arguments[0] 

    getTop          : -> @getFloat32 OFFSET_TOP
    
    setTop          : -> @setFloat32 OFFSET_TOP, arguments[0] 

    getPixelRatio   : -> @getFloat32 OFFSET_PIXEL_RATIO
    
    setPixelRatio   : -> @setFloat32 OFFSET_PIXEL_RATIO, arguments[0] 

    getAspectRatio  : -> @getFloat32 OFFSET_ASPECT_RATIO
    
    setAspectRatio  : -> @setFloat32 OFFSET_ASPECT_RATIO, arguments[0] 

    getWalking      : -> @getUint8 OFFSET_WALKING
    
    setWalking      : -> @setUint8 OFFSET_WALKING, arguments[0] 

    getJumping      : -> @getUint8 OFFSET_JUMPING
    
    setJumping      : -> @setUint8 OFFSET_JUMPING, arguments[0] 

    getLooking      : -> @getUint8 OFFSET_LOOKING
    
    setLooking      : -> @setUint8 OFFSET_LOOKING, arguments[0] 

    getZooming      : -> @getUint8 OFFSET_ZOOMING
    
    setZooming      : -> @setUint8 OFFSET_ZOOMING, arguments[0] 

    getDragging     : -> @getUint8 OFFSET_DRAGGING
    
    setDragging     : -> @setUint8 OFFSET_DRAGGING, arguments[0] 

    getRotating     : -> @getUint8 OFFSET_ROTATING
    
    setRotating     : -> @setUint8 OFFSET_ROTATING, arguments[0] 

    getKeyMeta      : -> @getUint8 OFFSET_KEY_META
    
    setKeyMeta      : -> @setUint8 OFFSET_KEY_META, arguments[0] 

    getKeyCtrl      : -> @getUint8 OFFSET_KEY_CTRL
    
    setKeyCtrl      : -> @setUint8 OFFSET_KEY_CTRL, arguments[0] 

    getKeyShift     : -> @getUint8 OFFSET_KEY_SHIFT
    
    setKeyShift     : -> @setUint8 OFFSET_KEY_SHIFT, arguments[0] 

    getKeyAlt       : -> @getUint8 OFFSET_KEY_ALT
    
    setKeyAlt       : -> @setUint8 OFFSET_KEY_ALT, arguments[0] 

    getMoveFwd      : -> @getUint8 OFFSET_MOVE_FWD
    
    setMoveFwd      : -> @setUint8 OFFSET_MOVE_FWD, arguments[0] 

    getMoveBack     : -> @getUint8 OFFSET_MOVE_BACK
    
    setMoveBack     : -> @setUint8 OFFSET_MOVE_BACK, arguments[0] 

    getMoveLeft     : -> @getUint8 OFFSET_MOVE_LEFT
    
    setMoveLeft     : -> @setUint8 OFFSET_MOVE_LEFT, arguments[0] 

    getMoveRight    : -> @getUint8 OFFSET_MOVE_RIGHT
    
    setMoveRight    : -> @setUint8 OFFSET_MOVE_RIGHT, arguments[0] 

    getMoveUp       : -> @getUint8 OFFSET_MOVE_UP
    
    setMoveUp       : -> @setUint8 OFFSET_MOVE_UP, arguments[0] 

    getMoveDown     : -> @getUint8 OFFSET_MOVE_DOWN
    
    setMoveDown     : -> @setUint8 OFFSET_MOVE_DOWN, arguments[0] 

    getPtrClick     : -> @getUint8 OFFSET_PTR_CLICK
    
    setPtrClick     : -> @setUint8 OFFSET_PTR_CLICK, arguments[0] 

    getPtrDblClick  : -> @getUint8 OFFSET_PTR_DCLICK
    
    setPtrDblClick  : -> @setUint8 OFFSET_PTR_DCLICK, arguments[0] 

    getUXEnabled    : -> @getUint8 OFFSET_UX_ENABLED
    
    setUXEnabled    : -> @setUint8 OFFSET_UX_ENABLED, arguments[0] 


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

GL.registerClass()

