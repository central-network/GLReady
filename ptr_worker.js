var forker, init, worker;

import Pointer from "./ptr.js";

import GL from "./ptr_gl.js";

worker = null;

forker = null;

init = function(buffer) {
  Pointer.setBuffer(buffer);
  worker = new Pointer(self.name);
  forker = worker.getParentPtrP();
  worker.setOnlineState(1);
  log({
    worker: worker,
    forker: forker
  });
  return log(["locked request'n response", "gl.FLOAT", forker.gl.FLOAT]);
};

addEventListener("message", function({data}) {
  log("triggering worker init");
  return init(data);
}, {
  once: true
});
