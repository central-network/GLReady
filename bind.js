var Bind;

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

export default Bind = (function() {
  class Bind extends EventTarget {
    constructor(canvas) {
      Object.assign(super(), {canvas}).listen();
    }

    listen() {
      this.width = this.canvas.getBoundingClientRect().width;
      this.height = this.canvas.getBoundingClientRect().height;
      this.document = this.canvas.ownerDocument;
      this.canvas.addEventListener("wheel", this.onwheel.bind(this), {
        passive: true
      });
      this.canvas.addEventListener("pointermove", this.onmove.bind(this), {
        passive: true
      });
      this.canvas.addEventListener("contextmenu", this.oncontext.bind(this));
      this.canvas.addEventListener("pointerdown", this.ondown.bind(this));
      this.canvas.addEventListener("pointerup", this.onup.bind(this));
      this.canvas.addEventListener("dblclick", this.ondouble.bind(this));
      this.document.addEventListener("keydown", this.onkeydown.bind(this));
      return this.document.addEventListener("keyup", this.onkeyup.bind(this));
    }

    on(event, handle, options) {
      this.addEventListener(event, handle, options);
      return this;
    }

    emit(event, detail) {
      this.dispatchEvent(new CustomEvent(event, {detail}));
      return this;
    }

    onwheel({deltaX, deltaY}) {
      this.deltaX = deltaX;
      this.deltaY = deltaY;
      this.dx = this.deltaX;
      this.dy = this.deltaY;
      this.dz = this.deltaY / 100;
      this.zooming = true;
      return this.dispatchEvent(new ZoomEvent(this));
    }

    onmove(e) {
      var offsetX, offsetY;
      ({offsetX, offsetY} = e);
      this.dx = offsetX - this.offsetX;
      this.dy = this.offsetY - offsetY;
      this.rx = (-this.dy / 100) % Math.PI;
      this.ry = (-this.dx / 100) % Math.PI;
      ({offsetX: this.offsetX, offsetY: this.offsetY} = {offsetX, offsetY});
      this.looking = false;
      if (this.draging !== false) {
        this.dispatchEvent(new DragEvent(this));
      } else if (this.turning !== false) {
        this.dispatchEvent(new TurnEvent(this));
      } else {
        this.looking = true;
      }
      return this.dispatchEvent(new LookEvent(this));
    }

    oncontext(e) {
      if (this.disableContextMenu) {
        return e.preventDefault();
      }
    }

    ondown(e) {
      ({offsetX: this.offsetX, offsetY: this.offsetY, button: this.button} = e);
      if (this.button === e.buttons) {
        this.draging = this.button;
      } else {
        this.turning = this.button;
      }
      return this.dispatchEvent(new PickEvent(this));
    }

    onup(e) {
      this.button = false;
      switch (e.button) {
        case this.draging:
          this.draging = false;
          break;
        case this.turning:
          this.turning = false;
      }
      return this.dispatchEvent(new ReleaseEvent(this));
    }

    ondouble(e) {
      return this.dispatchEvent(new CustomEvent("dblclick", {
        ...e,
        detail: e
      }));
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

  Bind.prototype.passive = true;

  Bind.prototype.disableContextMenu = true;

  Bind.prototype.zoom = 0;

  Bind.prototype.slide = 0;

  Bind.prototype.draging = false;

  Bind.prototype.turning = false;

  Bind.prototype.looking = false;

  Bind.prototype.deltaY = 0;

  Bind.prototype.deltaS = 0;

  Bind.prototype.deltaX = 0;

  Bind.prototype.pressing = {};

  Bind.prototype.shiftKey = false;

  Bind.prototype.altKey = false;

  Bind.prototype.ctrlKey = false;

  Bind.prototype.metaKey = false;

  Bind.prototype.walking = false;

  Bind.prototype.moving = false;

  Bind.prototype.jumping = false;

  Bind.prototype.zooming = false;

  Bind.prototype.rx = 0;

  Bind.prototype.ry = 0;

  Object.defineProperties(Bind.prototype, {
    isRotating: {
      get: function() {
        return this.turning !== false;
      }
    },
    isDraging: {
      get: function() {
        return this.draging !== false;
      }
    },
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
    },
    isZooming: {
      get: function() {
        var l;
        l = this.zooming;
        this.zooming = false;
        return l;
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
