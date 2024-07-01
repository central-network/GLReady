var ClassPointer, ClassProperty, Pointer, PointerClass, dvw, error, f32, findAllChilds, findInstances, getByteLength, getClassIndex, getFree4Bytes, getNextOffset, getParentPtri, getScopeIndex, i16, i32, iLE, lock, log, malloc, plen, setByteLength, setClassIndex, setFree4Bytes, setNextOffset, setParentPtri, setScopeIndex, thread, u16, u32, ui8, wait, warn;

Pointer = class Pointer extends Number {};

ClassPointer = class ClassPointer extends Number {};

ClassProperty = class ClassProperty extends Pointer {};

export var encode = TextEncoder.prototype.encode.bind(new TextEncoder);

export var decode = TextDecoder.prototype.decode.bind(new TextDecoder);

({log, warn, error} = console);

[iLE, dvw, ui8, i32, u32, f32, i16, u16] = [1];

[wait, self.scope, thread, lock, plen] = [{}, [], -1, function() {}, 24];

Object.defineProperties(scope, {
  i: {
    value: function() {
      var i;
      if (-1 === (i = this.indexOf(arguments[0]))) {
        i += this.push(arguments[0]);
      }
      return i;
    }
  }
});

Object.defineProperties(Object.getPrototypeOf(Uint8ClampedArray), {
  DataViewGetter: {
    get: function() {
      return `get${this.name.replace('Array', '')}`;
    }
  },
  DataViewSetter: {
    get: function() {
      return `set${this.name.replace('Array', '')}`;
    }
  }
});

getNextOffset = function(ptri = this) {
  return dvw.getInt32(ptri - 24, iLE);
};

setNextOffset = function(ptri, next) {
  return dvw.setInt32(ptri - 24, next, iLE);
};

getByteLength = function(ptri = this) {
  return dvw.getInt32(ptri - 20, iLE);
};

setByteLength = function(ptri, byte) {
  return dvw.setInt32(ptri - 20, byte, iLE);
};

getScopeIndex = function(ptri = this) {
  return dvw.getInt32(ptri - 16, iLE);
};

setScopeIndex = function(ptri, scpi) {
  return dvw.setInt32(ptri - 16, scpi, iLE);
};

getClassIndex = function(ptri = this) {
  return dvw.getInt32(ptri - 12, iLE);
};

setClassIndex = function(ptri, clsi) {
  return dvw.setInt32(ptri - 12, clsi, iLE);
};

getParentPtri = function(ptri = this) {
  return dvw.getInt32(ptri - 8, iLE);
};

setParentPtri = function(ptri, ptrj) {
  return dvw.setInt32(ptri - 8, ptrj, iLE);
};

getFree4Bytes = function(ptri = this) {
  return dvw.getInt32(ptri - 4, iLE);
};

setFree4Bytes = function(ptri, byte) {
  return dvw.setInt32(ptri - 4, byte, iLE);
};

export var HEADERS = {
  nextOffset: {
    get: getNextOffset,
    set: setNextOffset
  },
  byteLength: {
    get: getByteLength,
    set: setByteLength
  },
  scopeIndex: {
    get: getScopeIndex,
    set: setScopeIndex
  },
  classIndex: {
    get: getClassIndex,
    set: setClassIndex
  },
  parentPtri: {
    get: getParentPtri,
    set: setParentPtri
  },
  free4Bytes: {
    get: getFree4Bytes,
    set: setFree4Bytes
  }
};

findInstances = function(clsi) {
  var matchs, next, ptri, ptrj;
  matchs = [];
  ptri = ptri + 0;
  next = plen * 2;
  while (ptrj = getNextOffset(next)) {
    if (!(clsi - getClassIndex(ptrj))) {
      matchs[matchs.length] = Pointer.of(ptrj);
    }
    next = ptrj;
  }
  return matchs;
};

findAllChilds = function(ptri = this) {
  var matchs, next, ptrj;
  matchs = [];
  ptri = ptri + 0;
  next = plen * 2;
  while (ptrj = getNextOffset(next)) {
    if (!(ptri - getParentPtri(ptrj))) {
      matchs[matchs.length] = new scope[getClassIndex(ptrj)](ptrj);
    }
    next = ptrj;
  }
  return matchs;
};

malloc = function(Class, byteLength = 0) {
  var allocLength, mod, nextOffset, ptri, ptriOffset;
  allocLength = byteLength + plen;
  if (mod = allocLength % 8) {
    allocLength += 8 - mod;
  }
  ptriOffset = Atomics.add(i32, 0, allocLength);
  nextOffset = ptriOffset + allocLength + plen;
  ptri = ptriOffset + plen;
  setNextOffset(ptri, nextOffset);
  setByteLength(ptri, byteLength);
  setClassIndex(ptri, scope.i(Class));
  return new Class(ptri);
};

Object.defineProperties(Pointer, {
  TypedArray: {
    value: Uint8Array
  },
  byteLength: {
    value: 0,
    writable: 1
  },
  encode: {
    value: function() {
      return +arguments[0];
    }
  },
  decode: {
    value: function() {
      return Pointer.of(arguments[0]);
    }
  },
  setHeader: {
    value: function(offset, value) {
      return dvw.setInt32(this + offset, value, iLE);
    }
  },
  getHeader: {
    value: function(offset) {
      return dvw.getInt32(this + offset, iLE);
    }
  },
  of: {
    value: function(ptri) {
      return ptri && new scope[getClassIndex(ptri)](ptri);
    }
  },
  setBuffer: {
    value: function(buffer) {
      var old;
      old = dvw && i32.slice() || [plen];
      dvw = new DataView(buffer);
      ui8 = new Uint8Array(buffer);
      u32 = new Uint32Array(buffer);
      f32 = new Float32Array(buffer);
      i32 = new Int32Array(buffer);
      i32.set(old);
      return this;
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  ["{{Pointer}}"]: {
    get: function() {
      return {
        NextOffset: getNextOffset(this),
        ByteLength: getByteLength(this),
        ScopeIndex: getScopeIndex(this),
        ClassIndex: getClassIndex(this),
        ParentPtri: getParentPtri(this),
        subarrays: {
          Uint8Array: this.subarray(Uint8Array),
          Uint16Array: this.subarray(Uint16Array),
          Uint32Array: this.subarray(Uint32Array),
          Int32Array: this.subarray(Int32Array),
          Float32Array: this.subarray(Float32Array)
        }
      };
    }
  },
  children: {
    get: findAllChilds,
    configurable: true,
    enumerable: true
  },
  parent: {
    get: function() {
      return Pointer.of(getParentPtri(this));
    },
    set: function() {
      return setParentPtri(this, arguments[0]);
    },
    enumerable: true
  },
  subarray: {
    value: function() {
      var TypedArray, byteLength, byteOffset, length, offset;
      if (isNaN(arguments[0])) {
        TypedArray = arguments[0] || this.constructor.TypedArray;
        byteOffset = arguments[1] || 0;
        byteLength = arguments[2] || getByteLength(this);
      } else {
        TypedArray = this.constructor.TypedArray;
        byteOffset = arguments[0] || 0;
        byteLength = arguments[1] || getByteLength(this);
      }
      offset = byteOffset + this;
      length = (byteLength - byteOffset) / TypedArray.BYTES_PER_ELEMENT;
      return new TypedArray(dvw.buffer, offset, length);
    }
  },
  setUint8Array: {
    value: function(data, index = 0) {
      this.subarray(Uint8Array).set(data, index);
      return this;
    }
  },
  appendChild: {
    value: function(ptri) {
      setParentPtri(ptri, this);
      return ptri;
    }
  }
});

Object.defineProperties(ClassPointer, {
  of: {
    value: function(ptri) {
      return ptri && new ClassPointer(ptri);
    }
  }
});

Object.defineProperties(ClassProperty.prototype, {
  name: {
    enumerable: true,
    get: function() {
      return decode(this.nameArray());
    }
  },
  pointerOffset: {
    enumerable: true,
    get: function() {
      return dvw.getUint8(this);
    },
    set: function() {
      return dvw.setUint8(this, arguments[0]);
    }
  },
  byteLength: {
    enumerable: true,
    get: function() {
      return dvw.getUint8(this + 1);
    },
    set: function() {
      return dvw.setUint8(this + 1, arguments[0]);
    }
  },
  children: {
    value: []
  },
  nameArray: {
    value: function() {
      return this.subarray(12);
    }
  }
});

Object.defineProperties(ClassPointer.prototype, {
  class: {
    get: function() {
      return scope.at(getScopeIndex(this));
    },
    set: function() {
      return setScopeIndex(this, scope.i(arguments[0]));
    },
    enumerable: true
  },
  parent: {
    get: function() {
      return ClassPointer.of(getParentPtri(this));
    },
    set: function() {
      return setParentPtri(this, arguments[0]);
    },
    enumerable: true
  },
  extends: {
    enumerable: true,
    get: function() {
      return findAllChilds(this).filter(function(i) {
        return i instanceof ClassPointer;
      });
    }
  },
  extend: {
    value: function(ClassName) {
      var Class, ptrc, scopei;
      scopei = getScopeIndex(this);
      document.body.appendChild(Object.assign(document.createElement("script"), {
        text: `scope.i(class ${ClassName} extends scope[${scopei}]{})`
      })).remove();
      if (!(Class = scope.find(function(i) {
        return i.name === ClassName;
      }))) {
        throw /EXTEND/;
      }
      ptrc = malloc(ClassPointer);
      setScopeIndex(ptrc, scope.i(Class));
      setParentPtri(ptrc, this);
      Object.defineProperties(Class.prototype, {
        classPointer: {
          value: ptrc
        }
      });
      return ptrc;
    }
  },
  name: {
    enumerable: true,
    get: function() {
      return this.class.name;
    }
  },
  children: {
    enumerable: true,
    get: function() {
      return findAllChilds(this).filter(function(i) {
        return i instanceof ClassProperty;
      });
    }
  },
  byteLength: {
    enumerable: true,
    get: getByteLength
  },
  instances: {
    enumerable: true,
    get: function() {
      return findInstances(scope.i(this.class));
    }
  },
  malloc: {
    value: function(byteLength = 0, Class = this.class) {
      return malloc(Class, byteLength);
    }
  },
  staticProperty: {
    value: function(prop, desc) {
      return Object.defineProperty(this.class, prop, desc);
    }
  },
  objectProperty: {
    value: function(prop, desc) {
      return Object.defineProperty(this.class.prototype, prop, desc);
    }
  },
  mallocProperty: {
    value: function(prop, desc) {
      var byteLength, byteOffset, constructor, encodedName, getter, ifnull, k, options, propByteLength, ptri, setter, v;
      byteOffset = getByteLength(this);
      if (desc.instanceof instanceof ClassPointer) {
        encodedName = encode(prop);
        propByteLength = encodedName.byteLength + 12;
        ptri = malloc(ClassProperty, propByteLength);
        setParentPtri(ptri, this);
        setScopeIndex(ptri, scope.i(desc.instanceof));
        ptri.nameArray().set(encodedName);
        ptri.pointerOffset = byteOffset;
        ptri.byteLength = byteLength = 4;
      }
      
      //getter = "getInt32"
      //setter = "setInt32"
      //decode = Pointer.of
      //encode = (v) -> +v
      setByteLength(this, byteOffset + byteLength);
      return warn(this, byteOffset, getByteLength(this));
      if (Pointer.isPrototypeOf(desc.instanceof)) {
        byteLength = 4;
        getter = "getInt32";
        setter = "setInt32";
        decode = Pointer.of;
        encode = function(v) {
          return +v;
        };
      } else {
        byteLength = desc.byteLength || (desc.instanceof.BYTES_PER_ELEMENT * (desc.length || 1));
        getter = desc.getter || desc.instanceof.DataViewGetter;
        setter = desc.setter || desc.instanceof.DataViewSetter;
        encode = desc.encode || desc.instanceof.encode || (function(v) {
          return v;
        });
        decode = desc.decode || desc.instanceof.decode || (function(v) {
          return v;
        });
      }
      ifnull = desc.ifnull || (function() {
        return 0;
      });
      //defines on Class (static)
      if (Pointer.isPrototypeOf(target)) {
        constructor = target;
      }
      
      //defines on Class.prototype
      if (target instanceof Pointer) {
        constructor = target.constructor;
        byteOffset = constructor.byteLength;
        options = {
          writable: desc.writable,
          enumerable: desc.enumerable,
          configurable: desc.configurable
        };
        for (k in options) {
          v = options[k];
          if (!v) {
            delete options[k];
          }
        }
        Object.defineProperty(target, prop, {
          get: function() {
            var val;
            if (val = decode.call(this, dvw[getter](this + byteOffset, iLE))) {
              return val;
            }
            if (val = ifnull.call(this)) {
              return this[prop] = val;
            }
            return 0;
          },
          set: function(v) {
            return dvw[setter](this + byteOffset, encode.call(this, v), iLE);
          },
          ...options
        });
      }
      constructor.byteLength += byteLength;
      return target;
    }
  }
});

Pointer.setBuffer(new ArrayBuffer(12096));

PointerClass = malloc(ClassPointer);

setScopeIndex(PointerClass, scope.i(Pointer));

export default PointerClass;
