var Method, Pointer, Request, Window, Worker, bc, dvw, emit, error, f32, fns, getByteLength, getParentPtri, getScopeIndex, i16, i32, iLE, lock, log, onmessage, plen, request, response, scope, setParentPtri, thread, u16, u32, ui8, wait, warn;

Pointer = class Pointer extends Number {};

Window = class Window extends Pointer {};

Worker = class Worker extends Pointer {};

Method = class Method extends Pointer {};

Request = class Request extends Pointer {};

({log, warn, error} = console);

[iLE, dvw, ui8, i32, u32, f32, i16, u16] = [1];

[wait, scope, thread, lock, plen] = [{}, [0], -1, function() {}, 24];

getByteLength = function(ptri = this) {
  return dvw.getInt32(ptri - 24, iLE);
};

getScopeIndex = function(ptri = this) {
  return dvw.getInt32(ptri - 20, iLE);
};

getParentPtri = function(ptri = this) {
  return dvw.getInt32(ptri - 16, iLE);
};

setParentPtri = function(ptri, ptrj) {
  return dvw.setInt32(ptri - 16, ptrj, iLE);
};

Object.defineProperties(Pointer, {
  byteLength: {
    writable: 1,
    value: 0
  },
  of: {
    value: function(byteOffset) {
      return byteOffset && new scope[getScopeIndex(byteOffset)](byteOffset);
    }
  },
  malloc: {
    value: function(byteLength = 0) {
      var ptri;
      byteLength += this.byteLength;
      ptri = plen + Atomics.add(i32, 0, byteLength + plen);
      dvw.setInt32(ptri - 24, byteLength, iLE);
      dvw.setInt32(ptri - 20, scope.index(this), iLE);
      return new this(ptri);
    }
  }
});

Object.defineProperties(Pointer.prototype, {
  byteLength: {
    get: getByteLength
  },
  scopeIndex: {
    get: getScopeIndex
  },
  children: {
    get: function() {
      var last, ptri, ptrj, ptrs;
      ptrs = [];
      last = Atomics.load(i32);
      ptri = +this;
      ptrj = plen * 2;
      while (ptrj < last) {
        if (0 === ptri - getParentPtri(ptrj)) {
          ptrs[ptrs.length] = Pointer.of(ptrj);
        }
        ptrj += plen + getByteLength(ptrj);
      }
      return ptrs;
    }
  },
  parent: {
    get: function() {
      return Pointer.of(getParentPtri(this));
    },
    set: function() {
      setParentPtri(this, arguments[0]);
      return this;
    }
  },
  subarray: {
    get: function(TypedArray = Uint32Array) {
      return new TypedArray(dvw.buffer, this, this.byteLength / TypedArray.BYTES_PER_ELEMENT);
    }
  }
});

Window.byteLength += 4;

Worker.byteLength += 12;

onmessage = async function({data}) {
  var done, func, result;
  if (done = wait[data.time]) {
    done(data.result);
    delete wait[data.time];
    return 0;
  }
  if (func = fns[data.func]) {
    result = (await func.apply(fns, data.args));
    this.response(data.time, result);
    return 0;
  }
};

request = function(func, ...args) {
  return new Promise((done) => {
    var time;
    wait[time = Date.now()] = done;
    return this.postMessage({
      func,
      args,
      from: self.name,
      with: this.name,
      time
    });
  });
};

response = function(time, result) {
  return this.postMessage({time, result});
};

emit = function(func, ...args) {
  log("locked", name, lock);
  warn(lock());
  return log("unlocked", name);
};

bc = new BroadcastChannel("bc");

bc.request = request.bind(bc);

bc.response = response.bind(bc);

bc.onmessage = onmessage;

scope.index = function(any) {
  var i;
  if (-1 === (i = this.indexOf(any))) {
    i += this.push(any);
  }
  return i;
};

fns = {
  window: function() {
    var CPU, PU;
    Atomics.or(this.registerBuffer(new SharedArrayBuffer(4024)), 0, plen);
    PU = Window.malloc();
    CPU = Worker.malloc();
    CPU.parent = PU;
    log(PU);
    return log(CPU);
  },
  //@createWorker name: "memory"
  //@createWorker name: "display"
  memory: function() {
    return this.malloc = function(options) {
      return Atomics.add(i32, 0, options.byteLength);
    };
  },
  display: function() {
    log("display ready");
    return setTimeout(() => {
      var byteOffset;
      byteOffset = emit("malloc", {
        byteLength: 64
      });
      log("mallocated:", byteOffset);
      byteOffset = emit("malloc", {
        byteLength: 64
      });
      return log("mallocated:", byteOffset);
    }, 1000);
  },
  registerBuffer: function(buffer) {
    dvw = new DataView(buffer);
    ui8 = new Uint8Array(buffer);
    u32 = new Uint32Array(buffer);
    f32 = new Float32Array(buffer);
    return i32 = new Int32Array(buffer);
  },
  createWorker: function(options) {
    var worker;
    worker = new Worker(src, options);
    worker.name = options.name;
    worker.offset = Atomics.add(i32, 0, 1024);
    worker.request = request.bind(worker);
    worker.onmessage = onmessage.bind(worker);
    return worker.request("setup", {
      buffer: dvw.buffer,
      offset: worker.offset
    });
  },
  setup: function(options) {
    var begin, offset;
    this.registerBuffer(options.buffer);
    begin = .25 * (offset = options.offset);
    thread = i32.subarray(begin, begin + 1024);
    lock = Atomics.wait.bind(Atomics, i32, begin, 0);
    return 1;
  }
};

warn("i am online:", name);

setTimeout(fns[name].bind(fns));
