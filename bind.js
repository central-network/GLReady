var Bind;

export default Bind = class Bind extends EventTarget {
  constructor(canvas, buffer = new SharedArrayBuffer(256)) {
    var document, events, positions;
    super();
    events = new Uint8Array(buffer, 0, 24);
    positions = new Float32Array(buffer, 24, 16);
    Object.defineProperties(this, {
      press: {
        set: function() {
          return Atomics.store(events, this.click = arguments[0], 1);
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
      moving: {
        get: function() {
          return Atomics.load(events, 12);
        },
        set: function() {
          return Atomics.store(events, 12, arguments[0]);
        }
      },
      jumping: {
        get: function() {
          return Atomics.load(events, 19);
        },
        set: function() {
          return Atomics.store(events, 19, arguments[0]);
        }
      },
      running: {
        get: function() {
          return this.moving && this.shift;
        }
      },
      shift: {
        get: function() {
          return Atomics.load(events, 20);
        },
        set: function() {
          return Atomics.store(events, 20, arguments[0]);
        }
      },
      alt: {
        get: function() {
          return Atomics.load(events, 21);
        },
        set: function() {
          return Atomics.store(events, 21, arguments[0]);
        }
      },
      ctrl: {
        get: function() {
          return Atomics.load(events, 22);
        },
        set: function() {
          return Atomics.store(events, 22, arguments[0]);
        }
      },
      meta: {
        get: function() {
          return Atomics.load(events, 23);
        },
        set: function() {
          return Atomics.store(events, 23, arguments[0]);
        }
      },
      forward: {
        get: function() {
          return Atomics.load(events, 13);
        },
        set: function() {
          return Atomics.store(events, 13, arguments[0]);
        }
      },
      backward: {
        get: function() {
          return Atomics.load(events, 14);
        },
        set: function() {
          return Atomics.store(events, 14, arguments[0]);
        }
      },
      left: {
        get: function() {
          return Atomics.load(events, 15);
        },
        set: function() {
          return Atomics.store(events, 15, arguments[0]);
        }
      },
      right: {
        get: function() {
          return Atomics.load(events, 16);
        },
        set: function() {
          return Atomics.store(events, 16, arguments[0]);
        }
      },
      up: {
        get: function() {
          return Atomics.load(events, 17);
        },
        set: function() {
          return Atomics.store(events, 17, arguments[0]);
        }
      },
      down: {
        get: function() {
          return Atomics.load(events, 18);
        },
        set: function() {
          return Atomics.store(events, 18, arguments[0]);
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
      vx: {
        get: function() {
          return positions[4];
        },
        set: function() {
          return positions[4] = arguments[0];
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
      vy: {
        get: function() {
          return positions[9];
        },
        set: function() {
          return positions[9] = arguments[0];
        }
      },
      sz: {
        get: function() {
          return positions[10];
        },
        set: function() {
          return positions[10] = arguments[0];
        }
      },
      vz: {
        get: function() {
          return positions[11];
        },
        set: function() {
          return positions[11] = arguments[0];
        }
      },
      multiply: {
        get: function() {
          return positions[12];
        },
        set: function() {
          return positions[12] = arguments[0];
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
    this.multiply = 5;
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
    factor = this.multiply;
    if (this.running) {
      factor *= 2;
    }
    this.vx *= factor;
    this.vz *= factor;
    this.vy *= this.multiply;
    return null;
  }

};
