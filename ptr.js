var BYTES_PER_POINTER, Color4, DEPTH_N_COLOR_BIT, INDEX_BUF, INDEX_FPS, INDEX_HIT, INDEX_NOW, INDEX_PTR, KEYED, LE, LENGTH_OF_POINTER, NONE, OBJECTS, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_LINKEDNODE, OFFSET_PARENT_PTR, OFFSET_PROTOCLASS, OFFSET_PTRCLASS_0, OFFSET_PTRCLASS_1, OFFSET_PTRCLASS_2, OFFSET_PTRCLASS_3, OFFSET_PTRCLASS_4, POINTERS_BYTELENGTH, POINTERS_BYTEOFFSET, POINTER_PROTOTYPE, Pointer, buf, dvw, i32, k, malloc, palloc, proxy, u32, v;

import "./ptr_self.js";

LE = false;

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
  return new Proxy({
    i: arguments[0]
  }, {
    get: function({i}, key) {
      var result;
      //* request sent to window --->
      //TODO integrate arguments for fns
      postMessage({
        proxy: i,
        key: key
      });
      //* proxy locked now --->
      Atomics.wait(i32, 1000, 0);
      //TODO window processing request
      //TODO notify 1000 index for one time 
      //TODO when result is ready

      //* proxy unlocked now --->
      result = Atomics.load(i32, 1000);
      //TODO window written result to that index
      //TODO we need to implement more complex ones

      //TODO hey beyb: that's sync on window and worker
      return result; //? awesome :))) <3
    }
  });
};

KEYED = {
  0: new (NONE = class NONE extends Number {})(0),
  16640: new (DEPTH_N_COLOR_BIT = class DEPTH_N_COLOR_BIT extends Number {})(16640)
};

for (k in WebGL2RenderingContext) {
  v = WebGL2RenderingContext[k];
  KEYED[v] = eval(`new (class ${k} extends Number {})(${v})`);
}

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
  getObject: {
    value: function(offset) {
      var i;
      if (!(i = this.getUint32(offset, LE))) {
        return;
      }
      return OBJECTS[i] != null ? OBJECTS[i] : OBJECTS[i] = proxy(i);
    }
  },
  toPointer: {
    value: function(offset) {
      var i;
      if (i = this.getUint32(offset)) {
        return new Pointer(i);
      }
    }
  },
  keyUint16: {
    value: function(offset) {
      return KEYED[this.getUint16(offset, LE)];
    }
  }
});

Color4 = (function() {
  class Color4 extends Number {};

  Object.defineProperties(Color4, {
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

  Object.defineProperties(Number.prototype, {
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
  });

  return Color4;

}).call(this);

//? POINTER STARTS
LENGTH_OF_POINTER = 16;

BYTES_PER_POINTER = 4 * LENGTH_OF_POINTER;

OFFSET_BYTEOFFSET = 4 * 1;

OFFSET_BYTELENGTH = 4 * 2;

OFFSET_PROTOCLASS = 4 * 3;

OFFSET_LINKEDNODE = 4 * 4;

OFFSET_PARENT_PTR = 4 * 5;

OFFSET_PTRCLASS_0 = 4 * 6;

OFFSET_PTRCLASS_1 = 4 * 7;

OFFSET_PTRCLASS_2 = 4 * 8;

OFFSET_PTRCLASS_3 = 4 * 9;

OFFSET_PTRCLASS_4 = 4 * 10;

POINTER_PROTOTYPE = [, ];

export default Pointer = class Pointer extends Number {
  static setBuffer(sab, max = 1e20) {
    var T, f32, ƒ;
    if (!sab) {
      while (true) {
        try {
          sab = new SharedArrayBuffer(max);
        } catch (error) {
          if (max = max / 10) {
            continue;
          }
        } finally {
          sab = null;
        }
        break;
      }
    }
    buf = new SharedArrayBuffer(max / 10, {
      maxByteLength: max
    });
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
    super(ptr);
    if (arguments.length) {
      Object.setPrototypeOf(this, POINTER_PROTOTYPE[this.getProtoClass()].prototype);
    } else {
      this.setByteLength(this.constructor.byteLength).setProtoClass(this.constructor.protoClass).setByteOffset(malloc(this.getByteLength()));
      this.init();
    }
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
        Atomics.store(i32, 1000, result);
        //TODO notify cell to unlock
        return Atomics.notify(i32, 1000, 1);
      }
    };
  }

  //* proxy unlocked now --->
  add() {
    return arguments[0].setParentPtri(this);
  }

};

export var BufferPointer = class BufferPointer extends Pointer {};

export var OffsetPointer = class OffsetPointer extends Pointer {};

export var ObjectPointer = class ObjectPointer extends Pointer {};

export var AtomicPointer = class AtomicPointer extends Pointer {};

export var WorkerPointer = class WorkerPointer extends Pointer {};

Object.defineProperties(Pointer, {
  registerClass: {
    value: function() {
      this.protoClass || (this.protoClass = -1 + POINTER_PROTOTYPE.push(this));
      return this;
    }
  },
  setDataBuffer: {
    value: function() {
      [this.prototype.buffer] = arguments;
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
  getTypedArray: {
    value: function() {
      return new this.constructor.typedArray(this.buffer, this.byteOffset, this.length);
    }
  },
  getTypedLength: {
    value: function() {
      return this.byteLength / this.constructor.typedArray.BYTES_PER_ELEMENT;
    }
  },
  findAllChilds: {
    value: function() {
      var childs, finish, number, offset;
      offset = POINTERS_BYTEOFFSET + OFFSET_PARENT_PTR;
      finish = Atomics.load(u32, INDEX_PTR);
      number = this * 1;
      childs = [];
      while (offset < finish) {
        if (-0 === number - dvw.getUint32(offset, LE)) {
          childs.push(new Pointer(offset - OFFSET_PARENT_PTR));
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
  getLinkedNode: {
    value: function() {
      return dvw.getObject(this + OFFSET_LINKEDNODE, LE);
    }
  },
  setLinkedNode: {
    value: function() {
      return dvw.setObject(this + OFFSET_LINKEDNODE, arguments[0], LE);
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
  getParentPtrO: {
    value: function() {
      return dvw.getObject(this.getParentPtri() + OFFSET_LINKEDNODE, LE);
    }
  },
  setParentPtrO: {
    value: function() {
      return dvw.setObject(this + OFFSET_PARENT_PTR, arguments[0], LE);
    }
  },
  getParentPtrP: {
    value: function() {
      return dvw.toPointer(this + OFFSET_PARENT_PTR, LE);
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  getUint8: {
    value: function() {
      return dvw.getUint8(this.byteOffset + arguments[0]);
    }
  },
  setUint8: {
    value: function() {
      dvw.setUint8(this.byteOffset + arguments[0], arguments[1]);
      return arguments[1];
    }
  },
  keyUint16: {
    value: function() {
      return dvw.keyUint16(this.byteOffset + arguments[0], arguments[1]);
    }
  },
  getUint16: {
    value: function() {
      return dvw.getUint16(this.byteOffset + arguments[0], LE);
    }
  },
  setUint16: {
    value: function() {
      dvw.setUint16(this.byteOffset + arguments[0], arguments[1], LE);
      return arguments[1];
    }
  },
  getFloat32: {
    value: function() {
      return dvw.getFloat32(this.byteOffset + arguments[0], LE);
    }
  },
  setFloat32: {
    value: function() {
      dvw.setFloat32(this.byteOffset + arguments[0], arguments[1], LE);
      return arguments[1];
    }
  },
  rgbColor4: {
    value: function() {
      return this.getColor4(...arguments).f32;
    }
  },
  getColor4: {
    value: function() {
      return new Color4(dvw.getUint32(this.byteOffset + arguments[0], LE));
    }
  },
  setColor4: {
    value: function() {
      dvw.setUint32(this.byteOffset + arguments[0], Color4.u32(arguments[1]), LE);
      return arguments[1];
    }
  },
  getString: {
    value: function() {
      var j, length, lengthOffset, ref, startOffset, tarray;
      [startOffset, lengthOffset] = [...arguments];
      (startOffset = this.byteOffset + startOffset);
      tarray = new Uint8Array(this.buffer, startOffset, this.byteLength);
      if (!lengthOffset || !(length = this.getUint16(lengthOffset))) {
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
      tarray = new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
      tarray.set(source, startOffset);
      if (lengthOffset) {
        this.setUint16(lengthOffset, source.byteLength);
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
  
  //protoClass     : get : Pointer::getProtoClass , set : Pointer::setProtoClass

  //linkedNode     : get : Pointer::getLinkedNode , set : Pointer::setLinkedNode
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
      return this.setLinkedNode(worker).send(buf);
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
      return dvw.getUint32(this + OFFSET_PTRCLASS_0, LE);
    }
  },
  setOnlineState: {
    value: function() {
      dvw.setUint32(this + OFFSET_PTRCLASS_0, arguments[0], LE);
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
