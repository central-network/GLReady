var GL_VARIABLE_LENGTH, LENGTH_CLEAR_COLOR, LENGTH_SHADER_SOURCE, OFFSET_ATTACHED_STAT, OFFSET_BIND_TARGET, OFFSET_BLEND_ENABLED, OFFSET_BLEND_EQUATION, OFFSET_BLEND_FUNC_DST, OFFSET_BLEND_FUNC_SRC, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_COMPILED_STAT, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ENABLED, OFFSET_DEPTH_FUNCTION, OFFSET_DEPTH_MASK, OFFSET_FRAME, OFFSET_FRONT_FACE, OFFSET_POINT_SIZE, OFFSET_PROGRAM_ACTIVE, OFFSET_PROGRAM_INUSE, OFFSET_PROGRAM_LINKED, OFFSET_RENDERING, OFFSET_SHADER_ACTIVE, OFFSET_SHADER_GLTYPE, OFFSET_SHADER_SOURCE, OFFSET_SOURCE_LENGTH, OFFSET_UPLOADED_STAT;

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

OFFSET_SHADER_ACTIVE = 4 * 3;

OFFSET_SHADER_GLTYPE = 4 * 4;

OFFSET_UPLOADED_STAT = 4 * 5;

OFFSET_COMPILED_STAT = 4 * 6;

OFFSET_ATTACHED_STAT = 4 * 7;

OFFSET_SOURCE_LENGTH = 4 * 8;

OFFSET_SHADER_SOURCE = 4 * 9;

LENGTH_SHADER_SOURCE = 1e5 - OFFSET_SHADER_SOURCE;

OFFSET_PROGRAM_INUSE = 4 * 0;

OFFSET_PROGRAM_LINKED = 4 * 1;

OFFSET_PROGRAM_ACTIVE = 4 * 2;

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

export var GLProgram = (function() {
  class GLProgram extends Pointer {
    link() {
      if (this.isLinked) {
        return this;
      }
      this.gl.linkProgram(this.glProgram);
      this.isLinked = 1;
      return this;
    }

    use() {
      if (this.isInUse) {
        return this;
      }
      this.gl.useProgram(this.glProgram);
      this.isInUse = 1;
      return this;
    }

  };

  GLProgram.byteLength = 48;

  Object.defineProperties(GLProgram.prototype, {
    gl: {
      get: function() {
        return this.parent.gl;
      }
    },
    glProgram: {
      configurable: true,
      get: function() {
        return Object.defineProperty(this, "glProgram", {
          value: this.gl.createProgram()
        }).glProgram;
      }
    },
    shaders: {
      get: function() {
        return this.children.filter(function(v) {
          return v instanceof GLShader;
        });
      }
    },
    vertexShader: {
      get: function() {
        return this.shaders.find(function(s) {
          return s.isVertex && s.isActive;
        });
      },
      set: function(s) {
        var has, j, len, ref, shader;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
          shader = ref[j];
          if (!(s - shader)) {
            if (has = true) {
              break;
            }
          }
        }
        if (!has) {
          this.add(s);
        }
        return s.isActive = true;
      }
    },
    fragmentShader: {
      get: function() {
        return this.shaders.find(function(s) {
          return s.isFragment && s.isActive;
        });
      },
      set: function(s) {
        var has, j, len, ref, shader;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
          shader = ref[j];
          if (!(s - shader)) {
            if (has = true) {
              break;
            }
          }
        }
        if (!has) {
          this.add(s);
        }
        return s.isActive = true;
      }
    },
    isInUse: {
      get: function() {
        return this.getUint32(OFFSET_PROGRAM_INUSE);
      },
      set: function() {
        if (this.setUint32(OFFSET_PROGRAM_INUSE, arguments[0])) {
          return this.use();
        }
      }
    },
    isLinked: {
      get: function() {
        return this.getUint32(OFFSET_PROGRAM_LINKED);
      },
      set: function() {
        if (this.setUint32(OFFSET_PROGRAM_LINKED, arguments[0])) {
          return this.link();
        }
      }
    },
    isActive: {
      get: function() {
        return this.getUint32(OFFSET_PROGRAM_ACTIVE);
      },
      set: function() {
        if (this.setUint32(OFFSET_PROGRAM_ACTIVE, arguments[0])) {
          return this.link().use();
        }
      }
    }
  });

  return GLProgram;

}).call(this);

export var GLBuffer = class GLBuffer extends Pointer {};

GL_VARIABLE_LENGTH = {
  vec2: 2,
  vec3: 3,
  vec4: 4,
  mat2: 4,
  mat3: 9,
  mat4: 16,
  float: 1,
  int: 1
};

export var GLShader = (function() {
  class GLShader extends Pointer {
    parseAttributes(source = this.source) {
      var GL_FLOAT, _attributes, j, len, p, ref;
      GL_FLOAT = WebGL2RenderingContext.FLOAT;
      _attributes = {
        keys: [],
        types: [],
        lengths: [],
        length: 0,
        byteLengths: [],
        byteLength: 0,
        pointers: [],
        locations: [],
        offsets: []
      };
      _attributes.locate = function() {};
      _attributes.bind = function() {};
      source.split(/\attribute/g).slice(1).map((l) => {
        var key, location, offset, type;
        [type, key] = l.split(/\;/g).at(0).split(/\s+/g).slice(1);
        (length = GL_VARIABLE_LENGTH[type]);
        (location = _attributes.locations.length);
        (offset = _attributes.byteLength);
        _attributes.types.push(type);
        _attributes.keys.push(key);
        _attributes.lengths.push(length);
        _attributes.locations.push(location);
        _attributes.byteLengths.push(length * 4);
        _attributes.offsets.push(offset);
        _attributes.pointers.push([location, length, GL_FLOAT, false, -1, offset]);
        _attributes.length += length;
        return _attributes.byteLength += length * 4;
      });
      ref = _attributes.pointers;
      for (j = 0, len = ref.length; j < len; j++) {
        p = ref[j];
        p[4] = _attributes.byteLength;
      }
      _attributes.locate = function() {
        var i, k, len1, location, ref1, results;
        ref1 = _attributes.locations;
        results = [];
        for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
          location = ref1[i];
          results.push(this.gl.bindAttribLocation(this.glProgram, location, _attributes.keys[i]));
        }
        return results;
      };
      _attributes.bind = function() {
        var k, len1, location, normalized, offset, ref1, results, stride, type;
        ref1 = _attributes.pointers;
        results = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          [location, length, type, normalized, stride, offset] = ref1[k];
          this.gl.vertexAttribPointer(location, length, type, normalized, stride, offset);
          results.push(this.gl.enableVertexAttribArray(location));
        }
        return results;
      };
      return _attributes;
    }

    upload() {
      if (this.isUploaded) {
        return this;
      }
      this.gl.shaderSource(this.glShader, this.source);
      this.isUploaded = 1;
      return this;
    }

    compile() {
      if (this.isCompiled) {
        return this;
      }
      this.gl.compileShader(this.glShader);
      this.isCompiled = 1;
      return this;
    }

    attach() {
      if (this.isAttached) {
        return this;
      }
      this.gl.attachShader(this.glProgram, this.glShader);
      this.isAttached = 1;
      return this;
    }

  };

  GLShader.byteLength = 1e5;

  GLShader.prototype.encoder = new TextEncoder;

  GLShader.prototype.decoder = new TextDecoder;

  GLShader.prototype.VERTEX_SHADER = WebGL2RenderingContext.VERTEX_SHADER;

  GLShader.prototype.FRAGMENT_SHADER = WebGL2RenderingContext.FRAGMENT_SHADER;

  Object.defineProperties(GLShader.prototype, {
    gl: {
      get: function() {
        return this.parent.gl;
      }
    },
    glProgram: {
      get: function() {
        return this.parent.glProgram;
      }
    },
    glBuffer: {
      configurable: true,
      get: function() {
        return Object.defineProperty(this, "glBuffer", {
          value: this.gl.createBuffer()
        }).glBuffer;
      }
    },
    glShader: {
      configurable: true,
      get: function() {
        return Object.defineProperty(this, "glShader", {
          value: this.gl.createShader(this.shaderType)
        }).glShader;
      }
    },
    isVertex: {
      get: function() {
        return /gl_Pos/.test(this.source) && this.VERTEX_SHADER || false;
      }
    },
    isFragment: {
      get: function() {
        return /gl_Fra/.test(this.source) && this.FRAGMENT_SHADER || false;
      }
    },
    source: {
      get: function() {
        if (!(length = this.charLength)) {
          return "";
        }
        return this.decoder.decode(this.subUint8(OFFSET_SHADER_SOURCE, this.charLength).slice(0));
      },
      set: function(source) {
        var tarray;
        if (!(source instanceof Uint8Array)) {
          source = this.encoder.encode(arguments[0]);
        }
        tarray = this.subUint8(OFFSET_SHADER_SOURCE, LENGTH_SHADER_SOURCE);
        tarray.fill(0);
        tarray.set(source);
        this.charLength = source.byteLength;
        return this.shaderType = this.isVertex || this.isFragment;
      }
    },
    charLength: {
      get: function() {
        return this.getUint32(OFFSET_SOURCE_LENGTH);
      },
      set: function() {
        return this.setUint32(OFFSET_SOURCE_LENGTH, arguments[0]);
      }
    },
    isUploaded: {
      get: function() {
        return this.getUint32(OFFSET_UPLOADED_STAT);
      },
      set: function() {
        if (this.setUint32(OFFSET_UPLOADED_STAT, arguments[0])) {
          return this.upload();
        }
      }
    },
    isCompiled: {
      get: function() {
        return this.getUint32(OFFSET_COMPILED_STAT);
      },
      set: function() {
        if (this.setUint32(OFFSET_COMPILED_STAT, arguments[0])) {
          return this.compile();
        }
      }
    },
    isAttached: {
      get: function() {
        return this.getUint32(OFFSET_ATTACHED_STAT);
      },
      set: function() {
        if (this.setUint32(OFFSET_ATTACHED_STAT, arguments[0])) {
          return this.attach();
        }
      }
    },
    shaderType: {
      get: function() {
        return keyOf(this.getUint32(OFFSET_SHADER_GLTYPE));
      },
      set: function() {
        return this.setUint32(OFFSET_SHADER_GLTYPE, arguments[0]);
      }
    },
    isActive: {
      get: function() {
        return this.getUint32(OFFSET_SHADER_ACTIVE);
      },
      set: function() {
        if (this.setUint32(OFFSET_SHADER_ACTIVE, arguments[0])) {
          return this.upload().compile().attach();
        }
      }
    }
  });

  return GLShader;

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

    nextTick(pnow) {
      this.ticks++;
      this.gl.clear(this.clearMask);
      return this.gl.drawArrays(this.gl.POINTS, 0, 3);
    }

    prepareCanvas() {
      this.updateCull();
      this.updateDepth();
      this.updateBlend();
      return this.clear();
    }

    downloadParameter(parameter) {
      return this.gl.getParameter(parameter);
    }

    clear([r, g, b, a] = this.clearColor.toRGBA(this)) {
      this.gl.clearColor(r, g, b, a);
      this.gl.clear(this.clearMask);
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

  GLServer.prototype.ticks = 0;

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
    canvas: {
      get: function() {
        return this.gl.canvas;
      },
      set: function() {
        return Object.defineProperty(this, "gl", {
          value: arguments[0].getContext("webgl2")
        }).prepareCanvas();
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
