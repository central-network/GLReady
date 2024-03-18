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
  var draw, gl, i, len, mode, ref, results;
  if (!buffer) {
    return;
  }
  Pointer.setBuffer(buffer);
  worker = new Pointer(self.name);
  forker = worker.getParentPtrP();
  log(gl = forker);
  ref = gl.buffers;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    buffer = ref[i];
    if (buffer.bound) {
      results.push((function() {
        var results1;
        results1 = [];
        for (mode of buffer) {
          results1.push((function() {
            var results2;
            results2 = [];
            for (draw of mode) {
              //console.log "mode:", mode * 1, "\t  draw:", draw * 1, "\t", [mode, draw], "\ttype:", draw.type
              results2.push(console.log(draw.object3.matrix));
            }
            return results2;
          })());
        }
        return results1;
      })());
    }
  }
  return results;
};
