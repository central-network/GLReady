var INDEX_ALPHA, INDEX_ASPECT_RATIO, INDEX_BACKGROUND, INDEX_BLUE, INDEX_DEPTH, INDEX_GREEN, INDEX_HEIGHT, INDEX_LEFT, INDEX_PIXEL_RATIO, INDEX_RED, INDEX_TOP, INDEX_WIDTH;

INDEX_WIDTH = 0;

INDEX_HEIGHT = 1;

INDEX_DEPTH = 2;

INDEX_LEFT = 3;

INDEX_TOP = 4;

INDEX_BACKGROUND = 5;

INDEX_RED = 5;

INDEX_GREEN = 6;

INDEX_BLUE = 7;

INDEX_ALPHA = 8;

INDEX_ASPECT_RATIO = 9;

INDEX_PIXEL_RATIO = 10;

export var byteLength = 128;

export var length = 32;

export var ScreenClient = (function() {
  class ScreenClient extends Float32Array {
    constructor(subarray) {
      super(subarray.buffer, subarray.byteOffset, length);
    }

  };

  ScreenClient.byteLength = byteLength;

  return ScreenClient;

}).call(this);

export var ScreenServer = (function() {
  class ScreenServer extends Float32Array {
    constructor(canvas, subarray) {
      super(subarray.buffer, subarray.byteOffset, length).readCanvas(canvas);
    }

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

  ScreenServer.byteLength = byteLength;

  return ScreenServer;

}).call(this);

Object.defineProperties(ScreenServer.prototype, {
  width: {
    get: function() {
      return this[INDEX_WIDTH];
    },
    set: function() {
      return this.set(arguments, INDEX_WIDTH);
    }
  },
  height: {
    get: function() {
      return this[INDEX_HEIGHT];
    },
    set: function() {
      return this.set(arguments, INDEX_HEIGHT);
    }
  },
  depth: {
    get: function() {
      return this[INDEX_DEPTH];
    },
    set: function() {
      return this.set(arguments, INDEX_DEPTH);
    }
  },
  left: {
    get: function() {
      return this[INDEX_LEFT];
    },
    set: function() {
      return this.set(arguments, INDEX_LEFT);
    }
  },
  top: {
    get: function() {
      return this[INDEX_TOP];
    },
    set: function() {
      return this.set(arguments, INDEX_TOP);
    }
  },
  background: {
    get: function() {
      return this.subarray(INDEX_BACKGROUND, INDEX_BACKGROUND + 4);
    },
    set: function() {
      return [this.red, this.green, this.blue, this.alpha = 1] = arguments[0];
    }
  },
  red: {
    get: function() {
      return this[INDEX_RED];
    },
    set: function() {
      return this.set(arguments, INDEX_RED);
    }
  },
  green: {
    get: function() {
      return this[INDEX_GREEN];
    },
    set: function() {
      return this.set(arguments, INDEX_GREEN);
    }
  },
  blue: {
    get: function() {
      return this[INDEX_BLUE];
    },
    set: function() {
      return this.set(arguments, INDEX_BLUE);
    }
  },
  alpha: {
    get: function() {
      return this[INDEX_ALPHA];
    },
    set: function() {
      return this.set(arguments, INDEX_ALPHA);
    }
  },
  aspectRatio: {
    get: function() {
      return this[INDEX_ASPECT_RATIO];
    },
    set: function() {
      return this.set(arguments, INDEX_ASPECT_RATIO);
    }
  },
  pixelRatio: {
    get: function() {
      return this[INDEX_PIXEL_RATIO];
    },
    set: function() {
      return this.set(arguments, INDEX_PIXEL_RATIO);
    }
  }
});

Object.defineProperties(ScreenClient.prototype, {
  width: {
    get: function() {
      return this[INDEX_WIDTH];
    }
  },
  height: {
    get: function() {
      return this[INDEX_HEIGHT];
    }
  },
  depth: {
    get: function() {
      return this[INDEX_DEPTH];
    }
  },
  left: {
    get: function() {
      return this[INDEX_LEFT];
    }
  },
  top: {
    get: function() {
      return this[INDEX_TOP];
    }
  },
  red: {
    get: function() {
      return this[INDEX_RED];
    }
  },
  green: {
    get: function() {
      return this[INDEX_GREEN];
    }
  },
  blue: {
    get: function() {
      return this[INDEX_BLUE];
    }
  },
  alpha: {
    get: function() {
      return this[INDEX_ALPHA];
    }
  },
  aspectRatio: {
    get: function() {
      return this[INDEX_ASPECT_RATIO];
    }
  },
  pixelRatio: {
    get: function() {
      return this[INDEX_PIXEL_RATIO];
    }
  },
  background: {
    get: function() {
      return this.subarray(INDEX_BACKGROUND, INDEX_BACKGROUND + 4);
    }
  }
});
