var BYTES_PER_VALUE, OFFSET_A, OFFSET_B, OFFSET_G, OFFSET_R, OFFSET_SX, OFFSET_SY, OFFSET_X, OFFSET_Y, OFFSET_Z, VALUES_PER_VERTEX;

import {
  Pointer,
  IndexPointer
} from "./Pointer.js";

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
  OFFSET_OBJECT_6
} from "./Pointer.js";

OFFSET_X = 4 * 0;

OFFSET_Y = 4 * 1;

OFFSET_Z = 4 * 2;

OFFSET_R = 4 * 3;

OFFSET_G = 4 * 4;

OFFSET_B = 4 * 5;

OFFSET_A = 4 * 6;

OFFSET_SX = 4 * 7;

OFFSET_SY = 4 * 8;

VALUES_PER_VERTEX = 9;

BYTES_PER_VALUE = 4;

export var Vertex = (function() {
  class Vertex extends IndexPointer {};

  Vertex.byteLength = 12;

  Vertex.TypedArray = Float32Array;

  Object.defineProperties(Vertex.prototype, {
    x: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_X);
      },
      set: function() {
        return this.setFloat32(OFFSET_X, arguments[0]);
      }
    },
    y: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_Y);
      },
      set: function() {
        return this.setFloat32(OFFSET_Y, arguments[0]);
      }
    },
    z: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_Z);
      },
      set: function() {
        return this.setFloat32(OFFSET_Z, arguments[0]);
      }
    }
  });

  return Vertex;

}).call(this);

export var Attribute = (function() {
  class Attribute extends Vertex {};

  Attribute.byteLength = VALUES_PER_VERTEX * BYTES_PER_VALUE;

  Object.defineProperties(Attribute.prototype, {
    r: {
      get: function() {
        return this.getFloat32(OFFSET_R);
      },
      set: function() {
        return this.setFloat32(OFFSET_R, arguments[0]);
      }
    },
    g: {
      get: function() {
        return this.getFloat32(OFFSET_G);
      },
      set: function() {
        return this.setFloat32(OFFSET_G, arguments[0]);
      }
    },
    b: {
      get: function() {
        return this.getFloat32(OFFSET_B);
      },
      set: function() {
        return this.setFloat32(OFFSET_B, arguments[0]);
      }
    },
    a: {
      get: function() {
        return this.getFloat32(OFFSET_A);
      },
      set: function() {
        return this.setFloat32(OFFSET_A, arguments[0]);
      }
    },
    sx: {
      get: function() {
        return this.getFloat32(OFFSET_SX);
      },
      set: function() {
        return this.setFloat32(OFFSET_SX, arguments[0]);
      }
    },
    sy: {
      get: function() {
        return this.getFloat32(OFFSET_SY);
      },
      set: function() {
        return this.setFloat32(OFFSET_SY, arguments[0]);
      }
    }
  });

  return Attribute;

}).call(this);

export var Vertices = (function() {
  class Vertices extends Pointer {
    static fromVertexCount(vertexCount, drawMode = WebGL2RenderingContext.POINTS) {
      var byteLength, ptr, valueCount;
      valueCount = vertexCount * VALUES_PER_VERTEX;
      byteLength = valueCount * BYTES_PER_VALUE;
      ptr = new Vertices(malloc(byteLength));
      ptr.drawMode = drawMode;
      ptr.drawLength = vertexCount;
      return ptr;
    }

    static fromRectCount(count) {
      return this.fromVertexCount * 6;
    }

    getVertex(index) {
      return Vertex.of(this).at(index);
    }

  };

  Object.defineProperties(Vertices.prototype, {
    needsUpload: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_0, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_0, arguments[0], LE);
      }
    },
    drawBegin: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_1, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_1, arguments[0], LE);
      }
    },
    drawOffset: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_2, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_2, arguments[0], LE);
      }
    },
    drawLength: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_3, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_3, arguments[0], LE);
      }
    },
    drawMode: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_4, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_4, arguments[0], LE);
      }
    },
    rotation: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_5, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_5, arguments[0], LE);
      }
    },
    position: {
      get: function() {
        return Vertex.maybePointer(OFFSET_OBJECT_6, this);
      },
      set: function() {
        return this.position.set(arguments[0]);
      }
    },
    VALUES_PER_VERTEX: {
      value: VALUES_PER_VERTEX
    },
    BYTES_PER_VALUE: {
      value: BYTES_PER_VALUE
    }
  });

  return Vertices;

}).call(this);

export default Vertex;
