var ExtRef, scope;

import Pointer from "./Pointer.js";

import {
  HEADERS
} from "./Pointer.js";

export default ExtRef = Pointer.extend("ExtRef");

Object.defineProperty(scope = [, ], "index", {
  value: function(any) {
    var i;
    if (-1 === (i = this.indexOf(any))) {
      i += this.push(any);
    }
    return i;
  }
});

ExtRef.staticProperty("includes", {
  value: function(any) {
    return scope.includes(any);
  }
});

ExtRef.staticProperty("malloc", {
  value: function(object) {
    var ptri, scpi;
    if (object) {
      scpi = scope.index(object);
    }
    ptri = Pointer.malloc(0, ExtRef);
    HEADERS.scopeIndex.set(ptri, scpi);
    return ptri;
  }
});

ExtRef.objectProperty("scopeArray", {
  value: scope
});

ExtRef.objectProperty("object", {
  get: function() {
    return this.scopeArray[this.scopeIndex];
  },
  enumerable: true
});

ExtRef.objectProperty("scopeIndex", {
  get: function() {
    return HEADERS.scopeIndex.get(this);
  }
});
