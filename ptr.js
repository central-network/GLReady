var BYTES_PER_POINTER, INDEX_BUF, INDEX_FPS, INDEX_HIT, INDEX_NOW, INDEX_PTR, KEYED, KEYEX, LE, LENGTH_OF_POINTER, NONE, OBJECTS, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_LINKEDNODE, OFFSET_PARENT_PTR, OFFSET_PROTOCLASS, OFFSET_PTRCLASS_0, OFFSET_PTRCLASS_1, OFFSET_PTRCLASS_2, OFFSET_PTRCLASS_3, OFFSET_PTRCLASS_4, OFFSET_RESVERVEDS, POINTERS_BYTELENGTH, POINTERS_BYTEOFFSET, POINTER_PROTOTYPE, Pointer, buf, dump, dvw, fill, hist, i32, ival, malloc, palloc, proxy, u32;

import "./ptr_self.js";

LE = !new Uint8Array(Float32Array.of(1).buffer)[0];

OBJECTS = [, ];

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

KEYED = {};

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

Object.defineProperties(Array.prototype, {
  sumAttrib: {
    value: function() {
      var j, len, n, ref, s, v;
      n = arguments[s = 0];
      ref = this;
      for (j = 0, len = ref.length; j < len; j++) {
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
    value: function(offset) {
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

export var Vector = class Vector extends Number {};

export var Angle3 = class Angle3 extends Vector {};

export var Vertex = class Vertex extends Vector {};

export var Scale3 = class Scale3 extends Vector {};

export var Color4 = class Color4 extends Number {};

export var OffsetPointer = class OffsetPointer extends Number {};

Object.defineProperties(OffsetPointer, {
  typedArray: {
    value: Float32Array
  }
});

Object.defineProperties(OffsetPointer.prototype, {
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

Object.defineProperties(OffsetPointer.prototype, {
  link: {
    get: OffsetPointer.prototype.getLinkedNode
  }
});

Object.defineProperties(Vector, {
  byteLength: {
    value: 4 * 3
  },
  length: {
    value: 3
  }
});

Object.defineProperties(Vector.prototype, {
  [Symbol.iterator]: {
    value: function*() {
      var i, j, results;
      results = [];
      for (i = j = 0; j < 3; i = ++j) {
        results.push((yield dvw.getFloat32(this + i * 4, LE)));
      }
      return results;
    }
  }
});

Object.defineProperties(Vector.prototype, {
  getTypedArray: {
    value: function() {
      return new Float32Array(dvw.buffer, this, 3);
    }
  }
});

Object.defineProperties(Vector.prototype, {
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

Object.defineProperties(Vector.prototype, {
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

Object.defineProperties(Color4, {
  byteLength: {
    value: 4 * 4
  },
  length: {
    value: 4
  },
  u32: {
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

Object.defineProperties(Color4.prototype, {
  [Symbol.iterator]: {
    value: function*() {
      var i, j, results;
      results = [];
      for (i = j = 0; j < 4; i = ++j) {
        results.push((yield dvw.getFloat32(this + i * 4, LE)));
      }
      return results;
    }
  },
  getTypedArray: {
    value: function() {
      return new Float32Array(dvw.buffer, this, 4);
    }
  },
  getR: {
    value: function() {
      return dvw.getFloat32(this, LE);
    }
  },
  getG: {
    value: function() {
      return dvw.getFloat32(this + 4, LE);
    }
  },
  getB: {
    value: function() {
      return dvw.getFloat32(this + 8, LE);
    }
  },
  getA: {
    value: function() {
      return dvw.getFloat32(this + 12, LE);
    }
  },
  setR: {
    value: function() {
      return dvw.setFloat32(this, arguments[0], LE);
    }
  },
  setG: {
    value: function() {
      return dvw.setFloat32(this + 4, arguments[0], LE);
    }
  },
  setB: {
    value: function() {
      return dvw.setFloat32(this + 8, arguments[0], LE);
    }
  },
  setA: {
    value: function() {
      return dvw.setFloat32(this + 12, arguments[0], LE);
    }
  }
});

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
}, Object.defineProperties(Number.prototype, {
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

OFFSET_PROTOCLASS = 4 * 3;

OFFSET_LINKEDNODE = 4 * 4;

OFFSET_PARENT_PTR = 4 * 5;

OFFSET_RESVERVEDS = 4 * 6;

OFFSET_PTRCLASS_0 = 4 * 6;

OFFSET_PTRCLASS_1 = 4 * 7;

OFFSET_PTRCLASS_2 = 4 * 8;

OFFSET_PTRCLASS_3 = 4 * 9;

OFFSET_PTRCLASS_4 = 4 * 10;

POINTER_PROTOTYPE = [, ];

Object.defineProperty(Object, "hiddenProperties", {
  value: function() {
    var desc, get, i, j, len, prop, proto, ref, set;
    proto = null;
    desc = {
      configurable: true
    };
    ref = [...arguments];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      prop = ref[i];
      if (!i) {
        proto = prop;
      } else {
        ({get, set} = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(proto.prototype), prop));
        Object.defineProperty(proto.prototype, prop, {
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
    }
    return proto;
  }
});

export default Pointer = class Pointer extends Number {
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
    var byteLength;
    super(ptr);
    if (arguments.length) {
      if (this.constructor === Pointer) {
        Object.setPrototypeOf(this, POINTER_PROTOTYPE[this.getProtoClass()].prototype);
      }
    } else {
      byteLength = this.constructor.byteLength;
      dvw.setUint32(this + OFFSET_BYTELENGTH, byteLength, LE);
      dvw.setUint32(this + OFFSET_PROTOCLASS, this.constructor.protoClass, LE);
      dvw.setUint32(this + OFFSET_BYTEOFFSET, malloc(byteLength), LE);
      this.init();
    }
  }

  static from(arrayLike) {
    var ptr;
    ptr = this.malloc(this.byteLength + this.BYTES_PER_ELEMENT * arrayLike.length);
    ptr.subarray(this.byteLength / this.BYTES_PER_ELEMENT).set(arrayLike);
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

};

export var WorkerPointer = class WorkerPointer extends Pointer {};

Object.defineProperties(Pointer, {
  registerClass: {
    value: function() {
      (this.protoClass || (this.protoClass = -1 + POINTER_PROTOTYPE.push(this)));
      return this;
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

Object.defineProperties(Pointer.prototype, {
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
      return dvw.setUint32(this + OFFSET_RESVERVEDS + arguments[0] * 4, arguments[1], LE);
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
  }
});

Object.defineProperties(Pointer.prototype, {
  getTArray: {
    value: function() {
      var TypedArray, byteLength, byteOffset, length, offset;
      [offset = 0, byteLength = this.getByteLength(), TypedArray = this.constructor.typedArray] = arguments;
      byteOffset = this.getByteOffset() + offset;
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
      return dvw.getFloat32(this.getByteOffset() + arguments[0], LE);
    }
  },
  setFloat32: {
    value: function() {
      dvw.setFloat32(this.getByteOffset() + arguments[0], arguments[1], LE);
      return arguments[1];
    }
  },
  getUint8: {
    value: function() {
      return dvw.getUint8(this.getByteOffset() + arguments[0]);
    }
  },
  setUint8: {
    value: function() {
      dvw.setUint8(this.getByteOffset() + arguments[0], arguments[1]);
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
      return dvw.keyUint16(this.getByteOffset() + arguments[0], arguments[1], arguments[2]);
    }
  },
  getUint16: {
    value: function() {
      return dvw.getUint16(this.getByteOffset() + arguments[0], LE);
    }
  },
  setUint16: {
    value: function() {
      dvw.setUint16(this.getByteOffset() + arguments[0], arguments[1], LE);
      return arguments[1];
    }
  },
  getUint32: {
    value: function() {
      return dvw.getUint32(this.getByteOffset() + arguments[0], LE);
    }
  },
  setUint32: {
    value: function() {
      dvw.setUint32(this.getByteOffset() + arguments[0], arguments[1], LE);
      return arguments[1];
    }
  },
  addUint32: {
    value: function() {
      var v;
      dvw.setUint32(this.getByteOffset() + arguments[0], arguments[1] + (v = this.getUint32(arguments[0], LE)), LE);
      return v;
    }
  },
  setArray3: {
    value: function() {
      var byteOffset, value, x, y, z;
      byteOffset = this.getByteOffset() + arguments[0];
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
      byteOffset = this.getByteOffset() + arguments[0];
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
      (startOffset = this.getByteOffset() + startOffset);
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

Object.defineProperties(Pointer.prototype, {
  length: {
    get: Pointer.prototype.getTypedLength
  },
  array: {
    get: Pointer.prototype.getTypedArray
  },
  children: {
    get: Pointer.prototype.findAllChilds
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
  },
  linkedNode: {
    get: Pointer.prototype.getLinkedNode,
    set: Pointer.prototype.setLinkedNode
  },
  parent: {
    get: Pointer.prototype.getParentPtrP,
    set: Pointer.prototype.setParentPtri
  }
});

Object.defineProperties(WorkerPointer.registerClass(), {
  byteLength: {
    value: 4 * 64
  }
});

Object.defineProperties(WorkerPointer.prototype, {
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

Object.defineProperties(WorkerPointer.prototype, {
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

Object.defineProperties(WorkerPointer.prototype, {
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
    var byteLength, capacity, child, childs, dumpArray, finish, freeByteLength, freePercent, j, len, offset;
    offset = POINTERS_BYTEOFFSET + OFFSET_PARENT_PTR;
    finish = Atomics.load(u32, INDEX_PTR);
    childs = [];
    while (offset < finish) {
      childs.push(new Pointer(offset - OFFSET_PARENT_PTR));
      offset += BYTES_PER_POINTER;
    }
    dumpArray = [];
    byteLength = 0;
    for (j = 0, len = childs.length; j < len; j++) {
      child = childs[j];
      dumpArray.push({
        ptr: child * 1,
        object: child,
        parent: child.parent * 1 || null,
        type: child.type,
        classId: child.getProtoClass(),
        link: child.getLinkedNode(),
        offset: child.getByteOffset(),
        allocated: child.getByteLength(),
        array: child.getTypedArray(),
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
