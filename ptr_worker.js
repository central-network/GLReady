var init, node;

import Pointer from "./ptr.js";

import GL from "./ptr_gl.js";

node = null;

init = function(buffer) {
  Pointer.prototype.buffer = buffer;
  node = new Pointer(self.name);
  node.setOnlineState(1);
  return postMessage(node);
};

bc.addEventListener("message", function(e) {
  return console.warn(new Pointer(e.data));
});

addEventListener("message", function({data}) {
  if (!(data instanceof SharedArrayBuffer)) {
    return console.log({
      forked: new Pointer(data)
    });
  }
  return init(data);
});
