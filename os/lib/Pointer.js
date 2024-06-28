var ClassPointer, Pointer, dvw, error, f32, findAllChilds, findInstances, getByteLength, getClassIndex, getParentPtri, getScopeIndex, i16, i32, iLE, lock, log, malloc, plen, setClassIndex, setParentPtri, setScopeIndex, thread, u16, u32, ui8, wait, warn;

Pointer = class Pointer extends Number {};

ClassPointer = class ClassPointer extends Number {};

export default Pointer;

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

getByteLength = function(ptri = this) {
  return dvw.getInt32(ptri - 24, iLE);
};

getScopeIndex = function(ptri = this) {
  return dvw.getInt32(ptri - 20, iLE);
};

setScopeIndex = function(ptri, scpi) {
  return dvw.setInt32(ptri - 20, scpi, iLE);
};

getClassIndex = function(ptri = this) {
  return dvw.getInt32(ptri - 12, iLE);
};

setClassIndex = function(ptri, clsi) {
  return dvw.setInt32(ptri - 12, clsi, iLE);
};

findInstances = function(clsi) {
  var Clss, create, last, matchs, ptri, ptrj;
  matchs = [];
  create = Pointer.of;
  ptrj = 2 * plen;
  last = 1 + Atomics.load(i32);
  Clss = scope.at(clsi);
  while (ptrj < last) {
    if (0 === clsi - getClassIndex(ptrj)) {
      ptri = create(ptrj);
      log(ptri);
      if (ptri instanceof Clss) {
        matchs[matchs.length] = ptri;
      }
    }
    ptrj += plen + getByteLength(ptrj);
  }
  return matchs;
};

findAllChilds = function(ptri = this) {
  var create, last, matchs, ptrj;
  matchs = [];
  create = ptri.of || ptri.constructor.of;
  last = 1 + Atomics.load(i32);
  ptri = 0 + ptri;
  ptrj = 2 * plen;
  while (ptrj < last) {
    if (0 === ptri - getParentPtri(ptrj)) {
      matchs[matchs.length] = create(ptrj);
    }
    ptrj += plen + getByteLength(ptrj);
  }
  return matchs;
};

getParentPtri = function(ptri = this) {
  return dvw.getInt32(ptri - 16, iLE);
};

setParentPtri = function(ptri, ptrj) {
  return dvw.setInt32(ptri - 16, ptrj, iLE);
};

malloc = function(Class, byteLength = 0) {
  var ptri;
  byteLength += Class.byteLength || 0;
  ptri = plen + Atomics.add(i32, 0, byteLength + plen);
  dvw.setInt32(ptri - 24, byteLength, iLE);
  dvw.setInt32(ptri - 12, scope.i(Class), iLE);
  return new Class(ptri);
};

Object.defineProperties(Pointer, {
  byteLength: {
    value: 0,
    writable: 1
  },
  of: {
    value: function(ptri) {
      return ptri && new scope[getClassIndex(ptri)](ptri);
    }
  },
  malloc: {
    value: function() {
      return malloc(this);
    }
  },
  defineProperty: {
    value: function(name, byteLength) {}
  },
  extend: {
    value: function(ClassName) {
      var Class, ptrc, scopei;
      scopei = scope.i(this);
      document.body.appendChild(Object.assign(document.createElement("script"), {
        text: `scope.i(class ${ClassName} extends scope[${scopei}]{})`
      })).remove();
      if (!(Class = scope.find(function(i) {
        return i.name === ClassName;
      }))) {
        throw /EXTEND/;
      }
      ptrc = malloc(ClassPointer);
      ptrc.class = Class;
      ptrc.parent = this.prototype.pointerof;
      return Class;
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
  byteLength: {
    get: getByteLength
  },
  children: {
    get: findAllChilds
  },
  parent: {
    get: function() {
      return Pointer.of(getParentPtri(this));
    },
    set: function() {
      return setParentPtri(this, arguments[0]);
    }
  },
  subarray: {
    get: function(TypedArray = Uint32Array) {
      return new TypedArray(dvw.buffer, this, this.byteLength / TypedArray.BYTES_PER_ELEMENT);
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

Object.defineProperties(ClassPointer.prototype, {
  class: {
    get: function() {
      return scope.at(getScopeIndex(this));
    },
    set: function(Class) {
      setScopeIndex(this, scope.i(Class));
      return Object.defineProperty(Class.prototype, "pointerof", {
        value: this,
        writable: true
      });
    }
  },
  parent: {
    get: function() {
      return ClassPointer.of(getParentPtri(this));
    },
    set: function() {
      return setParentPtri(this, arguments[0]);
    }
  },
  extends: {
    get: findAllChilds
  },
  name: {
    get: function() {
      return this.class.name;
    }
  },
  instances: {
    get: function() {
      return findInstances(scope.i(this.class));
    }
  }
});

Pointer.setBuffer(new ArrayBuffer(12096));

malloc(ClassPointer).class = Pointer;
