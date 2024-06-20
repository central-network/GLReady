//`import font from "./ibmplex.json" with { type: "json" }`
//sessionStorage.setItem "font", JSON.stringify font
//fetch("test.dump").then( (r) -> r.blob() ).then( (b) -> b.arrayBuffer() ).then (udp) -> 
//    sessionStorage.setItem "dump", new Uint8Array( udp ).join(" ")

//import "./uc-worker.js"
var delay, dump, error, font, iLE, log, warn;

({log, warn, error} = console);

window.addEventListener("error", log);

window.addEventListener("messageerror", log);

window.addEventListener("unhandledrejection", log);

font = JSON.parse(sessionStorage.font);

dump = Uint8Array.from(sessionStorage.dump.split(" "));

delay = function() {
  return new Promise((done) => {
    return setTimeout(done, arguments[0] || 1000);
  });
};

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
  randBit: {
    value: function() {
      return Number(Math.random() > 0.5);
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

iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;

Object.defineProperties(DataView.prototype, {
  bind: {
    value: function(object, property, byteOffset, TypedArray, callback) {
      var caller, getter, setter;
      caller = TypedArray.name.split("Array").at(0);
      getter = this[`get${caller}`].bind(this, object.byteOffset + byteOffset, iLE);
      setter = this[`set${caller}`].bind(this, object.byteOffset + byteOffset);
      if (typeof callback !== "function") {
        Object.defineProperty(object, property, {
          get: getter,
          set: function(val) {
            return setter(val, iLE);
          }
        });
      } else {
        Object.defineProperty(object, property, {
          get: getter,
          set: function(val) {
            setter(val, iLE);
            return callback.call(this, val);
          }
        });
      }
      return this;
    }
  }
});

(function() {
  var BYTES_PER_LINE, M4, TCPSocket, UX, a_Color, a_Position, a_Vertices, arrClearColor, backgroundColor, bindBufferInstances, bindBufferVertices, bitBoxSize, bitBoxes, bitOffsetX, bitOffsetY, bitsOffset, buf, byteDataGrid, easing, fshader, gl, glClear, glClearColor, gridX, gridY, height, i, init, instanceCount, instancesBufferArray, j, pointCount, program, render, renderQueue, u_ViewMatrix, ux, verticesBufferArray, verticesOffset, viewMatrix, vshader, width, writeDHCPPacket, ws, zero;
  M4 = (function() {
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
  UX = (function() {
    class UX extends EventTarget {
      
      //don't split in/out, no need to check is reached top
      linearInOut(v) {
        return [...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ...[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]].map(function(d) {
          return v * d / 10;
        });
      }

      constructor(canvas, buffer = new ArrayBuffer(80 * 4)) {
        var byteOffset, document, events, matrix, values;
        super();
        if (buffer instanceof M4) {
          matrix = buffer;
          buffer = new ArrayBuffer(80 * 4);
          byteOffset = 0;
        } else {
          matrix = new M4;
          if (!isNaN(buffer.byteOffset)) {
            ({buffer, byteOffset} = buffer);
          } else {
            byteOffset = 0;
          }
        }
        this.events = events = new Uint32Array(buffer, byteOffset, 24); //? 96 bytes
        this.values = values = new Float32Array(buffer, byteOffset + 96, 14); //? 56 bytes
        Object.defineProperties(this, {
          matrix: {
            value: matrix
          },
          press: {
            set: function() {
              return events[this.click = arguments[0]] = 1;
            }
          },
          release: {
            set: function() {
              return events[arguments[0]] = 0;
            }
          },
          rotating: {
            get: function() {
              return this.looking && events[0];
            }
          },
          draging: {
            get: function() {
              return this.looking && events[2];
            }
          },
          running: {
            get: function() {
              return this.moving && this.shift;
            }
          },
          offsetX: {
            set: function() {
              this.dx = -this.x + (this.x = arguments[0]);
              return this.ry = (-this.dx / 100) % Math.PI;
            }
          },
          offsetY: {
            set: function() {
              this.dy = +this.y - (this.y = arguments[0]);
              return this.rx = (-this.dy / 100) % Math.PI;
            }
          },
          deltaX: {
            set: function() {
              return this.sx = arguments[0];
            }
          },
          deltaY: {
            set: function() {
              this.sz = (this.sy = arguments[0]) / 10;
              viewMatrix.dz = Math.max(-300, Math.min(300, viewMatrix.dz + this.sz));
              return this.matrix.upload();
            }
          },
          moving: {
            get: function() {
              return events[12];
            },
            set: function() {
              return events[12] = arguments[0];
            }
          },
          jumping: {
            get: function() {
              return events[19];
            },
            set: function() {
              return events[19] = arguments[0];
            }
          },
          shift: {
            get: function() {
              return events[20];
            },
            set: function() {
              return events[20] = arguments[0];
            }
          },
          alt: {
            get: function() {
              return events[21];
            },
            set: function() {
              return events[21] = arguments[0];
            }
          },
          ctrl: {
            get: function() {
              return events[22];
            },
            set: function() {
              return events[22] = arguments[0];
            }
          },
          meta: {
            get: function() {
              return events[23];
            },
            set: function() {
              return events[23] = arguments[0];
            }
          },
          forward: {
            get: function() {
              return events[13];
            },
            set: function() {
              return events[13] = arguments[0];
            }
          },
          backward: {
            get: function() {
              return events[14];
            },
            set: function() {
              return events[14] = arguments[0];
            }
          },
          left: {
            get: function() {
              return events[15];
            },
            set: function() {
              return events[15] = arguments[0];
            }
          },
          right: {
            get: function() {
              return events[16];
            },
            set: function() {
              return events[16] = arguments[0];
            }
          },
          up: {
            get: function() {
              return events[17];
            },
            set: function() {
              return events[17] = arguments[0];
            }
          },
          down: {
            get: function() {
              return events[18];
            },
            set: function() {
              return events[18] = arguments[0];
            }
          },
          looking: {
            get: function() {
              return events[11];
            },
            set: function() {
              return events[11] = arguments[0];
            }
          },
          zooming: {
            get: function() {
              return events[10];
            },
            set: function() {
              return events[10] = arguments[0];
            }
          },
          dblclick: {
            get: function() {
              return events[9];
            },
            set: function() {
              return events[9] = arguments[0];
            }
          },
          click: {
            get: function() {
              return events[8];
            },
            set: function() {
              return events[8] = arguments[0];
            }
          },
          x: {
            get: function() {
              return values[0];
            },
            set: function() {
              return values[0] = arguments[0];
            }
          },
          dx: {
            get: function() {
              return values[1];
            },
            set: function(dx) {
              values[1] = dx;
              if (this.draging) {
                matrix.dx += dx;
                return this.matrix.upload();
              }
            }
          },
          dy: {
            get: function() {
              return values[6];
            },
            set: function(dy) {
              values[6] = dy;
              if (this.draging) {
                matrix.dy += dy;
                return this.matrix.upload();
              }
            }
          },
          sx: {
            get: function() {
              return values[3];
            },
            set: function() {
              return values[3] = arguments[0];
            }
          },
          vx: {
            get: function() {
              return values[4];
            },
            set: function(vx) {
              return values[4] = vx;
            }
          },
          y: {
            get: function() {
              return values[5];
            },
            set: function() {
              return values[5] = arguments[0];
            }
          },
          rx: {
            get: function() {
              return values[2];
            },
            set: function(rx) {
              values[2] = rx;
              if (this.rotating) {
                matrix.rx += rx;
                return this.matrix.upload();
              }
            }
          },
          ry: {
            get: function() {
              return values[7];
            },
            set: function(ry) {
              values[7] = ry;
              if (this.rotating) {
                matrix.ry -= ry;
                return this.matrix.upload();
              }
            }
          },
          sy: {
            get: function() {
              return values[8];
            },
            set: function() {
              return values[8] = arguments[0];
            }
          },
          vy: {
            get: function() {
              return values[9];
            },
            set: function() {
              return values[9] = arguments[0];
            }
          },
          sz: {
            get: function() {
              return values[10];
            },
            set: function() {
              return values[10] = arguments[0];
            }
          },
          dz: {
            get: function() {
              return values[11];
            },
            set: function() {
              return values[11] = arguments[0];
            }
          },
          factor: {
            get: function() {
              return values[12];
            },
            set: function() {
              return values[12] = arguments[0];
            }
          },
          time: {
            get: function() {
              return values[13];
            },
            set: function() {
              events.fill(0, 8, 12);
              return values[13] = arguments[0];
            }
          }
        });
        window.addEventListener("pointerup", this.pointerup.bind(this));
        window.addEventListener("pointermove", this.pointermove.bind(this), {
          passive: !0
        });
        window.addEventListener("pointerdown", this.pointerdown.bind(this));
        window.addEventListener("dblclick", this.doubleclick.bind(this));
        window.addEventListener("wheel", this.wheel.bind(this), {
          passive: !0
        });
        window.addEventListener("contextmenu", this.contextmenu.bind(this));
        document = canvas.ownerDocument;
        document.addEventListener("keyup", this.keyup.bind(this));
        document.addEventListener("keydown", this.keydown.bind(this));
        this.factor = 5;
        null;
      }

      e() {
        return this;
      }

      wheel(e) {
        return this.e(({deltaX: this.deltaX, deltaY: this.deltaY} = e)).zooming = 1;
      }

      pointermove(e) {
        return this.e(({offsetX: this.offsetX, offsetY: this.offsetY} = e)).looking = 1;
      }

      pointerup(e) {
        return this.e(this.release = e.button);
      }

      doubleclick(e) {
        return this.e(this.dblclick = e.button);
      }

      pointerdown(e) {
        return this.e(this.press = e.button);
      }

      contextmenu(e) {
        return e.preventDefault();
      }

      keydown(e) {
        switch (e.code) {
          case "KeyW":
          case "ArrowUp":
            this.forward = 1;
            break;
          case "KeyS":
          case "ArrowDown":
            this.backward = 1;
            break;
          case "KeyA":
          case "ArrowLeft":
            this.right = 1;
            break;
          case "KeyD":
          case "ArrowRight":
            this.left = 1;
            break;
          case "Space":
            this.up = 1;
        }
        if (this.forward || this.backward || this.right || this.left) {
          this.moving = 1;
        }
        if (this.up) {
          this.jumping = 1;
        }
        return this.move(e);
      }

      keyup(e) {
        switch (e.code) {
          case "KeyW":
          case "ArrowUp":
            this.forward = 0;
            break;
          case "KeyS":
          case "ArrowDown":
            this.backward = 0;
            break;
          case "KeyA":
          case "ArrowLeft":
            this.right = 0;
            break;
          case "KeyD":
          case "ArrowRight":
            this.left = 0;
            break;
          case "Space":
            this.up = 0;
        }
        if (!this.forward && !this.backward && !this.right && !this.left) {
          this.moving = 0;
        }
        if (!this.up) {
          this.jumping = 0;
        }
        return this.move(e);
      }

      move(e) {
        var factor;
        this.shift = e.shiftKey;
        this.alt = e.altKey;
        this.meta = e.metaKey;
        this.ctrl = e.ctrlKey;
        this.vy = this.up ? -1 : 0;
        [this.vx, this.dz] = this.right ? this.forward ? [+1, +1] : this.backward ? [+1, -1] : [+1, 0] : this.left ? this.forward ? [-1, +1] : this.backward ? [-1, -1] : [-1, 0] : this.backward ? [0, -1] : this.forward ? [0, +1] : [0, 0];
        factor = this.factor;
        if (this.running) {
          factor *= 2;
        }
        this.vx *= factor;
        this.dz *= factor;
        this.vy *= this.factor;
        return 0;
      }

    };

    UX.byteLength = 256;

    return UX;

  }).call(this);
  TCPSocket = (function() {
    class TCPSocket {
      constructor(host, port, protocol = TCPSocket.PROTOCOL) {
        var e, object, script, worker;
        script = this.script.toString().replace("$wsurl", `${protocol}//${host}:${port}`);
        object = this.object(`(function ${script})()`);
        try {
          worker = new Worker(object);
          worker.addEventListener("error", log);
          worker.addEventListener("onmessageerror", log);
          worker.addEventListener("message", ({data}) => {
            if (data.byteLength) {
              return this.onmessage(data);
            }
          });
        } catch (error1) {
          e = error1;
          log(e);
        }
      }

      onmessage() {
        return this;
      }

      object(script) {
        var blob, ourl;
        blob = new Blob([script], {
          type: "application/javascript"
        });
        ourl = URL.createObjectURL(blob, {
          type: "application/javascript"
        });
        return ourl;
      }

      script() {
        var connect;
        //console.log "init"
        self.addEventListener("error", function() {
          return true;
        });
        self.addEventListener("unhandledrejection", function() {
          return true;
        });
        connect = function() {
          var e, ws;
          try {
            //console.log "bind"
            ws = new WebSocket("$wsurl");
          } catch (error1) {
            e = error1;
            setTimeout(connect, 3000);
          }
          if (typeof ws === "undefined") {
            return;
          }
          Object.assign(ws, {
            onopen: function() {}, //console.warn "open"
            onerror: function() {}, //console.log "fail"
            onclose: function() {
              return setTimeout(connect, 3000);
            },
            onmessage: function({data}) {
              return data.arrayBuffer().then(self.postMessage);
            }
          });
          return ws;
        };
        try {
          return connect();
        } catch (error1) {}
      }

    };

    TCPSocket.PROTOCOL = `ws${location.protocol.at(-2)}:`;

    return TCPSocket;

  }).call(this);
  ux = null;
  ws = null;
  gl = document.getElementById("gl").getContext("webgl2");
  renderQueue = [];
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
  backgroundColor = arrClearColor.slice(0, 3).map(function(i) {
    return i * 0xff;
  }).join(" ");
  document.body.style.backgroundColor = `rgb(${backgroundColor})`;
  pointCount = 0;
  instanceCount = 0;
  verticesOffset = 0;
  verticesBufferArray = new Float32Array(new ArrayBuffer(1e8));
  instancesBufferArray = new Float32Array(new ArrayBuffer(1e7));
  bindBufferInstances = gl.bindBuffer.bind(gl, gl.ARRAY_BUFFER, gl.createBuffer());
  bindBufferInstances();
  gl.bufferData(gl.ARRAY_BUFFER, instancesBufferArray.byteLength, gl.DYNAMIC_READ);
  bindBufferVertices = gl.bindBuffer.bind(gl, gl.ARRAY_BUFFER, gl.createBuffer());
  bindBufferVertices();
  gl.bufferData(gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW);
  a_Position = gl.getAttribLocation(program, 'a_Position');
  a_Vertices = gl.getAttribLocation(program, 'a_Vertices');
  a_Color = gl.getAttribLocation(program, "a_Color");
  u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  viewMatrix = new M4.Camera(90, innerWidth / innerHeight, 0.1, 1e5);
  glClearColor = gl.clearColor.apply.bind(gl.clearColor, gl, arrClearColor);
  glClear = gl.clear.bind(gl, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  Object.defineProperty(verticesBufferArray, "malloc", {
    value: function(array) {
      var begin, byteLength, byteOffset, length, subarray;
      pointCount = array.length / 3;
      length = array.length;
      byteOffset = verticesOffset;
      byteLength = length * 4;
      begin = byteOffset / 4;
      subarray = this.subarray(begin, begin + length);
      verticesOffset = byteLength + verticesOffset;
      subarray.set(array);
      bindBufferVertices();
      gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, verticesBufferArray, begin, length);
      Object.defineProperties(subarray, {
        start: {
          value: byteOffset / 12
        },
        count: {
          value: pointCount
        }
      });
      (function(vertices) {
        var cloneCount;
        cloneCount = 1;
        return Object.defineProperties(vertices, {
          instance: {
            value: function(instance) {
              return Object.defineProperties(instance, {
                globalInstanceIndex: {
                  value: instanceCount++
                },
                modelInstanceIndex: {
                  value: cloneCount++
                }
              });
            }
          }
        });
      })(subarray);
      return subarray;
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
      value: -5
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
      value: gl.getUniformLocation(program, "u_ViewMatrix")
    },
    toJSON: {
      value: function() {
        return JSON.stringify({dx: this.dx, dy: this.dy, dz: this.dz, rx: this.rx, ry: this.ry, rz: this.rz, sx: this.sx, sy: this.sy, sz: this.sz});
      }
    },
    store: {
      value: function() {
        sessionStorage.viewMatrix = this.toJSON();
        return 0;
      }
    },
    restore: {
      value: function() {
        return Object.assign(this, JSON.parse(sessionStorage.viewMatrix)).upload();
      }
    },
    reset: {
      value: function() {
        return sessionStorage.removeItem("viewMatrix");
      }
    },
    upload: {
      value: function() {
        var matrix;
        matrix = this.slice().translate(this.dx, this.dy, this.dz).rotate(this.rx, this.ry, this.rz).scale(this.sx, this.sy, this.sz);
        gl.uniformMatrix4fv(this.location, false, matrix);
        return this.store();
      }
    }
  });
  Object.assign(self, {
    line: {
      shapes: [],
      buffer: buf = new ArrayBuffer(1e6 * (12 + 16)),
      view: new DataView(buf, 0, 4096 * 4096),
      attributes: new Float32Array(buf, 0, 4096 * 1024),
      a_Position: a_Position,
      a_Color: a_Color,
      zOffset: -300,
      draw: function() {
        var begin, byteOffset, end, i, instances, len, length, m;
        bindBufferInstances();
        for (i = m = 0, len = shapes.length; m < len; i = ++m) {
          instances = shapes[i];
          if (instances.needsRebind) {
            instances.needsRebind = 0;
            byteOffset = instances.byteOffset;
            length = instances.length * 7;
            begin = byteOffset / 4;
            end = begin + length;
            instances.vertexPositionPointer = gl.vertexAttribPointer.bind(gl, this.a_Position, 3, gl.FLOAT, 0, 28, byteOffset);
            instances.vertexColorPointer = gl.vertexAttribPointer.bind(gl, this.a_Color, 4, gl.FLOAT, 0, 28, byteOffset + 12);
            instances.drawArraysInstanced = gl.drawArraysInstanced.bind(gl, gl.TRIANGLES, instances.model.start, instances.model.count, instances.length);
            instances.bufferSubData = gl.bufferSubData.bind(gl, gl.ARRAY_BUFFER, byteOffset, this.attributes, begin, end);
          }
          if (instances.needsUpload) {
            instances.needsUpload = 0;
            instances.bufferSubData();
          }
          instances.vertexColorPointer();
          instances.vertexPositionPointer();
          instances.drawArraysInstanced();
          0;
        }
        return 0;
      },
      poly: function(boxes = [], options = {}) {
        var Ax0, Ax1, AxMax, AxMin, Ay0, Ay1, AyMax, AyMin, Az0, Az1, Bx0, Bx1, BxMax, BxMin, By0, By1, ByMax, ByMin, Bz0, Bz1, Cx0, Cx1, CxMax, CxMin, Cy0, Cy1, CyMax, CyMin, Cz0, Cz1, a, b, begin, blen, box, byteLength, byteOffset, dx, dy, dz, end, found, g, i, j, k, len, len1, len2, len3, length, lines, llen, m, max, min, mode, n, p, p0, p0x, p0y, p0z, p1, p1x, p1y, p1z, p2, p2x, p2y, p2z, p3, p3x, p3y, p3z, points, poly, q, r, ref, splice, t, tlen, triangles, u, v, vertices, vlen, x, xBounds, xMax, xMin, xPoints, y, yBounds, yMax, yMin, yPoints, z;
        mode = options.mode || WebGL2RenderingContext.LINES;
        blen = boxes.length;
        points = [];
        xPoints = [];
        yPoints = [];
        xBounds = [];
        yBounds = [];
        ({r, g, b, a} = boxes.at(i = 0));
        while (i < blen) {
          box = boxes[i++];
          vertices = [];
          if (box.mode === WebGL2RenderingContext.TRIANGLES) {
            triangles = box.slice(0);
            lines = [];
            tlen = box.length;
            t = 0;
            // ...p0, ...p1, ...p2,
            // ...p0, ...p3, ...p2
            while (t < tlen) {
              p0x = triangles[t++];
              p0y = triangles[t++];
              p0z = triangles[t++];
              p1x = triangles[t++];
              p1y = triangles[t++];
              p1z = triangles[t++];
              p2x = triangles[t++];
              p2y = triangles[t++];
              p2z = triangles[t++];
              t += 3;
              p3x = triangles[t++];
              p3y = triangles[t++];
              p3z = triangles[t++];
              t += 3;
              // ...p0, ...p1, 
              // ...p1, ...p2,

              // ...p0, ...p3, 
              // ...p2, ...p3
              lines.push(p0x, p0y, p0z, p1x, p1y, p1z, p1x, p1y, p1z, p2x, p2y, p2z, p0x, p0y, p0z, p3x, p3y, p3z, p2x, p2y, p2z, p3x, p3y, p3z);
            }
            vertices = lines.slice(0);
            lines = triangles = null;
          } else {
            vertices = box.slice(0);
          }
          vlen = vertices.length;
          j = 0;
          dx = box.attributes.x;
          dy = box.attributes.y;
          dz = box.attributes.z;
          while (j < vlen) {
            x = Math.fround(dx + vertices[j++]);
            y = Math.fround(dy + vertices[j++]);
            z = Math.fround(dz + vertices[j++]);
            if (!xPoints.includes(x)) {
              xPoints.push(x);
            }
            if (!yPoints.includes(y)) {
              yPoints.push(y);
            }
            points.push([x, y, z]);
          }
        }
        for (m = 0, len = xPoints.length; m < len; m++) {
          x = xPoints[m];
          xBounds[x] = [];
        }
        for (n = 0, len1 = yPoints.length; n < len1; n++) {
          y = yPoints[n];
          yBounds[y] = [];
        }
        for (q = 0, len2 = points.length; q < len2; q++) {
          [x, y] = points[q];
          if (!xBounds[x].includes(y)) {
            xBounds[x].push(y);
          }
          if (!yBounds[y].includes(x)) {
            yBounds[y].push(x);
          }
        }
        ref = [xBounds, yBounds];
        for (u = 0, len3 = ref.length; u < len3; u++) {
          p = ref[u];
          for (k in p) {
            v = p[k];
            Object.defineProperty(p, k, {
              configurable: true,
              value: {
                max: Math.max.apply(Math, v),
                min: Math.min.apply(Math, v)
              }
            });
          }
        }
        [xPoints, yPoints, points] = [];
        for (x in xBounds) {
          if (!(!(found = false))) {
            continue;
          }
          for (y in yBounds) {
            ({max, min} = yBounds[y]);
            if (found = 0 === (min - x)) {
              break;
            }
            if (found = 0 === (max - x)) {
              break;
            }
          }
          if (!found) {
            delete xBounds[x];
          }
        }
        for (y in yBounds) {
          if (!(!(found = false))) {
            continue;
          }
          for (x in xBounds) {
            ({max, min} = xBounds[x]);
            if (found = 0 === (min - y)) {
              break;
            }
            if (found = 0 === (max - y)) {
              break;
            }
          }
          if (!found) {
            delete yBounds[y];
          }
        }
        vertices = [];
        for (x in xBounds) {
          ({max, min} = xBounds[x]);
          x = parseFloat(x);
          vertices.push(x, max, 0);
          vertices.push(x, min, 0);
        }
        for (y in yBounds) {
          ({max, min} = yBounds[y]);
          y = parseFloat(y);
          vertices.push(min, y, 0);
          vertices.push(max, y, 0);
        }
        length = vertices.length;
        splice = [];
        i = 0;
        while (i < length) {
          Ax0 = vertices[i++];
          Ay0 = vertices[i++];
          Az0 = vertices[i++];
          Ax1 = vertices[i++];
          Ay1 = vertices[i++];
          Az1 = vertices[i++];
          if (!(Ay0 - Ay1)) { // y'ler esit ise
            AxMin = Math.min(Ax0, Ax1);
            AxMax = Math.max(Ax0, Ax1);
            j = 0;
            while (j < length) {
              Bx0 = vertices[j++];
              By0 = vertices[j++];
              Bz0 = vertices[j++];
              Bx1 = vertices[j++];
              By1 = vertices[j++];
              Bz1 = vertices[j++];
              if (i === j) {
                continue;
              }
              if (Ay0 - By0) { // y'ler esit olmali
                continue;
              }
              if (Bx0 - Bx1) { // B dik bir cizgi olmali
                continue;
              }
              if (Bx0 < AxMin) { // kontrol cizgimizin baslangicindan once olmamali
                continue;
              }
              if (Bx0 > AxMax) { // kontrol cizgimizin bitisinden sonra olmamali
                continue;
              }
              
              // cizginin arada oldugu belli oldu
              // simdi kesim noktasini bulalim
              ByMin = Math.min(By0, By1);
              ByMax = Math.max(By0, By1);
              k = 0;
              while (k < length) {
                Cx0 = vertices[k++];
                Cy0 = vertices[k++];
                Cz0 = vertices[k++];
                Cx1 = vertices[k++];
                Cy1 = vertices[k++];
                Cz1 = vertices[k++];
                if (j === k) {
                  continue;
                }
                if (i === k) {
                  continue;
                }
                if (Cy0 - Cy1) { // duz bir yatay cizgi ariyoruz
                  continue;
                }
                if (Cy0 <= ByMin) { // bizim altimizda olmamali 
                  continue;
                }
                if (Cy0 >= ByMax) { // bizim ustumuzde olmamali 
                  continue;
                }
                CxMin = Math.min(Cx0, Cx1);
                CxMax = Math.max(Cx0, Cx1);
                if (CxMax < Bx0) { // bizden asagida bitmemis olmali
                  continue;
                }
                if (CxMin > Bx0) { // bizden yukarida baslamamis olmali
                  continue;
                }
                
                // bulduk simdi B'nin y degerini C ile degistirebiliriz
                if (CxMax > Bx0) {
                  vertices[j - 5] = Cy0;
                } else if (CxMin < Bx0) {
                  vertices[j - 2] = Cy0;
                }
              }
            }
          }
          if (!(Ax0 - Ax1)) { // x'ler esit ise
            AyMin = Math.min(Ay0, Ay1);
            AyMax = Math.max(Ay0, Ay1);
            j = 0;
            while (j < length) {
              Bx0 = vertices[j++];
              By0 = vertices[j++];
              Bz0 = vertices[j++];
              Bx1 = vertices[j++];
              By1 = vertices[j++];
              Bz1 = vertices[j++];
              if (i === j) {
                continue;
              }
              if (Ax0 - Bx0) { // x'ler esit olmali
                continue;
              }
              if (By0 - By1) { // B düz bir cizgi olmali
                continue;
              }
              if (By0 < AyMin) { // kontrol cizgimizin baslangicindan yukarda olmali
                continue;
              }
              if (By0 > AyMax) { // kontrol cizgimizin bitisinden asagida olmali
                continue;
              }
              
              // cizginin arada oldugu belli oldu
              // simdi kesim noktasini bulalim
              BxMin = Math.min(Bx0, Bx1);
              BxMax = Math.max(Bx0, Bx1);
              k = 0;
              while (k < length) {
                Cx0 = vertices[k++];
                Cy0 = vertices[k++];
                Cz0 = vertices[k++];
                Cx1 = vertices[k++];
                Cy1 = vertices[k++];
                Cz1 = vertices[k++];
                if (j === k) {
                  continue;
                }
                if (i === k) {
                  continue;
                }
                if (Cx0 - Cx1) { // duz bir dik cizgi ariyoruz
                  continue;
                }
                if (Cx0 <= BxMin) { // bizim oncemizde olmamali 
                  continue;
                }
                if (Cx0 >= BxMax) { // bizim sonramizda olmamali 
                  continue;
                }
                CyMin = Math.min(Cy0, Cy1);
                CyMax = Math.max(Cy0, Cy1);
                if (CyMax < By0) { // bizden once bitmemis olmali
                  continue;
                }
                if (CyMin > By0) { // bizden sonra baslamamis olmali
                  continue;
                }
                if ((CyMax === AyMax) && (CyMin === AyMin)) {
                  if ((By0 === CyMin) || (By0 === CyMax)) {
                    continue;
                  }
                  vertices[j - 6] = Cx0;
                }
                if ((CyMin === AyMin) && (AyMax === By0)) {
                  if ((By0 === AyMin) || (By0 === CyMin)) {
                    continue;
                  }
                  vertices[j - 3] = Cx0;
                }
              }
            }
          }
        }
        xMax = yMax = -2e308;
        xMin = yMin = +2e308;
        i = 0;
        x = 0;
        y = 0;
        z = 0;
        while (i < length) {
          dx = vertices[i++];
          dy = vertices[i++];
          dz = vertices[i++];
          if (dx > xMax) {
            xMax = dx;
          }
          if (dx < xMin) {
            xMin = dx;
          }
          if (dy > yMax) {
            yMax = dy;
          }
          if (dy < yMin) {
            yMin = dy;
          }
        }
        x = xMin + .5 * Math.abs(xMax - xMin);
        y = yMin + .5 * Math.abs(yMax - yMin);
        z = this.zOffset;
        i = 0;
        while (i < length) {
          vertices[i++] -= x;
          vertices[i++] -= y;
          vertices[i++] = 0;
        }
        
        // aradaki cizgileri kaldirdik
        if (mode === WebGL2RenderingContext.TRIANGLES) {
          triangles = [];
          lines = vertices.slice(0);
          llen = lines.length;
          t = 0;
          while (t < llen) {
            triangles.push(p = {
              x: lines[t++],
              y: lines[t++],
              z: lines[t++]
            });
          }
          
          // ...p0, ...p1, ...p2,
          // ...p0, ...p3, ...p2
          t = 0;
          llen = triangles.length;
          while (t < llen) {
            p0 = triangles[t++];
            p1 = triangles[t++];
            p2 = triangles[t++];
            p3 = triangles[t++];
            triangles.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p0.x, p0.y, p0.z, p3.x, p3.y, p3.z, p2.x, p2.y, p2.z);
          }
          vertices = triangles.slice(llen);
          lines = triangles = null;
        }
        poly = verticesBufferArray.malloc(vertices);
        length = 7;
        byteLength = length * 4;
        byteOffset = this.shapes.length * byteLength;
        begin = byteOffset / 4;
        end = begin + length;
        bindBufferInstances();
        Object.defineProperty(poly, "attributes", {
          value: this.attributes.subarray(begin, end)
        });
        Object.defineProperty(poly, "vertexPositionPointer", {
          value: gl.vertexAttribPointer.bind(gl, this.a_Position, 3, gl.FLOAT, 0, byteLength, byteOffset)
        });
        Object.defineProperty(poly, "vertexColorPointer", {
          value: gl.vertexAttribPointer.bind(gl, this.a_Color, 4, gl.FLOAT, 0, byteLength, byteOffset + 12)
        });
        Object.defineProperty(poly, "drawArraysInstanced", {
          value: gl.drawArraysInstanced.bind(gl, mode, poly.start, poly.count, 1)
        });
        Object.defineProperty(poly, "bufferSubData", {
          value: gl.bufferSubData.bind(gl, gl.ARRAY_BUFFER, byteOffset, this.attributes, begin, end)
        });
        poly.attributes.set([x, y, z, r, g, b, a]);
        poly.bufferSubData();
        poly.vertexColorPointer();
        poly.vertexPositionPointer();
        renderQueue.push(poly.vertexColorPointer);
        renderQueue.push(poly.vertexPositionPointer);
        renderQueue.push(poly.drawArraysInstanced);
        this.view.bind(poly.attributes, "x", 0, Float32Array, poly.bufferSubData);
        this.view.bind(poly.attributes, "y", 4, Float32Array, poly.bufferSubData);
        this.view.bind(poly.attributes, "z", 8, Float32Array, poly.bufferSubData);
        this.view.bind(poly.attributes, "r", 12, Float32Array, poly.bufferSubData);
        this.view.bind(poly.attributes, "g", 16, Float32Array, poly.bufferSubData);
        this.view.bind(poly.attributes, "b", 20, Float32Array, poly.bufferSubData);
        this.view.bind(poly.attributes, "a", 24, Float32Array, poly.bufferSubData);
        return this.shapes[this.shapes.length] = poly;
      },
      rect: function(options = {}) {
        var a, b, begin, byteLength, byteOffset, end, g, h, length, mode, p0, p1, p2, p3, r, rect, vertices, w, x, y, z;
        ({
          mode = WebGL2RenderingContext.LINES,
          x = 0,
          y = 0,
          z = this.zOffset,
          r = 0,
          g = 0,
          b = 0,
          a = 1,
          width: w,
          height: h
        } = {...options});
        h || (h = w);
        p0 = Float32Array.of(0, 0, 0);
        p1 = Float32Array.of(w, 0, 0);
        p2 = Float32Array.of(w, h, 0);
        p3 = Float32Array.of(0, h, 0);
        if (mode === WebGL2RenderingContext.LINES) {
          vertices = Float32Array.of(...p0, ...p1, ...p1, ...p2, ...p0, ...p3, ...p2, ...p3);
        } else if (mode === WebGL2RenderingContext.TRIANGLES) {
          vertices = Float32Array.of(...p0, ...p1, ...p2, ...p0, ...p3, ...p2);
        }
        rect = verticesBufferArray.malloc(vertices);
        length = 7;
        byteLength = length * 4;
        byteOffset = this.shapes.length * byteLength;
        begin = byteOffset / 4;
        end = begin + length;
        bindBufferInstances();
        Object.defineProperty(rect, "mode", {
          value: mode
        });
        Object.defineProperty(rect, "attributes", {
          value: this.attributes.subarray(begin, end)
        });
        Object.defineProperty(rect, "vertexPositionPointer", {
          value: gl.vertexAttribPointer.bind(gl, this.a_Position, 3, gl.FLOAT, 0, byteLength, byteOffset)
        });
        Object.defineProperty(rect, "vertexColorPointer", {
          value: gl.vertexAttribPointer.bind(gl, this.a_Color, 4, gl.FLOAT, 0, byteLength, byteOffset + 12)
        });
        Object.defineProperty(rect, "drawArraysInstanced", {
          value: gl.drawArraysInstanced.bind(gl, mode, rect.start, rect.count, 1)
        });
        Object.defineProperty(rect, "bufferSubData", {
          value: gl.bufferSubData.bind(gl, gl.ARRAY_BUFFER, byteOffset, this.attributes, begin, end)
        });
        rect.attributes.set([x, y, z, r, g, b, a]);
        rect.bufferSubData();
        rect.vertexColorPointer();
        rect.vertexPositionPointer();
        renderQueue.push(rect.vertexColorPointer);
        renderQueue.push(rect.vertexPositionPointer);
        renderQueue.push(rect.drawArraysInstanced);
        this.view.bind(rect.attributes, "x", 0, Float32Array, rect.bufferSubData);
        this.view.bind(rect.attributes, "y", 4, Float32Array, rect.bufferSubData);
        this.view.bind(rect.attributes, "z", 8, Float32Array, rect.bufferSubData);
        this.view.bind(rect.attributes, "r", 12, Float32Array, rect.bufferSubData);
        this.view.bind(rect.attributes, "g", 16, Float32Array, rect.bufferSubData);
        this.view.bind(rect.attributes, "b", 20, Float32Array, rect.bufferSubData);
        this.view.bind(rect.attributes, "a", 24, Float32Array, rect.bufferSubData);
        Object.defineProperty(rect, "boundingRect", {
          value: function() {
            var depth, height, i, width, xMax, xMin, yMax, yMin, zMax, zMin;
            length = this.length;
            i = 0;
            xMax = yMax = zMax = -2e308;
            xMin = yMin = zMin = +2e308;
            while (i < length) {
              x = this[i++];
              y = this[i++];
              z = this[i++];
              if (xMax < x) {
                xMax = x;
              }
              if (xMin > x) {
                xMin = x;
              }
              if (yMax < y) {
                yMax = y;
              }
              if (yMin > y) {
                yMin = y;
              }
              if (zMax < z) {
                zMax = z;
              }
              if (zMin > z) {
                zMin = z;
              }
            }
            width = xMax - xMin;
            height = yMax - yMin;
            depth = zMax - zMin;
            xMax += this.attributes.x;
            xMin += this.attributes.x;
            yMax += this.attributes.y;
            yMin += this.attributes.y;
            zMax += this.attributes.z;
            zMin += this.attributes.z;
            return {xMax, xMin, width, yMax, yMin, height, zMax, zMin, depth};
          }
        });
        return this.shapes[this.shapes.length] = rect;
      }
    }
  });
  Object.assign(self, {
    text: {
      vertices: font,
      letters: {},
      chars: [],
      charCount: 0,
      letterCount: 0,
      byteLength: 0,
      byteOffset: 0,
      lineCount: 0,
      lineWidth: 100,
      lineHeight: 10,
      letterSpace: 1,
      spaceWidth: 5,
      fontSize: 12,
      monospace: true,
      width: -300,
      height: +300,
      depth: -200,
      length: 0,
      buffer: buf = new ArrayBuffer(4096 * 4096),
      view: new DataView(buf),
      attributes: new Float32Array(buf),
      a_Position: a_Position,
      a_Color: a_Color,
      draw: function() {
        var begin, byteOffset, end, i, instances, len, length, m, ref;
        bindBufferInstances();
        ref = this.chars;
        for (i = m = 0, len = ref.length; m < len; i = ++m) {
          instances = ref[i];
          if (instances.needsRebind) {
            instances.needsRebind = 0;
            byteOffset = instances.byteOffset;
            length = instances.length * 7;
            begin = byteOffset / 4;
            end = begin + length;
            instances.vertexPositionPointer = gl.vertexAttribPointer.bind(gl, this.a_Position, 3, gl.FLOAT, 0, 28, byteOffset);
            instances.vertexColorPointer = gl.vertexAttribPointer.bind(gl, this.a_Color, 4, gl.FLOAT, 0, 28, byteOffset + 12);
            instances.drawArraysInstanced = gl.drawArraysInstanced.bind(gl, gl.TRIANGLES, instances.model.start, instances.model.count, instances.length);
            instances.bufferSubData = gl.bufferSubData.bind(gl, gl.ARRAY_BUFFER, byteOffset, this.attributes, begin, end);
          }
          if (instances.needsUpload) {
            instances.needsUpload = 0;
            instances.bufferSubData();
          }
          instances.vertexColorPointer();
          instances.vertexPositionPointer();
          instances.drawArraysInstanced();
          0;
        }
        return 0;
      },
      char: function(letter) {
        var attributes, base, byteOffset, charCode, chars, dview, i, index, instance, instances, ival, len, len1, length, m, n, offset, ref, ref1, vertices, xMax, xMin, yMax, yMin;
        if (!`${letter}`.trim()) {
          return this.width += this.spaceWidth;
        }
        this.length += 7;
        this.charCount += 1;
        this.byteLength += 28;
        //@buffer.resize @byteLength
        dview = this.view;
        chars = (base = this.letters)[letter] || (base[letter] = this.chars[index = this.chars.length] = new Array());
        charCode = letter.charCodeAt(0);
        if (!Object.hasOwn(chars, "index")) {
          Object.defineProperties(chars, {
            byteLength: {
              get: function() {
                return this.length * 28;
              }
            },
            byteOffset: {
              value: 0,
              writable: true
            },
            needsUpload: {
              value: 1,
              writable: true
            },
            needsRebind: {
              value: 1,
              writable: true
            },
            needsColor: {
              value: 1,
              writable: true
            },
            index: {
              value: index
            },
            letter: {
              value: letter
            },
            charCode: {
              value: charCode
            },
            getColor: {
              value: function(offset = 0) {
                return dview.getFloat32(this.byteOffset + offset + 12, iLE);
              }
            },
            setColor: {
              value: function(offset = 0, value) {
                this.needsColor = true;
                this.needsUpload = true;
                return dview.setFloat32(this.byteOffset + offset + 12, value, iLE);
              }
            },
            getPosition: {
              value: function(offset = 0) {
                return dview.getFloat32(this.byteOffset + offset, iLE);
              }
            },
            setPosition: {
              value: function(offset = 0, value) {
                this.needsUpload = true;
                return dview.setFloat32(this.byteOffset + offset, value, iLE);
              }
            },
            setColorAll: {
              value: function(rgba = []) {
                var c, ins, len, m, results, v, vc, vi;
                vc = "rgba".split("");
                results = [];
                for (vi = m = 0, len = rgba.length; m < len; vi = ++m) {
                  v = rgba[vi];
                  if (c = vc[vi]) {
                    results.push((function() {
                      var len1, n, ref, results1;
                      ref = this;
                      results1 = [];
                      for (n = 0, len1 = ref.length; n < len1; n++) {
                        ins = ref[n];
                        results1.push(ins[c] = v);
                      }
                      return results1;
                    }).call(this));
                  }
                }
                return results;
              }
            }
          });
          chars.byteOffset = this.byteLength - 28;
          vertices = this.vertices[charCode];
          i = vertices.length;
          xMin = yMin = +2e308;
          xMax = yMax = -2e308;
          while (i -= 3) {
            if (!(null !== (ival = vertices[i]))) {
              continue;
            }
            if (ival > xMax) {
              xMax = ival;
            }
            if (ival > yMax) {
              yMax = ival;
            }
            if (xMin > ival) {
              xMin = ival;
            }
            if (yMin > ival) {
              yMin = ival;
            }
          }
          Object.defineProperties(chars, {
            charCode: {
              value: charCode
            },
            size: {
              value: {xMax, xMin, yMax, yMin}
            },
            width: {
              value: xMax + xMin
            },
            height: {
              value: yMax + yMin
            },
            left: {
              value: xMin
            },
            model: {
              value: verticesBufferArray.malloc(vertices)
            }
          });
          if (vertices.length % 3) {
            throw [
              {
                MOD_TRIANGLE: letter
              }
            ];
          }
          this.letterCount += 1;
        }
        chars[index = chars.length] = instance = chars.model.instance({});
        offset = 28 * index;
        Object.defineProperty(instance, "x", {
          get: chars.getPosition.bind(chars, offset),
          set: chars.setPosition.bind(chars, offset)
        });
        Object.defineProperty(instance, "y", {
          get: chars.getPosition.bind(chars, offset + 4),
          set: chars.setPosition.bind(chars, offset + 4)
        });
        Object.defineProperty(instance, "z", {
          get: chars.getPosition.bind(chars, offset + 8),
          set: chars.setPosition.bind(chars, offset + 8)
        });
        Object.defineProperty(instance, "r", {
          get: chars.getColor.bind(chars, offset),
          set: chars.setColor.bind(chars, offset)
        });
        Object.defineProperty(instance, "g", {
          get: chars.getColor.bind(chars, offset + 4),
          set: chars.setColor.bind(chars, offset + 4)
        });
        Object.defineProperty(instance, "b", {
          get: chars.getColor.bind(chars, offset + 8),
          set: chars.setColor.bind(chars, offset + 8)
        });
        Object.defineProperty(instance, "a", {
          get: chars.getColor.bind(chars, offset + 12),
          set: chars.setColor.bind(chars, offset + 12)
        });
        attributes = [];
        ref = this.chars;
        for (m = 0, len = ref.length; m < len; m++) {
          ({byteOffset, length} = ref[m]);
          attributes.push.apply(attributes, new Float32Array(this.buffer, byteOffset, length * 7));
        }
        this.attributes.set(attributes);
        byteOffset = 0;
        ref1 = this.chars;
        for (n = 0, len1 = ref1.length; n < len1; n++) {
          instances = ref1[n];
          instances.byteOffset = byteOffset;
          instances.needsUpload = 1;
          instances.needsRebind = 1;
          instances.needsColor = 1;
          byteOffset = byteOffset + (instances.length * 28);
        }
        instance.x = !this.monospace ? this.width + chars.left : this.width + this.letterSpace - chars.width / 2;
        instance.y = this.height;
        instance.z = this.depth;
        instance.r = 1;
        instance.g = 1;
        instance.b = 1;
        instance.a = 1;
        this.width += !this.monospace ? this.letterSpace + chars.width : this.letterSpace * 8;
        attributes = null;
        return instance;
      },
      write: function(text, delays = 40) {
        var char, chars, i, l, len, len1, len2, m, n, prop, q, ref, ref1, ref2;
        chars = [];
        ref = `${text}`;
        for (i = m = 0, len = ref.length; m < len; i = ++m) {
          char = ref[i];
          chars[i] = this.char(char);
        }
        ref1 = "xyz".split("");
        for (n = 0, len1 = ref1.length; n < len1; n++) {
          prop = ref1[n];
          (function(key) {
            return Object.defineProperty(this, key, {
              get: function() {
                var $, len2, o, q, ref2;
                log(this);
                $ = 0;
                ref2 = this;
                for (i = q = 0, len2 = ref2.length; q < len2; i = ++q) {
                  o = ref2[i];
                  $ = o[key] + $;
                }
                return $ / i;
              },
              set: function(v) {
                var $, len2, o, q, ref2;
                $ = this[key];
                ref2 = this;
                for (q = 0, len2 = ref2.length; q < len2; q++) {
                  o = ref2[q];
                  o[key] += v - $;
                }
                return this;
              }
            });
          }).call(chars, prop);
        }
        return chars;
        if (delays > 0) {
          this.delay = clearTimeout(this.delay) || setTimeout(() => {
            var len2, letter, q, ref2, results;
            ref2 = `${text}`;
            results = [];
            for (q = 0, len2 = ref2.length; q < len2; q++) {
              letter = ref2[q];
              results.push(chars.push(this.char(letter)));
            }
            return results;
          }, delays);
        } else {
          ref2 = `${text}`;
          for (q = 0, len2 = ref2.length; q < len2; q++) {
            l = ref2[q];
            chars.push(this.char(l));
          }
        }
        return chars;
      }
    }
  });
  gridX = -175;
  gridY = 300;
  BYTES_PER_LINE = 4;
  bitBoxSize = (innerWidth / 2) / (BYTES_PER_LINE * 8);
  bitsOffset = 0;
  bitOffsetX = 0;
  bitOffsetY = 0;
  width = bitBoxSize;
  height = bitBoxSize * 1.38;
  bitBoxes = [];
  byteDataGrid = function(bitLength = 0, options = {}) {
    var b, box, boxes, g, len, m, prop, r, ref, x, y;
    boxes = [];
    r = Math.randBit();
    g = Math.randBit();
    b = Math.random();
    if (!r && !g && !b) {
      g = 1;
    }
    while (bitLength--) {
      bitsOffset++;
      x = bitOffsetX + gridX;
      y = bitOffsetY + gridY;
      boxes.push(box = line.rect(Object.assign(options, {x, y, r, g, b, width, height})));
      if (bitsOffset % 2 === 0) {
        bitOffsetY += height;
        bitOffsetX += width;
      } else {
        bitOffsetY -= height;
      }
      if (bitsOffset % 32 === 0) {
        bitOffsetX -= width * 16;
        bitOffsetY -= height * 2;
      }
      continue;
    }
    ref = "xyz".split("");
    for (m = 0, len = ref.length; m < len; m++) {
      prop = ref[m];
      (function(key) {
        return Object.defineProperty(this, key, {
          get: function() {
            var $, i, len1, n, o, ref1;
            $ = 0;
            ref1 = this;
            for (i = n = 0, len1 = ref1.length; n < len1; i = ++n) {
              o = ref1[i];
              $ = o.attributes[key] + $;
            }
            return $ / i;
          },
          set: function(v) {
            var $, len1, n, o, ref1;
            $ = this[key];
            ref1 = this;
            for (n = 0, len1 = ref1.length; n < len1; n++) {
              o = ref1[n];
              o.attributes[key] += v - $;
            }
            return this;
          }
        });
      }).call(boxes, prop);
    }
    return bitBoxes[bitBoxes.length] = boxes;
  };
  text.width += 125;
  zero = text.width;
  writeDHCPPacket = function(arrayBuffer) {
    var byteHex, length, offset, packet;
    packet = new Uint8Array(arrayBuffer);
    length = packet.byteLength;
    offset = 0;
    (function() {
      var dhcpBox;
      return dhcpBox = {
        msgType: byteDataGrid(1 * 8, {
          mode: WebGL2RenderingContext.TRIANGLES
        }),
        hwType: byteDataGrid(1 * 8, {
          mode: WebGL2RenderingContext.TRIANGLES
        }),
        hlen: byteDataGrid(1 * 8, {
          mode: WebGL2RenderingContext.TRIANGLES
        }),
        hops: byteDataGrid(1 * 8, {
          mode: WebGL2RenderingContext.TRIANGLES
        }),
        xid: byteDataGrid(4 * 8, {
          mode: WebGL2RenderingContext.TRIANGLES
        })
      };
    });
    byteHex = {
      msgType: text.write((packet[offset++].toString(16)).padStart(2, "0"))
    };
    return log(byteHex.msgType.x += 50);
  };
  init = function() {
    (function()/* viewport */ {
      Object.assign(gl.canvas, {
        width: innerWidth * devicePixelRatio,
        height: innerHeight * devicePixelRatio
      }).setAttribute("style", [`width=${CSS.px(innerWidth)}`, `height=${CSS.px(innerHeight)}`].join(";"));
      return gl.viewport(0, 0, innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
    })();
    glClearColor();
    glClear();
    bindBufferInstances();
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribDivisor(a_Position, 1);
    gl.enableVertexAttribArray(a_Color);
    gl.vertexAttribDivisor(a_Color, 1);
    bindBufferVertices();
    gl.enableVertexAttribArray(a_Vertices);
    gl.vertexAttribPointer(a_Vertices, 3, gl.FLOAT, false, 0, 0); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
    if (!sessionStorage.viewMatrix) {
      viewMatrix.store();
    }
    viewMatrix.restore();
    self.addEventListener("keydown", function({key}) {
      if (key === "Escape") {
        return viewMatrix.reset();
      }
    });
    ux = new UX(gl.canvas, viewMatrix);
    //await delay 3000
    //ws = new TCPSocket( "192.168.2.2", 8000, "ws:" )
    //ws . onmessage = writeDHCPPacket
    return writeDHCPPacket(dump.slice(0, 64));
  };
  init();
  // @url https://easings.net/#easeOutBack    
  easing = {
    easeOutBack: function(x) {
      var c1, c3;
      c1 = 1.70158;
      c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    easeInOutCirc: function(x) {
      if (x < 0.5) {
        return (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2;
      }
      return (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },
    easeOutCirc: function(x) {
      return Math.sqrt(1 - Math.pow(x - 1, 2));
    },
    easeOutQuint: function(x) {
      return 1 - Math.pow(1 - x, 5);
    }
  };
  self.scrollDump = function(height, step = 120, fn = "easeOutQuint") {
    var i, queueIndex, steps;
    steps = function(l) {
      var arr, i;
      arr = new Float32Array(step);
      i = -1;
      while (++i < step) {
        arr[i] = easing[fn](i / step) * height + l.y;
      }
      return arr;
    };
    i = -1;
    return queueIndex = -1 + renderQueue.push(function() {
      var instance, l, len, len1, m, n, ref;
      if (++i < step) {
        ref = text.chars;
        for (m = 0, len = ref.length; m < len; m++) {
          l = ref[m];
          for (n = 0, len1 = l.length; n < len1; n++) {
            instance = l[n];
            if (!instance.steps) {
              instance.steps = steps(instance);
            }
            instance.y = instance.steps[i];
          }
        }
        return 0;
      }
      return renderQueue.splice(queueIndex, 1);
    });
  };
  i = 0;
  j = 1;
  render = function(t) {
    var job, len, m;
    text.draw();
    for (m = 0, len = renderQueue.length; m < len; m++) {
      job = renderQueue[m];
      job(t);
    }
    requestAnimationFrame(render);
    if (!(++i % 240)) {
      return j *= -1;
    }
  };
  return render(0);
})();
