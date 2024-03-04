var OFFSET_ALT, OFFSET_BACKWARD, OFFSET_CLICK, OFFSET_CTRL, OFFSET_DBLCLICK, OFFSET_DOWN, OFFSET_DRAGING, OFFSET_DX, OFFSET_DY, OFFSET_FACTOR, OFFSET_FORWARD, OFFSET_JUMPING, OFFSET_LEFT, OFFSET_LOOKING, OFFSET_META, OFFSET_MOVING, OFFSET_RIGHT, OFFSET_ROTATING, OFFSET_RX, OFFSET_RY, OFFSET_SHIFT, OFFSET_SX, OFFSET_SY, OFFSET_SZ, OFFSET_TIME, OFFSET_UP, OFFSET_VALUES, OFFSET_VX, OFFSET_VY, OFFSET_VZ, OFFSET_X, OFFSET_Y, OFFSET_ZOOMING;

import Pointer from "./Pointer.js";

OFFSET_MOVING = 4 * 10;

OFFSET_JUMPING = 4 * 11;

OFFSET_SHIFT = 4 * 12;

OFFSET_ALT = 4 * 13;

OFFSET_CTRL = 4 * 14;

OFFSET_META = 4 * 15;

OFFSET_FORWARD = 4 * 16;

OFFSET_BACKWARD = 4 * 17;

OFFSET_LEFT = 4 * 18;

OFFSET_RIGHT = 4 * 19;

OFFSET_UP = 4 * 20;

OFFSET_DOWN = 4 * 21;

OFFSET_LOOKING = 4 * 22;

OFFSET_ZOOMING = 4 * 23;

OFFSET_DBLCLICK = 4 * 24;

OFFSET_CLICK = 4 * 25;

OFFSET_ROTATING = 4 * 26;

OFFSET_DRAGING = 4 * 27;

OFFSET_VALUES = 4 * 30;

OFFSET_X = 4 * 31;

OFFSET_Y = 4 * 32;

OFFSET_DX = 4 * 34;

OFFSET_DY = 4 * 35;

OFFSET_RX = 4 * 37;

OFFSET_RY = 4 * 38;

OFFSET_SX = 4 * 40;

OFFSET_SY = 4 * 41;

OFFSET_SZ = 4 * 42;

OFFSET_VX = 4 * 43;

OFFSET_VY = 4 * 44;

OFFSET_VZ = 4 * 45;

OFFSET_FACTOR = 4 * 46;

OFFSET_TIME = 4 * 47;

export var length = 1 * 64;

export var byteLength = 4 * length;

export var BindClient = (function() {
  class BindClient extends Pointer {
    constructor(ptr) {
      super(ptr);
    }

  };

  BindClient.byteLength = byteLength;

  BindClient.easing = {
    linearInOut: function(v) {
      return [...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ...[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]].map(function(d) {
        return v * d / 10;
      });
    }
  };

  Object.defineProperties(BindClient.prototype, {
    moving: {
      get: function() {
        return this.getInt32(OFFSET_MOVING);
      }
    },
    jumping: {
      get: function() {
        return this.getInt32(OFFSET_JUMPING);
      }
    },
    shift: {
      get: function() {
        return this.getInt32(OFFSET_SHIFT);
      }
    },
    alt: {
      get: function() {
        return this.getInt32(OFFSET_ALT);
      }
    },
    ctrl: {
      get: function() {
        return this.getInt32(OFFSET_CTRL);
      }
    },
    meta: {
      get: function() {
        return this.getInt32(OFFSET_META);
      }
    },
    forward: {
      get: function() {
        return this.getInt32(OFFSET_FORWARD);
      }
    },
    backward: {
      get: function() {
        return this.getInt32(OFFSET_BACKWARD);
      }
    },
    left: {
      get: function() {
        return this.getInt32(OFFSET_LEFT);
      }
    },
    right: {
      get: function() {
        return this.getInt32(OFFSET_RIGHT);
      }
    },
    up: {
      get: function() {
        return this.getInt32(OFFSET_UP);
      }
    },
    down: {
      get: function() {
        return this.getInt32(OFFSET_DOWN);
      }
    },
    looking: {
      get: function() {
        return this.getInt32(OFFSET_LOOKING);
      }
    },
    zooming: {
      get: function() {
        return this.getInt32(OFFSET_ZOOMING);
      }
    },
    dblclick: {
      get: function() {
        return this.getInt32(OFFSET_DBLCLICK);
      }
    },
    click: {
      get: function() {
        return this.getInt32(OFFSET_CLICK);
      }
    },
    rotating: {
      get: function() {
        return this.getInt32(OFFSET_LOOKING) && this.getInt32(OFFSET_ROTATING);
      }
    },
    draging: {
      get: function() {
        return this.getInt32(OFFSET_LOOKING) && this.getInt32(OFFSET_DRAGING);
      }
    },
    running: {
      get: function() {
        return this.getInt32(OFFSET_MOVING) && this.getInt32(OFFSET_SHIFT);
      }
    },
    x: {
      get: function() {
        return this.getFloat32(OFFSET_X);
      }
    },
    dx: {
      get: function() {
        return this.getFloat32(OFFSET_DX);
      }
    },
    rx: {
      get: function() {
        return this.getFloat32(OFFSET_RX);
      }
    },
    sx: {
      get: function() {
        return this.getFloat32(OFFSET_SX);
      }
    },
    vx: {
      get: function() {
        return this.getFloat32(OFFSET_VX);
      }
    },
    y: {
      get: function() {
        return this.getFloat32(OFFSET_Y);
      }
    },
    dy: {
      get: function() {
        return this.getFloat32(OFFSET_DY);
      }
    },
    ry: {
      get: function() {
        return this.getFloat32(OFFSET_RY);
      }
    },
    sy: {
      get: function() {
        return this.getFloat32(OFFSET_SY);
      }
    },
    vy: {
      get: function() {
        return this.getFloat32(OFFSET_VY);
      }
    },
    sz: {
      get: function() {
        return this.getFloat32(OFFSET_SZ);
      }
    },
    vz: {
      get: function() {
        return this.getFloat32(OFFSET_VZ);
      }
    },
    factor: {
      get: function() {
        return this.getFloat32(OFFSET_FACTOR);
      }
    },
    time: {
      get: function() {
        return this.getFloat32(OFFSET_TIME);
      }
    }
  });

  return BindClient;

}).call(this);

export var BindServer = (function() {
  class BindServer extends Pointer {
    constructor(ptr, canvas) {
      var document;
      super(ptr);
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

  BindServer.byteLength = BindClient.byteLength;

  BindServer.easing = BindClient.easing;

  return BindServer;

}).call(this);

Object.defineProperties(BindServer.prototype, {
  moving: {
    get: function() {
      return this.getInt32(OFFSET_MOVING);
    },
    set: function() {
      return this.setInt32(OFFSET_MOVING, arguments[0]);
    }
  },
  jumping: {
    get: function() {
      return this.getInt32(OFFSET_JUMPING);
    },
    set: function() {
      return this.setInt32(OFFSET_JUMPING, arguments[0]);
    }
  },
  shift: {
    get: function() {
      return this.getInt32(OFFSET_SHIFT);
    },
    set: function() {
      return this.setInt32(OFFSET_SHIFT, arguments[0]);
    }
  },
  alt: {
    get: function() {
      return this.getInt32(OFFSET_ALT);
    },
    set: function() {
      return this.setInt32(OFFSET_ALT, arguments[0]);
    }
  },
  ctrl: {
    get: function() {
      return this.getInt32(OFFSET_CTRL);
    },
    set: function() {
      return this.setInt32(OFFSET_CTRL, arguments[0]);
    }
  },
  meta: {
    get: function() {
      return this.getInt32(OFFSET_META);
    },
    set: function() {
      return this.setInt32(OFFSET_META, arguments[0]);
    }
  },
  forward: {
    get: function() {
      return this.getInt32(OFFSET_FORWARD);
    },
    set: function() {
      return this.setInt32(OFFSET_FORWARD, arguments[0]);
    }
  },
  backward: {
    get: function() {
      return this.getInt32(OFFSET_BACKWARD);
    },
    set: function() {
      return this.setInt32(OFFSET_BACKWARD, arguments[0]);
    }
  },
  left: {
    get: function() {
      return this.getInt32(OFFSET_LEFT);
    },
    set: function() {
      return this.setInt32(OFFSET_LEFT, arguments[0]);
    }
  },
  right: {
    get: function() {
      return this.getInt32(OFFSET_RIGHT);
    },
    set: function() {
      return this.setInt32(OFFSET_RIGHT, arguments[0]);
    }
  },
  up: {
    get: function() {
      return this.getInt32(OFFSET_UP);
    },
    set: function() {
      return this.setInt32(OFFSET_UP, arguments[0]);
    }
  },
  down: {
    get: function() {
      return this.getInt32(OFFSET_DOWN);
    },
    set: function() {
      return this.setInt32(OFFSET_DOWN, arguments[0]);
    }
  },
  looking: {
    get: function() {
      return this.getInt32(OFFSET_LOOKING);
    },
    set: function() {
      return this.setInt32(OFFSET_LOOKING, arguments[0]);
    }
  },
  zooming: {
    get: function() {
      return this.getInt32(OFFSET_ZOOMING);
    },
    set: function() {
      return this.setInt32(OFFSET_ZOOMING, arguments[0]);
    }
  },
  dblclick: {
    get: function() {
      return this.getInt32(OFFSET_DBLCLICK);
    },
    set: function() {
      return this.setInt32(OFFSET_DBLCLICK, arguments[0]);
    }
  },
  click: {
    get: function() {
      return this.getInt32(OFFSET_CLICK);
    },
    set: function() {
      return this.setInt32(OFFSET_CLICK, arguments[0]);
    }
  },
  x: {
    get: function() {
      return this.getFloat32(OFFSET_X);
    },
    set: function() {
      return this.setFloat32(OFFSET_X, arguments[0]);
    }
  },
  dx: {
    get: function() {
      return this.getFloat32(OFFSET_DX);
    },
    set: function() {
      return this.setFloat32(OFFSET_DX, arguments[0]);
    }
  },
  rx: {
    get: function() {
      return this.getFloat32(OFFSET_RX);
    },
    set: function() {
      return this.setFloat32(OFFSET_RX, arguments[0]);
    }
  },
  sx: {
    get: function() {
      return this.getFloat32(OFFSET_SX);
    },
    set: function() {
      return this.setFloat32(OFFSET_SX, arguments[0]);
    }
  },
  vx: {
    get: function() {
      return this.getFloat32(OFFSET_VX);
    },
    set: function() {
      return this.setFloat32(OFFSET_VX, arguments[0]);
    }
  },
  y: {
    get: function() {
      return this.getFloat32(OFFSET_Y);
    },
    set: function() {
      return this.setFloat32(OFFSET_Y, arguments[0]);
    }
  },
  dy: {
    get: function() {
      return this.getFloat32(OFFSET_DY);
    },
    set: function() {
      return this.setFloat32(OFFSET_DY, arguments[0]);
    }
  },
  ry: {
    get: function() {
      return this.getFloat32(OFFSET_RY);
    },
    set: function() {
      return this.setFloat32(OFFSET_RY, arguments[0]);
    }
  },
  sy: {
    get: function() {
      return this.getFloat32(OFFSET_SY);
    },
    set: function() {
      return this.setFloat32(OFFSET_SY, arguments[0]);
    }
  },
  vy: {
    get: function() {
      return this.getFloat32(OFFSET_VY);
    },
    set: function() {
      return this.setFloat32(OFFSET_VY, arguments[0]);
    }
  },
  sz: {
    get: function() {
      return this.getFloat32(OFFSET_SZ);
    },
    set: function() {
      return this.setFloat32(OFFSET_SZ, arguments[0]);
    }
  },
  vz: {
    get: function() {
      return this.getFloat32(OFFSET_VZ);
    },
    set: function() {
      return this.setFloat32(OFFSET_VZ, arguments[0]);
    }
  },
  factor: {
    get: function() {
      return this.getFloat32(OFFSET_FACTOR);
    },
    set: function() {
      return this.setFloat32(OFFSET_FACTOR, arguments[0]);
    }
  },
  time: {
    get: function() {
      return this.getFloat32(OFFSET_TIME);
    },
    set: function() {
      this.erase(OFFSET_LOOKING, OFFSET_EVENTS);
      return this.setFloat32(OFFSET_TIME, arguments[0]);
    }
  },
  press: {
    set: function() {
      return this.setUint8(this.click, arguments[0], 1);
    }
  },
  release: {
    set: function() {
      return this.setUint8(arguments[0], 0);
    }
  },
  rotating: {
    get: function() {
      return this.looking && this.getUint8(0);
    }
  },
  draging: {
    get: function() {
      return this.looking && this.getUint8(2);
    }
  },
  running: {
    get: function() {
      return this.moving && this.shift;
    }
  },
  offsetX: {
    set: function(x) {
      this.dx = -this.x + (this.x = x);
      return this.ry = (-this.dx / 100) % Math.PI;
    }
  },
  offsetY: {
    set: function(y) {
      this.dy = +this.y - (this.y = y);
      return this.rx = (-this.dy / 100) % Math.PI;
    }
  },
  deltaX: {
    set: function(x) {
      return this.sx = x;
    }
  },
  deltaY: {
    set: function(y) {
      return this.sz = (this.sy = y) / 100;
    }
  }
});
