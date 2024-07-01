var Class, ExtRef, Function, String, Uint8Array, a, buf, clssNumber, clssPointer, define, dvw, error, i32, iLE, log, malloc, pointerOf, scopei, scp, ui8, verify, warn;

({log, warn, error} = console);

iLE = new self.Uint8Array(self.Float32Array.of(1).buffer)[3];

scp = new self.Array(null);

buf = new self.ArrayBuffer(4e5);

i32 = new self.Int32Array(buf);

ui8 = new self.Uint8Array(i32.buffer);

dvw = new self.DataView(i32.buffer);

Atomics.or(i32, 0, 24);

define = self.Object.defineProperties.bind(self.Object);

scopei = function(any) {
  var i;
  if (!any) {
    throw /SCP/;
  }
  if (-1 === (i = scp.indexOf(any))) {
    i += scp.push(any);
  }
  return i;
};

malloc = function(byteLength = 0, Prototype = Number) {
  var allocBytes, byteOffset, classIndex, mod, nextOffset, ptriOffset;
  allocBytes = byteLength + 24;
  if (0 < (mod = allocBytes % 8)) {
    allocBytes += 8 - mod;
  }
  ptriOffset = Atomics.add(i32, 0, allocBytes);
  nextOffset = ptriOffset + allocBytes + 24;
  byteOffset = ptriOffset + 24;
  classIndex = scopei(Prototype);
  dvw.setInt32(byteOffset - 12, classIndex, iLE);
  dvw.setInt32(byteOffset - 8, nextOffset, iLE);
  dvw.setInt32(byteOffset - 4, byteLength, iLE);
  return byteOffset;
};

verify = function(byteOffset) {
  var byteLength, calcOffset, nextOffset;
  if (byteOffset < 8) {
    return 0;
  }
  if (byteOffset % 8) {
    return 0;
  }
  nextOffset = dvw.getInt32(byteOffset - 8, iLE);
  byteLength = dvw.getInt32(byteOffset - 4, iLE);
  calcOffset = byteOffset + byteLength + 24;
  if ((calcOffset - nextOffset) > 0) {
    return 0;
  }
  return byteOffset;
};

pointerOf = function(byteOffset) {
  var clsi, ptri;
  if (!(ptri = verify(byteOffset))) {
    return 0;
  }
  if (!(clsi = dvw.getInt32(ptri - 12, iLE))) {
    return 0;
  }
  return new scp[clsi](ptri);
};

ExtRef = (function() {
  class ExtRef extends Number {
    static from(object) {
      var ptri;
      ptri = new this(malloc(this.byteLength, this));
      ptri.object = object;
      return ptri;
    }

  };

  ExtRef.byteLength = 4;

  return ExtRef;

}).call(this);

Uint8Array = class Uint8Array extends Number {
  static from(uInt8Array) {
    var blen, ptri;
    blen = uInt8Array.byteLength;
    ptri = new this(malloc(blen, this));
    ptri.toArray().set(uInt8Array);
    return ptri;
  }

};

Function = class Function extends ExtRef {};

define(ExtRef.prototype, {
  object: {
    get: function() {
      return scp[dvw.getInt32(this, iLE)];
    },
    set: function(v) {
      return dvw.setInt32(this, scopei(v), iLE);
    }
  }
});

define(Function.prototype, {
  exec: {
    value: function() {
      return this.object(...arguments);
    }
  },
  name: {
    get: function() {
      return this.object.name;
    }
  }
});

define(Uint8Array.prototype, {
  array: {
    get: function() {
      return ui8.subarray(this, this + this.byteLength);
    }
  },
  byteLength: {
    get: function() {
      return dvw.getInt32(this - 4, iLE);
    }
  },
  set: {
    value: function(array, index = 0) {
      this.array.set(array, index);
      return this;
    }
  }
});

String = (function() {
  class String extends Number {
    static from(string = "") {
      var data;
      data = this.encoder.exec(string);
      return Uint8Array.from.call(this, data);
    }

  };

  String.encoder = Function.from(TextEncoder.prototype.encode.bind(new TextEncoder));

  String.decoder = Function.from(TextDecoder.prototype.decode.bind(new TextDecoder));

  return String;

}).call(this);

define(String.prototype, {
  value: {
    get: function() {
      return this.toString();
    }
  },
  length: {
    get: function() {
      return dvw.getInt32(this - 4, iLE);
    }
  },
  toArray: {
    value: function() {
      return ui8.subarray(this, this + this.length);
    }
  },
  toString: {
    value: function() {
      return String.decoder.exec(this.toArray());
    }
  }
});

Class = (function() {
  class Class extends Number {
    static from(Any) {
      var ptri;
      ptri = new this(malloc(this.byteLength, this));
      ptri.class = scopei(Any);
      return ptri;
    }

  };

  Class.byteLength = 12;

  return Class;

}).call(this);

define(Class.prototype, {
  name: {
    set: function(ptri) {
      return dvw.setInt32(this, ptri, iLE);
    },
    get: function() {
      var ptrn;
      if (ptrn = dvw.getInt32(this, iLE)) {
        return new String(ptrn);
      }
      return this.name = String.from(this.class.name);
    }
  },
  parent: {
    set: function(ptri) {
      return dvw.setInt32(this + 4, ptri, iLE);
    },
    get: function() {
      return pointerOf(dvw.getInt32(this + 4, iLE));
    }
  },
  extend: {
    value: function(name, Prototype = this.constructor) {
      var ptrc, ptri;
      ptri = malloc(Prototype.byteLength, Prototype);
      ptrc = new Prototype(ptri);
      ptrc.name = String.from(name);
      ptrc.parent = this;
      ptrc.create();
      return ptrc;
    }
  },
  create: {
    value: function() {
      var parent;
      if (parent = this.parent || "") {
        self.pclass = parent.class;
        parent = `extends ${self.pclass.name}`;
      }
      document.body.appendChild(Object.assign(document.createElement("script"), {
        text: `self.iclass = (class ${this.name} ${parent} {})`
      })).remove();
      this.class = scopei(self.iclass);
      delete self.iclass;
      delete self.pclass;
      return scp[this.class];
    }
  },
  class: {
    set: function(v) {
      return dvw.setInt32(this + 8, v, iLE);
    },
    get: function() {
      return scp[dvw.getInt32(this + 8, iLE)] || this.create();
    }
  }
});

clssNumber = Class.from(Number);

clssPointer = clssNumber.extend("Pointer");

log(clssNumber);

log(clssPointer);

log(i32.subarray(0, 12));

log(scp);

a = function() {
  var BufferPointer, ClassPointer, ClassProperty, FunctionPointer, GlobalScope, Pointer, StringPointer, decodeMethod, encodeMethod, getByteLength, getClassIndex, getNextOffset, getParentPtri, getScopeIndex, getUsersInt32, hasClassIndex, headersLength, memoryClass, numberClass, ptrByteLength, ptrClassIndex, ptrNextOffset, ptrParentPtri, ptrScopeIndex, ptrUsersInt32, read, scope, setByteLength, setClassIndex, setNextOffset, setParentPtri, setScopeIndex, setUsersInt32, write;
  headersLength = 0;
  ptrNextOffset = headersLength += 4;
  getNextOffset = function(ptri = this) {
    return dvw.getInt32(ptri - ptrNextOffset, iLE);
  };
  setNextOffset = function(i32v, ptri = this) {
    return dvw.setInt32(ptri - ptrNextOffset, i32v, iLE);
  };
  ptrByteLength = headersLength += 4;
  getByteLength = function(ptri = this) {
    return dvw.getInt32(ptri - ptrByteLength, iLE);
  };
  setByteLength = function(i32v, ptri = this) {
    return dvw.setInt32(ptri - ptrByteLength, i32v, iLE);
  };
  ptrClassIndex = headersLength += 4;
  getClassIndex = function(ptri = this) {
    return dvw.getInt32(ptri - ptrClassIndex, iLE);
  };
  hasClassIndex = function(clsi, ptri = this) {
    return 0 === clsi - dvw.getInt32(ptri - ptrClassIndex, iLE);
  };
  setClassIndex = function(i32v, ptri = this) {
    return dvw.setInt32(ptri - ptrClassIndex, i32v, iLE);
  };
  ptrScopeIndex = headersLength += 4;
  getScopeIndex = function(ptri = this) {
    return dvw.getInt32(ptri - ptrScopeIndex, iLE);
  };
  setScopeIndex = function(i32v, ptri = this) {
    return dvw.setInt32(ptri - ptrScopeIndex, i32v, iLE);
  };
  ptrParentPtri = headersLength += 4;
  getParentPtri = function(ptri = this) {
    return dvw.getInt32(ptri - ptrParentPtri, iLE);
  };
  setParentPtri = function(i32v, ptri = this) {
    return dvw.setInt32(ptri - ptrParentPtri, i32v, iLE);
  };
  ptrUsersInt32 = headersLength += 4;
  getUsersInt32 = function(ptri = this) {
    return dvw.getInt32(ptri - ptrUsersInt32, iLE);
  };
  setUsersInt32 = function(i32v, ptri = this) {
    return dvw.setInt32(ptri - ptrUsersInt32, i32v, iLE);
  };
  Pointer = class Pointer extends Number {
    constructor(n) {
      super(n).oninit();
    }

  };
  GlobalScope = class GlobalScope extends Pointer {};
  StringPointer = class StringPointer extends Pointer {};
  ClassPointer = class ClassPointer extends StringPointer {};
  ClassProperty = class ClassProperty extends StringPointer {};
  FunctionPointer = class FunctionPointer extends StringPointer {};
  BufferPointer = class BufferPointer extends Pointer {};
  read = Atomics.load.bind(Atomics, i32);
  write = Atomics.store.bind(Atomics, i32);
  malloc = Atomics.add.bind(Atomics, i32, 0);
  scope = Object.defineProperty([Pointer], "i", {
    value: function(o) {
      var i;
      if (-1 === (i = this.indexOf(o))) {
        return i + this.push(o);
      } else {
        return i;
      }
    }
  });
  Object.defineProperty(String.prototype, "toCamelCase", {
    value: function() {
      return this[0].toLowerCase() + this.substring(1);
    }
  });
  Object.defineProperties(Pointer.prototype, {
    onalloc: {
      configurable: true,
      value: function() {
        return this;
      }
    },
    oninit: {
      configurable: true,
      value: function() {
        return this;
      }
    },
    buffer: {
      configurable: true,
      value: dvw.buffer
    },
    set: {
      value: function(arrayLike = [], index = 0, TypedArray = this.TypedArray) {
        this.subarray(TypedArray).set(arrayLike, index);
        return this;
      }
    },
    subarray: {
      value: function(TypedArray = Uint8Array) {
        var byteOffset, length;
        byteOffset = +this;
        length = this.getByteLength();
        if (1 < TypedArray.BYTES_PER_ELEMENT) {
          length /= TypedArray.BYTES_PER_ELEMENT;
        }
        return new TypedArray(this.buffer, byteOffset, length);
      }
    }
  });
  Object.defineProperties(Pointer.prototype, {
    ["{{Pointer}}"]: {
      get: function() {
        return new Int32Array(this.buffer, this - headersLength, headersLength / 4);
      }
    },
    filter: {
      value: function(fn) {
        var index, matchs, next, ptri, ptrj;
        next = headersLength;
        ptri = this + (index = 0);
        matchs = [];
        while (next = getNextOffset(next)) {
          if (ptri - getParentPtri(next)) {
            continue;
          }
          ptrj = Pointer.of(next);
          if (fn && !fn.call(this, ptrj, index)) {
            continue;
          }
          matchs[index++] = ptrj;
        }
        return matchs;
      }
    }
  });
  Object.defineProperties(Pointer.prototype, {
    getNextOffset: {
      value: getNextOffset
    },
    getByteLength: {
      value: getByteLength
    },
    getClassIndex: {
      value: getClassIndex
    },
    hasClassIndex: {
      value: hasClassIndex
    },
    getScopeIndex: {
      value: getScopeIndex
    },
    getParentPtri: {
      value: getParentPtri
    },
    getUsersInt32: {
      value: getUsersInt32
    }
  });
  Object.defineProperties(Pointer.prototype, {
    setNextOffset: {
      value: setNextOffset
    },
    setByteLength: {
      value: setByteLength
    },
    setClassIndex: {
      value: setClassIndex
    },
    setScopeIndex: {
      value: setScopeIndex
    },
    setParentPtri: {
      value: setParentPtri
    },
    setUsersInt32: {
      value: setUsersInt32
    }
  });
  Object.defineProperties(Pointer, {
    byteLength: {
      value: 0,
      writeable: true
    },
    TypedArray: {
      value: Uint8Array,
      configurable: true
    },
    malloc: {
      value: function(byteLength = 0, ProtoClass = this) {
        var allocBytes, byteOffset, classIndex, mod, nextOffset, ptri, ptriOffset;
        allocBytes = byteLength + headersLength;
        if (mod = allocBytes % 8) {
          allocBytes += 8 - mod;
        }
        byteOffset = malloc(allocBytes);
        classIndex = scope.i(ProtoClass);
        ptriOffset = byteOffset + headersLength;
        nextOffset = ptriOffset + allocBytes;
        ptri = new this(ptriOffset);
        ptri.setNextOffset(nextOffset);
        ptri.setByteLength(byteLength);
        ptri.setClassIndex(classIndex);
        ptri.onalloc();
        return ptri;
      }
    },
    of: {
      value: function(ptri, Prototype = this) {
        if (!ptri) {
          return 0;
        }
        if (!Pointer === Prototype) {
          return new Prototype(ptri);
        }
        return new scope[getClassIndex(ptri)](ptri);
      }
    }
  });
  Object.defineProperties(GlobalScope.prototype, {
    onalloc: {
      value: function() {
        return this.setScopeIndex(scope.i(self));
      }
    },
    self: {
      get: function() {
        return scope[this.getScopeIndex()];
      }
    },
    buffer: {
      get: function() {
        return dvw.buffer;
      }
    },
    scope: {
      get: function() {
        return scope;
      }
    },
    bufferLength: {
      get: function() {
        return dvw.byteLength;
      }
    },
    bufferOffset: {
      get: function() {
        return this.getNextOffset();
      }
    },
    int32array: {
      get: function() {
        return new Int32Array(this.buffer, 0, this.bufferOffset / 4);
      }
    },
    pointers: {
      get: function() {
        var matchs, next;
        next = headersLength;
        matchs = [];
        while (next = getNextOffset(next)) {
          matchs.push(Pointer.of(next));
        }
        return matchs;
      }
    }
  });
  Object.defineProperties(StringPointer, {
    encode: {
      value: TextEncoder.prototype.encode.bind(new TextEncoder)
    },
    decode: {
      value: TextDecoder.prototype.decode.bind(new TextDecoder)
    },
    from: {
      value: function(text = "") {
        var data, ptri;
        data = this.encode(text);
        ptri = this.malloc(data.byteLength);
        return ptri.set(data);
      }
    }
  });
  Object.defineProperties(StringPointer.prototype, {
    toString: {
      value: function() {
        return StringPointer.decode(this.subarray().slice());
      }
    }
  });
  Object.defineProperties(Map.prototype, {
    class: {
      set: setParentPtri,
      get: function() {
        return Pointer.of(this.getParentPtri());
      }
    }
  });
  Object.defineProperties(FunctionPointer.prototype, {
    name: {
      get: function() {
        return this.toString();
      }
    },
    value: {
      get: function() {
        return scope[getScopeIndex(this)];
      },
      set: function() {
        return this.setScopeIndex(scope.i(arguments[0]));
      }
    },
    call: {
      value: function() {
        return scope[getScopeIndex(this)].call(...arguments);
      }
    },
    bind: {
      value: function() {
        return scope[getScopeIndex(this)].bind(...arguments);
      }
    },
    apply: {
      value: function() {
        return scope[getScopeIndex(this)].apply(...arguments);
      }
    }
  });
  Object.defineProperties(ClassPointer.prototype, {
    name: {
      get: function() {
        return this.toString();
      }
    },
    parent: {
      get: function() {
        return Pointer.of(this.getParentPtri());
      },
      set: function() {
        return this.setParentPtri(arguments[0]);
      }
    },
    extend: {
      value: function() {
        var parent;
        if (parent = this.parent || "") {
          parent = "extends " + parent.class.name;
          self.pclass = parent.class;
        }
        document.body.appendChild(Object.assign(document.createElement("script"), {
          text: `self.iclass = (class ${this.name} ${parent} {})`
        })).remove();
        this.class = self.iclass;
        delete self.pclass;
        delete self.iclass;
        return this.class;
      }
    },
    class: {
      set: function(c) {
        return this.setScopeIndex(scope.i(c));
      },
      get: function() {
        return scope[this.getScopeIndex() || -1] || this.extend();
      }
    },
    extends: {
      get: function() {
        return this.filter();
      }
    },
    malloc: {
      value: function() {
        return this.class.malloc(...arguments);
      }
    }
  });
  Object.defineProperties(Map.prototype, {
    propertyOffset: {
      set: setByteLength,
      get: getByteLength
    },
    parent: {
      set: setParentPtri,
      get: function() {
        return Pointer.of(this.getParentPtri());
      }
    },
    children: {
      get: Pointer.prototype.filter
    },
    extends: {
      get: function() {
        return this.filter(function(ptrj) {
          return ptrj instanceof ClassPointer;
        });
      }
    },
    properties: {
      get: function() {
        return this.filter(function(ptrj) {
          return ptrj instanceof ClassProperty;
        });
      }
    },
    extend: {
      value: function(name) {
        var ptrc;
        ptrc = ClassPointer.malloc();
        self[this.name] = this.prototype;
        document.body.appendChild(Object.assign(document.createElement("script"), {
          text: `self.NEW = (class ${name} extends ${this.name} {})`
        })).remove();
        ptrc.setParentPtri(this);
        ptrc.setScopeIndex(scope.i(self.NEW));
        delete self[this.name];
        delete self["NEW"];
        return ptrc;
      }
    },
    defineProperty: {
      value: function(ptrc, name) {
        var prop;
        prop = ClassProperty.from(name || ptrc.name.toCamelCase());
        prop.setParentPtri(this);
        prop.setScopeIndex(ptrc);
        return this;
      }
    },
    prototype: {
      set: function(v) {
        return this.setScopeIndex(scope.i(v));
      },
      get: function() {
        return scope[this.getScopeIndex()];
      }
    },
    malloc: {
      value: function(byteLength = 0) {
        return this.prototype.malloc(byteLength);
      }
    },
    name: {
      get: function() {
        return this.prototype.name;
      }
    }
  }, encodeMethod = FunctionPointer.from("encodeText"), encodeMethod.value = TextEncoder.prototype.encode.bind(new TextEncoder), decodeMethod = FunctionPointer.from("decodeText"), decodeMethod.value = TextDecoder.prototype.decode.bind(new TextDecoder), numberClass = ClassPointer.from("Number"), numberClass.class = Number, memoryClass = ClassPointer.from("Pointer0"), memoryClass.parent = numberClass, warn(encodeMethod), warn(decodeMethod), warn(memoryClass));
  return document.body.appendChild(Object.assign(document.createElement("script"), {
    text: document.querySelector(`[src*='${import.meta.url.split(/\//).at(-1)}']`).text.trim()
  })).ownerDocument.querySelectorAll("script").forEach(function(n) {
    return n.remove();
  });
};
