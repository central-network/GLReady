import Pointer from "./ptr.coffee"


OFFSET_DRAW_ACTIVE  = 4 * 2
OFFSET_CULL_ACTIVE  = 4 * 2 + 1
OFFSET_BLEND_ACTIVE = 4 * 2 + 2
OFFSET_DEPTH_ACTIVE = 4 * 2 + 3

OFFSET_CULLFACE     = 4 * 3
OFFSET_FRONTFACE    = 4 * 3 + 2
OFFSET_DEPTH_FUNC   = 4 * 4
OFFSET_DEPTH_MASK   = 4 * 4 + 2
OFFSET_CLEAR_DEPTH  = 4 * 5
OFFSET_CLEAR_COLOR  = 4 * 6

export default class GL extends Pointer

    @byteLength     = 4 * 48

    @typedArray     = Uint32Array

    getArray        : -> @array

    getArrayBuffer  : -> @array.slice().buffer

    getCanvasNode   : -> @getLinkedNode().canvas

    setCanvasNode   : -> @setLinkedNode arguments[0].getContext "webgl2"


    getDrawActive   : -> @getUint8 OFFSET_DRAW_ACTIVE
    
    setDrawActive   : -> @setUint8 OFFSET_DRAW_ACTIVE, arguments[0] 

    getCullActive   : -> @getUint8 OFFSET_CULL_ACTIVE
    
    setCullActive   : -> @setUint8 OFFSET_CULL_ACTIVE, arguments[0] 

    getBlendActive  : -> @getUint8 OFFSET_BLEND_ACTIVE
    
    setBlendActive  : -> @setUint8 OFFSET_BLEND_ACTIVE, arguments[0] 

    getDepthActive  : -> @getUint8 OFFSET_DEPTH_ACTIVE
    
    setDepthActive  : -> @setUint8 OFFSET_DEPTH_ACTIVE, arguments[0] 

    keyCullFace     : -> @keyUint16 OFFSET_CULLFACE, WebGLRenderingContext
    
    getCullFace     : -> @getUint16 OFFSET_CULLFACE
    
    setCullFace     : -> @setUint16 OFFSET_CULLFACE, arguments[0] 

    keyFrontFace    : -> @keyUint16 OFFSET_FRONTFACE, WebGLRenderingContext
    
    getFrontFace    : -> @getUint16 OFFSET_FRONTFACE
    
    setFrontFace    : -> @setUint16 OFFSET_FRONTFACE, arguments[0] 

    keyDepthFunc    : -> @keyUint16 OFFSET_DEPTH_FUNC, WebGLRenderingContext
    
    getDepthFunc    : -> @getUint16 OFFSET_DEPTH_FUNC
    
    setDepthFunc    : -> @setUint16 OFFSET_DEPTH_FUNC, arguments[0] 

    keyDepthMask    : -> @keyUint16 OFFSET_DEPTH_MASK, WebGLRenderingContext
    
    getDepthMask    : -> @getUint16 OFFSET_DEPTH_MASK
    
    setDepthMask    : -> @setUint16 OFFSET_DEPTH_MASK, arguments[0] 
    
    getClearDepth   : -> @getFloat32 OFFSET_CLEAR_DEPTH
    
    setClearDepth   : -> @setFloat32 OFFSET_CLEAR_DEPTH, arguments[0] 
    
    rgbClearColor   : -> @rgbColor4 OFFSET_CLEAR_COLOR
    
    getClearColor   : -> @getColor4 OFFSET_CLEAR_COLOR
    
    setClearColor   : -> @setColor4 OFFSET_CLEAR_COLOR, arguments[0] 

    Object.defineProperties this::,

        gl          : get : GL::getLinkedNode

        arrayBuffer : get : GL::getArrayBuffer

        canvas      : get : GL::getCanvasNode   , set : GL::setCanvasNode

        drawActive  : get : GL::getDrawActive   , set : GL::setDrawActive
        
        cullActive  : get : GL::getCullActive   , set : GL::setCullActive

        cullFace    : get : GL::keyCullFace     , set : GL::setCullFace
        
        frontFace   : get : GL::keyFrontFace    , set : GL::setFrontFace
        
        blendActive : get : GL::getBlendActive  , set : GL::setBlendActive
        
        depthActive : get : GL::getDepthActive  , set : GL::setDepthActive

        depthFunc   : get : GL::keyDepthFunc    , set : GL::setDepthFunc
        
        depthMask   : get : GL::keyDepthMask    , set : GL::setDepthMask
        
        clearDepth  : get : GL::getClearDepth   , set : GL::setClearDepth
        
        clearColor  : get : GL::getClearColor   , set : GL::setClearColor


GL.registerClass()

