var LENGTH_BACKGROUND, OFFSET_ALPHA, OFFSET_ASPECT_RATIO, OFFSET_BACKGROUND, OFFSET_BLUE, OFFSET_DEPTH, OFFSET_GREEN, OFFSET_HEIGHT, OFFSET_LEFT, OFFSET_PIXEL_RATIO, OFFSET_RED, OFFSET_TOP, OFFSET_WIDTH;

import Pointer from "./Pointer.js";

OFFSET_WIDTH = 4 * 0;

OFFSET_HEIGHT = 4 * 1;

OFFSET_DEPTH = 4 * 2;

OFFSET_LEFT = 4 * 3;

OFFSET_TOP = 4 * 4;

OFFSET_RED = 4 * 5;

OFFSET_GREEN = 4 * 6;

OFFSET_BLUE = 4 * 7;

OFFSET_ALPHA = 4 * 8;

OFFSET_ASPECT_RATIO = 4 * 9;

OFFSET_PIXEL_RATIO = 4 * 10;

OFFSET_BACKGROUND = OFFSET_RED;

LENGTH_BACKGROUND = 4;

export var length = 32;

export var byteLength = 4 * length;

export var ScreenClient = (function() {
  class ScreenClient extends Pointer {};

  ScreenClient.byteLength = byteLength;

  Object.defineProperties(ScreenClient.prototype, {
    width: {
      get: function() {
        return this.getFloat32(OFFSET_WIDTH);
      }
    },
    height: {
      get: function() {
        return this.getFloat32(OFFSET_HEIGHT);
      }
    },
    depth: {
      get: function() {
        return this.getFloat32(OFFSET_DEPTH);
      }
    },
    left: {
      get: function() {
        return this.getFloat32(OFFSET_LEFT);
      }
    },
    top: {
      get: function() {
        return this.getFloat32(OFFSET_TOP);
      }
    },
    red: {
      get: function() {
        return this.getFloat32(OFFSET_RED);
      }
    },
    green: {
      get: function() {
        return this.getFloat32(OFFSET_GREEN);
      }
    },
    blue: {
      get: function() {
        return this.getFloat32(OFFSET_BLUE);
      }
    },
    alpha: {
      get: function() {
        return this.getFloat32(OFFSET_ALPHA);
      }
    },
    aspectRatio: {
      get: function() {
        return this.getFloat32(OFFSET_ASPECT_RATIO);
      }
    },
    pixelRatio: {
      get: function() {
        return this.getFloat32(OFFSET_PIXEL_RATIO);
      }
    },
    background: {
      get: function() {
        return this.subFloat32(OFFSET_BACKGROUND, LENGTH_BACKGROUND);
      }
    }
  });

  return ScreenClient;

}).call(this);

export var ScreenServer = (function() {
  class ScreenServer extends Pointer {
    constructor(ptr, canvas) {
      super(ptr).readCanvas(canvas);
    }

    readCanvas(canvas) {
      var height, left, top, width;
      ({
        width,
        height,
        x: left,
        y: top
      } = canvas.getBoundingClientRect());
      [this.left, this.top, this.width, this.height, this.aspectRatio, this.depth, this.pixelRatio] = [left, top, width, height, width / height, width / 2, typeof devicePixelRatio !== "undefined" && devicePixelRatio !== null ? devicePixelRatio : 1];
      Object.defineProperty(this, "canvas", {
        get: function() {
          return canvas;
        }
      });
      return this.update();
    }

    update() {
      this.canvas.width = this.pixelRatio * this.width;
      this.canvas.height = this.pixelRatio * this.height;
      this.canvas.style.backgroundColor = `rgba( ${this.red * 0xff}, ${this.green * 0xff}, ${this.blue * 0xff}, ${this.alpha * 0x01} )`;
      return this;
    }

  };

  ScreenServer.byteLength = byteLength;

  Object.defineProperties(ScreenServer.prototype, {
    width: {
      get: function() {
        return this.getFloat32(OFFSET_WIDTH);
      },
      set: function() {
        return this.setFloat32(OFFSET_WIDTH, arguments[0]);
      }
    },
    height: {
      get: function() {
        return this.getFloat32(OFFSET_HEIGHT);
      },
      set: function() {
        return this.setFloat32(OFFSET_HEIGHT, arguments[0]);
      }
    },
    depth: {
      get: function() {
        return this.getFloat32(OFFSET_DEPTH);
      },
      set: function() {
        return this.setFloat32(OFFSET_DEPTH, arguments[0]);
      }
    },
    left: {
      get: function() {
        return this.getFloat32(OFFSET_LEFT);
      },
      set: function() {
        return this.setFloat32(OFFSET_LEFT, arguments[0]);
      }
    },
    top: {
      get: function() {
        return this.getFloat32(OFFSET_TOP);
      },
      set: function() {
        return this.setFloat32(OFFSET_TOP, arguments[0]);
      }
    },
    red: {
      get: function() {
        return this.getFloat32(OFFSET_RED);
      },
      set: function() {
        return this.setFloat32(OFFSET_RED, arguments[0]);
      }
    },
    green: {
      get: function() {
        return this.getFloat32(OFFSET_GREEN);
      },
      set: function() {
        return this.setFloat32(OFFSET_GREEN, arguments[0]);
      }
    },
    blue: {
      get: function() {
        return this.getFloat32(OFFSET_BLUE);
      },
      set: function() {
        return this.setFloat32(OFFSET_BLUE, arguments[0]);
      }
    },
    alpha: {
      get: function() {
        return this.getFloat32(OFFSET_ALPHA);
      },
      set: function() {
        return this.setFloat32(OFFSET_ALPHA, arguments[0]);
      }
    },
    aspectRatio: {
      get: function() {
        return this.getFloat32(OFFSET_ASPECT_RATIO);
      },
      set: function() {
        return this.setFloat32(OFFSET_ASPECT_RATIO, arguments[0]);
      }
    },
    pixelRatio: {
      get: function() {
        return this.getFloat32(OFFSET_PIXEL_RATIO);
      },
      set: function() {
        return this.setFloat32(OFFSET_PIXEL_RATIO, arguments[0]);
      }
    },
    background: {
      get: function() {
        return this.subFloat32(OFFSET_BACKGROUND, LENGTH_BACKGROUND);
      },
      set: function() {
        return [this.red, this.green, this.blue, this.alpha = 1] = arguments[0];
      }
    }
  });

  return ScreenServer;

}).call(this);
