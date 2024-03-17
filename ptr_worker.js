var forker, init, worker;

import Pointer from "./ptr.js";

import "./ptr_gl.js";

worker = null;

forker = null;

addEventListener("message", function({data}) {
  //log "triggering worker init"
  return init(data);
}, {
  once: true
});

init = function(buffer) {
  var gl, i, len, mode, ref, results;
  if (!buffer) {
    return;
  }
  Pointer.setBuffer(buffer);
  worker = new Pointer(self.name);
  forker = worker.getParentPtrP();
  log(gl = forker);
  ref = gl.getAllBuffers();
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    buffer = ref[i];
    results.push((function() {
      var j, len1, results1;
      results1 = [];
      for (j = 0, len1 = buffer.length; j < len1; j++) {
        mode = buffer[j];
        results1.push(console.log(mode));
      }
      return results1;
    })());
  }
  return results;
};
