import Pointer from "./ptr.js";

export var GL = class GL extends Pointer {};

export default GL.registerClass();

Object.defineProperties(GL, {
  byteLength: {
    value: 4 * 48
  }
});

Object.defineProperties(GL.prototype, {
  gl: {
    get: function() {
      return 1;
    }
  }
});
