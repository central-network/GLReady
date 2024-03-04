var Bind;

export default Bind = (function() {
  class Bind extends EventTarget {
    //don't split in/out, no need to check is reached top
    linearInOut(v) {
      return [...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ...[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]].map(function(d) {
        return v * d / 10;
      });
    }

    constructor(canvas, buffer = new SharedArrayBuffer(80)) {
      var byteOffset, document, events, values;
      super();
      if (!isNaN(buffer.byteOffset)) {
        ({buffer, byteOffset} = buffer);
      } else {
        byteOffset = 0;
      }
      this.events = events = new Uint32Array(buffer, byteOffset, 24); //? 96 bytes
      this.values = values = new Float32Array(buffer, byteOffset + 96, 14); //? 56 bytes
      //> 152 bytes
      Object.defineProperties(this, {
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
            return this.sz = (this.sy = arguments[0]) / 100;
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
          set: function() {
            return values[1] = arguments[0];
          }
        },
        rx: {
          get: function() {
            return values[2];
          },
          set: function() {
            return values[2] = arguments[0];
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
          set: function() {
            return values[4] = arguments[0];
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
        dy: {
          get: function() {
            return values[6];
          },
          set: function() {
            return values[6] = arguments[0];
          }
        },
        ry: {
          get: function() {
            return values[7];
          },
          set: function() {
            return values[7] = arguments[0];
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
        vz: {
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
      canvas.addEventListener("pointerup", this.pointerup.bind(this));
      canvas.addEventListener("pointermove", this.pointermove.bind(this), {
        passive: !0
      });
      canvas.addEventListener("pointerdown", this.pointerdown.bind(this));
      canvas.addEventListener("dblclick", this.doubleclick.bind(this));
      canvas.addEventListener("wheel", this.wheel.bind(this), {
        passive: !0
      });
      canvas.addEventListener("contextmenu", this.contextmenu.bind(this));
      document = canvas.ownerDocument;
      document.addEventListener("keyup", this.keyup.bind(this));
      document.addEventListener("keydown", this.keydown.bind(this));
      this.factor = 5;
      null;
    }

    contextmenu(e) {
      return e.preventDefault();
    }

    wheel(e) {
      ({deltaX: this.deltaX, deltaY: this.deltaY} = e);
      return this.zooming = 1;
    }

    pointermove(e) {
      ({offsetX: this.offsetX, offsetY: this.offsetY} = e);
      return this.looking = 1;
    }

    pointerup(e) {
      return this.release = e.button;
    }

    doubleclick(e) {
      return this.dblclick = e.button;
    }

    pointerdown(e) {
      return this.press = e.button;
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
      [this.vx, this.vz] = this.right ? this.forward ? [+1, +1] : this.backward ? [+1, -1] : [+1, 0] : this.left ? this.forward ? [-1, +1] : this.backward ? [-1, -1] : [-1, 0] : this.backward ? [0, -1] : this.forward ? [0, +1] : [0, 0];
      factor = this.factor;
      if (this.running) {
        factor *= 2;
      }
      this.vx *= factor;
      this.vz *= factor;
      this.vy *= this.factor;
      return null;
    }

  };

  Bind.byteLength = 256;

  return Bind;

}).call(this);
