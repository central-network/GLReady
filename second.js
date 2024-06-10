//`import font from "./ibmplex.json" with { type: "json" }`
var CHARCODE_VERTICES, a_ModelMatrix, a_Position, arrClearColor, bytesPerInstance, charMalloc, error, fshader, gl, glClear, glClearColor, glDrawPoints, glDrawTriangles, glVerticesOffset, i, i_Position, init, instanceCount, j, lengthPerInstance, log, maxInstanceCount, modelMatrix, positionsBuffer, positionsBufferArray, program, redefine, render, u_Color, u_ViewMatrix, verticesBuffer, verticesBufferArray, viewMatrix, vshader, warn, xyz1, xyz2, xyz3;

({log, warn, error} = console);

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
  Object.defineProperty(M4, "Identity", {
    value: function() {
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

CHARCODE_VERTICES = JSON.parse(sessionStorage.font);

gl = document.getElementById("gl").getContext("webgl2");

verticesBuffer = gl.createBuffer();

positionsBuffer = gl.createBuffer();

program = gl.createProgram();

vshader = gl.createShader(gl.VERTEX_SHADER);

fshader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vshader, document.getElementById("vshader").text);

gl.shaderSource(fshader, document.getElementById("fshader").text);

gl.compileShader(vshader);

gl.compileShader(fshader);

gl.attachShader(program, vshader);

gl.attachShader(program, fshader);

gl.linkProgram(program);

gl.useProgram(program);

arrClearColor = Float32Array.of(0.05, .2, 0.3, 1);

verticesBufferArray = new Float32Array(new ArrayBuffer(1e6));

instanceCount = 1;

lengthPerInstance = 3;

bytesPerInstance = 12;

maxInstanceCount = 100;

positionsBufferArray = new Float32Array(new ArrayBuffer(maxInstanceCount * bytesPerInstance));

u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");

u_Color = gl.getUniformLocation(program, 'u_Color');

i_Position = gl.getAttribLocation(program, 'i_Position');

a_Position = gl.getAttribLocation(program, 'a_Position');

a_ModelMatrix = gl.getAttribLocation(program, "a_ModelMatrix");

viewMatrix = new M4.Camera(90, innerWidth / innerHeight, 0.1, 1e4);

modelMatrix = new M4.Identity();

glClearColor = gl.clearColor.apply.bind(gl.clearColor, gl, arrClearColor);

glClear = gl.clear.bind(gl, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

glVerticesOffset = 0;

glDrawTriangles = 0;

glDrawPoints = 0;

redefine = function() {
  //rebind every time
  glDrawTriangles = gl.drawArraysInstanced.bind(gl, gl.TRIANGLES, 0, glVerticesOffset / 12, instanceCount);
  return glDrawPoints = gl.drawArraysInstanced.bind(gl, gl.POINTS, 0, glVerticesOffset / 12, instanceCount);
};

Object.defineProperty(verticesBufferArray, "resize", {
  value: function(byteLength) {
    var byteOffset;
    byteOffset = glVerticesOffset;
    glVerticesOffset += byteLength;
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    //resize allocated on glBuffer
    gl.bufferData(gl.ARRAY_BUFFER, this.byteLength, gl.STATIC_DRAW);
    redefine();
    return byteOffset;
  }
});

Object.defineProperty(verticesBufferArray, "enable", {
  value: function() {
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 12, 0); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
    return 0;
  }
});

Object.defineProperty(positionsBufferArray, "instance", {
  value: function() {
    var begin, byteOffset, end, length, subarray;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    byteOffset = bytesPerInstance * instanceCount++;
    begin = byteOffset / 4;
    length = bytesPerInstance / 4;
    end = begin + length;
    subarray = this.subarray(begin, end);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, byteOffset + bytesPerInstance, gl.DYNAMIC_DRAW);
    return Object.defineProperty(subarray, "upload", {
      value: function(arr) {
        if (arr) {
          this.set(arr);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, this.byteOffset, positionsBufferArray, begin, length);
        gl.enableVertexAttribArray(i_Position);
        gl.vertexAttribPointer(i_Position, 3, gl.FLOAT, false, 12, 0); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
        redefine();
        return this;
      }
    });
  }
});

Object.defineProperty(verticesBufferArray, "malloc", {
  value: function(pointCount) {
    var array, begin, byteLength, dstByteOffset, length;
    length = pointCount * 3;
    byteLength = length * 4;
    dstByteOffset = this.resize(byteLength);
    begin = dstByteOffset / 4;
    array = this.subarray(begin, begin + length);
    Object.defineProperty(array, "dstByteOffset", {
      value: dstByteOffset
    });
    return Object.defineProperty(array, "upload", {
      value: function(values = []) {
        this.set(values);
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, this.dstByteOffset, verticesBufferArray, begin, length);
        gl.enableVertexAttribArray(a_Position);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
        return this;
      }
    });
  }
});

Object.defineProperties(modelMatrix, {
  dx: {
    writable: 1,
    value: 0
  },
  dy: {
    writable: 1,
    value: 0
  },
  dz: {
    writable: 1,
    value: 0
  },
  rx: {
    writable: 1,
    value: 0
  },
  ry: {
    writable: 1,
    value: 0
  },
  rz: {
    writable: 1,
    value: 0
  },
  sx: {
    writable: 1,
    value: 1
  },
  sy: {
    writable: 1,
    value: 1
  },
  sz: {
    writable: 1,
    value: 1
  },
  location: {
    value: gl.getAttribLocation(program, "a_ModelMatrix")
  },
  upload: {
    value: function(mat4) {
      if (mat4) {
        this.set(mat4);
      }
      gl.enableVertexAttribArray(this.location);
      return gl.vertexAttribPointer(this.location, 4, gl.FLOAT, false, 64, 0); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
    }
  }
});

Object.defineProperties(viewMatrix, {
  dx: {
    writable: 1,
    value: 0
  },
  dy: {
    writable: 1,
    value: 0
  },
  dz: {
    writable: 1,
    value: -10
  },
  rx: {
    writable: 1,
    value: 0
  },
  ry: {
    writable: 1,
    value: Math.PI
  },
  rz: {
    writable: 1,
    value: Math.PI / 2
  },
  sx: {
    writable: 1,
    value: 1
  },
  sy: {
    writable: 1,
    value: 1
  },
  sz: {
    writable: 1,
    value: 1
  },
  location: {
    value: gl.getUniformLocation(program, "u_ViewMatrix")
  }
});

Object.defineProperty(viewMatrix, "upload", {
  value: function() {
    gl.uniformMatrix4fv(this.location, false, this.slice().translate(this.dx, this.dy, this.dz).rotate(this.rx, this.ry, this.rz).scale(this.sx, this.sy, this.sz));
    return 0;
  }
});

init = function() {
  var glViewport;
  glViewport = function() {
    Object.assign(gl.canvas, {
      width: innerWidth * devicePixelRatio,
      height: innerHeight * devicePixelRatio
    }).setAttribute("style", [`width=${CSS.px(innerWidth)}`, `height=${CSS.px(innerHeight)}`].join(";"));
    return gl.viewport(0, 0, innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
  };
  gl.vertexAttribDivisor(i_Position, 1);
  glViewport();
  glClearColor();
  return glClear();
};

charMalloc = function(char) {
  var charBuffer, pointCount, vertices;
  vertices = CHARCODE_VERTICES[char.charCodeAt(0)];
  pointCount = vertices.length / 3;
  charBuffer = verticesBufferArray.malloc(pointCount);
  charBuffer.upload(vertices);
  verticesBufferArray.enable();
  return charBuffer;
};

init();

//_e00 = charMalloc("f")
verticesBufferArray.malloc(3).upload([4, -2, -1, -4, -2, 1, 0, 2, -2]);

xyz1 = positionsBufferArray.instance();

xyz2 = positionsBufferArray.instance();

xyz3 = positionsBufferArray.instance();

xyz1.upload([7, -1, 0]);

xyz2.upload([5, -2, 0]);

xyz3.upload([-5, 1, 0]);

i = 0;

j = 1;

render = function() {
  glClear();
  glDrawTriangles();
  glDrawPoints();
  viewMatrix.dx += 0.1 * j;
  viewMatrix.dy -= 0.1 * j;
  //viewMatrix.dz -= 0.01 * j
  //viewMatrix.rz += 0.01 * j
  viewMatrix.upload();
  xyz1[1] += 0.1 * j;
  xyz2[0] += 0.3 * j;
  xyz3[0] += 0.1 * j;
  xyz3[1] += 0.02 * j;
  xyz3[2] -= 0.05 * j;
  xyz1.upload(xyz1);
  xyz2.upload(xyz2);
  xyz3.upload(xyz3);
  if (!(++i % 60)) {
    j *= -1;
  }
  return requestAnimationFrame(render);
};

render();
