export var BufGL2Screen = (function() {
  class BufGL2Screen extends Float32Array {
    readCanvas(canvas) {
      var height, left, top, width;
      ({
        width,
        height,
        x: left,
        y: top
      } = (this.canvas = canvas).getBoundingClientRect());
      [this.left, this.top, this.width, this.height, this.aspectRatio, this.depth, this.pixelRatio] = [left, top, width, height, width / height, width / 2, typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1];
      return this.update();
    }

    update() {
      this.canvas.width = this.pixelRatio * this.width;
      this.canvas.height = this.pixelRatio * this.height;
      this.canvas.style.backgroundColor = `rgba( ${this.red * 0xff}, ${this.green * 0xff}, ${this.blue * 0xff}, ${this.alpha * 0x01} )`;
      return this;
    }

    set() {
      return this.update(super.set(...arguments));
    }

  };

  BufGL2Screen.byteLength = 120;

  return BufGL2Screen;

}).call(this);

Object.defineProperties(BufGL2Screen.prototype, {
  INDEX_WIDTH: {
    value: 0
  },
  INDEX_HEIGHT: {
    value: 1
  },
  INDEX_DEPTH: {
    value: 2
  },
  INDEX_LEFT: {
    value: 3
  },
  INDEX_TOP: {
    value: 4
  },
  INDEX_BACKGROUND: {
    value: 5
  },
  INDEX_RED: {
    value: 5
  },
  INDEX_GREEN: {
    value: 6
  },
  INDEX_BLUE: {
    value: 7
  },
  INDEX_ALPHA: {
    value: 8
  },
  INDEX_ASPECT_RATIO: {
    value: 9
  },
  INDEX_PIXEL_RATIO: {
    value: 10
  }
});

Object.defineProperties(BufGL2Screen.prototype, {
  width: {
    get: function() {
      return this[this.INDEX_WIDTH];
    },
    set: function() {
      return this.set(arguments, this.INDEX_WIDTH);
    }
  },
  height: {
    get: function() {
      return this[this.INDEX_HEIGHT];
    },
    set: function() {
      return this.set(arguments, this.INDEX_HEIGHT);
    }
  },
  depth: {
    get: function() {
      return this[this.INDEX_DEPTH];
    },
    set: function() {
      return this.set(arguments, this.INDEX_DEPTH);
    }
  },
  left: {
    get: function() {
      return this[this.INDEX_LEFT];
    },
    set: function() {
      return this.set(arguments, this.INDEX_LEFT);
    }
  },
  top: {
    get: function() {
      return this[this.INDEX_TOP];
    },
    set: function() {
      return this.set(arguments, this.INDEX_TOP);
    }
  },
  background: {
    get: function() {
      return this.subarray(this.INDEX_BACKGROUND, this.INDEX_BACKGROUND + 4);
    },
    set: function() {
      return [this.red, this.green, this.blue, this.alpha = 1] = arguments[0];
    }
  },
  red: {
    get: function() {
      return this[this.INDEX_RED];
    },
    set: function() {
      return this.set(arguments, this.INDEX_RED);
    }
  },
  green: {
    get: function() {
      return this[this.INDEX_GREEN];
    },
    set: function() {
      return this.set(arguments, this.INDEX_GREEN);
    }
  },
  blue: {
    get: function() {
      return this[this.INDEX_BLUE];
    },
    set: function() {
      return this.set(arguments, this.INDEX_BLUE);
    }
  },
  alpha: {
    get: function() {
      return this[this.INDEX_ALPHA];
    },
    set: function() {
      return this.set(arguments, this.INDEX_ALPHA);
    }
  },
  aspectRatio: {
    get: function() {
      return this[this.INDEX_ASPECT_RATIO];
    },
    set: function() {
      return this.set(arguments, this.INDEX_ASPECT_RATIO);
    }
  },
  pixelRatio: {
    get: function() {
      return this[this.INDEX_PIXEL_RATIO];
    },
    set: function() {
      return this.set(arguments, this.INDEX_PIXEL_RATIO);
    }
  }
});
