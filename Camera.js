var OFFSET_A_RATIO, OFFSET_Y_FOV, OFFSET_Z_FAR, OFFSET_Z_NEAR;

import Matrix4 from "./Matrix4.js";

import Pointer from "./Pointer.js";

OFFSET_Y_FOV = 4 * 16;

OFFSET_A_RATIO = 4 * 17;

OFFSET_Z_NEAR = 4 * 18;

OFFSET_Z_FAR = 4 * 19;

export var CameraServer = (function() {
  class CameraServer extends Pointer {};

  CameraServer.byteLength = 4 * 20;

  CameraServer.TypedArray = Float32Array;

  Object.defineProperties(CameraServer.prototype, {
    matrix: {
      get: function() {
        return new Matrix4(this.buffer, this.byteOffset, 16);
      },
      set: function() {
        return this.matrix.set(arguments[0]);
      }
    },
    yFov: {
      get: function() {
        return this.getFloat32(OFFSET_Y_FOV);
      },
      set: function() {
        return this.setFloat32(OFFSET_Y_FOV, arguments[0]);
      }
    },
    aRatio: {
      get: function() {
        return this.getFloat32(OFFSET_A_RATIO);
      },
      set: function() {
        return this.setFloat32(OFFSET_A_RATIO, arguments[0]);
      }
    },
    zNear: {
      get: function() {
        return this.getFloat32(OFFSET_Z_NEAR);
      },
      set: function() {
        return this.setFloat32(OFFSET_Z_NEAR, arguments[0]);
      }
    },
    zFar: {
      get: function() {
        return this.getFloat32(OFFSET_Z_FAR);
      },
      set: function() {
        return this.setFloat32(OFFSET_Z_FAR, arguments[0]);
      }
    }
  });

  return CameraServer;

}).call(this);

export var Perspective = class Perspective extends CameraServer {
  static create(yFov, aRatio, zNear, zFar) {
    var ptr;
    ptr = new this(malloc(this.byteLength));
    ptr.matrix.toPerspective(ptr.yFov = yFov, ptr.aRatio = aRatio, ptr.zNear = zNear, ptr.zFar = zFar);
    return ptr;
  }

};

export default CameraServer;
