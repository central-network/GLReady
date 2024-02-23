var GL2,
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
  }
});

export var M4 = (function() {
  var Camera;

  //? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
  class M4 extends Float32Array {
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

    translation(tx, ty, tz) {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
    }

    xRotation(angleInRadians) {
      var c, s;
      c = Math.cos(angleInRadians);
      s = Math.sin(angleInRadians);
      return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
    }

    yRotation(angleInRadians) {
      var c, s;
      c = Math.cos(angleInRadians);
      s = Math.sin(angleInRadians);
      return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
    }

    zRotation(angleInRadians) {
      var c, s;
      c = Math.cos(angleInRadians);
      s = Math.sin(angleInRadians);
      return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    scaling(sx, sy, sz) {
      return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
    }

    translate(tx, ty, tz) {
      return M4.multiply(this, this.translation(tx, ty, tz));
    }

    rotate(rx, ry, rz) {
      return this.xRotate(rx).yRotate(ry).zRotate(rz);
    }

    scale(sx, sy, sz) {
      return M4.multiply(this, this.scaling(sx, sy, sz));
    }

    xRotate(rx) {
      return M4.multiply(this, this.xRotation(rx));
    }

    yRotate(ry) {
      return M4.multiply(this, this.yRotation(ry));
    }

    zRotate(rz) {
      return M4.multiply(this, this.zRotation(rz));
    }

  };

  M4.Camera = Camera = class Camera extends M4 {
    constructor(yFov, rAspect, zNear, zFar) {
      var f, rangeInv;
      f = Math.tan(Math.PI * 0.5 - 0.5 * yFov);
      rangeInv = 1.0 / (zNear - zFar);
      super([f / rAspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (zNear + zFar) * rangeInv, -1, 0, 0, (zNear * zFar) * rangeInv * 2, 0]);
    }

  };

  return M4;

}).call(this);

export default GL2 = (function() {
  class GL2 extends EventTarget {
    constructor(canvas) {
      var ref;
      Object.defineProperties((ref = super(), this.render = this.render.bind(this), ref), {
        gl: {
          value: canvas.getContext("webgl2")
        },
        canvas: {
          value: canvas
        },
        boundingRect: {
          get: function() {
            return canvas.getBoundingClientRect();
          }
        },
        rPixel: {
          get: function() {
            return (typeof window !== "undefined" && window !== null ? window.devicePixelRatio : void 0) || 1;
          }
        },
        rAspect: {
          get: function() {
            return this.width / this.height;
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
        },
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
          get: this.getdxCamera,
          set: this.setdxCamera
        },
        dyCamera: {
          get: this.getdyCamera,
          set: this.setdyCamera
        },
        dzCamera: {
          get: this.getdzCamera,
          set: this.setdzCamera
        },
        rxCamera: {
          get: this.getrxCamera,
          set: this.setrxCamera
        },
        ryCamera: {
          get: this.getryCamera,
          set: this.setryCamera
        },
        rzCamera: {
          get: this.getrzCamera,
          set: this.setrzCamera
        },
        sxCamera: {
          get: this.getsxCamera,
          set: this.setsxCamera
        },
        syCamera: {
          get: this.getsyCamera,
          set: this.setsyCamera
        },
        szCamera: {
          get: this.getszCamera,
          set: this.setszCamera
        }
      });
      Object.assign(this.canvas, {
        width: this.width * this.rPixel,
        height: this.height * this.rPixel
      });
      Object.defineProperties(this, {
        vertexBuffer: {
          value: this.gl.createBuffer()
        },
        colorBuffer: {
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
        pointSize: {
          value: 2
        },
        vertices: {
          value: new Float32Array(3 * 1e5)
        },
        colors: {
          value: new Float32Array(3 * 1e5)
        },
        clearColor: {
          value: new Float32Array([15 / 0xff, 17 / 0xff, 26 / 0xff, 1])
        },
        camera: {
          value: new M4.Camera(this.yFov, this.rAspect, this.zNear, this.zFar)
        },
        clearMask: {
          value: this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT
        },
        clearDepth: {
          value: 1
        }
      });
      this.gl.shaderSource(this.vertexShader, this.vertexShaderSource);
      this.gl.compileShader(this.vertexShader);
      this.gl.attachShader(this.program, this.vertexShader);
      this.gl.shaderSource(this.fragmentShader, this.fragmentShaderSource);
      this.gl.compileShader(this.fragmentShader);
      this.gl.attachShader(this.program, this.fragmentShader);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.depthFunc(this.gl.LEQUAL);
      this.gl.clearDepth(this.clearDepth);
      this.gl.clearColor(...this.clearColor);
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
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Vertex);
      this.gl.vertexAttribPointer(this.a_Vertex, 3, this.gl.FLOAT, false, 12, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Color);
      this.gl.vertexAttribPointer(this.a_Color, 3, this.gl.FLOAT, false, 12, 0);
      this.gl.uniform1f(this.u_PointSize, this.pointSize);
      this.dxCamera = -150;
      this.dyCamera = 0;
      this.dzCamera = -360;
      this.rxCamera = Math.rad(180);
      this.ryCamera = Math.rad(0);
      this.rzCamera = Math.rad(0);
      this.sxCamera = 1;
      this.syCamera = 1;
      this.szCamera = 1;
      this.dump();
      this.bindEvents();
    }

    dump() {
      setInterval(() => {
        return console.warn({
          scene: this.scene,
          this: this
        });
      }, 3000);
      return this;
    }

    upload() {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Vertex);
      this.gl.vertexAttribPointer(this.a_Vertex, 3, this.gl.FLOAT, false, 12, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Color);
      return this.gl.vertexAttribPointer(this.a_Color, 3, this.gl.FLOAT, false, 12, 0);
    }

    render() {
      boundMethodCheck(this, GL2);
      if (this.rendering) {
        this.scene[0]++;
        this.gl.clear(this.clearMask);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.pointCount);
        this.gl.drawArrays(this.gl.POINTS, 0, this.pointCount);
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
      addEventListener("pageshow", (e) => {
        return e.persisted && console.warn("backtab:", e);
      });
      this.canvas.addEventListener("wheel", ({deltaY}) => {
        this.deltaY = deltaY;
      }, {
        passive: !0
      });
      return this.canvas.addEventListener("pointermove", ({offsetX, offsetY}) => {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
      }, {
        passive: !0
      });
    }

    updateCamera() {
      return this.gl.uniformMatrix4fv(this.u_Camera, false, this.camera.translate(this.dxCamera, this.dyCamera, this.dzCamera).rotate(this.rxCamera, this.ryCamera, this.rzCamera).scale(this.sxCamera, this.syCamera, this.szCamera));
    }

    getdxCamera() {
      return this.scene.at(this.INDEX_CAMERA + 0);
    }

    setdxCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 0] = arguments[0]);
    }

    getdyCamera() {
      return this.scene.at(this.INDEX_CAMERA + 1);
    }

    setdyCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 1] = arguments[0]);
    }

    getdzCamera() {
      return this.scene.at(this.INDEX_CAMERA + 2);
    }

    setdzCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 2] = arguments[0]);
    }

    getrxCamera() {
      return this.scene.at(this.INDEX_CAMERA + 3);
    }

    setrxCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 3] = arguments[0]);
    }

    getryCamera() {
      return this.scene.at(this.INDEX_CAMERA + 4);
    }

    setryCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 4] = arguments[0]);
    }

    getrzCamera() {
      return this.scene.at(this.INDEX_CAMERA + 5);
    }

    setrzCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 5] = arguments[0]);
    }

    getsxCamera() {
      return this.scene.at(this.INDEX_CAMERA + 6);
    }

    setsxCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 6] = arguments[0]);
    }

    getsyCamera() {
      return this.scene.at(this.INDEX_CAMERA + 7);
    }

    setsyCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 7] = arguments[0]);
    }

    getszCamera() {
      return this.scene.at(this.INDEX_CAMERA + 8);
    }

    setszCamera() {
      return this.updateCamera(this.scene[this.INDEX_CAMERA + 8] = arguments[0]);
    }

  };

  GL2.prototype.vertexShaderSource = 'attribute vec4     a_Vertex; attribute vec4     a_Color; uniform   float    u_PointSize; uniform   mat4     u_Camera; varying   vec4     v_Color; void main() { gl_Position  =  u_Camera * a_Vertex; gl_PointSize =  u_PointSize; v_Color      =  a_Color; }';

  GL2.prototype.fragmentShaderSource = 'precision highp    float; varying   vec4     v_Color; void main() { gl_FragColor = v_Color; }';

  GL2.prototype.scene = new Float32Array(256);

  GL2.prototype.pointCount = 0;

  GL2.prototype.rendering = true;

  GL2.prototype.yFov = Math.rad(90);

  GL2.prototype.zNear = 0.01;

  GL2.prototype.zFar = 1000;

  GL2.prototype.INDEX_CAMERA = 2;

  return GL2;

}).call(this);
