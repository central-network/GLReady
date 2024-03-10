var BYTES_PER_POINTER, INDEX_BUF, INDEX_PTR, LE, LENGTH_OF_POINTER, OBJECTS, OFFSET_BYTELENGTH, OFFSET_BYTEOFFSET, OFFSET_LINKEDNODE, OFFSET_PARENT_PTR, OFFSET_PROTOCLASS, OFFSET_PTRCLASS_0, OFFSET_PTRCLASS_1, OFFSET_PTRCLASS_2, OFFSET_PTRCLASS_3, OFFSET_PTRCLASS_4, POINTERS_BYTELENGTH, POINTERS_BYTEOFFSET, POINTER_PROTOTYPE, Pointer, buf, dvw, i32, malloc, palloc, proxy, u32;

import "./ptr_self.js";

LE = false;

OBJECTS = [, ];

buf = u32 = i32 = dvw = palloc = malloc = false;

INDEX_BUF = 0;

INDEX_PTR = 1;

POINTERS_BYTELENGTH = 4 * 1e5;

POINTERS_BYTEOFFSET = 8;

proxy = function() {
  return new Proxy({
    i: arguments[0]
  }, {
    get: function({i}, key) {
      postMessage({
        proxy: i,
        key: key
      });
      Atomics.wait(i32, 1000, 0);
      return Atomics.load(i32, 1000);
    }
  });
};

Object.defineProperties(DataView.prototype, {
  setObject: {
    value: function(offset, object) {
      var i;
      if (-1 === (i = OBJECTS.indexOf(object))) {
        i += OBJECTS.push(object);
        this.setUint32(offset, i, LE);
      }
      return i;
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
      return new Pointer(this.getUint32(offset));
    }
  }
});

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
    var f32;
    if (!sab) {
      while (true) {
        try {
          sab = new SharedArrayBuffer(max);
        } catch (error) {
          if (max = max / 10) {
            continue;
          }
        }
        break;
      }
    }
    buf = sab;
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
      value: sab
    });
    return Reflect.deleteProperty(Pointer, "setBuffer");
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

  init() {
    return this;
  }

  fork() {
    var worker;
    this.add(worker = new WorkerPointer());
    return worker.onmessage = ({data}) => {
      var i, key, result;
      if (i = data.proxy) {
        key = data.key;
        result = OBJECTS[i][key];
        console.warn("request :", OBJECTS[i].constructor.name + "." + key);
        console.warn("result  :", result);
        Atomics.store(i32, 1000, result);
        return Atomics.notify(i32, 1000, 1);
      }
    };
  }

  add(ptr) {
    return ptr.setParentPtri(this);
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
      dvw.setObject(this + OFFSET_LINKEDNODE, arguments[0], LE);
      return this;
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
      return this;
    }
  },
  getParentPtrO: {
    value: function() {
      return dvw.getObject(this + OFFSET_PARENT_PTR, LE);
    }
  },
  setParentPtrO: {
    value: function() {
      dvw.setObject(this + OFFSET_PARENT_PTR, arguments[0], LE);
      return this;
    }
  },
  getParentPtrP: {
    value: function() {
      return dvw.toPointer(this + OFFSET_PARENT_PTR, LE);
    }
  }
});

Object.defineProperties(Pointer.prototype, {
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
  linkedNode: {
    get: Pointer.prototype.getLinkedNode,
    set: Pointer.prototype.setLinkedNode
  },
  parent: {
    get: Pointer.prototype.getParentPtrP,
    set: Pointer.prototype.setParentPtri
  }
});

Object.defineProperties(WorkerPointer, {
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

WorkerPointer.registerClass();
