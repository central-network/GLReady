uc = new SharedWorker('uc-sharedworker.js');
uc.port.start()

uc.port.addEventListener "message", ({ data }) ->
    for key, val of data
        localStorage.setItem key, val 
    location.reload on

requestIdleCallback ->
    uc.port.postMessage {
        eTag: localStorage.eTag
        lastModify: localStorage.lastModify
        modifyCount: localStorage.modifyCount * 1
    }
