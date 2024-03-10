var CLASS_ID, Color4, INDEX_BEGIN, INDEX_BYTELENGTH, INDEX_BYTEOFFSET, INDEX_BYTES_PER_ELEMENT, INDEX_END, INDEX_LENGTH, INDEX_PTRCLASSID, INDEX_PTR_CLASS_ID, INDEX_PTR_PARENT, INDEX_TYPED_ARRAY_ID, OBJECTS, OBJECTS_ARRAY, OFFSET_BEGIN, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_END, OFFSET_LENGTH, OFFSET_PTRCLASSID, OFFSET_PTR_OBJECT, OFFSET_PTR_PARENT, POINTERS_BEGIN, POINTER_BYTELENGTH, POINTER_LENGTH, PTR_PROTOTYPE, TypedArraysIds, cls, getCaller, i, j, key, keys, len, val, vals, vars;

export var BUFFER = null;

export var DATAVIEW = null;

export var U32ARRAY = null;

INDEX_BYTEOFFSET = 0;

INDEX_BYTELENGTH = 1;

INDEX_PTRCLASSID = 2;

INDEX_LENGTH = 3;

INDEX_BEGIN = 5;

INDEX_END = 6;

INDEX_TYPED_ARRAY_ID = 7;

INDEX_BYTES_PER_ELEMENT = 8;

INDEX_PTR_PARENT = 9;

INDEX_PTR_CLASS_ID = 10;

OFFSET_BYTEOFFSET = 0 * 4;

OFFSET_BYTELENGTH = 1 * 4;

OFFSET_PTRCLASSID = 2 * 4;

OFFSET_LENGTH = 3 * 4;

OFFSET_BEGIN = 5 * 4;

OFFSET_END = 6 * 4;

OFFSET_PTR_PARENT = 7 * 4;

OFFSET_PTR_OBJECT = 8 * 4;

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

OBJECTS = [null];

CLASS_ID = [, ];

OBJECTS.index = function(o) {
  var i, j, len, p, ref;
  ref = this;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    p = ref[i];
    if (!(p instanceof Number)) {
      if (p === o) {
        return i;
      }
    } else if (0 === p - o) {
      return i;
    }
  }
  return -1 + this.push(o);
};

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
      var o, p;
      if (0 > super(offset)) {
        o = mallocAtomic(this.constructor.byteLength, this.constructor);
        p = new this.constructor(o);
        p.init();
        return p;
      }
    }

    static malloc(byteLength) {
      return mallocAtomic(byteLength, this);
    }

    static maybePointer(offset, pointer = this) {
      var ptr;
      if (!(ptr = DATAVIEW.getUint32(pointer + offset))) {
        DATAVIEW.setUint32(pointer + offset, ptr = mallocAtomic(this.byteLength, pointer));
      }
      return new this(ptr);
    }

    init() {
      return this;
    }

    reloadPointer() {
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

    getColor4(byteOffset) {
      return new Color4(DATAVIEW.getUint32(this.byteOffset + byteOffset, LE));
    }

    setColor4(byteOffset, value) {
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

    setObject(byteOffset, object) {
      return DATAVIEW.setUint32(this.byteOffset + byteOffset, OBJECTS.index(object), LE);
    }

    getObject(byteOffset) {
      return OBJECTS[DATAVIEW.getUint32(this.byteOffset + byteOffset, LE)];
    }

    getHeader(byteOffset, isObject) {
      var value;
      value = DATAVIEW.getUint32(this + byteOffset, LE);
      if (!isObject) {
        return value;
      }
      return OBJECTS[value];
    }

    keyHeader(byteOffset) {
      return keyOf(DATAVIEW.getUint32(this + byteOffset, LE));
    }

    setHeader(byteOffset, value, isObject) {
      if (isObject) {
        value = OBJECTS.index(value);
      }
      DATAVIEW.setUint32(this + byteOffset, value, LE);
      return value;
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

    map() {
      return this.array.map(...arguments);
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
    classId: {
      get: function() {
        return DATAVIEW.getUint32(this + OFFSET_PTRCLASSID, LE);
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_PTRCLASSID, arguments[0], LE);
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
        return OBJECTS[DATAVIEW.getUint32(this + OFFSET_PTR_PARENT, LE)];
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_PTR_PARENT, arguments[0], LE);
      }
    },
    object: {
      get: function() {
        return OBJECTS[DATAVIEW.getUint32(this + OFFSET_PTR_OBJECT, LE)];
      },
      set: function() {
        return DATAVIEW.setUint32(this + OFFSET_PTR_OBJECT, OBJECTS.index(arguments[0]), LE);
      }
    },
    children: {
      get: function() {
        return OBJECTS.filter((obj) => {
          return 0 === this - (obj != null ? obj.parent : void 0);
        });
      }
    },
    add: {
      value: function(child) {
        if (!(child instanceof Number)) {
          OBJECTS.index(child);
        }
        return child.parent = OBJECTS.index(this);
      }
    },
    grow: {
      value: function(byteLength) {
        var begin, end;
        [begin, end, this.byteLength, this.byteOffset] = [this.begin, this.end, byteLength, mallocAtomic(byteLength, this.constructor)];
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

Object.defineProperties(DataView.prototype, {
  setObject: {
    value: function(byteOffset, object, littleEndian = LE) {
      this.setUint32(byteOffset, OBJECTS.index(object), littleEndian);
      return object;
    }
  },
  getObject: {
    value: function(byteOffset, littleEndian = LE) {
      return OBJECTS[this.getUint32(byteOffset, littleEndian)];
    }
  }
});

export var ObjectPointer = (function() {
  class ObjectPointer extends Number {
    static of(i) {
      return this.array[i];
    }

    constructor(object, index = ++ObjectPointer.count) {
      ObjectPointer.array[super(index)] = object;
    }

  };

  ObjectPointer.array = [];

  ObjectPointer.count = 0;

  return ObjectPointer;

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
    [$ptr]: {
      configurable: true
    }
  });

  Reflect.deleteProperty(IndexPointer, $ptr);

  Reflect.deleteProperty(IndexPointer, 'children');

  return IndexPointer;

}).call(this);

Color4 = (function() {
  class Color4 extends Number {};

  Object.defineProperties(Color4.prototype, {
    f32: {
      get: function() {
        var di, dv, i8;
        dv = new DataView(new ArrayBuffer(4));
        dv.setUint32(0, this, LE);
        i8 = new Uint8Array(dv.buffer);
        if (LE) {
          i8.reverse();
        }
        di = 255;
        return Float32Array.of(...[...i8].map(function(n) {
          return n / di;
        }));
      }
    },
    ui8: {
      get: function() {
        var dv, i8;
        dv = new DataView(new ArrayBuffer(4));
        dv.setUint32(0, this, LE);
        i8 = new Uint8Array(dv.buffer);
        if (LE) {
          i8.reverse();
        }
        return i8;
      }
    },
    hex: {
      get: function() {
        return "#" + [...this.ui8].map(function(n) {
          return n.toString(16).padStart(2, 0);
        }).join("");
      }
    },
    css: {
      get: function() {
        var a, b, g, r;
        [r, g, b, a] = this.ui8;
        (a = (a / 2.55).toFixed(2));
        return `rgba( ${r} ${g} ${b} / ${a}% )`;
      }
    }
  });

  return Color4;

}).call(this);

Object.defineProperties(WebGL2RenderingContext, {
  DEPTH_N_COLOR_BIT: {
    value: WebGL2RenderingContext.DEPTH_BUFFER_BIT | WebGL2RenderingContext.COLOR_BUFFER_BIT
  }
});

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
  Ptr.ClassId || (Ptr.ClassId = -1 + CLASS_ID.push(Ptr));
  Atomics.store(U32ARRAY, iptr + INDEX_BYTEOFFSET, allocByteOffset);
  Atomics.store(U32ARRAY, iptr + INDEX_BYTELENGTH, allocByteLength);
  Atomics.store(U32ARRAY, iptr + INDEX_PTRCLASSID, Ptr.ClassId);
  Atomics.store(U32ARRAY, iptr + INDEX_LENGTH, allocByteLength / BPel);
  Atomics.store(U32ARRAY, iptr + INDEX_BEGIN, allocByteOffset / BPel);
  Atomics.store(U32ARRAY, iptr + INDEX_END, allocByteFinish / BPel);
  return new Ptr(iptr * 4);
};
