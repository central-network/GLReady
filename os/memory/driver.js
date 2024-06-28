var imports, methods, wasm;

console.log(/DRIVER/, "memory device driver thread");

wasm = null;

methods = [];

imports = {};

addEventListener("message", function({data}) {
  console.error("memory device driver got msg", data, wasm);
  if (data.call === "memory.malloc") {
    // todo check is it satisfying requirements
    // permissions is not checking in here
    return 1;
  }
});

methods.push("memory.malloc");

imports.memory = {
  // malloc : -> 1
  // todo bunu wasm'ın import etmesine gerek yok
  // sadece window'a bildirmek gerekiyor ki
  // bu aygitin boyle bir metodu var
  // expose gereksiz
  new_ArrayBuffer: function(byteLength) {},
  // creates new array buffer from inside wasm device
  new_SharedArrayBuffer: function(byteLength) {}
};

// creates new shared array buffer from inside wasm device
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
