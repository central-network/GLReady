var uc;

uc = new SharedWorker('uc-sharedworker.js');

uc.port.start();

uc.port.addEventListener("message", function({data}) {
  var key, val;
  for (key in data) {
    val = data[key];
    localStorage.setItem(key, val);
  }
  return location.reload(true);
});

requestIdleCallback(function() {
  return uc.port.postMessage({
    eTag: localStorage.eTag,
    lastModify: localStorage.lastModify,
    modifyCount: localStorage.modifyCount * 1
  });
});
