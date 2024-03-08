var LENGTH_CLEAR_COLOR, LENGTH_SHADER_SOURCE, OFFSET_ATTACHED_STAT, OFFSET_BIND_TARGET, OFFSET_BLEND_ENABLED, OFFSET_BLEND_EQUATION, OFFSET_BLEND_FUNC_DST, OFFSET_BLEND_FUNC_SRC, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_COMPILED_STAT, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ENABLED, OFFSET_DEPTH_FUNCTION, OFFSET_DEPTH_MASK, OFFSET_FRAME, OFFSET_FRONT_FACE, OFFSET_POINT_SIZE, OFFSET_PROGRAM_ACTIVE, OFFSET_PROGRAM_INUSE, OFFSET_PROGRAM_LINKED, OFFSET_RENDERING, OFFSET_SHADER_ACTIVE, OFFSET_SHADER_GLTYPE, OFFSET_SHADER_SOURCE, OFFSET_SOURCE_LENGTH, OFFSET_UPLOADED_STAT;

import Matrix4 from "./Matrix4.js";

import {
  LE,
  DATAVIEW,
  OFFSET_OBJECT_0,
  OFFSET_OBJECT_1,
  OFFSET_OBJECT_2,
  OFFSET_OBJECT_3,
  OFFSET_OBJECT_4,
  OFFSET_OBJECT_5,
  OFFSET_OBJECT_6,
  ObjectPointer
} from "./Pointer.js";

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

export var GLPointer = (function() {
  class GLPointer extends Pointer {
    oncontextrestored() {
      return this;
    }

  };

  Object.defineProperties(GLPointer.prototype, {
    gl: {
      get: function() {
        var gl, ref;
        if (!(gl = this.getHeader(OFFSET_OBJECT_6, true))) {
          gl = (ref = this.parent) != null ? ref.gl : void 0;
        }
        return gl;
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_6, arguments[0], true);
      }
    }
  });

  return GLPointer;

}).call(this);

export var GLVariable = (function() {
  var ATTRIBUTE, FLOAT, UNIFORM, float, mat4, vec3, vec4;

  class GLVariable extends GLPointer {};

  GLVariable.byteLength = 24;

  GLVariable.TypedArray = Uint8Array;

  GLVariable.prototype.ATTRIBUTE = new (ATTRIBUTE = class ATTRIBUTE extends Number {})(1);

  GLVariable.prototype.UNIFORM = new (UNIFORM = class UNIFORM extends Number {})(2);

  GLVariable.prototype.FLOAT = new (FLOAT = class FLOAT extends Number {})(5126);

  Object.defineProperties(GLVariable, {
    valueType: {
      value: GLVariable.prototype.FLOAT
    },
    vec3: {
      value: vec3 = (function() {
        class vec3 extends GLVariable {};

        vec3.itemLength = 3;

        return vec3;

      }).call(this)
    },
    vec4: {
      value: vec4 = (function() {
        class vec4 extends GLVariable {};

        vec4.itemLength = 4;

        return vec4;

      }).call(this)
    },
    mat4: {
      value: mat4 = (function() {
        class mat4 extends GLVariable {};

        mat4.itemLength = 16;

        return mat4;

      }).call(this)
    },
    float: {
      value: float = (function() {
        class float extends GLVariable {};

        float.itemLength = 1;

        return float;

      }).call(this)
    }
  });

  Object.defineProperties(GLVariable.prototype, {
    name: {
      get: function() {
        var code, j, key, len, ref;
        key = "";
        ref = this.array.slice(0, this.nameLength);
        for (j = 0, len = ref.length; j < len; j++) {
          code = ref[j];
          key += String.fromCharCode(code);
        }
        return key;
      },
      set: function() {
        var char, i, j, len, ref, results;
        this.fill(0, this.nameLength = arguments[0].length);
        ref = arguments[0];
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          char = ref[i];
          results.push(this.setUint8(i, char.charCodeAt(0)));
        }
        return results;
      }
    },
    type: {
      get: function() {
        if (!(this.location instanceof Number)) {
          return this.ATTRIBUTE;
        }
        return this.UNIFORM;
      }
    },
    shader: {
      get: function() {
        return this.parent;
      }
    },
    nameLength: {
      get: function() {
        return this.getHeader(OFFSET_OBJECT_0);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_0, arguments[0]);
      }
    },
    location: {
      get: function() {
        return this.getHeader(OFFSET_OBJECT_1, true);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_1, arguments[0], true);
      }
    },
    itemLength: {
      get: function() {
        return this.getHeader(OFFSET_OBJECT_2);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_2, arguments[0]);
      }
    },
    valueType: {
      get: function() {
        return this.keyHeader(OFFSET_OBJECT_3);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_3, arguments[0]);
      }
    },
    normalize: {
      get: function() {
        return this.getHeader(OFFSET_OBJECT_4);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_4, arguments[0]);
      }
    },
    stride: {
      get: function() {
        return this.getHeader(OFFSET_OBJECT_5);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_5, arguments[0]);
      }
    },
    offset: {
      get: function() {
        return this.getHeader(OFFSET_OBJECT_6);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_6, arguments[0]);
      }
    }
  });

  return GLVariable;

}).call(this);

export var GLPositions = (function() {
  class GLPositions extends GLPointer {};

  GLPositions.TypedArray = Float32Array;

  Object.defineProperties(GLPositions, {
    for: {
      value: function(count) {
        return new this(this.malloc(byteLength = count * 3 * 4));
      }
    },
    TRIANGLES: {
      value: WebGL2RenderingContext.TRIANGLES
    },
    TRIANGLE_FAN: {
      value: WebGL2RenderingContext.TRIANGLE_FAN
    },
    TRIANGLE_STRIP: {
      value: WebGL2RenderingContext.TRIANGLE_STRIP
    },
    LINE: {
      value: WebGL2RenderingContext.LINE
    },
    LINE_LOOP: {
      value: WebGL2RenderingContext.LINE_LOOP
    },
    LINE_STRIP: {
      value: WebGL2RenderingContext.LINE_STRIP
    },
    POINTS: {
      value: WebGL2RenderingContext.POINTS
    }
  });

  Object.defineProperties(GLPositions.prototype, {
    drawMode: {
      get: function() {
        return this.keyHeader(OFFSET_OBJECT_0);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_0, arguments[0]);
      }
    }
  });

  return GLPositions;

}).call(this);

export var GLProgram = (function() {
  class GLProgram extends GLPointer {
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

    create() {
      var j, len, ref, shader;
      this.glProgram = this.gl.createProgram();
      ref = this.shaders;
      for (j = 0, len = ref.length; j < len; j++) {
        shader = ref[j];
        shader.create();
      }
      this.link().use().isActive = 1;
      return this;
    }

    draw(ptr) {
      this.add(ptr);
      return console.log(ptr);
    }

  };

  GLProgram.byteLength = 48;

  Object.defineProperties(GLProgram.prototype, {
    glProgram: {
      set: function() {
        return this.setHeader(OFFSET_OBJECT_0, arguments[0], true);
      },
      get: function() {
        var p;
        if (p = this.getHeader(OFFSET_OBJECT_0, true)) {
          return p;
        }
        return this.glProgram = this.gl.createProgram();
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
        if (this.isActive) {
          return s.isActive = true;
        }
      }
    },
    fragmentShader: {
      get: function() {
        return this.shaders.find(function(s) {
          return !s.isVertex && s.isActive;
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
        if (this.isActive) {
          return s.isActive = true;
        }
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
        return this.setUint32(OFFSET_PROGRAM_ACTIVE, arguments[0]);
      }
    },
    activate: {
      get: function() {
        return this.create().parent.create();
      }
    },
    variables: {
      get: function() {
        return this.shaders.map(GLShader.parse).flat();
      }
    }
  });

  return GLProgram;

}).call(this);

export var GLBuffer = class GLBuffer extends GLPointer {};

export var GLShader = (function() {
  class GLShader extends GLPointer {
    create() {
      this.upload().compile().attach().isActive = 1;
      return this;
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
      if (!this.glProgram) {
        return;
      }
      if (this.isAttached) {
        return this;
      }
      this.gl.attachShader(this.glProgram, this.glShader);
      this.isAttached = 1;
      return this;
    }

    static parse() {
      var gl, glProgram, j, key, keys, len, offset, shader, source;
      [shader] = arguments;
      [keys, offset] = [[], 0];
      ({source, gl, glProgram} = shader);
      source.split(/attribute/g).slice(1).map((line) => {
        var key, kind, name, type;
        [kind, type, name] = line.split(/\;/g)[0].split(/\s+/g);
        keys.push(key = new GLVariable[type]);
        key.name = name;
        key.location = gl.getAttribLocation(glProgram, name);
        key.itemLength = key.constructor.itemLength;
        key.valueType = key.FLOAT;
        key.normalize = false;
        key.offset = offset;
        key.parent = shader;
        return offset += key.itemLength * 4;
      });
      for (j = 0, len = keys.length; j < len; j++) {
        key = keys[j];
        key.stride = offset;
      }
      source.split(/uniform/g).slice(1).map((line) => {
        var kind, name, type;
        [kind, type, name] = line.split(/\;/g)[0].split(/\s+/g);
        keys.push(key = new GLVariable[type]);
        key.name = name;
        key.location = gl.getUniformLocation(glProgram, name);
        key.itemLength = key.constructor.itemLength;
        key.valueType = key.constructor.valueType;
        return key.parent = shader;
      });
      return keys;
    }

  };

  GLShader.byteLength = 1e5;

  Object.defineProperties(GLShader, {
    VERTEX_SHADER: {
      value: WebGL2RenderingContext.VERTEX_SHADER
    },
    FRAGMENT_SHADER: {
      value: WebGL2RenderingContext.FRAGMENT_SHADER
    },
    TextEncoder: {
      value: new TextEncoder
    },
    TextDecoder: {
      value: new TextDecoder
    }
  });

  Object.defineProperties(GLShader.prototype, {
    glProgram: {
      get: function() {
        return this.parent.glProgram;
      }
    },
    glShader: {
      set: function() {
        return this.setHeader(OFFSET_OBJECT_0, arguments[0], true);
      },
      get: function() {
        var p;
        if (p = this.getHeader(OFFSET_OBJECT_0, true)) {
          return p;
        }
        return this.glShader = this.gl.createShader(this.shaderType);
      }
    },
    isVertex: {
      get: function() {
        return /gl_Pos/.test(this.source);
      }
    },
    source: {
      get: function() {
        if (!(length = this.charLength)) {
          return "";
        }
        return GLShader.TextDecoder.decode(this.subUint8(OFFSET_SHADER_SOURCE, this.charLength).slice(0));
      },
      set: function(source) {
        var tarray;
        if (!(source instanceof Uint8Array)) {
          source = GLShader.TextEncoder.encode(arguments[0]);
        }
        tarray = this.subUint8(OFFSET_SHADER_SOURCE, LENGTH_SHADER_SOURCE);
        tarray.fill(0);
        tarray.set(source);
        this.charLength = source.byteLength;
        return this.shaderType = (function() {
          switch (this.isVertex) {
            case true:
              return GLShader.VERTEX_SHADER;
            case false:
              return GLShader.FRAGMENT_SHADER;
          }
        }).call(this);
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
        return this.setUint32(OFFSET_SHADER_ACTIVE, arguments[0]);
      }
    },
    variables: {
      get: function() {
        return GLShader.parse(this);
      }
    }
  });

  return GLShader;

}).call(this);

export var GLServer = (function() {
  class GLServer extends GLPointer {
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

    nextTick() {
      if (this.isRendering) {
        this.ticks++;
        this.gl.clear(this.clearMask);
        return this.gl.drawArrays(this.gl.POINTS, 0, 3);
      }
    }

    create() {
      this.updateCull();
      this.updateDepth();
      this.updateBlend();
      this.clear();
      this.isRendering = 1;
      return this;
    }

    fetch(GL_PARAMETER) {
      return this.gl.getParameter(parameter);
    }

    clear() {
      var a, b, g, r;
      [r, g, b, a] = this.clearColor.toRGBA(this);
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
      if (this.gl) {
        return this.gl.viewport(left, top, width, height);
      }
    }

  };

  GLServer.byteLength = 4 * 30;

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
        return this.gl = arguments[0].getContext("webgl2");
      }
    },
    isRendering: {
      get: function() {
        return this.getHeader(OFFSET_OBJECT_0);
      },
      set: function() {
        return this.setHeader(OFFSET_OBJECT_0, arguments[0]);
      }
    },
    programs: {
      get: function() {
        return this.children.filter(function(o) {
          return o instanceof GLProgram;
        });
      }
    },
    shaders: {
      get: function() {
        return this.programs.filter(function(o) {
          return o instanceof GLShader;
        });
      }
    },
    variables: {
      get: function() {
        return this.shaders.filter(function(o) {
          return o instanceof GLVariable;
        });
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
        return this.getColor4(OFFSET_CLEAR_COLOR);
      },
      set: function() {
        return this.setColor4(OFFSET_CLEAR_COLOR, arguments[0]);
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
