var GL, OFFSET_ASPECT_RATIO, OFFSET_BIND_TARGET, OFFSET_BLEND_ACTIVE, OFFSET_BLEND_EQUATE, OFFSET_BLEND_FUNC, OFFSET_BLEND_INARG, OFFSET_BLEND_OUTARG, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ACTIVE, OFFSET_DEPTH_FUNC, OFFSET_DEPTH_TEST, OFFSET_DRAGGING, OFFSET_DRAW_ACTIVE, OFFSET_DX, OFFSET_DY, OFFSET_FACTOR, OFFSET_FRONTFACE, OFFSET_HEIGHT, OFFSET_JUMPING, OFFSET_KEY_ALT, OFFSET_KEY_CTRL, OFFSET_KEY_META, OFFSET_KEY_SHIFT, OFFSET_LEFT, OFFSET_LOOKING, OFFSET_MOVE_BACK, OFFSET_MOVE_DOWN, OFFSET_MOVE_FWD, OFFSET_MOVE_LEFT, OFFSET_MOVE_RIGHT, OFFSET_MOVE_UP, OFFSET_PIXEL_RATIO, OFFSET_PTR_CLICK, OFFSET_PTR_DCLICK, OFFSET_ROTATING, OFFSET_RX, OFFSET_RY, OFFSET_SX, OFFSET_SY, OFFSET_SZ, OFFSET_TIME, OFFSET_TOP, OFFSET_UX_ENABLED, OFFSET_VALUES, OFFSET_VX, OFFSET_VY, OFFSET_VZ, OFFSET_WALKING, OFFSET_WIDTH, OFFSET_X, OFFSET_Y, OFFSET_ZOOMING;

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

OFFSET_ROTATING = 4 * 14;

OFFSET_DRAGGING = 4 * 14 + 1;

OFFSET_UX_ENABLED = 4 * 14 + 2;

OFFSET_VALUES = 4 * 20;

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

OFFSET_FACTOR = 4 * 33;

OFFSET_TIME = 4 * 34;

OFFSET_WIDTH = 4 * 40;

OFFSET_HEIGHT = 4 * 41;

OFFSET_LEFT = 4 * 42;

OFFSET_TOP = 4 * 43;

OFFSET_PIXEL_RATIO = 4 * 44;

OFFSET_ASPECT_RATIO = 4 * 45;

export default GL = (function() {
  class GL extends Pointer {
    getArray() {
      return this.array;
    }

    getArrayBuffer() {
      return this.array.slice().buffer;
    }

    getCanvasNode() {
      return this.getLinkedNode().canvas;
    }

    setCanvasNode() {
      return this.setLinkedNode(arguments[0].getContext("webgl2"));
    }

    getDrawActive() {
      return this.getUint8(OFFSET_DRAW_ACTIVE);
    }

    setDrawActive() {
      return this.setUint8(OFFSET_DRAW_ACTIVE, arguments[0]);
    }

    getCullEnabled() {
      return this.getUint8(OFFSET_CULL_ENABLED);
    }

    setCullEnabled() {
      return this.setUint8(OFFSET_CULL_ENABLED, arguments[0]);
    }

    getBlendActive() {
      return this.getUint8(OFFSET_BLEND_ACTIVE);
    }

    setBlendActive() {
      return this.setUint8(OFFSET_BLEND_ACTIVE, arguments[0]);
    }

    getDepthActive() {
      return this.getUint8(OFFSET_DEPTH_ACTIVE);
    }

    setDepthActive() {
      return this.setUint8(OFFSET_DEPTH_ACTIVE, arguments[0]);
    }

    getClearDepth() {
      return this.getFloat32(OFFSET_CLEAR_DEPTH);
    }

    setClearDepth() {
      return this.setFloat32(OFFSET_CLEAR_DEPTH, arguments[0]);
    }

    keyDepthTest() {
      return this.keyUint16(OFFSET_DEPTH_TEST);
    }

    getDepthTest() {
      return this.getUint16(OFFSET_DEPTH_TEST);
    }

    setDepthTest() {
      return this.setUint16(OFFSET_DEPTH_TEST, arguments[0]);
    }

    keyCullFace() {
      return this.keyUint16(OFFSET_CULL_FACE);
    }

    getCullFace() {
      return this.getUint16(OFFSET_CULL_FACE);
    }

    setCullFace() {
      return this.setUint16(OFFSET_CULL_FACE, arguments[0]);
    }

    keyFrontFace() {
      return this.keyUint16(OFFSET_FRONTFACE);
    }

    getFrontFace() {
      return this.getUint16(OFFSET_FRONTFACE);
    }

    setFrontFace() {
      return this.setUint16(OFFSET_FRONTFACE, arguments[0]);
    }

    keyDepthFunc() {
      return this.keyUint16(OFFSET_DEPTH_FUNC);
    }

    getDepthFunc() {
      return this.getUint16(OFFSET_DEPTH_FUNC);
    }

    setDepthFunc() {
      return this.setUint16(OFFSET_DEPTH_FUNC, arguments[0]);
    }

    keyClearMask() {
      return this.keyUint16(OFFSET_CLEAR_MASK);
    }

    getClearMask() {
      return this.getUint16(OFFSET_CLEAR_MASK);
    }

    setClearMask() {
      return this.setUint16(OFFSET_CLEAR_MASK, arguments[0]);
    }

    rgbClearColor() {
      return this.rgbColor4(OFFSET_CLEAR_COLOR);
    }

    getClearColor() {
      return this.getColor4(OFFSET_CLEAR_COLOR);
    }

    setClearColor() {
      return this.setColor4(OFFSET_CLEAR_COLOR, arguments[0]);
    }

    keyBindTarget() {
      return this.keyUint16(OFFSET_BIND_TARGET);
    }

    getBindTarget() {
      return this.getUint16(OFFSET_BIND_TARGET);
    }

    setBindTarget() {
      return this.setUint16(OFFSET_BIND_TARGET, arguments[0]);
    }

    keyBlendEquate() {
      return this.keyUint16(OFFSET_BLEND_EQUATE);
    }

    getBlendEquate() {
      return this.getUint16(OFFSET_BLEND_EQUATE);
    }

    setBlendEquate() {
      return this.setUint16(OFFSET_BLEND_EQUATE, arguments[0]);
    }

    keyBlendInArg() {
      return this.keyUint16(OFFSET_BLEND_INARG);
    }

    getBlendInArg() {
      return this.getUint16(OFFSET_BLEND_INARG);
    }

    setBlendInArg() {
      return this.setUint16(OFFSET_BLEND_INARG, arguments[0]);
    }

    keyBlendOutArg() {
      return this.keyUint16(OFFSET_BLEND_OUTARG);
    }

    getBlendOutArg() {
      return this.getUint16(OFFSET_BLEND_OUTARG);
    }

    setBlendOutArg() {
      return this.setUint16(OFFSET_BLEND_OUTARG, arguments[0]);
    }

    keyBlendFunc() {
      return this.keyUint16(OFFSET_BLEND_FUNC);
    }

    getBlendFunc() {
      return this.getUint16(OFFSET_BLEND_FUNC);
    }

    setBlendFunc() {
      return this.setUint16(OFFSET_BLEND_FUNC, arguments[0]);
    }

    getWidth() {
      return this.getFloat32(OFFSET_WIDTH);
    }

    setWidth() {
      return this.setFloat32(OFFSET_WIDTH, arguments[0]);
    }

    getHeight() {
      return this.getFloat32(OFFSET_HEIGHT);
    }

    setHeight() {
      return this.setFloat32(OFFSET_HEIGHT, arguments[0]);
    }

    getLeft() {
      return this.getFloat32(OFFSET_LEFT);
    }

    setLeft() {
      return this.setFloat32(OFFSET_LEFT, arguments[0]);
    }

    getTop() {
      return this.getFloat32(OFFSET_TOP);
    }

    setTop() {
      return this.setFloat32(OFFSET_TOP, arguments[0]);
    }

    getPixelRatio() {
      return this.getFloat32(OFFSET_PIXEL_RATIO);
    }

    setPixelRatio() {
      return this.setFloat32(OFFSET_PIXEL_RATIO, arguments[0]);
    }

    getAspectRatio() {
      return this.getFloat32(OFFSET_ASPECT_RATIO);
    }

    setAspectRatio() {
      return this.setFloat32(OFFSET_ASPECT_RATIO, arguments[0]);
    }

    getWalking() {
      return this.getUint8(OFFSET_WALKING);
    }

    setWalking() {
      return this.setUint8(OFFSET_WALKING, arguments[0]);
    }

    getJumping() {
      return this.getUint8(OFFSET_JUMPING);
    }

    setJumping() {
      return this.setUint8(OFFSET_JUMPING, arguments[0]);
    }

    getLooking() {
      return this.getUint8(OFFSET_LOOKING);
    }

    setLooking() {
      return this.setUint8(OFFSET_LOOKING, arguments[0]);
    }

    getZooming() {
      return this.getUint8(OFFSET_ZOOMING);
    }

    setZooming() {
      return this.setUint8(OFFSET_ZOOMING, arguments[0]);
    }

    getDragging() {
      return this.getUint8(OFFSET_DRAGGING);
    }

    setDragging() {
      return this.setUint8(OFFSET_DRAGGING, arguments[0]);
    }

    getRotating() {
      return this.getUint8(OFFSET_ROTATING);
    }

    setRotating() {
      return this.setUint8(OFFSET_ROTATING, arguments[0]);
    }

    getKeyMeta() {
      return this.getUint8(OFFSET_KEY_META);
    }

    setKeyMeta() {
      return this.setUint8(OFFSET_KEY_META, arguments[0]);
    }

    getKeyCtrl() {
      return this.getUint8(OFFSET_KEY_CTRL);
    }

    setKeyCtrl() {
      return this.setUint8(OFFSET_KEY_CTRL, arguments[0]);
    }

    getKeyShift() {
      return this.getUint8(OFFSET_KEY_SHIFT);
    }

    setKeyShift() {
      return this.setUint8(OFFSET_KEY_SHIFT, arguments[0]);
    }

    getKeyAlt() {
      return this.getUint8(OFFSET_KEY_ALT);
    }

    setKeyAlt() {
      return this.setUint8(OFFSET_KEY_ALT, arguments[0]);
    }

    getMoveFwd() {
      return this.getUint8(OFFSET_MOVE_FWD);
    }

    setMoveFwd() {
      return this.setUint8(OFFSET_MOVE_FWD, arguments[0]);
    }

    getMoveBack() {
      return this.getUint8(OFFSET_MOVE_BACK);
    }

    setMoveBack() {
      return this.setUint8(OFFSET_MOVE_BACK, arguments[0]);
    }

    getMoveLeft() {
      return this.getUint8(OFFSET_MOVE_LEFT);
    }

    setMoveLeft() {
      return this.setUint8(OFFSET_MOVE_LEFT, arguments[0]);
    }

    getMoveRight() {
      return this.getUint8(OFFSET_MOVE_RIGHT);
    }

    setMoveRight() {
      return this.setUint8(OFFSET_MOVE_RIGHT, arguments[0]);
    }

    getMoveUp() {
      return this.getUint8(OFFSET_MOVE_UP);
    }

    setMoveUp() {
      return this.setUint8(OFFSET_MOVE_UP, arguments[0]);
    }

    getMoveDown() {
      return this.getUint8(OFFSET_MOVE_DOWN);
    }

    setMoveDown() {
      return this.setUint8(OFFSET_MOVE_DOWN, arguments[0]);
    }

    getPtrClick() {
      return this.getUint8(OFFSET_PTR_CLICK);
    }

    setPtrClick() {
      return this.setUint8(OFFSET_PTR_CLICK, arguments[0]);
    }

    getPtrDblClick() {
      return this.getUint8(OFFSET_PTR_DCLICK);
    }

    setPtrDblClick() {
      return this.setUint8(OFFSET_PTR_DCLICK, arguments[0]);
    }

    getUXEnabled() {
      return this.getUint8(OFFSET_UX_ENABLED);
    }

    setUXEnabled() {
      return this.setUint8(OFFSET_UX_ENABLED, arguments[0]);
    }

  };

  GL.byteLength = 4 * 48;

  GL.typedArray = Uint32Array;

  Object.defineProperties(GL.prototype, {
    gl: {
      get: GL.prototype.getLinkedNode
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
    }
  });

  return GL;

}).call(this);

GL.registerClass();
