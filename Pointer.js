var BUFFER, DATAVIEW, INDEX_BEGIN, INDEX_BYTEFINISH, INDEX_BYTELENGTH, INDEX_BYTEOFFSET, INDEX_BYTES_PER_ELEMENT, INDEX_END, INDEX_LENGTH, INDEX_PTR_CHILDREN, INDEX_PTR_PARENT, INDEX_TYPED_ARRAY_ID, OFFSET_BEGIN, OFFSET_BYTEFINISH, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_BYTES_PER_ELEMENT, OFFSET_END, OFFSET_LENGTH, OFFSET_PTR_CHILDREN, OFFSET_PTR_PARENT, OFFSET_TYPED_ARRAY_ID, POINTERS_BEGIN, POINTER_BYTELENGTH, POINTER_LENGTH, TypedArraysIds, U32ARRAY;

BUFFER = null;

DATAVIEW = null;

U32ARRAY = null;

INDEX_BYTEOFFSET = 0;

INDEX_BYTELENGTH = 1;

INDEX_BYTEFINISH = 2;

INDEX_LENGTH = 3;

INDEX_BEGIN = 5;

INDEX_END = 6;

INDEX_TYPED_ARRAY_ID = 7;

INDEX_BYTES_PER_ELEMENT = 8;

INDEX_PTR_PARENT = 9;

INDEX_PTR_CHILDREN = 10;

OFFSET_BYTEOFFSET = 0 * 4;

OFFSET_BYTELENGTH = 1 * 4;

OFFSET_BYTEFINISH = 2 * 4;

OFFSET_LENGTH = 3 * 4;

OFFSET_BEGIN = 5 * 4;

OFFSET_END = 6 * 4;

OFFSET_TYPED_ARRAY_ID = 7 * 4;

OFFSET_BYTES_PER_ELEMENT = 8 * 4;

OFFSET_PTR_PARENT = 9 * 4;

OFFSET_PTR_CHILDREN = 10 * 4;

POINTERS_BEGIN = 8;

POINTER_LENGTH = 16;

POINTER_BYTELENGTH = 4 * POINTER_LENGTH;

TypedArraysIds = {
  [Float32Array]: 1,
  [Uint32Array]: 2,
  [Int32Array]: 3,
  [1]: Float32Array,
  [2]: Uint32Array,
  [3]: Int32Array
};

export var length = 16;

export var byteLength = length * 4;

export var LE = true;

export var Pointer = (function() {
  class Pointer extends Number {
    * [Symbol.iterator](i = -1) {
      var results;
      results = [];
      while (i++ < this.length) {
        results.push((yield this.at(i)));
      }
      return results;
    }

    constructor(offset = -1) {
      if (0 > super(offset)) {
        return new this.constructor(mallocAtomic(this.constructor.byteLength));
      }
      this.init();
    }

    init() {
      return this;
    }

    reloadPointer() {
      this.byteFinish = this.byteOffset + this.byteLength;
      this.length = this.byteLength / this.BYTES_PER_ELEMENT;
      this.begin = this.byteOffset / this.BYTES_PER_ELEMENT;
      this.end = this.begin + this.length;
      return this;
    }

    copyBytesFrom(begin, end) {
      U32ARRAY.copyWithin(this.begin, begin, end);
      return this;
    }

    getUint8(byteOffset) {
      return DATAVIEW.getUint8(this.byteOffset + byteOffset);
    }

    setUint8(byteOffset, value) {
      return DATAVIEW.setUint8(this.byteOffset + byteOffset, value);
    }

    subUint8(byteOffset, length) {
      return new Uint8Array(this.buffer, this.byteOffset + byteOffset, length);
    }

    getInt32(byteOffset) {
      return DATAVIEW.getInt32(this.byteOffset + byteOffset, LE);
    }

    setInt32(byteOffset, value) {
      return DATAVIEW.setInt32(this.byteOffset + byteOffset, value, LE);
    }

    subInt32(byteOffset, length) {
      return new Int32Array(this.buffer, this.byteOffset + byteOffset, length);
    }

    getUint32(byteOffset) {
      return DATAVIEW.getUint32(this.byteOffset + byteOffset, LE);
    }

    setUint32(byteOffset, value) {
      return DATAVIEW.setUint32(this.byteOffset + byteOffset, value, LE);
    }

    subUint32(byteOffset, length) {
      return new Uint32Array(this.buffer, this.byteOffset + byteOffset, length);
    }

    getFloat32(byteOffset) {
      return DATAVIEW.getFloat32(this.byteOffset + byteOffset, LE);
    }

    setFloat32(byteOffset, value) {
      return DATAVIEW.setFloat32(this.byteOffset + byteOffset, value, LE);
    }

    subFloat32(byteOffset, length) {
      return new Float32Array(this.buffer, this.byteOffset + byteOffset, length);
    }

    erase(byteOffset, byteLength) {
      this.subUint8(byteOffset, byteLength).fill(0);
      return this;
    }

    subarray() {
      return this.array.subarray(...arguments);
    }

    fill() {
      this.array.fill(...arguments);
      return this;
    }

    set() {
      this.array.set(...arguments);
      return this;
    }

    at() {
      return this.array.at(...arguments);
    }

  };

  Pointer.byteLength = byteLength;

  Pointer.TypedArray = Uint32Array;

  Pointer.BYTES_PER_ELEMENT = 4;

  Object.defineProperties(Pointer.prototype, {
    byteOffset: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BYTEOFFSET, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BYTEOFFSET, arguments[0], LE);
      }
    },
    byteLength: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BYTELENGTH, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BYTELENGTH, arguments[0], LE);
      }
    },
    byteFinish: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BYTEFINISH, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BYTEFINISH, arguments[0], LE);
      }
    },
    length: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_LENGTH, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_LENGTH, arguments[0], LE);
      }
    },
    begin: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BEGIN, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BEGIN, arguments[0], LE);
      }
    },
    end: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_END, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_END, arguments[0], LE);
      }
    },
    parent: {
      get: function() {
        var ptr;
        if (ptr = DATAVIEW.getUint32(this + OFFSET_PTR_PARENT, LE)) {
          return new Pointer(ptr);
        }
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_PTR_PARENT, arguments[0], LE);
      }
    },
    children: {
      get: function() {
        var childs, offset;
        offset = POINTERS_BEGIN + OFFSET_PTR_PARENT - POINTER_BYTELENGTH;
        length = -8 + Atomics.load(U32ARRAY, 0);
        childs = [];
        while (length > (offset += POINTER_BYTELENGTH)) {
          if (!(this - DATAVIEW.getUint32(offset, LE))) {
            childs.push(new Pointer(offset - OFFSET_PTR_PARENT));
          }
        }
        return childs;
      }
    },
    getPointer: {
      value: function(offset, Ptr) {
        var p;
        if (p = this.getUint32(offset, LE)) {
          return new Ptr(p);
        }
      }
    },
    setPointer: {
      value: function(offset, ptr) {
        return this.setUint32(offset, ptr * 1, LE);
      }
    },
    add: {
      value: function(ptr) {
        return ptr.parent = this;
      }
    },
    grow: {
      value: function(byteLength) {
        var begin, end;
        [begin, end, this.byteLength, this.byteOffset] = [this.begin, this.end, byteLength, mallocAtomic(byteLength)];
        return this.reloadPointer().copyBytesFrom(begin, end);
      }
    },
    move: {
      value: function(byteOffset) {
        var begin, end;
        [begin, end, this.byteOffset] = [this.begin, this.end, byteOffset];
        return this.reloadPointer().copyBytesFrom(begin, end);
      }
    }
  });

  Object.defineProperties(Pointer.prototype, {
    array: {
      get: function() {
        return new this.TypedArray(BUFFER, this.byteOffset, this.length);
      }
    },
    TypedArray: {
      get: function() {
        return this.constructor.TypedArray;
      }
    },
    BYTES_PER_ELEMENT: {
      get: function() {
        return this.TypedArray.BYTES_PER_ELEMENT;
      }
    },
    ["ƒ -> pointer"]: {
      get: function() {
        return U32ARRAY.subarray(this / 4, this / 4 + POINTER_LENGTH);
      }
    }
  });

  return Pointer;

}).call(this);

export default self.Pointer = Pointer;

self.memory = function(buffer) {
  BUFFER = buffer;
  DATAVIEW = new DataView(buffer);
  U32ARRAY = new Uint32Array(buffer);
  Object.defineProperties(Pointer.prototype, {
    buffer: {
      value: buffer
    }
  });
  Atomics.or(U32ARRAY, 1, 4 * 50000);
  Atomics.or(U32ARRAY, 0, POINTERS_BEGIN);
  return this;
};

self.alloc = function(allocByteLength) {
  return Atomics.add(U32ARRAY, 1, allocByteLength);
};

self.palloc = function(allocByteOffset, allocByteLength, Ptr = Pointer) {
  var ptr;
  ptr = new Ptr(Atomics.add(U32ARRAY, 0, POINTER_BYTELENGTH));
  ptr.byteOffset = allocByteOffset;
  ptr.byteLength = allocByteLength;
  return ptr.reloadPointer();
};

self.malloc = function(allocByteLength, Ptr = Pointer) {
  var ptr;
  ptr = new Ptr(Atomics.add(U32ARRAY, 0, POINTER_BYTELENGTH));
  ptr.byteOffset = Atomics.add(U32ARRAY, 1, allocByteLength);
  ptr.byteLength = allocByteLength;
  return ptr.reloadPointer();
};

self.mallocAtomic = function(allocByteLength, Ptr = Pointer) {
  var BPel, allocByteFinish, allocByteOffset, iptr;
  iptr = .25 * Atomics.add(U32ARRAY, 0, POINTER_BYTELENGTH);
  BPel = Ptr.TypedArray.BYTES_PER_ELEMENT;
  allocByteOffset = Atomics.add(U32ARRAY, 1, allocByteLength);
  allocByteFinish = allocByteOffset + allocByteLength;
  Atomics.store(U32ARRAY, iptr + INDEX_BYTEOFFSET, allocByteOffset);
  Atomics.store(U32ARRAY, iptr + INDEX_BYTELENGTH, allocByteLength);
  Atomics.store(U32ARRAY, iptr + INDEX_BYTEFINISH, allocByteFinish);
  Atomics.store(U32ARRAY, iptr + INDEX_LENGTH, allocByteLength / BPel);
  Atomics.store(U32ARRAY, iptr + INDEX_BEGIN, allocByteOffset / BPel);
  Atomics.store(U32ARRAY, iptr + INDEX_END, allocByteFinish / BPel);
  return new Ptr(iptr * 4);
};
