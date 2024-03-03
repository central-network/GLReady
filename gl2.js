var ATTRIB_BEGIN_LINES, ATTRIB_BEGIN_POINTS, ATTRIB_BEGIN_TRIANGLES, BUFFER, BYTES_PER_ELEMENT, BYTE_LINES, BYTE_POINTS, BYTE_TRIANGLES, COUNT_HEADERS, COUNT_LINES, COUNT_POINTS, COUNT_TRIANGLES, DRAW_ARRAY, DRAW_BUFFER, DRAW_COUNT, DRAW_FINISH, DRAW_LENGTH, FIRST_LINES, FIRST_POINTS, FIRST_TRIANGLES, HEADERS, HEADERS_INDEX, HEADERS_OFFSET, HEADER_ITEM_COUNT, INDEX_LINES, INDEX_POINTS, INDEX_TRIANGLES, ITEMS_PER_VERTEX, LENGTH_HEADERS, LINES, OFFSET_HEADERS, POINTS, STRIDE_HEADERS, TRIANGLES, UNUSED, VERTICES, a, b, dx, dy, dz, f32, g, i32, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33, m40, m41, m42, m43, r, rx, ry, rz, sab,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

Object.defineProperties(Math, {
  rad: {
    value: function(deg) {
      return deg * Math.PI / 180;
    }
  },
  deg: {
    value: function(rad) {
      return rad * 180 / Math.PI;
    }
  },
  powsum: {
    value: function(arr, pow = 2) {
      return [...arr].flat().reduce(function(a, b) {
        return a + Math.pow(b, pow);
      });
    }
  }
});

BYTES_PER_ELEMENT = 4;

HEADER_ITEM_COUNT = 40;

STRIDE_HEADERS = HEADER_ITEM_COUNT * BYTES_PER_ELEMENT;

ITEMS_PER_VERTEX = 7;

DRAW_LENGTH = 3e6 + 4;

BUFFER = new SharedArrayBuffer(1e8);

DRAW_COUNT = DRAW_LENGTH / 7;

HEADERS_OFFSET = DRAW_LENGTH * 6;

OFFSET_HEADERS = 160;

sab = new SharedArrayBuffer(1e8);

i32 = new Int32Array(sab);

f32 = new Float32Array(sab);

DRAW_ARRAY = f32.subarray(DRAW_LENGTH * 0, DRAW_LENGTH * 3);

TRIANGLES = f32.subarray(DRAW_LENGTH * 0, DRAW_LENGTH);

POINTS = f32.subarray(DRAW_LENGTH * 1, DRAW_LENGTH * 2);

LINES = f32.subarray(DRAW_LENGTH * 2, DRAW_LENGTH * 3);

VERTICES = f32.subarray(DRAW_LENGTH * 3, DRAW_LENGTH * 6);

HEADERS = i32.subarray(DRAW_LENGTH * 6, DRAW_LENGTH * 7);

self.objects = new Object();

export var Attribute = class Attribute extends Float32Array {};

export var Attributes = class Attributes extends Attribute {};

export var Pointer = (function() {
  class Pointer extends Number {
    put(index, value) {
      return this.base[this.begin + index] = value;
    }

    get(index) {
      return this.base[this.begin + index];
    }

    set(array) {
      this.array.set(array);
      return this;
    }

    * [Symbol.iterator]() {
      var i, j, ref, results;
      results = [];
      for (i = j = 0, ref = this.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        results.push((yield this.get(i)));
      }
      return results;
    }

  };

  Pointer.prototype.base = new Float32Array(BUFFER);

  Object.defineProperties(Pointer.prototype, {
    array: {
      get: function() {
        return this.base.subarray(this.begin, this.end);
      }
    },
    begin: {
      get: function() {
        return this.index + this.byteOffset / 4;
      }
    },
    end: {
      get: function() {
        return this.begin + this.length;
      }
    },
    index: {
      get: function() {
        return this / 4;
      }
    },
    length: {
      get: function() {
        return this.byteLength / 4;
      }
    }
  });

  return Pointer;

}).call(this);

export var AtomicPointer = (function() {
  class AtomicPointer extends Pointer {
    put(index, value) {
      return Atomics.store(this.base, this.begin + index, value);
    }

    get(index) {
      return Atomics.load(this.base, this.begin + index);
    }

    set(array) {
      var i, j, ref;
      for (i = j = 0, ref = this.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        this.put(i, array[i]);
      }
      return this;
    }

  };

  AtomicPointer.prototype.base = new Int32Array(BUFFER);

  return AtomicPointer;

}).call(this);

export var Headers = (function() {
  class Headers extends AtomicPointer {};

  Headers.prototype.byteOffset = 0;

  Headers.prototype.byteLength = 40 * 4;

  return Headers;

}).call(this);

export var Position = (function() {
  var index, j, key, len1, ref;

  class Position extends Pointer {};

  Position.prototype.byteOffset = 80;

  Position.prototype.byteLength = 12;

  ref = ["x", "y", "z"];
  for (index = j = 0, len1 = ref.length; j < len1; index = ++j) {
    key = ref[index];
    Object.defineProperty(Position.prototype, key, (function(i) {
      return {
        get: function() {
          return this.get(i);
        },
        set: function() {
          return this.put(i, arguments[0]);
        }
      };
    })(index));
  }

  return Position;

}).call(this);

export var Rotation = (function() {
  var index, j, key, len1, ref;

  class Rotation extends Pointer {};

  Rotation.prototype.byteOffset = 64;

  Rotation.prototype.byteLength = 12;

  ref = ["x", "y", "z"];
  for (index = j = 0, len1 = ref.length; j < len1; index = ++j) {
    key = ref[index];
    Object.defineProperty(Rotation.prototype, key, (function(i) {
      return {
        get: function() {
          return this.get(i);
        },
        set: function() {
          return this.put(i, arguments[0]);
        }
      };
    })(index));
  }

  return Rotation;

}).call(this);

export var Color = (function() {
  var index, j, key, len1, ref;

  class Color extends Pointer {
    set(value) {
      return super.set(Color.parse(value));
    }

    paint(vertex) {
      vertex.color.set(this.array);
      return vertex;
    }

    static parse(any) {
      var arr, i, k, len2, v;
      if (any instanceof this) {
        return any;
      }
      if ("function" === typeof any.fill) {
        arr = [1, 1, 1, 1];
        for (i = k = 0, len2 = any.length; k < len2; i = ++k) {
          v = any[i];
          arr[i] = v > 1 ? v / 255 : v;
        }
        return arr;
      }
      if ("function" === typeof any.trim) {
        if ("#" === any.at(0)) {
          return Color.parse(any.substring(1));
        }
        if ("x" === any.at(1)) {
          return Color.parse(any.substring(2));
          any = any.replace(/\W+/g, '');
        }
        if (any.length === 3) {
          return Color.parse(any.split("").map(function(i) {
            return i + i;
          }).join(""));
        }
        if (any.length <= 5) {
          return Color.parse(any.padStart(6, 0));
        }
        return any.padEnd(8, "ff").match(/.{1,2}/g).map(function(n) {
          return parseInt(n, 16) / 0xff;
        });
      }
    }

  };

  Color.prototype.byteOffset = 48;

  Color.prototype.byteLength = 16;

  ref = ["r", "g", "b", "a"];
  for (index = j = 0, len1 = ref.length; j < len1; index = ++j) {
    key = ref[index];
    Object.defineProperty(Color.prototype, key, (function(i) {
      return {
        get: function() {
          return this.get(i);
        },
        set: function() {
          return this.put(i, arguments[0]);
        }
      };
    })(index));
  }

  return Color;

}).call(this);

export var ColorAttribute = (function() {
  class ColorAttribute extends Color {};

  ColorAttribute.prototype.byteOffset = 12;

  return ColorAttribute;

}).call(this);

export var PositionAttribute = (function() {
  class PositionAttribute extends Position {};

  PositionAttribute.prototype.byteOffset = 0;

  return PositionAttribute;

}).call(this);

export var M4 = (function() {
  var Camera;

  class M4 extends Float32Array {
    static fromVec3(vec3) {
      return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ...vec3, 1]);
    }

    modifyVertex(vertex) {
      return vertex.position.set(M4.multiply(this, M4.prototype.translation(...vertex)).position);
    }

    multiply(b) {
      this.set(M4.multiply(this, b));
      return this;
    }

    static multiply(a, b) {
      var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33;
      a00 = a[0 * 4 + 0];
      a01 = a[0 * 4 + 1];
      a02 = a[0 * 4 + 2];
      a03 = a[0 * 4 + 3];
      a10 = a[1 * 4 + 0];
      a11 = a[1 * 4 + 1];
      a12 = a[1 * 4 + 2];
      a13 = a[1 * 4 + 3];
      a20 = a[2 * 4 + 0];
      a21 = a[2 * 4 + 1];
      a22 = a[2 * 4 + 2];
      a23 = a[2 * 4 + 3];
      a30 = a[3 * 4 + 0];
      a31 = a[3 * 4 + 1];
      a32 = a[3 * 4 + 2];
      a33 = a[3 * 4 + 3];
      b00 = b[0 * 4 + 0];
      b01 = b[0 * 4 + 1];
      b02 = b[0 * 4 + 2];
      b03 = b[0 * 4 + 3];
      b10 = b[1 * 4 + 0];
      b11 = b[1 * 4 + 1];
      b12 = b[1 * 4 + 2];
      b13 = b[1 * 4 + 3];
      b20 = b[2 * 4 + 0];
      b21 = b[2 * 4 + 1];
      b22 = b[2 * 4 + 2];
      b23 = b[2 * 4 + 3];
      b30 = b[3 * 4 + 0];
      b31 = b[3 * 4 + 1];
      b32 = b[3 * 4 + 2];
      b33 = b[3 * 4 + 3];
      return new M4([b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30, b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31, b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32, b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33, b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30, b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31, b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32, b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33, b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30, b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31, b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32, b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33, b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30, b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31, b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32, b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33]);
    }

    translation(tx = 0, ty = 0, tz = 0) {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
    }

    xTranslation(tx = 0) {
      return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, 0, 0, 1]);
    }

    yTranslation(ty = 0) {
      return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ty, 0, 1]);
    }

    zTranslation(tz = 0) {
      return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, tz, 1]);
    }

    xRotation(angleInRadians = 0) {
      var c, s;
      c = Math.cos(angleInRadians);
      s = Math.sin(angleInRadians);
      return new M4([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
    }

    yRotation(angleInRadians = 0) {
      var c, s;
      c = Math.cos(angleInRadians);
      s = Math.sin(angleInRadians);
      return new M4([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
    }

    zRotation(angleInRadians = 0) {
      var c, s;
      c = Math.cos(angleInRadians);
      s = Math.sin(angleInRadians);
      return new M4([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    scaling(sx, sy, sz) {
      if (sz == null) {
        sz = (sy != null ? sy : sy = (sx != null ? sx : sx = 1));
      }
      return new M4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
    }

    translate(tx, ty, tz) {
      return this.multiply(this.translation(tx, ty, tz));
    }

    rotate(rx, ry, rz) {
      return this.xRotate(rx).yRotate(ry).zRotate(rz);
    }

    scale(sx, sy, sz) {
      return this.multiply(this.scaling(sx, sy, sz));
    }

    xRotate(rx) {
      return this.multiply(this.xRotation(rx));
    }

    yRotate(ry) {
      return this.multiply(this.yRotation(ry));
    }

    zRotate(rz) {
      return this.multiply(this.zRotation(rz));
    }

    xTranslate(tx) {
      return this.multiply(this.xTranslation(tx));
    }

    yTranslate(ty) {
      return this.multiply(this.yTranslation(ty));
    }

    zTranslate(tz) {
      return this.multiply(this.zTranslation(tz));
    }

  };

  //? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
  Object.defineProperty(M4, "identity", {
    get: function() {
      return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
  });

  Object.defineProperty(M4.prototype, "position", {
    get: function() {
      return this.subarray(12, 15);
    }
  });

  M4.Camera = Camera = class Camera extends M4 {
    constructor(yFov, rAspect, zNear, zFar) {
      var f, rangeInv;
      f = Math.tan(Math.PI / 2 - yFov / 2);
      rangeInv = 1.0 / (zNear - zFar);
      super([f / rAspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (zNear + zFar) * rangeInv, -1, 0, 0, (zNear * zFar) * rangeInv * 2, 0]);
    }

  };

  return M4;

}).call(this);

export var Vertex = (function() {
  var index, key;

  class Vertex extends Pointer {
    applyMatrix(mat4) {
      return mat4.modifyVertex([...this.position]);
    }

    isNeighbour(vertex) {
      return Vertex.isNeighbours(this, vertex);
    }

    isSame(vertex) {
      return 0 === this - vertex;
    }

    getNeighbours(vertices) {
      return vertices.filter(this.isNeighbour.bind(this));
    }

    static isNeighbours(p0, p1) {
      var a, b, c, dx, dy, dz, x, y, z;
      [a, b, c] = p0;
      [x, y, z] = p1;
      dx = x - a;
      dy = y - b;
      dz = z - c;
      if (dx && !dy && !dz) {
        return dx;
      }
      if (!dx && dy && !dz) {
        return dy;
      }
      if (!dx && !dy && dz) {
        return dz;
      }
    }

    static vec3length() {
      return Math.sqrt(Math.powsum(this.position));
    }

    static distance2d(p0, p1) {
      var a, b, c, dx, dy, dz, x, y, z;
      [a, b, c] = p0;
      [x, y, z] = p1;
      dx = Math.abs(a - x);
      dy = Math.abs(b - y);
      dz = Math.abs(c - z);
      if (!dx && !dy && !dz) {
        return 0;
      }
      if (dx && !dy && !dz) {
        return dx;
      }
      if (dy && !dz && !dx) {
        return dy;
      }
      if (dz && !dx && !dy) {
        return dz;
      }
      throw ["POINTS_ARE_NOT_IN_SAME_PLANE", p0, p1];
    }

    overlaps3d(vertex) {
      return Vertex.overlaps3d(this, vertex);
    }

    static overlaps3d(p0, p1) {
      if (p0.get(0) - p1.get(0)) {
        return false;
      }
      if (p0.get(1) - p1.get(1)) {
        return false;
      }
      if (p0.get(2) - p1.get(2)) {
        return false;
      }
      return true;
    }

    nearest(vertices) {
      var dist, distance, j, len1, nearest, vertex;
      distance = +2e308;
      nearest = null;
      for (j = 0, len1 = vertices.length; j < len1; j++) {
        vertex = vertices[j];
        if (!(dist = Vertex.distance2d(this, vertex))) {
          continue;
        }
        if (distance < dist) {
          continue;
        }
        distance = dist;
        nearest = vertex;
      }
      return nearest;
    }

  };

  Vertex.prototype.byteLength = 7 * 4;

  false && (function() {
    var j, len1, ref, results;
    ref = ["x", "y", "z"];
    results = [];
    for (index = j = 0, len1 = ref.length; j < len1; index = ++j) {
      key = ref[index];
      results.push(Object.defineProperty(Vertex.prototype, key, (function(i) {
        return {
          get: function() {
            return this.get(i);
          },
          set: function() {
            return this.put(i, arguments[0]);
          }
        };
      })(index)));
    }
    return results;
  }).call(this);

  false && (function() {
    var j, len1, ref, results;
    ref = ["r", "g", "b", "a"];
    results = [];
    for (index = j = 0, len1 = ref.length; j < len1; index = ++j) {
      key = ref[index];
      results.push(Object.defineProperty(Vertex.prototype, key, (function(i) {
        return {
          get: function() {
            return this.get(i);
          },
          set: function() {
            return this.put(i, arguments[0]);
          }
        };
      })(index)));
    }
    return results;
  }).call(this);

  Object.defineProperties(Vertex.prototype, {
    color: {
      get: function() {
        return new ColorAttribute(this);
      },
      set: function() {
        return this.color.set(arguments[0]);
      }
    },
    position: {
      get: function() {
        return new PositionAttribute(this);
      },
      set: function() {
        return this.position.set(arguments[0]);
      }
    }
  });

  Object.defineProperties(Vertex.prototype, {
    index: {
      get: function() {
        return this.byteOffset % DRAW_COUNT / this.byteLength;
      }
    },
    begin: {
      get: function() {
        return this.byteOffset / 4;
      }
    },
    byteOffset: {
      get: function() {
        return this * 1;
      }
    },
    parent: {
      get: function() {
        var byteOffset, j, len1, object, ref;
        object = null;
        ref = Object.keys(objects);
        for (j = 0, len1 = ref.length; j < len1; j++) {
          byteOffset = ref[j];
          if (byteOffset > this.byteOffset) {
            //? mesh = objects[ ptr_heaaders ] 
            return objects[object];
          }
          
          //? headers = objects[ ptr_mesh ]
          object = objects[byteOffset];
        }
        return null;
      }
    }
  });

  return Vertex;

}).call(this);

DRAW_BUFFER = new Float32Array(BUFFER, 0, DRAW_LENGTH * 3);

DRAW_FINISH = DRAW_BUFFER.byteOffset + DRAW_BUFFER.byteLength;

FIRST_TRIANGLES = 0;

INDEX_TRIANGLES = 0;

BYTE_TRIANGLES = 0;

FIRST_POINTS = DRAW_COUNT;

INDEX_POINTS = DRAW_LENGTH;

BYTE_POINTS = INDEX_POINTS * 4;

FIRST_LINES = DRAW_COUNT * 2;

INDEX_LINES = DRAW_LENGTH * 2;

BYTE_LINES = INDEX_LINES * 4;

console.log({
  DRAW_COUNT: DRAW_COUNT
});

console.log({
  FIRST_TRIANGLES: FIRST_TRIANGLES,
  ATTRIB_BEGIN_TRIANGLES: ATTRIB_BEGIN_TRIANGLES
});

console.log({
  FIRST_POINTS: FIRST_POINTS,
  ATTRIB_BEGIN_POINTS: ATTRIB_BEGIN_POINTS
});

console.log({
  FIRST_LINES: FIRST_LINES,
  ATTRIB_BEGIN_LINES: ATTRIB_BEGIN_LINES
});

COUNT_TRIANGLES = 0;

COUNT_POINTS = 0;

COUNT_LINES = 0;

HEADERS_OFFSET = DRAW_FINISH;

HEADERS_INDEX = DRAW_FINISH / 4;

HEADERS = new Int32Array(BUFFER, HEADERS_OFFSET, 1e6);

console.warn({
  0: "drawOffset",
  1: "realOffset"
});

Object.defineProperties(HEADERS, {
  BYTES_PER_HEADER: {
    value: 40 * 4
  },
  ELEMENTS_PER_ATTRIBUTE: {
    value: 7
  },
  BYTES_PER_ATTRIBUTE: {
    value: 7 * 4
  },
  indexOfHeadersByteOffset: {
    value: 0
  },
  indexOfByteOffset: {
    value: 1
  },
  indexOfElementsBegin: {
    value: 2
  },
  indexOfAttributesBegin: {
    value: 3
  },
  glIndexOfTrianglesByteOffset: {
    value: 4
  },
  glIndexOfTrianglesElementsBegin: {
    value: 5
  },
  glIndexOfTrianglesAttributesBegin: {
    value: 6
  },
  glIndexOfPointsByteOffset: {
    value: 7
  },
  glIndexOfPointsElementsBegin: {
    value: 8
  },
  glIndexOfPointsAttributesBegin: {
    value: 9
  },
  glIndexOfLinesByteOffset: {
    value: 10
  },
  glIndexOfLinesElementsBegin: {
    value: 11
  },
  glIndexOfLinesAttributesBegin: {
    value: 12
  },
  malloc: {
    value: function(drawAs, count) {
      var attributesBegin, attributesLength, byteLength, byteOffset, elementsBegin, elementsLength, glAttributesBegin, glByteOffset, glElementsBegin, headersBegin, headersOffset;
      headersOffset = Atomics.add(this, this.indexOfHeadersByteOffset, this.BYTES_PER_HEADER);
      headersBegin = headersOffset / this.BYTES_PER_ELEMENT;
      Atomics.store(this, headersBegin + 0, count);
      Atomics.store(this, headersBegin + 1, drawAs);
      byteLength = count * this.BYTES_PER_ATTRIBUTE;
      elementsLength = byteLength / this.BYTES_PER_ELEMENT;
      attributesLength = count;
      Atomics.store(this, headersBegin + 2, byteLength);
      Atomics.store(this, headersBegin + 3, elementsLength);
      Atomics.store(this, headersBegin + 4, attributesLength);
      if (!(drawAs - WebGL2RenderingContext.TRIANGLES)) {
        glByteOffset = Atomics.add(this, this.glIndexOfTrianglesByteOffset, byteLength);
        glElementsBegin = Atomics.add(this, this.glIndexOfTrianglesElementsBegin, elementsLength);
        glAttributesBegin = Atomics.add(this, this.glIndexOfTrianglesAttributesBegin, attributesLength);
      }
      if (!(drawAs - WebGL2RenderingContext.POINTS)) {
        glByteOffset = Atomics.add(this, this.glIndexOfPointsByteOffset, byteLength);
        glElementsBegin = Atomics.add(this, this.glIndexOfPointsElementsBegin, elementsLength);
        glAttributesBegin = Atomics.add(this, this.glIndexOfPointsAttributesBegin, attributesLength);
      }
      if (!(drawAs - WebGL2RenderingContext.LINES)) {
        glByteOffset = Atomics.add(this, this.glIndexOfLinesByteOffset, byteLength);
        glElementsBegin = Atomics.add(this, this.glIndexOfLinesElementsBegin, byteLength / this.BYTES_PER_ELEMENT);
        glAttributesBegin = Atomics.add(this, this.glIndexOfLinesAttributesBegin, attributesLength);
      }
      Atomics.store(this, headersBegin + 5, glByteOffset);
      Atomics.store(this, headersBegin + 6, glElementsBegin);
      Atomics.store(this, headersBegin + 7, glAttributesBegin);
      byteOffset = Atomics.add(this, this.indexOfByteOffset, byteLength);
      elementsBegin = Atomics.add(this, this.indexOfElementsBegin, byteLength / this.BYTES_PER_ELEMENT);
      attributesBegin = Atomics.add(this, this.indexOfAttributesBegin, attributesLength);
      console.group(drawAs);
      console.warn({drawAs, byteLength, elementsLength, attributesLength});
      console.table([
        {
          byte: glByteOffset,
          elements: glElementsBegin,
          attribs: glAttributesBegin
        },
        {
          byte: byteOffset,
          elements: elementsBegin,
          attribs: attributesBegin
        }
      ]);
      console.groupEnd();
      return headersOffset;
    }
  },
  get: {
    value: function(byteOffset, byteLength = this.BYTES_PER_HEADER) {
      var begin, length;
      begin = byteOffset / this.BYTES_PER_ELEMENT;
      length = byteLength / this.BYTES_PER_ELEMENT;
      return this.subarray(begin, begin + length);
    }
  }
});

ATTRIB_BEGIN_TRIANGLES = TRIANGLES.byteOffset / TRIANGLES.BYTES_PER_ELEMENT / ITEMS_PER_VERTEX;

ATTRIB_BEGIN_POINTS = POINTS.byteOffset / POINTS.BYTES_PER_ELEMENT / ITEMS_PER_VERTEX;

ATTRIB_BEGIN_LINES = LINES.byteOffset / LINES.BYTES_PER_ELEMENT / ITEMS_PER_VERTEX;

Atomics.store(HEADERS, HEADERS.indexOfHeadersByteOffset, OFFSET_HEADERS);

Atomics.store(HEADERS, HEADERS.indexOfByteOffset, VERTICES.byteOffset);

Atomics.store(HEADERS, HEADERS.indexOfElementsBegin, VERTICES.byteOffset / VERTICES.BYTES_PER_ELEMENT);

Atomics.store(HEADERS, HEADERS.indexOfAttributesBegin, VERTICES.byteOffset / VERTICES.BYTES_PER_ELEMENT / ITEMS_PER_VERTEX);

Atomics.store(HEADERS, HEADERS.glIndexOfTrianglesByteOffset, TRIANGLES.byteOffset);

Atomics.store(HEADERS, HEADERS.glIndexOfTrianglesElementsBegin, TRIANGLES.byteOffset / TRIANGLES.BYTES_PER_ELEMENT);

Atomics.store(HEADERS, HEADERS.glIndexOfTrianglesAttributesBegin, TRIANGLES.byteOffset / TRIANGLES.BYTES_PER_ELEMENT / ITEMS_PER_VERTEX);

Atomics.store(HEADERS, HEADERS.glIndexOfPointsByteOffset, POINTS.byteOffset);

Atomics.store(HEADERS, HEADERS.glIndexOfPointsElementsBegin, POINTS.byteOffset / POINTS.BYTES_PER_ELEMENT);

Atomics.store(HEADERS, HEADERS.glIndexOfPointsAttributesBegin, POINTS.byteOffset / POINTS.BYTES_PER_ELEMENT / ITEMS_PER_VERTEX);

Atomics.store(HEADERS, HEADERS.glIndexOfLinesByteOffset, LINES.byteOffset);

Atomics.store(HEADERS, HEADERS.glIndexOfLinesElementsBegin, LINES.byteOffset / LINES.BYTES_PER_ELEMENT);

Atomics.store(HEADERS, HEADERS.glIndexOfLinesAttributesBegin, LINES.byteOffset / LINES.BYTES_PER_ELEMENT / ITEMS_PER_VERTEX);

COUNT_HEADERS = 0;

LENGTH_HEADERS = 0;

r = g = b = a = rx = ry = rz = dx = dy = dz = UNUSED = 0;

[m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33, m40, m41, m42, m43] = M4.identity;

export var Mesh = (function() {
  class Mesh extends Number {
    vertex(i) {
      var begin;
      begin = this.begin + ITEMS_PER_VERTEX * i;
      return new Vertex(begin * 4);
    }

    paint() {
      this.vertices.forEach(this.color.paint.bind(this.color));
      return this.needsUpload = 1;
    }

    apply(mat4) {
      if (mat4 == null) {
        mat4 = M4.identity.rotate(...this.rotation).translate(...this.position);
      }
      this.vertices.forEach(mat4.modifyVertex.bind(mat4));
      this.needsUpload = 1;
      return this;
    }

    neighs(vertex) {
      return this.vertices.filter(vertex.isNeighbour.bind(vertex));
    }

    getEdgeVertices() {
      return this.filters.edgeVertexPairs;
    }

  };

  Object.defineProperties(Mesh.prototype, {
    drawAs: {
      get: function() {
        return GL2.prototype[this.headers.get(7)];
      },
      set: function() {
        return this.headers.put(7, arguments[0]);
      }
    },
    byteOffset: {
      get: function() {
        return this.headers.get(0);
      },
      set: function() {
        return this.headers.put(0, arguments[0]);
      }
    },
    byteLength: {
      get: function() {
        return this.headers.get(1);
      },
      set: function() {
        return this.headers.put(1, arguments[0]);
      }
    },
    count: {
      get: function() {
        return this.headers.get(2);
      },
      set: function() {
        return this.headers.put(2, arguments[0]);
      }
    },
    length: {
      get: function() {
        return this.headers.get(3);
      },
      set: function() {
        return this.headers.put(3, arguments[0]);
      }
    },
    begin: {
      get: function() {
        return this.headers.get(4);
      },
      set: function() {
        return this.headers.put(4, arguments[0]);
      }
    },
    end: {
      get: function() {
        return this.headers.get(5);
      },
      set: function() {
        return this.headers.put(5, arguments[0]);
      }
    },
    //hIndex          :
    //    get : -> @headers.get 6
    //    set : -> @headers.put 6, arguments[0]
    enabled: {
      get: function() {
        return this.headers.get(8);
      },
      set: function() {
        return this.headers.put(8, arguments[0]);
      }
    },
    needsUpload: {
      get: function() {
        return this.headers.get(9);
      },
      set: function() {
        return this.headers.put(9, arguments[0]);
      }
    },
    attributes: {
      get: function() {
        return new Attributes(BUFFER, this.byteOffset, this.length);
      },
      set: function() {
        return this.attributes.set(arguments[0]);
      }
    },
    color: {
      get: function() {
        return new Color(this);
      },
      set: function() {
        this.color.set(arguments[0]);
        return this.paint();
      }
    },
    headers: {
      get: function() {
        return new Headers(this);
      },
      set: function() {
        this.headers.set(arguments[0]);
        return this.apply();
      }
    },
    rotation: {
      get: function() {
        return new Rotation(this);
      },
      set: function() {
        this.rotation.set(arguments[0]);
        return this.apply();
      }
    },
    position: {
      get: function() {
        return new Position(this);
      },
      set: function() {
        this.position.set(arguments[0]);
        return this.apply();
      }
    },
    matrix: {
      get: function() {
        return new M4(BUFFER, this + 96, 16);
      },
      set: function() {
        this.matrix.set(arguments[0]);
        return this.apply();
      }
    },
    vertices: {
      get: function() {
        var i, j, ref, results;
        results = [];
        for (i = j = 0, ref = this.count; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          results.push(this.vertex(i));
        }
        return results;
      }
    },
    filters: {
      get: function() {
        return new VertexFilters(this);
      }
    },
    [Symbol("(dump)")]: {
      get: function() {
        return {byteOffset: this.byteOffset, byteLength: this.byteLength, count: this.count, length: this.length, begin: this.begin, end: this.end, id: this.id, drawAs: this.drawAs, enabled: this.enabled, needsUpload: this.needsUpload, color: this.color, rotation: this.rotation, position: this.position, matrix: this.matrix};
      }
    },
    [Symbol.iterator]: {
      value: function*() {
        var i, j, ref, results;
        results = [];
        for (i = j = 0, ref = this.count; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          results.push((yield this.vertex(i)));
        }
        return results;
      }
    }
  });

  return Mesh;

}).call(this);

export var VertexFilters = (function() {
  class VertexFilters {
    constructor(ptr) {
      Object.defineProperty(this, this.ptr, {
        value: ptr
      });
    }

  };

  VertexFilters.prototype.ptr = String.fromCharCode(8710); //? "∆"

  Object.defineProperties(VertexFilters.prototype, {
    vertices: {
      get: function(ƒvertex = this[this.ptr].vertex.bind(this[this.ptr])) {
        var i, j, ref, results;
        results = [];
        for (i = j = 0, ref = this[this.ptr].count; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          results.push(ƒvertex(i));
        }
        return results;
      }
    },
    cornerVertices: {
      get: function(_ = []) {
        return this.vertices.filter(function(vertex) {
          if (!_.some(vertex.overlaps3d.bind(vertex))) {
            return _[_.length] = vertex;
          }
        });
      }
    },
    edgeVertexPairs: {
      get: function(_ = []) {
        var corners, j, k, len1, len2, neighv, ref, ref1, vertex;
        ref = corners = this.cornerVertices;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          vertex = ref[j];
          ref1 = vertex.getNeighbours(corners);
          for (k = 0, len2 = ref1.length; k < len2; k++) {
            neighv = ref1[k];
            if (_.includes([neighv, vertex])) {
              continue;
            }
            _.push([vertex, neighv]);
          }
        }
        return _;
      }
    }
  });

  return VertexFilters;

}).call(this);

export var GL2 = (function() {
  class GL2 extends EventTarget {
    static corners(shape) {
      return Float32Array.from(shape.filters.cornerVertices.map(function(p) {
        return [...p.position];
      }).flat());
    }

    static edges(shape) {
      return Float32Array.from(shape.filters.edgeVertexPairs.map(function([p0, p1]) {
        return [...p0.position, ...p1.position];
      }).flat());
    }

    // @arguments pariedLineVertices = []
    drawLines() {
      var count, headersOffset, vertices;
      vertices = [...arguments].flat();
      count = vertices.length;
      headersOffset = HEADERS.malloc(this.gl.LINES, count);
      console.log(2, new Headers(headersOffset));
      return vertices;
    }

    constructor(canvas) {
      var ref;
      Object.defineProperties((ref = super(), this.render = this.render.bind(this), ref), {
        gl: {
          value: canvas.getContext("webgl2")
        },
        canvas: {
          value: canvas
        },
        onceQueue: {
          value: new Array
        },
        renderQueue: {
          value: new Array
        },
        preProcess: {
          value: new Array
        },
        postProcess: {
          value: new Array
        },
        boundingRect: {
          get: function() {
            return canvas.getBoundingClientRect();
          }
        },
        rAspect: {
          get: function() {
            return this.width / this.height;
          }
        },
        rPixel: {
          get: function() {
            return (typeof window !== "undefined" && window !== null ? window.devicePixelRatio : void 0) || 1;
          }
        }
      });
      Object.defineProperties(this, {
        width: {
          get: function() {
            return this.boundingRect.width;
          }
        },
        height: {
          get: function() {
            return this.boundingRect.height;
          }
        },
        depth: {
          get: function() {
            return this.boundingRect.width / 2;
          }
        },
        left: {
          get: function() {
            return this.boundingRect.x;
          }
        },
        top: {
          get: function() {
            return this.boundingRect.y;
          }
        }
      });
      Object.defineProperties(this, {
        vFactor: {
          value: this.width / Math.PI
        },
        hFactor: {
          value: this.height / Math.PI
        },
        zFactor: {
          value: 400
        },
        deltaY: {
          set: function(dz) {
            return this.pointerZ = dz * this.zFactor;
          }
        },
        offsetX: {
          set: function(dx) {
            return this.pointerX = dx * this.rPixel;
          }
        },
        offsetY: {
          set: function(dy) {
            return this.pointerY = dy * this.rPixel;
          }
        }
      });
      Object.defineProperties(this, {
        dxCamera: {
          get: this.get_dxCamera,
          set: this.set_dxCamera
        },
        dyCamera: {
          get: this.get_dyCamera,
          set: this.set_dyCamera
        },
        dzCamera: {
          get: this.get_dzCamera,
          set: this.set_dzCamera
        },
        rxCamera: {
          get: this.get_rxCamera,
          set: this.set_rxCamera
        },
        ryCamera: {
          get: this.get_ryCamera,
          set: this.set_ryCamera
        },
        rzCamera: {
          get: this.get_rzCamera,
          set: this.set_rzCamera
        },
        sxCamera: {
          get: this.get_sxCamera,
          set: this.set_sxCamera
        },
        syCamera: {
          get: this.get_syCamera,
          set: this.set_syCamera
        },
        szCamera: {
          get: this.get_szCamera,
          set: this.set_szCamera
        }
      });
      Object.assign(this.canvas, {
        width: this.width * this.rPixel,
        height: this.height * this.rPixel,
        style: "background: rgb(15, 17, 26)"
      });
      Object.defineProperties(this, {
        buffer: {
          value: this.gl.createBuffer()
        },
        program: {
          value: this.gl.createProgram()
        },
        vertexShader: {
          value: this.gl.createShader(this.gl.VERTEX_SHADER)
        },
        fragmentShader: {
          value: this.gl.createShader(this.gl.FRAGMENT_SHADER)
        }
      });
      Object.defineProperties(this, {
        clearColor: {
          value: new Float32Array([15 / 0xff, 17 / 0xff, 26 / 0xff, 1])
        },
        camera: {
          value: new M4.Camera(this.yFov, this.rAspect, this.zNear, this.zFar)
        },
        clearMask: {
          value: this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT
        },
        pointSize: {
          get: function() {
            return this.gl.getUniform(this.program, this.u_PointSize);
          },
          set: function() {
            return this.gl.uniform1f(this.u_PointSize, arguments[0]);
          }
        }
      });
      this.gl.shaderSource(this.vertexShader, this.vertexShaderSource);
      this.gl.compileShader(this.vertexShader);
      this.gl.attachShader(this.program, this.vertexShader);
      this.gl.shaderSource(this.fragmentShader, this.fragmentShaderSource);
      this.gl.compileShader(this.fragmentShader);
      this.gl.attachShader(this.program, this.fragmentShader);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.DST_COLOR);
      this.gl.blendEquation(this.gl.FUNC_ADD);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      this.gl.depthMask(false);
      this.gl.clearDepth(1);
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      this.gl.frontFace(this.gl.CCW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, DRAW_BUFFER, this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.a_Vertex, 3, this.gl.FLOAT, false, 28, 0);
      this.gl.vertexAttribPointer(this.a_Color, 4, this.gl.FLOAT, false, 28, 12);
      this.gl.enableVertexAttribArray(this.a_Vertex);
      this.gl.enableVertexAttribArray(this.a_Color);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.gl.linkProgram(this.program);
      this.gl.useProgram(this.program);
      Object.defineProperties(this, {
        a_Vertex: {
          value: this.gl.getAttribLocation(this.program, "a_Vertex")
        },
        a_Color: {
          value: this.gl.getAttribLocation(this.program, "a_Color")
        },
        u_Camera: {
          value: this.gl.getUniformLocation(this.program, "u_Camera")
        },
        u_PointSize: {
          value: this.gl.getUniformLocation(this.program, "u_PointSize")
        },
        u_FudgeFactor: {
          value: this.gl.getUniformLocation(this.program, "u_FudgeFactor")
        }
      });
      this.dxCamera = 0;
      this.dyCamera = 0;
      this.dzCamera = -360;
      this.rxCamera = Math.rad(180);
      this.ryCamera = Math.rad(0);
      this.rzCamera = Math.rad(0);
      this.sxCamera = 1;
      this.syCamera = 1;
      this.szCamera = 1;
      this.bindEvents();
    }

    dump() {
      return console.warn({
        scene: this.scene,
        this: this
      });
    }

    upload(ptr) {
      if (!ptr) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, DRAW_BUFFER, this.gl.STATIC_DRAW);
      } else {
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, ptr.byteOffset, DRAW_BUFFER, ptr.begin, ptr.length);
      }
      this.gl.vertexAttribPointer(this.a_Vertex, 3, this.gl.FLOAT, false, 28, 0);
      this.gl.vertexAttribPointer(this.a_Color, 4, this.gl.FLOAT, false, 28, 12);
      this.gl.enableVertexAttribArray(this.a_Vertex);
      return this.gl.enableVertexAttribArray(this.a_Color);
    }

    malloc(count, drawAs = this.TRIANGLES) {
      var begin, byteLength, byteOffset, enabled, end, headers, headersOffset, length, mesh, needsUpload;
      if (drawAs === this.TRIANGLES) {
        begin = INDEX_TRIANGLES;
        length = ITEMS_PER_VERTEX * count;
        byteOffset = BYTE_TRIANGLES;
        byteLength = BYTES_PER_ELEMENT * length;
        INDEX_TRIANGLES += length;
        COUNT_TRIANGLES += count;
        BYTE_TRIANGLES += byteLength;
      } else if (drawAs === this.POINTS) {
        begin = INDEX_POINTS;
        length = ITEMS_PER_VERTEX * count;
        byteOffset = BYTE_POINTS;
        byteLength = BYTES_PER_ELEMENT * length;
        INDEX_POINTS += length;
        COUNT_POINTS += count;
        BYTE_POINTS += byteLength;
      } else if (drawAs === this.LINES) {
        begin = INDEX_LINES;
        length = ITEMS_PER_VERTEX * count;
        byteOffset = BYTE_LINES;
        byteLength = BYTES_PER_ELEMENT * length;
        INDEX_LINES += length;
        COUNT_LINES += count;
        BYTE_LINES += byteLength;
      } else {
        throw ["UNDEFINED_DRAW_METHOD:", drawAs];
      }
      headersOffset = HEADERS.malloc(drawAs, count);
      headers = HEADERS.get(headersOffset);
      headers.set([byteOffset, byteLength, count, length, begin, end = begin + length, UNUSED, drawAs, enabled = 1, needsUpload = 1, UNUSED, UNUSED, r, g, b, a, rx, ry, rz, UNUSED, dx, dy, dz, UNUSED]);
      mesh = new Mesh(headers.byteOffset);
      mesh.matrix.set(M4.identity);
      objects[mesh.byteOffset] = headers;
      return objects[headers.byteOffset] = mesh;
    }

    render(t) {
      var j, job, k, l, len, len1, len2, len3, object, offset, ref, ref1, ref2;
      boundMethodCheck(this, GL2);
      if (this.rendering) {
        if (len = this.onceQueue.length) {
          ref = this.onceQueue.splice(0, len);
          for (j = 0, len1 = ref.length; j < len1; j++) {
            job = ref[j];
            job.call(this);
          }
        }
        ref1 = this.renderQueue.slice(0);
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          job = ref1[k];
          job.call(this, t);
        }
        for (offset in objects) {
          object = objects[offset];
          if (!object.needsUpload) {
            continue;
          }
          this.upload(object);
          object.needsUpload = 0;
        }
        this.gl.drawArrays(this.gl.TRIANGLES, FIRST_TRIANGLES, COUNT_TRIANGLES);
        this.gl.drawArrays(this.gl.POINTS, FIRST_POINTS, COUNT_POINTS);
        this.gl.drawArrays(this.gl.LINES, FIRST_LINES, COUNT_LINES);
        ref2 = this.postProcess.slice(0);
        for (l = 0, len3 = ref2.length; l < len3; l++) {
          job = ref2[l];
          job.call(this, t);
        }
        ++this.scene[0];
      }
      return requestAnimationFrame(this.render);
    }

    bindEvents() {
      addEventListener("visibilitychange", () => {
        return this.rendering = document.visibilityState === "visible";
      });
      addEventListener("pagehide", (e) => {
        return console.warn("onunload: quit-nonblock:", e);
      });
      return addEventListener("pageshow", (e) => {
        return e.persisted && console.warn("backtab:", e);
      });
    }

    uploadCamera() {
      return this.onceQueue.push(function() {
        return this.gl.uniformMatrix4fv(this.u_Camera, false, this.camera.slice().translate(this.dxCamera, this.dyCamera, this.dzCamera).rotate(this.rxCamera, this.ryCamera, this.rzCamera).scale(this.sxCamera, this.syCamera, this.szCamera));
      });
    }

    queue(fn) {
      return this.renderQueue.push(fn) - 1;
    }

    get_dxCamera() {
      return this.scene.at(this.INDEX_CAMERA + 0);
    }

    set_dxCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 0] = arguments[0]);
    }

    get_dyCamera() {
      return this.scene.at(this.INDEX_CAMERA + 1);
    }

    set_dyCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 1] = arguments[0]);
    }

    get_dzCamera() {
      return this.scene.at(this.INDEX_CAMERA + 2);
    }

    set_dzCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 2] = arguments[0]);
    }

    get_rxCamera() {
      return this.scene.at(this.INDEX_CAMERA + 3);
    }

    set_rxCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 3] = arguments[0]);
    }

    get_ryCamera() {
      return this.scene.at(this.INDEX_CAMERA + 4);
    }

    set_ryCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 4] = arguments[0]);
    }

    get_rzCamera() {
      return this.scene.at(this.INDEX_CAMERA + 5);
    }

    set_rzCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 5] = arguments[0]);
    }

    get_sxCamera() {
      return this.scene.at(this.INDEX_CAMERA + 6);
    }

    set_sxCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 6] = arguments[0]);
    }

    get_syCamera() {
      return this.scene.at(this.INDEX_CAMERA + 7);
    }

    set_syCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 7] = arguments[0]);
    }

    get_szCamera() {
      return this.scene.at(this.INDEX_CAMERA + 8);
    }

    set_szCamera() {
      return this.uploadCamera(this.scene[this.INDEX_CAMERA + 8] = arguments[0]);
    }

  };

  GL2.prototype.vertexShaderSource = 'attribute vec4     a_Vertex; attribute vec4     a_Color; uniform   float    u_PointSize; uniform   mat4     u_Camera; varying   vec4     v_Color; void main() { gl_Position  =  u_Camera * a_Vertex; gl_PointSize =  u_PointSize; v_Color      =  a_Color; }';

  GL2.prototype.fragmentShaderSource = 'precision highp    float; varying   vec4     v_Color; void main() { gl_FragColor = v_Color; }';

  GL2.BYTES_PER_HEADER = 4 * 40;

  GL2.prototype.BYTES_PER_HEADER = GL2.prototype.BYTES_PER_HEADER;

  GL2.prototype.scene = new Float32Array(256);

  GL2.prototype.count = 0;

  GL2.prototype.rendering = true;

  GL2.prototype.yFov = Math.rad(90);

  GL2.prototype.zNear = 0.01;

  GL2.prototype.zFar = 1000;

  GL2.prototype.TRIANGLES = new (TRIANGLES = class TRIANGLES extends Number {})(WebGL2RenderingContext.prototype.TRIANGLES);

  GL2.prototype.POINTS = new (POINTS = class POINTS extends Number {})(WebGL2RenderingContext.prototype.POINTS);

  GL2.prototype.LINES = new (LINES = class LINES extends Number {})(WebGL2RenderingContext.prototype.LINES);

  Object.defineProperties(GL2.prototype, {
    [WebGL2RenderingContext.prototype.TRIANGLES]: {
      get: function() {
        return this.TRIANGLES;
      }
    },
    [WebGL2RenderingContext.prototype.POINTS]: {
      get: function() {
        return this.POINTS;
      }
    },
    [WebGL2RenderingContext.prototype.LINES]: {
      get: function() {
        return this.LINES;
      }
    }
  });

  GL2.prototype.INDEX_CAMERA = 2;

  return GL2;

}).call(this);
