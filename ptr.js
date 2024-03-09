var BYTES_PER_POINTER, INDEX_BUF, INDEX_PTR, LE, LENGTH_OF_POINTER, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_PROTOCLASS, POINTERS_BYTELENGTH, POINTERS_BYTEOFFSET, POINTER_PROTOTYPE, buf, dvw, f32, initbuf, malloc, palloc, u32;

import {
  byteLength
} from "./Pointer.js";

import "./ptr_self.js";

LE = false;

buf = u32 = f32 = dvw = null;

palloc = null;

malloc = null;

INDEX_BUF = 0;

INDEX_PTR = 1;

POINTERS_BYTELENGTH = 4 * 1e5;

POINTERS_BYTEOFFSET = 8;

LENGTH_OF_POINTER = 16;

BYTES_PER_POINTER = 4 * LENGTH_OF_POINTER;

OFFSET_BYTEOFFSET = 4 * 1;

OFFSET_BYTELENGTH = 4 * 2;

OFFSET_PROTOCLASS = 4 * 3;

POINTER_PROTOTYPE = [, ];

export var Pointer = class Pointer extends Number {
  constructor(ptr = palloc(BYTES_PER_POINTER)) {
    super(ptr);
    if (arguments.length) {
      Object.setPrototypeOf(this, POINTER_PROTOTYPE[this.protoClass].prototype);
    } else {
      this.setByteLength(this.constructor.byteLength).setProtoClass(this.constructor.protoClass).setByteOffset(malloc(this.byteLength));
    }
  }

  syncWorkers() {
    return bc.postMessage(this);
  }

};

export var BufferPointer = class BufferPointer extends Pointer {};

export var OffsetPointer = class OffsetPointer extends Pointer {};

export var ObjectPointer = class ObjectPointer extends Pointer {};

export var AtomicPointer = class AtomicPointer extends Pointer {};

export default Pointer;

initbuf = function(sab) {
  buf = sab;
  u32 = new Uint32Array(buf);
  f32 = new Float32Array(buf);
  dvw = new DataView(buf);
  Atomics.or(u32, INDEX_BUF, POINTERS_BYTELENGTH); //byteOffset
  Atomics.or(u32, INDEX_PTR, POINTERS_BYTEOFFSET); //pointerOffset
  palloc = Atomics.add.bind(Atomics, u32, INDEX_PTR);
  malloc = Atomics.add.bind(Atomics, u32, INDEX_BUF);
  log("base buffer settled", buf);
  return log("atomics uint32 base", u32);
};

Object.defineProperties(Pointer, {
  registerClass: {
    value: function() {
      this.protoClass || (this.protoClass = -1 + POINTER_PROTOTYPE.push(this));
      return this;
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  getHeader: {
    value: function() {
      return dvw.getUint32(this + arguments[0] * 4);
    }
  },
  getAllHeaders: {
    value: function() {
      return (function() {
        var results = [];
        for (var i = 0; 0 <= LENGTH_OF_POINTER ? i < LENGTH_OF_POINTER : i > LENGTH_OF_POINTER; 0 <= LENGTH_OF_POINTER ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this).map(this.getHeader.bind(this));
    }
  },
  setAllHeaders: {
    value: function() {
      return this.getAllHeaders().set(arguments[0]);
    }
  },
  getByteOffset: {
    value: function() {
      return dvw.getUint32(this + OFFSET_BYTEOFFSET, LE);
    }
  },
  setByteOffset: {
    value: function() {
      dvw.setUint32(this + OFFSET_BYTEOFFSET, arguments[0], LE);
      return this;
    }
  },
  getByteLength: {
    value: function() {
      return dvw.getUint32(this + OFFSET_BYTELENGTH, LE);
    }
  },
  setByteLength: {
    value: function() {
      dvw.setUint32(this + OFFSET_BYTELENGTH, arguments[0], LE);
      return this;
    }
  },
  getProtoClass: {
    value: function() {
      return dvw.getUint32(this + OFFSET_PROTOCLASS, LE);
    }
  },
  setProtoClass: {
    value: function() {
      dvw.setUint32(this + OFFSET_PROTOCLASS, arguments[0], LE);
      return this;
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  buffer: {
    set: initbuf,
    get: function() {
      return buf;
    }
  },
  headers: {
    get: Pointer.prototype.getAllHeaders,
    set: Pointer.prototype.setAllHeaders
  },
  byteOffset: {
    get: Pointer.prototype.getByteOffset,
    set: Pointer.prototype.setByteOffset
  },
  byteLength: {
    get: Pointer.prototype.getByteLength,
    set: Pointer.prototype.setByteLength
  },
  protoClass: {
    get: Pointer.prototype.getProtoClass,
    set: Pointer.prototype.setProtoClass
  }
});
