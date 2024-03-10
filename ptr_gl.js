var GL, OFFSET_BLEND_ACTIVE, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CULLFACE, OFFSET_CULL_ACTIVE, OFFSET_DEPTH_ACTIVE, OFFSET_DEPTH_FUNC, OFFSET_DEPTH_MASK, OFFSET_DRAW_ACTIVE, OFFSET_FRONTFACE;

import Pointer from "./ptr.js";

OFFSET_DRAW_ACTIVE = 4 * 2;

OFFSET_CULL_ACTIVE = 4 * 2 + 1;

OFFSET_BLEND_ACTIVE = 4 * 2 + 2;

OFFSET_DEPTH_ACTIVE = 4 * 2 + 3;

OFFSET_CULLFACE = 4 * 3;

OFFSET_FRONTFACE = 4 * 3 + 2;

OFFSET_DEPTH_FUNC = 4 * 4;

OFFSET_DEPTH_MASK = 4 * 4 + 2;

OFFSET_CLEAR_DEPTH = 4 * 5;

OFFSET_CLEAR_COLOR = 4 * 6;

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

    getCullActive() {
      return this.getUint8(OFFSET_CULL_ACTIVE);
    }

    setCullActive() {
      return this.setUint8(OFFSET_CULL_ACTIVE, arguments[0]);
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

    keyCullFace() {
      return this.keyUint16(OFFSET_CULLFACE, WebGLRenderingContext);
    }

    getCullFace() {
      return this.getUint16(OFFSET_CULLFACE);
    }

    setCullFace() {
      return this.setUint16(OFFSET_CULLFACE, arguments[0]);
    }

    keyFrontFace() {
      return this.keyUint16(OFFSET_FRONTFACE, WebGLRenderingContext);
    }

    getFrontFace() {
      return this.getUint16(OFFSET_FRONTFACE);
    }

    setFrontFace() {
      return this.setUint16(OFFSET_FRONTFACE, arguments[0]);
    }

    keyDepthFunc() {
      return this.keyUint16(OFFSET_DEPTH_FUNC, WebGLRenderingContext);
    }

    getDepthFunc() {
      return this.getUint16(OFFSET_DEPTH_FUNC);
    }

    setDepthFunc() {
      return this.setUint16(OFFSET_DEPTH_FUNC, arguments[0]);
    }

    keyDepthMask() {
      return this.keyUint16(OFFSET_DEPTH_MASK, WebGLRenderingContext);
    }

    getDepthMask() {
      return this.getUint16(OFFSET_DEPTH_MASK);
    }

    setDepthMask() {
      return this.setUint16(OFFSET_DEPTH_MASK, arguments[0]);
    }

    getClearDepth() {
      return this.getFloat32(OFFSET_CLEAR_DEPTH);
    }

    setClearDepth() {
      return this.setFloat32(OFFSET_CLEAR_DEPTH, arguments[0]);
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
    cullActive: {
      get: GL.prototype.getCullActive,
      set: GL.prototype.setCullActive
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
    depthActive: {
      get: GL.prototype.getDepthActive,
      set: GL.prototype.setDepthActive
    },
    depthFunc: {
      get: GL.prototype.keyDepthFunc,
      set: GL.prototype.setDepthFunc
    },
    depthMask: {
      get: GL.prototype.keyDepthMask,
      set: GL.prototype.setDepthMask
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
