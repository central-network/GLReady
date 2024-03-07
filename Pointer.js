var INDEX_BEGIN, INDEX_BYTEFINISH, INDEX_BYTELENGTH, INDEX_BYTEOFFSET, INDEX_BYTES_PER_ELEMENT, INDEX_END, INDEX_LENGTH, INDEX_PTR_CLASS_ID, INDEX_PTR_PARENT, INDEX_TYPED_ARRAY_ID, OBJECTS_ARRAY, OFFSET_BEGIN, OFFSET_BYTEFINISH, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_END, OFFSET_LENGTH, OFFSET_PTR_CLASSID, OFFSET_PTR_PARENT, POINTERS_BEGIN, POINTER_BYTELENGTH, POINTER_LENGTH, PTR_PROTOTYPE, TypedArraysIds, cls, getCaller, i, j, key, keys, len, val, vals, vars;

export var BUFFER = null;

export var DATAVIEW = null;

export var U32ARRAY = null;

INDEX_BYTEOFFSET = 0;

INDEX_BYTELENGTH = 1;

INDEX_BYTEFINISH = 2;

INDEX_LENGTH = 3;

INDEX_BEGIN = 5;

INDEX_END = 6;

INDEX_TYPED_ARRAY_ID = 7;

INDEX_BYTES_PER_ELEMENT = 8;

INDEX_PTR_PARENT = 9;

INDEX_PTR_CLASS_ID = 10;

OFFSET_BYTEOFFSET = 0 * 4;

OFFSET_BYTELENGTH = 1 * 4;

OFFSET_BYTEFINISH = 2 * 4;

OFFSET_LENGTH = 3 * 4;

OFFSET_BEGIN = 5 * 4;

OFFSET_END = 6 * 4;

OFFSET_PTR_PARENT = 7 * 4;

OFFSET_PTR_CLASSID = 8 * 4;

export var OFFSET_OBJECT_0 = 9 * 4;

export var OFFSET_OBJECT_1 = 10 * 4;

export var OFFSET_OBJECT_2 = 11 * 4;

export var OFFSET_OBJECT_3 = 12 * 4;

export var OFFSET_OBJECT_4 = 13 * 4;

export var OFFSET_OBJECT_5 = 14 * 4;

export var OFFSET_OBJECT_6 = 15 * 4;

POINTERS_BEGIN = 8;

POINTER_LENGTH = 16;

POINTER_BYTELENGTH = 4 * POINTER_LENGTH;

PTR_PROTOTYPE = [null];

OBJECTS_ARRAY = {};

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

export var $ptr = '∆';

vals = Object.values(WebGL2RenderingContext);

keys = Object.keys(WebGL2RenderingContext);

vars = {};

for (i = j = 0, len = vals.length; j < len; i = ++j) {
  val = vals[i];
  key = keys.at(i);
  cls = eval(`(class ${key} extends Number {})`);
  vars[val] = new cls(val);
}

self.keyOf = function(val) {
  return vars[val] || val;
};

getCaller = async function(val) {
  var js, k, l, len1, line, lines, name, ref, stack;
  stack = new Error().stack.toString(); //* 3 -> 2 -> 1 : fn.called
  [, js, line] = stack.split(/\n/g).at(3).split(":");
  line *= 1;
  lines = ((await ((await fetch(js))).text())).split(/\n/g, line);
  ref = lines.slice(-10);
  for (k = 0, len1 = ref.length; k < len1; k++) {
    l = ref[k];
    if (/return|get|set/.test(l)) {
      continue;
    }
    if (!l.match(/\:/)) {
      continue;
    }
    if (name = l.replace(/\W+/gui, "")) {
      break;
    }
  }
  cls = eval(`(class ${name} extends Number {})`);
  return val = new cls(val);
};

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

    static maybePointer(offset, pointer = this) {
      var ptr;
      if (!(ptr = DATAVIEW.getUint32(pointer + offset))) {
        DATAVIEW.setUint32(pointer + offset, ptr = mallocAtomic(this.byteLength));
      }
      return new this(ptr);
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
      DATAVIEW.setUint8(this.byteOffset + byteOffset, value);
      return value;
    }

    subUint8(byteOffset, length) {
      return new Uint8Array(this.buffer, this.byteOffset + byteOffset, length);
    }

    getInt32(byteOffset) {
      return DATAVIEW.getInt32(this.byteOffset + byteOffset, LE);
    }

    setInt32(byteOffset, value) {
      DATAVIEW.setInt32(this.byteOffset + byteOffset, value, LE);
      return value;
    }

    subInt32(byteOffset, length) {
      return new Int32Array(this.buffer, this.byteOffset + byteOffset, length);
    }

    getUint32(byteOffset) {
      return DATAVIEW.getUint32(this.byteOffset + byteOffset, LE);
    }

    keyUint32(byteOffset) {
      return keyOf(DATAVIEW.getUint32(this.byteOffset + byteOffset, LE));
    }

    setUint32(byteOffset, value) {
      DATAVIEW.setUint32(this.byteOffset + byteOffset, value, LE);
      return value;
    }

    subUint32(byteOffset, length) {
      return new Uint32Array(this.buffer, this.byteOffset + byteOffset, length);
    }

    getFloat32(byteOffset) {
      return DATAVIEW.getFloat32(this.byteOffset + byteOffset, LE);
    }

    setFloat32(byteOffset, value) {
      DATAVIEW.setFloat32(this.byteOffset + byteOffset, value, LE);
      return value;
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

    at() {
      return this.array.at(...arguments);
    }

    set() {
      this.array.set([...arguments].flat());
      return this;
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
      configurable: true,
      get: function() {
        var Ptr, classIdPtr, ptr, ptrClassId;
        if (ptr = DATAVIEW.getUint32(this + OFFSET_PTR_PARENT, LE)) {
          if (Ptr = OBJECTS_ARRAY[ptr * 1]) {
            return Ptr;
          }
          classIdPtr = ptr + OFFSET_PTR_CLASSID;
          ptrClassId = DATAVIEW.getUint32(classIdPtr, LE);
          return Ptr = new PTR_PROTOTYPE[ptrClassId](ptr);
        }
      },
      set: function(ptr) {
        var id, p0, p1;
        [p0, p1] = [this * 1, ptr * 1];
        if (!OBJECTS_ARRAY[p0]) {
          OBJECTS_ARRAY[p0] = this;
        }
        if (!OBJECTS_ARRAY[p1]) {
          OBJECTS_ARRAY[p1] = ptr;
        }
        if (!ptr) {
          return DATAVIEW.setUint32(this + OFFSET_PTR_PARENT, 0, LE);
        }
        if (-1 === (id = PTR_PROTOTYPE.indexOf(this.constructor))) {
          id = -1 + PTR_PROTOTYPE.push(this.constructor);
        }
        DATAVIEW.setUint32(this + OFFSET_PTR_CLASSID, id, LE);
        DATAVIEW.setUint32(this + OFFSET_PTR_PARENT, ptr, LE);
        if (-1 === (id = PTR_PROTOTYPE.indexOf(ptr.constructor))) {
          id = -1 + PTR_PROTOTYPE.push(ptr.constructor);
        }
        return DATAVIEW.setUint32(ptr + OFFSET_PTR_CLASSID, id, LE);
      }
    },
    ptrClassId: {
      configurable: true,
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_PTR_CLASSID, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_PTR_CLASSID, arguments[0], LE);
      }
    },
    children: {
      configurable: true,
      get: function() {
        var childs, classId, offset, ptr, ptrClassId;
        offset = POINTERS_BEGIN + OFFSET_PTR_PARENT - POINTER_BYTELENGTH;
        length = -8 + Atomics.load(U32ARRAY, 0);
        childs = [];
        while (length > (offset += POINTER_BYTELENGTH)) {
          if (this - DATAVIEW.getUint32(offset, LE)) {
            continue;
          }
          ptr = offset - OFFSET_PTR_PARENT;
          classId = ptr + OFFSET_PTR_CLASSID;
          ptrClassId = DATAVIEW.getUint32(classId, LE);
          childs.push(new PTR_PROTOTYPE[ptrClassId](ptr));
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
    del: {
      value: function(ptr) {
        return ptr.parent = 0;
      }
    },
    remove: {
      value: function() {
        return this.children.forEach(this.del.bind(this));
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

  Object.defineProperties(Pointer, {
    BYTES_PER_ELEMENT: {
      get: function() {
        return this.TypedArray.BYTES_PER_ELEMENT;
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
    ["∆"]: {
      get: function() {
        return U32ARRAY.subarray(this / 4, this / 4 + POINTER_LENGTH);
      }
    }
  });

  return Pointer;

}).call(this);

export var IndexPointer = (function() {
  class IndexPointer extends Pointer {
    static of(parent) {
      var Ptr, at, count, items, label;
      if (Ptr = parent[this.name]) {
        return Ptr;
      }
      count = parent.byteLength / this.byteLength;
      items = (function() {
        var results = [];
        for (var k = 0; 0 <= count ? k < count : k > count; 0 <= count ? k++ : k--){ results.push(k); }
        return results;
      }).apply(this);
      label = this.name + "Elements";
      Object.defineProperties(parent.constructor.prototype, {
        [this.name]: {
          value: Ptr = at = (function() {
            class at extends this {
              static at(i) {
                if (!(i >= count)) {
                  return new Ptr(i);
                }
                throw `Index is out of bounds ${i} of ${count}.`;
              }

            };

            at.prototype.parent = parent;

            return at;

          }).call(this)
        },
        [label]: {
          get: function() {
            return items.map(Ptr.at);
          }
        }
      });
      return Ptr;
    }

  };

  Object.defineProperties(IndexPointer.prototype, {
    ["begin"]: {
      get: function() {
        return this.parent.begin + (this * this.length);
      }
    },
    ["end"]: {
      get: function() {
        return this.length + this.begin;
      }
    },
    ["byteOffset"]: {
      get: function() {
        return this.parent.byteOffset + (this * this.byteLength);
      }
    },
    ["byteFinish"]: {
      get: function() {
        return this.byteOffset + this.byteLength;
      }
    },
    ["byteLength"]: {
      get: function() {
        return this.constructor.byteLength;
      }
    },
    ["length"]: {
      get: function() {
        return this.byteLength / this.BYTES_PER_ELEMENT;
      }
    },
    ["parent"]: {
      configurable: true,
      writable: true
    },
    ["children"]: {
      configurable: true
    },
    ["ptrClassId"]: {
      configurable: true
    },
    [$ptr]: {
      configurable: true
    }
  });

  Reflect.deleteProperty(IndexPointer, $ptr);

  Reflect.deleteProperty(IndexPointer, 'children');

  Reflect.deleteProperty(IndexPointer, 'ptrClassId');

  return IndexPointer;

}).call(this);

Object.defineProperties(Float32Array.prototype, {
  toUint32: {
    value: function() {
      return new Uint32Array(Uint8Array.of(this.at(0) * 0xff, this.at(1) * 0xff, this.at(2) * 0xff, this.at(3) * 0xff).buffer).at(0);
    }
  },
  toRGBAHex: {
    value: function() {
      return "#" + [
        ...new Uint8Array([...this].map(function(n) {
          return n * 255;
        }))
      ].map(function(n) {
        return n.toString(16).padStart(2, 0);
      }).join("");
    }
  },
  toRGBA255: {
    value: function() {
      return new Uint8Array(this.toRGBA0x1().map(function(n) {
        return n * 255;
      }));
    }
  },
  toRGBA0x1: {
    value: function() {
      return [...this];
    }
  },
  toRGBAcss: {
    value: function() {
      var a, b, g, r;
      [r, g, b, a] = this.toRGBA255();
      (a = (a / 2.55).toFixed(2));
      return `rgba( ${r} ${g} ${b} / ${a}% )`;
    }
  }
});

Object.defineProperties(Float32Array, {
  fromUint32: {
    value: function() {
      return arguments[0].toFloat32Array();
    }
  }
});

Object.defineProperties(Number.prototype, {
  toUint32Number: {
    value: function() {
      var buf;
      new DataView(buf = new ArrayBuffer(4)).setUint32(0, this, LE);
      return parseInt("0x" + [...new Uint8Array(buf)].map(function(m) {
        return m.toString(16).padStart(2, 0);
      }).join(""));
    }
  },
  toFloat32Array: {
    value: function(normalized = true) {
      var di, dv, i8;
      dv = new DataView(new ArrayBuffer(4));
      dv.setUint32(0, this, LE);
      i8 = new Uint8Array(dv.buffer);
      if (LE) {
        i8.reverse();
      }
      di = 1;
      if (normalized) {
        di = 255;
      }
      return Float32Array.of(...[...i8].map(function(n) {
        return n / di;
      }));
    }
  },
  toRGBA: {
    value: function() {
      return this.toFloat32Array(...arguments);
    }
  }
});

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
