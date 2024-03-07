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
  class Attribute extends IndexPointer {};

  Attribute.byteLength = 9 * Float32Array.BYTES_PER_ELEMENT;

  Attribute.TypedArray = Float32Array;

  Object.defineProperties(Attribute.prototype, {
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
    },
    r: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_R);
      },
      set: function() {
        return this.setFloat32(OFFSET_R, arguments[0]);
      }
    },
    g: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_G);
      },
      set: function() {
        return this.setFloat32(OFFSET_G, arguments[0]);
      }
    },
    b: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_B);
      },
      set: function() {
        return this.setFloat32(OFFSET_B, arguments[0]);
      }
    },
    a: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_A);
      },
      set: function() {
        return this.setFloat32(OFFSET_A, arguments[0]);
      }
    },
    sx: {
      enumerable: true,
      get: function() {
        return this.getFloat32(OFFSET_SX);
      },
      set: function() {
        return this.setFloat32(OFFSET_SX, arguments[0]);
      }
    },
    sy: {
      enumerable: true,
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

export var DrawBuffer = (function() {
  class DrawBuffer extends Pointer {
    malloc(modeBufferPtr) {
      var allocByteLength;
      ptr.attribBegin = this.attribCount;
      ptr.allocOffset = this.allocLength;
      allocByteLength = ptr.byteLength;
      ptr.attribCount = allocByteLength / this.BYTES_PER_ATTRIBUTE;
      ptr.typedOffset = ptr.allocOffset / this.BYTES_PER_ATTRIBUTE;
      ptr.typedLength = allocByteLength / this.BYTES_PER_ELEMENT;
      this.allocLength += allocByteLength;
      this.attribCount += ptr.attribCount;
      return ptr;
    }

  };

  DrawBuffer.byteLength = 3e7;

  DrawBuffer.prototype.COUNT_PER_ATTRIBUTE = 9;

  DrawBuffer.prototype.BYTES_PER_ATTRIBUTE = 9 * 4;

  Object.defineProperties(DrawBuffer.prototype, {
    //? total allocated bytes in one big draw buffer
    allocLength: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_3, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_3, arguments[0], LE);
      }
    }
  });

  return DrawBuffer;

}).call(this);

export var ModeBuffer = (function() {
  class ModeBuffer extends Pointer {
    malloc(ptr) {
      var allocByteLength;
      ptr.attribBegin = this.attribCount;
      ptr.allocOffset = this.allocLength;
      allocByteLength = ptr.byteLength;
      ptr.attribCount = allocByteLength / this.BYTES_PER_ATTRIBUTE;
      ptr.typedOffset = ptr.allocOffset / this.BYTES_PER_ATTRIBUTE;
      ptr.typedLength = allocByteLength / this.BYTES_PER_ELEMENT;
      this.allocLength += allocByteLength;
      this.attribCount += ptr.attribCount;
      return ptr;
    }

  };

  Object.defineProperties(ModeBuffer.prototype, {
    //? one big buffer's start point 
    //* TRIANGLES | POINTS | LINES
    drawMode: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_0, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_0, arguments[0], LE);
      }
    },
    //? one big buffer's start point 
    //* TRIANGLES = <--->
    //* POINTS    =      <--->
    //* LINES     =           <--->
    //?          -> N    2N   3N
    //# N = @byteLength / BYTES_PER_ATTRIBUTE
    attribFirst: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_1, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_1, arguments[0], LE);
      }
    },
    //? allocated attibutes total type length in mode
    //?                                 / 
    //?                     typed length per attibute 
    attribCount: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_2, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_2, arguments[0], LE);
      }
    },
    //? total allocated bytes in mode buffer
    allocLength: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_3, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_3, arguments[0], LE);
      }
    }
  });

  return ModeBuffer;

}).call(this);

export var Attributes = (function() {
  class Attributes extends Pointer {};

  Object.defineProperties(Attributes.prototype, {
    attribBegin: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_0, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_0, arguments[0], LE);
      }
    },
    attribCount: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_1, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_1, arguments[0], LE);
      }
    },
    allocOffset: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_2, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_2, arguments[0], LE);
      }
    },
    typedOffset: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_3, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_3, arguments[0], LE);
      }
    },
    typedLength: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_4, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_4, arguments[0], LE);
      }
    }
  });

  return Attributes;

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

    getVertex(i) {
      return Vertex.of(this).at(i);
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
    attrLength: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_1, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_1, arguments[0], LE);
      }
    },
    drawPointer: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_2, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_2, arguments[0], LE);
      }
    },
    drawMode: {
      get: function() {
        return keyOf(DATAVIEW.getUint32(this + OFFSET_OBJECT_3, LE));
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_3, arguments[0], LE);
      }
    },
    rotation: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_4, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_4, arguments[0], LE);
      }
    },
    position: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_5, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_5, arguments[0], LE);
      }
    },
    scale: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_OBJECT_6, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_OBJECT_6, arguments[0], LE);
      }
    }
  });

  return Vertices;

}).call(this);

export default Vertex;
