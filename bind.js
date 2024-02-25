var Bind, buf, u32;

export var ZoomEvent = class ZoomEvent extends CustomEvent {
  constructor(detail) {
    super("zoom", {detail});
  }

};

export var LookEvent = class LookEvent extends CustomEvent {
  constructor(detail) {
    super("look", {detail});
  }

};

export var PickEvent = class PickEvent extends CustomEvent {
  constructor(detail) {
    super("pick", {detail});
  }

};

export var ReleaseEvent = class ReleaseEvent extends CustomEvent {
  constructor(detail) {
    super("free", {detail});
  }

};

export var TurnEvent = class TurnEvent extends CustomEvent {
  constructor(detail) {
    super("turn", {detail});
  }

};

export var DragEvent = class DragEvent extends CustomEvent {
  constructor(detail) {
    super("drag", {detail});
  }

};

export var MoveEvent = class MoveEvent extends CustomEvent {
  constructor(detail) {
    super("move", {detail});
  }

};

buf = new SharedArrayBuffer(1e5);

u32 = new Uint32Array(buf);

Atomics.store(u32, 0, 4);

self.malloc = function(byteLength, typedArray) {
  var length, offset;
  offset = Atomics.add(u32, 0, byteLength);
  length = byteLength / typedArray.BYTES_PER_ELEMENT;
  return new typedArray(buf, offset, length);
};

export default Bind = (function() {
  class Bind extends EventTarget {
    constructor(canvas, buffer = new SharedArrayBuffer(256)) {
      var events, positions;
      Object.assign(super(), {canvas, buffer});
      Object.defineProperties(this, {
        events: {
          value: events = new Uint8Array(this.buffer, 0, 12)
        },
        positions: {
          value: positions = new Float32Array(this.buffer, 12, 10)
        }
      });
      Object.defineProperties(this, {
        press: {
          set: function() {
            return Atomics.store(events, this.button = arguments[0], 1);
          }
        },
        release: {
          set: function() {
            return Atomics.store(events, arguments[0], 0);
          }
        },
        rotating: {
          get: function() {
            return this.looking && Atomics.load(events, 0);
          }
        },
        draging: {
          get: function() {
            return this.looking && Atomics.load(events, 2);
          }
        },
        looking: {
          get: function() {
            return Atomics.load(events, 11);
          },
          set: function() {
            if (!Atomics.store(events, 11, arguments[0])) {
              return;
            }
            return requestIdleCallback(function() {
              return Atomics.store(events, 11, 0);
            });
          }
        },
        zooming: {
          get: function() {
            return Atomics.load(events, 10);
          },
          set: function() {
            if (!Atomics.store(events, 10, arguments[0])) {
              return;
            }
            return requestIdleCallback(function() {
              return Atomics.store(events, 10, 0);
            });
          }
        },
        dblclick: {
          get: function() {
            return Atomics.load(events, 9);
          },
          set: function() {
            Atomics.store(events, 9, 1);
            return requestIdleCallback(function() {
              return Atomics.store(events, 9, 0);
            });
          }
        },
        click: {
          get: function() {
            return Atomics.load(events, 8);
          },
          set: function() {
            Atomics.store(events, 8, 1);
            return requestIdleCallback(function() {
              return Atomics.store(events, 8, 0);
            });
          }
        },
        button: {
          get: function() {
            return Atomics.load(events, 7) - 10;
          },
          set: function() {
            this.click = Atomics.store(events, 7, arguments[0] + 10);
            return requestIdleCallback(function() {
              return Atomics.store(events, 7, 0);
            });
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
            this.sy = arguments[0];
            return this.sz = arguments[0] / 1e2;
          }
        },
        x: {
          get: function() {
            return positions[0];
          },
          set: function() {
            return positions[0] = arguments[0];
          }
        },
        dx: {
          get: function() {
            return positions[1];
          },
          set: function() {
            return positions[1] = arguments[0];
          }
        },
        rx: {
          get: function() {
            return positions[2];
          },
          set: function() {
            return positions[2] = arguments[0];
          }
        },
        sx: {
          get: function() {
            return positions[3];
          },
          set: function() {
            return positions[3] = arguments[0];
          }
        },
        y: {
          get: function() {
            return positions[5];
          },
          set: function() {
            return positions[5] = arguments[0];
          }
        },
        dy: {
          get: function() {
            return positions[6];
          },
          set: function() {
            return positions[6] = arguments[0];
          }
        },
        ry: {
          get: function() {
            return positions[7];
          },
          set: function() {
            return positions[7] = arguments[0];
          }
        },
        sy: {
          get: function() {
            return positions[8];
          },
          set: function() {
            return positions[8] = arguments[0];
          }
        },
        sz: {
          get: function() {
            return positions[9];
          },
          set: function() {
            return positions[9] = arguments[0];
          }
        }
      });
      this.listen();
    }

    listen() {
      this.width = this.canvas.getBoundingClientRect().width;
      this.height = this.canvas.getBoundingClientRect().height;
      this.document = this.canvas.ownerDocument;
      this.canvas.addEventListener("contextmenu", function(e) {
        return e.preventDefault();
      });
      this.canvas.addEventListener("wheel", this.onwheel.bind(this), {
        passive: true
      });
      this.canvas.addEventListener("pointermove", this.onmove.bind(this), {
        passive: true
      });
      this.canvas.addEventListener("pointerdown", this.ondown.bind(this));
      this.canvas.addEventListener("pointerup", this.onup.bind(this));
      this.canvas.addEventListener("dblclick", this.ondbl.bind(this));
      this.document.addEventListener("keydown", this.onkeydown.bind(this));
      return this.document.addEventListener("keyup", this.onkeyup.bind(this));
    }

    onwheel({deltaX, deltaY}) {
      this.deltaX = deltaX;
      this.deltaY = deltaY;
      return this.zooming = 1;
    }

    onmove({offsetX, offsetY}) {
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      return this.looking = 1;
    }

    onup({button}) {
      return this.release = button;
    }

    ondbl({button}) {
      return this.dblclick = button;
    }

    ondown({button}) {
      return this.press = button;
    }

    onkeydown(e) {
      var dx, dy, dz, j;
      this.shiftKey = e.shiftKey;
      this.altKey = e.altKey;
      this.metaKey = e.metaKey;
      this.ctrlKey = e.ctrlKey;
      this.pressing[e.code] = e.keyCode;
      this.walking = false;
      this.jumping = false;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this.forward = this.walking = true;
          break;
        case "KeyS":
        case "ArrowDown":
          this.backward = this.walking = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.left = this.walking = true;
          break;
        case "KeyD":
        case "ArrowRight":
          this.right = this.walking = true;
          break;
        case "Space":
          this.jump = this.jumping = true;
      }
      
      //?          1
      //?    14        12
      //? 4        0        2
      //?   -14       -12
      //?         -1
      j = this.jumping ? -1 : 0;
      [this.angle = 0, this.direction = 0, [dx, dz, dy]] = this.right ? this.forward ? [this.deg45, 12, [1, 1, j]] : this.backward ? [this.deg135, -12, [1, -1, j]] : [this.deg90, 2, [1, 0, j]] : this.left ? this.forward ? [this.deg315, 14, [-1, 1, j]] : this.backward ? [this.deg215, -14, [-1, -1, j]] : [this.deg270, 4, [-1, 0, j]] : this.backward ? [this.deg180, -1, [0, -1, j]] : this.forward ? [0, 1, [0, 1, j]] : [0, 0, [0, 0, j]];
      this.dx = dx * 10;
      this.dy = dy * 10;
      this.dz = dz * 10;
      return this.dispatchEvent(new MoveEvent({dx: this.dx, dy: this.dy, dz: this.dz}));
    }

    onkeyup(e) {
      delete this.pressing[e.code];
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          this.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          this.right = false;
          break;
        case "Space":
          this.jump = false;
      }
      switch (e.key) {
        case "Shift":
          this.shiftKey = false;
          break;
        case "Alt":
          this.altKey = false;
          break;
        case "Meta":
          this.metaKey = false;
          break;
        case "Control":
          this.ctrlKey = false;
      }
      if (!this.forward && !this.backward && !this.right && !this.left) {
        this.walking = false;
      }
      if (!this.jump) {
        return this.jumping = false;
      }
    }

  };

  Bind.prototype.pressing = {};

  Bind.prototype.shiftKey = false;

  Bind.prototype.altKey = false;

  Bind.prototype.ctrlKey = false;

  Bind.prototype.metaKey = false;

  Bind.prototype.walking = false;

  Bind.prototype.moving = false;

  Bind.prototype.jumping = false;

  Object.defineProperties(Bind.prototype, {
    isMoving: {
      get: function() {
        return this.walking !== false;
      }
    },
    isJumping: {
      get: function() {
        return this.jumping !== false;
      }
    },
    isLooking: {
      get: function() {
        return this.looking !== false;
      }
    }
  });

  Bind.prototype.deg45 = Math.PI / 4;

  Bind.prototype.deg90 = Math.PI / 2;

  Bind.prototype.deg135 = Math.PI / 2 + Math.PI / 4;

  Bind.prototype.deg180 = Math.PI;

  Bind.prototype.deg215 = Math.PI + Math.PI / 4;

  Bind.prototype.deg270 = Math.PI + Math.PI / 2;

  Bind.prototype.deg315 = Math.PI + Math.PI / 2 + Math.PI / 4;

  return Bind;

}).call(this);
