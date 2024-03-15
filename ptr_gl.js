var DEPTH_N_COLOR_BIT, KEYEXTEND_CLEARMASK, KEYEXTEND_OBJECT3D, OFFSET_ASPECT_RATIO, OFFSET_ATTACH_STATUS, OFFSET_ATTRIB_LENGTH, OFFSET_ATTRIB_STRIDE, OFFSET_ATTR_OFFSET, OFFSET_ATTR_STRIDE, OFFSET_BINDING_STATUS, OFFSET_BINDING_TARGET, OFFSET_BIND_TARGET, OFFSET_BLEND_ACTIVE, OFFSET_BLEND_EQUATE, OFFSET_BLEND_FUNC, OFFSET_BLEND_INARG, OFFSET_BLEND_OUTARG, OFFSET_BUFFER_OFFSET, OFFSET_BUF_BYTELENGTH, OFFSET_BUF_DRAWOFFSET, OFFSET_BUF_MODEOFFSET, OFFSET_CHAR_LENGTH, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ACTIVE, OFFSET_DEPTH_FUNC, OFFSET_DEPTH_TEST, OFFSET_DRAGGING, OFFSET_DRAW_ACTIVE, OFFSET_DX, OFFSET_DY, OFFSET_FRONTFACE, OFFSET_HEIGHT, OFFSET_INUSE_STATUS, OFFSET_ISNORMALIZE, OFFSET_IS_ATTACHED, OFFSET_IS_COMPILED, OFFSET_IS_UPLOADED, OFFSET_JUMPING, OFFSET_KEY_ALT, OFFSET_KEY_CTRL, OFFSET_KEY_LOCATED, OFFSET_KEY_META, OFFSET_KEY_SHIFT, OFFSET_LEFT, OFFSET_LINKED_STATUS, OFFSET_LOCATION_AT, OFFSET_LOOKING, OFFSET_MODE_ATTR_COUNT, OFFSET_MODE_ATTR_START, OFFSET_MODE_BYTELENGTH, OFFSET_MODE_BYTE_ALLOC, OFFSET_MODE_COMPONENTS, OFFSET_MODE_DRAWLENGTH, OFFSET_MODE_DRAWOFFSET, OFFSET_MODE_DST_OFFSET, OFFSET_MODE_FIRSTINDEX, OFFSET_MODE_TYPEGLCODE, OFFSET_MOVE_BACK, OFFSET_MOVE_DOWN, OFFSET_MOVE_FWD, OFFSET_MOVE_LEFT, OFFSET_MOVE_RIGHT, OFFSET_MOVE_UP, OFFSET_NAME_LENGTH, OFFSET_NAME_TARRAY, OFFSET_NCOMPONENTS, OFFSET_O3_COLOR_4D, OFFSET_O3_COPYLENGTH, OFFSET_O3_COPY_BEGIN, OFFSET_O3_DRAWTYP2, OFFSET_O3_DRAWTYPE, OFFSET_O3_POSITION, OFFSET_O3_ROTATION, OFFSET_O3_SCALE_3D, OFFSET_PIXEL_RATIO, OFFSET_PTR_BUTTON, OFFSET_PTR_CLICK, OFFSET_PTR_DCLICK, OFFSET_ROTATING, OFFSET_RX, OFFSET_RY, OFFSET_SHADER_TYPE, OFFSET_SHIFT_RATIO, OFFSET_SOURCE_TEXT, OFFSET_SX, OFFSET_SY, OFFSET_SZ, OFFSET_TIME, OFFSET_TOP, OFFSET_TYPE_GLCODE, OFFSET_UX_ENABLED, OFFSET_VX, OFFSET_VY, OFFSET_VZ, OFFSET_WALKING, OFFSET_WIDTH, OFFSET_X, OFFSET_Y, OFFSET_ZOOMING, POINTS;

import Pointer from "./ptr.js";

import {
  Vertex,
  Angle3,
  Scale3,
  Color4,
  OffsetPointer
} from "./ptr.js";

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

KEYEXTEND_CLEARMASK = {
  [16640]: new (DEPTH_N_COLOR_BIT = class DEPTH_N_COLOR_BIT extends Number {})(16640)
};

export var GL = (function() {
  class GL extends Pointer {
    draw() {
      var a, arr, j, len1, ref, size;
      arr = Float32Array.of(...arguments[0]);
      size = arr.length * arr.BYTES_PER_ELEMENT;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, size, this.gl.STATIC_DRAW);
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, arr);
      ref = this.programAttribs;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        a = ref[j];
        a.enable();
      }
      this.gl.drawArrays(this.gl.POINTS, 0, 3);
      this.gl.drawArrays(this.gl.LINES, 0, 3);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
      return arr;
    }

    redraw(ptr) {
      var a, j, len1, ref;
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, ptr.array);
      ref = this.programAttribs;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        a = ref[j];
        a.enable();
      }
      this.gl.drawArrays(this.gl.POINTS, 0, 3);
      this.gl.drawArrays(this.gl.LINES, 0, 3);
      return this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    drawww(o3) {
      var buffer;
      buffer = this.allBuffers.at(0);
      console.warn(buffer);
      console.warn(o3);
      return console.warn(buffer.alloc(o3));
    }

    load() {
      var context, height, left, ratioAspect, ratioPixel, top, width;
      ({width, height, left, top} = arguments[0].getBoundingClientRect());
      [ratioAspect, ratioPixel] = [width / height, self.devicePixelRatio || 1];
      this.setTop(top);
      this.setHeight(height);
      this.setWidth(width);
      this.setLeft(left);
      this.setAspectRatio(ratioAspect);
      this.setPixelRatio(ratioPixel);
      arguments[0].width = ratioPixel * width;
      arguments[0].height = ratioPixel * height;
      context = arguments[0].getContext("webgl2");
      context.viewport(left, top, width, height);
      return context;
    }

    getGLBuffer() {
      return this.getAllBuffers().at(0).getGLBuffer();
    }

    getGLError() {
      return this.getLinkedNode().getError();
    }

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
      this.setLinkedNode(this.load(arguments[0]));
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
      return this.keyUint16(OFFSET_CLEAR_MASK, KEYEXTEND_CLEARMASK);
    }

    getClearMask() {
      return this.getUint16(OFFSET_CLEAR_MASK);
    }

    setClearMask() {
      this.setUint16(OFFSET_CLEAR_MASK, arguments[0]);
      return this;
    }

    
    //TODO new pointer
    rgbClearColor() {
      return this.rgbColor4(OFFSET_CLEAR_COLOR);
    }

    getClearColor() {
      return this.getColour4(OFFSET_CLEAR_COLOR);
    }

    setClearColor() {
      this.setColour4(OFFSET_CLEAR_COLOR, arguments[0]);
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
    glError: {
      get: GL.prototype.getGLError
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
    glBuffer: {
      get: GL.prototype.getGLBuffer
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
      var attr, j, len1, ref;
      if (this.getLinkedStatus()) {
        return this;
      }
      this.getParentPtrO().linkProgram(this.getGLProgram());
      if (!this.setLinkedStatus(this.getGLLinkStatus(this.getGLValidate()))) {
        return this;
      }
      ref = this.getAttributes();
      for (j = 0, len1 = ref.length; j < len1; j++) {
        attr = ref[j];
        attr.getGLLocation();
        attr.bindFunctions();
      }
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
          fShader = Shader.fromSource(arguments[0]);
        }
      }
      if (fShader instanceof Shader) {
        this.add(fShader);
        fShader.load();
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
      var byteLength, byteSource, charLength, j, key, len1, parsedKeys, ptr, shaderType, textSource;
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
      for (j = 0, len1 = parsedKeys.length; j < len1; j++) {
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
      var j, key, len1, ref;
      if (!this.isVertexShader()) {
        return this;
      }
      this.getAllVariables().forEach(Pointer.removePointer);
      ref = Shader.parse(this.getSourceText());
      for (j = 0, len1 = ref.length; j < len1; j++) {
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
    },
    sumComponents: {
      get: function() {
        return this.attributes.sumAttrib("components");
      }
    },
    stride: {
      get: function() {
        return this.attributes[0].stride;
      }
    }
  });

  return Shader;

}).call(this);

OFFSET_TYPE_GLCODE = 4 * 2;

OFFSET_NCOMPONENTS = 4 * 2 + 2;

OFFSET_KEY_LOCATED = 4 * 2 + 3;

OFFSET_NAME_LENGTH = 4 * 3 + 2;

OFFSET_NAME_TARRAY = 4 * 4;

export var ShaderKey = (function() {
  class ShaderKey extends Pointer {
    enable() {
      return this.getLinkedNode()();
    }

    getGL() {
      return this.getShader().getGL();
    }

    getShader() {
      return this.getParentPtrP();
    }

    getGLShader() {
      return this.getShader().getGLShader();
    }

    getGLProgram() {
      return this.getShader().getGLProgram();
    }

    getProgram() {
      return this.getShader().getProgram();
    }

    getNameString() {
      return this.getString(OFFSET_NAME_TARRAY, OFFSET_NAME_LENGTH);
    }

    keyTypeGLCode() {
      return this.keyUint16(OFFSET_TYPE_GLCODE);
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

    getTypeGLCode() {
      return this.getUint16(OFFSET_TYPE_GLCODE);
    }

    setTypeGLCode() {
      return this.setUint16(OFFSET_TYPE_GLCODE, arguments[0]);
    }

    getComponents() {
      return this.getUint8(OFFSET_NCOMPONENTS);
    }

    setComponents() {
      return this.setUint8(OFFSET_NCOMPONENTS, arguments[0]);
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
  components: {
    get: ShaderKey.prototype.getComponents,
    set: ShaderKey.prototype.setComponents
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
      var j, key, keys, len1, offset, source;
      [source] = arguments;
      [keys, offset] = [[], 0];
      source.split(/attribute/g).slice(1).map((line) => {
        var key, name, type;
        [, type, name] = line.split(/\;/g)[0].split(/\s+/g);
        keys.push(key = new Attribute[type]);
        key.setNameString(name);
        key.setComponents(key.constructor.components);
        key.setTypeGLCode(WebGL2RenderingContext.FLOAT);
        key.setNormalize(false);
        key.setOffset(offset);
        return offset += key.getComponents() * 4;
      });
      for (j = 0, len1 = keys.length; j < len1; j++) {
        key = keys[j];
        key.setStride(offset);
      }
      return keys;
    }

    getGLLocation() {
      var l;
      l = this.getGL().getAttribLocation(this.getGLProgram(), this.getNameString());
      this.setKeyLocated(1);
      this.setLocation(l);
      return l;
    }

    getLocation() {
      if (!this.getKeyLocated()) {
        this.getGLLocation();
      }
      return this.getUint8(OFFSET_LOCATION_AT);
    }

    bindFunctions() {
      var argv, at, attr, enable, gl, name, pointer, ref;
      (argv = (ref = arguments[0]) != null ? ref : this);
      if (!this.getKeyLocated()) {
        return argv;
      }
      [gl, at] = [this.getGL(), this.getLocation()];
      [attr, name] = [this, this.name];
      if (this.getLinkedNode()) {
        this.delLinkedNode();
        console.error("caller deleted from attribute key", this);
      }
      enable = gl.enableVertexAttribArray.bind(gl, at);
      pointer = gl.vertexAttribPointer.bind(gl, at, this.getComponents(), this.getTypeGLCode(), this.getNormalize(), this.getStride(), this.getOffset());
      log(`call defined  <-  ${name}`);
      this.setLinkedNode(function() {
        enable();
        pointer();
        log(`attr enabled  <-  ${name}`);
        return null;
      });
      return argv;
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

        vec3.components = 3;

        vec3.protoClass = 0;

        vec3.registerClass();

        return vec3;

      }).call(this)
    },
    vec4: {
      value: vec4 = (function() {
        class vec4 extends Attribute {};

        vec4.components = 4;

        vec4.protoClass = 0;

        vec4.registerClass();

        return vec4;

      }).call(this)
    },
    mat4: {
      value: mat4 = (function() {
        class mat4 extends Attribute {};

        mat4.components = 16;

        mat4.protoClass = 0;

        mat4.registerClass();

        return mat4;

      }).call(this)
    },
    float: {
      value: float = (function() {
        class float extends Attribute {};

        float.components = 1;

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
        key.setComponents(key.constructor.components);
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
      this.setKeyLocated(1);
      this.setLinkedNode(location);
      return locatio;
    }

  };

  Object.defineProperties(Uniform.registerClass(), {
    vec3: {
      value: vec3 = (function() {
        class vec3 extends Uniform {};

        vec3.components = 3;

        vec3.protoClass = 0;

        vec3.registerClass();

        return vec3;

      }).call(this)
    },
    vec4: {
      value: vec4 = (function() {
        class vec4 extends Uniform {};

        vec4.components = 4;

        vec4.protoClass = 0;

        vec4.registerClass();

        return vec4;

      }).call(this)
    },
    mat4: {
      value: mat4 = (function() {
        class mat4 extends Uniform {};

        mat4.components = 16;

        mat4.protoClass = 0;

        mat4.registerClass();

        return mat4;

      }).call(this)
    },
    float: {
      value: float = (function() {
        class float extends Uniform {};

        float.components = 1;

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

OFFSET_MODE_TYPEGLCODE = 4 * 0;

OFFSET_MODE_DRAWOFFSET = 4 * 1;

OFFSET_MODE_DRAWLENGTH = 4 * 2;

OFFSET_MODE_BYTE_ALLOC = 4 * 3;

OFFSET_MODE_BYTELENGTH = 4 * 4;

OFFSET_MODE_ATTR_START = 4 * 5;

OFFSET_MODE_ATTR_COUNT = 4 * 6;

OFFSET_MODE_DST_OFFSET = 4 * 7;

OFFSET_MODE_COMPONENTS = 4 * 8;

OFFSET_MODE_FIRSTINDEX = 4 * 9;

KEYEXTEND_OBJECT3D = {
  0: new (POINTS = class POINTS extends Number {})(WebGL2RenderingContext.POINTS)
};

export var BufferMode = class BufferMode extends Pointer {};

Object.defineProperties(BufferMode.registerClass(), {
  byteLength: {
    value: 4 * 9
  },
  typedArray: {
    value: Uint32Array
  }
});

Object.defineProperties(BufferMode.prototype, {
  malloc: {
    value: function() {
      var byteLength, components, count, destOffset, length, mallocOffset, object3d, vertices;
      object3d = arguments[0];
      vertices = object3d.getVertexArray();
      components = this.getComponents();
      count = vertices.length / 3;
      length = count * components;
      byteLength = length * vertices.BYTES_PER_ELEMENT;
      mallocOffset = this.addMallocByte(byteLength);
      destOffset = this.getModeOffset() + mallocOffset;
      object3d.setBufferOffset(destOffset);
      object3d.setCopyBegin(destOffset / 4);
      object3d.setCopyLength(length);
      this.addModeLength(length);
      this.addDrawLength(count);
      return this;
    }
  }
});

Object.defineProperties(BufferMode.prototype, {
  getAttrCount: {
    value: function() {
      return this.getUint32(OFFSET_MODE_ATTR_COUNT);
    }
  },
  setAttrCount: {
    value: function() {
      return this.setUint32(OFFSET_MODE_ATTR_COUNT, arguments[0]);
    }
  },
  getAttrStart: {
    value: function() {
      return this.getUint32(OFFSET_MODE_ATTR_START);
    }
  },
  setAttrStart: {
    value: function() {
      return this.setUint32(OFFSET_MODE_ATTR_START, arguments[0]);
    }
  },
  getMallocByte: {
    value: function() {
      return this.getUint32(OFFSET_MODE_BYTE_ALLOC);
    }
  },
  addMallocByte: {
    value: function() {
      return this.addUint32(OFFSET_MODE_BYTE_ALLOC, arguments[0]);
    }
  },
  setMallocByte: {
    value: function() {
      return this.setUint32(OFFSET_MODE_BYTE_ALLOC, arguments[0]);
    }
  },
  keyTypeGLCode: {
    value: function() {
      return this.keyUint16(OFFSET_MODE_TYPEGLCODE, KEYEXTEND_OBJECT3D);
    }
  },
  getTypeGLCode: {
    value: function() {
      return this.getUint16(OFFSET_MODE_TYPEGLCODE);
    }
  },
  setTypeGLCode: {
    value: function() {
      return this.setUint16(OFFSET_MODE_TYPEGLCODE, arguments[0]);
    }
  },
  getModeOffset: {
    value: function() {
      return this.getUint32(OFFSET_MODE_DRAWOFFSET);
    }
  },
  setModeOffset: {
    value: function() {
      return this.setUint32(OFFSET_MODE_DRAWOFFSET, arguments[0]);
    }
  },
  getFirstIndex: {
    value: function() {
      return this.getUint32(OFFSET_MODE_FIRSTINDEX);
    }
  },
  setFirstIndex: {
    value: function() {
      return this.setUint32(OFFSET_MODE_FIRSTINDEX, arguments[0]);
    }
  },
  getModeLength: {
    value: function() {
      return this.getUint32(OFFSET_MODE_BYTELENGTH);
    }
  },
  addModeLength: {
    value: function() {
      return this.addUint32(OFFSET_MODE_BYTELENGTH, arguments[0]);
    }
  },
  setModeLength: {
    value: function() {
      return this.setUint32(OFFSET_MODE_BYTELENGTH, arguments[0]);
    }
  },
  getDrawLength: {
    value: function() {
      return this.getUint32(OFFSET_MODE_DRAWLENGTH);
    }
  },
  addDrawLength: {
    value: function() {
      return this.addUint32(OFFSET_MODE_DRAWLENGTH, arguments[0]);
    }
  },
  setDrawLength: {
    value: function() {
      return this.setUint32(OFFSET_MODE_DRAWLENGTH, arguments[0]);
    }
  },
  getDestOffset: {
    value: function() {
      return this.getUint32(OFFSET_MODE_DST_OFFSET);
    }
  },
  setDestOffset: {
    value: function() {
      return this.setUint32(OFFSET_MODE_DST_OFFSET, arguments[0]);
    }
  },
  getComponents: {
    value: function() {
      return this.getUint8(OFFSET_MODE_COMPONENTS);
    }
  },
  setComponents: {
    value: function() {
      return this.setUint8(OFFSET_MODE_COMPONENTS, arguments[0]);
    }
  }
});

Object.defineProperties(BufferMode.prototype, {
  type: {
    get: BufferMode.prototype.keyTypeGLCode,
    set: BufferMode.prototype.setTypeGLCode
  },
  alloc: {
    get: BufferMode.prototype.getMallocByte,
    set: BufferMode.prototype.setMallocByte
  },
  first: {
    get: BufferMode.prototype.getFirstIndex,
    set: BufferMode.prototype.setFirstIndex
  },
  count: {
    get: BufferMode.prototype.getDrawLength,
    set: BufferMode.prototype.setDrawLength
  },
  offset: {
    get: BufferMode.prototype.getModeOffset,
    set: BufferMode.prototype.setModeOffset
  },
  components: {
    get: BufferMode.prototype.getComponents,
    set: BufferMode.prototype.setComponents
  }
});

OFFSET_BINDING_TARGET = 4 * 0;

OFFSET_BINDING_STATUS = 4 * 0 + 2;

OFFSET_BUF_BYTELENGTH = 4 * 1; // total usabe reserved on gpu

OFFSET_BUF_MODEOFFSET = 4 * 2; // allocated bytes of vertices 

OFFSET_BUF_DRAWOFFSET = 4 * 3; // offset on SharedArrayBuffer

OFFSET_BUFFER_OFFSET = 4 * 12;

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

    //* allocation for mode
    malloc() {
      return this.addModeOffset(arguments[0]);
    }

    //* allocation for object
    alloc() {
      var MODETYPE, attrByteLength, bytesPerAttribute, bytesPerElement, firstAttrIndex, j, len1, mode, modeByteOffset, numComponents, object3d, ref, typeCode, vertexCount;
      object3d = arguments[0];
      typeCode = object3d.getTypeGLCode();
      vertexCount = object3d.getVertexCount();
      numComponents = 7;
      bytesPerElement = 4;
      bytesPerAttribute = numComponents * bytesPerElement;
      attrByteLength = vertexCount * numComponents * bytesPerElement;
      MODETYPE = object3d.type.constructor.name;
      mode = null;
      ref = this.findAllChilds();
      for (j = 0, len1 = ref.length; j < len1; j++) {
        mode = ref[j];
        1;
      }
      if (!mode) {
        
        //? no mode matched need to allocate in buffer
        log(`NO_MODE_MATCHED_FOR_${MODETYPE}_ALLOCATING`);
        modeByteOffset = this.malloc(attrByteLength);
        firstAttrIndex = modeByteOffset / bytesPerAttribute;
        mode = new BufferMode();
        mode.setTypeGLCode(typeCode);
        mode.setComponents(numComponents);
        mode.setModeOffset(modeByteOffset);
        mode.setFirstIndex(firstAttrIndex);
        console.log({
          first: mode.getFirstIndex()
        });
        console.log({
          offset: mode.getModeOffset()
        });
        mode.malloc(object3d);
        console.log({
          first: mode.getFirstIndex()
        });
        console.log({
          offset: mode.getModeOffset() //TODO move to right
        });
      } else {
        2;
      }
      console.warn(mode);
      return mode;
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

    getModeOffset() {
      return this.getUint32(OFFSET_BUF_MODEOFFSET);
    }

    addModeOffset() {
      return this.addUint32(OFFSET_BUF_MODEOFFSET, arguments[0]);
    }

    setModeOffset() {
      return this.setUint32(OFFSET_BUF_MODEOFFSET, arguments[0]);
    }

  };

  Buffer.byteLength = 4 * 256 * 256;

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
  glBindings: {
    get: Buffer.prototype.getGLBindings
  },
  glValidate: {
    get: Buffer.prototype.getGLIsBuffer
  },
  glBuffer: {
    get: Buffer.prototype.getGLBuffer,
    set: Buffer.prototype.setGLBuffer
  },
  type: {
    get: Buffer.prototype.keyBindTarget,
    set: Buffer.prototype.setBindTarget
  },
  status: {
    get: Buffer.prototype.getBindStatus,
    set: Buffer.prototype.setBindStatus
  }
});

OFFSET_O3_DRAWTYPE = 4 * 0;

OFFSET_O3_DRAWTYP2 = 4 * 0 + 2;

OFFSET_O3_COLOR_4D = 4 * 1;

OFFSET_O3_POSITION = 4 * 6;

OFFSET_O3_ROTATION = 4 * 10;

OFFSET_O3_SCALE_3D = 4 * 14;

OFFSET_BUFFER_OFFSET = 4 * 18;

OFFSET_O3_COPY_BEGIN = 4 * 19;

OFFSET_O3_COPYLENGTH = 4 * 20;

OFFSET_ATTRIB_LENGTH = 4 * 21;

OFFSET_ATTRIB_STRIDE = 4 * 21 + 2;

export var Vertices = class Vertices extends Pointer {};

Object.defineProperties(Vertices.registerClass(), {
  typedArray: {
    value: Float32Array
  },
  fromArray: {
    value: function() {
      var len, ptr;
      len = arguments[0].length;
      ptr = this.malloc(len * this.BYTES_PER_ELEMENT);
      ptr.array.set(ptr.setLinkedNode(arguments[0]));
      return ptr;
    }
  }
});

Object.defineProperties(Vertices.prototype, {
  type: {
    get: function() {
      return this.keyStatic(WebGL2RenderingContext.FLOAT);
    }
  }
});

export var Attributes = (function() {
  class Attributes extends Pointer {};

  Attributes.typedArray = Float32Array;

  return Attributes;

}).call(this);

export var Object3 = class Object3 extends Pointer {
  bind() {
    var allocLength, carray, color4, i, j, offset, pointCount, ptr, ptrByteLength, ref, sarray, shader, stride, tarray, vertex;
    shader = arguments[0];
    shader.add(this);
    [vertex, color4] = shader.getAttributes();
    pointCount = this.bufferArray.length / vertex.components;
    allocLength = pointCount * shader.sumComponents;
    ptrByteLength = allocLength * Attributes.BYTES_PER_ELEMENT;
    ptr = Attributes.malloc(ptrByteLength);
    stride = shader.sumComponents;
    tarray = ptr.array;
    offset = -stride;
    sarray = this.bufferArray;
    carray = this.color.array;
    for (i = j = 0, ref = pointCount; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      tarray.subarray(offset += stride, offset + stride).set([...sarray.subarray(i * 3, i * 3 + 3), ...carray]);
    }
    return ptr;
  }

};

Object.defineProperties(Object3.registerClass(), {
  byteLength: {
    value: 4 * 32
  },
  typedArray: {
    value: Float32Array
  }
});

Object.defineProperties(Object3.prototype, {
  getBufferObject: {
    value: function() {
      return new OffsetPointer(this);
    }
  },
  getBufferOffset: {
    value: function() {
      return this.getUint32(OFFSET_BUFFER_OFFSET);
    }
  },
  setBufferOffset: {
    value: function() {
      return this.setUint32(OFFSET_BUFFER_OFFSET, arguments[0]);
    }
  },
  getAttibLength: {
    value: function() {
      return this.getUint16(OFFSET_ATTRIB_LENGTH);
    }
  },
  setAttibLength: {
    value: function() {
      return this.setUint16(OFFSET_ATTRIB_LENGTH, arguments[0]);
    }
  },
  getAttibStride: {
    value: function() {
      return this.getUint8(OFFSET_ATTRIB_STRIDE);
    }
  },
  setAttibStride: {
    value: function() {
      return this.setUint8(OFFSET_ATTRIB_STRIDE, arguments[0]);
    }
  },
  getVertexCount: {
    value: function() {
      return (this.length - this.constructor.LENGTH_OF_POINTER) / 3;
    }
  },
  getVertexArray: {
    value: function() {
      return this.subarray(this.constructor.LENGTH_OF_POINTER);
    }
  },
  setVertexArray: {
    value: function() {
      return this.set(this.constructor.LENGTH_OF_POINTER, arguments[0]);
    }
  },
  getCopyBegin: {
    value: function() {
      return this.getUint32(OFFSET_O3_COPY_BEGIN);
    }
  },
  setCopyBegin: {
    value: function() {
      return this.setUint32(OFFSET_O3_COPY_BEGIN, arguments[0]);
    }
  },
  getCopyLength: {
    value: function() {
      return this.getUint32(OFFSET_O3_COPYLENGTH);
    }
  },
  setCopyLength: {
    value: function() {
      return this.setUint32(OFFSET_O3_COPYLENGTH, arguments[0]);
    }
  },
  keyTypeGLCode: {
    value: function() {
      return this.keyUint16(OFFSET_O3_DRAWTYPE, KEYEXTEND_OBJECT3D);
    }
  },
  getTypeGLCode: {
    value: function() {
      return this.getUint16(OFFSET_O3_DRAWTYPE);
    }
  },
  setTypeGLCode: {
    value: function() {
      return this.setUint16(OFFSET_O3_DRAWTYPE, arguments[0]);
    }
  },
  getPosition: {
    value: function() {
      return new Vertex(this.byteOffset + OFFSET_O3_POSITION);
    }
  },
  getRotation: {
    value: function() {
      return new Angle3(this.byteOffset + OFFSET_O3_ROTATION);
    }
  },
  getScale: {
    value: function() {
      return new Scale3(this.byteOffset + OFFSET_O3_SCALE_3D);
    }
  },
  getColor: {
    value: function() {
      return new Color4(this.byteOffset + OFFSET_O3_COLOR_4D);
    }
  },
  setPosition: {
    value: function() {
      return this.setArray3(OFFSET_O3_POSITION, arguments[0]);
    }
  },
  setRotation: {
    value: function() {
      return this.setArray3(OFFSET_O3_ROTATION, arguments[0]);
    }
  },
  setScale: {
    value: function() {
      return this.setArray3(OFFSET_O3_SCALE_3D, arguments[0]);
    }
  },
  setColor: {
    value: function() {
      return this.setArray4(OFFSET_O3_COLOR_4D, arguments[0]);
    }
  }
});

Object.defineProperties(Object3.prototype, {
  vertexCount: {
    get: Object3.prototype.getVertexCount
  },
  vertexArray: {
    get: Object3.prototype.getVertexArray,
    set: Object3.prototype.setVertexArray
  },
  attribStride: {
    get: Object3.prototype.getAttibStride,
    set: Object3.prototype.setAttibStride
  },
  attribLength: {
    get: Object3.prototype.getAttibLength,
    set: Object3.prototype.setAttibLength
  },
  bufferOffset: {
    get: Object3.prototype.getBufferOffset,
    set: Object3.prototype.setBufferOffset
  },
  bufferObject: {
    get: Object3.prototype.getBufferObject
  },
  copyBegin: {
    get: Object3.prototype.getCopyBegin,
    set: Object3.prototype.setCopyBegin
  },
  copyLength: {
    get: Object3.prototype.getCopyLength,
    set: Object3.prototype.setCopyLength
  },
  position: {
    get: Object3.prototype.getPosition,
    set: Object3.prototype.setPosition
  },
  rotation: {
    get: Object3.prototype.getRotation,
    set: Object3.prototype.setRotation
  },
  scale: {
    get: Object3.prototype.getScale,
    set: Object3.prototype.setScale
  },
  color: {
    get: Object3.prototype.getColor,
    set: Object3.prototype.setColor
  },
  type: {
    get: Object3.prototype.keyTypeGLCode,
    set: Object3.prototype.setTypeGLCode
  }
});
