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
    
    getClearDepth   : -> @getFloat32 OFFSET_CLEAR_DEPTH
    
    setClearDepth   : -> @setFloat32 OFFSET_CLEAR_DEPTH, arguments[0] 
    
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


    Object.defineProperties this::,

        gl          : get : GL::getLinkedNode

        arrayBuffer : get : GL::getArrayBuffer

        canvas      : get : GL::getCanvasNode   , set : GL::setCanvasNode

        drawActive  : get : GL::getDrawActive   , set : GL::setDrawActive
        
        cullEnabled : get : GL::getCullEnabled  , set : GL::setCullEnabled

        cullFace    : get : GL::keyCullFace     , set : GL::setCullFace
        
        frontFace   : get : GL::keyFrontFace    , set : GL::setFrontFace
        
        blendActive : get : GL::getBlendActive  , set : GL::setBlendActive
        
        blendEquate : get : GL::keyBlendEquate  , set : GL::setBlendEquate
        
        blendFunc   : get : GL::keyBlendFunc    , set : GL::setBlendFunc
        
        blendInArg  : get : GL::keyBlendInArg   , set : GL::setBlendInArg

        blendOutArg : get : GL::keyBlendOutArg  , set : GL::setBlendOutArg
        
        depthActive : get : GL::getDepthActive  , set : GL::setDepthActive
        
        depthTest   : get : GL::keyDepthTest    , set : GL::setDepthTest

        depthFunc   : get : GL::keyDepthFunc    , set : GL::setDepthFunc
        
        clearMask   : get : GL::keyClearMask    , set : GL::setClearMask
        
        bindTarget  : get : GL::keyBindTarget   , set : GL::setBindTarget
        
        clearDepth  : get : GL::getClearDepth   , set : GL::setClearDepth
        
        clearColor  : get : GL::getClearColor   , set : GL::setClearColor


GL.registerClass()

