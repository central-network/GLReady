var f, imports, l, methods, r, wasm;

console.log("network device driver thread");

wasm = null;

addEventListener("message", function({data}) {
  return console.warn("device driver got msg", data, wasm);
});

methods = [];

imports = {};

imports.socket = {
  tcp: function() {
    return 1;
  }
};

setTimeout(() => {
  return postMessage({
    call: "memory.malloc",
    args: [1240]
  });
}, 1000);

for (r in imports) {
  l = imports[r];
  for (f in l) {
    methods.push(`${r}.${f}`);
  }
}

fetch("./device.wasm").then(function(data) {
  return data.arrayBuffer();
}).then(function(buff) {
  return WebAssembly.instantiate(buff, imports);
}).then(function(init) {
  return wasm = init;
}).then(function() {
  return postMessage({
    call: "methods",
    args: methods
  });
});
