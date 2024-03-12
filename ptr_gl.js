var OFFSET_ASPECT_RATIO, OFFSET_ATTR_OFFSET, OFFSET_ATTR_STRIDE, OFFSET_BIND_TARGET, OFFSET_BLEND_ACTIVE, OFFSET_BLEND_EQUATE, OFFSET_BLEND_FUNC, OFFSET_BLEND_INARG, OFFSET_BLEND_OUTARG, OFFSET_CHAR_LENGTH, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ACTIVE, OFFSET_DEPTH_FUNC, OFFSET_DEPTH_TEST, OFFSET_DRAGGING, OFFSET_DRAW_ACTIVE, OFFSET_DX, OFFSET_DY, OFFSET_FRONTFACE, OFFSET_HEIGHT, OFFSET_INUSE_STATUS, OFFSET_ISNORMALIZE, OFFSET_IS_ATTACHED, OFFSET_IS_COMPILED, OFFSET_IS_UPLOADED, OFFSET_JUMPING, OFFSET_KEY_ALT, OFFSET_KEY_CTRL, OFFSET_KEY_LOCATED, OFFSET_KEY_META, OFFSET_KEY_SHIFT, OFFSET_LEFT, OFFSET_LINKED_STATUS, OFFSET_LOCATION_AT, OFFSET_LOOKING, OFFSET_MOVE_BACK, OFFSET_MOVE_DOWN, OFFSET_MOVE_FWD, OFFSET_MOVE_LEFT, OFFSET_MOVE_RIGHT, OFFSET_MOVE_UP, OFFSET_NAME_LENGTH, OFFSET_NAME_TARRAY, OFFSET_PIXEL_RATIO, OFFSET_PTR_BUTTON, OFFSET_PTR_CLICK, OFFSET_PTR_DCLICK, OFFSET_ROTATING, OFFSET_RX, OFFSET_RY, OFFSET_SHADER_TYPE, OFFSET_SHIFT_RATIO, OFFSET_SOURCE_TEXT, OFFSET_SX, OFFSET_SY, OFFSET_SZ, OFFSET_TIME, OFFSET_TOP, OFFSET_TYPE_GLCODE, OFFSET_TYPE_LENGTH, OFFSET_UX_ENABLED, OFFSET_VX, OFFSET_VY, OFFSET_VZ, OFFSET_WALKING, OFFSET_WIDTH, OFFSET_X, OFFSET_Y, OFFSET_ZOOMING;

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

    getProgram() {
      return this.getAllPrograms().at(0); //TODO get active one
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

export var Program = (function() {
  class Program extends Pointer {
    link() {
      var gl;
      if (this.getLinkedStatus()) {
        return;
      }
      if (!(gl = this.getParentPtrO())) {
        return;
      }
      gl.linkProgram(this.getGLProgram());
      return this.setLinkedStatus(this.getGLLinkStatus());
    }

    use() {}

    //TODO DODODODOODODO
    create() {
      return this.getParentPtrO().createProgram();
    }

    delete() {
      return this.getParentPtrO().deleteProgram(this.getGLProgram());
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
      return this.getGLParameter(WebGL2RenderingContext.LINK_STATUS);
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
      return this.getUint8(OFFSET_INUSE_STATUS, arguments[0]);
    }

    getLinkedStatus() {
      return this.getUint8(OFFSET_LINKED_STATUS);
    }

    setLinkedStatus() {
      return this.getUint8(OFFSET_LINKED_STATUS, arguments[0]);
    }

    getAllShaders() {
      return this.findAllChilds().filter(function(v) {
        return v instanceof Shader;
      });
    }

    getVertShader() {
      return this.getAllShaders().find(function(v) {
        return v.isVertexShader(); //TODO is active??
      });
    }

    getFragShader() {
      return this.getAllShaders().find(function(v) {
        return v.isVertexShader() === false;
      });
    }

    getGLVertShader() {
      return this.getVertShader().getGLShader();
    }

    getGLFragShader() {
      return this.getFragShader().getGLShader();
    }

    setVertShader() {
      var vShader;
      if (!(vShader = this.getVertShader())) {
        this.add(vShader = Shader.fromSource(arguments[0]));
      }
      vShader.upload().compile().attach().check();
      return this;
    }

    setFragShader() {
      var fShader;
      if (!(fShader = this.getFragShader())) {
        this.add(fShader = new Shader());
        fShader.change(Shader.prototype.FRAGMENT);
      }
      fShader.setSourceText(arguments[0]).upload().compile().attach().check();
      return this;
    }

  };

  Program.byteLength = 4 * 8;

  Program.typedArray = Int32Array;

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
  glValidate: {
    get: Program.prototype.getGLValidate
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
  vertexShader: {
    get: Program.prototype.getVertShader,
    set: Program.prototype.setVertShader
  },
  fragmentShader: {
    get: Program.prototype.getFragShader,
    set: Program.prototype.setFragShader
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
    static Fragment() {
      return new this().change(this.FRAGMENT);
    }

    static fromSource() {
      var byteLength, byteSource, charLength, j, key, len, parsedKeys, ptr, shaderType, textSource;
      textSource = arguments[0];
      shaderType = null;
      parsedKeys = [];
      if (/gl_Frag/.test(textSource)) {
        shaderType = Shader.prototype.FRAGMENT;
      } else {
        parsedKeys.push(...Uniform.parse(textSource));
        parsedKeys.push(...Attribute.parse(textSource));
        shaderType = Shader.prototype.VERTEX;
      }
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
      return this.getGL().createShader(this.getShaderType() || this.setShaderType(this.VERTEX));
    }

    delete() {
      this.getGL().deleteShader(this.getLinkedNode());
      return this;
    }

    change() {
      return this.create(this.delete().setShaderType(arguments[0]));
    }

    attach() {
      this.getGL().attachShader(this.getGLProgram(), this.getGLShader());
      return this;
    }

    upload() {
      this.getGL().shaderSource(this.getGLShader(), this.getSourceText());
      return this;
    }

    compile() {
      this.getGL().compileShader(this.getGLShader());
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

    getGLShader() {
      return this.getLinkedNode() || this.setGLShader(this.create());
    }

    setGLShader() {
      return this.setLinkedNode(arguments[0]);
    }

    getGLSource() {
      return this.getGL().getShaderSource(this.getGLShader());
    }

    setGLSource() {
      this.getGL().shaderSource(this.getGLShader(), this.getSourceText());
      return this;
    }

    isVertexShader() {
      return this.getShaderType() === this.VERTEX;
    }

    keyShaderType() {
      return this.keyUint16(OFFSET_SHADER_TYPE);
    }

    getShaderType() {
      return this.getUint16(OFFSET_SHADER_TYPE);
    }

    setShaderType() {
      return this.setUint16(OFFSET_SHADER_TYPE, arguments[0]);
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

  Shader.prototype.SHADER_TYPE = WebGLRenderingContext.SHADER_TYPE;

  Shader.prototype.COMPILE_STATUS = WebGLRenderingContext.COMPILE_STATUS;

  Shader.prototype.DELETE_STATUS = WebGLRenderingContext.DELETE_STATUS;

  Shader.prototype.VERTEX = WebGLRenderingContext.VERTEX_SHADER;

  Shader.prototype.FRAGMENT = WebGLRenderingContext.FRAGMENT_SHADER;

  Shader.prototype.LOW_FLOAT = WebGLRenderingContext.LOW_FLOAT;

  Shader.prototype.LOW_INT = WebGLRenderingContext.LOW_INT;

  Shader.prototype.MEDIUM_FLOAT = WebGLRenderingContext.MEDIUM_FLOAT;

  Shader.prototype.HIGH_FLOAT = WebGLRenderingContext.HIGH_FLOAT;

  Shader.prototype.MEDIUM_INT = WebGLRenderingContext.MEDIUM_INT;

  Shader.prototype.HIGH_INT = WebGLRenderingContext.HIGH_INT;

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
    uniforms: {
      get: Shader.prototype.getUniforms
    },
    attributes: {
      get: Shader.prototype.getAttributes
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
      set: Shader.prototype.setIsCompiledd
    },
    isAttached: {
      get: Shader.prototype.getIsAttached,
      set: Shader.prototype.setIsAttached
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
