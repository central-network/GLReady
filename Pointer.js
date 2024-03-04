var BUFFER, DATAVIEW, OFFSET_BEGIN, OFFSET_BYTEFINISH, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_BYTES_PER_ELEMENT, OFFSET_END, OFFSET_LENGTH, OFFSET_TYPED_ARRAY_ID, Pointer, TypedArraysIds;

BUFFER = null;

DATAVIEW = null;

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

export default Pointer = (function() {
  class Pointer extends Number {
    * [Symbol.iterator](i = -1) {
      var results;
      results = [];
      while (i++ < this.length) {
        results.push((yield this.at(i)));
      }
      return results;
    }

    static setSourceBuffer(buffer) {
      BUFFER = buffer;
      return DATAVIEW = new DataView(buffer);
    }

    update(TypedArray = Float32Array) {
      this.TYPED_ARRAY_ID = TypedArraysIds[TypedArray];
      this.BYTES_PER_ELEMENT = this.TypedArray.BYTES_PER_ELEMENT;
      this.byteFinish = this.byteOffset + this.byteLength;
      this.length = this.byteLength / this.BYTES_PER_ELEMENT;
      this.begin = this.byteOffset / this.BYTES_PER_ELEMENT;
      this.end = this.begin + this.length;
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
        return TypedArraysIds[this.TYPED_ARRAY_ID];
      }
    },
    array: {
      get: function() {
        return new this.TypedArray(BUFFER, this.byteOffset, this.length);
      }
    },
    buffer: {
      get: function() {
        return BUFFER.slice(this.byteOffset, this.byteOffset + this.byteLength);
      }
    }
  });

  return Pointer;

}).call(this);
