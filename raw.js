var cpu, error, fns, log, sab, warn;

({log, warn, error} = console);

sab = null;

cpu = [];

fns = {
  window: function() {
    var i, len, pu, results;
    cpu.push(new Worker(src, {
      name: "memory"
    }));
    cpu.push(new Worker(src, {
      name: "display"
    }));
    cpu.push(new Worker(src, {
      name: "storage"
    }));
    cpu.push(new Worker(src, {
      name: "network"
    }));
    sab = new SharedArrayBuffer(1002);
    results = [];
    for (i = 0, len = cpu.length; i < len; i++) {
      pu = cpu[i];
      results.push(pu.postMessage(sab));
    }
    return results;
  },
  memory: function() {
    return this.onmessage = function({
        data: sab
      }) {
      return console.warn("alive name:", name, sab);
    };
  },
  display: function() {
    return this.onmessage = function({
        data: sab
      }) {
      return console.warn("alive name:", name, sab);
    };
  },
  storage: function() {
    return this.onmessage = function({
        data: sab
      }) {
      return console.warn("alive name:", name, sab);
    };
  },
  network: function() {
    return this.onmessage = function({
        data: sab
      }) {
      return console.warn("alive name:", name, sab);
    };
  }
};

fns[name || "window"].call(this);
