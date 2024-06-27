var device, nos;

nos = new BroadcastChannel("nos");

nos.addEventListener("message", function({data}) {
  return this.methods[data.call].postMessage(data);
});

nos.methods = {};

device = function(name) {
  var dev;
  dev = new Worker(`${name}/driver.js`, {name});
  dev.name = name;
  dev.addEventListener("message", function({
      data: methods
    }) {
    var i, len, m;
    for (i = 0, len = methods.length; i < len; i++) {
      m = methods[i];
      nos.methods[m] = this;
    }
    return nos[this.name] = this;
  });
  return nos;
};

export default {device};
