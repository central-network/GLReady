var GL;

import Pointer from "./ptr.js";

export default GL = (function() {
  class GL extends Pointer {
    getCanvasNode() {
      return this.getLinkedNode().canvas;
    }

    setCanvasNode() {
      return this.setLinkedNode(arguments[0].getContext("webgl2"));
    }

  };

  GL.byteLength = 4 * 48;

  Object.defineProperties(GL.prototype, {
    gl: {
      get: GL.prototype.getLinkedNode
    },
    canvas: {
      get: GL.prototype.getCanvasNode,
      set: GL.prototype.setCanvasNode
    }
  });

  return GL;

}).call(this);

GL.registerClass();
