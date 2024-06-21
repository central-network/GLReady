#`import font from "./ibmplex.json" with { type: "json" }`
#sessionStorage.setItem "font", JSON.stringify font
###
fontToTriangles = ->
            for charCode, vertices of font
                length = vertices.length

                i = 0
                j = -3

                triangles = new Float32Array length * (9/6)
                
                while i < length
                    
                    p0 = vertices.slice i, i += 3
                    triangles.set p0, j += 3
                    triangles.set p0, j + 9
                    
                    p1 = vertices.slice i, i += 3
                    triangles.set p1, j += 3
                    
                    p2 = vertices.slice i, i += 3
                    triangles.set p2, j += 3
                    triangles.set p2, j + 6
                    
                    p3 = vertices.slice i, i += 3
                    triangles.set p3, j += 3

                font[charCode] = Array.from triangles

            sessionStorage.setItem "font", JSON.stringify font
            localStorage.setItem "font", JSON.stringify font
###

#fetch("test.dump").then( (r) -> r.blob() ).then( (b) -> b.arrayBuffer() ).then (udp) -> 
#    sessionStorage.setItem "dump", new Uint8Array( udp ).join(" ")

#import "./uc-worker.js"

{log,warn,error} = console



window.addEventListener "error", log
window.addEventListener "messageerror", log
window.addEventListener "unhandledrejection", log


font = JSON.parse sessionStorage.font
dump = Uint8Array.from sessionStorage.dump.split " "

delay = -> new Promise (done) =>
    setTimeout done, arguments[0] or 1000

Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI
    randBit         : value : -> Number Math.random() > 0.5
    powsum          : value : ( arr, pow = 2 ) ->
        [ ...arr ].flat().reduce (a, b) -> a + Math.pow b, pow

iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1

Object.defineProperties DataView::,
    bind            : value : ( object, property, byteOffset, TypedArray, callback ) ->

        caller = TypedArray.name.split("Array").at(0)
        getter = this[ "get#{caller}" ].bind this, object.byteOffset + byteOffset, iLE
        setter = this[ "set#{caller}" ].bind this, object.byteOffset + byteOffset
        
        unless typeof callback is "function"
            Object.defineProperty object, property, {
                get : getter, set : ( val ) ->
                    setter val, iLE 
            }

        else
            Object.defineProperty object, property, {
                get : getter, set : ( val ) ->
                    setter val, iLE
                    callback.call this, val
            }

        return this

do ->    

    class M4 extends Float32Array

        #? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html

        Object.defineProperty this, "Identity", value : ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                0,  0,  0,  1,
            ] 

        Object.defineProperty this::, "position", get : ->
            @subarray 12, 15
        
        @Camera     : class Camera extends this
            constructor : ( yFov, rAspect, zNear, zFar ) ->

                f = Math.tan Math.PI/2 - yFov/2
                rangeInv = 1.0 / ( zNear - zFar )

                super [
                    f / rAspect,   0,                             0,    0,
                    0,             f,                             0,    0,
                    0,             0,     (zNear + zFar) * rangeInv,   -1,
                    0,             0, (zNear * zFar) * rangeInv * 2,    0
                ]

        @fromVec3   = ( vec3 ) ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                ... vec3,  1,
            ]

        modifyVertex : ( vertex ) ->
            vertex.position.set M4.multiply(
                this, M4::translation ...vertex
            ).position

        multiply    : ( b ) -> @set( M4.multiply @, b ); this

        @multiply   = ( a, b ) ->
            a00 = a[0 * 4 + 0]; a01 = a[0 * 4 + 1]; a02 = a[0 * 4 + 2]; a03 = a[0 * 4 + 3]
            a10 = a[1 * 4 + 0]; a11 = a[1 * 4 + 1]; a12 = a[1 * 4 + 2]; a13 = a[1 * 4 + 3]
            a20 = a[2 * 4 + 0]; a21 = a[2 * 4 + 1]; a22 = a[2 * 4 + 2]; a23 = a[2 * 4 + 3] 
            a30 = a[3 * 4 + 0]; a31 = a[3 * 4 + 1]; a32 = a[3 * 4 + 2]; a33 = a[3 * 4 + 3]

            b00 = b[0 * 4 + 0]; b01 = b[0 * 4 + 1]; b02 = b[0 * 4 + 2]; b03 = b[0 * 4 + 3] 
            b10 = b[1 * 4 + 0]; b11 = b[1 * 4 + 1]; b12 = b[1 * 4 + 2]; b13 = b[1 * 4 + 3] 
            b20 = b[2 * 4 + 0]; b21 = b[2 * 4 + 1]; b22 = b[2 * 4 + 2]; b23 = b[2 * 4 + 3] 
            b30 = b[3 * 4 + 0]; b31 = b[3 * 4 + 1]; b32 = b[3 * 4 + 2]; b33 = b[3 * 4 + 3]
            
            new M4 [
                b00 * a00 +  b01 * a10 +  b02 * a20 +  b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
            ]

        translation : ( tx = 0, ty = 0, tz = 0 ) ->
            [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                tx, ty, tz,  1,
            ]

        xTranslation : ( tx = 0 ) ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                tx,  0,  0,  1,
            ]

        yTranslation : ( ty = 0 ) ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                0, ty,  0,  1,
            ]

        zTranslation : ( tz = 0 ) ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                0,  0, tz,  1,
            ]

        xRotation   : ( angleInRadians = 0 ) ->
            c = Math.cos angleInRadians
            s = Math.sin angleInRadians

            new M4 [
                1,  0,  0,  0,
                0,  c,  s,  0,
                0, -s,  c,  0,
                0,  0,  0,  1,
            ]

        yRotation   : ( angleInRadians = 0 ) ->
            c = Math.cos angleInRadians
            s = Math.sin angleInRadians
            
            new M4 [
                c,  0, -s,  0,
                0,  1,  0,  0,
                s,  0,  c,  0,
                0,  0,  0,  1,
            ]

        zRotation   : ( angleInRadians = 0 ) ->
            c = Math.cos angleInRadians
            s = Math.sin angleInRadians
            
            new M4 [
                c,  s,  0,  0,
                -s,  c,  0,  0,
                0,  0,  1,  0,
                0,  0,  0,  1,
            ]

        scaling     : ( sx, sy, sz ) ->
            sz ?= ( sy ?= ( sx ?= 1 ) ) 
            new M4 [
                sx, 0,  0,  0,
                0, sy,  0,  0,
                0,  0, sz,  0,
                0,  0,  0,  1,
            ]

        translate   : ( tx, ty, tz ) ->
            @multiply @translation tx, ty, tz

        rotate      : ( rx, ry, rz ) ->
            this
                .xRotate rx
                .yRotate ry
                .zRotate rz
        
        scale       : ( sx, sy, sz ) ->
            @multiply @scaling sx, sy, sz
            
        xRotate     : ( rx ) ->
            @multiply @xRotation rx
        
        yRotate     : ( ry ) ->
            @multiply @yRotation ry

        zRotate     : ( rz ) ->
            @multiply @zRotation rz

            
        xTranslate  : ( tx ) ->
            @multiply @xTranslation tx
        
        yTranslate  : ( ty ) ->
            @multiply @yTranslation ty

        zTranslate  : ( tz ) ->
            @multiply @zTranslation tz

    class UX extends EventTarget

        @byteLength : 256
    
        #don't split in/out, no need to check is reached top
        linearInOut : ( v ) -> [ ...[ 0 ... 10 ], ...[ 10 .. 0 ] ].map (d) -> v * d/10
    
        constructor : ( canvas, buffer = new ArrayBuffer 80 * 4 ) ->
            super()

            if  buffer instanceof M4
                matrix = buffer
                buffer = new ArrayBuffer 80 * 4
                byteOffset = 0

            else
                matrix = new M4
                if !isNaN buffer.byteOffset
                    { buffer, byteOffset } = buffer
                else byteOffset = 0
    
            @events = events = new Uint32Array buffer, byteOffset, 24       #? 96 bytes
            @values = values = new Float32Array buffer, byteOffset + 96, 14    #? 56 bytes

            Object.defineProperties this,

                matrix      :
                    value   : matrix
    
                press       : 
                    set     : ->
                        events[ @click = arguments[ 0 ] ] = 1
    
                release     : 
                    set     : -> events[ arguments[ 0 ] ] = 0
    
                rotating    :
                    get     : -> @looking and events[ 0 ]
    
                draging     :
                    get     : -> @looking and events[ 2 ]
    
                running     :
                    get     : ->  @moving and @shift
    
                offsetX     :
                    set     : ->
                        @dx = -@x + (@x = arguments[ 0 ])
                        @ry = ( - @dx / 100 ) % Math.PI
    
                offsetY     :
                    set     : ->
                        @dy = +@y - (@y = arguments[ 0 ])
                        @rx = ( - @dy / 100 ) % Math.PI
    
                deltaX      :
                    set     : ->
                        @sx = ( arguments[ 0 ] )
    
                deltaY      :
                    set     : ->
                        @sz = ( @sy = arguments[ 0 ] ) / 10

                        viewMatrix.dz = Math.max( -300, Math.min(
                            300, viewMatrix.dz + @sz ) )

                        @matrix.upload()

    
                moving      :
                    get     : -> events[ 12 ]
                    set     : -> events[ 12 ] = arguments[ 0 ]
    
                jumping     :
                    get     : -> events[ 19 ]
                    set     : -> events[ 19 ] = arguments[ 0 ]
    
                shift       :
                    get     : -> events[ 20 ]
                    set     : -> events[ 20 ] = arguments[ 0 ]
    
                alt         :
                    get     : -> events[ 21 ]
                    set     : -> events[ 21 ] = arguments[ 0 ]
    
                ctrl        :
                    get     : -> events[ 22 ]
                    set     : -> events[ 22 ] = arguments[ 0 ]
    
                meta        :
                    get     : -> events[ 23 ]
                    set     : -> events[ 23 ] = arguments[ 0 ]
    
                forward     :
                    get     : -> events[ 13 ]
                    set     : -> events[ 13 ] = arguments[ 0 ]
    
                backward    :
                    get     : -> events[ 14 ]
                    set     : -> events[ 14 ] = arguments[ 0 ]
    
                left        :
                    get     : -> events[ 15 ]
                    set     : -> events[ 15 ] = arguments[ 0 ]
    
                right       :
                    get     : -> events[ 16 ]
                    set     : -> events[ 16 ] = arguments[ 0 ]
    
                up          :
                    get     : -> events[ 17 ]
                    set     : -> events[ 17 ] = arguments[ 0 ]
    
                down        :
                    get     : -> events[ 18 ]
                    set     : -> events[ 18 ] = arguments[ 0 ]
    
                looking     :
                    get     : -> events[ 11 ]
                    set     : -> events[ 11 ] = arguments[ 0 ]
                    
                zooming     :
                    get     : -> events[ 10 ]
                    set     : -> events[ 10 ] = arguments[ 0 ]
    
                dblclick    :
                    get     : -> events[  9 ]
                    set     : -> events[  9 ] = arguments[ 0 ]
    
                click       :
                    get     : -> events[  8 ]
                    set     : -> events[  8 ] = arguments[ 0 ]
    
                x           :
                    get     : -> values[  0 ]
                    set     : -> values[  0 ] = arguments[ 0 ]
                        
                dx          :
                    get     : -> values[  1 ]
                    set     : ( dx ) ->
                        values[ 1 ] = dx

                        if  @draging
                            matrix.dx += dx
                            @matrix.upload()

                dy          :
                    get     : -> values[ 6 ]
                    set     : ( dy ) ->
                        values[ 6 ] = dy

                        if  @draging
                            matrix.dy += dy
                            @matrix.upload()
                        
                sx          :
                    get     : -> values[  3 ]
                    set     : -> values[  3 ] = arguments[ 0 ]
                        
                vx          :
                    get     : -> values[  4 ]
                    set     : ( vx ) ->
                        values[ 4 ] = vx

                        
                y           :
                    get     : -> values[  5 ]
                    set     : -> values[  5 ] = arguments[ 0 ]
                        


                rx          :
                    get     : -> values[ 2 ]
                    set     : ( rx ) ->
                        values[ 2 ] = rx
                        
                        if  @rotating
                            matrix.rx += rx
                            @matrix.upload()
                        

                ry          :
                    get     : -> values[ 7 ]
                    set     : ( ry ) ->
                        values[ 7 ] = ry

                        if  @rotating
                            matrix.ry -= ry
                            @matrix.upload()

                        
                sy          :
                    get     : -> values[  8 ]
                    set     : -> values[  8 ] = arguments[ 0 ]
                        
                vy          :
                    get     : -> values[  9 ]
                    set     : -> values[  9 ] = arguments[ 0 ]
                    
                sz          :
                    get     : -> values[ 10 ]
                    set     : -> values[ 10 ] = arguments[ 0 ]
                    
                dz          :
                    get     : -> values[ 11 ]
                    set     : -> values[ 11 ] = arguments[ 0 ]
                        
                factor      :
                    get     : -> values[ 12 ]
                    set     : -> values[ 12 ] = arguments[ 0 ]
    
                time        :
                    get     : -> values[ 13 ]
                    set     : ->
                        events.fill( 0, 8, 12 )
                        values[ 13 ] = arguments[ 0 ]
    
            window.addEventListener "pointerup",    @pointerup.bind @
            window.addEventListener "pointermove",  @pointermove.bind( @ ), passive: !0
            window.addEventListener "pointerdown",  @pointerdown.bind @
            window.addEventListener "dblclick",     @doubleclick.bind @
            window.addEventListener "wheel",        @wheel.bind( @ ), passive: !0
            window.addEventListener "contextmenu",  @contextmenu.bind @
            
            document = canvas.ownerDocument
            document.addEventListener "keyup",      @keyup.bind @
            document.addEventListener "keydown",    @keydown.bind @ 

            @factor = 5
                
            null

        e           : -> this

        wheel       : ( e ) -> @e({ @deltaX    , @deltaY  } = e ).zooming = 1
        pointermove : ( e ) -> @e({ @offsetX   , @offsetY } = e ).looking = 1
        pointerup   : ( e ) -> @e(  @release   = e.button )
        doubleclick : ( e ) -> @e(  @dblclick  = e.button )
        pointerdown : ( e ) -> @e(  @press     = e.button )
    
        contextmenu : ( e ) -> e.preventDefault()
        keydown     : ( e ) ->
            switch e.code 
                when "KeyW", "ArrowUp"      then @forward   = 1
                when "KeyS", "ArrowDown"    then @backward  = 1
                when "KeyA", "ArrowLeft"    then @right     = 1
                when "KeyD", "ArrowRight"   then @left      = 1
                when "Space"                then @up        = 1
            
            if  @forward or @backward or @right or @left
                @moving = 1
    
            if  @up
                @jumping = 1
    
            @move e
    
        keyup       : ( e ) ->
            switch e.code
                when "KeyW", "ArrowUp"      then @forward   = 0
                when "KeyS", "ArrowDown"    then @backward  = 0
                when "KeyA", "ArrowLeft"    then @right     = 0
                when "KeyD", "ArrowRight"   then @left      = 0
                when "Space"                then @up        = 0
    
            if !@forward and !@backward and !@right and !@left
                @moving = 0
    
            if !@up 
                @jumping = 0
    
            @move e
    
        move        : ( e ) ->
            @shift   = e.shiftKey
            @alt     = e.altKey
            @meta    = e.metaKey
            @ctrl    = e.ctrlKey
    
            @vy = if @up then -1 else 0 
    
            [ @vx, @dz ] = if @right
    
                if @forward then [ +1, +1 ]
                else if @backward then [ +1, -1 ]
                else [ +1, 0 ]
    
            else if @left
    
                if @forward then [ -1, +1 ]
                else if @backward then [ -1, -1 ]
                else [ -1, 0 ]
    
            else if @backward then [ 0, -1 ]
            else if @forward then [ 0, +1 ]
    
            else [ 0, 0 ]
    
            factor = @factor
            factor *= 2 if @running
    
            @vx *= factor
            @dz *= factor
            @vy *= @factor
    
            0
    
    class TCPSocket

        @PROTOCOL   : "ws#{location.protocol.at(-2)}:" 

        constructor : ( host, port, protocol = TCPSocket.PROTOCOL ) ->
            
            script = @script.toString().replace(
                "$wsurl", "#{protocol}//#{host}:#{port}"
            )
            

            object = @object "(function #{script})()"

            try
                worker = new Worker object

                worker.addEventListener "error", log
                worker.addEventListener "onmessageerror", log
                worker.addEventListener "message", ({ data }) =>
                    @onmessage data if data.byteLength

            catch e then log e

        onmessage   : -> this

        object      : ( script ) ->
            blob = new Blob [ script ], { type: "application/javascript" }
            ourl = URL.createObjectURL blob, { type: "application/javascript" }

            ourl

            
        script      : ->
            #console.log "init"

            self.addEventListener "error", -> true
            self.addEventListener "unhandledrejection", -> true

            connect = ->
                #console.log "bind"
                
                try ws = new WebSocket "$wsurl"
                catch e then setTimeout connect, 3000                
                return unless typeof ws isnt "undefined"

                Object.assign ws, {
                    onopen      : -> #console.warn "open"
                    onerror     : -> #console.log "fail"
                    onclose     : -> setTimeout connect, 3000
                    onmessage   : ({ data }) ->
                        data.arrayBuffer().then self.postMessage
                }

                ws

            try connect()


    ux = null
    ws = null
    gl = document.getElementById("gl").getContext "webgl2"

    renderQueue = []

    program = gl.createProgram()
    vshader = gl.createShader gl.VERTEX_SHADER
    fshader = gl.createShader gl.FRAGMENT_SHADER

    gl.shaderSource vshader, document.getElementById( "vshader" ).text
    gl.shaderSource fshader, document.getElementById( "fshader" ).text

    gl.compileShader vshader
    gl.compileShader fshader

    gl.attachShader program, vshader
    gl.attachShader program, fshader

    gl.linkProgram program
    gl.useProgram program

    arrClearColor   = Float32Array.of 0.05, .2, 0.3, 1
    backgroundColor = arrClearColor.slice(0,3).map( (i) -> i * 0xff ).join " "
    document.body.style.backgroundColor = "rgb(#{backgroundColor})"

    pointCount = 0
    instanceCount = 0
    verticesOffset = 0

    verticesBufferArray  = new Float32Array new ArrayBuffer 1e8
    instancesBufferArray = new Float32Array new ArrayBuffer 1e7

    bindBufferInstances = gl.bindBuffer.bind gl, gl.ARRAY_BUFFER, gl.createBuffer()
    bindBufferInstances()
    gl.bufferData gl.ARRAY_BUFFER, instancesBufferArray.byteLength, gl.DYNAMIC_READ

    bindBufferVertices  = gl.bindBuffer.bind gl, gl.ARRAY_BUFFER, gl.createBuffer()
    bindBufferVertices()
    gl.bufferData gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW


    a_Position      = gl.getAttribLocation  program, 'a_Position'
    a_Vertices      = gl.getAttribLocation  program, 'a_Vertices'
    a_Color         = gl.getAttribLocation  program, "a_Color"
    u_ViewMatrix    = gl.getUniformLocation program, "u_ViewMatrix"

    viewMatrix      = new M4.Camera 90, innerWidth/innerHeight, 0.1, 1e5
    
    glClearColor    = gl.clearColor.apply.bind gl.clearColor, gl, arrClearColor
    glClear         = gl.clear.bind gl, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT

    Object.defineProperty verticesBufferArray, "malloc", value : ( array ) ->    

        pointCount  = array.length / 3
        length      = array.length
        
        byteOffset  = verticesOffset
        byteLength  = length * 4

        begin       = byteOffset / 4
        subarray    = @subarray begin, begin + length

        verticesOffset =
            byteLength + verticesOffset

        subarray.set array

        bindBufferVertices()

        gl.bufferSubData(
            gl.ARRAY_BUFFER, byteOffset,
            verticesBufferArray, begin, length
        )

        Object.defineProperties subarray,
            start : value : byteOffset / 12
            count : value : pointCount

        ( (vertices) ->
            cloneCount = 1
            Object.defineProperties vertices, instance : value : ( instance ) ->
                Object.defineProperties instance,
                    globalInstanceIndex : value : instanceCount++
                    modelInstanceIndex : value : cloneCount++                
        )(subarray)
                        
        subarray

    Object.defineProperties viewMatrix,
        dx: { writable:1, value: 0 },
        dy: { writable:1, value: 0 },
        dz: { writable:1, value: -5 },
        
        rx: { writable:1, value: 0 },
        ry: { writable:1, value: 0 },
        rz: { writable:1, value: 0 },

        sx: { writable:1, value: 1 },
        sy: { writable:1, value: 1 },
        sz: { writable:1, value: 1 },
        
        location : value : gl.getUniformLocation( program, "u_ViewMatrix" )
        toJSON   : value : -> JSON.stringify { @dx,@dy,@dz, @rx,@ry,@rz, @sx,@sy,@sz }
        store    : value : -> sessionStorage.viewMatrix = @toJSON() ; 0
        restore  : value : -> Object.assign( @, JSON.parse sessionStorage.viewMatrix ).upload()
        reset    : value : -> sessionStorage.removeItem "viewMatrix"
        upload   : value : ->
            
            matrix = @slice()
                .translate @dx, @dy, @dz
                .rotate @rx, @ry, @rz
                .scale @sx, @sy, @sz

            gl.uniformMatrix4fv @location, no, matrix
            
            @store()


    class Instance extends Number
        @byteLength : 24

    class Model extends Number
        @byteLength : 24

        clone : ( reference ) ->

            instance = new Instance @d3.addItemsByteLength 28
            instance.model = this

            log this.next

            if  next = @next

                begin = next.pointersBegin
                length = @d3.getPointersLength() - begin

                @d3.attributes.copyWithin(
                    begin + 7, begin, length
                )

                while next
                    next.pointersBegin += 7                            
                    next = next.next  

            @d3.addPointer()
            
            instance.pointerOffset = (
                @instanceCount * 28 + 
                @pointersBegin * 4
            )

            @instanceCount++ 

            instance 

    class Position extends Float32Array
        @byteLength : 12

    class Color extends Float32Array
        @byteLength : 16

    Object.defineProperties Position::,
        x :
            get : -> @[0]
            set : -> @[0] = arguments[0]
        y :
            get : -> @[1]
            set : -> @[1] = arguments[0]
        z :
            get : -> @[2]
            set : -> @[2] = arguments[0]

    Object.defineProperties Color::,
        r :
            get : -> @[0]
            set : -> @[0] = arguments[0]
        g :
            get : -> @[1]
            set : -> @[1] = arguments[0]
        b :
            get : -> @[2]
            set : -> @[2] = arguments[0]
        a :
            get : -> @[3]
            set : -> @[3] = arguments[0]

    Object.defineProperties Model::,
        dstByteOffset  :
            get : -> d3.items.getUint32 this + 4, iLE
            set : -> d3.items.setUint32 this + 4, arguments[0], iLE

        pointersBegin  :
            get : -> d3.items.getUint32 this + 8, iLE
            set : ( begin ) ->
                for instance, i in @instances
                    instance.pointerOffset = begin * 4 + i * 28
                d3.items.setUint32 this + 8, begin, iLE

        instanceCount :
            get : -> d3.items.getUint32 this + 12, iLE
            set : -> d3.items.setUint32 this + 12, arguments[0], iLE

        drawStart   :
            get : -> d3.items.getUint32 this + 16, iLE
            set : -> d3.items.setUint32 this + 16, arguments[0], iLE

        drawCount   :
            get : -> d3.items.getUint32 this + 20, iLE
            set : -> d3.items.setUint32 this + 20, arguments[0], iLE

        index       :
            get : -> d3.items.getUint32 this + 24, iLE
            set : -> d3.items.setUint32 this + 24, arguments[0], iLE

        next        : get : -> 
            next = @index + 1
            return null if next >= @d3.vertices.length
            

            stride = 24
            offset = this
            length = @d3.getItemsByteOffset()


            while length > offset += 28
                warn { offset }, @d3.items.getUint32 offset + stride, iLE
                unless next - @d3.items.getUint32 offset + stride, iLE
                    return new Model offset
                    
            return null

        instances   : get : -> 
            return [] unless count = @instanceCount
            
            instances       = []
            thisOffset      = +this  
            modelStride     = 8                
            lookingOffset   = @d3.getItemsByteOffset()
            
            while count
                while thisOffset < lookingOffset -= 28
                    unless thisOffset - @d3.items.getUint32 lookingOffset + modelStride, iLE
                        instances[ --count ] = new Instance lookingOffset

            instances   


    Object.defineProperties Instance::,
        modelOffset :
            get : -> @pointerOffset - @model.pointersBegin * 4

        pointerOffset :
            get : -> d3.items.getUint32 this + 4, iLE
            set : -> d3.items.setUint32 this + 4, arguments[0], iLE

        model :
            get : -> new Model d3.items.getUint32 this + 8, iLE
            set : -> d3.items.setUint32 this + 8, arguments[0], iLE

        x : value : -> return if !arguments.length then @position[0] else @position[0] = arguments[0]
        y : value : -> return if !arguments.length then @position[1] else @position[1] = arguments[0]
        z : value : -> return if !arguments.length then @position[2] else @position[2] = arguments[0]

        r : value : -> return if !arguments.length then @color[0] else @color[0] = arguments[0]
        g : value : -> return if !arguments.length then @color[1] else @color[1] = arguments[0]
        b : value : -> return if !arguments.length then @color[2] else @color[2] = arguments[0]
        a : value : -> return if !arguments.length then @color[3] else @color[3] = arguments[0]

        clone   : value : -> @model.clone this

        position :
            get : -> new Position d3.buffer, @byteOffset + 0, 3
            set : ( xyz = [] ) ->
                subarray = @position
                subarray[i] = v for v, i in xyz
                this

        color   :
            get : -> new Color d3.buffer, @byteOffset + 12, 4
            set : ( rgba = [] ) ->
                subarray = @color
                subarray[i] = v for v, i in rgba
                this

    Object.assign self, d3 : {
        things      : []
        buffer      : d3bufer = new ArrayBuffer 1e6 * ( 12 + 16 )
        bufferView  : new DataView d3bufer
        attributes  : new Float32Array d3bufer
        items       : new DataView new ArrayBuffer 4096 * 4 * 4
        vertices    : [,]

        verticesByteOffset      : 0
        attributesByteOffset    : 0
        attributesPerInstance   : 7

        getItemsByteOffset      : -> @items.getUint32 0, iLE
        getVerticesByteOffset   : -> @items.getUint32 4, iLE
        getPointersByteOffset   : -> @items.getUint32 8, iLE
        getPointersLength       : -> @getPointersByteOffset() / 4

        setItemsByteOffset      : -> d3.items.setUint32 0, arguments[0], iLE
        setVerticesByteOffset   : -> d3.items.setUint32 4, arguments[0], iLE
        setPointersByteOffset   : -> d3.items.setUint32 8, arguments[0], iLE

        addItemsByteLength      : ( byteLength = 0 ) ->
            byteOffset = 28 + @getItemsByteOffset()
            @setItemsByteOffset byteOffset + byteLength
            byteOffset

        addVerticesByteLength   : ( byteLength = 0 ) ->
            byteOffset = @getVerticesByteOffset()
            @setVerticesByteOffset byteOffset + byteLength
            byteOffset

        addPointer              : ->
            byteOffset = @getPointersByteOffset()
            @setPointersByteOffset byteOffset + 28
            byteOffset

        add         : ( vertices = [] ) ->

            if  -1 isnt i = @vertices.indexOf vertices
                stride = 24
                offset = 0
                length = @getItemsByteOffset()

                while length > offset += 28
                    unless i - @items.getUint32 offset + stride, iLE
                        model = new Model offset
                
            else
                model = @mallocModel vertices

            unless model then throw /MODEL_ERR/
            else return model.clone()
            
            if !thing = d3.things.find (t) -> t.vertices is vertices
                index = d3.things.length
                thing = d3.things[index] = { vertices }

                d3.things[ index-1 ].next = thing if index

                verticesByteLength      = vertices.length * 4
                verticesByteOffset      = d3.verticesByteOffset
                attributesByteOffset    = d3.attributesByteOffset

                drawStart               = verticesByteOffset / 4
                drawCount               = vertices.length / 3
                
                Object.assign thing, {
                    attributesByteOffset,
                    verticesByteLength,
                    verticesByteOffset,
                    drawStart,
                    drawCount,
                    instances : []
                }

                d3.verticesByteOffset +=
                    verticesByteLength

                Object.defineProperties thing, clone : value : ( reference ) ->

                    instance = d3.mallocInstance this

                    if  reference instanceof Instance
                        instance.color.set reference.color
                        instance.position.set reference.position

                    thing.instances[ thing.instances.length ] = instance

            instance = thing.clone()
            instance . color.set [ 1, 1, 1, 1 ]
            instance


        moveRestOffset : ( thing ) ->

            if  next = thing.next
                moveOffset = d3.attributesPerInstance * 4
                moveBegin = next.attributesByteOffset / 4
                copyLength = d3.attributesByteOffset / 4 - moveBegin

                d3.attributes.copyWithin(
                    moveBegin + d3.attributesPerInstance,
                    moveBegin , copyLength
                )

                while next

                    next.attributesByteOffset += moveOffset                            
                    nextsInstanceIndex = next.instances.length

                    while instance = next.instances[ --nextsInstanceIndex ]
                        instance.byteOffset += moveOffset
                        
                    next = next.next  
            this


        mallocModel : ( vertices ) ->
            model = new Model @addItemsByteLength 28

            model.dstByteOffset = @addVerticesByteLength vertices.length * 4
            model.drawStart     = model.dstByteOffset / 4
            model.drawCount     = vertices.length / 3
            model.index         = -1 + @vertices.push vertices

            model

        mallocInstance : ( model ) ->

            instance = new Instance @addItemsByteLength 28
            instance . byteOffset   = model.moveAttrOffset()
            instance . model        = model
            instance 
    }

    Object.defineProperty Instance::, "d3", value : d3
    Object.defineProperty Model::, "d3", value : d3

    Object.assign self, line : {

        shapes      : []

        buffer      : buf = new ArrayBuffer 1e6 * ( 12 + 16 )
        view        : new DataView buf, 0, 4096 * 4096
        attributes  : new Float32Array buf, 0, 4096 * 1024 

        a_Position  : a_Position
        a_Color     : a_Color

        zOffset     : -300


        draw        : ->

            bindBufferInstances()

            for instances, i in shapes
            
                if  instances.needsRebind
                    instances.needsRebind = 0

                    byteOffset = instances.byteOffset
                    length     = instances.length * 7
                    begin      = byteOffset / 4
                    end        = begin + length
                    
                    instances.vertexPositionPointer =
                        gl.vertexAttribPointer.bind(
                            gl, @a_Position, 3, 
                            gl.FLOAT, 0, 28, byteOffset
                        )

                    instances.vertexColorPointer =
                        gl.vertexAttribPointer.bind(
                            gl, @a_Color, 4, 
                            gl.FLOAT, 0, 28, byteOffset + 12
                        )

                    instances.drawArraysInstanced =
                        gl.drawArraysInstanced.bind(
                            gl, gl.TRIANGLES, 
                            instances.model.start,
                            instances.model.count, 
                            instances.length
                        )   

                    instances.bufferSubData =
                        gl.bufferSubData.bind(
                            gl, gl.ARRAY_BUFFER,
                            byteOffset, @attributes, begin, end
                        )                    

                if  instances.needsUpload
                    instances.needsUpload = 0
                    instances.bufferSubData()


                instances.vertexColorPointer()
                instances.vertexPositionPointer()
                instances.drawArraysInstanced()

                0

            0

        poly        : ( boxes = [], options = {} ) ->
            mode = options.mode || WebGL2RenderingContext.LINES 
            blen = boxes.length
            
            points  = []
            xPoints = []
            yPoints = []
            xBounds = []
            yBounds = []

            { r, g, b, a } = boxes.at i = 0


            while i < blen


                box = boxes[ i++ ]
                vertices = []

                if  box.mode is WebGL2RenderingContext.TRIANGLES
                    triangles = box.slice 0
                    lines = []
                    tlen = box.length
                    t = 0

                    # ...p0, ...p1, ...p2,
                    # ...p0, ...p3, ...p2

                    while t < tlen
                        p0x = triangles[t++]
                        p0y = triangles[t++]
                        p0z = triangles[t++]

                        p1x = triangles[t++]
                        p1y = triangles[t++]
                        p1z = triangles[t++]
                    
                        p2x = triangles[t++]
                        p2y = triangles[t++]
                        p2z = triangles[t++]

                        t+= 3

                        p3x = triangles[t++]
                        p3y = triangles[t++]
                        p3z = triangles[t++]

                        t+= 3

                        # ...p0, ...p1, 
                        # ...p1, ...p2,
    
                        # ...p0, ...p3, 
                        # ...p2, ...p3

                        lines.push(
                            p0x, p0y, p0z,  p1x, p1y, p1z,
                            p1x, p1y, p1z,  p2x, p2y, p2z,

                            p0x, p0y, p0z,  p3x, p3y, p3z,
                            p2x, p2y, p2z,  p3x, p3y, p3z,
                        )

                    vertices = lines.slice 0
                    lines = triangles = null

                else
                    vertices = box.slice 0

                vlen = vertices.length
                j = 0

                dx = box.attributes.x
                dy = box.attributes.y
                dz = box.attributes.z

                while j < vlen

                    x = Math.fround dx + vertices[ j++ ]
                    y = Math.fround dy + vertices[ j++ ]
                    z = Math.fround dz + vertices[ j++ ]

                    xPoints.push x if !xPoints.includes x
                    yPoints.push y if !yPoints.includes y 

                    points.push [ x, y, z ]

            xBounds[x] = [] for x in xPoints
            yBounds[y] = [] for y in yPoints

            for [ x, y ] in points
                xBounds[x].push y if !xBounds[x].includes y
                yBounds[y].push x if !yBounds[y].includes x

            for p in [ xBounds, yBounds ] then for k, v of p
                Object.defineProperty p, k, 
                    configurable: on, value : {
                        max : Math.max.apply Math, v
                        min : Math.min.apply Math, v
                    }

            [ xPoints, yPoints, points ] = []

            for x of xBounds when ! found = no  
                for y, { max, min } of yBounds
                    break if found = 0 is (min - x)
                    break if found = 0 is (max - x)
                delete xBounds[x] unless found 

            for y of yBounds when ! found = no  
                for x, { max, min } of xBounds
                    break if found = 0 is (min - y)
                    break if found = 0 is (max - y)
                delete yBounds[y] unless found 

            vertices = []

            for x , { max, min } of xBounds
                x = parseFloat x
                vertices.push( x, max, 0 )
                vertices.push( x, min, 0 )

            for y , { max, min } of yBounds
                y = parseFloat y
                vertices.push( min, y, 0 )
                vertices.push( max, y, 0 )

            length = vertices.length
            splice = []
            
            i = 0
            while i < length
                Ax0 = vertices[ i++ ]
                Ay0 = vertices[ i++ ]
                Az0 = vertices[ i++ ]

                Ax1 = vertices[ i++ ]
                Ay1 = vertices[ i++ ]
                Az1 = vertices[ i++ ]

                unless Ay0 - Ay1 # y'ler esit ise

                    AxMin = Math.min Ax0, Ax1 
                    AxMax = Math.max Ax0, Ax1 
                
                    j = 0
                    while j < length

                        Bx0 = vertices[ j++ ]
                        By0 = vertices[ j++ ]
                        Bz0 = vertices[ j++ ]

                        Bx1 = vertices[ j++ ]
                        By1 = vertices[ j++ ]
                        Bz1 = vertices[ j++ ]

                        continue if i is j
        
                        continue if Ay0 - By0 # y'ler esit olmali
                        continue if Bx0 - Bx1 # B dik bir cizgi olmali
                        
                        continue if Bx0 < AxMin # kontrol cizgimizin baslangicindan once olmamali
                        continue if Bx0 > AxMax # kontrol cizgimizin bitisinden sonra olmamali

                        # cizginin arada oldugu belli oldu
                        # simdi kesim noktasini bulalim

                        ByMin = Math.min By0, By1 
                        ByMax = Math.max By0, By1 

                        k = 0
                        while k < length
                            Cx0 = vertices[ k++ ]
                            Cy0 = vertices[ k++ ]
                            Cz0 = vertices[ k++ ]

                            Cx1 = vertices[ k++ ]
                            Cy1 = vertices[ k++ ]
                            Cz1 = vertices[ k++ ]

                            continue if j is k
                            continue if i is k

                            continue if Cy0 - Cy1 # duz bir yatay cizgi ariyoruz
                            continue if Cy0 <= ByMin # bizim altimizda olmamali 
                            continue if Cy0 >= ByMax # bizim ustumuzde olmamali 
                            
                            CxMin = Math.min Cx0, Cx1
                            CxMax = Math.max Cx0, Cx1

                            continue if CxMax < Bx0 # bizden asagida bitmemis olmali
                            continue if CxMin > Bx0 # bizden yukarida baslamamis olmali

                            # bulduk simdi B'nin y degerini C ile degistirebiliriz
                            if  CxMax > Bx0
                                vertices[ j - 5 ] = Cy0

                            else if  CxMin < Bx0
                                vertices[ j - 2 ] = Cy0

                unless Ax0 - Ax1 # x'ler esit ise

                    AyMin = Math.min Ay0, Ay1 
                    AyMax = Math.max Ay0, Ay1 
                
                    j = 0
                    while j < length

                        Bx0 = vertices[ j++ ]
                        By0 = vertices[ j++ ]
                        Bz0 = vertices[ j++ ]

                        Bx1 = vertices[ j++ ]
                        By1 = vertices[ j++ ]
                        Bz1 = vertices[ j++ ]

                        continue if i is j
        
                        continue if Ax0 - Bx0 # x'ler esit olmali
                        continue if By0 - By1 # B düz bir cizgi olmali
                        
                        continue if By0 < AyMin # kontrol cizgimizin baslangicindan yukarda olmali
                        continue if By0 > AyMax # kontrol cizgimizin bitisinden asagida olmali

                        # cizginin arada oldugu belli oldu
                        # simdi kesim noktasini bulalim

                        BxMin = Math.min Bx0, Bx1 
                        BxMax = Math.max Bx0, Bx1 

                        k = 0
                        while k < length
                            Cx0 = vertices[ k++ ]
                            Cy0 = vertices[ k++ ]
                            Cz0 = vertices[ k++ ]

                            Cx1 = vertices[ k++ ]
                            Cy1 = vertices[ k++ ]
                            Cz1 = vertices[ k++ ]

                            continue if j is k
                            continue if i is k

                            continue if Cx0 - Cx1 # duz bir dik cizgi ariyoruz
                            continue if Cx0 <= BxMin # bizim oncemizde olmamali 
                            continue if Cx0 >= BxMax # bizim sonramizda olmamali 
                            
                            CyMin = Math.min Cy0, Cy1
                            CyMax = Math.max Cy0, Cy1

                            continue if CyMax < By0 # bizden once bitmemis olmali
                            continue if CyMin > By0 # bizden sonra baslamamis olmali

                            if (CyMax is AyMax) and (CyMin is AyMin)
                                continue if (By0 is CyMin) or (By0 is CyMax)
                                vertices[ j - 6 ] = Cx0

                            if (CyMin is AyMin) and (AyMax is By0)
                                continue if (By0 is AyMin) or (By0 is CyMin)
                                vertices[ j - 3 ] = Cx0
                            

            xMax = yMax = -Infinity
            xMin = yMin = +Infinity

            i = 0; x = 0
            y = 0; z = 0

            while i < length
                dx = vertices[ i++ ]
                dy = vertices[ i++ ]
                dz = vertices[ i++ ]

                xMax = dx if dx > xMax
                xMin = dx if dx < xMin

                yMax = dy if dy > yMax
                yMin = dy if dy < yMin

            x = xMin + .5 * Math.abs xMax - xMin
            y = yMin + .5 * Math.abs yMax - yMin
            z = this . zOffset
            i = 0

            while i < length
                vertices[ i++ ] -= x 
                vertices[ i++ ] -= y 
                vertices[ i++ ]  = 0 

            # aradaki cizgileri kaldirdik

            if  mode is WebGL2RenderingContext.TRIANGLES
                triangles = []
                lines = vertices.slice 0
                llen = lines.length
                t = 0

                while t < llen
                    triangles.push p = {
                        x: lines[t++], 
                        y: lines[t++],
                        z: lines[t++],
                    }

                
                # ...p0, ...p1, ...p2,
                # ...p0, ...p3, ...p2
                t = 0
                llen = triangles.length
                while t < llen
                    p0 = triangles[t++]
                    p1 = triangles[t++]
                    p2 = triangles[t++]
                    p3 = triangles[t++]

                    triangles.push(
                        p0.x, p0.y, p0.z,
                        p1.x, p1.y, p1.z,
                        p2.x, p2.y, p2.z,

                        p0.x, p0.y, p0.z,
                        p3.x, p3.y, p3.z,
                        p2.x, p2.y, p2.z,
                    )

                vertices = triangles.slice llen
                lines = triangles = null

            poly = verticesBufferArray.malloc vertices

            length     = 7
            byteLength = length * 4
            byteOffset = @shapes.length * byteLength
            begin      = byteOffset / 4
            end        = begin + length

            bindBufferInstances()

            Object.defineProperty poly, "attributes", 
                value : @attributes.subarray begin, end
                                    
            Object.defineProperty poly, "vertexPositionPointer", 
                value : gl.vertexAttribPointer.bind(
                    gl, @a_Position, 3, 
                    gl.FLOAT, 0, byteLength, byteOffset
                )

            Object.defineProperty poly, "vertexColorPointer", 
                value : gl.vertexAttribPointer.bind(
                    gl, @a_Color, 4, 
                    gl.FLOAT, 0, byteLength, byteOffset + 12
                )

            Object.defineProperty poly, "drawArraysInstanced", 
               value : gl.drawArraysInstanced.bind(
                    gl, mode, poly.start, poly.count, 1
                )   

            Object.defineProperty poly, "bufferSubData", 
                value : gl.bufferSubData.bind(
                    gl, gl.ARRAY_BUFFER,
                    byteOffset, @attributes, begin, end
                )

            poly.attributes.set [
                x, y, z,
                r, g, b, a
            ]
    
            poly.bufferSubData()
            poly.vertexColorPointer()
            poly.vertexPositionPointer()

            renderQueue.push poly.vertexColorPointer
            renderQueue.push poly.vertexPositionPointer
            renderQueue.push poly.drawArraysInstanced

            @view.bind poly.attributes, "x",  0, Float32Array, poly.bufferSubData
            @view.bind poly.attributes, "y",  4, Float32Array, poly.bufferSubData
            @view.bind poly.attributes, "z",  8, Float32Array, poly.bufferSubData
            @view.bind poly.attributes, "r", 12, Float32Array, poly.bufferSubData
            @view.bind poly.attributes, "g", 16, Float32Array, poly.bufferSubData
            @view.bind poly.attributes, "b", 20, Float32Array, poly.bufferSubData
            @view.bind poly.attributes, "a", 24, Float32Array, poly.bufferSubData

            @shapes[ @shapes.length ] = poly
        
        rect        : ( options = {} ) ->
            { mode = WebGL2RenderingContext.LINES,
            x = 0, y = 0, z = @zOffset, 
            r = 0, g = 0, b = 0, a = 1, 
            width: w, height: h } =
                { ...options }

            h ||= w

            p0 = Float32Array.of 0, 0, 0
            p1 = Float32Array.of w, 0, 0
            p2 = Float32Array.of w, h, 0
            p3 = Float32Array.of 0, h, 0

            if  mode is WebGL2RenderingContext.LINES
                vertices = Float32Array.of(
                    ...p0, ...p1, 
                    ...p1, ...p2,

                    ...p0, ...p3, 
                    ...p2, ...p3
                )

            else if mode is WebGL2RenderingContext.TRIANGLES
                vertices = Float32Array.of(
                    ...p0, ...p1, ...p2,
                    ...p0, ...p3, ...p2
                )

            rect = verticesBufferArray.malloc vertices

            length     = 7
            byteLength = length * 4
            byteOffset = @shapes.length * byteLength
            begin      = byteOffset / 4
            end        = begin + length

            bindBufferInstances()

            Object.defineProperty rect, "mode", value : mode

            Object.defineProperty rect, "attributes", 
                value : @attributes.subarray begin, end
            
            Object.defineProperty rect, "vertexPositionPointer", 
                value : gl.vertexAttribPointer.bind(
                    gl, @a_Position, 3, 
                    gl.FLOAT, 0, byteLength, byteOffset
                )

            Object.defineProperty rect, "vertexColorPointer", 
                value : gl.vertexAttribPointer.bind(
                    gl, @a_Color, 4, 
                    gl.FLOAT, 0, byteLength, byteOffset + 12
                )

            Object.defineProperty rect, "drawArraysInstanced", 
               value : gl.drawArraysInstanced.bind(
                    gl, mode,  rect.start, rect.count, 1
                )   

            Object.defineProperty rect, "bufferSubData", 
                value : gl.bufferSubData.bind(
                    gl, gl.ARRAY_BUFFER,
                    byteOffset, @attributes, begin, end
                )

            rect.attributes . set [
                x, y, z,
                r, g, b, a
            ]

    
            rect.bufferSubData()
            rect.vertexColorPointer()
            rect.vertexPositionPointer()

            renderQueue.push rect.vertexColorPointer
            renderQueue.push rect.vertexPositionPointer
            renderQueue.push rect.drawArraysInstanced

            @view.bind rect.attributes, "x",  0, Float32Array, rect.bufferSubData
            @view.bind rect.attributes, "y",  4, Float32Array, rect.bufferSubData
            @view.bind rect.attributes, "z",  8, Float32Array, rect.bufferSubData
            @view.bind rect.attributes, "r", 12, Float32Array, rect.bufferSubData
            @view.bind rect.attributes, "g", 16, Float32Array, rect.bufferSubData
            @view.bind rect.attributes, "b", 20, Float32Array, rect.bufferSubData
            @view.bind rect.attributes, "a", 24, Float32Array, rect.bufferSubData

            Object.defineProperty rect, "boundingRect", value : ->
                length = @length
                i = 0

                xMax = yMax = zMax = -Infinity
                xMin = yMin = zMin = +Infinity

                while i < length
                    x = this[ i++ ]
                    y = this[ i++ ]
                    z = this[ i++ ]

                    xMax = x if xMax < x
                    xMin = x if xMin > x

                    yMax = y if yMax < y
                    yMin = y if yMin > y

                    zMax = z if zMax < z
                    zMin = z if zMin > z

                width   = xMax - xMin
                height  = yMax - yMin
                depth   = zMax - zMin

                xMax += @attributes.x 
                xMin += @attributes.x 
                
                yMax += @attributes.y 
                yMin += @attributes.y
                
                zMax += @attributes.z
                zMin += @attributes.z
                
                return {
                    xMax, xMin, width, 
                    yMax, yMin, height, 
                    zMax, zMin, depth
                }

            @shapes[ @shapes.length ] = rect
    }

    Object.assign self, text : {
        vertices    : font
        letters     : {}
        chars       : []

        charCount   : 0
        letterCount : 0
        byteLength  : 0
        byteOffset  : 0
        
        lineCount   : 0
        lineWidth   : 100
        lineHeight  : 10
        letterSpace : 1
        spaceWidth  : 5
        fontSize    : 12
        monospace   : on
        

        width       : -300
        height      : +300
        depth       : -200
        length      : 0
        
        buffer      : buf = new ArrayBuffer 4096 * 4096
        view        : new DataView buf 
        attributes  : new Float32Array buf

        a_Position  : a_Position
        a_Color     : a_Color

        draw        : ->

            bindBufferInstances()

            for instances, i in this.chars
            
                if  instances.needsRebind
                    instances.needsRebind = 0

                    byteOffset = instances.byteOffset
                    length     = instances.length * 7
                    begin      = byteOffset / 4
                    end        = begin + length
                    
                    instances.vertexPositionPointer =
                        gl.vertexAttribPointer.bind(
                            gl, @a_Position, 3, 
                            gl.FLOAT, 0, 28, byteOffset
                        )

                    instances.vertexColorPointer =
                        gl.vertexAttribPointer.bind(
                            gl, @a_Color, 4, 
                            gl.FLOAT, 0, 28, byteOffset + 12
                        )

                    instances.drawArraysInstanced =
                        gl.drawArraysInstanced.bind(
                            gl, gl.TRIANGLES, 
                            instances.model.start,
                            instances.model.count, 
                            instances.length
                        )   

                    instances.bufferSubData =
                        gl.bufferSubData.bind(
                            gl, gl.ARRAY_BUFFER,
                            byteOffset, @attributes, begin, end
                        )                    

                if  instances.needsUpload
                    instances.needsUpload = 0
                    instances.bufferSubData()


                instances.vertexColorPointer()
                instances.vertexPositionPointer()
                instances.drawArraysInstanced()

                0

            0

        char        : ( letter ) ->

            if !"#{letter}".trim()
                return @width += @spaceWidth

            @length      += 7
            @charCount   += 1
            @byteLength  += 28

            #@buffer.resize @byteLength

            dview = @view
            chars = @letters[ letter ] ||=
                @chars[ index = @chars.length ] =
                    new Array()

            charCode = letter.charCodeAt 0

            if !Object.hasOwn chars, "index"
                Object.defineProperties chars,

                    byteLength  :
                        get     : -> @length * 28

                    byteOffset  : { value : 0 , writable: on }
                    needsUpload : { value : 1 , writable: on }
                    needsRebind : { value : 1 , writable: on }
                    needsColor  : { value : 1 , writable: on }

                    index       : value : index
                    letter      : value : letter
                    charCode    : value : charCode
                    
                    getColor    : value : ( offset = 0 ) ->
                        dview.getFloat32 @byteOffset + offset + 12, iLE

                    setColor    : value : ( offset = 0, value ) ->
                        @needsColor = true 
                        @needsUpload = true 
                        dview.setFloat32 @byteOffset + offset + 12, value, iLE
                                            
                    getPosition : value : ( offset = 0 ) ->
                        dview.getFloat32 @byteOffset + offset, iLE

                    setPosition : value : ( offset = 0, value ) ->
                        @needsUpload = true 
                        dview.setFloat32 @byteOffset + offset, value, iLE

                    setColorAll : value : ( rgba = [] ) ->
                        vc = "rgba".split ""
                        for v, vi in rgba when c = vc[vi]
                            for ins in @ then ins[c] = v
                        
                chars.byteOffset = @byteLength - 28
                vertices = @vertices[ charCode ]
                i = vertices.length

                xMin = yMin = +Infinity
                xMax = yMax = -Infinity
                
                while i -= 3 when null isnt ival = vertices[i]
                    xMax = ival if ival > xMax 
                    yMax = ival if ival > yMax

                    xMin = ival if xMin > ival
                    yMin = ival if yMin > ival
                    
                Object.defineProperties chars,
                    charCode    : value : charCode
                    size        : value : {
                        xMax, xMin, yMax, yMin
                    }
                    width       : value : xMax + xMin
                    height      : value : yMax + yMin

                    left        : value : xMin
                    model       : value : verticesBufferArray.malloc vertices

                if  vertices.length % 3
                    throw [ MOD_TRIANGLE : letter ]

                @letterCount += 1
                
            chars[ index = chars.length ] =
                instance = chars.model.instance {}
            offset = 28 * index

            Object.defineProperty instance, "x",
                get    : chars.getPosition.bind chars, offset
                set    : chars.setPosition.bind chars, offset

            Object.defineProperty instance, "y",
                get    : chars.getPosition.bind chars, offset + 4
                set    : chars.setPosition.bind chars, offset + 4

            Object.defineProperty instance, "z",
                get    : chars.getPosition.bind chars, offset + 8
                set    : chars.setPosition.bind chars, offset + 8

            Object.defineProperty instance, "r",
                get    : chars.getColor.bind chars, offset
                set    : chars.setColor.bind chars, offset

            Object.defineProperty instance, "g",
                get    : chars.getColor.bind chars, offset + 4
                set    : chars.setColor.bind chars, offset + 4

            Object.defineProperty instance, "b",
                get    : chars.getColor.bind chars, offset + 8
                set    : chars.setColor.bind chars, offset + 8

            Object.defineProperty instance, "a",
                get    : chars.getColor.bind chars, offset + 12
                set    : chars.setColor.bind chars, offset + 12

            attributes = []

            for { byteOffset, length } in @chars
                attributes.push.apply attributes, new Float32Array(
                    @buffer, byteOffset, length * 7
                )

            @attributes.set( attributes )

            byteOffset = 0
            for instances in @chars
                instances.byteOffset    = byteOffset
                instances.needsUpload   = 1
                instances.needsRebind   = 1
                instances.needsColor    = 1
                byteOffset = byteOffset +
                    (  instances.length * 28  )    

            instance.x = if !@monospace then (
                @width + chars.left
            ) else @width + @letterSpace - chars.width/2

            instance.y = @height
            instance.z = @depth

            instance.r = 1
            instance.g = 1
            instance.b = 1
            instance.a = 1 

            @width += if !@monospace then (
                @letterSpace + chars.width 
            ) else @letterSpace * 8

            attributes = null
            instance
            
        write       : ( text, delays = 40 ) ->
            chars = []

            for char,i in "#{text}" 
                chars[i] = @char char

            for prop in "xyz".split("") then ((key) ->
                Object.defineProperty this, key, {
                    get : -> 
                        log this
                        $ = 0
                        $ = o[key] + $ for o, i in this
                        $ / i

                    set : ( v ) ->
                        $ = @[key]
                        o[key] += v - $ for o in this
                        @
                } 
            ).call(chars, prop)

            return chars
            
            if  delays > 0
                @delay = clearTimeout( @delay ) or setTimeout =>
                    chars.push @char letter for letter in "#{text}" 
                ,delays

            else for l in "#{text}" then chars.push @char l
                
            chars

    }  


    gridX = -175
    gridY = 300
    
    BYTES_PER_LINE  = 4

    bitBoxSize = ( innerWidth / 2 ) / ( BYTES_PER_LINE * 8 )
    bitsOffset = 0
    bitOffsetX = 0
    bitOffsetY = 0
    
    width    = bitBoxSize
    height   = bitBoxSize * 1.38
    bitBoxes = []

    byteDataGrid = ( bitLength = 0, options = {} ) ->
        boxes = []

        r = Math.randBit()
        g = Math.randBit()
        b = Math.random()

        if !r and !g and !b
            g = 1

        while bitLength--

            bitsOffset++

            x = bitOffsetX + gridX
            y = bitOffsetY + gridY

            boxes.push box = line.rect Object.assign options, {
                x, y, r, g, b
                width, height }
            
            if  bitsOffset % 2 is 0
                bitOffsetY += height
                bitOffsetX += width
            else
                bitOffsetY -= height

            if  bitsOffset % 32 is 0
                bitOffsetX -= width * 16
                bitOffsetY -= height * 2            

            continue

        for prop in "xyz".split("") then ((key) ->
            Object.defineProperty this, key, {
                get : -> 
                    $ = 0
                    $ = o.attributes[key] + $ for o, i in this
                    $ / i

                set : ( v ) ->
                    $ = @[key]
                    for o in this
                        o.attributes[key] += v - $
                    @
            } 
        ).call(boxes, prop)            

        bitBoxes[ bitBoxes.length ] = boxes    
    
    
    text.width += 125
    zero = text.width

    writeDHCPPacket = ( arrayBuffer ) ->

        packet = new Uint8Array arrayBuffer
        length = packet.byteLength
        offset = 0

        #do ->  
        dhcpBox =
            msgType : byteDataGrid 1 * 8, { mode: WebGL2RenderingContext.TRIANGLES }
            hwType  : byteDataGrid 1 * 8, { mode: WebGL2RenderingContext.TRIANGLES }
            hlen    : byteDataGrid 1 * 8, { mode: WebGL2RenderingContext.TRIANGLES }
            hops    : byteDataGrid 1 * 8, { mode: WebGL2RenderingContext.TRIANGLES }
            xid     : byteDataGrid 4 * 8, { mode: WebGL2RenderingContext.TRIANGLES }

        -> byteHex =
            msgType : text.write (packet[ offset++ ].toString(16)).padStart(2, "0")

        #log byteHex.msgType.x += 50
        log dhcpBox.msgType.x += 250
        log dhcpBox.msgType.y += -50
        log dhcpBox.msgType.z += -50


    init = ->

        do  ### viewport ### ->
            Object.assign( gl.canvas, {
                width : innerWidth * devicePixelRatio
                height : innerHeight * devicePixelRatio
            }).setAttribute "style", [
                "width=#{CSS.px innerWidth}"
                "height=#{CSS.px innerHeight}"
            ].join ";"

            gl.viewport( 0, 0, 
                innerWidth * devicePixelRatio, 
                innerHeight * devicePixelRatio
            )
            
        glClearColor()
        glClear()

        bindBufferInstances()

        gl.enableVertexAttribArray a_Position
        gl.vertexAttribDivisor a_Position, 1

        gl.enableVertexAttribArray a_Color
        gl.vertexAttribDivisor a_Color, 1

        bindBufferVertices()
        gl.enableVertexAttribArray a_Vertices
        gl.vertexAttribPointer(
            a_Vertices,  # location
            3,           # size (num values to pull from buffer per iteration)
            gl.FLOAT,    # type of data in buffer
            false,       # normalize
            0, # stride (0 = compute from size and type above)
            0  # offset in buffer
        )

        if !sessionStorage.viewMatrix
            viewMatrix.store() 
        viewMatrix.restore()

        self.addEventListener "keydown", ({ key }) ->
            viewMatrix.reset() if key is "Escape"

        ux = new UX gl.canvas, viewMatrix

        #await delay 3000
        #ws = new TCPSocket( "192.168.2.2", 8000, "ws:" )
        #ws . onmessage = writeDHCPPacket

        
        #writeDHCPPacket dump.slice(0, 64)
        
        


        log d3.add font[100]
        log d3.add font[101]
        log l = d3.add font[100]
        log l.model.clone()

        return 1
        log d3.add font[102]
        log d3.add font[102]
        log d3.add font[102]
        log d3.add font[100]
        log d3.add font[102]
        log d3.add font[102]
        log d3.add font[102]
        warn i = d3.add font[101]
        error i.position.x += 10
        error i.color = [1, 0.4]
        warn i.clone()
        log d3
        

    init()


    # @url https://easings.net/#easeOutBack    
    easing =

        easeOutBack     : ( x ) ->
            c1 = 1.70158 ; c3 = c1 + 1
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)

        easeInOutCirc   : ( x ) ->
            if  x < 0.5
                return (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            return (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2

        easeOutCirc     : ( x ) ->
            return Math.sqrt(1 - Math.pow(x - 1, 2))

        easeOutQuint    : ( x ) ->
            return 1 - Math.pow(1 - x, 5);
                
    self.scrollDump = ( height, step = 120, fn = "easeOutQuint" ) ->
        
        
        steps = ( l ) ->
            arr = new Float32Array step
            i = -1
            while ++i < step then arr[i] =
                easing[ fn ]( i / step ) * height + l.y
            arr
                    
        i = -1
        queueIndex = -1 + renderQueue.push ->

            if  ++i < step

                for l in text.chars then for instance in l
                    if !instance.steps
                        instance.steps = steps instance
                    instance.y = instance.steps[ i ]

                return 0

            renderQueue.splice queueIndex, 1
    
    i = 0
    j = 1

    render = ( t ) ->
        text.draw()

        job t for job in renderQueue
        requestAnimationFrame render

        j *= -1 unless ++i % 240

    render 0