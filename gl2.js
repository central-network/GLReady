var BUFFER, BYTE_LINES, BYTE_POINTS, BYTE_TRIANGLES, COUNT_HEADERS, COUNT_LINES, COUNT_POINTS, COUNT_TRIANGLES, DRAW_BUFFER, DRAW_COUNT, DRAW_FINISH, DRAW_LENGTH, FIRST_LINES, FIRST_POINTS, FIRST_TRIANGLES, HEADERS_BUFFER, HEADERS_INDEX, HEADERS_OFFSET, INDEX_LINES, INDEX_POINTS, INDEX_TRIANGLES, LENGTH_HEADERS, UNUSED, a, b, dx, dy, dz, g, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33, m40, m41, m42, m43, objects, r, rx, ry, rz,
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

objects = new Object();

Object.defineProperties(objects, {
  get: {
    value: function(offset) {
      return this[(offset - HEADERS_OFFSET) / 4];
    }
  }
});

export var Position = (function() {
  class Position extends Float32Array {
    apply() {
      this.mesh.matrix[0] = this.mesh.matrix[5] = this.mesh.matrix[10] = this.mesh.matrix[15] = 1;
      return this.mesh.applyMatrix();
    }

  };

  Position.prototype.headerOffset = (24 + 12) * 4;

  Object.defineProperties(Position.prototype, {
    x: {
      set: function() {
        return this.apply(this[0] = arguments[0]);
      },
      get: function() {
        return this[0];
      }
    },
    y: {
      set: function() {
        return this.apply(this[0] = arguments[0]);
      },
      get: function() {
        return this[0];
      }
    },
    z: {
      set: function() {
        return this.apply(this[0] = arguments[0]);
      },
      get: function() {
        return this[0];
      }
    },
    mesh: {
      get: function() {
        return objects.get(this.byteOffset - this.headerOffset);
      }
    }
  });

  return Position;

}).call(this);

export var M4 = (function() {
  var Camera;

  //? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
  class M4 extends Float32Array {
    static fromVec3(vec3) {
      return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ...vec3, 1]);
    }

    modifyVertex(vec3) {
      vec3.set(M4.multiply(this, Float32Array.from([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ...vec3.subarray(0, 3), 1])).subarray(12, 15));
      return vec3;
    }

    modifyShape(mesh) {
      mesh.applyMatrix(this);
      return mesh;
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

  Object.defineProperties(M4.prototype, {
    position: {
      set: function() {
        return this.position.set(arguments[0]);
      },
      get: function() {
        return new Position(this.buffer, this.byteOffset + 48, 3);
      }
    }
  });

  Object.defineProperty(M4, "identity", {
    get: function() {
      return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
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

DRAW_LENGTH = 3e6 + 4;

BUFFER = new SharedArrayBuffer(1e8);

DRAW_COUNT = DRAW_LENGTH / 7;

export var Headers = class Headers extends Int32Array {};

export var Point = (function() {
  var i, j, len1, prop, ref;

  class Point extends Float32Array {
    applyMatrix(mat4) {
      return mat4.modifyVertex(this);
    }

    isNeighbour(point) {
      var a, b, c, dx, dy, dz, x, y, z;
      [a, b, c] = this.vertex;
      [x, y, z] = point;
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

    distance2d(p0, p1 = this) {
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

    nearest(points) {
      var dist, distance, k, len2, nearest, point;
      distance = +2e308;
      nearest = null;
      for (k = 0, len2 = points.length; k < len2; k++) {
        point = points[k];
        if (!(dist = this.distance2d(point))) {
          continue;
        }
        if (distance < dist) {
          continue;
        }
        distance = dist;
        nearest = point;
      }
      return nearest;
    }

  };

  ref = ["x", "y", "z", "r", "g", "b", "a"];
  for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
    prop = ref[i];
    Object.defineProperty(Point.prototype, prop, (function(index) {
      return {
        get: function() {
          return this[index];
        },
        set: function() {
          return this[index] = arguments[0];
        }
      };
    })(i));
  }

  Object.defineProperties(Point.prototype, {
    color: {
      get: function() {
        return new Color(this.buffer, this.byteOffset + 12, 4);
      },
      set: function() {
        return this.set(arguments[0].toRGBA(), 3);
      }
    },
    vertex: {
      get: function() {
        return new Vertex(this.buffer, this.byteOffset + 0, 3);
      },
      set: function() {
        return this.vertex.set(arguments[0]);
      }
    },
    vLength: {
      get: function() {
        return Math.sqrt(Math.powsum(this.subarray(0, 3)));
      }
    },
    index: {
      get: function() {
        return this.byteOffset / this.byteLength % DRAW_COUNT;
      }
    }
  });

  return Point;

}).call(this);

DRAW_BUFFER = new Point(BUFFER, 0, DRAW_LENGTH * 3);

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

COUNT_TRIANGLES = 0;

COUNT_POINTS = 0;

COUNT_LINES = 0;

HEADERS_OFFSET = DRAW_FINISH;

HEADERS_INDEX = DRAW_FINISH / 4;

HEADERS_BUFFER = new Headers(BUFFER, HEADERS_OFFSET, 1e6);

Object.defineProperties(Headers.prototype, {
  x: {
    get: function() {
      return this[0];
    },
    set: function() {
      var cos, diff, dx, j, k, len1, len2, p, ref, ref1, sin, x, y;
      //! position
      diff = (this.byteOffset - HEADERS_OFFSET) / 4;
      if ((diff % 16) === 12) {
        dx = arguments[0] - this[0];
        ref = this.pobject.points;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          p = ref[j];
          p[0] += dx;
        }
        this.pobject.needsUpload = 1;
      } else {
        //? rotation
        cos = Math.cos(arguments[0]);
        sin = Math.sin(arguments[0]);
        ref1 = this.robject.points;
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          p = ref1[k];
          [x, y] = p;
          p.set([x * cos - y * sin, x * sin + y * cos]);
        }
        this.robject.needsUpload = 1;
      }
      return this[0] = arguments[0];
    }
  },
  y: {
    get: function() {
      return this[1];
    },
    set: function() {
      var dy, j, len1, p, ref;
      dy = arguments[0] - this.y;
      this[1] = arguments[0];
      ref = this.object.points;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        p = ref[j];
        p.y += dy;
      }
      return this.object.needsUpload = 1;
    }
  },
  z: {
    get: function() {
      return this[2];
    },
    set: function() {
      var dz, j, len1, p, ref;
      dz = arguments[0] - this.z;
      this[2] = arguments[0];
      ref = this.object.points;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        p = ref[j];
        p.z += dz;
      }
      return this.object.needsUpload = 1;
    }
  },
  pobject: {
    get: function() {
      return objects[(this.byteOffset - HEADERS_OFFSET) / 4 - 20];
    }
  },
  robject: {
    get: function() {
      return objects[(this.byteOffset - HEADERS_OFFSET) / 4 - 16];
    }
  }
});

COUNT_HEADERS = 0;

LENGTH_HEADERS = 0;

r = g = b = a = rx = ry = rz = dx = dy = dz = UNUSED = 0;

[m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33, m40, m41, m42, m43] = M4.identity;

export var RGBA = (function() {
  class RGBA {};

  Object.defineProperties(RGBA, {
    [Array]: {
      value: function() {
        var arr, i, j, len1, ref, v;
        arr = [1, 1, 1, 1];
        ref = this;
        for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
          v = ref[i];
          arr[i] = v > 1 ? v / 255 : v;
        }
        return arr;
      }
    },
    [String]: {
      value: function() {
        var $;
        if ("#" === $.at(0)) {
          return $.substring(1).toRGBA();
        }
        if ("x" === $.at(1)) {
          return $.substring(2).toRGBA();
        }
        $ = this.replace(/\W+/g, '');
        if ($.length === 3) {
          return $.split("").map(function(i) {
            return i + i;
          }).join("").toRGBA();
        }
        if ($.length <= 5) {
          return $.padStart(6, 0).toRGBA();
        }
        return $.padEnd(8, "ff").match(/.{1,2}/g).map(function(n) {
          return parseInt(n, 16) / 0xff;
        });
      }
    }
  });

  return RGBA;

}).call(this);

export var XYZ = class XYZ {};

Object.defineProperties(Array.prototype, {
  toRGBA: {
    value: RGBA[Array]
  }
});

Object.defineProperties(String.prototype, {
  toRGBA: {
    value: RGBA[String]
  }
});

Object.defineProperties(Object.getPrototypeOf(Uint8Array.prototype), {
  toRGBA: {
    value: RGBA[Array]
  }
});

export var Color = class Color extends Float32Array {
  set() {
    return super.set(arguments[0].toRGBA());
  }

};

export var Vertex = class Vertex extends Float32Array {};

export var Attributes = class Attributes extends Float32Array {};

export var Vertices = class Vertices extends Array {};

export var Points = class Points extends Array {};

export var Triangle = class Triangle extends Array {};

export var GL2 = (function() {
  var LINES, POINTS, TRIANGLES;

  class GL2 extends EventTarget {
    static corners(shape) {
      var found, j, k, len1, len2, points, px, py, pz, ref, ref1, vx, vy, vz, x, y, z;
      points = [];
      ref = shape.points;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        ({
          vertex: [vx, vy, vz]
        } = ref[j]);
        found = false;
        ref1 = points.slice();
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          [px, py, pz] = ref1[k];
          x = px === vx;
          y = py === vy;
          z = pz === vz;
          if (found = x && y && z) {
            break;
          }
        }
        if (!found) {
          points.push([vx, vy, vz]);
        }
      }
      return Point.from(points.flat());
    }

    static edges(shape) {
      var c, d, found, i, j, k, l, len1, len2, len3, neigh, neighs, pair, pairs, point, points, ref, vertex;
      i = 0;
      pairs = [];
      points = [];
      ref = shape.points;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        point = ref[j];
        neighs = shape.neighbours(point);
        vertex = point.vertex;
        for (k = 0, len2 = neighs.length; k < len2; k++) {
          neigh = neighs[k];
          pair = [c = neigh.index, d = point.index];
          found = false;
          for (l = 0, len3 = pairs.length; l < len3; l++) {
            [a, b] = pairs[l];
            if (found = (c === a) && (d === b)) {
              break;
            }
            if (found = (c === b) && (d === a)) {
              break;
            }
          }
          if (found) {
            continue;
          } else {
            pairs.push(pair);
          }
          points.push(...vertex, ...neigh.vertex);
        }
      }
      return Point.from(points.flat());
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
      var BYTES_PER_ELEMENT, HEADER_ITEM_COUNT, ITEMS_PER_VERTEX, Mesh, begin, byteLength, byteOffset, enabled, end, hIndex, headersIndex, length, needsUpload;
      BYTES_PER_ELEMENT = 4;
      HEADER_ITEM_COUNT = 40;
      ITEMS_PER_VERTEX = 7;
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
      HEADERS_BUFFER.set([byteOffset, byteLength, count, length, begin, end = begin + length, hIndex = LENGTH_HEADERS, drawAs, enabled = 1, needsUpload = 1, UNUSED, UNUSED, r, g, b, a, rx, ry, rz, UNUSED, dx, dy, dz, UNUSED, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33, m40, m41, m42, m43], headersIndex = LENGTH_HEADERS);
      LENGTH_HEADERS += HEADER_ITEM_COUNT;
      COUNT_HEADERS += 1;
      return objects[headersIndex] = new (Mesh = (function() {
        class Mesh extends Number {
          point(i) {
            begin = this.begin + ITEMS_PER_VERTEX * i;
            end = begin + ITEMS_PER_VERTEX;
            return DRAW_BUFFER.subarray(begin, end);
          }

          triangle(i) {
            return [this.point(i), this.point(i + 1), this.point(i + 2)];
          }

          applyMatrix(mat4 = this.matrix) {
            var j, len1, p, ref;
            ref = this.points;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              p = ref[j];
              p.applyMatrix(mat4);
            }
            this.needsUpload = 1;
            return this;
          }

          neighbours(point) {
            var d, i, j, neighs, p, ref, x, y, z;
            [x, y, z] = point;
            neighs = [];
            for (i = j = 0, ref = this.count; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
              p = this.point(i);
              if (d = p.isNeighbour(point)) {
                neighs.push(p);
              }
            }
            return neighs;
          }

        };

        Object.defineProperties(Mesh.prototype, {
          byteOffset: {
            get: function() {
              return this.headers[0];
            }
          },
          byteLength: {
            get: function() {
              return this.headers[1];
            }
          },
          count: {
            get: function() {
              return this.headers[2];
            }
          },
          length: {
            get: function() {
              return this.headers[3];
            }
          },
          begin: {
            get: function() {
              return this.headers[4];
            }
          },
          end: {
            get: function() {
              return this.headers[5];
            }
          },
          hIndex: {
            get: function() {
              return this.headers[6];
            }
          },
          drawAs: {
            get: function() {
              return GL2.prototype[this.headers[7]];
            }
          },
          enabled: {
            get: function() {
              return this.headers[8];
            }
          },
          needsUpload: {
            get: function() {
              return this.headers[9];
            },
            set: function() {
              return this.headers[9] = arguments[0];
            }
          },
          attributes: {
            get: function() {
              return DRAW_BUFFER.subarray(this.begin, this.end);
            }
          },
          headers: {
            get: function() {
              return HEADERS_BUFFER.subarray(this, this + HEADER_ITEM_COUNT);
            }
          },
          color: {
            get: function() {
              return this.headers.subarray(12, 16);
            }
          },
          rotation: {
            get: function() {
              return this.headers.subarray(16, 19);
            }
          },
          position: {
            get: function() {
              return this.matrix.position;
            }
          },
          matrix: {
            get: function() {
              var m4;
              m4 = this.headers.subarray(24, 40);
              return new M4(m4.buffer, m4.byteOffset, m4.length);
            }
          },
          points: {
            get: function() {
              var i, j, ref, results;
              results = [];
              for (i = j = 0, ref = this.count; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
                results.push(this.point(i));
              }
              return results;
            }
          },
          triangles: {
            get: function() {
              var i, j, ref, results;
              results = [];
              for (i = j = 0, ref = this.count / 3; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
                results.push(this.triangle(i));
              }
              return results;
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
                results.push((yield this.point(i)));
              }
              return results;
            }
          }
        });

        return Mesh;

      }).call(this))(headersIndex);
    }

    render(t) {
      var hIndex, j, job, k, l, len, len1, len2, len3, object, ref, ref1, ref2;
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
        for (hIndex in objects) {
          object = objects[hIndex];
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
