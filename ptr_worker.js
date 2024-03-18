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
  var attribs, color, draw, gl, i, len, matrix, mode, numCmponents, numIndex, position, ref, results, vertex;
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
          numCmponents = mode.numCmponents;
          results1.push((function() {
            var results2;
            results2 = [];
            for (draw of mode) {
              color = draw.object3.color;
              matrix = draw.object3.matrix;
              attribs = draw.attributes;
              numIndex = -numCmponents;
              results2.push((function() {
                var results3;
                results3 = [];
                while (vertex = draw.object3.nextVertex()) {
                  position = matrix.apply(vertex);
                  results3.push(attribs.set([...position, ...color], numIndex += numCmponents));
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
