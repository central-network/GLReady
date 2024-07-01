var Text;

import Pointer from "./Pointer.js";

export default Text = Pointer.extend("Text");

import {
  encode,
  decode
} from "./Pointer.js";

Text.staticProperty("TypedArray", {
  value: Uint8Array
});

Text.objectProperty("value", {
  get: function() {
    var end, subarray;
    subarray = this.subarray();
    if (!(end = subarray.indexOf(0))) {
      return "";
    }
    if (!subarray.buffer instanceof ArrayBuffer) {
      return decode(subarray.slice(0, end));
    }
    return decode(subarray.subarray(0, end));
  }
});
