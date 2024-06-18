//`import font from "./ibmplex.json" with { type: "json" }`
//sessionStorage.setItem "font", JSON.stringify font
//fetch("test.dump").then( (r) -> r.blob() ).then( (b) -> b.arrayBuffer() ).then (udp) -> 
//    sessionStorage.setItem "dump", new Uint8Array( udp ).join(" ")
var delay, dump, error, font, log, warn;

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
  powsum: {
    value: function(arr, pow = 2) {
      return [...arr].flat().reduce(function(a, b) {
        return a + Math.pow(b, pow);
      });
    }
  }
});

(function() {
  var M4, TCPSocket, UX, a_Color, a_Position, a_Vertices, arrClearColor, backgroundColor, bindBufferInstances, bindBufferVertices, buf, easing, fshader, gl, glClear, glClearColor, i, iLE, init, instanceCount, instancesBufferArray, j, pointCount, program, render, renderQueue, u_ViewMatrix, ux, verticesBufferArray, verticesOffset, viewMatrix, vshader, writePacket, ws, zero;
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
  iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
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
    line: {}
  });
  Object.assign(self, {
    text: {
      vertices: font,
      letters: {},
      chars: [],
      charCount: 0,
      letterCount: 0,
      byteLength: 0,
      lineCount: 0,
      lineWidth: 100,
      lineHeight: 10,
      letterSpace: 1,
      spaceWidth: 5,
      fontSize: 12,
      monospace: true,
      width: -300,
      height: +300,
      depth: -300,
      length: 0,
      buffer: buf = new ArrayBuffer(1e6 * (12 + 16)),
      view: new DataView(buf),
      attributes: new Float32Array(buf),
      a_Position: a_Position,
      a_Color: a_Color,
      draw: function(force = true) {
        var begin, byteOffset, end, i, instances, k, len, length, ref;
        bindBufferInstances();
        ref = this.chars;
        for (i = k = 0, len = ref.length; k < len; i = ++k) {
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
        var attributes, base, byteOffset, charCode, chars, dview, i, index, instance, instances, ival, k, len, len1, length, m, offset, ref, ref1, vertices, xMax, xMin, yMax, yMin;
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
                var c, ins, k, len, results, v, vc, vi;
                vc = "rgba".split("");
                results = [];
                for (vi = k = 0, len = rgba.length; k < len; vi = ++k) {
                  v = rgba[vi];
                  if (c = vc[vi]) {
                    results.push((function() {
                      var len1, m, ref, results1;
                      ref = this;
                      results1 = [];
                      for (m = 0, len1 = ref.length; m < len1; m++) {
                        ins = ref[m];
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
        offset = +28 * index;
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
        for (k = 0, len = ref.length; k < len; k++) {
          ({byteOffset, length} = ref[k]);
          attributes.push.apply(attributes, new Float32Array(this.buffer, byteOffset, length * 7));
        }
        byteOffset = 0;
        ref1 = this.chars;
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          instances = ref1[m];
          instances.byteOffset = byteOffset;
          instances.needsUpload = 1;
          instances.needsRebind = 1;
          instances.needsColor = 1;
          byteOffset = byteOffset + (instances.length * 28);
        }
        this.attributes.set(attributes);
        instance.x = !this.monospace ? this.width + chars.left : this.width + this.letterSpace - chars.width / 2;
        instance.y = this.height;
        instance.z = this.depth;
        instance.r = Math.random();
        instance.a = 1;
        this.width += !this.monospace ? this.letterSpace + chars.width : this.letterSpace * 8;
        attributes = null;
        return instance;
      },
      write: function(text, delays = 40) {
        var k, l, len, ref;
        if (delays > 0) {
          this.delay = clearTimeout(this.delay) || setTimeout(() => {
            var k, len, letter, ref, results;
            ref = `${text}`;
            results = [];
            for (k = 0, len = ref.length; k < len; k++) {
              letter = ref[k];
              results.push(this.char(letter));
            }
            return results;
          }, delays);
        } else {
          ref = `${text}`;
          for (k = 0, len = ref.length; k < len; k++) {
            l = ref[k];
            this.char(l);
          }
        }
        return 0;
      }
    }
  });
  text.width += 125;
  zero = text.width;
  writePacket = function(packet) {
    var data, length, offset, results;
    data = new Uint8Array(packet);
    length = data.byteLength;
    offset = 0;
    results = [];
    while (offset < length) {
      text.write((data[offset++].toString(16)).padStart(2, "0") + " ", false);
      text.write((data[offset++].toString(16)).padStart(2, "0") + " ", false);
      text.write((data[offset++].toString(16)).padStart(2, "0") + " ", false);
      text.write((data[offset++].toString(16)).padStart(2, "0") + " ", false);
      text.char(" ");
      if (!(offset % 16)) {
        text.height -= 20;
        results.push(text.width = zero);
      } else {
        results.push(void 0);
      }
    }
    return results;
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
    return ux = new UX(gl.canvas, viewMatrix);
  };
  //await delay 3000
  //ws = new TCPSocket( "192.168.2.2", 8000, "ws:" )
  //ws . onmessage = writePacket
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
      var instance, k, l, len, len1, m, ref;
      if (++i < step) {
        ref = text.chars;
        for (k = 0, len = ref.length; k < len; k++) {
          l = ref[k];
          for (m = 0, len1 = l.length; m < len1; m++) {
            instance = l[m];
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
    var job, k, len;
    text.draw();
    for (k = 0, len = renderQueue.length; k < len; k++) {
      job = renderQueue[k];
      job(t);
    }
    requestAnimationFrame(render);
    if (!(++i % 240)) {
      return j *= -1;
    }
  };
  return render(0);
})();
