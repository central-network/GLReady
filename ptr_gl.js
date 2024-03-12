var OFFSET_ASPECT_RATIO, OFFSET_ATTACH_STATUS, OFFSET_ATTR_OFFSET, OFFSET_ATTR_STRIDE, OFFSET_BINDING_STATUS, OFFSET_BINDING_TARGET, OFFSET_BIND_TARGET, OFFSET_BLEND_ACTIVE, OFFSET_BLEND_EQUATE, OFFSET_BLEND_FUNC, OFFSET_BLEND_INARG, OFFSET_BLEND_OUTARG, OFFSET_CHAR_LENGTH, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ACTIVE, OFFSET_DEPTH_FUNC, OFFSET_DEPTH_TEST, OFFSET_DRAGGING, OFFSET_DRAW_ACTIVE, OFFSET_DX, OFFSET_DY, OFFSET_FRONTFACE, OFFSET_HEIGHT, OFFSET_INUSE_STATUS, OFFSET_ISNORMALIZE, OFFSET_IS_ATTACHED, OFFSET_IS_COMPILED, OFFSET_IS_UPLOADED, OFFSET_JUMPING, OFFSET_KEY_ALT, OFFSET_KEY_CTRL, OFFSET_KEY_LOCATED, OFFSET_KEY_META, OFFSET_KEY_SHIFT, OFFSET_LEFT, OFFSET_LINKED_STATUS, OFFSET_LOCATION_AT, OFFSET_LOOKING, OFFSET_MOVE_BACK, OFFSET_MOVE_DOWN, OFFSET_MOVE_FWD, OFFSET_MOVE_LEFT, OFFSET_MOVE_RIGHT, OFFSET_MOVE_UP, OFFSET_NAME_LENGTH, OFFSET_NAME_TARRAY, OFFSET_PIXEL_RATIO, OFFSET_PTR_BUTTON, OFFSET_PTR_CLICK, OFFSET_PTR_DCLICK, OFFSET_ROTATING, OFFSET_RX, OFFSET_RY, OFFSET_SHADER_TYPE, OFFSET_SHIFT_RATIO, OFFSET_SOURCE_TEXT, OFFSET_SX, OFFSET_SY, OFFSET_SZ, OFFSET_TIME, OFFSET_TOP, OFFSET_TYPE_GLCODE, OFFSET_TYPE_LENGTH, OFFSET_UX_ENABLED, OFFSET_VX, OFFSET_VY, OFFSET_VZ, OFFSET_WALKING, OFFSET_WIDTH, OFFSET_X, OFFSET_Y, OFFSET_ZOOMING;

import Pointer from "./ptr.js";

OFFSET_DRAW_ACTIVE = 4 * 2;

OFFSET_CULL_ENABLED = 4 * 2 + 1;

OFFSET_BLEND_ACTIVE = 4 * 2 + 2;

OFFSET_DEPTH_ACTIVE = 4 * 2 + 3;

OFFSET_CULL_FACE = 4 * 3;

OFFSET_FRONTFACE = 4 * 3 + 2;

OFFSET_DEPTH_FUNC = 4 * 4;

OFFSET_CLEAR_MASK = 4 * 4 + 2;

OFFSET_CLEAR_DEPTH = 4 * 5;

OFFSET_CLEAR_COLOR = 4 * 6;

OFFSET_BIND_TARGET = 4 * 7;

OFFSET_BLEND_EQUATE = 4 * 7 + 2;

OFFSET_BLEND_INARG = 4 * 8;

OFFSET_BLEND_OUTARG = 4 * 8 + 2;

OFFSET_BLEND_FUNC = 4 * 9;

OFFSET_DEPTH_TEST = 4 * 9 + 2;

OFFSET_WALKING = 4 * 10;

OFFSET_JUMPING = 4 * 10 + 1;

OFFSET_KEY_SHIFT = 4 * 10 + 2;

OFFSET_KEY_ALT = 4 * 10 + 3;

OFFSET_KEY_CTRL = 4 * 11;

OFFSET_KEY_META = 4 * 11 + 1;

OFFSET_MOVE_FWD = 4 * 11 + 2;

OFFSET_MOVE_BACK = 4 * 11 + 3;

OFFSET_MOVE_LEFT = 4 * 12;

OFFSET_MOVE_RIGHT = 4 * 12 + 1;

OFFSET_MOVE_UP = 4 * 12 + 2;

OFFSET_MOVE_DOWN = 4 * 12 + 3;

OFFSET_LOOKING = 4 * 13;

OFFSET_ZOOMING = 4 * 13 + 1;

OFFSET_PTR_DCLICK = 4 * 13 + 2;

OFFSET_PTR_CLICK = 4 * 13 + 3;

OFFSET_PTR_BUTTON = 4 * 14;

OFFSET_ROTATING = 4 * 15;

OFFSET_DRAGGING = 4 * 15 + 1;

OFFSET_UX_ENABLED = 4 * 15 + 2;

OFFSET_X = 4 * 21;

OFFSET_Y = 4 * 22;

OFFSET_DX = 4 * 23;

OFFSET_DY = 4 * 24;

OFFSET_RX = 4 * 25;

OFFSET_RY = 4 * 26;

OFFSET_SX = 4 * 27;

OFFSET_SY = 4 * 28;

OFFSET_SZ = 4 * 29;

OFFSET_VX = 4 * 30;

OFFSET_VY = 4 * 31;

OFFSET_VZ = 4 * 32;

OFFSET_SHIFT_RATIO = 4 * 33;

OFFSET_TIME = 4 * 34;

OFFSET_WIDTH = 4 * 40;

OFFSET_HEIGHT = 4 * 41;

OFFSET_LEFT = 4 * 42;

OFFSET_TOP = 4 * 43;

OFFSET_PIXEL_RATIO = 4 * 44;

OFFSET_ASPECT_RATIO = 4 * 45;

export var GL = (function() {
  class GL extends Pointer {
    bindEvents() {
      var canvas;
      canvas = this.getCanvasNode();
      canvas.addEventListener("pointerup", this.onpointerfree.bind(this));
      canvas.addEventListener("pointerdown", this.onpointerhold.bind(this));
      canvas.addEventListener("pointermove", this.onpointermove.bind(this), {
        passive: !0
      });
      canvas.addEventListener("dblclick", this.ondoubleclick.bind(this));
      canvas.addEventListener("click", this.oncanvasclick.bind(this));
      canvas.addEventListener("wheel", this.onmousescroll.bind(this), {
        passive: !0
      });
      canvas.addEventListener("contextmenu", this.onpreventcall.bind(this));
      return this;
    }

    onpreventcall() {
      return arguments[0].preventDefault();
    }

    onpointerfree() {
      return this.setUint8(OFFSET_PTR_BUTTON + arguments[0].button, 0);
    }

    onpointerhold() {
      return this.setUint8(OFFSET_PTR_BUTTON + arguments[0].button, 1);
    }

    onpointermove() {
      var offsetX, offsetY;
      ({offsetX, offsetY} = arguments[0]);
      this.setXDelta(-this.getX() + this.setX(offsetX)).setYRotate(-this.getXDelta() / 100) % Math.PI;
      this.setYDelta(+this.getY() - this.setY(offsetY)).setXRotate(-this.getYDelta() / 100) % Math.PI;
      return this.setLooking(1);
    }

    onmousescroll() {
      var deltaX, deltaY;
      ({deltaX, deltaY} = arguments[0]);
      this.setXScale(deltaX);
      this.setZScale(0.01 * this.setYScale(deltaY));
      return this.setZooming(1);
    }

    oncanvasclick() {
      return this.setPtrClick(arguments[0].button);
    }

    ondoubleclick() {
      return this.setPtrDblClick(arguments[0].button);
    }

    getAllPrograms() {
      return this.findAllChilds().filter(function(v) {
        return v instanceof Program;
      });
    }

    getAllBuffers() {
      return this.findAllChilds().filter(function(p) {
        return p instanceof Buffer;
      });
    }

    getAllShaders() {
      return this.getAllPrograms().flatMap(function(p) {
        return p.getAllShaders();
      });
    }

    getProgram() {
      return this.getAllPrograms().find(function(p) {
        return p.getInUseStatus();
      });
    }

    getVertShader() {
      return this.getProgram().getVertShader();
    }

    getFragShader() {
      return this.getProgram().getFragShader();
    }

    getAttributes() {
      return this.getProgram().getAttributes();
    }

    getUniforms() {
      return this.getProgram().getUniforms();
    }

    getAllVariables() {
      return this.getProgram().getAllVariables();
    }

    getArrayBuffer() {
      return this.getTypedArray().slice().buffer;
    }

    getCanvasNode() {
      return this.getLinkedNode().canvas;
    }

    setCanvasNode() {
      this.setLinkedNode(arguments[0].getContext("webgl2"));
      return this;
    }

    getDrawActive() {
      return this.getUint8(OFFSET_DRAW_ACTIVE);
    }

    setDrawActive() {
      this.setUint8(OFFSET_DRAW_ACTIVE, arguments[0]);
      return this;
    }

    getCullEnabled() {
      return this.getUint8(OFFSET_CULL_ENABLED);
    }

    setCullEnabled() {
      this.setUint8(OFFSET_CULL_ENABLED, arguments[0]);
      return this;
    }

    getBlendActive() {
      return this.getUint8(OFFSET_BLEND_ACTIVE);
    }

    setBlendActive() {
      this.setUint8(OFFSET_BLEND_ACTIVE, arguments[0]);
      return this;
    }

    getDepthActive() {
      return this.getUint8(OFFSET_DEPTH_ACTIVE);
    }

    setDepthActive() {
      this.setUint8(OFFSET_DEPTH_ACTIVE, arguments[0]);
      return this;
    }

    getClearDepth() {
      return this.getFloat32(OFFSET_CLEAR_DEPTH);
    }

    setClearDepth() {
      this.setFloat32(OFFSET_CLEAR_DEPTH, arguments[0]);
      return this;
    }

    keyDepthTest() {
      return this.keyUint16(OFFSET_DEPTH_TEST);
    }

    getDepthTest() {
      return this.getUint16(OFFSET_DEPTH_TEST);
    }

    setDepthTest() {
      this.setUint16(OFFSET_DEPTH_TEST, arguments[0]);
      return this;
    }

    keyCullFace() {
      return this.keyUint16(OFFSET_CULL_FACE);
    }

    getCullFace() {
      return this.getUint16(OFFSET_CULL_FACE);
    }

    setCullFace() {
      this.setUint16(OFFSET_CULL_FACE, arguments[0]);
      return this;
    }

    keyFrontFace() {
      return this.keyUint16(OFFSET_FRONTFACE);
    }

    getFrontFace() {
      return this.getUint16(OFFSET_FRONTFACE);
    }

    setFrontFace() {
      this.setUint16(OFFSET_FRONTFACE, arguments[0]);
      return this;
    }

    keyDepthFunc() {
      return this.keyUint16(OFFSET_DEPTH_FUNC);
    }

    getDepthFunc() {
      return this.getUint16(OFFSET_DEPTH_FUNC);
    }

    setDepthFunc() {
      this.setUint16(OFFSET_DEPTH_FUNC, arguments[0]);
      return this;
    }

    keyClearMask() {
      return this.keyUint16(OFFSET_CLEAR_MASK);
    }

    getClearMask() {
      return this.getUint16(OFFSET_CLEAR_MASK);
    }

    setClearMask() {
      this.setUint16(OFFSET_CLEAR_MASK, arguments[0]);
      return this;
    }

    rgbClearColor() {
      return this.rgbColor4(OFFSET_CLEAR_COLOR);
    }

    getClearColor() {
      return this.getColor4(OFFSET_CLEAR_COLOR);
    }

    setClearColor() {
      this.setColor4(OFFSET_CLEAR_COLOR, arguments[0]);
      return this;
    }

    keyBindTarget() {
      return this.keyUint16(OFFSET_BIND_TARGET);
    }

    getBindTarget() {
      return this.getUint16(OFFSET_BIND_TARGET);
    }

    setBindTarget() {
      this.setUint16(OFFSET_BIND_TARGET, arguments[0]);
      return this;
    }

    keyBlendEquate() {
      return this.keyUint16(OFFSET_BLEND_EQUATE);
    }

    getBlendEquate() {
      return this.getUint16(OFFSET_BLEND_EQUATE);
    }

    setBlendEquate() {
      this.setUint16(OFFSET_BLEND_EQUATE, arguments[0]);
      return this;
    }

    keyBlendInArg() {
      return this.keyUint16(OFFSET_BLEND_INARG);
    }

    getBlendInArg() {
      return this.getUint16(OFFSET_BLEND_INARG);
    }

    setBlendInArg() {
      this.setUint16(OFFSET_BLEND_INARG, arguments[0]);
      return this;
    }

    keyBlendOutArg() {
      return this.keyUint16(OFFSET_BLEND_OUTARG);
    }

    getBlendOutArg() {
      return this.getUint16(OFFSET_BLEND_OUTARG);
    }

    setBlendOutArg() {
      this.setUint16(OFFSET_BLEND_OUTARG, arguments[0]);
      return this;
    }

    keyBlendFunc() {
      return this.keyUint16(OFFSET_BLEND_FUNC);
    }

    getBlendFunc() {
      return this.getUint16(OFFSET_BLEND_FUNC);
    }

    setBlendFunc() {
      this.setUint16(OFFSET_BLEND_FUNC, arguments[0]);
      return this;
    }

    getWidth() {
      return this.getFloat32(OFFSET_WIDTH);
    }

    setWidth() {
      this.setFloat32(OFFSET_WIDTH, arguments[0]);
      return this;
    }

    getHeight() {
      return this.getFloat32(OFFSET_HEIGHT);
    }

    setHeight() {
      this.setFloat32(OFFSET_HEIGHT, arguments[0]);
      return this;
    }

    getLeft() {
      return this.getFloat32(OFFSET_LEFT);
    }

    setLeft() {
      this.setFloat32(OFFSET_LEFT, arguments[0]);
      return this;
    }

    getTop() {
      return this.getFloat32(OFFSET_TOP);
    }

    setTop() {
      this.setFloat32(OFFSET_TOP, arguments[0]);
      return this;
    }

    getPixelRatio() {
      return this.getFloat32(OFFSET_PIXEL_RATIO);
    }

    setPixelRatio() {
      this.setFloat32(OFFSET_PIXEL_RATIO, arguments[0]);
      return this;
    }

    getAspectRatio() {
      return this.getFloat32(OFFSET_ASPECT_RATIO);
    }

    setAspectRatio() {
      this.setFloat32(OFFSET_ASPECT_RATIO, arguments[0]);
      return this;
    }

    getShiftRatio() {
      return this.getFloat32(OFFSET_SHIFT_RATIO);
    }

    setShiftRatio() {
      this.setFloat32(OFFSET_SHIFT_RATIO, arguments[0]);
      return this;
    }

    getWalking() {
      return this.getUint8(OFFSET_WALKING);
    }

    setWalking() {
      this.setUint8(OFFSET_WALKING, arguments[0]);
      return this;
    }

    getJumping() {
      return this.getUint8(OFFSET_JUMPING);
    }

    setJumping() {
      this.setUint8(OFFSET_JUMPING, arguments[0]);
      return this;
    }

    getLooking() {
      return this.getUint8(OFFSET_LOOKING);
    }

    setLooking() {
      this.setUint8(OFFSET_LOOKING, arguments[0]);
      return this;
    }

    getZooming() {
      return this.getUint8(OFFSET_ZOOMING);
    }

    setZooming() {
      this.setUint8(OFFSET_ZOOMING, arguments[0]);
      return this;
    }

    getDragging() {
      return this.getUint8(OFFSET_DRAGGING);
    }

    setDragging() {
      this.setUint8(OFFSET_DRAGGING, arguments[0]);
      return this;
    }

    getRotating() {
      return this.getUint8(OFFSET_ROTATING);
    }

    setRotating() {
      this.setUint8(OFFSET_ROTATING, arguments[0]);
      return this;
    }

    getKeyMeta() {
      return this.getUint8(OFFSET_KEY_META);
    }

    setKeyMeta() {
      this.setUint8(OFFSET_KEY_META, arguments[0]);
      return this;
    }

    getKeyCtrl() {
      return this.getUint8(OFFSET_KEY_CTRL);
    }

    setKeyCtrl() {
      this.setUint8(OFFSET_KEY_CTRL, arguments[0]);
      return this;
    }

    getKeyShift() {
      return this.getUint8(OFFSET_KEY_SHIFT);
    }

    setKeyShift() {
      this.setUint8(OFFSET_KEY_SHIFT, arguments[0]);
      return this;
    }

    getKeyAlt() {
      return this.getUint8(OFFSET_KEY_ALT);
    }

    setKeyAlt() {
      this.setUint8(OFFSET_KEY_ALT, arguments[0]);
      return this;
    }

    getMoveFwd() {
      return this.getUint8(OFFSET_MOVE_FWD);
    }

    setMoveFwd() {
      this.setUint8(OFFSET_MOVE_FWD, arguments[0]);
      return this;
    }

    getMoveBack() {
      return this.getUint8(OFFSET_MOVE_BACK);
    }

    setMoveBack() {
      this.setUint8(OFFSET_MOVE_BACK, arguments[0]);
      return this;
    }

    getMoveLeft() {
      return this.getUint8(OFFSET_MOVE_LEFT);
    }

    setMoveLeft() {
      this.setUint8(OFFSET_MOVE_LEFT, arguments[0]);
      return this;
    }

    getMoveRight() {
      return this.getUint8(OFFSET_MOVE_RIGHT);
    }

    setMoveRight() {
      this.setUint8(OFFSET_MOVE_RIGHT, arguments[0]);
      return this;
    }

    getMoveUp() {
      return this.getUint8(OFFSET_MOVE_UP);
    }

    setMoveUp() {
      this.setUint8(OFFSET_MOVE_UP, arguments[0]);
      return this;
    }

    getMoveDown() {
      return this.getUint8(OFFSET_MOVE_DOWN);
    }

    setMoveDown() {
      this.setUint8(OFFSET_MOVE_DOWN, arguments[0]);
      return this;
    }

    getPtrClick() {
      return this.getUint8(OFFSET_PTR_CLICK);
    }

    setPtrClick() {
      this.setUint8(OFFSET_PTR_CLICK, arguments[0]);
      return this;
    }

    getPtrDblClick() {
      return this.getUint8(OFFSET_PTR_DCLICK);
    }

    setPtrDblClick() {
      this.setUint8(OFFSET_PTR_DCLICK, arguments[0]);
      return this;
    }

    getUXEnabled() {
      return this.getUint8(OFFSET_UX_ENABLED);
    }

    setUXEnabled() {
      this.setUint8(OFFSET_UX_ENABLED, arguments[0]);
      return this;
    }

    getX() {
      return this.getFloat32(OFFSET_X);
    }

    setX() {
      return this.setFloat32(OFFSET_X, arguments[0]);
    }

    getXDelta() {
      return this.getFloat32(OFFSET_DX);
    }

    setXDelta() {
      this.setFloat32(OFFSET_DX, arguments[0]);
      return this;
    }

    getXRotate() {
      return this.getFloat32(OFFSET_RX);
    }

    setXRotate() {
      return this.setFloat32(OFFSET_RX, arguments[0]);
    }

    getXScale() {
      return this.getFloat32(OFFSET_SX);
    }

    setXScale() {
      return this.setFloat32(OFFSET_SX, arguments[0]);
    }

    getXVector() {
      return this.getFloat32(OFFSET_VX);
    }

    setXVector() {
      return this.setFloat32(OFFSET_VX, arguments[0]);
    }

    getY() {
      return this.getFloat32(OFFSET_Y);
    }

    setY() {
      return this.setFloat32(OFFSET_Y, arguments[0]);
    }

    getYDelta() {
      return this.getFloat32(OFFSET_DY);
    }

    setYDelta() {
      this.setFloat32(OFFSET_DY, arguments[0]);
      return this;
    }

    getYRotate() {
      return this.getFloat32(OFFSET_RY);
    }

    setYRotate() {
      return this.setFloat32(OFFSET_RY, arguments[0]);
    }

    getYScale() {
      return this.getFloat32(OFFSET_SY);
    }

    setYScale() {
      return this.setFloat32(OFFSET_SY, arguments[0]);
    }

    getYVector() {
      return this.getFloat32(OFFSET_VY);
    }

    setYVector() {
      return this.setFloat32(OFFSET_VY, arguments[0]);
    }

    getZScale() {
      return this.getFloat32(OFFSET_SZ);
    }

    setZScale() {
      return this.setFloat32(OFFSET_SZ, arguments[0]);
    }

    getZVector() {
      return this.getFloat32(OFFSET_VZ);
    }

    setZVector() {
      return this.setFloat32(OFFSET_VZ, arguments[0]);
    }

  };

  GL.byteLength = 4 * 48;

  GL.typedArray = Uint32Array;

  Object.defineProperties(GL.prototype, {
    gl: {
      get: GL.prototype.getLinkedNode
    },
    program: {
      get: GL.prototype.getProgram
    },
    programVertex: {
      get: GL.prototype.getVertShader
    },
    programFragment: {
      get: GL.prototype.getFragShader
    },
    programAttribs: {
      get: GL.prototype.getAttributes
    },
    programUniforms: {
      get: GL.prototype.getUniforms
    },
    allBuffers: {
      get: GL.prototype.getAllBuffers
    },
    allShaders: {
      get: GL.prototype.getAllShaders
    },
    allPrograms: {
      get: GL.prototype.getAllPrograms
    },
    allVariables: {
      get: GL.prototype.getAllVariables
    },
    nodeBuffer: {
      get: GL.prototype.getArrayBuffer
    },
    nodeCanvas: {
      get: GL.prototype.getCanvasNode,
      set: GL.prototype.setCanvasNode
    },
    glActive: {
      get: GL.prototype.getDrawActive,
      set: GL.prototype.setDrawActive
    },
    glCullEnabled: {
      get: GL.prototype.getCullEnabled,
      set: GL.prototype.setCullEnabled
    },
    glCullFace: {
      get: GL.prototype.keyCullFace,
      set: GL.prototype.setCullFace
    },
    glFrontFace: {
      get: GL.prototype.keyFrontFace,
      set: GL.prototype.setFrontFace
    },
    glBlendEnabled: {
      get: GL.prototype.getBlendActive,
      set: GL.prototype.setBlendActive
    },
    glBlendEquation: {
      get: GL.prototype.keyBlendEquate,
      set: GL.prototype.setBlendEquate
    },
    glBlendFunc: {
      get: GL.prototype.keyBlendFunc,
      set: GL.prototype.setBlendFunc
    },
    glBlendInArg: {
      get: GL.prototype.keyBlendInArg,
      set: GL.prototype.setBlendInArg
    },
    glBlendOutArg: {
      get: GL.prototype.keyBlendOutArg,
      set: GL.prototype.setBlendOutArg
    },
    glDepthEnabled: {
      get: GL.prototype.getDepthActive,
      set: GL.prototype.setDepthActive
    },
    glDepthTest: {
      get: GL.prototype.keyDepthTest,
      set: GL.prototype.setDepthTest
    },
    glDepthFunc: {
      get: GL.prototype.keyDepthFunc,
      set: GL.prototype.setDepthFunc
    },
    glClearMask: {
      get: GL.prototype.keyClearMask,
      set: GL.prototype.setClearMask
    },
    glBindTarget: {
      get: GL.prototype.keyBindTarget,
      set: GL.prototype.setBindTarget
    },
    glClearDepth: {
      get: GL.prototype.getClearDepth,
      set: GL.prototype.setClearDepth
    },
    glClearColor: {
      get: GL.prototype.getClearColor,
      set: GL.prototype.setClearColor
    },
    pxWidth: {
      get: GL.prototype.getWidth,
      set: GL.prototype.setWidth
    },
    pxHeight: {
      get: GL.prototype.getHeight,
      set: GL.prototype.setHeight
    },
    pxLeft: {
      get: GL.prototype.getLeft,
      set: GL.prototype.setLeft
    },
    pxTop: {
      get: GL.prototype.getTop,
      set: GL.prototype.setTop
    },
    ratioPixel: {
      get: GL.prototype.getPixelRatio,
      set: GL.prototype.setPixelRatio
    },
    ratioAspect: {
      get: GL.prototype.getAspectRatio,
      set: GL.prototype.setAspectRatio
    },
    ratioShift: {
      get: GL.prototype.getShiftRatio,
      set: GL.prototype.setShiftRatio
    },
    uxActive: {
      get: GL.prototype.getUXEnabled,
      set: GL.prototype.setUXEnabled
    },
    uxMoveWalking: {
      get: GL.prototype.getWalking,
      set: GL.prototype.setWalking
    },
    uxMoveJumping: {
      get: GL.prototype.getJumping,
      set: GL.prototype.setJumping
    },
    uxKeyShift: {
      get: GL.prototype.getKeyShift,
      set: GL.prototype.setKeyShift
    },
    uxKeyAlt: {
      get: GL.prototype.getKeyAlt,
      set: GL.prototype.setKeyAlt
    },
    uxKeyMeta: {
      get: GL.prototype.getKeyMeta,
      set: GL.prototype.setKeyMeta
    },
    uxKeyCtrl: {
      get: GL.prototype.getKeyCtrl,
      set: GL.prototype.setKeyCtrl
    },
    uxPtrClick: {
      get: GL.prototype.getPtrClick,
      set: GL.prototype.setPtrClick
    },
    uxPtrDblClick: {
      get: GL.prototype.getPtrDblClick,
      set: GL.prototype.setPtrDblClick
    },
    uxPtrLooking: {
      get: GL.prototype.getLooking,
      set: GL.prototype.setLooking
    },
    uxPtrZooming: {
      get: GL.prototype.getZooming,
      set: GL.prototype.setZooming
    },
    uxPtrDragging: {
      get: GL.prototype.getDragging,
      set: GL.prototype.setDragging
    },
    uxPtrRotating: {
      get: GL.prototype.getRotating,
      set: GL.prototype.setRotating
    },
    uxMoveFwd: {
      get: GL.prototype.getMoveFwd,
      set: GL.prototype.setMoveFwd
    },
    uxMoveBack: {
      get: GL.prototype.getMoveBack,
      set: GL.prototype.setMoveBack
    },
    uxMoveLeft: {
      get: GL.prototype.getMoveLeft,
      set: GL.prototype.setMoveLeft
    },
    uxMoveRight: {
      get: GL.prototype.getMoveRight,
      set: GL.prototype.setMoveRight
    },
    uxMoveUp: {
      get: GL.prototype.getMoveUp,
      set: GL.prototype.setMoveUp
    },
    uxMoveDown: {
      get: GL.prototype.getMoveDown,
      set: GL.prototype.setMoveDown
    },
    x: {
      get: GL.prototype.getX,
      set: GL.prototype.setX
    },
    xDelta: {
      get: GL.prototype.getXDelta,
      set: GL.prototype.setXDelta
    },
    xRotate: {
      get: GL.prototype.getXRotate,
      set: GL.prototype.setXRotate
    },
    xScale: {
      get: GL.prototype.getXScale,
      set: GL.prototype.setXScale
    },
    xVector: {
      get: GL.prototype.getXVector,
      set: GL.prototype.setXVector
    },
    y: {
      get: GL.prototype.getY,
      set: GL.prototype.setY
    },
    yDelta: {
      get: GL.prototype.getYDelta,
      set: GL.prototype.setYDelta
    },
    yRotate: {
      get: GL.prototype.getYRotate,
      set: GL.prototype.setYRotate
    },
    yScale: {
      get: GL.prototype.getYScale,
      set: GL.prototype.setYScale
    },
    yVector: {
      get: GL.prototype.getYVector,
      set: GL.prototype.setYVector
    },
    zScale: {
      get: GL.prototype.getZScale,
      set: GL.prototype.setZScale
    },
    zVector: {
      get: GL.prototype.getZVector,
      set: GL.prototype.setZVector
    }
  });

  return GL;

}).call(this);

export default GL.registerClass();

OFFSET_INUSE_STATUS = 1;

OFFSET_LINKED_STATUS = 1 + 1;

OFFSET_ATTACH_STATUS = 1 + 2;

export var Program = (function() {
  class Program extends Pointer {
    link() {
      if (this.getLinkedStatus()) {
        return this;
      }
      this.getParentPtrO().linkProgram(this.getGLProgram());
      this.setLinkedStatus(this.getGLLinkStatus(this.getGLValidate()));
      return this;
    }

    use() {
      if (this.getUint8(OFFSET_INUSE_STATUS)) {
        return this;
      }
      this.getParentPtrO().useProgram(this.getLinkedNode());
      this.setAttachStatus(this.setInUseStatus(Boolean(this)));
      return this;
    }

    load() {
      if (!this.getAttachStatus()) {
        this.link().use();
      }
      return this;
    }

    create() {
      return this.getParentPtrO().createProgram();
    }

    delete() {
      this.getParentPtrO().deleteProgram(this.getGLProgram());
      this.setLinkedStatus(this.setInUseStatus(0));
      return this;
    }

    getGLProgram() {
      return this.getLinkedNode() || this.setGLProgram(this.create());
    }

    setGLProgram() {
      return this.setLinkedNode(arguments[0]);
    }

    getGLParameter() {
      return this.getParentPtrO().getProgramParameter(this.getGLProgram(), arguments[0]);
    }

    getGLLinkStatus() {
      return this.getGLParameter(this.LINK_STATUS);
    }

    getGLValidate() {
      return this.getParentPtrO().validateProgram(this.getGLProgram());
    }

    getGLInfoLog() {
      return this.getParentPtrO().getProgramInfoLog(this.getGLProgram());
    }

    getGLIsProgram() {
      return this.getParentPtrO().isProgram(this.getGLProgram());
    }

    getGLShaders() {
      return this.getParentPtrO().getAttachedShaders(this.getGLProgram());
    }

    getInUseStatus() {
      return this.getUint8(OFFSET_INUSE_STATUS);
    }

    setInUseStatus() {
      return this.setUint8(OFFSET_INUSE_STATUS, arguments[0]);
    }

    getLinkedStatus() {
      return this.getUint8(OFFSET_LINKED_STATUS);
    }

    setLinkedStatus() {
      return this.setUint8(OFFSET_LINKED_STATUS, arguments[0]);
    }

    getAttachStatus() {
      return this.getUint8(OFFSET_ATTACH_STATUS);
    }

    setAttachStatus() {
      return this.setUint8(OFFSET_ATTACH_STATUS, arguments[0]);
    }

    getAllShaders() {
      return this.findAllChilds().filter(function(v) {
        return v instanceof Shader;
      });
    }

    getVertShader() {
      return this.getAllShaders().find(function(v) {
        return v.getIsAttached() && v.isVertexShader();
      });
    }

    getFragShader() {
      return this.getAllShaders().find(function(v) {
        return v.getIsAttached() && !v.isVertexShader();
      });
    }

    getGLVertShader() {
      return this.getVertShader().getGLShader();
    }

    getGLFragShader() {
      return this.getFragShader().getGLShader();
    }

    getAttributes() {
      return this.getVertShader().getAttributes();
    }

    getUniforms() {
      return this.getVertShader().getUniforms();
    }

    getAllVariables() {
      return this.getVertShader().getAllVariables();
    }

    setVertShader() {
      var vShader;
      if (!(vShader = this.getVertShader())) {
        if (arguments[0].constructor === String) {
          vShader = Shader.fromSource(arguments[0]);
        }
      }
      if (vShader instanceof Shader) {
        this.add(vShader);
        vShader.load();
      }
      if (this.getFragShader()) {
        this.load();
      }
      return this;
    }

    setFragShader() {
      var fShader;
      if (!(fShader = this.getFragShader())) {
        if (arguments[0].constructor === String) {
          fShader = new Shader();
        }
      }
      if (fShader instanceof Shader) {
        this.add(fShader);
        fShader.setSourceText(arguments[0]).setShaderType(Shader.prototype.FRAGMENT).reload();
      }
      if (this.getVertShader()) {
        this.load();
      }
      return this;
    }

  };

  Program.byteLength = 4 * 8;

  Program.typedArray = Int32Array;

  Program.prototype.LINK_STATUS = WebGL2RenderingContext.LINK_STATUS;

  return Program;

}).call(this);

Object.defineProperties(Program.registerClass().prototype, {
  gl: {
    get: Program.prototype.getParentPtrO
  },
  glLinkStatus: {
    get: Program.prototype.getGLLinkStatus
  },
  glShaders: {
    get: Program.prototype.getGLShaders
  },
  glInfoLog: {
    get: Program.prototype.getGLInfoLog
  },
  glIsProgram: {
    get: Program.prototype.getGLIsProgram
  },
  glVertexShader: {
    get: Program.prototype.getGLVertShader
  },
  glProgram: {
    get: Program.prototype.getGLProgram
  },
  shaders: {
    get: Program.prototype.getAllShaders
  },
  isLinked: {
    get: Program.prototype.getLinkedStatus,
    set: Program.prototype.setLinkedNode
  },
  isIsUse: {
    get: Program.prototype.getInUseStatus,
    set: Program.prototype.setInUseStatus
  },
  isAttached: {
    get: Program.prototype.getAttachStatus,
    set: Program.prototype.setAttachStatus
  },
  vertexShader: {
    get: Program.prototype.getVertShader,
    set: Program.prototype.setVertShader
  },
  fragmentShader: {
    get: Program.prototype.getFragShader,
    set: Program.prototype.setFragShader
  },
  attributes: {
    get: Program.prototype.getAttributes
  },
  uniforms: {
    get: Program.prototype.getUniforms
  },
  variables: {
    get: Program.prototype.getAllVariables
  }
});

OFFSET_SHADER_TYPE = 4 * 0;

OFFSET_IS_UPLOADED = 4 * 0 + 2;

OFFSET_IS_COMPILED = 4 * 0 + 3;

OFFSET_IS_ATTACHED = 4 * 1;

OFFSET_CHAR_LENGTH = 4 * 1 + 2;

OFFSET_SOURCE_TEXT = 4 * 2;

export var Shader = (function() {
  class Shader extends Pointer {
    static parse() {
      return [...Uniform.parse(arguments[0]), ...Attribute.parse(arguments[0])];
    }

    static fromSource() {
      var byteLength, byteSource, charLength, j, key, len, parsedKeys, ptr, shaderType, textSource;
      textSource = arguments[0];
      parsedKeys = this.parse(textSource);
      shaderType = /gl_Frag/.test(textSource) ? Shader.prototype.FRAGMENT : Shader.prototype.VERTEX;
      byteSource = new TextEncoder().encode(textSource);
      charLength = byteSource.byteLength;
      byteLength = charLength + OFFSET_SOURCE_TEXT;
      ptr = Shader.malloc(byteLength);
      ptr.setCharLength(charLength);
      ptr.setByteSource(byteSource);
      ptr.setShaderType(shaderType);
      for (j = 0, len = parsedKeys.length; j < len; j++) {
        key = parsedKeys[j];
        key.setParentPtri(ptr);
      }
      return ptr;
    }

    toString() {
      return this.getSourceText();
    }

    create() {
      return this.getGL().createShader(this.getShaderType() || this.setShaderType(arguments[0]));
    }

    delete() {
      if (this.getLinkedNode()) {
        this.unload();
      }
      return this;
    }

    change() {
      return this.unload().create(arguments[0]).reload();
    }

    upload() {
      if (this.getIsUploaded()) {
        return this;
      }
      this.getGL().shaderSource(this.getGLShader(), this.getSourceText());
      this.setIsUploaded(1);
      return this;
    }

    compile() {
      if (this.getIsCompiled()) {
        return this;
      }
      this.getGL().compileShader(this.getGLShader(), this.getSourceText());
      this.setIsCompiled(1);
      return this;
    }

    attach() {
      if (this.getIsAttached()) {
        return this;
      }
      this.getGL().attachShader(this.getGLProgram(), this.getGLShader());
      this.setIsAttached(1);
      return this;
    }

    load() {
      this.upload().compile().attach().check();
      return this;
    }

    parse() {
      var j, key, len, ref;
      if (!this.isVertexShader()) {
        return this;
      }
      this.getAllVariables().forEach(Pointer.removePointer);
      ref = Shader.parse(this.getSourceText());
      for (j = 0, len = ref.length; j < len; j++) {
        key = ref[j];
        this.add(key);
      }
      return this;
    }

    reload() {
      this.unload().load();
      return this;
    }

    unload() {
      var node;
      this.setIsCompiled(this.setIsAttached(this.setIsUploaded(0)));
      if (node = this.getLinkedNode()) {
        this.getGL().deleteShader(node);
      }
      return this;
    }

    check() {
      this.setIsUploaded(this.getSourceText() === this.getGLSource());
      this.setIsCompiled(this.getGLCompileStatus());
      return this.setIsAttached(this.getProgram().getGLShaders().includes(this.getGLShader()));
    }

    getProgram() {
      return this.getParentPtrP();
    }

    getGL() {
      return this.getParentPtrP().getParentPtrO();
    }

    getGLParameter() {
      return this.getGL().getShaderParameter(this.getGLShader(), arguments[0]);
    }

    getGLInfoLog() {
      return this.getGL().getShaderInfoLog(this.getGLShader());
    }

    getGLIsShader() {
      return this.getGL().isShader(this.getGLShader());
    }

    getGLPrecision() {
      return this.getGL().getShaderPrecisionFormat(arguments[0], arguments[1]);
    }

    getGLShaderType() {
      return this.getGLParameter(this.SHADER_TYPE);
    }

    getGLCompileStatus() {
      return this.getGLParameter(this.COMPILE_STATUS);
    }

    getGLDeleteStatus() {
      return this.getGLParameter(this.DELETE_STATUS);
    }

    getGLProgram() {
      return this.getParentPtrP().getGLProgram();
    }

    isVertexShader() {
      return this.getShaderType() === this.VERTEX;
    }

    getGLShader() {
      return this.getLinkedNode() || this.setGLShader(this.create(this.VERTEX));
    }

    setGLShader() {
      this.setLinkedNode(arguments[0]);
      return arguments[0];
    }

    setGLSource() {
      this.getGL().shaderSource(this.getGLShader(), this.getSourceText());
      return this;
    }

    getGLSource() {
      return this.getGL().getShaderSource(this.getGLShader());
    }

    keyShaderType() {
      return this.keyUint16(OFFSET_SHADER_TYPE);
    }

    getShaderType() {
      return this.getUint16(OFFSET_SHADER_TYPE);
    }

    setShaderType() {
      this.setUint16(OFFSET_SHADER_TYPE, arguments[0]);
      return this;
    }

    getCharLength() {
      return this.getUint16(OFFSET_CHAR_LENGTH);
    }

    setCharLength() {
      return this.setUint16(OFFSET_CHAR_LENGTH, arguments[0]);
    }

    getSourceText() {
      return this.getString(OFFSET_SOURCE_TEXT, OFFSET_CHAR_LENGTH);
    }

    setSourceText() {
      return this.setString(OFFSET_SOURCE_TEXT, arguments[0], OFFSET_CHAR_LENGTH);
    }

    getByteSource() {
      return this.getTArray(OFFSET_SOURCE_TEXT, Uint8Array);
    }

    setByteSource() {
      this.setTArray(OFFSET_SOURCE_TEXT, arguments[0], Uint8Array);
      return this;
    }

    getIsUploaded() {
      return this.getUint8(OFFSET_IS_UPLOADED);
    }

    setIsUploaded() {
      return this.setUint8(OFFSET_IS_UPLOADED, arguments[0]);
    }

    getIsCompiled() {
      return this.getUint8(OFFSET_IS_COMPILED);
    }

    setIsCompiled() {
      return this.setUint8(OFFSET_IS_COMPILED, arguments[0]);
    }

    getIsAttached() {
      return this.getUint8(OFFSET_IS_ATTACHED);
    }

    setIsAttached() {
      return this.setUint8(OFFSET_IS_ATTACHED, arguments[0]);
    }

    getAllVariables() {
      return this.findAllChilds().filter(function(i) {
        return i instanceof ShaderKey;
      });
    }

    getAttributes() {
      return this.findAllChilds().filter(function(i) {
        return i instanceof Attribute;
      });
    }

    getUniforms() {
      return this.findAllChilds().filter(function(i) {
        return i instanceof Uniform;
      });
    }

  };

  Shader.byteLength = 256 * 256;

  Shader.typedArray = Uint8Array;

  Shader.prototype.SHADER_TYPE = WebGL2RenderingContext.SHADER_TYPE;

  Shader.prototype.COMPILE_STATUS = WebGL2RenderingContext.COMPILE_STATUS;

  Shader.prototype.DELETE_STATUS = WebGL2RenderingContext.DELETE_STATUS;

  Shader.prototype.VERTEX = WebGL2RenderingContext.VERTEX_SHADER;

  Shader.prototype.FRAGMENT = WebGL2RenderingContext.FRAGMENT_SHADER;

  Shader.prototype.LOW_FLOAT = WebGL2RenderingContext.LOW_FLOAT;

  Shader.prototype.LOW_INT = WebGL2RenderingContext.LOW_INT;

  Shader.prototype.MEDIUM_FLOAT = WebGL2RenderingContext.MEDIUM_FLOAT;

  Shader.prototype.HIGH_FLOAT = WebGL2RenderingContext.HIGH_FLOAT;

  Shader.prototype.MEDIUM_INT = WebGL2RenderingContext.MEDIUM_INT;

  Shader.prototype.HIGH_INT = WebGL2RenderingContext.HIGH_INT;

  Object.defineProperties(Shader.registerClass().prototype, {
    gl: {
      get: Shader.prototype.getGL
    },
    glProgram: {
      get: Shader.prototype.getGLProgram
    },
    glSource: {
      get: Shader.prototype.getGLSource,
      set: Shader.prototype.setGLSource
    },
    glShader: {
      get: Shader.prototype.getGLShader,
      set: Shader.prototype.setGLShader
    },
    type: {
      get: Shader.prototype.keyShaderType,
      set: Shader.prototype.setShaderType
    },
    source: {
      get: Shader.prototype.getSourceText,
      set: Shader.prototype.setSourceText
    },
    charLength: {
      get: Shader.prototype.getCharLength,
      set: Shader.prototype.setCharLength
    },
    isUploaded: {
      get: Shader.prototype.getIsUploaded,
      set: Shader.prototype.setIsUploaded
    },
    isCompiled: {
      get: Shader.prototype.getIsCompiled,
      set: Shader.prototype.setIsCompiled
    },
    isAttached: {
      get: Shader.prototype.getIsAttached,
      set: Shader.prototype.setIsAttached
    },
    variables: {
      get: Shader.prototype.getAllVariables
    },
    uniforms: {
      get: Shader.prototype.getUniforms
    },
    attributes: {
      get: Shader.prototype.getAttributes
    }
  });

  return Shader;

}).call(this);

OFFSET_TYPE_GLCODE = 4 * 2;

OFFSET_TYPE_LENGTH = 4 * 2 + 2;

OFFSET_KEY_LOCATED = 4 * 2 + 3;

OFFSET_NAME_LENGTH = 4 * 3 + 2;

OFFSET_NAME_TARRAY = 4 * 4;

export var ShaderKey = (function() {
  class ShaderKey extends Pointer {
    getGL() {
      return this.getShader().getGL();
    }

    getShader() {
      return this.getParentPtrP();
    }

    getGLShader() {
      return this.getShader().getGLShader();
    }

    getProgram() {
      return this.getShader().getProgram();
    }

    getGLProgram() {
      return this.getShader().getGLProgram();
    }

    getNameString() {
      return this.getString(OFFSET_NAME_TARRAY, OFFSET_NAME_LENGTH);
    }

    setNameString() {
      return this.setString(OFFSET_NAME_TARRAY, arguments[0], OFFSET_NAME_LENGTH);
    }

    getNameLength() {
      return this.getUint16(OFFSET_NAME_LENGTH);
    }

    setNameLength() {
      return this.setUint16(OFFSET_NAME_LENGTH, arguments[0]);
    }

    keyTypeGLCode() {
      return this.keyUint16(OFFSET_TYPE_GLCODE);
    }

    getTypeGLCode() {
      return this.getUint16(OFFSET_TYPE_GLCODE);
    }

    setTypeGLCode() {
      return this.setUint16(OFFSET_TYPE_GLCODE, arguments[0]);
    }

    getTypeLength() {
      return this.getUint8(OFFSET_TYPE_LENGTH);
    }

    setTypeLength() {
      return this.setUint8(OFFSET_TYPE_LENGTH, arguments[0]);
    }

    getKeyLocated() {
      return this.getUint8(OFFSET_KEY_LOCATED);
    }

    setKeyLocated() {
      this.setUint8(OFFSET_KEY_LOCATED, arguments[0]);
      return arguments[0];
    }

  };

  ShaderKey.byteLength = 4 * 8;

  ShaderKey.typedArray = Uint8Array;

  return ShaderKey;

}).call(this);

Object.defineProperties(ShaderKey.registerClass().prototype, {
  gl: {
    get: ShaderKey.prototype.getGL
  },
  glProgram: {
    get: ShaderKey.prototype.getGLProgram
  },
  glShader: {
    get: ShaderKey.prototype.getGLShader
  },
  program: {
    get: ShaderKey.prototype.getProgram
  },
  shader: {
    get: ShaderKey.prototype.getShader
  },
  name: {
    get: ShaderKey.prototype.getNameString,
    set: ShaderKey.prototype.setNameString
  },
  typeLength: {
    get: ShaderKey.prototype.getTypeLength,
    set: ShaderKey.prototype.setTypeLength
  },
  type: {
    get: ShaderKey.prototype.keyTypeGLCode,
    set: ShaderKey.prototype.setTypeGLCode
  }
});

OFFSET_LOCATION_AT = 4 * 0;

OFFSET_ISNORMALIZE = 4 * 0 + 1;

OFFSET_ATTR_STRIDE = 4 * 0 + 2;

OFFSET_ATTR_OFFSET = 4 * 0 + 3;

export var Attribute = (function() {
  var float, mat4, vec3, vec4;

  class Attribute extends ShaderKey {
    static parse() {
      var j, key, keys, len, offset, source;
      [source] = arguments;
      [keys, offset] = [[], 0];
      source.split(/attribute/g).slice(1).map((line) => {
        var key, name, type;
        [, type, name] = line.split(/\;/g)[0].split(/\s+/g);
        keys.push(key = new Attribute[type]);
        key.setNameString(name);
        key.setTypeLength(key.constructor.itemLength);
        key.setTypeGLCode(WebGL2RenderingContext.FLOAT);
        key.setNormalize(false);
        key.setOffset(offset);
        return offset += key.getTypeLength() * 4;
      });
      for (j = 0, len = keys.length; j < len; j++) {
        key = keys[j];
        key.setStride(offset);
      }
      return keys;
    }

    getGLLocation() {
      var gl, location, program;
      if (this.getKeyLocated()) {
        return this.getLocation();
      }
      if (!(gl = this.getGL())) {
        return;
      }
      if (!(program = this.getGLProgram())) {
        return;
      }
      if (!(location = gl.getAttribLocation(program, this.getNameString()))) {
        return;
      }
      return this.setKeyLocated(this.setLocation(location));
    }

    getLocation() {
      if (!this.getKeyLocated()) {
        return this.getGLLocation();
      }
      return this.getUint8(OFFSET_LOCATION_AT);
    }

    setLocation() {
      return this.setUint8(OFFSET_LOCATION_AT, arguments[0]);
    }

    getNormalize() {
      return this.getUint8(OFFSET_ISNORMALIZE);
    }

    setNormalize() {
      return this.setUint8(OFFSET_ISNORMALIZE, arguments[0]);
    }

    getStride() {
      return this.getUint8(OFFSET_ATTR_STRIDE);
    }

    setStride() {
      return this.setUint8(OFFSET_ATTR_STRIDE, arguments[0]);
    }

    getOffset() {
      return this.getUint8(OFFSET_ATTR_OFFSET);
    }

    setOffset() {
      return this.setUint8(OFFSET_ATTR_OFFSET, arguments[0]);
    }

  };

  Object.defineProperties(Attribute.registerClass(), {
    vec3: {
      value: vec3 = (function() {
        class vec3 extends Attribute {};

        vec3.itemLength = 3;

        vec3.protoClass = 0;

        vec3.registerClass();

        return vec3;

      }).call(this)
    },
    vec4: {
      value: vec4 = (function() {
        class vec4 extends Attribute {};

        vec4.itemLength = 4;

        vec4.protoClass = 0;

        vec4.registerClass();

        return vec4;

      }).call(this)
    },
    mat4: {
      value: mat4 = (function() {
        class mat4 extends Attribute {};

        mat4.itemLength = 16;

        mat4.protoClass = 0;

        mat4.registerClass();

        return mat4;

      }).call(this)
    },
    float: {
      value: float = (function() {
        class float extends Attribute {};

        float.itemLength = 1;

        float.protoClass = 0;

        float.registerClass();

        return float;

      }).call(this)
    }
  });

  return Attribute;

}).call(this);

Object.defineProperties(Attribute.prototype, {
  glLocation: {
    get: Attribute.prototype.getGLLocation
  },
  location: {
    get: Attribute.prototype.getLocation,
    set: Attribute.prototype.setLocation
  },
  stride: {
    get: Attribute.prototype.getStride,
    set: Attribute.prototype.setStride
  },
  offset: {
    get: Attribute.prototype.getOffset,
    set: Attribute.prototype.setOffset
  },
  normalize: {
    get: Attribute.prototype.getNormalize,
    set: Attribute.prototype.setNormalize
  }
});

export var Uniform = (function() {
  var float, mat4, vec3, vec4;

  class Uniform extends ShaderKey {
    static parse() {
      var keys, source;
      [source] = arguments;
      [keys] = [[]];
      source.split(/uniform/g).slice(1).map((line) => {
        var key, name, type;
        [, type, name] = line.split(/\;/g)[0].split(/\s+/g);
        keys.push(key = new Uniform[type]);
        key.setNameString(name);
        key.setTypeLength(key.constructor.itemLength);
        return key.setTypeGLCode(WebGL2RenderingContext.FLOAT);
      });
      return keys;
    }

    getGLLocation() {
      var gl, location, program;
      if (this.getKeyLocated()) {
        return this.getLinkedNode();
      }
      if (!(gl = this.getGL())) {
        return;
      }
      if (!(program = this.getGLProgram())) {
        return;
      }
      if (!(location = gl.getUniformLocation(program, this.getNameString()))) {
        return;
      }
      return this.setKeyLocated(this.setLinkedNode(location));
    }

  };

  Object.defineProperties(Uniform.registerClass(), {
    vec3: {
      value: vec3 = (function() {
        class vec3 extends Uniform {};

        vec3.itemLength = 3;

        vec3.protoClass = 0;

        vec3.registerClass();

        return vec3;

      }).call(this)
    },
    vec4: {
      value: vec4 = (function() {
        class vec4 extends Uniform {};

        vec4.itemLength = 4;

        vec4.protoClass = 0;

        vec4.registerClass();

        return vec4;

      }).call(this)
    },
    mat4: {
      value: mat4 = (function() {
        class mat4 extends Uniform {};

        mat4.itemLength = 16;

        mat4.protoClass = 0;

        mat4.registerClass();

        return mat4;

      }).call(this)
    },
    float: {
      value: float = (function() {
        class float extends Uniform {};

        float.itemLength = 1;

        float.protoClass = 0;

        float.registerClass();

        return float;

      }).call(this)
    }
  });

  return Uniform;

}).call(this);

Object.defineProperties(Uniform.prototype, {
  glLocation: {
    get: Uniform.prototype.getGLLocation
  },
  location: {
    get: Uniform.prototype.getGLLocation
  }
});

OFFSET_BINDING_TARGET = 4 * 0;

OFFSET_BINDING_STATUS = 4 * 0 + 2;

export var Buffer = (function() {
  class Buffer extends Pointer {
    create() {
      var buffer;
      if (this.getLinkedNode()) {
        return this;
      }
      if (buffer = this.getGL().createBuffer()) {
        this.setBindTarget(arguments[0] || this.ARRAY_BUFFER);
      }
      return buffer;
    }

    bind() {
      if (this.getBindStatus()) {
        return this;
      }
      this.getGL().bindBuffer(this.getBindTarget(), this.getGLBuffer());
      this.setBindStatus(1);
      return this;
    }

    load() {
      this.create();
      this.bind();
      return this;
    }

    delete() {
      this.setBindStatus(this.getGL().deleteBuffer(this.getLinkedNode()));
      return this;
    }

    getGL() {
      return this.getParentPtrO();
    }

    getGLBuffer() {
      return this.getLinkedNode() || this.setGLBuffer(this.create());
    }

    setGLBuffer() {
      return this.setLinkedNode(arguments[0]);
    }

    getGLIsBuffer() {
      return this.getGL().isBuffer(this.getLinkedNode());
    }

    getGLParameter() {
      return this.getGL().getParameter(arguments[0]);
    }

    getGLBindings() {
      return {
        ARRAY_BUFFER: this.getGLParameter(this.getGL().ARRAY_BUFFER_BINDING),
        ELEMENT_BUFFER: this.getGLParameter(this.getGL().ELEMENT_ARRAY_BUFFER_BINDING)
      };
    }

    isArrayBuffer() {
      return this.ELEMENT_BUFFER !== this.getBindTarget();
    }

    keyBindTarget() {
      return this.keyUint16(OFFSET_BINDING_TARGET);
    }

    getBindTarget() {
      return this.getUint16(OFFSET_BINDING_TARGET);
    }

    setBindTarget() {
      return this.setUint16(OFFSET_BINDING_TARGET, arguments[0]);
    }

    getBindStatus() {
      return this.getUint16(OFFSET_BINDING_STATUS);
    }

    setBindStatus() {
      return this.setUint16(OFFSET_BINDING_STATUS, arguments[0]);
    }

  };

  Buffer.byteLength = 4 * 2;

  Buffer.typedArray = Float32Array;

  Object.defineProperties(Buffer.prototype, {
    ARRAY_BUFFER: {
      value: WebGL2RenderingContext.ARRAY_BUFFER
    },
    ELEMENT_BUFFER: {
      value: WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER
    },
    COPY_READ: {
      value: WebGL2RenderingContext.COPY_READ_BUFFER
    },
    COPY_WRITE: {
      value: WebGL2RenderingContext.COPY_WRITE_BUFFER
    },
    FEEDBACK: {
      value: WebGL2RenderingContext.TRANSFORM_FEEDBACK_BUFFER
    },
    UNIFORM_BLOCK: {
      value: WebGL2RenderingContext.UNIFORM_BUFFER
    },
    PIXEL_PACK: {
      value: WebGL2RenderingContext.PIXEL_PACK_BUFFER
    },
    PIXEL_UNPACK: {
      value: WebGL2RenderingContext.PIXEL_UNPACK_BUFFER
    }
  });

  return Buffer;

}).call(this);

Object.defineProperties(Buffer.registerClass().prototype, {
  gl: {
    get: Buffer.prototype.getGL
  },
  glBuffer: {
    get: Buffer.prototype.getGLBuffer,
    set: Buffer.prototype.setGLBuffer
  },
  glBindings: {
    get: Buffer.prototype.getGLBindings
  },
  glValidate: {
    get: Buffer.prototype.getGLIsBuffer
  },
  bindTarget: {
    get: Buffer.prototype.keyBindTarget,
    set: Buffer.prototype.setBindTarget
  },
  bindStatus: {
    get: Buffer.prototype.getBindStatus,
    set: Buffer.prototype.setBindStatus
  }
});
