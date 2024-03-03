import {
  BufGL2Screen
} from "./BufGL2Screen.js";

export var BufGL2 = class BufGL2 extends EventTarget {
  constructor(buffer = new SharedArrayBuffer(1e8)) {
    Object.defineProperties(super("BufGL2"), {
      screen: {
        value: new BufGL2Screen(buffer)
      }
    });
  }

};

Object.defineProperties(BufGL2.prototype, {
  canvas: {
    get: function() {
      return this.gl.canvas;
    },
    set: function() {
      var canvas, context;
      canvas = arguments[0];
      context = {
        value: canvas.getContext("webgl2")
      };
      return Object.defineProperty(this, "gl", context).screen.readCanvas(canvas);
    }
  },
  background: {
    get: function() {
      return this.screen.background;
    },
    set: function() {
      return this.screen.background = arguments[0];
    }
  }
});

export default BufGL2;
