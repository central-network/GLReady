var forker, init, worker;

import {
  WorkerPointer
} from "./ptr.js";

import Pointer from "./ptr.js";

import {
  GL,
  Program,
  Shader
} from "./ptr_gl.js";

worker = null;

forker = null;

init = function(buffer) {
  if (!buffer) {
    return;
  }
  Pointer.setBuffer(buffer);
  worker = new WorkerPointer(self.name);
  forker = worker.getParentPtrP();
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
