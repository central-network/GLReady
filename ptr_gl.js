var ASPECT_RATIO, DEPTH_N_COLOR_BIT, FLOAT, FLOAT_MAT4, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, HEIGHT, HOFFSET_ATTRIB_COMPONENTS, HOFFSET_ATTRIB_ENABLED, HOFFSET_ATTRIB_FNI_ENABLE, HOFFSET_ATTRIB_FNI_POINTS, HOFFSET_ATTRIB_NORMALIZE, HOFFSET_ATTRIB_OFFSET, HOFFSET_ATTRIB_STRIDE, HOFFSET_ATTRIB_UPLOADED, KEYEXTEND_CLEARMASK, KEYEXTEND_OBJECT3D, LINES, LINE_LOOP, LINE_STRIP, OFFSET_ASPECT_RATIO, OFFSET_ATTACH_STATUS, OFFSET_ATTR_OFFSET, OFFSET_ATTR_STRIDE, OFFSET_BIND_TARGET, OFFSET_BLEND_ACTIVE, OFFSET_BLEND_EQUATE, OFFSET_BLEND_FUNC, OFFSET_BLEND_INARG, OFFSET_BLEND_OUTARG, OFFSET_CHAR_LENGTH, OFFSET_CLEAR_COLOR, OFFSET_CLEAR_DEPTH, OFFSET_CLEAR_MASK, OFFSET_CULL_ENABLED, OFFSET_CULL_FACE, OFFSET_DEPTH_ACTIVE, OFFSET_DEPTH_FUNC, OFFSET_DEPTH_TEST, OFFSET_DRAGGING, OFFSET_DRAW_ACTIVE, OFFSET_DX, OFFSET_DY, OFFSET_FRONTFACE, OFFSET_HEIGHT, OFFSET_INUSE_STATUS, OFFSET_ISNORMALIZE, OFFSET_IS_ATTACHED, OFFSET_IS_COMPILED, OFFSET_IS_UPLOADED, OFFSET_JUMPING, OFFSET_KEY_ALT, OFFSET_KEY_CTRL, OFFSET_KEY_LOCATED, OFFSET_KEY_META, OFFSET_KEY_SHIFT, OFFSET_LEFT, OFFSET_LINKED_STATUS, OFFSET_LOCATION_AT, OFFSET_LOOKING, OFFSET_MOVE_BACK, OFFSET_MOVE_DOWN, OFFSET_MOVE_FWD, OFFSET_MOVE_LEFT, OFFSET_MOVE_RIGHT, OFFSET_MOVE_UP, OFFSET_NAME_LENGTH, OFFSET_NAME_TARRAY, OFFSET_NCOMPONENTS, OFFSET_O3_COLOR_4D, OFFSET_O3_POSITION, OFFSET_O3_ROTATION, OFFSET_O3_SCALE_3D, OFFSET_PIXEL_RATIO, OFFSET_PTR_BUTTON, OFFSET_PTR_CLICK, OFFSET_PTR_DCLICK, OFFSET_ROTATING, OFFSET_RX, OFFSET_RY, OFFSET_SHADER_TYPE, OFFSET_SHIFT_RATIO, OFFSET_SOURCE_TEXT, OFFSET_SX, OFFSET_SY, OFFSET_SZ, OFFSET_TIME, OFFSET_TOP, OFFSET_TYPE_GLCODE, OFFSET_UX_ENABLED, OFFSET_VX, OFFSET_VY, OFFSET_VZ, OFFSET_WALKING, OFFSET_WIDTH, OFFSET_X, OFFSET_Y, OFFSET_ZOOMING, PIXEL_RATIO, POINTS, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, WIDTH;

import {
  Pointer,
  Vertex,
  Angle3,
  Scale3,
  Color4,
  Matrix4,
  GLType
} from "./ptr.js";

OFFSET_DRAW_ACTIVE = 4 * 0;

OFFSET_CULL_ENABLED = 4 * 0 + 1;

OFFSET_BLEND_ACTIVE = 4 * 0 + 2;

OFFSET_DEPTH_ACTIVE = 4 * 0 + 3;

OFFSET_CULL_FACE = 4 * 1;

OFFSET_FRONTFACE = 4 * 1 + 2;

OFFSET_DEPTH_FUNC = 4 * 2;

OFFSET_CLEAR_MASK = 4 * 2 + 2;

OFFSET_CLEAR_DEPTH = 4 * 3;

OFFSET_CLEAR_COLOR = 4 * 4;

OFFSET_BIND_TARGET = 4 * 8;

OFFSET_BLEND_EQUATE = 4 * 8 + 2;

OFFSET_BLEND_INARG = 4 * 9;

OFFSET_BLEND_OUTARG = 4 * 9 + 2;

OFFSET_BLEND_FUNC = 4 * 10;

OFFSET_DEPTH_TEST = 4 * 10 + 2;

OFFSET_WALKING = 4 * 11;

OFFSET_JUMPING = 4 * 11 + 1;

OFFSET_KEY_SHIFT = 4 * 11 + 2;

OFFSET_KEY_ALT = 4 * 11 + 3;

OFFSET_KEY_CTRL = 4 * 12;

OFFSET_KEY_META = 4 * 12 + 1;

OFFSET_MOVE_FWD = 4 * 12 + 2;

OFFSET_MOVE_BACK = 4 * 12 + 3;

OFFSET_MOVE_LEFT = 4 * 13;

OFFSET_MOVE_RIGHT = 4 * 13 + 1;

OFFSET_MOVE_UP = 4 * 13 + 2;

OFFSET_MOVE_DOWN = 4 * 13 + 3;

OFFSET_LOOKING = 4 * 14;

OFFSET_ZOOMING = 4 * 14 + 1;

OFFSET_PTR_DCLICK = 4 * 14 + 2;

OFFSET_PTR_CLICK = 4 * 14 + 3;

OFFSET_PTR_BUTTON = 4 * 15;

OFFSET_ROTATING = 4 * 16;

OFFSET_DRAGGING = 4 * 16 + 1;

OFFSET_UX_ENABLED = 4 * 16 + 2;

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

OFFSET_INUSE_STATUS = 1;

OFFSET_LINKED_STATUS = 1 + 1;

OFFSET_ATTACH_STATUS = 1 + 2;

OFFSET_SHADER_TYPE = 4 * 0;

OFFSET_IS_UPLOADED = 4 * 0 + 2;

OFFSET_IS_COMPILED = 4 * 0 + 3;

OFFSET_IS_ATTACHED = 4 * 1;

OFFSET_CHAR_LENGTH = 4 * 1 + 2;

OFFSET_SOURCE_TEXT = 4 * 2;

OFFSET_TYPE_GLCODE = 4 * 2;

OFFSET_NCOMPONENTS = 4 * 2 + 2;

OFFSET_KEY_LOCATED = 4 * 2 + 3;

OFFSET_NAME_LENGTH = 4 * 3 + 2;

OFFSET_NAME_TARRAY = 4 * 4;

OFFSET_LOCATION_AT = 4 * 0;

OFFSET_ISNORMALIZE = 4 * 0 + 1;

OFFSET_ATTR_STRIDE = 4 * 0 + 2;

OFFSET_ATTR_OFFSET = 4 * 0 + 3;

OFFSET_O3_COLOR_4D = 4 * 0;

OFFSET_O3_POSITION = 4 * 1 * 4;

OFFSET_O3_ROTATION = 4 * 2 * 4;

OFFSET_O3_SCALE_3D = 4 * 3 * 4;

KEYEXTEND_CLEARMASK = {
  [16640]: new (DEPTH_N_COLOR_BIT = class DEPTH_N_COLOR_BIT extends Number {})(16640)
};

KEYEXTEND_OBJECT3D = {
  [WebGL2RenderingContext.POINTS]: new (POINTS = class POINTS extends Number {})(WebGL2RenderingContext.POINTS),
  [WebGL2RenderingContext.LINES]: new (LINES = class LINES extends Number {})(WebGL2RenderingContext.LINES),
  [WebGL2RenderingContext.LINE_LOOP]: new (LINE_LOOP = class LINE_LOOP extends Number {})(WebGL2RenderingContext.LINE_LOOP),
  [WebGL2RenderingContext.LINE_STRIP]: new (LINE_STRIP = class LINE_STRIP extends Number {})(WebGL2RenderingContext.LINE_STRIP),
  [WebGL2RenderingContext.TRIANGLES]: new (TRIANGLES = class TRIANGLES extends Number {})(WebGL2RenderingContext.TRIANGLES),
  [WebGL2RenderingContext.TRIANGLE_FAN]: new (TRIANGLE_FAN = class TRIANGLE_FAN extends Number {})(WebGL2RenderingContext.TRIANGLE_FAN),
  [WebGL2RenderingContext.TRIANGLE_STRIP]: new (TRIANGLE_STRIP = class TRIANGLE_STRIP extends Number {})(WebGL2RenderingContext.TRIANGLE_STRIP)
};

WIDTH = typeof innerWidth !== "undefined" && innerWidth !== null ? innerWidth : 1024;

HEIGHT = typeof innerHeight !== "undefined" && innerHeight !== null ? innerHeight : 768;

PIXEL_RATIO = typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1;

ASPECT_RATIO = WIDTH / HEIGHT;

export var Object3 = class Object3 extends Pointer {};

export var Draw = class Draw extends Pointer {};

export var Mode = class Mode extends Pointer {};

export var GL = (function() {
  class GL extends Pointer {
    load() {
      var context, height, left, ratioAspect, ratioPixel, top, width;
      ({width = WIDTH, height = HEIGHT, left = 0, top = 0} = arguments[0].getBoundingClientRect());
      [ratioAspect = ASPECT_RATIO, ratioPixel] = [width / height, typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1];
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

    fork() {
      //? Or if you know that the parent function 
      //* doesn’t require arguments, 
      //! just call super():
      return super.fork();
    }

    //: return super.fork();
    clear() {
      this.gl.clearColor(...this.clearColor);
      return this.gl.clear(this.clearMask);
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

    getAllCameras() {
      return this.findAllChilds().filter(function(p) {
        return p instanceof Camera;
      });
    }

    getCamera() {
      return this.getAllCameras().find(function(p) {
        return p; // filter
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

    getClearColor() {
      return new Color4(this.getByteOffset(OFFSET_CLEAR_COLOR));
    }

    setClearColor() {
      return this.getClearColor().set(...arguments);
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

  return GL;

}).call(this);

export var Variable = class Variable extends Pointer {};

Variable.registerClass();

Object.define(Variable.prototype, {
  value: {
    get: function() {
      return this.getValue();
    },
    set: function() {
      return this.setValue(arguments[0]);
    }
  },
  location: {
    get: function() {
      return this.getLinkedNode().location;
    }
  },
  program: {
    get: function() {
      return this.getParentPtrO();
    }
  },
  gl: {
    get: function() {
      return this.getParentPtrP().gl;
    }
  },
  type: {
    get: function() {
      return this.constructor.typedValue;
    }
  },
  variable: {
    get: function() {
      return this.getLinkedNode().variable;
    }
  },
  name: {
    get: function() {
      return this.getLinkedNode().name;
    }
  },
  size: {
    get: function() {
      return this.getLinkedNode().size;
    }
  }
});

export var Attribute2 = class Attribute2 extends Variable {};

Attribute2.registerClass();

Object.define(Attribute2.prototype, {
  bindFunctions: {
    value: function() {
      var attrib, i, j, k, len1, len2, len3, length, m, n, offset, ref, ref1, ref2, results, stride;
      stride = 0;
      length = 0;
      ref = this.parent.children;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        attrib = ref[k];
        if (!(attrib instanceof Attribute2)) {
          continue;
        }
        stride += attrib.constructor.byteLength;
        length += attrib.constructor.byteLength / attrib.constructor.typedArray.BYTES_PER_ELEMENT;
      }
      offset = 0;
      ref1 = this.parent.children;
      for (m = 0, len2 = ref1.length; m < len2; m++) {
        attrib = ref1[m];
        if (!(attrib instanceof Attribute2)) {
          continue;
        }
        attrib.stride = stride;
        attrib.offset = offset;
        attrib.numComponents = length;
        offset += attrib.constructor.byteLength;
      }
      ref2 = this.parent.children;
      results = [];
      for (n = 0, len3 = ref2.length; n < len3; n++) {
        attrib = ref2[n];
        if (!(attrib instanceof Attribute2)) {
          continue;
        }
        if (!(i = attrib.getFniEnable())) {
          attrib.setFniEnable(i = Pointer.resvStoreIndex());
        }
        if (!(j = attrib.getFniPoints())) {
          attrib.setFniPoints(j = Pointer.resvStoreIndex());
        }
        Pointer.storeObject(i, this.gl.enableVertexAttribArray.bind(this.gl, attrib.location));
        results.push(Pointer.storeObject(j, this.gl.vertexAttribPointer.bind(this.gl, attrib.location, attrib.numComponents, attrib.type, attrib.normalize, attrib.stride, attrib.offset)));
      }
      return results;
    }
  }
});

HOFFSET_ATTRIB_UPLOADED = Attribute2.allocHeadByte(Uint8Array);

HOFFSET_ATTRIB_COMPONENTS = Attribute2.allocHeadByte(Uint8Array);

HOFFSET_ATTRIB_NORMALIZE = Attribute2.allocHeadByte(Uint8Array);

HOFFSET_ATTRIB_STRIDE = Attribute2.allocHeadByte(Uint8Array);

HOFFSET_ATTRIB_OFFSET = Attribute2.allocHeadByte(Uint8Array);

HOFFSET_ATTRIB_ENABLED = Attribute2.allocHeadByte(Uint8Array);

HOFFSET_ATTRIB_FNI_ENABLE = Attribute2.allocHeadByte(Uint16Array);

HOFFSET_ATTRIB_FNI_POINTS = Attribute2.allocHeadByte(Uint16Array);

Object.define(Attribute2.prototype, {
  getUploaded: {
    value: function() {
      return this.getHeadUint8(HOFFSET_ATTRIB_UPLOADED);
    }
  },
  setUploaded: {
    value: function() {
      return this.setHeadUint8(HOFFSET_ATTRIB_UPLOADED, arguments[0]);
    }
  },
  getNumComponents: {
    value: function() {
      return this.getHeadUint8(HOFFSET_ATTRIB_COMPONENTS);
    }
  },
  setNumComponents: {
    value: function() {
      return this.setHeadUint8(HOFFSET_ATTRIB_COMPONENTS, arguments[0]);
    }
  },
  getNormalize: {
    value: function() {
      return this.getHeadUint8(HOFFSET_ATTRIB_NORMALIZE);
    }
  },
  setNormalize: {
    value: function() {
      return this.setHeadUint8(HOFFSET_ATTRIB_NORMALIZE, arguments[0]);
    }
  },
  getStride: {
    value: function() {
      return this.getHeadUint8(HOFFSET_ATTRIB_STRIDE);
    }
  },
  setStride: {
    value: function() {
      return this.setHeadUint8(HOFFSET_ATTRIB_STRIDE, arguments[0]);
    }
  },
  getOffset: {
    value: function() {
      return this.getHeadUint8(HOFFSET_ATTRIB_OFFSET);
    }
  },
  setOffset: {
    value: function() {
      return this.setHeadUint8(HOFFSET_ATTRIB_OFFSET, arguments[0]);
    }
  },
  getEnabled: {
    value: function() {
      return this.getHeadUint8(HOFFSET_ATTRIB_ENABLED);
    }
  },
  setEnabled: {
    value: function() {
      return this.setHeadUint8(HOFFSET_ATTRIB_ENABLED, arguments[0]);
    }
  },
  fnCallEnable: {
    value: function() {
      return this.objHeadUint16(HOFFSET_ATTRIB_FNI_ENABLE);
    }
  },
  getFniEnable: {
    value: function() {
      return this.getHeadUint16(HOFFSET_ATTRIB_FNI_ENABLE);
    }
  },
  setFniEnable: {
    value: function() {
      return this.setHeadUint16(HOFFSET_ATTRIB_FNI_ENABLE, arguments[0]);
    }
  },
  fnCallPoints: {
    value: function() {
      return this.objHeadUint16(HOFFSET_ATTRIB_FNI_POINTS);
    }
  },
  getFniPoints: {
    value: function() {
      return this.getHeadUint16(HOFFSET_ATTRIB_FNI_POINTS);
    }
  },
  setFniPoints: {
    value: function() {
      return this.setHeadUint16(HOFFSET_ATTRIB_FNI_POINTS, arguments[0]);
    }
  }
});

Object.define(Attribute2.prototype, {
  numComponents: {
    get: Attribute2.prototype.getNumComponents,
    set: Attribute2.prototype.setNumComponents
  },
  normalize: {
    get: Attribute2.prototype.getNormalize,
    set: Attribute2.prototype.setNormalize
  },
  stride: {
    get: Attribute2.prototype.getStride,
    set: Attribute2.prototype.setStride
  },
  offset: {
    get: Attribute2.prototype.getOffset,
    set: Attribute2.prototype.setOffset
  },
  enabled: {
    get: Attribute2.prototype.getEnabled,
    set: Attribute2.prototype.setEnabled
  },
  uploaded: {
    get: Attribute2.prototype.getUploaded,
    set: Attribute2.prototype.setUploaded
  },
  fnEnable: {
    get: Attribute2.prototype.fnCallEnable
  },
  fnPoints: {
    get: Attribute2.prototype.fnCallPoints
  }
});

export var Uniform2 = (function() {
  class Uniform2 extends Variable {};

  Uniform2.registerClass();

  return Uniform2;

}).call(this);

Attribute2[WebGL2RenderingContext.FLOAT_VEC2] = FLOAT_VEC2 = (function() {
  class FLOAT_VEC2 extends Attribute2 {
    getValue() {
      return this.getTypedArray();
    }

    setValue() {
      return this.getValue().set(arguments[0]);
    }

    upload() {
      return this.gl.uniform2f(this.location, ...this.array);
    }

  };

  FLOAT_VEC2.byteLength = 4 * 2;

  FLOAT_VEC2.typedValue = WebGL2RenderingContext.FLOAT;

  FLOAT_VEC2.typedArray = Float32Array;

  FLOAT_VEC2.registerClass();

  return FLOAT_VEC2;

}).call(this);

Attribute2[WebGL2RenderingContext.FLOAT_VEC3] = FLOAT_VEC3 = (function() {
  class FLOAT_VEC3 extends FLOAT_VEC2 {
    upload() {
      return this.gl.uniform3f(this.location, ...this.array);
    }

  };

  FLOAT_VEC3.byteLength = 4 * 3;

  FLOAT_VEC3.registerClass();

  return FLOAT_VEC3;

}).call(this);

Attribute2[WebGL2RenderingContext.FLOAT_VEC4] = FLOAT_VEC4 = (function() {
  class FLOAT_VEC4 extends FLOAT_VEC2 {
    upload() {
      return this.gl.uniform4f(this.location, ...this.array);
    }

  };

  FLOAT_VEC4.byteLength = 4 * 4;

  FLOAT_VEC4.registerClass();

  return FLOAT_VEC4;

}).call(this);

Uniform2[WebGL2RenderingContext.FLOAT] = FLOAT = (function() {
  class FLOAT extends Uniform2 {
    getValue() {
      return this.getResvFloat32(1);
    }

    setValue() {
      return this.setResvFloat32(1, arguments[0]);
    }

    upload() {
      return this.gl.uniform1f(this.location, this.getValue());
    }

  };

  FLOAT.typedValue = WebGL2RenderingContext.FLOAT;

  FLOAT.registerClass();

  return FLOAT;

}).call(this);

Uniform2[WebGL2RenderingContext.FLOAT_MAT4] = FLOAT_MAT4 = (function() {
  class FLOAT_MAT4 extends Uniform2 {
    getValue() {
      return this.getTypedArray();
    }

    setValue() {
      return this.getValue().set(arguments[0]);
    }

    upload() {
      return this.gl.uniformMatrix4fv(this.location, false, this.getValue());
    }

  };

  FLOAT_MAT4.byteLength = 4 * 16;

  FLOAT_MAT4.typedValue = WebGL2RenderingContext.FLOAT;

  FLOAT_MAT4.typedArray = Float32Array;

  FLOAT_MAT4.registerClass();

  return FLOAT_MAT4;

}).call(this);

Object.define(Mode.prototype, {
  is: {
    value: function() {
      return 0 === this.getTypeGLCode() - arguments[0];
    }
  },
  malloc: {
    value: function() {
      var byteLength, components, count, destOffset, draw, length, mallocOffset, obj3, vertices;
      obj3 = arguments[0];
      vertices = obj3.getVertices();
      components = this.getComponents();
      count = vertices.length / 3;
      length = count * components;
      byteLength = length * vertices.BYTES_PER_ELEMENT;
      mallocOffset = this.addAllocBytes(byteLength);
      destOffset = this.getModeOffset() + mallocOffset;
      this.addModeLength(length);
      this.addDrawLength(count);
      draw = new Draw();
      draw.setParentPtri(this);
      draw.setLinkedPtri(obj3);
      draw.setDstOffset(destOffset);
      draw.setStart(destOffset / 4);
      draw.setCount(length);
      draw.setModeBegin(mallocOffset / 4);
      draw.setModeEnd(draw.getModeBegin() + length);
      return draw;
    }
  },
  render: {
    value: function() {
      this.gl.drawArrays(this.mode, this.first, this.count);
      return log(`draw call  ->  ${this.mode.constructor.name}`);
    }
  }
});

export var Program = (function() {
  class Program extends Pointer {
    link() {
      var attrib, k, len1, len2, m, node, ref, ref1, uniform;
      if (this.getLinkedStatus()) {
        return this;
      }
      this.getParentPtrO().linkProgram(this.getGLProgram());
      if (!this.setLinkedStatus(this.getGLLinkStatus(this.getGLValidate()))) {
        return this;
      }
      ref = this.getGLAttributes();
      for (k = 0, len1 = ref.length; k < len1; k++) {
        node = ref[k];
        this.add(attrib = new Attribute2[node.type]);
        attrib.setLinkedNode(node);
        attrib.bindFunctions(this);
      }
      ref1 = this.getGLUniforms();
      for (m = 0, len2 = ref1.length; m < len2; m++) {
        node = ref1[m];
        this.add(uniform = new Uniform2[node.type]);
        uniform.setLinkedNode(node);
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

    getBuffer() {
      var buffer, ref;
      if (!(buffer = (ref = arguments[0]) != null ? ref : this.parent.buffers[0])) {
        buffer = new Buffer();
      }
      if (!buffer.link) {
        buffer.parent = this;
        buffer.bind();
      }
      return buffer;
    }

    findKey() {
      var child, k, len1, ref;
      ref = this.children;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        child = ref[k];
        if (child.name === arguments[0]) {
          return child;
        }
      }
      return null;
    }

    draw() {
      var buffer, byteLength, key, length, mode, numComponents, options, pointer, prop, ref, shader, vertexCount;
      options = arguments[0];
      buffer = this.getBuffer(options.buffer);
      mode = buffer.getMode(options.mode != null ? options.mode : options.mode = WebGL2RenderingContext.POINTS);
      shader = options.shader != null ? options.shader : options.shader = this.getVertShader();
      vertexCount = options.object.vertexCount;
      length = 0;
      byteLength = 0;
      numComponents = 0;
      console.log(vertexCount);
      ref = options.values;
      for (key in ref) {
        prop = ref[key];
        pointer = this.findKey(key);
        console.log(key, prop, pointer);
      }
      //draw    = mode.malloc options.object, options.attributes
      console.log(buffer);
      console.log(mode);
      console.log(shader);
      return console.log(this);
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

    getGLUniform() {
      var info;
      return Object.assign(info = this.getParentPtrO().getActiveUniform(this.getGLProgram(), arguments[0]), {
        variable: GLType[info.type],
        location: this.getParentPtrO().getUniformLocation(this.getGLProgram(), info.name)
      });
    }

    getGLAttribute() {
      var info;
      return Object.assign(info = this.getParentPtrO().getActiveAttrib(this.getGLProgram(), arguments[0]), {
        variable: GLType[info.type],
        numComponents: GLType[info.type].byteLength,
        a: GLType[info.type].constructor.typedArray,
        location: this.getParentPtrO().getAttribLocation(this.getGLProgram(), info.name)
      });
    }

    getGLUniforms() {
      var i, k, ref, results;
      results = [];
      for (i = k = 0, ref = this.getGLParameter(this.ACTIVE_UNIFORMS); (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
        results.push(this.getGLUniform(i));
      }
      return results;
    }

    getGLAttributes() {
      var i, k, ref, results;
      results = [];
      for (i = k = 0, ref = this.getGLParameter(this.ACTIVE_ATTRIBUTES); (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
        results.push(this.getGLAttribute(i));
      }
      return results;
    }

    getGLVariables() {
      return [...this.getGLUniforms(), ...this.getGLAttributes()];
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

  Program.prototype.ACTIVE_UNIFORMS = WebGL2RenderingContext.ACTIVE_UNIFORMS;

  Program.prototype.ACTIVE_ATTRIBUTES = WebGL2RenderingContext.ACTIVE_ATTRIBUTES;

  return Program;

}).call(this);

Object.define(Program.registerClass().prototype, {
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
  glVertShader: {
    get: Program.prototype.getGLVertShader
  },
  glFragShader: {
    get: Program.prototype.getGLFragShader
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
  vertShader: {
    get: Program.prototype.getVertShader,
    set: Program.prototype.setVertShader
  },
  fragShader: {
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

export var Shader = (function() {
  class Shader extends Pointer {
    static parse() {
      return [...Uniform.parse(arguments[0]), ...Attribute.parse(arguments[0])];
    }

    static fromSource() {
      var byteLength, byteSource, charLength, k, key, len1, parsedKeys, ptr, shaderType, textSource;
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
      for (k = 0, len1 = parsedKeys.length; k < len1; k++) {
        key = parsedKeys[k];
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
      var k, key, len1, ref;
      if (!this.isVertexShader()) {
        return this;
      }
      this.getAllVariables().forEach(Pointer.removePointer);
      ref = Shader.parse(this.getSourceText());
      for (k = 0, len1 = ref.length; k < len1; k++) {
        key = ref[k];
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

    findKey() {
      var key, name, ref;
      name = arguments[0];
      ref = this;
      for (key of ref) {
        if (key.is(name)) {
          return key;
        }
      }
      return false;
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
      return this.getTArray(OFFSET_SOURCE_TEXT);
    }

    setByteSource() {
      this.setTArray(OFFSET_SOURCE_TEXT, arguments[0]);
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

  return Shader;

}).call(this);

export var ShaderKey = (function() {
  class ShaderKey extends Pointer {
    is() {
      var len, name;
      name = `${arguments[0]}`;
      len = name.length;
      while (len--) {
        if (name[len].charCodeAt() - this.getUint8(len + OFFSET_NAME_TARRAY)) {
          return;
        }
      }
      return this;
    }

    enable() {
      return this.getLinkedNode()(this.setResvUint8(0, 0));
    }

    /* sign uploaded */    getNeedsUpload() {
      return this.getResvUint8(0);
    }

    setNeedsUpload() {
      return this.setResvUint8(0, arguments[0]);
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

    getTArray() {
      return this.link;
    }

  };

  ShaderKey.byteLength = 4 * 16;

  ShaderKey.typedArray = Float32Array;

  return ShaderKey;

}).call(this);

export var Attribute = (function() {
  var float, mat4, vec3, vec4;

  class Attribute extends ShaderKey {
    static parse() {
      var k, key, keys, len1, offset, source;
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
        if (!Object.hasOwn(Shader.prototype, name)) {
          (function(a_Name) {
            return Object.define(this, {
              [a_Name]: {
                get: function() {
                  return this.findKey(a_Name);
                },
                set: function() {
                  return this.findKey(a_Name).setValue(arguments[0]);
                }
              }
            });
          }).call(Shader.prototype, name);
        }
        return offset += key.getComponents() * 4;
      });
      for (k = 0, len1 = keys.length; k < len1; k++) {
        key = keys[k];
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
        log(`attr link  ->  ${name}`);
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

  Object.define(Attribute.registerClass(), {
    vec3: {
      value: vec3 = (function() {
        class vec3 extends Attribute {
          getValue() {
            return this.array;
          }

          setValue() {
            return this.array.set(arguments[0]);
          }

        };

        vec3.components = 3;

        vec3.registerClass();

        return vec3;

      }).call(this)
    },
    vec4: {
      value: vec4 = (function() {
        class vec4 extends Attribute {};

        vec4.components = 4;

        vec4.registerClass();

        return vec4;

      }).call(this)
    },
    mat4: {
      value: mat4 = (function() {
        class mat4 extends Attribute {};

        mat4.components = 16;

        mat4.registerClass();

        return mat4;

      }).call(this)
    },
    float: {
      value: float = (function() {
        class float extends Attribute {};

        float.components = 1;

        float.registerClass();

        return float;

      }).call(this)
    }
  });

  return Attribute;

}).call(this);

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
        key.setTypeGLCode(WebGL2RenderingContext.FLOAT);
        if (!Object.hasOwn(Shader.prototype, name)) {
          return (function(u_Name) {
            return Object.define(this, {
              [u_Name]: {
                get: function() {
                  return this.findKey(u_Name);
                },
                set: function() {
                  return this.findKey(u_Name).setValue(arguments[0]);
                }
              }
            });
          }).call(Shader.prototype, name);
        }
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
      return location;
    }

  };

  Object.define(Uniform.registerClass(), {
    vec3: {
      value: vec3 = (function() {
        class vec3 extends Uniform {};

        vec3.components = 3;

        vec3.byteLength = 4 * 3;

        vec3.typedArray = Float32Array;

        vec3.registerClass();

        return vec3;

      }).call(this)
    },
    vec4: {
      value: vec4 = (function() {
        class vec4 extends Uniform {};

        vec4.components = 4;

        vec4.byteLength = 4 * 4;

        vec4.typedArray = Float32Array;

        vec4.registerClass();

        return vec4;

      }).call(this)
    },
    mat4: {
      value: mat4 = (function() {
        class mat4 extends Uniform {
          setValue() {
            this.setResvUint32(1, arguments[0]);
            return arguments[0].setLinkedNode(this).needsUpload = 1;
          }

          getValue() {
            return this.ptrResvUint32(1).getTypedArray();
          }

          upload() {
            return this.needsUpload = this.gl.uniformMatrix4fv(this.location, false, this.value);
          }

        };

        mat4.components = 16;

        mat4.byteLength = 4 * 16;

        mat4.typedArray = Float32Array;

        mat4.registerClass();

        return mat4;

      }).call(this)
    },
    float: {
      value: float = (function() {
        class float extends Uniform {
          setValue() {
            return this.setResvFloat32(this.needsUpload = 1, arguments[0]);
          }

          getValue() {
            return this.getResvFloat32(1);
          }

          upload() {
            return this.needsUpload = this.gl.uniform1f(this.location, this.value);
          }

        };

        float.components = 1;

        float.typedArray = Float32Array;

        float.registerClass();

        return float;

      }).call(this)
    }
  });

  return Uniform;

}).call(this);

export var Buffer = (function() {
  class Buffer extends Pointer {
    create() {
      if (this.getLinkedNode()) {
        return this;
      }
      this.setLinkedNode(this.gl.createBuffer());
      return this;
    }

    bind() {
      if (this.getBindStatus()) {
        return this;
      }
      if (!this.getLinkedNode()) {
        this.create().setTarget(this.ARRAY_BUFFER).setUsage(this.STATIC_DRAW);
      }
      this.gl.bindBuffer(this.getTarget(), this.getLinkedNode());
      this.setBindStatus(1).upload();
      return this;
    }

    upload() {
      this.setDataStatus(1).getContext().bufferData(this.getTarget(), this.getTypedArray(), this.getUsage());
      return this;
    }

    mode() {
      var byte, mode, offset;
      byte = 4 * 7 * 1e5;
      mode = new Mode();
      mode.setParentPtri(this);
      mode.setTypeGLCode(arguments[0]);
      mode.setModeOffset(offset = this.addModeOffset(byte));
      mode.setFirstIndex(offset / 4);
      return mode;
    }

    getMode() {
      var k, len1, mode, ref, type;
      type = arguments[0];
      ref = this.getModes();
      for (k = 0, len1 = ref.length; k < len1; k++) {
        mode = ref[k];
        if (mode.is(type)) {
          return mode;
        }
      }
      return this.mode(type);
    }

    drawArrays() {
      this.getMode(arguments[1]).malloc(arguments[0]);
      return this;
    }

    drawLines() {
      return this.drawArrays(arguments[0], WebGL2RenderingContext.LINES);
    }

    drawLineLoop() {
      return this.drawArrays(arguments[0], WebGL2RenderingContext.LINE_LOOP);
    }

    drawLineStrip() {
      return this.drawArrays(arguments[0], WebGL2RenderingContext.LINE_STRIP);
    }

    drawPoints() {
      return this.drawArrays(arguments[0], WebGL2RenderingContext.POINTS);
    }

    drawTriangles() {
      return this.drawArrays(arguments[0], WebGL2RenderingContext.TRIANGLES);
    }

    drawTriangleFan() {
      return this.drawArrays(arguments[0], WebGL2RenderingContext.TRIANGLE_FAN);
    }

    drawTriangleStrip() {
      return this.drawArrays(arguments[0], WebGL2RenderingContext.TRIANGLE_STRIP);
    }

    delete() {
      this.setBindStatus(this.gl.deleteBuffer(this.getLinkedNode()));
      return this;
    }

    getContext() {
      return this.parent.gl;
    }

    getModes() {
      return this.findAllChilds().filter(function(v) {
        return v instanceof Mode;
      });
    }

    getGLBuffer() {
      return this.getLinkedNode() || this.setGLBuffer(this.create());
    }

    setGLBuffer() {
      return this.setLinkedNode(arguments[0]);
    }

    getGLIsBuffer() {
      return this.gl.isBuffer(this.getLinkedNode());
    }

    getGLParameter() {
      return this.gl.getParameter(arguments[0]);
    }

    getGLBindings() {
      return {
        ARRAY_BUFFER: this.getGLParameter(this.gl.ARRAY_BUFFER_BINDING),
        ELEMENT_BUFFER: this.getGLParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING)
      };
    }

    isArrayBuffer() {
      return this.ELEMENT_BUFFER !== this.getBindTarget();
    }

    getBindStatus() {
      return this.getResvUint8(0);
    }

    setBindStatus() {
      this.setResvUint8(0, arguments[0]);
      return this;
    }

    getDataStatus() {
      return this.getResvUint8(1);
    }

    setDataStatus() {
      this.setResvUint8(1, arguments[0]);
      return this;
    }

    keyTarget() {
      return this.keyResvUint16(1);
    }

    getTarget() {
      return this.getResvUint16(1);
    }

    setTarget() {
      this.setResvUint16(1, arguments[0]);
      return this;
    }

    keyUsage() {
      return this.keyResvUint16(2);
    }

    getUsage() {
      return this.getResvUint16(2);
    }

    setUsage() {
      this.setResvUint16(2, arguments[0]);
      return arguments[0];
    }

    getModeOffset() {
      return this.getResvUint32(2);
    }

    addModeOffset() {
      return this.addResvUint32(2, arguments[0]);
    }

    setModeOffset() {
      this.setResvUint32(2, arguments[0]);
      return arguments[0];
    }

  };

  Buffer.byteLength = 4 * 256 * 256;

  Buffer.typedArray = Float32Array;

  Object.define(Buffer.prototype, {
    STATIC_DRAW: {
      value: WebGLRenderingContext.STATIC_DRAW
    },
    DYNAMIC_DRAW: {
      value: WebGLRenderingContext.DYNAMIC_DRAW
    },
    STREAM_DRAW: {
      value: WebGLRenderingContext.STREAM_DRAW
    },
    STATIC_READ: {
      value: WebGL2RenderingContext.STATIC_READ
    },
    DYNAMIC_READ: {
      value: WebGL2RenderingContext.DYNAMIC_READ
    },
    STREAM_READ: {
      value: WebGL2RenderingContext.STREAM_READ
    },
    STATIC_COPY: {
      value: WebGL2RenderingContext.STATIC_COPY
    },
    DYNAMIC_COPY: {
      value: WebGL2RenderingContext.DYNAMIC_COPY
    },
    STREAM_COPY: {
      value: WebGL2RenderingContext.STREAM_COPY
    }
  });

  Object.define(Buffer.prototype, {
    ARRAY_BUFFER: {
      value: WebGLRenderingContext.ARRAY_BUFFER
    },
    ELEMENT_BUFFER: {
      value: WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
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

export var Camera = (function() {
  class Camera extends Matrix4 {};

  Camera.protoClass = 0;

  Camera.registerClass();

  return Camera;

}).call(this);

Object.define(Camera.prototype, {
  toPerspective: {
    value: function() {
      var c1, c2, h, height, left, sx, sy, top, tx, ty, w, width, yFov, zFar, zNear;
      this.reset();
      [width, height, yFov, zNear, zFar, left, top] = [...arguments];
      this.width = width || this.width || WIDTH;
      this.height = height || this.height || HEIGHT;
      this.left = left || this.left || WIDTH / 2;
      this.top = top || this.top || HEIGHT / 2;
      this.yFov = yFov || this.yFov || 9e+1;
      this.zNear = zNear || this.zNear || 1e-3;
      this.zFar = zFar || this.zFar || 1e+3;
      w = this.width - this.left;
      h = this.top - this.height;
      sx = 2 * this.zNear / w;
      sy = 2 * this.zNear / h;
      c2 = -(this.zFar + this.zNear) / (this.zFar - this.zNear);
      c1 = 2 * this.zNear * this.zFar / (this.zNear - this.zFar);
      tx = -this.zNear * (this.left + this.width) / w;
      ty = -this.zNear * (this.height + this.top) / h;
      this.set(Float32Array.from([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, c2, -1, tx, ty, c1, 0]));
      this.translate([0, 0, -5]);
      this.rotate([Math.PI, 0, 0]);
      this.scale([1, 1, 1]);
      return this;
    }
  },
  getFovY: {
    value: function() {
      return this.getResvUint8(1);
    }
  },
  setFovY: {
    value: function() {
      this.setResvUint8(1, arguments[0]);
      return this;
    }
  },
  getFarZ: {
    value: function() {
      return this.getResvUint16(1);
    }
  },
  setFarZ: {
    value: function() {
      this.setResvUint16(1, arguments[0]);
      return this;
    }
  },
  getWidth: {
    value: function() {
      return this.getResvUint16(2);
    }
  },
  setWidth: {
    value: function() {
      this.setResvUint16(2, arguments[0]);
      return this;
    }
  },
  getHeight: {
    value: function() {
      return this.getResvUint16(3);
    }
  },
  setHeight: {
    value: function() {
      this.setResvUint16(3, arguments[0]);
      return this;
    }
  },
  getLeft: {
    value: function() {
      return this.getResvUint16(4);
    }
  },
  setLeft: {
    value: function() {
      this.setResvUint16(4, arguments[0]);
      return this;
    }
  },
  getTop: {
    value: function() {
      return this.getResvUint16(5);
    }
  },
  setTop: {
    value: function() {
      this.setResvUint16(5, arguments[0]);
      return this;
    }
  },
  getNearZ: {
    value: function() {
      return 1e-5 * this.getResvUint16(6);
    }
  },
  setNearZ: {
    value: function() {
      this.setResvUint16(6, 1e+5 * arguments[0]);
      return this;
    }
  },
  getAspectRatio: {
    value: function() {
      return this.getWidth() / this.getHeight();
    }
  }
});

Object.define(Camera.prototype, {
  aRatio: {
    get: Camera.prototype.getAspectRatio
  },
  yFov: {
    get: Camera.prototype.getFovY,
    set: Camera.prototype.setFovY
  },
  zNear: {
    get: Camera.prototype.getNearZ,
    set: Camera.prototype.setNearZ
  },
  zFar: {
    get: Camera.prototype.getFarZ,
    set: Camera.prototype.setFarZ
  },
  width: {
    get: Camera.prototype.getWidth,
    set: Camera.prototype.setWidth
  },
  height: {
    get: Camera.prototype.getHeight,
    set: Camera.prototype.setHeight
  },
  left: {
    get: Camera.prototype.getLeft,
    set: Camera.prototype.setLeft
  },
  top: {
    get: Camera.prototype.getTop,
    set: Camera.prototype.setTop
  }
});

Object.symbol(GL.registerClass(), {
  instance: {
    value: function() {
      return this.isPrototypeOf(Object.getPrototypeOf(arguments[0]));
    }
  }
});

Object.define(Shader.registerClass().prototype, {
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

Object.define(ShaderKey.registerClass().prototype, {
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
  },
  needsUpload: {
    get: ShaderKey.prototype.getNeedsUpload,
    set: ShaderKey.prototype.setNeedsUpload
  }
});

Object.define(Draw.registerClass(), {
  byteLength: {
    value: 4 * 0
  },
  typedArray: {
    value: Uint32Array
  }
});

Mode.registerClass();

Object.hidden(Buffer.registerClass(), "headers", "protoClass", "length", "array", "byteOffset", "byteLength");

Object.define(Object3.registerClass(), {
  byteLength: {
    value: 4 * 12
  },
  typedArray: {
    value: Float32Array
  }
});

Object.define(GL.prototype, {
  gl: {
    get: GL.prototype.getLinkedNode
  },
  glError: {
    get: GL.prototype.getGLError
  },
  program: {
    get: GL.prototype.getProgram
  },
  camera: {
    get: GL.prototype.getCamera
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
  glBuffer: {
    get: GL.prototype.getGLBuffer
  },
  buffers: {
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
  allUniforms: {
    get: GL.prototype.getUniforms
  },
  allCameras: {
    get: GL.prototype.getAllCameras
  },
  nodeBuffer: {
    get: GL.prototype.getArrayBuffer
  },
  canvas: {
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
  clearMask: {
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
  clearColor: {
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

Object.define(Attribute.prototype, {
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

Object.define(Uniform.prototype, {
  glLocation: {
    get: Uniform.prototype.getGLLocation
  },
  location: {
    get: Uniform.prototype.getGLLocation
  }
});

Object.define(Draw.prototype, {
  getGL: {
    value: function() {
      return this.ptrParentNode().getGL();
    }
  },
  getTarget: {
    value: function() {
      return this.ptrParentNode().ptrParentNode().getBindTarget();
    }
  },
  getSrcData: {
    value: function() {
      return this.ptrParentNode().ptrParentNode().getTypedArray();
    }
  },
  keyTypeGLCode: {
    value: function() {
      return this.ptrParentNode().keyTypeGLCode();
    }
  },
  getDstOffset: {
    value: function() {
      return this.getResvUint32(0);
    }
  },
  setDstOffset: {
    value: function() {
      return this.setResvUint32(0, arguments[0]);
    }
  },
  getModeBegin: {
    value: function() {
      return this.getResvUint32(3);
    }
  },
  setModeBegin: {
    value: function() {
      return this.setResvUint32(3, arguments[0]);
    }
  },
  getModeEnd: {
    value: function() {
      return this.getResvUint32(4);
    }
  },
  setModeEnd: {
    value: function() {
      return this.setResvUint32(4, arguments[0]);
    }
  },
  getStart: {
    value: function() {
      return this.getResvUint32(1);
    }
  },
  setStart: {
    value: function() {
      return this.setResvUint32(1, arguments[0]);
    }
  },
  getCount: {
    value: function() {
      return this.getResvUint32(2);
    }
  },
  setCount: {
    value: function() {
      return this.setResvUint32(2, arguments[0]);
    }
  },
  getAttributes: {
    value: function() {
      return this.ptrParentNode().getAttributes().subarray(this.getModeBegin(), this.getModeEnd());
    }
  },
  setAttributes: {
    value: function() {
      this.getAttributes().set(arguments[0]);
      return this;
    }
  },
  getVertices: {
    value: function() {
      return this.ptrLinkedNode().getVertices();
    }
  },
  getColor: {
    value: function() {
      return this.ptrLinkedNode().getColor();
    }
  },
  getMatrix: {
    value: function() {
      return this.ptrLinkedNode().getMatrix();
    }
  },
  upload: {
    value: function() {
      this.gl.bufferSubData(this.target, this.dstOffset, this.srcData, this.start, this.count);
      return this;
    }
  }
});

Object.define(Draw.prototype, {
  gl: {
    get: Draw.prototype.getGL
  },
  target: {
    get: Draw.prototype.getTarget
  },
  srcData: {
    get: Draw.prototype.getSrcData
  },
  object3: {
    get: Draw.prototype.ptrLinkedNode,
    set: Draw.prototype.setLinkedPtri
  },
  mode: {
    get: Draw.prototype.ptrParentNode,
    set: Draw.prototype.setParentPtri
  },
  type: {
    get: Draw.prototype.keyTypeGLCode
  },
  dstOffset: {
    get: Draw.prototype.getDstOffset,
    set: Draw.prototype.setDstOffset
  },
  start: {
    get: Draw.prototype.getStart,
    set: Draw.prototype.setStart
  },
  count: {
    get: Draw.prototype.getCount,
    set: Draw.prototype.setCount
  },
  attributes: {
    get: Draw.prototype.getAttributes
  },
  vertices: {
    get: Draw.prototype.getVertices
  },
  color: {
    get: Draw.prototype.getColor
  },
  matrix: {
    get: Draw.prototype.getMatrix
  }
});

Object.define(Mode.prototype, {
  getGL: {
    value: function() {
      return this.parent.getGL(); // todo fix worker  
    }
  },
  getBuffer: {
    value: function() {
      return this.parent;
    }
  },
  getProgram: {
    value: function() {
      return this.buffer.parent.program;
    }
  },
  findObjects: {
    value: function() {
      return this.findAllChilds().flatMap(function(v) {
        return v.object3;
      });
    }
  },
  keyTypeGLCode: {
    value: function() {
      return this.keyResvUint16(1, KEYEXTEND_OBJECT3D);
    }
  },
  getTypeGLCode: {
    value: function() {
      return this.getResvUint16(1);
    }
  },
  setTypeGLCode: {
    value: function() {
      return this.setResvUint16(1, arguments[0]);
    }
  },
  getFirstIndex: {
    value: function() {
      return this.getResvUint32(1);
    }
  },
  setFirstIndex: {
    value: function() {
      return this.setResvUint32(1, arguments[0]);
    }
  },
  getModeLength: {
    value: function() {
      return this.getResvUint32(2);
    }
  },
  addModeLength: {
    value: function() {
      return this.addResvUint32(2, arguments[0]);
    }
  },
  setModeLength: {
    value: function() {
      return this.setResvUint32(2, arguments[0]);
    }
  },
  getDrawLength: {
    value: function() {
      return this.getResvUint32(3);
    }
  },
  addDrawLength: {
    value: function() {
      return this.addResvUint32(3, arguments[0]);
    }
  },
  setDrawLength: {
    value: function() {
      return this.setResvUint32(3, arguments[0]);
    }
  },
  getAllocBytes: {
    value: function() {
      return this.getResvUint32(4);
    }
  },
  addAllocBytes: {
    value: function() {
      return this.addResvUint32(4, arguments[0]);
    }
  },
  setAllocBytes: {
    value: function() {
      return this.setResvUint32(4, arguments[0]);
    }
  },
  getModeOffset: {
    value: function() {
      return this.getResvUint32(5);
    }
  },
  setModeOffset: {
    value: function() {
      return this.setResvUint32(5, arguments[0]);
    }
  },
  getAttributes: {
    value: function() {
      return this.getParentPtrP().getTArray(this.getModeOffset(), this.getAllocBytes());
    }
  },
  setAttributes: {
    value: function() {
      this.getAttributes().set(arguments[0]);
      return this;
    }
  }
});

Object.define(Mode.prototype, {
  mode: {
    get: Mode.prototype.keyTypeGLCode,
    set: Mode.prototype.setTypeGLCode
  },
  first: {
    get: Mode.prototype.getFirstIndex,
    set: Mode.prototype.setFirstIndex
  },
  count: {
    get: Mode.prototype.getDrawLength,
    set: Mode.prototype.setDrawLength
  },
  offset: {
    get: Mode.prototype.getModeOffset,
    set: Mode.prototype.setModeOffset
  },
  attributes: {
    get: Mode.prototype.getAttributes,
    set: Mode.prototype.setAttributes
  }
});

Object.define(Buffer.prototype, {
  gl: {
    get: Buffer.prototype.getContext
  },
  target: {
    get: Buffer.prototype.keyTarget,
    set: Buffer.prototype.setTarget
  },
  bound: {
    get: Buffer.prototype.getBindStatus,
    set: Buffer.prototype.setBindStatus
  },
  usage: {
    get: Buffer.prototype.keyUsage,
    set: Buffer.prototype.setUsage
  },
  status: {
    get: Buffer.prototype.getDataStatus,
    set: Buffer.prototype.setDataStatus
  },
  attributes: {
    get: Buffer.prototype.getTypedArray
  }
});

Object.define(Object3.prototype, {
  getDraws: {
    value: function() {
      return this.findAllLinks().filter(function(v) {
        return v instanceof Draw;
      });
    }
  },
  getVertices: {
    value: function() {
      return this.subarray(this.constructor.LENGTH_OF_POINTER);
    }
  },
  setVertices: {
    value: function() {
      return this.set(this.constructor.LENGTH_OF_POINTER, arguments[0]);
    }
  },
  getPosition: {
    value: function() {
      return new Vertex(this.getByteOffset(OFFSET_O3_POSITION));
    }
  },
  getRotation: {
    value: function() {
      return new Angle3(this.getByteOffset(OFFSET_O3_ROTATION));
    }
  },
  getScale: {
    value: function() {
      return new Scale3(this.getByteOffset(OFFSET_O3_SCALE_3D));
    }
  },
  getColor: {
    value: function() {
      return new Color4(this.getByteOffset(OFFSET_O3_COLOR_4D));
    }
  },
  setPosition: {
    value: function() {
      return this.getPosition().set(...arguments);
    }
  },
  setRotation: {
    value: function() {
      return this.getRotation().set(...arguments);
    }
  },
  setScale: {
    value: function() {
      return this.getScale().set(...arguments);
    }
  },
  setColor: {
    value: function() {
      return this.getColor().set(...arguments);
    }
  },
  getVertexCount: {
    value: function() {
      return this.getResvUint32(1) || this.setVertexCount();
    }
  },
  setVertexCount: {
    value: function() {
      return this.setResvUint32(1, arguments[0] || this.getVertices().length / 3);
    }
  },
  getMatrix: {
    value: function() {
      var mat4, ptri;
      if (ptri = this.getResvUint32(0)) {
        return new Matrix4(ptri);
      }
      this.setResvUint32(0, mat4 = new Matrix4()).setLinkedNode(this);
      return mat4.setIsUpdated(true).reset().translate(this.getPosition()).rotate(this.getRotation()).scale(this.getScale());
    }
  },
  nextVertex: {
    value: function() {
      var begin, end, max, next;
      next = this.addResvUint32(2, 1);
      max = this.getVertexCount();
      if (next >= max) {
        return this.setResvUint32(2, 0);
      }
      begin = next * 3;
      end = begin + 3;
      return this.vertices.subarray(begin, end);
    }
  }
});

Object.define(Object3.prototype, {
  vertexCount: {
    get: Object3.prototype.getVertexCount
  },
  vertices: {
    get: Object3.prototype.getVertices,
    set: Object3.prototype.setVertexArray
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
  draws: {
    get: Object3.prototype.getDraws
  },
  matrix: {
    get: Object3.prototype.getMatrix
  }
});

Object.symbol(Shader.prototype, {
  iterate: {
    value: function() {
      var ptri, shader;
      shader = this;
      ptri = 0.00;
      return {
        next: function() {
          if (!(ptri = shader.getNextChild(ptri))) {
            return {
              done: true,
              value: shader
            };
          }
          return {
            done: false,
            value: ptri
          };
        }
      };
    }
  }
});

Object.symbol(Mode.prototype, {
  iterate: {
    value: function() {
      var draw, ptri;
      draw = this;
      ptri = 0.00;
      return {
        next: function() {
          if (!(ptri = draw.getNextChild(ptri))) {
            return {
              done: true,
              value: draw
            };
          }
          return {
            done: false,
            value: ptri
          };
        }
      };
    }
  }
});

Object.symbol(Buffer.prototype, {
  iterate: {
    value: function() {
      var mode, ptri;
      mode = this;
      ptri = 0.00;
      return {
        next: function() {
          if (!(ptri = mode.getNextChild(ptri))) {
            return {
              done: true,
              value: mode
            };
          }
          return {
            done: false,
            value: ptri
          };
        }
      };
    }
  }
});

Object.symbol(Object3.prototype, {
  iterate: {
    value: function() {
      var obj3, ptri;
      obj3 = this;
      ptri = 0.00;
      return {
        next: function() {
          if (!(ptri = obj3.getNextChild(ptri))) {
            return {
              done: true,
              value: obj3
            };
          }
          return {
            done: false,
            value: ptri
          };
        }
      };
    }
  }
});

Object.hidden(Draw, "link", "array", "headers", "protoClass", "length", "children", "byteOffset", "byteLength");

Object.hidden(Object3, "array", "byteLength", "byteOffset", "headers", "length", "link", "protoClass");

Object.protos(Attribute).filter(function() {
  return Object.hasOwn(arguments[0].prototype, "getValue");
}).forEach(function() {
  var Key;
  return Object.define((Key = arguments[0]).prototype, {
    value: {
      get: Key.prototype.getValue,
      set: Key.prototype.setValue
    }
  });
});

Object.protos(Uniform).filter(function() {
  return Object.hasOwn(arguments[0].prototype, "getValue");
}).forEach(function() {
  var Key;
  return Object.define((Key = arguments[0]).prototype, {
    value: {
      get: Key.prototype.getValue,
      set: Key.prototype.setValue
    }
  });
});

export default GL;
