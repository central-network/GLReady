var onconnect;

onconnect = function({
    ports: [port]
  }) {
  port.addEventListener("message", function({
      data: localStorage
    }) {
    var check;
    check = function() {
      return fetch("second.js", {
        method: 'HEAD'
      }).then(function(r) {
        var eTag, lastETag, lastModify, modifyCount, time;
        time = r.headers.get("Last-Modified");
        eTag = r.headers.get("Etag");
        lastETag = localStorage.eTag;
        lastModify = localStorage.lastModify;
        if (!(modifyCount = Number(localStorage.modifyCount))) {
          modifyCount = 0;
        }
        if ((time !== lastModify) || (eTag !== lastETag)) {
          localStorage.eTag = eTag;
          localStorage.lastModify = time;
          localStorage.modifyCount += 1;
          if (0 === localStorage.modifyCount % 2) {
            port.postMessage(localStorage);
          }
        }
        return setTimeout(check, 50);
      }).catch(function() {
        return setTimeout(check, 250);
      });
    };
    return setTimeout(check, 1000);
  });
  return port.start();
};
