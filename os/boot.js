var ClassPointer, FunctionPointer, PropertyPointer, StringPointer, Uint8ArrayPointer, a, buf, define, dvw, error, extRefClass, filterMallocs, getAllHeaders, getByteLength, getClassIndex, getNextOffset, getParentPtri, getScopeIndex, getUsersInt32, hasClassIndex, headersLength, i32, iLE, int32Property, localWindowClass, log, malloc, ptrByteLength, ptrClassIndex, ptrNextOffset, ptrParentPtri, ptrScopeIndex, ptrUsersInt32, renew_Pointer, rootPointerClass, scopei, scp, setByteLength, setClassIndex, setNextOffset, setParentPtri, setScopeIndex, setUsersInt32, stringClass, ui8, warn, win;

({log, warn, error} = console);

iLE = new self.Uint8Array(self.Float32Array.of(1).buffer)[3];

scp = new self.Array(null);

buf = new self.ArrayBuffer(4e5);

i32 = new self.Int32Array(buf);

ui8 = new self.Uint8Array(i32.buffer);

dvw = new self.DataView(i32.buffer);

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

getAllHeaders = function(ptri = this) {
  var begin, byteLength, classIndex, hlen, nextOffset, parentPtri, scopeIndex, usersInt32;
  hlen = headersLength / 4;
  begin = ptri / 4;
  [usersInt32, parentPtri, scopeIndex, classIndex, byteLength, nextOffset] = i32.subarray(begin - hlen, begin);
  return {
    usersInt32,
    parentPtri,
    scopeIndex,
    classIndex,
    byteLength,
    nextOffset,
    class: scp[classIndex],
    scopeItem: scp[scopeIndex],
    parent: renew_Pointer(parentPtri),
    next: renew_Pointer(nextOffset),
    byteArray: ui8.subarray(ptri, ptri + byteLength).slice(),
    byteOffset: +ptri
  };
};

int32Property = function(byteOffset, classPointer, desc = {}) {
  return {
    setAsNumber: function(i32v) {
      return dvw.setInt32(this + byteOffset, i32v, iLE);
    },
    setAsScopei: function(object) {
      return dvw.setInt32(this + byteOffset, scopei(object), iLE);
    },
    getAsScopei: function() {
      return scp[dvw.getInt32(this + byteOffset, iLE)];
    },
    getAsNumber: function() {
      return dvw.getInt32(this + byteOffset, iLE);
    },
    getAsPointer: function() {
      return renew_Pointer(dvw.getInt32(this + byteOffset, iLE));
    },
    getOrMalloc: function() {
      var ptri;
      if (ptri = dvw.getInt32(this + byteOffset, iLE)) {
        return renew_Pointer(ptri);
      }
      if (typeof desc.default !== "function") {
        ptri = classPointer.malloc(desc.byteLength);
      } else if (!(ptri = desc.default.call(this, classPointer, byteOffset))) {
        return 0;
      }
      dvw.setInt32(this + byteOffset, ptri, iLE);
      return ptri;
    }
  };
};

renew_Pointer = function(ptri = this) {
  var clsi;
  if (ptri && (clsi = getClassIndex(ptri))) {
    return new scp[clsi](ptri);
  }
  return 0;
};

filterMallocs = function(test, ptri = this) {
  var index, matchs, next, ptrj;
  next = headersLength * 2;
  index = 0;
  matchs = [];
  test = test && test.call && test;
  while (next = getNextOffset(next)) {
    if (ptri) {
      if (ptri - getParentPtri(next)) {
        continue;
      }
    }
    if (!(ptrj = renew_Pointer(next))) {
      continue;
    }
    if (test) {
      if (!test.call(ptri, ptrj, index)) {
        continue;
      }
    }
    matchs[index++] = ptrj;
  }
  return matchs;
};

Atomics.or(i32, 0, headersLength);

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
  allocBytes = byteLength + headersLength;
  if (0 < (mod = allocBytes % 8)) {
    allocBytes += 8 - mod;
  }
  ptriOffset = Atomics.add(i32, 0, allocBytes);
  nextOffset = ptriOffset + allocBytes + headersLength;
  classIndex = scopei(Prototype);
  byteOffset = ptriOffset + headersLength;
  setClassIndex(classIndex, byteOffset);
  setNextOffset(nextOffset, byteOffset);
  setByteLength(byteLength, byteOffset);
  return new Prototype(byteOffset);
};

Uint8ArrayPointer = class Uint8ArrayPointer extends Number {
  static from(uInt8Array) {
    var blen, ptri;
    blen = uInt8Array.byteLength;
    ptri = malloc(blen, this);
    ptri.toArray().set(uInt8Array);
    return ptri;
  }

};

FunctionPointer = (function() {
  class FunctionPointer extends Number {
    static from(object) {
      var ptri;
      ptri = malloc(this.byteLength, this);
      ptri.object = object;
      return ptri;
    }

  };

  FunctionPointer.byteLength = 4;

  return FunctionPointer;

}).call(this);

define(FunctionPointer.prototype, {
  object: {
    get: function() {
      return scp[dvw.getInt32(this, iLE)];
    },
    set: function(v) {
      return dvw.setInt32(this, scopei(v), iLE);
    }
  },
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

define(Uint8ArrayPointer.prototype, {
  array: {
    get: function() {
      return ui8.subarray(this, this + this.byteLength);
    }
  },
  byteLength: {
    get: function() {
      return getByteLength(this);
    }
  },
  set: {
    value: function(array, index = 0) {
      this.array.set(array, index);
      return this;
    }
  }
});

StringPointer = (function() {
  class StringPointer extends Number {
    static from(string = "") {
      var data;
      data = this.encoder.exec(string);
      return Uint8ArrayPointer.from.call(this, data);
    }

  };

  StringPointer.encoder = FunctionPointer.from(TextEncoder.prototype.encode.bind(new TextEncoder));

  StringPointer.decoder = FunctionPointer.from(TextDecoder.prototype.decode.bind(new TextDecoder));

  return StringPointer;

}).call(this);

define(StringPointer.prototype, {
  value: {
    get: function() {
      return this.toString();
    }
  },
  length: {
    get: function() {
      return getByteLength(this);
    }
  },
  toArray: {
    value: function() {
      return ui8.subarray(this, this + this.length);
    }
  },
  toString: {
    value: function() {
      return StringPointer.decoder.exec(this.toArray());
    }
  },
  toCamelCase: {
    value: function() {
      return this.value[0].toLowerCase() + this.value.substring(1);
    }
  }
});

ClassPointer = (function() {
  class ClassPointer extends Number {
    static from(Any) {
      var ptri;
      ptri = malloc(this.byteLength, ClassPointer);
      ptri.name = StringPointer.from(Any.name);
      ptri.class = Any;
      ptri.create();
      return ptri;
    }

  };

  ClassPointer.byteLength = 12;

  return ClassPointer;

}).call(this);

PropertyPointer = (function() {
  class PropertyPointer extends Number {
    static from(classi, name) {
      var ptri;
      ptri = malloc(this.byteLength, this);
      ptri.name = StringPointer.from(name);
      ptri.classPointer = classi;
      return ptri;
    }

  };

  PropertyPointer.byteLength = 16;

  return PropertyPointer;

}).call(this);

define(PropertyPointer.prototype, {
  offset: {
    set: function(i32v) {
      return dvw.setInt32(this + 8, i32v, iLE);
    },
    get: function() {
      return dvw.getInt32(this + 8, iLE);
    }
  },
  classPointer: {
    set: function(ptri) {
      return dvw.setInt32(this + 4, ptri, iLE);
    },
    get: function() {
      return renew_Pointer(dvw.getInt32(this + 4, iLE));
    }
  },
  name: {
    set: function(ptri) {
      return dvw.setInt32(this, ptri, iLE);
    },
    get: function() {
      return renew_Pointer(dvw.getInt32(this, iLE));
    }
  },
  parent: {
    set: setParentPtri,
    get: function() {
      return renew_Pointer(getParentPtri(this));
    }
  },
  malloc: {
    value: function(byteLength = 0) {
      return this.classPointer.malloc(byteLength);
    }
  }
});

define(ClassPointer.prototype, {
  name: {
    set: function(ptri) {
      return dvw.setInt32(this, ptri, iLE);
    },
    get: function() {
      var ptrn;
      if (ptrn = dvw.getInt32(this, iLE)) {
        return new StringPointer(ptrn);
      }
      return this.name = StringPointer.from(this.class.name);
    }
  },
  byteLength: {
    set: function(i32v) {
      return dvw.setInt32(this + 4, i32v, iLE);
    },
    get: function() {
      return dvw.getInt32(this + 4, iLE);
    }
  },
  parent: {
    set: setParentPtri,
    get: function() {
      return renew_Pointer(getParentPtri(this));
    }
  },
  children: {
    get: filterMallocs
  },
  extends: {
    enumerable: true,
    get: function() {
      return filterMallocs.call(this, function(ptri) {
        return ptri instanceof ClassPointer;
      });
    }
  },
  malloc: {
    value: function(byteLength = 0) {
      return malloc(this.byteLength + byteLength, this.class);
    }
  },
  extend: {
    value: function(name) {
      var clss, ptri;
      clss = ClassPointer;
      ptri = malloc(clss.byteLength, clss);
      ptri.name = StringPointer.from(name);
      ptri.parent = this;
      ptri.create();
      return ptri;
    }
  },
  create: {
    value: function() {
      var parent, pname;
      if (!(parent = this.parent && this.parent.class)) {
        return scp[getScopeIndex(this)];
      }
      self[pname = parent.name] = parent;
      document.body.appendChild(Object.assign(document.createElement("script"), {
        text: `self.iclass = (class ${this.name} extends ${pname} {})`
      })).remove();
      this.class = self.iclass;
      delete self.iclass;
      delete self[pname];
      return this.class;
    }
  },
  class: {
    set: function(cl) {
      return setScopeIndex(scopei(cl), this);
    },
    get: function() {
      return scp[getScopeIndex(this)] || this.create();
    }
  },
  of: {
    value: function(ptri) {
      setClassIndex(getScopeIndex(this), ptri);
      return renew_Pointer(ptri);
    }
  },
  define: {
    value: function(prop, desc) {
      define(this.class.prototype, {
        [prop]: {
          enumerable: true,
          configurable: true,
          ...desc
        }
      });
      return this;
    }
  },
  property: {
    value: function(classPointer, prop, desc = {}) {
      var byteOffset, io, ptri;
      byteOffset = this.byteLength;
      this.byteLength += 4;
      prop = prop || classPointer.name.toCamelCase();
      ptri = PropertyPointer.from(classPointer, prop);
      ptri.parent = this;
      ptri.offset = byteOffset;
      io = int32Property(byteOffset, classPointer, desc);
      this.define(prop, {
        get: io.getOrMalloc,
        set: io.setAsNumber,
        ...desc
      });
      return prop;
    }
  }
});

rootPointerClass = ClassPointer.from(Number).extend("Pointer");

extRefClass = rootPointerClass.extend("ExtRef");

stringClass = rootPointerClass.extend("String");

extRefClass.define("object", {
  get: function() {
    return scp[getScopeIndex(this)];
  },
  set: function(any) {
    return setScopeIndex(scopei(any), this);
  }
});

localWindowClass = rootPointerClass.extend("LocalWindow");

localWindowClass.property(extRefClass);

localWindowClass.property(stringClass, "name", {
  default: function(propertyPointer) {
    return propertyPointer.of(StringPointer.from(window.name));
  }
});

log(rootPointerClass);

log(localWindowClass);

log(win = localWindowClass.malloc());

win.extRef.object = window;

log(i32.subarray(0, 12));

log(scp);

log(getAllHeaders(win.name));

log(filterMallocs());

a = function() {
  var BufferPointer, ClassProperty, GlobalScope, Pointer, decodeMethod, encodeMethod, memoryClass, numberClass, read, scope, write;
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
