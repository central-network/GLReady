var GL, OFFSET_BIND_TARGET, OFFSET_BLEND_ACTIVE, OFFSET_BLEND_EQUATE, OFFSET_BLEND_FUNC, OFFSET_BLEND_INARG, OFFSET_BLEND_OUTARG, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ACTIVE, OFFSET_DEPTH_FUNC, OFFSET_DEPTH_TEST, OFFSET_DRAW_ACTIVE, OFFSET_FRONTFACE;

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

  };

  GL.byteLength = 4 * 48;

  GL.typedArray = Uint32Array;

  Object.defineProperties(GL.prototype, {
    gl: {
      get: GL.prototype.getLinkedNode
    },
    arrayBuffer: {
      get: GL.prototype.getArrayBuffer
    },
    canvas: {
      get: GL.prototype.getCanvasNode,
      set: GL.prototype.setCanvasNode
    },
    drawActive: {
      get: GL.prototype.getDrawActive,
      set: GL.prototype.setDrawActive
    },
    cullEnabled: {
      get: GL.prototype.getCullEnabled,
      set: GL.prototype.setCullEnabled
    },
    cullFace: {
      get: GL.prototype.keyCullFace,
      set: GL.prototype.setCullFace
    },
    frontFace: {
      get: GL.prototype.keyFrontFace,
      set: GL.prototype.setFrontFace
    },
    blendActive: {
      get: GL.prototype.getBlendActive,
      set: GL.prototype.setBlendActive
    },
    blendEquate: {
      get: GL.prototype.keyBlendEquate,
      set: GL.prototype.setBlendEquate
    },
    blendFunc: {
      get: GL.prototype.keyBlendFunc,
      set: GL.prototype.setBlendFunc
    },
    blendInArg: {
      get: GL.prototype.keyBlendInArg,
      set: GL.prototype.setBlendInArg
    },
    blendOutArg: {
      get: GL.prototype.keyBlendOutArg,
      set: GL.prototype.setBlendOutArg
    },
    depthActive: {
      get: GL.prototype.getDepthActive,
      set: GL.prototype.setDepthActive
    },
    depthTest: {
      get: GL.prototype.keyDepthTest,
      set: GL.prototype.setDepthTest
    },
    depthFunc: {
      get: GL.prototype.keyDepthFunc,
      set: GL.prototype.setDepthFunc
    },
    clearMask: {
      get: GL.prototype.keyClearMask,
      set: GL.prototype.setClearMask
    },
    bindTarget: {
      get: GL.prototype.keyBindTarget,
      set: GL.prototype.setBindTarget
    },
    clearDepth: {
      get: GL.prototype.getClearDepth,
      set: GL.prototype.setClearDepth
    },
    clearColor: {
      get: GL.prototype.getClearColor,
      set: GL.prototype.setClearColor
    }
  });

  return GL;

}).call(this);

GL.registerClass();
