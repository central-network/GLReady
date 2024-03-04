var ATOMICU32, BUFFER, DATAVIEW, OFFSET_BEGIN, OFFSET_BYTEFINISH, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_BYTES_PER_ELEMENT, OFFSET_END, OFFSET_LENGTH, OFFSET_TYPED_ARRAY_ID, TypedArraysIds;

BUFFER = null;

DATAVIEW = null;

ATOMICU32 = null;

OFFSET_BYTEOFFSET = 0 * 4;

OFFSET_BYTELENGTH = 1 * 4;

OFFSET_BYTEFINISH = 2 * 4;

OFFSET_LENGTH = 3 * 4;

OFFSET_BEGIN = 5 * 4;

OFFSET_END = 6 * 4;

OFFSET_TYPED_ARRAY_ID = 7 * 4;

OFFSET_BYTES_PER_ELEMENT = 8 * 4;

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

export var littleEndian = true;

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

    constructor(pointerOffset) {
      if (isNaN(super(pointerOffset))) {
        return malloc(this.constructor.byteLength, this.constructor);
      }
      this.init();
    }

    init() {
      return this;
    }

    updatePointer(TypedArray = this.TypedArray) {
      this.TYPED_ARRAY_ID = TypedArraysIds[TypedArray];
      this.BYTES_PER_ELEMENT = TypedArray.BYTES_PER_ELEMENT;
      this.byteFinish = this.byteOffset + this.byteLength;
      this.length = this.byteLength / this.BYTES_PER_ELEMENT;
      this.begin = this.byteOffset / this.BYTES_PER_ELEMENT;
      this.end = this.begin + this.length;
      this.init();
      return this;
    }

    getUint8(byteOffset) {
      return DATAVIEW.getUint8(this.byteOffset + byteOffset);
    }

    setUint8(byteOffset, value) {
      return DATAVIEW.setUint8(this.byteOffset + byteOffset, value);
    }

    subUint8(byteOffset, length) {
      return new Uint8Array(BUFFER, this.byteOffset + byteOffset, length);
    }

    getInt32(byteOffset) {
      return DATAVIEW.getInt32(this.byteOffset + byteOffset, littleEndian);
    }

    setInt32(byteOffset, value) {
      return DATAVIEW.setInt32(this.byteOffset + byteOffset, value, littleEndian);
    }

    subInt32(byteOffset, length) {
      return new Int32Array(BUFFER, this.byteOffset + byteOffset, length);
    }

    getUint32(byteOffset) {
      return DATAVIEW.getUint32(this.byteOffset + byteOffset, littleEndian);
    }

    setUint32(byteOffset, value) {
      return DATAVIEW.setUint32(this.byteOffset + byteOffset, value, littleEndian);
    }

    subUint32(byteOffset, length) {
      return new Uint32Array(BUFFER, this.byteOffset + byteOffset, length);
    }

    getFloat32(byteOffset) {
      return DATAVIEW.getFloat32(this.byteOffset + byteOffset, littleEndian);
    }

    setFloat32(byteOffset, value) {
      return DATAVIEW.setFloat32(this.byteOffset + byteOffset, value, littleEndian);
    }

    subFloat32(byteOffset, length) {
      return new Float32Array(BUFFER, this.byteOffset + byteOffset, length);
    }

    erase(byteOffset, byteLength) {
      this.subUint8(byteOffset, byteLength).fill(0);
      return this;
    }

    fill() {
      this.array.fill(...arguments);
      return this;
    }

    subarray() {
      return this.array.subarray(...arguments);
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

  Pointer.TypedArray = Float32Array;

  Object.defineProperties(Pointer.prototype, {
    byteOffset: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BYTEOFFSET);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BYTEOFFSET, arguments[0]);
      }
    },
    byteLength: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BYTELENGTH);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BYTELENGTH, arguments[0]);
      }
    },
    byteFinish: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BYTEFINISH);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BYTEFINISH, arguments[0]);
      }
    },
    length: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_LENGTH);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_LENGTH, arguments[0]);
      }
    },
    begin: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BEGIN);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BEGIN, arguments[0]);
      }
    },
    end: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_END);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_END, arguments[0]);
      }
    },
    TYPED_ARRAY_ID: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_TYPED_ARRAY_ID);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_TYPED_ARRAY_ID, arguments[0]);
      }
    },
    BYTES_PER_ELEMENT: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_BYTES_PER_ELEMENT);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_BYTES_PER_ELEMENT, arguments[0]);
      }
    }
  });

  Object.defineProperties(Pointer.prototype, {
    TypedArray: {
      get: function() {
        return TypedArraysIds[this.TYPED_ARRAY_ID] || this.constructor.TypedArray;
      }
    },
    array: {
      get: function() {
        return new this.TypedArray(BUFFER, this.byteOffset, this.length);
      }
    }
  });

  return Pointer;

}).call(this);

export default Pointer;

self.memory = function(buffer) {
  BUFFER = buffer;
  DATAVIEW = new DataView(buffer);
  ATOMICU32 = new Uint32Array(buffer);
  Object.defineProperties(Pointer.prototype, {
    buffer: {
      value: buffer
    }
  });
  Atomics.or(ATOMICU32, 1, 4 * 50000);
  Atomics.or(ATOMICU32, 0, 4 * 4);
  return this;
};

self.malloc = function(allocLength, Ptr = Pointer) {
  var ptr;
  ptr = new Ptr(Atomics.add(ATOMICU32, 0, byteLength));
  ptr.byteOffset = Atomics.add(ATOMICU32, 1, allocLength);
  ptr.byteLength = allocLength;
  return ptr.updatePointer();
};

self.realloc = function(allocOffset, allocLength, Ptr = Pointer) {
  var ptr;
  ptr = new Ptr(Atomics.add(ATOMICU32, 0, byteLength));
  ptr.byteOffset = allocOffset;
  ptr.byteLength = allocLength;
  return ptr.updatePointer();
};
