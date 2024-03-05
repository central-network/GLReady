var LENGTH_CLEAR_COLOR, OFFSET_BIND_TARGET, OFFSET_BLEND_ENABLED, OFFSET_BLEND_EQUATION, OFFSET_BLEND_FUNC_DST, OFFSET_BLEND_FUNC_SRC, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ENABLED, OFFSET_DEPTH_FUNCTION, OFFSET_DEPTH_MASK, OFFSET_FRAME, OFFSET_FRONT_FACE, OFFSET_POINT_SIZE, OFFSET_RENDERING;

import {
  CameraServer
} from "./Camera.js";

import {
  BindServer
} from "./BindServer.js";

import {
  ScreenServer
} from "./ScreenServer.js";

import Pointer from "./Pointer.js";

import Matrix4 from "./Matrix4.js";

OFFSET_RENDERING = 4 * 0;

OFFSET_FRAME = 4 * 1;

LENGTH_CLEAR_COLOR = 4 * 4;

OFFSET_BIND_TARGET = 4 * 9;

OFFSET_CLEAR_COLOR = 4 * 10;

OFFSET_CLEAR_MASK = 4 * 11;

OFFSET_POINT_SIZE = 4 * 12;

OFFSET_BLEND_ENABLED = 4 * 13;

OFFSET_BLEND_FUNC_SRC = 4 * 14;

OFFSET_BLEND_FUNC_DST = 4 * 15;

OFFSET_BLEND_EQUATION = 4 * 16;

OFFSET_DEPTH_ENABLED = 4 * 17;

OFFSET_DEPTH_FUNCTION = 4 * 18;

OFFSET_DEPTH_MASK = 4 * 19;

OFFSET_CLEAR_DEPTH = 4 * 20;

OFFSET_CULL_ENABLED = 4 * 21;

OFFSET_CULL_FACE = 4 * 22;

OFFSET_FRONT_FACE = 4 * 23;

export var length = 1 * 30;

export var byteLength = 4 * length;

export var Color = (function() {
  class Color extends Pointer {};

  Color.byteLength = 16;

  return Color;

}).call(this);

export var GLClient = (function() {
  class GLClient extends Pointer {
    constructor(ptr) {
      super(ptr);
    }

  };

  GLClient.byteLength = byteLength;

  Object.defineProperties(GLClient.prototype, {
    moving: {
      get: function() {
        return this.getInt32(OFFSET_MOVING);
      }
    }
  });

  return GLClient;

}).call(this);

export var GLServer = (function() {
  class GLServer extends Pointer {
    init() {
      this.blendEnabled = WebGL2RenderingContext.BLEND;
      this.blendFuncSrc = WebGL2RenderingContext.SRC_COLOR;
      this.blendFuncDst = WebGL2RenderingContext.DST_COLOR;
      this.blendEquation = WebGL2RenderingContext.FUNC_ADD;
      this.depthEnabled = WebGL2RenderingContext.DEPTH_TEST;
      this.depthFunc = WebGL2RenderingContext.LEQUAL;
      this.depthMask = false;
      this.clearDepth = 1;
      this.clearColor = 0x0f111aff;
      this.clearMask = WebGL2RenderingContext.DEPTH_BUFFER_BIT | WebGL2RenderingContext.COLOR_BUFFER_BIT;
      this.cullEnabled = WebGL2RenderingContext.CULL_FACE;
      this.cullFace = WebGL2RenderingContext.BACK;
      this.frontFace = WebGL2RenderingContext.CCW;
      this.bindTarget = WebGL2RenderingContext.ARRAY_BUFFER;
      return this.pointSize = 10;
    }

    bind(canvas) {
      var gl;
      gl = canvas.getContext("webgl2");
      Object.defineProperties(this, {
        gl: {
          value: gl
        },
        glBuffer: {
          value: gl.createBuffer()
        },
        glProgram: {
          value: gl.createProgram()
        },
        glShaders: {
          value: [gl.createShader(gl.VERTEX_SHADER), gl.createShader(gl.FRAGMENT_SHADER)]
        }
      });
      this.setVertexShader(this.vShaderSource);
      this.setFragmentShader(this.fShaderSource);
      this.updateCull();
      this.updateDepth();
      this.updateBlend();
      this.runProgram();
      this.bindBuffer();
      this.clearSpace();
      this.gl.drawArrays(this.gl.POINTS, 0, 3);
      return this.gl.finish();
    }

    downloadParameter(parameter) {
      return this.gl.getParameter(parameter);
    }

    clearSpace([r, g, b, a] = this.clearColor.toRGBA(this)) {
      this.gl.clearColor(r, g, b, a);
      this.gl.clear(this.clearMask);
      return this;
    }

    bindBuffer() {
      this.gl.bindBuffer(this.bindTarget, this.glBuffer);
      return this;
    }

    runProgram() {
      this.gl.linkProgram(this.glProgram);
      this.gl.useProgram(this.glProgram);
      return this;
    }

    setVertexShader(source) {
      this.gl.shaderSource(this.glShaders[0], source);
      this.gl.compileShader(this.glShaders[0]);
      this.gl.attachShader(this.glProgram, this.glShaders[0]);
      return this;
    }

    setFragmentShader(source) {
      this.gl.shaderSource(this.glShaders[1], source);
      this.gl.compileShader(this.glShaders[1]);
      this.gl.attachShader(this.glProgram, this.glShaders[1]);
      return this;
    }

    updateCull() {
      if (this.cullEnabled) {
        this.gl.cullFace(this.cullFace);
        this.gl.enable(this.cullEnabled);
        this.gl.frontFace(this.frontFace);
      }
      return this;
    }

    updateDepth() {
      if (this.depthEnabled) {
        this.gl.enable(this.depthEnabled);
        this.gl.depthFunc(this.depthFunc);
        this.gl.depthMask(this.depthMask);
        this.gl.clearDepth(this.clearDepth);
      }
      return this;
    }

    updateBlend() {
      if (this.blendEnabled) {
        this.gl.enable(this.blendEnabled);
        this.gl.blendFunc(this.blendFuncSrc, this.blendFuncDst);
        this.gl.blendEquation(this.blendEquation);
      }
      return this;
    }

    setViewPort(width, height, left = 0, top = 0) {
      this.gl.viewport(left, top, width, height);
      return this;
    }

  };

  GLServer.byteLength = byteLength;

  GLServer.TypedArray = Uint32Array;

  GLServer.prototype.Camera = Pointer;

  GLServer.prototype.vShaderSource = 'attribute vec4     a_Vertex; attribute vec4     a_Color; uniform   float    u_PointSize; uniform   mat4     u_Camera; varying   vec4     v_Color; void main() { gl_Position  =  u_Camera * a_Vertex; gl_PointSize =  u_PointSize; v_Color      =  a_Color; }';

  GLServer.prototype.fShaderSource = 'precision highp    float; varying   vec4     v_Color; void main() { gl_FragColor = v_Color; }';

  Object.defineProperties(GLServer.prototype, {
    COLOR_CLEAR_VALUE: {
      get: function() {
        return this.gl.getParameter(this.gl.COLOR_CLEAR_VALUE);
      }
    },
    COLOR_WRITEMASK: {
      get: function() {
        return this.gl.getParameter(this.gl.COLOR_WRITEMASK);
      }
    },
    bindTarget: {
      get: function() {
        return this.keyUint32(OFFSET_BIND_TARGET);
      },
      set: function() {
        return this.setUint32(OFFSET_BIND_TARGET, arguments[0]);
      }
    },
    clearColor: {
      get: function() {
        return this.getUint32(OFFSET_CLEAR_COLOR);
      },
      set: function() {
        return this.setUint32(OFFSET_CLEAR_COLOR, arguments[0]);
      }
    },
    clearMask: {
      get: function() {
        return this.getUint32(OFFSET_CLEAR_MASK);
      },
      set: function() {
        return this.setUint32(OFFSET_CLEAR_MASK, arguments[0]);
      }
    },
    pointSize: {
      get: function() {
        return this.getFloat32(OFFSET_POINT_SIZE);
      },
      set: function() {
        return this.setFloat32(OFFSET_POINT_SIZE, arguments[0]);
      }
    },
    blendEnabled: {
      get: function() {
        return this.keyUint32(OFFSET_BLEND_ENABLED);
      },
      set: function() {
        return this.setUint32(OFFSET_BLEND_ENABLED, arguments[0]);
      }
    },
    blendFuncSrc: {
      get: function() {
        return this.keyUint32(OFFSET_BLEND_FUNC_SRC);
      },
      set: function() {
        return this.setUint32(OFFSET_BLEND_FUNC_SRC, arguments[0]);
      }
    },
    blendFuncDst: {
      get: function() {
        return this.keyUint32(OFFSET_BLEND_FUNC_DST);
      },
      set: function() {
        return this.setUint32(OFFSET_BLEND_FUNC_DST, arguments[0]);
      }
    },
    blendEquation: {
      get: function() {
        return this.keyUint32(OFFSET_BLEND_EQUATION);
      },
      set: function() {
        return this.setUint32(OFFSET_BLEND_EQUATION, arguments[0]);
      }
    },
    depthEnabled: {
      get: function() {
        return this.keyUint32(OFFSET_DEPTH_ENABLED);
      },
      set: function() {
        return this.setUint32(OFFSET_DEPTH_ENABLED, arguments[0]);
      }
    },
    depthFunc: {
      get: function() {
        return this.keyUint32(OFFSET_DEPTH_FUNCTION);
      },
      set: function() {
        return this.setUint32(OFFSET_DEPTH_FUNCTION, arguments[0]);
      }
    },
    depthMask: {
      get: function() {
        return this.keyUint32(OFFSET_DEPTH_MASK);
      },
      set: function() {
        return this.setUint32(OFFSET_DEPTH_MASK, arguments[0]);
      }
    },
    clearDepth: {
      get: function() {
        return this.getFloat32(OFFSET_CLEAR_DEPTH);
      },
      set: function() {
        return this.setFloat32(OFFSET_CLEAR_DEPTH, arguments[0]);
      }
    },
    cullEnabled: {
      get: function() {
        return this.keyUint32(OFFSET_CULL_ENABLED);
      },
      set: function() {
        return this.setUint32(OFFSET_CULL_ENABLED, arguments[0]);
      }
    },
    cullFace: {
      get: function() {
        return this.keyUint32(OFFSET_CULL_FACE);
      },
      set: function() {
        return this.setUint32(OFFSET_CULL_FACE, arguments[0]);
      }
    },
    frontFace: {
      get: function() {
        return this.keyUint32(OFFSET_FRONT_FACE);
      },
      set: function() {
        return this.setUint32(OFFSET_FRONT_FACE, arguments[0]);
      }
    }
  });

  return GLServer;

}).call(this);
