var dev, f, imports, l, methods, r;

console.log("network device driver thread");

dev = null;

addEventListener("message", function({data}) {
  return console.warn("device driver got msg", data, dev);
});

methods = [];

imports = {
  socket: {
    tcp: function() {
      return 1;
    }
  }
};

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
}).then(function(wasm) {
  dev = wasm;
  return postMessage(methods);
});
