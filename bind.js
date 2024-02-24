var Bind;

export var ZoomEvent = class ZoomEvent extends CustomEvent {
  constructor(detail) {
    super("zoom", {detail});
  }

};

export var MovingEvent = class MovingEvent extends CustomEvent {
  constructor(detail) {
    super("moving", {detail});
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

export var DragingEvent = class DragingEvent extends CustomEvent {
  constructor(detail) {
    super("drag", {detail});
  }

};

export var PanningEvent = class PanningEvent extends CustomEvent {
  constructor(detail) {
    super("move", {detail});
  }

};

export var ScaleEvent = class ScaleEvent extends CustomEvent {
  constructor(detail) {
    super("scale", {detail});
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
      this.canvas.addEventListener("wheel", this.onwheel.bind(this), {
        passive: true
      });
      this.canvas.addEventListener("pointermove", this.onmove.bind(this), {
        passive: true
      });
      this.canvas.addEventListener("contextmenu", this.oncontext.bind(this));
      this.canvas.addEventListener("pointerdown", this.ondown.bind(this));
      this.canvas.addEventListener("pointerup", this.onup.bind(this));
      return this.canvas.addEventListener("dblclick", this.ondouble.bind(this));
    }

    on(event, handle, options) {
      this.addEventListener(event, handle, options);
      return this;
    }

    emit(event, detail) {
      this.dispatchEvent(new CustomEvent(event, {detail}));
      return this;
    }

    onwheel({deltaX, deltaY, altKey}) {
      this.deltaX = deltaX;
      this.deltaY = deltaY;
      this.altKey = altKey;
      if (this.altKey) {
        return this.dispatchEvent(new ScaleEvent({
          dx: this.deltaX,
          dz: this.deltaY,
          ds: this.deltaY / 100
        }));
      } else {
        return this.dispatchEvent(new ZoomEvent({
          dx: this.deltaX,
          dz: this.deltaY
        }));
      }
    }

    onmove(e) {
      var delta, offsetX, offsetY;
      ({offsetX, offsetY} = e);
      delta = {
        dx: offsetX - this.offsetX,
        dy: this.offsetY - offsetY
      };
      delta.rx = (-delta.dy / 100) % Math.PI;
      delta.ry = (-delta.dx / 100) % Math.PI;
      ({offsetX: this.offsetX, offsetY: this.offsetY} = {offsetX, offsetY});
      if (this.panning !== null) {
        this.dispatchEvent(new PanningEvent(delta));
      } else if (this.draging !== null) {
        this.dispatchEvent(new DragingEvent(delta));
      }
      return this.dispatchEvent(new MovingEvent(delta));
    }

    oncontext(e) {
      if (this.disableContextMenu) {
        return e.preventDefault();
      }
    }

    ondown(e) {
      ({offsetX: this.offsetX, offsetY: this.offsetY, button: this.button} = e);
      if (this.button === e.buttons) {
        this.panning = this.button;
      } else {
        this.draging = this.button;
      }
      return this.dispatchEvent(new PickEvent({offsetX: this.offsetX, offsetY: this.offsetY}));
    }

    onup(e) {
      this.button = false;
      switch (e.button) {
        case this.panning:
          this.panning = null;
          break;
        case this.draging:
          this.draging = null;
      }
      return this.dispatchEvent(new ReleaseEvent({offsetX: this.offsetX, offsetY: this.offsetY}));
    }

    ondouble(e) {
      return this.dispatchEvent(new CustomEvent("dblclick", {
        ...e,
        detail: e
      }));
    }

  };

  Bind.prototype.passive = true;

  Bind.prototype.disableContextMenu = true;

  Bind.prototype.zoom = 0;

  Bind.prototype.slide = 0;

  Bind.prototype.panning = null;

  Bind.prototype.draging = null;

  Bind.prototype.deltaY = 0;

  Bind.prototype.deltaS = 0;

  Bind.prototype.deltaX = 0;

  return Bind;

}).call(this);
