
/*
    jsScript	JavaScript
    is	            ===
    isnt	        !==
    not	            !
    and	            &&
    or	            ||
    true, yes, on	true
    false, no, off 	false
    @, this	        this
    a in b	        [].indexOf.call(b, a) >= 0
    a of b	        a in b
    for a from b	for (a of b)
    a ** b	        a ** b
    a // b	        Math.floor(a / b)
    a %% b	        (a % b + b) % b

    <imporssible>   to ->
    [
        first,      <
        chars...,   impossible
        close       >
    ] = tag.split("")

 |- if  this.studyingEconomics
 |___   buy()  while supply > demand
    |   sell() until supply > demand
    |
    |
    '-> if (this.studyingEconomics) {
            while (supply > demand) {
                buy();
            }
            while (!(supply > demand)) {
                sell();
            }
        }

 */
var BYTES_PER_POINTER, INDEX_BUF, INDEX_FPS, INDEX_HIT, INDEX_LINKEDNODE, INDEX_NOW, INDEX_PARENT_PTR, INDEX_PROTOCLASS, INDEX_PTR, KEYED, KEYEX, LE, LENGTH_OF_POINTER, NONE, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_LINKEDNODE, OFFSET_PARENT_PTR, OFFSET_PROTOCLASS, OFFSET_PTRCLASS_0, OFFSET_PTRCLASS_1, OFFSET_PTRCLASS_2, OFFSET_PTRCLASS_3, OFFSET_PTRCLASS_4, OFFSET_RESVERVEDS, POINTERS_BYTELENGTH, POINTERS_BYTEOFFSET, SYM_LOOP, buf, dump, dvw, fill, hist, i32, ival, malloc, palloc, proxy, u32;

import "./ptr_self.js";

LE = !new Uint8Array(Float32Array.of(1).buffer)[0];

self.OBJECTS = [, ];

SYM_LOOP = Symbol.iterator;

buf = u32 = i32 = dvw = palloc = malloc = false;

INDEX_NOW = 0;

INDEX_HIT = 1;

INDEX_FPS = 2;

INDEX_PTR = 3;

INDEX_BUF = 4;

POINTERS_BYTELENGTH = 4 * 1e5;

POINTERS_BYTEOFFSET = 4 * 16;

proxy = function() {
  var o;
  o = WebGL2RenderingContext.prototype;
  o.i = arguments[0];
  return new Proxy(o, {
    get: function({i}, key) {
      var result;
      //* request sent to window --->
      //TODO integrate arguments for fns
      postMessage({
        proxy: i,
        key: key
      });
      //* proxy locked now --->
      Atomics.wait(i32, 11000, 0);
      //TODO window processing request
      //TODO notify 1000 index for one time 
      //TODO when result is ready

      //* proxy unlocked now --->
      result = Atomics.load(i32, 11000);
      //TODO window written result to that index
      //TODO we need to implement more complex ones

      //TODO hey beyb: that's sync on window and worker
      return result; //? awesome :))) <3
    }
  });
};

export var GLType = KEYED = {};

KEYEX = {
  0: new (NONE = class NONE extends Number {})(0)
};

(function() {
  var k, results, v;
  results = [];
  for (k in WebGL2RenderingContext) {
    v = WebGL2RenderingContext[k];
    results.push(KEYED[v] = eval(`new (class ${k} extends Number {})(${v})`));
  }
  return results;
})();

Object.defineProperty(Object, "protos", {
  value: function() {
    var desc, prop, protos, ref;
    protos = [];
    ref = this.getOwnPropertyDescriptors(arguments[0]);
    for (prop in ref) {
      desc = ref[prop];
      if (this.hasOwn(desc.value, "protoClass")) {
        protos.push(desc.value);
      }
    }
    return protos;
  }
});

Object.defineProperty(Object, "define", {
  value: function() {
    var desc, prop, props, proto;
    try {
      [proto, props, desc] = [...arguments];
    } catch (error) {}
    if (desc) {
      this.define(proto, {
        [props]: desc
      });
    } else {
      for (prop in props) {
        desc = props[prop];
        this.defineProperty(proto, prop, {
          configurable: true,
          ...desc
        });
      }
    }
    return proto;
  }
});

Object.defineProperty(Object, "symbol", {
  value: function() {
    var desc, fail, key, prop, proto, symbol;
    try {
      [proto, prop, desc] = [...arguments];
    } catch (error) {}
    if (desc) {
      this.symbol(proto, {
        [prop]: desc
      });
    } else {
      for (key in prop) {
        desc = prop[key];
        symbol = (function() {
          switch (key) {
            case "primitive":
              return Symbol.toPrimitive;
            case "instance":
              return Symbol.hasInstance;
            case "iterate":
              return Symbol.iterator;
            default:
              return Symbol[key];
          }
        })();
        try {
          this.defineProperty(proto, symbol, desc);
        } catch (error) {
          fail = error;
          throw fail;
        }
      }
    }
    return proto;
  }
});

Object.defineProperty(Object, "hidden", {
  value: function() {
    var desc, get, j, len1, prop, props, proto, set;
    try {
      [proto, ...props] = [...arguments];
    } finally {
      desc = {
        configurable: true
      };
    }
    for (j = 0, len1 = props.length; j < len1; j++) {
      prop = props[j];
      ({get, set} = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(proto.prototype), prop));
      this.define(proto.prototype, prop, {
        value: (function(getter, setter) {
          return function() {
            if (!arguments[0]) {
              return getter.call(this);
            }
            setter.call(this, arguments[0]);
            return this;
          };
        })(get, set)
      });
    }
    return proto;
  }
});

Object.defineProperties(Array.prototype, {
  sumAttrib: {
    value: function() {
      var j, len1, n, ref, s, v;
      n = arguments[s = 0];
      ref = this;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        ({
          [n]: v
        } = ref[j]);
        s += v;
      }
      return s;
    }
  },
  getAttrib: {
    value: function() {
      var func, value;
      [func, value] = arguments;
      return this.find(function(v) {
        return 0 === v[func]() - value;
      });
    }
  }
});

Object.defineProperties(DataView.prototype, {
  setObject: {
    value: function(offset, object) {
      var i;
      if (-1 === (i = OBJECTS.indexOf(object))) {
        i += OBJECTS.push(object);
        this.setUint32(offset, i, LE);
      }
      return OBJECTS[i];
    }
  },
  delObject: {
    value: function(offset/*: number */) {
      OBJECTS.splice(offset, 1);
      return 0;
    }
  },
  getObject: {
    value: function(offset) {
      var i, o;
      if (!(i = this.getUint32(offset, LE))) {
        return;
      }
      if (!(o = OBJECTS[i])) {
        if (typeof window === "undefined" || window === null) {
          return OBJECTS[i] = proxy(i);
        }
        return new Pointer(i);
      }
      return o;
    }
  },
  toPointer: {
    value: function(offset, Prototype = Pointer) {
      var i;
      if (i = this.getUint32(offset, LE)) {
        return new Prototype(i);
      }
    }
  },
  keyUint16: {
    value: function(offset, extend = KEYEX) {
      var v;
      return extend[v = this.getUint16(offset, LE)] || KEYED[v];
    }
  },
  keyUint32: {
    value: function(offset, extend = KEYEX) {
      var v;
      return extend[v = this.getUint32(offset, LE)] || KEYED[v];
    }
  }
});

Object.defineProperties(Math, {
  rad: {
    value: function(deg) {
      return deg * Math.PI / 180;
    }
  },
  deg: {
    value: function(rad) {
      return rad * 180 / Math.PI;
    }
  },
  powsum: {
    value: function(arr, pow = 2) {
      return [...arr].flat().reduce(function(a, b) {
        return a + Math.pow(b, pow);
      });
    }
  }
});

export var Vector = class Vector extends Number {};

export var Angle3 = class Angle3 extends Vector {};

export var Vertex = class Vertex extends Vector {};

export var Scale3 = class Scale3 extends Vector {};

export var Color4 = class Color4 extends Number {};

export var Color4Number = class Color4Number extends Number {};

export var OffsetPointer = class OffsetPointer extends Number {};

Object.define(OffsetPointer, {
  typedArray: {
    value: Float32Array
  }
});

Object.define(OffsetPointer.prototype, {
  getArrayLength: {
    value: function() {
      return this.getLinkedNode().getTypedLength() - this.getLinkedNode().constructor.LENGTH_OF_POINTER;
    }
  },
  getTypedArray: {
    value: function() {
      return this.getLinkedNode().subarray(-this.getArrayLength());
    }
  },
  getByteOffset: {
    value: function() {
      return this.getLinkedNode().getByteOffset();
    }
  },
  getLinkedNode: {
    value: function() {
      return new Pointer(this * 1);
    }
  },
  getBufferOffset: {
    value: function() {
      return this.getLinkedNode().getBufferOffset();
    }
  }
});

Object.define(OffsetPointer.prototype, {
  link: {
    get: OffsetPointer.prototype.getLinkedNode
  }
});

Object.define(Vector, {
  byteLength: {
    value: 4 * 3
  },
  length: {
    value: 3
  }
});

Object.symbol(Vector.prototype, {
  iterate: {
    value: function() {
      var i, length, offset;
      length = i = -4 + this;
      offset = Uint32Array.of(length += 4, length += 4, length += 4).reverse();
      return {
        next: () => {
          var done, value;
          value = (done = length === i) ? this : dvw.getFloat32(i = 4 + i, LE);
          return {done, value};
        }
      };
    }
  }
});

Object.define(Vector.prototype, {
  getTypedArray: {
    value: function() {
      return new Float32Array(dvw.buffer, this, 3);
    }
  },
  set: {
    value: function() {
      this.getTypedArray().set([...arguments].flat());
      return this;
    }
  }
});

Object.define(Vector.prototype, {
  getX: {
    value: function() {
      return dvw.getFloat32(this, LE);
    }
  },
  getY: {
    value: function() {
      return dvw.getFloat32(this + 4, LE);
    }
  },
  getZ: {
    value: function() {
      return dvw.getFloat32(this + 8, LE);
    }
  },
  setX: {
    value: function() {
      return dvw.setFloat32(this, arguments[0], LE);
    }
  },
  setY: {
    value: function() {
      return dvw.setFloat32(this + 4, arguments[0], LE);
    }
  },
  setZ: {
    value: function() {
      return dvw.setFloat32(this + 8, arguments[0], LE);
    }
  }
});

Object.define(Vector.prototype, {
  x: {
    get: Vector.prototype.getX,
    set: Vector.prototype.setX
  },
  y: {
    get: Vector.prototype.getY,
    set: Vector.prototype.setY
  },
  z: {
    get: Vector.prototype.getZ,
    set: Vector.prototype.setZ
  }
});

export var RGBA = (function() {
  class RGBA extends Uint8Array {};

  Object.define(RGBA.prototype, {
    getRed: {
      value: function() {
        return this[0];
      }
    },
    setRed: {
      value: function() {
        return this[0] = arguments[0];
      }
    },
    getGreen: {
      value: function() {
        return this[1];
      }
    },
    setGreen: {
      value: function() {
        return this[1] = arguments[0];
      }
    },
    getBlue: {
      value: function() {
        return this[2];
      }
    },
    setBlue: {
      value: function() {
        return this[2] = arguments[0];
      }
    },
    getAlpha: {
      value: function() {
        return this[3];
      }
    },
    setAlpha: {
      value: function() {
        return this[3] = arguments[0];
      }
    }
  });

  Object.define(RGBA.prototype, {
    red: {
      get: RGBA.prototype.getRed,
      set: RGBA.prototype.setRed
    },
    green: {
      get: RGBA.prototype.getGreen,
      set: RGBA.prototype.setGreen
    },
    blue: {
      get: RGBA.prototype.getBlue,
      set: RGBA.prototype.setBlue
    },
    alpha: {
      get: RGBA.prototype.getAlpha,
      set: RGBA.prototype.setAlpha
    }
  });

  return RGBA;

}).call(this);

Object.define(Color4, {
  byteLength: {
    value: 4 * 4
  },
  length: {
    value: 4
  },
  fromAny: {
    value: function(any) {
      var a, b, g, r;
      if (isNaN(any)) {
        if (any.map) {
          [r = 0, g = 0, b = 0, a = 1] = any;
          if ((r && r <= 1) || (g && g <= 1) || (b && b <= 1)) {
            r *= 0xff;
            g *= 0xff;
            b *= 0xff;
          }
          if (a && a <= 1) {
            a *= 0xff;
          }
          return parseInt(r.toString(16).padStart(2, 0) + g.toString(16).padStart(2, 0) + b.toString(16).padStart(2, 0) + a.toString(16).padStart(2, 0), 16);
        }
        return parseInt(any);
      }
      return any;
    }
  }
});

Object.symbol(Color4.prototype, {
  iterate: {
    value: function() {
      var i, length, offset;
      length = i = -4 + this;
      offset = Uint32Array.of(length += 4, length += 4, length += 4, length += 4).reverse();
      return {
        next: () => {
          var done, value;
          value = (done = length === i) ? this : dvw.getFloat32(i = 4 + i, LE);
          return {done, value};
        }
      };
    }
  }
});

Object.define(Color4.prototype, {
  getTypedArray: {
    value: function() {
      return new Float32Array(dvw.buffer, this, 4);
    }
  },
  set: {
    value: function() {
      var a, b, color, di, dv, g, i8, r;
      if (arguments[0] && !arguments[0].map && arguments.length === 1) {
        dv = new DataView(new ArrayBuffer(4));
        dv.setUint32(0, argv, LE);
        i8 = new Uint8Array(dv.buffer);
        if (LE) {
          i8.reverse();
        }
        di = 255;
        color = Float32Array.of(...[...i8].map(function(n) {
          return n / di;
        }));
      } else {
        color = [...arguments].flat().slice(0, 4);
      }
      [r, g, b, a] = color;
      if ((r > 1) || (g > 1) || (b > 1) || (a > 1)) {
        if (isNaN(a)) {
          a = 0xff;
        }
        a /= 0xff;
        this.setRed(r / 0xff).setGreen(g / 0xff).setBlue(b / 0xff).setAlpha(a);
      } else {

      }
      if (((0 <= r && r <= 1)) || ((0 <= g && g <= 1)) || ((0 <= b && b <= 1))) {
        if (isNaN(a)) {
          a = 1;
        }
        this.setRed(r).setGreen(g).setBlue(b).setAlpha(a);
      }
      return this;
    }
  },
  getRed: {
    value: function() {
      return dvw.getFloat32(this, LE);
    }
  },
  getGreen: {
    value: function() {
      return dvw.getFloat32(this + 4, LE);
    }
  },
  getBlue: {
    value: function() {
      return dvw.getFloat32(this + 8, LE);
    }
  },
  getAlpha: {
    value: function() {
      return dvw.getFloat32(this + 12, LE);
    }
  },
  setRed: {
    value: function() {
      dvw.setFloat32(this, arguments[0], LE);
      return this;
    }
  },
  setGreen: {
    value: function() {
      dvw.setFloat32(this + 4, arguments[0], LE);
      return this;
    }
  },
  setBlue: {
    value: function() {
      dvw.setFloat32(this + 8, arguments[0], LE);
      return this;
    }
  },
  setAlpha: {
    value: function() {
      dvw.setFloat32(this + 12, arguments[0], LE);
      return this;
    }
  },
  toString: {
    value: function() {
      return this.hex;
    }
  }
});

Object.define(Color4.prototype, {
  f32: {
    get: function() {
      return new Float32Array(dvw.buffer, this, 4);
    }
  },
  ui8: {
    get: function() {
      return Uint8Array.from([...this.f32].map(function(v) {
        return v * 0xff;
      }));
    }
  },
  hex: {
    get: function() {
      return "0x" + [...this.ui8].map(function(n) {
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
  },
  u32: {
    get: function() {
      return parseInt(this.hex, 16);
    }
  },
  rgb: {
    get: function() {
      return RGBA.of(this.getRed() * 0xff, this.getGreen() * 0xff, this.getBlue() * 0xff, this.getAlpha() * 0xff);
    }
  }
});

Object.define(Color4Number.prototype, {
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
  hex: Object.getOwnPropertyDescriptor(Color4.prototype, "hex"),
  css: Object.getOwnPropertyDescriptor(Color4.prototype, "css")
}, Object.define(Number.prototype, {
  toUint32Number: {
    value: function() {
      if (!this) {
        return 0;
      }
      new DataView(buf = new ArrayBuffer(4)).setUint32(0, this, LE);
      return parseInt("0x" + [...new Uint8Array(buf)].map(function(m) {
        return m.toString(16).padStart(2, 0);
      }).join(""));
    }
  },
  toFloat32Array: {
    value: function(normalized = true) {
      var di, dv, i8;
      if (!this) {
        return new Float32Array(4);
      }
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
}));

//? POINTER STARTS
LENGTH_OF_POINTER = 16;

BYTES_PER_POINTER = 4 * LENGTH_OF_POINTER;

OFFSET_BYTEOFFSET = 4 * 1;

OFFSET_BYTELENGTH = 4 * 2;

OFFSET_PROTOCLASS = 4 * (INDEX_PROTOCLASS = 3);

OFFSET_LINKEDNODE = 4 * (INDEX_LINKEDNODE = 4);

OFFSET_PARENT_PTR = 4 * (INDEX_PARENT_PTR = 5);

OFFSET_RESVERVEDS = 4 * 6;

OFFSET_PTRCLASS_0 = 4 * 6;

OFFSET_PTRCLASS_1 = 4 * 7;

OFFSET_PTRCLASS_2 = 4 * 8;

OFFSET_PTRCLASS_3 = 4 * 9;

OFFSET_PTRCLASS_4 = 4 * 10;

export var Pointer = class Pointer extends Number {
  static setBuffer(buf, max = 1e20) {
    var T, f32, ƒ;
    if (!arguments.length) { //? this blocks worker
      while (true) {
        try {
          buf = new SharedArrayBuffer(max);
        } catch (error) {
          if (max = max / 10) {
            continue;
          }
        } finally {
          buf = null;
        }
        break;
      }
      buf = new SharedArrayBuffer(max);
    }
    u32 = new Uint32Array(buf);
    i32 = new Int32Array(buf);
    f32 = new Float32Array(buf);
    dvw = new DataView(buf);
    Atomics.or(u32, INDEX_BUF, POINTERS_BYTELENGTH); //byteOffset
    Atomics.or(u32, INDEX_PTR, POINTERS_BYTEOFFSET); //pointerOffset
    palloc = Atomics.add.bind(Atomics, u32, INDEX_PTR);
    malloc = Atomics.add.bind(Atomics, u32, INDEX_BUF);
    log("base buffer settled", buf);
    log("atomics uint32 base", u32);
    Reflect.defineProperty(Pointer.prototype, "buffer", {
      value: buf
    });
    Reflect.deleteProperty(Pointer, "setBuffer");
    if ((typeof window !== "undefined" && window !== null) && (T = ƒ = function(t) {
      u32[INDEX_NOW] = t;
      u32[INDEX_HIT]++ % 1e2 || (u32[INDEX_FPS] = 1e5 / (-T + (T = t)));
      return requestAnimationFrame(ƒ);
    })) {
      return ƒ(T = 0);
    }
  }

  constructor(ptr = palloc(BYTES_PER_POINTER)) {
    var byteLength, proto;
    super(ptr);
    if (arguments.length) {
      if (this.constructor === Pointer) {
        if (!(proto = OBJECTS[this.getProtoClass()])) {
          console.error(["PROTOCLASS_NOT_FOUND", this * 1]);
        }
        try {
          Object.setPrototypeOf(this, proto.prototype);
        } catch (error) {}
      }
    } else {
      dvw.setUint32(this + OFFSET_PROTOCLASS, this.constructor.protoClass, LE);
      if (byteLength = this.constructor.byteLength) {
        dvw.setUint32(this + OFFSET_BYTELENGTH, byteLength, LE);
        dvw.setUint32(this + OFFSET_BYTEOFFSET, malloc(byteLength), LE);
      }
      this.init();
    }
  }

  static from() {
    var arr, ptr;
    arr = [...arguments].flat();
    ptr = this.malloc(this.byteLength + this.BYTES_PER_ELEMENT * arr.length);
    ptr.subarray(this.byteLength / this.BYTES_PER_ELEMENT).set(arr);
    return ptr;
  }

  static malloc(byteLength) {
    var byteOffset, protoClass, ptrAllocAt;
    ptrAllocAt = palloc(BYTES_PER_POINTER);
    byteOffset = malloc(byteLength + (4 - byteLength % 4));
    protoClass = this.protoClass;
    dvw.setUint32(ptrAllocAt + OFFSET_BYTELENGTH, byteLength, LE);
    dvw.setUint32(ptrAllocAt + OFFSET_PROTOCLASS, protoClass, LE);
    dvw.setUint32(ptrAllocAt + OFFSET_BYTEOFFSET, byteOffset, LE);
    return new this(ptrAllocAt).init();
  }

  resize() {
    var $byteLength, $byteOffset, j, length, old, ptr, ref, tarray, tis;
    //TODO this clones object buffer and creates new pointer for cloned onw
    //TODO ---> no need to clone, just change byteLength and length <3 
    tarray = new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
    for (length = j = ref = this.byteLength; (ref <= 0 ? j <= 0 : j >= 0); length = ref <= 0 ? ++j : --j) {
      if (tarray[length]) {
        break;
      }
    }
    tarray.slice(0, $byteLength = ++length);
    $byteOffset = malloc($byteLength);
    ptr = palloc(BYTES_PER_POINTER);
    old = new Uint32Array(this.buffer, this, LENGTH_OF_POINTER);
    tis = new Uint32Array(this.buffer, ptr, LENGTH_OF_POINTER);
    tis.set(old);
    dvw.setUint32(ptr + OFFSET_BYTELENGTH, $byteLength, LE);
    dvw.setUint32(ptr + OFFSET_BYTEOFFSET, $byteOffset, LE);
    old = new Uint8Array(this.buffer, this.byteOffset, $byteLength);
    tis = new Uint8Array(this.buffer, $byteOffset, $byteLength);
    tis.set(old);
    return new this.constructor(ptr);
  }

  init() {
    return this;
  }

  fork() {
    var worker;
    this.add(worker = new WorkerPointer());
    return worker.onmessage = ({data}) => {
      var i, key, result;
      if (i = data.proxy) { //TODO is it proxy request? only one just for now
        key = data.key; //TODO what is fn's or variable's name
        result = OBJECTS[i][key];
        
        //TODO call if it is a function -- not ready yet
        if (typeof result === "function") {
          //TODO needs arguments parameter?? 
          result = result(...data.arguments);
        }
        log({
          request: OBJECTS[i].constructor.name + "." + key
        });
        log({
          result: result
        });
        //TODO store result to Int32 array
        Atomics.store(i32, 11000, result);
        //TODO notify cell to unlock
        return Atomics.notify(i32, 11000, 1);
      }
    };
  }

  //* proxy unlocked now --->
  add() {
    return arguments[0].setParentPtri(this);
  }

  set() {
    this.getTypedArray().set(...arguments);
    return this;
  }

  subarray() {
    return this.getTypedArray().subarray(...arguments);
  }

  slice() {
    return this.getTypedArray().slice(...arguments);
  }

};

export var Matrix4 = class Matrix4 extends Pointer {};

export var Camera = class Camera extends Matrix4 {};

export var WorkerPointer = class WorkerPointer extends Pointer {};

Object.symbol(Pointer.prototype, {
  iterate: {
    value: function() {
      var i, len, max, min, obj, reader, stride;
      obj = this;
      min = this.getByteOffset();
      len = this.getByteLength();
      max = min + len;
      [stride, reader] = (function() {
        switch (this.constructor.typedArray) {
          case Int32Array:
            return [4, DataView.prototype.getInt32];
          case Uint8Array:
            return [1, DataView.prototype.getUint8];
          case Uint16Array:
            return [2, DataView.prototype.getUint16];
          case Uint32Array:
            return [4, DataView.prototype.getUint32];
          case Float32Array:
            return [4, DataView.prototype.getFloat32];
          default:
            throw ["UNDEFINED_ITERATOR_FOR_POINTER", this];
        }
      }).call(this);
      i = min - stride;
      return {
        next: function() {
          var done, value;
          value = (done = max < i) ? obj : reader.call(dvw, i += stride, LE);
          return {done, value};
        }
      };
    }
  }
});

self.RESV_CLASS_BYTES = {};

Object.define(Pointer, {
  resvStoreIndex: {
    value: function() {
      var i;
      if (!arguments[0]) {
        return -1 + OBJECTS.push(null);
      }
      if (-1 === (i = OBJECTS.indexOf(arguments[0]))) {
        i += OBJECTS.push(arguments[0]);
      }
      return i;
    }
  },
  storeObject: {
    value: function() {
      return OBJECTS[arguments[0]] = arguments[1];
    }
  },
  allocHeadByte: {
    value: function() {
      var bpe, mod, offset;
      if (!(offset = RESV_CLASS_BYTES[this])) {
        offset = RESV_CLASS_BYTES[this] = OFFSET_RESVERVEDS;
      }
      bpe = arguments[0].BYTES_PER_ELEMENT;
      if (mod = offset % bpe) {
        offset = RESV_CLASS_BYTES[this] += mod;
      }
      RESV_CLASS_BYTES[this] += bpe;
      return offset;
    }
  },
  classExtender: {
    value: function() {
      return `(class ${arguments[0]} extends ${this.name} {})`;
    }
  },
  registerClass: {
    value: function() {
      if (-1 === OBJECTS.indexOf(this)) {
        this.protoClass = -1 + OBJECTS.push(this);
      }
      if (this.byteLength) {
        return this;
      }
      return Object.hidden(this, "array", "byteLength", "byteOffset", "headers", "length", "children");
    }
  },
  setDataBuffer: {
    value: function() {
      [this.prototype.buffer] = arguments;
      return this;
    }
  },
  removePointer: {
    value: function() {
      arguments[0].delParentPtri();
      return this;
    }
  },
  BYTES_PER_ELEMENT: {
    get: function() {
      return this.typedArray.BYTES_PER_ELEMENT;
    }
  },
  LENGTH_OF_POINTER: {
    get: function() {
      return this.byteLength / this.BYTES_PER_ELEMENT;
    }
  }
});


//? new ones    

//* RESV in HEAD :: Uint8
Object.define(Pointer.prototype, {
  objHeadUint8: {
    value: function() {
      return OBJECTS[dvw.getUint8(this + arguments[0])];
    }
  },
  ptrHeadUint8: {
    value: function() {
      return new Pointer(dvw.getUint8(this + arguments[0]));
    }
  },
  keyHeadUint8: {
    value: function() {
      return dvw.keyUint8(this + arguments[0]);
    }
  },
  getHeadUint8: {
    value: function() {
      return dvw.getUint8(this + arguments[0]);
    }
  },
  setHeadUint8: {
    value: function() {
      dvw.setUint8(this + arguments[0], arguments[1]);
      return this;
    }
  },
  addHeadUint8: {
    value: function() {
      var val;
      dvw.setUint8(this + arguments[0], arguments[1] + (val = dvw.getUint8(this + arguments[0])));
      return val;
    }
  }
});

//* RESV in HEAD :: Uint16
Object.define(Pointer.prototype, {
  objHeadUint16: {
    value: function() {
      return OBJECTS[dvw.getUint16(this + arguments[0], LE)];
    }
  },
  ptrHeadUint16: {
    value: function() {
      return new Pointer(dvw.getUint16(this + arguments[0], LE));
    }
  },
  keyHeadUint16: {
    value: function() {
      return dvw.keyUint16(this + arguments[0], LE);
    }
  },
  getHeadUint16: {
    value: function() {
      return dvw.getUint16(this + arguments[0], LE);
    }
  },
  setHeadUint16: {
    value: function() {
      dvw.setUint16(this + arguments[0], arguments[1], LE);
      return this;
    }
  },
  addHeadUint16: {
    value: function() {
      var val;
      dvw.setUint16(this + arguments[0], arguments[1] + (val = dvw.getUint16(this + arguments[0], LE)), LE);
      return val;
    }
  }
});

//* RESV in HEAD :: Uint32
Object.define(Pointer.prototype, {
  objHeadUint32: {
    value: function() {
      return OBJECTS[dvw.getUint32(this + arguments[0], LE)];
    }
  },
  ptrHeadUint32: {
    value: function() {
      return new Pointer(dvw.getUint32(this + arguments[0], LE));
    }
  },
  keyHeadUint32: {
    value: function() {
      return dvw.keyUint32(this + arguments[0], LE);
    }
  },
  getHeadUint32: {
    value: function() {
      return dvw.getUint32(this + arguments[0], LE);
    }
  },
  setHeadUint32: {
    value: function() {
      dvw.setUint32(this + arguments[0], arguments[1], LE);
      return this;
    }
  },
  addHeadUint32: {
    value: function() {
      var val;
      dvw.setUint32(this + arguments[0], arguments[1] + (val = dvw.getUint32(this + arguments[0], LE)), LE);
      return val;
    }
  }
});

Object.define(Pointer.prototype, {
  getNextChild: {
    value: function() {
      var finish, offset, parent, stride;
      parent = this * 1;
      finish = Atomics.load(u32, INDEX_PTR);
      [offset = POINTERS_BYTEOFFSET, stride = OFFSET_PARENT_PTR] = arguments;
      offset += stride;
      while (finish > (offset += BYTES_PER_POINTER)) {
        if (!(parent - dvw.getUint32(offset, LE))) {
          return new Pointer(offset - stride);
        }
      }
      return null;
    }
  },
  getHeader: {
    value: function() {
      return dvw.getUint32(this + arguments[0] * 4, LE);
    }
  },
  getTypedArray: {
    value: function() {
      return new this.constructor.typedArray(this.buffer, this.getByteOffset(), this.getTypedLength());
    }
  },
  getTypedLength: {
    value: function() {
      return this.getByteLength() / this.constructor.typedArray.BYTES_PER_ELEMENT;
    }
  },
  findAllLinks: {
    value: function() {
      return this.findAllChilds(OFFSET_LINKEDNODE);
    }
  },
  findAllChilds: {
    value: function() {
      var childs, finish, number, offset, stride;
      stride = arguments[0] || OFFSET_PARENT_PTR;
      offset = POINTERS_BYTEOFFSET + stride;
      finish = Atomics.load(u32, INDEX_PTR);
      number = this * 1;
      childs = [];
      while (offset < finish) {
        if (-0 === number - dvw.getUint32(offset, LE)) {
          childs.push(new Pointer(offset - stride));
        }
        offset += BYTES_PER_POINTER;
      }
      return childs;
    }
  },
  getAllHeaders: {
    value: function() {
      return (function() {
        var results = [];
        for (var j = 0; 0 <= LENGTH_OF_POINTER ? j < LENGTH_OF_POINTER : j > LENGTH_OF_POINTER; 0 <= LENGTH_OF_POINTER ? j++ : j--){ results.push(j); }
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
      return (arguments[0] || 0) + dvw.getUint32(this + OFFSET_BYTEOFFSET, LE);
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
  objProtoClass: {
    value: function() {
      return OBJECTS[this.getProtoClass()];
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
  },
  getLinkedPtri: {
    value: function() {
      return dvw.getUint32(this + OFFSET_LINKEDNODE, LE);
    }
  },
  setLinkedPtri: {
    value: function() {
      return dvw.setUint32(this + OFFSET_LINKEDNODE, arguments[0], LE);
    }
  },
  getLinkedNode: {
    value: function() {
      return dvw.getObject(this + OFFSET_LINKEDNODE);
    }
  },
  setLinkedNode: {
    value: function() {
      return dvw.setObject(this + OFFSET_LINKEDNODE, arguments[0]);
    }
  },
  delLinkedNode: {
    value: function() {
      return dvw.delObject(this + OFFSET_LINKEDNODE);
    }
  },
  getParentPtri: {
    value: function() {
      return dvw.getUint32(this + OFFSET_PARENT_PTR, LE);
    }
  },
  setParentPtri: {
    value: function() {
      dvw.setUint32(this + OFFSET_PARENT_PTR, arguments[0], LE);
      return arguments[0];
    }
  },
  delParentPtri: {
    value: function() {
      return dvw.setUint32(this + OFFSET_PARENT_PTR, this.delParentPtrO(), LE);
    }
  },
  delParentPtrO: {
    value: function() {
      dvw.delObject(this.getParentPtri() + OFFSET_LINKEDNODE);
      return 0;
    }
  },
  getParentPtrO: {
    value: function() {
      return dvw.getObject(this.getParentPtri() + OFFSET_LINKEDNODE);
    }
  },
  setParentPtrO: {
    value: function() {
      return dvw.setObject(this + OFFSET_PARENT_PTR, arguments[0]);
    }
  },
  getParentPtrP: {
    value: function() {
      return dvw.toPointer(this + OFFSET_PARENT_PTR, arguments[0] || Pointer);
    }
  },
  ptrLinkedNode: {
    value: function() {
      return new Pointer(dvw.getUint32(this + OFFSET_LINKEDNODE, LE));
    }
  },
  ptrParentNode: {
    value: function() {
      return new Pointer(dvw.getUint32(this + OFFSET_PARENT_PTR, LE));
    }
  },
  ptrResvUint32: {
    value: function() {
      return new Pointer(dvw.getUint32(this + OFFSET_RESVERVEDS + arguments[0] * 4, LE));
    }
  },
  keyResvUint32: {
    value: function() {
      return dvw.keyUint32(this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1]);
    }
  },
  getResvUint32: {
    value: function() {
      return dvw.getUint32(this + OFFSET_RESVERVEDS + arguments[0] * 4, LE);
    }
  },
  setResvUint32: {
    value: function() {
      dvw.setUint32(this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1], LE);
      return arguments[1];
    }
  },
  addResvUint32: {
    value: function() {
      var o;
      dvw.setUint32(this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1] + (o = this.getResvUint32(arguments[0])), LE);
      return o;
    }
  },
  keyResvUint16: {
    value: function() {
      return dvw.keyUint16(this + OFFSET_RESVERVEDS + arguments[0] * 2, arguments[1]);
    }
  },
  getResvUint16: {
    value: function() {
      return dvw.getUint16(this + OFFSET_RESVERVEDS + arguments[0] * 2, LE);
    }
  },
  setResvUint16: {
    value: function() {
      return dvw.setUint16(this + OFFSET_RESVERVEDS + arguments[0] * 2, arguments[1], LE);
    }
  },
  addResvUint16: {
    value: function() {
      var o;
      dvw.setUint16(this + OFFSET_RESVERVEDS + arguments[0] * 2, arguments[1] + (o = this.getResvUint16(arguments[0])), LE);
      return o;
    }
  },
  getResvFloat32: {
    value: function() {
      return dvw.getFloat32(this + OFFSET_RESVERVEDS + arguments[0] * 4, LE);
    }
  },
  setResvFloat32: {
    value: function() {
      dvw.setFloat32(this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1], LE);
      return arguments[1];
    }
  },
  addResvFloat32: {
    value: function() {
      var o;
      dvw.setFloat32(this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1] + (o = this.getResvFloat32(arguments[0])), LE);
      return o;
    }
  },
  getResvUint8: {
    value: function() {
      return dvw.getUint8(this + OFFSET_RESVERVEDS + arguments[0]);
    }
  },
  setResvUint8: {
    value: function() {
      dvw.setUint8(this + OFFSET_RESVERVEDS + arguments[0], arguments[1]);
      return arguments[1];
    }
  },
  addResvUint8: {
    value: function() {
      var o;
      dvw.setUint8(this + OFFSET_RESVERVEDS + arguments[0], arguments[1] + (o = this.getResvUint8(arguments[0])));
      return o;
    }
  }
});

Object.define(Pointer.prototype, {
  getTArray: {
    value: function() {
      var TypedArray, byteLength, byteOffset, length, offset;
      [offset, byteLength = this.getByteLength(), TypedArray = this.constructor.typedArray] = arguments;
      byteOffset = this.getByteOffset(offset);
      length = byteLength / TypedArray.BYTES_PER_ELEMENT;
      return new TypedArray(this.buffer, byteOffset, length);
    }
  },
  setTArray: {
    value: function() {
      var TypedArray, offset, value;
      [offset, value, TypedArray = this.constructor.typedArray] = arguments;
      (this.getTArray(offset, this.getByteLength(), TypedArray)).set(value);
      return this;
    }
  },
  getFloat32: {
    value: function() {
      return dvw.getFloat32(this.getByteOffset(arguments[0]), LE);
    }
  },
  setFloat32: {
    value: function() {
      dvw.setFloat32(this.getByteOffset(arguments[0]), arguments[1], LE);
      return arguments[1];
    }
  },
  getUint8: {
    value: function() {
      return dvw.getUint8(this.getByteOffset(arguments[0]));
    }
  },
  setUint8: {
    value: function() {
      dvw.setUint8(this.getByteOffset(arguments[0]), arguments[1]);
      return arguments[1];
    }
  },
  keyStatic: {
    value: function() {
      return KEYED[this];
    }
  },
  keyUint16: {
    value: function() {
      return dvw.keyUint16(this.getByteOffset(arguments[0]), arguments[1], arguments[2]);
    }
  },
  getUint16: {
    value: function() {
      return dvw.getUint16(this.getByteOffset(arguments[0]), LE);
    }
  },
  setUint16: {
    value: function() {
      dvw.setUint16(this.getByteOffset(arguments[0]), arguments[1], LE);
      return arguments[1];
    }
  },
  getUint32: {
    value: function() {
      return dvw.getUint32(this.getByteOffset(arguments[0]), LE);
    }
  },
  setUint32: {
    value: function() {
      dvw.setUint32(this.getByteOffset(arguments[0]), arguments[1], LE);
      return arguments[1];
    }
  },
  addUint32: {
    value: function() {
      var v;
      dvw.setUint32(this.getByteOffset(arguments[0]), arguments[1] + (v = this.getUint32(arguments[0], LE)), LE);
      return v;
    }
  },
  setArray3: {
    value: function() {
      var byteOffset, value, x, y, z;
      byteOffset = this.getByteOffset(arguments[0]);
      if (!isNaN(value = arguments[1])) {
        x = y = z = value;
      } else if (value[Symbol.iterator]) {
        [x = 0, y = 0, z = 0] = value;
      } else {
        x = y = z = parseFloat(value) || 0;
      }
      console.warn({x, y, z});
      dvw.setFloat32(byteOffset, x, LE);
      dvw.setFloat32(byteOffset + 4, y, LE);
      dvw.setFloat32(byteOffset + 8, z, LE);
      return this;
    }
  },
  setArray4: {
    value: function() {
      var byteOffset, value, w, x, y, z;
      byteOffset = this.getByteOffset(arguments[0]);
      if (!isNaN(value = arguments[1])) {
        x = y = z = w = value;
      } else if (value[Symbol.iterator]) {
        [x = 0, y = 0, z = 0, w = 1] = value;
      } else {
        x = y = z = w = parseFloat(value) || 1;
      }
      dvw.setFloat32(byteOffset, x, LE);
      dvw.setFloat32(byteOffset + 4, y, LE);
      dvw.setFloat32(byteOffset + 8, z, LE);
      dvw.setFloat32(byteOffset + 12, w, LE);
      return this;
    }
  },
  getString: {
    value: function() {
      var j, length, lengthOffset, ref, startOffset, tarray;
      [startOffset, lengthOffset] = [...arguments];
      (startOffset = this.getByteOffset(startOffset));
      tarray = new Uint8Array(this.buffer, startOffset, this.getByteLength());
      if (!lengthOffset || !(length = this.getUint16(lengthOffset, LE))) {
        for (length = j = ref = tarray.length; (ref <= 0 ? j <= 0 : j >= 0); length = ref <= 0 ? ++j : --j) {
          if (tarray[length] && length++) {
            break;
          }
        }
      }
      return new TextDecoder().decode(tarray.slice(0, length));
    }
  },
  setString: {
    value: function() {
      var lengthOffset, source, startOffset, stringSource, tarray;
      [startOffset, stringSource, lengthOffset] = [...arguments];
      source = new TextEncoder().encode(stringSource);
      tarray = new Uint8Array(this.buffer, this.getByteOffset(), this.getByteLength());
      tarray.set(source, startOffset);
      if (lengthOffset) {
        this.setUint16(lengthOffset, source.byteLength, LE);
      }
      return this;
    }
  }
});

Object.define(Pointer.prototype, {
  headers: {
    get: Pointer.prototype.getAllHeaders,
    set: Pointer.prototype.setAllHeaders
  },
  length: {
    get: Pointer.prototype.getTypedLength
  },
  array: {
    get: Pointer.prototype.getTypedArray
  },
  children: {
    get: Pointer.prototype.findAllChilds
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
  },
  class: {
    get: Pointer.prototype.objProtoClass
  },
  link: {
    get: Pointer.prototype.getLinkedNode,
    set: Pointer.prototype.setLinkedNode
  },
  parent: {
    get: Pointer.prototype.getParentPtrP,
    set: Pointer.prototype.setParentPtri
  }
});

Object.define(Matrix4.registerClass(), {
  byteLength: {
    value: 4 * 16
  },
  typedArray: {
    value: Float32Array
  },
  identity: {
    value: Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  },
  multiply: {
    value: function() {
      var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33;
      [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = arguments[0];
      [b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33] = arguments[1];
      return Float32Array.of(b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30, b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31, b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32, b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33, b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30, b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31, b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32, b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33, b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30, b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31, b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32, b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33, b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30, b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31, b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32, b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33);
    }
  },
  xRotation: {
    value: function() {
      var c, s;
      c = Math.cos(arguments[0] || 0);
      s = Math.sin(arguments[0] || 0);
      return Float32Array.of(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    }
  },
  yRotation: {
    value: function() {
      var c, s;
      c = Math.cos(arguments[0] || 0);
      s = Math.sin(arguments[0] || 0);
      return Float32Array.of(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    }
  },
  zRotation: {
    value: function() {
      var c, s;
      c = Math.cos(arguments[0] || 0);
      s = Math.sin(arguments[0] || 0);
      return Float32Array.of(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  },
  translation: {
    value: function() {
      var dx, dy, dz;
      [dx = 0, dy = 0, dz = 0] = arguments[1] ? arguments : arguments[0];
      return Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, dx, dy, dz, 1);
    }
  },
  xTranslation: {
    value: function() {
      return Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, arguments[0] || 0, 0, 0, 1);
    }
  },
  yTranslation: {
    value: function() {
      return Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, arguments[0] || 0, 0, 1);
    }
  },
  zTranslation: {
    value: function() {
      return Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, arguments[0] || 0, 1);
    }
  },
  scalation: {
    value: function() {
      var sx, sy, sz;
      [sx, sy, sz] = arguments[1] ? arguments : arguments[0].slice ? arguments[0] : [arguments[0], arguments[0], arguments[0]];
      return Float32Array.of(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    }
  },
  xScale: {
    value: function() {
      return Float32Array.of(arguments[0] || 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  },
  yScale: {
    value: function() {
      return Float32Array.of(1, 0, 0, 0, 0, arguments[0] || 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  },
  zScale: {
    value: function() {
      return Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, arguments[0] || 0, 0, 0, 0, 0, 1);
    }
  }
});

Object.define(Matrix4.prototype, {
  getPositionX: {
    value: function() {
      return this.getFloat32(4 * 12);
    }
  },
  getPositionY: {
    value: function() {
      return this.getFloat32(4 * 13);
    }
  },
  getPositionZ: {
    value: function() {
      return this.getFloat32(4 * 14);
    }
  },
  getPosition3: {
    value: function() {
      return this.subarray(12, 15);
    }
  },
  setPositionX: {
    value: function() {
      return this.translateX(arguments[0]);
    }
  },
  setPositionY: {
    value: function() {
      return this.translateY(arguments[0]);
    }
  },
  setPositionZ: {
    value: function() {
      return this.translateZ(arguments[0]);
    }
  },
  setPosition3: {
    value: function() {
      this.translate(arguments[0]);
      return this;
    }
  },
  getIsUpdated: {
    value: function() {
      return this.getResvUint8(0);
    }
  },
  setIsUpdated: {
    value: function() {
      this.setResvUint8(0, arguments[0]);
      return this;
    }
  },
  uploadNeeded: {
    value: function() {
      var ref;
      if ((ref = this.link) != null) {
        ref.needsUpload = 1;
      }
      this.setResvUint8(0, 0);
      return arguments[0];
    }
  }
});

Object.define(Matrix4.prototype, {
  rotateX: {
    value: function() {
      return this.multiply(this, Matrix4.xRotation(arguments[0]));
    }
  },
  rotateY: {
    value: function() {
      return this.multiply(this, Matrix4.yRotation(arguments[0]));
    }
  },
  rotateZ: {
    value: function() {
      return this.multiply(this, Matrix4.zRotation(arguments[0]));
    }
  },
  translateX: {
    value: function() {
      return this.multiply(this, Matrix4.xTranslation(arguments[0]));
    }
  },
  translateY: {
    value: function() {
      return this.multiply(this, Matrix4.yTranslation(arguments[0]));
    }
  },
  translateZ: {
    value: function() {
      return this.multiply(this, Matrix4.zTranslation(arguments[0]));
    }
  },
  scaleX: {
    value: function() {
      return this.multiply(this, Matrix4.xScale(arguments[0]));
    }
  },
  scaleY: {
    value: function() {
      return this.multiply(this, Matrix4.yScale(arguments[0]));
    }
  },
  scaleZ: {
    value: function() {
      return this.multiply(this, Matrix4.zScale(arguments[0]));
    }
  }
});

Object.define(Matrix4.prototype, {
  reset: {
    value: function() {
      return this.set(Matrix4.identity);
    }
  },
  apply: {
    value: function() {
      var mat4;
      mat4 = Matrix4.translation(arguments[0]);
      return Matrix4.multiply(mat4, this.slice()).subarray(12, 15);
    }
  },
  multiply: {
    value: function() {
      this.uploadNeeded(this.set(Matrix4.multiply(this, arguments[0])));
      return this;
    }
  },
  translate: {
    value: function() {
      return this.multiply(Matrix4.translation(...arguments));
    }
  },
  scale: {
    value: function() {
      return this.multiply(Matrix4.scalation(...arguments));
    }
  },
  rotate: {
    value: function() {
      var rx, ry, rz;
      [rx, ry, rz] = arguments[1] ? arguments : arguments[0];
      if (rx) {
        this.rotateX(rx);
      }
      if (ry) {
        this.rotateY(ry);
      }
      if (rz) {
        this.rotateZ(rz);
      }
      return this;
    }
  }
});

Object.define(Matrix4.prototype, {
  isUpdated: {
    get: Matrix4.prototype.getIsUpdated,
    set: Matrix4.prototype.setIsUpdated
  },
  x: {
    get: Matrix4.prototype.getPositionX,
    set: Matrix4.prototype.setPositionX
  },
  y: {
    get: Matrix4.prototype.getPositionY,
    set: Matrix4.prototype.setPositionY
  },
  z: {
    get: Matrix4.prototype.getPositionZ,
    set: Matrix4.prototype.setPositionZ
  },
  position: {
    get: Matrix4.prototype.getPosition3,
    set: Matrix4.prototype.setPosition3
  }
});

Object.symbol(Matrix4.prototype, {
  iterate: {
    value: function() {
      var byteLength, byteOffset, length, matrix, stride;
      byteOffset = dvw.getUint32(this + OFFSET_BYTEOFFSET, LE);
      byteLength = dvw.getUint32(this + OFFSET_BYTELENGTH, LE);
      matrix = this;
      stride = this.constructor.BYTES_PER_ELEMENT;
      length = byteLength / stride;
      byteOffset -= stride;
      return {
        next: function() {
          if (!length--) {
            return {
              done: true,
              value: matrix
            };
          }
          return {
            done: false,
            value: dvw.getFloat32(byteOffset += stride)
          };
        }
      };
    }
  }
});

Object.define(WorkerPointer.registerClass(), {
  byteLength: {
    value: 4 * 64
  },
  typedArray: {
    value: Uint8Array
  }
});

Object.define(WorkerPointer.prototype, {
  type: {
    value: "module"
  },
  script: {
    value: "./ptr_worker.js"
  },
  init: {
    value: function() {
      return this.create();
    }
  },
  create: {
    value: function() {
      var config, script, worker;
      script = this.script;
      config = {
        type: this.type,
        name: this
      };
      worker = new Worker(script, config);
      return this.setLinkedNode(worker).postMessage(this.buffer);
    }
  },
  onmessage: {
    set: function() {
      return this.getLinkedNode().onmessage = arguments[0];
    }
  },
  send: {
    value: function() {
      return this.getLinkedNode().postMessage(...arguments);
    }
  }
});

Object.define(WorkerPointer.prototype, {
  getOnlineState: {
    value: function() {
      return this.getResvUint32(0);
    }
  },
  setOnlineState: {
    value: function() {
      this.setResvUint32(0, arguments[0]);
      return this;
    }
  }
});

Object.define(WorkerPointer.prototype, {
  onlineState: {
    get: WorkerPointer.prototype.getOnlineState,
    set: WorkerPointer.prototype.setOnlineState
  }
});

if (typeof window !== "undefined" && window !== null) {
  Pointer.setBuffer();
}

if (typeof window !== "undefined" && window !== null) {
  ival = 0;
  if (typeof document !== "undefined" && document !== null) {
    document.body.setAttribute("title", "Click body to activate debugger.");
  }
  if (typeof document !== "undefined" && document !== null) {
    document.body.ondblclick = function() {
      if (ival) {
        return ival = clearInterval(ival);
      } else {
        return ival = setInterval(dump, 90);
      }
    };
  }
  if (typeof document !== "undefined" && document !== null) {
    document.body.onclick = function() {
      return dump(clearInterval(ival));
    };
  }
  hist = [];
  fill = "".padStart(1e2, '\n');
  dump = function() {
    var byteLength, capacity, child, childs, dumpArray, finish, freeByteLength, freePercent, j, len1, offset;
    offset = POINTERS_BYTEOFFSET + OFFSET_PARENT_PTR;
    finish = Atomics.load(u32, INDEX_PTR);
    childs = [];
    while (offset < finish) {
      childs.push(new Pointer(offset - OFFSET_PARENT_PTR));
      offset += BYTES_PER_POINTER;
    }
    dumpArray = [];
    byteLength = 0;
    for (j = 0, len1 = childs.length; j < len1; j++) {
      child = childs[j];
      dumpArray.push({
        ptr: child * 1,
        object: child,
        parent: child.parent * 1 || null,
        type: child.type || child.mode || child.target,
        classId: child.getProtoClass(),
        link: child.getLinkedNode(),
        offset: child.getByteOffset(),
        allocated: child.getByteLength(),
        array: child.getByteLength() ? child.getTypedArray() : void 0,
        childs: child.children.length || null
      });
      byteLength += child.byteLength;
    }
    freeByteLength = u32.byteLength - byteLength;
    freePercent = freeByteLength / u32.byteLength * 1e2;
    capacity = (u32.byteLength / Math.pow(1024, 2)).toFixed(1) * 1;
    freePercent = freePercent.toFixed(2) * 1;
    hist.push({
      max: POINTERS_BYTELENGTH / BYTES_PER_POINTER,
      count: childs.length,
      ptrOffset: Atomics.load(u32, INDEX_PTR),
      byteOffset: Atomics.load(u32, INDEX_BUF),
      allocated: byteLength,
      ["capacity(mb)"]: capacity,
      ["free(%)"]: freePercent,
      ["elapsed(ms)"]: u32.at(INDEX_NOW),
      tickCount: u32.at(INDEX_HIT),
      fps: u32.at(INDEX_FPS)
    });
    hist = hist.slice(-5);
    if (ival) {
      console.warn(fill);
    }
    console.table(hist);
    return console.table(dumpArray);
  };
}

export default Pointer;
