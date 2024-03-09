var init;

import Pointer from "./ptr.js";

import GL from "./ptr_gl.js";

init = function(buffer) {
  return Pointer.prototype.buffer = buffer;
};

bc.addEventListener("message", function(e) {
  return console.warn(new Pointer(e.data));
});

addEventListener("message", function({data}) {
  if (!(data instanceof SharedArrayBuffer)) {
    return handleMessage(...arguments);
  }
  return init(data);
});
