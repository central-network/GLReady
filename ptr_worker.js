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
          for (draw of mode) {
            color = draw.object3.color;
            matrix = draw.object3.matrix;
            attribs = draw.attributes;
            numIndex = -numCmponents;
            while (vertex = draw.object3.nextVertex()) {
              position = matrix.apply(vertex);
              attribs.set([...position, ...color], numIndex += numCmponents);
            }
            draw.isUpdated = 1;
            mode.needUpload = 1;
          }
          mode.isUpdated = 1;
          mode.needUpload = 1;
          results1.push(console.log(mode));
        }
        return results1;
      })());
    }
  }
  return results;
};
