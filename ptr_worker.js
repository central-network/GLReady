var forker, init, worker;

import {
  Pointer,
  Matrix4
} from "./ptr.js";

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
  var draw, f32m, gl, i, len, mat4, mode, ref, results, vec3;
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
              draw.object3.matrix;
              results2.push((function() {
                var results3;
                results3 = [];
                while (vec3 = draw.object3.nextVertex()) {
                  mat4 = Matrix4.translation(vec3);
                  f32m = draw.object3.matrix.apply(mat4);
                  results3.push(console.log(f32m.subarray(12, 15)));
                }
                return results3;
              })());
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
