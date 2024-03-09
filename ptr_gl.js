var GL;

import Pointer from "./ptr.js";

export default GL = class GL extends Pointer {};

Object.defineProperties(GL.registerClass(), {
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
