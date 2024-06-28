var device, nos;

import Pointer from "../raw.js";

nos = new BroadcastChannel("nos");

nos.addEventListener("message", function({data}) {
  return console.log(data);
});

nos.drivers = {
  methods: {
    postMessage: function(data) {
      var dev, i, len, m, ref, results;
      dev = nos[data.from];
      ref = data.args;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        m = ref[i];
        results.push(nos.drivers[m] = dev);
      }
      return results;
    }
  }
};

device = function(name) {
  var dev;
  dev = new Worker(`${name}/driver.js`, {name});
  dev.addEventListener("message", function({data}) {
    return nos.drivers[data.call].postMessage({...data, ...{
        from: this.name
      }});
  });
  return nos[name] = Object.defineProperties(dev, {
    name: {
      value: name
    }
  });
};

export default {device};
