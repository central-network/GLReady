// TODO this works only WINDOW
// ???? removed from worker ->
var init;

import Pointer from "./ptr.js";

import GL from "./ptr_gl.js";

export default init = function(buffer) {
  var ptr_gl;
  Pointer.prototype.buffer = buffer;
  ptr_gl = new GL();
  ptr_gl.fork(1);
  return console.error(ptr_gl);
};
