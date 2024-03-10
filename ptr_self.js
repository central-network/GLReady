self.log = function() {
  var i, iw, len, ref, t, v;
  iw = typeof window === "undefined" || window === null;
  t = iw ? ["%c[worker]", "color: yellow;"] : ["%c[window]", "color: aqua;"];
  console.groupCollapsed(...t, arguments[0], "∆");
  ref = [...arguments].slice(1);
  for (i = 0, len = ref.length; i < len; i++) {
    v = ref[i];
    console.log(v);
  }
  return console.groupEnd();
};
