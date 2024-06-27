class Pointer   extends Number
class Window    extends Pointer
class Worker    extends Pointer
class Method    extends Pointer
class Request   extends Pointer

{ log, warn, error } = console
[ iLE, dvw, ui8, i32, u32, f32, i16, u16 ] = [1]
[ wait, scope, thread, lock, plen ] = [ {}, [0], -1, ->, 24 ]

getByteLength = ( ptri = this ) -> dvw.getInt32 ptri - 24, iLE 
getScopeIndex = ( ptri = this ) -> dvw.getInt32 ptri - 20, iLE 

getParentPtri = ( ptri = this ) -> dvw.getInt32 ptri - 16, iLE 
setParentPtri = ( ptri , ptrj ) -> dvw.setInt32 ptri - 16, ptrj, iLE 


Object.defineProperties Pointer,

    byteLength   :
        writable : 1
        value    : 0

    of          : value : ( byteOffset ) ->
        byteOffset && new scope[ getScopeIndex byteOffset ] byteOffset

    malloc      : value : ( byteLength = 0 ) ->
        byteLength += @byteLength 
        ptri = plen + Atomics.add i32, 0, byteLength + plen

        dvw.setInt32 ptri - 24, byteLength, iLE
        dvw.setInt32 ptri - 20, scope.index( this ), iLE

        new this ptri

Object.defineProperties Pointer::,

    byteLength  : get   : getByteLength

    scopeIndex  : get   : getScopeIndex
    
    children    : 
        get     : ->
            ptrs = []

            last = Atomics.load i32
            ptri = +this
            ptrj = plen * 2

            while ptrj < last
                if  0 is ptri - getParentPtri ptrj
                    ptrs[ ptrs.length ] = Pointer.of ptrj
                ptrj += plen + getByteLength ptrj

            ptrs

    parent      :
        get     : -> Pointer.of getParentPtri this
        set     : -> setParentPtri this, arguments[0] ; this

    subarray    : get   : ( TypedArray = Uint32Array ) -> new TypedArray(
        dvw.buffer, this, @byteLength / TypedArray.BYTES_PER_ELEMENT )


Window.byteLength += 4
Worker.byteLength += 12

onmessage = ({ data }) ->
    
    if  done = wait[ data.time ]
        done data.result
        delete wait[ data.time ]
        return 0
    
    if  func = fns[ data.func ]
        result = await func.apply fns, data.args
        @response data.time, result
        return 0

request = ( func, ...args ) -> new Promise ( done ) =>
    wait[ time = Date.now() ] = done 
    @postMessage { func, args, from: self.name, with: @name, time }

response = ( time, result ) ->
    @postMessage { time, result }

emit = ( func, ...args ) ->
    log "locked", name, lock 

    warn lock()
    log "unlocked", name 

bc = new BroadcastChannel "bc"
bc.request = request.bind bc
bc.response = response.bind bc
bc.onmessage = onmessage

scope.index = ( any ) ->
    if -1 is i = @indexOf any
        i += @push any
    i

fns =
    window  : ->
        Atomics.or @registerBuffer(
            new SharedArrayBuffer 4024
        ), 0, plen

        PU = Window.malloc()
        CPU = Worker.malloc() 

        CPU.parent = PU

        log PU
        log CPU



        #@createWorker name: "memory"
        #@createWorker name: "display"

    memory  : ->

        @malloc = ( options ) ->
            Atomics.add i32, 0, options.byteLength

    display : ->
        log "display ready" 

        setTimeout =>
            byteOffset = emit( "malloc", { byteLength: 64 } )
            log "mallocated:", byteOffset

            byteOffset = emit( "malloc", { byteLength: 64 } )
            log "mallocated:", byteOffset
        , 1000

    registerBuffer : ( buffer ) ->
        dvw = new DataView      buffer
        ui8 = new Uint8Array    buffer
        u32 = new Uint32Array   buffer
        f32 = new Float32Array  buffer
        i32 = new Int32Array    buffer

    createWorker : ( options ) ->
        worker = new Worker( src, options )
        worker . name = options.name
        worker . offset = Atomics.add i32, 0, 1024
        worker . request = request.bind( worker )
        worker . onmessage = onmessage.bind( worker )
        worker . request "setup", {
            buffer : dvw.buffer
            offset : worker.offset
        }

    setup : ( options ) ->
        @registerBuffer options.buffer
        begin = .25 * ( offset = options.offset )
        thread = i32.subarray begin, begin + 1024
        lock = Atomics.wait.bind Atomics, i32, begin, 0
        1

warn "i am online:", name
setTimeout fns[ name ].bind( fns )