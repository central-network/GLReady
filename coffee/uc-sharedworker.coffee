onconnect = ({ports: [port]}) ->
    port.addEventListener "message", ({data: localStorage}) ->
        check = ->
            fetch("second.js", {method: 'HEAD'}).then (r) ->
                time = r.headers.get("Last-Modified")
                eTag = r.headers.get("Etag")

                lastETag    = localStorage.eTag
                lastModify  = localStorage.lastModify
                
                if !modifyCount = Number localStorage.modifyCount
                    modifyCount = 0

                if  (time isnt lastModify) or (eTag isnt lastETag)

                    localStorage.eTag = eTag 
                    localStorage.lastModify = time 
                    localStorage.modifyCount += 1

                    if  0 is localStorage.modifyCount % 2
                        port.postMessage localStorage
                setTimeout check, 50
            .catch -> setTimeout check, 250
        setTimeout check, 1000

    port.start();


