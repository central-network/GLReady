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

for charCode, vertices of font
    Object.defineProperty font, String.fromCharCode( charCode ),
        value : font[ charCode ]
self.font = font

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

no and do ->    

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

    self.renderQueue = [(->)]

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
    bindBufferVertices  = gl.bindBuffer.bind gl, gl.ARRAY_BUFFER, gl.createBuffer()

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

    class Instance      extends Number
        @byteLength : 28

    class Model         extends Number

        instance    : ( index ) -> 
            return null unless count = @instanceCount
            
            thisOffset      = +this  
            modelStride     = 8                
            lookingOffset   = d3.getItemsByteOffset()
            
            while count then while thisOffset < lookingOffset -= 28
                unless thisOffset - @getUint32 lookingOffset + modelStride, iLE
                    return new Instance lookingOffset if index is --count

            null  

        clone       : ( reference, linkPositions = off, linkColors = off ) ->

            d3.addPointer()

            if  next = @next
                new this.Float32Array( next.pointersOffset, 
                    d3.getPointersLength() + 7 ).copyWithin( 7, 0 )
                
            instance                = new Instance d3.mallocItem()
            instance.model          = this
            instance.pointerOffset  =
                @pointersOffset + ( 28 * @instanceCount++ )

            if  reference

                if   linkColors
                     instance.link reference.color
                else instance.color.set reference.color

                if   linkPositions
                     instance.link reference.position
                else instance.position.set reference.position

            else
                requestIdleCallback (->

                    s = if Math.random() > 0.5 then 10 else -10 
                    @color.set  [Math.random(), Math.random(),1,1]

                    @position.x = Math.random()*s
                    @position.y = Math.random()*s * 2
                    @position.z = Math.random()*-10

                    @position.upload()

                ).bind( instance )

            prev = this
            while prev = prev.prev when prev.instanceCount
                requestAnimationFrame prev.upload.bind prev

            next = this
            while next = next.next when next.instanceCount
                next.pointersOffset += 28
                requestAnimationFrame next.upload.bind next

            requestAnimationFrame @upload.bind this

            instance 

    class Attribute     extends Number
        set : ( value ) ->
            if  value instanceof @constructor
                value = value.subarray

            if  value instanceof Model
                value = value[ @label ]

            @subarray.set value
            @upload @subarray

        inherit : ( array ) ->
            length   = Math.min @length, array.length
            subarray = @subarray

            while length--
                array[ length ] +=
                    subarray[ length ]

            @upload array, on

        upload : ( array = @subarray, inheriting = off ) ->
            
            prop = @inherits and @label
            stride = @begin * 4

            for link in @links
                link.upload( array, stride )
                continue unless inheriting

                for instance in link.children
                    instance[ prop ].inherit array

            this

    Object.defineProperties Attribute::,
        subarray    : get : ->
            new this.Float32Array this + 12, @length

        links       : get : ->
            offset  = @stride + 0  
            length  = d3.getItemsByteOffset()
            attrvl  = +this    

            links = []
            while length > offset += 28
                unless attrvl - @getUint32 offset, iLE
                    links.push new Instance offset - @stride
            links

        instance    : get : ->
            offset  = @stride + 0  
            length  = d3.getItemsByteOffset()
            attrvl  = +this    
            
            while length > offset += 28
                unless attrvl - @getUint32 offset, iLE
                    return new Instance offset - @stride

            null

    class Position      extends Attribute
        stride      : 16         
        length      : 3 
        begin       : 0
        inherits    : on
        label       : "position"

    Object.defineProperties Position::,
        x           :
            get     : -> @getFloat32 this + 12, iLE
            set     : -> @setFloat32 this + 12, arguments[0], iLE

        y           :
            get     : -> @getFloat32 this + 16, iLE
            set     : -> @setFloat32 this + 16, arguments[0], iLE

        z           :
            get     : -> @getFloat32 this + 20, iLE
            set     : -> @setFloat32 this + 20, arguments[0], iLE

    class Color         extends Attribute
        stride      : 20 
        length      : 4 
        begin       : 3

    Object.defineProperties Color::,
        r           :
            get     : -> @getFloat32 this + 12, iLE
            set     : -> @setFloat32 this + 12, arguments[0], iLE

        g           :
            get     : -> @getFloat32 this + 16, iLE
            set     : -> @setFloat32 this + 16, arguments[0], iLE

        b           :
            get     : -> @getFloat32 this + 20, iLE
            set     : -> @setFloat32 this + 20, arguments[0], iLE

        a           :
            get     : -> @getFloat32 this + 24, iLE
            set     : -> @setFloat32 this + 24, arguments[0], iLE


    Object.defineProperties Model::,

        dstByteOffset       :
            get : -> @getUint32 this + 4, iLE
            set : -> @setUint32 this + 4, arguments[0], iLE

        pointersOffset      :
            get : -> @getUint32 this + 8, iLE
            set : ( byteOffset ) ->
                @setUint32 this + 8, byteOffset, iLE

                for instance in @instances
                    instance . pointerOffset = byteOffset
                    byteOffset += 28

                this

        instanceCount       :
            get : -> @getUint32 this + 12, iLE
            set : -> @setUint32 this + 12, arguments[0], iLE

        drawStart           :
            get : -> @getUint32 this + 16, iLE
            set : -> @setUint32 this + 16, arguments[0], iLE

        drawCount           :
            get : -> @getUint32 this + 20, iLE
            set : -> @setUint32 this + 20, arguments[0], iLE

        index               :
            get : -> @getUint16 this + 24, iLE
            set : -> @setUint16 this + 24, arguments[0], iLE

        renderIndex         :
            get : -> @getUint16 this + 26, iLE
            set : -> @setUint16 this + 26, arguments[0], iLE

        vertices            : get   : ->
            Float32Array.from d3.vertices[ @index ]

        bufferData          : value : ( vertices ) ->
            bindBufferVertices()

            gl.bufferSubData gl.ARRAY_BUFFER, @dstByteOffset, Float32Array.from vertices
            gl.vertexAttribPointer a_Vertices, 3, gl.FLOAT, no, 12, 0
            gl.enableVertexAttribArray a_Vertices

            this
            
        upload              : value : ->
            bindBufferInstances()

            instanceCount   = @instanceCount
            dstByteOffset   = @pointersOffset
            begin           = dstByteOffset / 4
            length          = instanceCount * 7
            
            gl.bufferSubData( gl.ARRAY_BUFFER,
                dstByteOffset, @attributes, begin, length
            )

            renderQueue.splice( @renderIndex, 1, (( p0, p1, tf, dm, op, oc, s, c, i) ->
                @vertexAttribPointer p0, 3, tf, 0, 28, op
                @vertexAttribPointer p1, 4, tf, 0, 28, oc
                @drawArraysInstanced dm, s, c, i
            ).bind( gl, 
                a_Position, a_Color, gl.FLOAT, gl.TRIANGLES
                dstByteOffset, dstByteOffset + 12, 
                @drawStart, @drawCount, instanceCount
            ))

            gl.enableVertexAttribArray a_Position
            gl.enableVertexAttribArray a_Color
            
            this

        prev                : get   : -> d3.model @index - 1

        next                : get   : -> d3.model @index + 1

        instances           : get   : -> 
            stride = 8                
            matchs = +this
            offset = 0 + stride 
            length = d3.getItemsByteOffset()

            instances = []
            while offset < length
                if  0 is matchs - @getUint32 offset, iLE
                    instances.push new Instance offset - stride
                offset += 28
            instances   

    Object.defineProperties Instance::,

        pointerOffset   :
            get : -> @getUint32 this + 4, iLE
            set : -> @setUint32 this + 4, arguments[0], iLE

        parent          :
            get : -> new Instance o if o = @getUint32 this + 12, iLE
            set : -> @setUint32 this + 12, arguments[0], iLE

        children        : get : ->
            stride = 12                
            mathcs = +this
            offset = 0 + stride
            length = d3.getItemsByteOffset()
            
            instances = []
            while offset < length
                if  0 is matchs - @getUint32 offset, iLE
                    instances.push new Instance offset - stride
                offset += 28
            instances 

        model           :
            get : -> new Model @getUint32 this + 8, iLE
            set : -> @setUint32 this + 8, arguments[0], iLE

        upload          : value : ( source, stride ) ->
            dstByteOffset = @pointerOffset

            if !source
                begin = dstByteOffset / 4
                return gl.bufferSubData gl.ARRAY_BUFFER, dstByteOffset, @attributes, begin, 7

            gl.bufferSubData gl.ARRAY_BUFFER, dstByteOffset + stride, source.slice 0
            
        clone           : value : ( linkPositions = off, linkColors = off ) ->
            @model.clone this, linkPositions, linkColors

        position        :
            get : ->
                if !offset = @getUint32 this + Position::stride, iLE
                    offset = d3.mallocItem()
                    @setUint32 this + Position::stride, offset, iLE
                new Position offset

            set : ( value ) -> @position.set value

        link            :
            value : ( instance ) ->
                if  instance instanceof Position
                    @setUint32 this + Position::stride, instance, iLE

                if  instance instanceof Color
                    @setUint32 this + Color::stride, instance, iLE

                if  instance instanceof Instance
                    @link instance.position
                    @link instance.color

                this

        color           :
            get : ->
                if !offset = @getUint32 this + Color::stride, iLE
                    offset = d3.mallocItem()
                    @setUint32 this + Color::stride, offset, iLE
                new Color offset

            set : ( value ) -> @color.set value

    Object.assign self, d3 : {

        vertices    : [null]

        getItemsByteOffset      : -> @getUint32 0, iLE
        getPointersByteOffset   : -> @getUint32 8, iLE
        getPointersLength       : -> @getPointersByteOffset() / 4

        mallocItem              : ( byteLength = 28 ) ->
            byteOffset = 28 + @getItemsByteOffset()
            @setUint32 0, byteOffset + 28, iLE
            byteOffset

        addVertices             : ( vertices ) ->
            byteOffset = @getUint32 4, iLE
            @setUint32 4, byteOffset + vertices.length * 4, iLE
            byteOffset

        addPointer              : ( byteLength = 28 ) ->
            byteOffset = @getPointersByteOffset()
            byteLength = byteLength + byteOffset

            bindBufferInstances()
            @setUint32 8, byteLength, iLE

            if !byteOffset
                gl.bufferData gl.ARRAY_BUFFER, 1e6 * 4, gl.DYNAMIC_READ
            
            byteOffset

        model                   : ( index ) ->
            return unless index

            stride = 24
            offset = stride
            length = @getItemsByteOffset()

            while offset < length
                unless index - @getUint16 offset, iLE
                    model = new Model offset - stride
                offset += 28

            model

        add                     : ( vertices ) ->
            if  @vertices.includes vertices
                model = @model @vertices.indexOf vertices
                
            else
                model = new Model @mallocItem()
                
                model.dstByteOffset  = @addVertices( vertices )
                model.index          = @vertices.push( vertices ) - 1
                model.renderIndex    = renderQueue.push( -> ) - 1
                model.drawStart      = model.dstByteOffset / 12
                model.drawCount      = vertices.length / 3
                model.pointersOffset = @getPointersByteOffset()

                model.bufferData vertices

            unless model
                throw /MODEL_ERR/
            
            model.clone()

        getModels               : ->
            offset = 0
            length = @getItemsByteOffset()
            mcount = @vertices.length
            stride = 24
            models = []

            while length > offset += 28
                if  index = @getUint16 offset + stride, iLE
                    continue unless mcount > index
                    models.push new Model offset
                    
            models

    }

    d3data      = new DataView new ArrayBuffer 1e6 * 28
    d3headers   = new DataView new ArrayBuffer 1e5 * 28
    d3length    = d3data.byteLength / 4
    d3DataArray = ( TypedArray, dcount = d3data.byteLength / 4 ) ->
        ( byteOffset, length ) -> new TypedArray( d3.buffer,
            byteOffset || 0, length || dcount
        )

    Object.defineProperties         d3, d3definitions = {
        buffer       : value : d3data.buffer
        attributes    : value : new Float32Array d3data.buffer

        getUint32    : value : d3headers.getUint32.bind d3headers
        setUint32    : value : d3headers.setUint32.bind d3headers
        
        getUint16    : value : d3headers.getUint16.bind d3headers
        setUint16    : value : d3headers.setUint16.bind d3headers
        
        getFloat32   : value : d3data.getFloat32.bind d3data
        setFloat32   : value : d3data.setFloat32.bind d3data

        Float32Array : value : d3DataArray Float32Array 
    }
    Object.defineProperties  Attribute::, d3definitions
    
    Object.defineProperties   Instance::, d3definitions
    
    Object.defineProperties      Model::, d3definitions

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

        bindBufferVertices()
        gl.bufferData gl.ARRAY_BUFFER, 1e7 * 4, gl.STATIC_DRAW
        
        gl.enableVertexAttribArray a_Vertices
        gl.enableVertexAttribArray a_Position
        gl.enableVertexAttribArray a_Color
        
        gl.vertexAttribDivisor a_Position, 1
        gl.vertexAttribDivisor a_Color, 1

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
        #log de = [ d3.add(font.f) ]

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
        job t for job in renderQueue
        requestAnimationFrame render

        j *= -1 unless ++i % 240

    render 0



    
do ->

    view = new DataView buffer = new ArrayBuffer 2048
    scope = [ null ]
    renderQueue = [(->)]

    frameLoop = (t) =>
        f() for f in renderQueue
        requestAnimationFrame frameLoop

    Object.defineProperties Array::,

        sum : value : ( key ) ->
            unless key then @reduce (a,b) -> a + ( b or 0 )
            else @reduce (a, b) -> a[key] + ( b[key] or 0 )

    Object.defineProperties Object,

        allocateProperty : value : ( target, prop, desc ) ->

            desc.typedArray ||= Int32Array

            define = ( key, def, byteOffset ) ->
                get = 0

                if  def.isPointer

                    unless onempty = def.onempty
                        get = ->
                            if  ptri = view.getInt32 byteOffset + this, iLE
                                return new LinkedPointer ptri
                            null
                    else
                        get = ->
                            unless ptri = view.getInt32 byteOffset + this, iLE
                                unless ptri = onempty.call this
                                    return null
                                this[ key ] = ptri
                            return new LinkedPointer ptri
    
                    set = ->
                        view.setInt32 byteOffset + this, arguments[0], iLE

                else

                    { onbeforeset, onafterset, onemptyget } = def

                    if  "function" is typeof def.value
                        
                        switch def.typedArray

                            when Uint8Array     then get = -> 
                                if !val = view.getUint8 byteOffset + this
                                    return 0 unless val = def.value.call this 
                                    return @[ key ] = val
                                val

                            when Int16Array    then get = ->
                                if !val = view.getInt16 byteOffset + this, iLE
                                    return 0 unless val = def.value.call this 
                                    return @[ key ] = val
                                val

                            when Uint16Array    then get = ->
                                if !val = view.getUint16 byteOffset + this, iLE
                                    return 0 unless val = def.value.call this 
                                    return @[ key ] = val
                                val

                            when Int32Array     then get = ->
                                if !val = view.getInt32 byteOffset + this, iLE
                                    return 0 unless val = def.value.call this 
                                    return @[ key ] = val
                                val

                            when Uint32Array    then get = ->
                                if !val = view.getUint32 byteOffset + this, iLE
                                    return 0 unless val = def.value.call this 
                                    return @[ key ] = val
                                val

                            when Float32Array   then get = ->
                                if !val = view.getFloat32 byteOffset + this, iLE
                                    return 0 unless val = def.value.call this 
                                    return @[ key ] = val
                                val

                            when BigUint64Array then get = ->
                                if !val = view.getUint32 byteOffset + this, iLE
                                    if  val = def.value.call this
                                        this[ key ] = BigInt val
                                val

                            else throw /ERR_DEF/

                    else switch def.typedArray
                        when Uint8Array     then get = -> view.getUint8 byteOffset + this
                        when Int16Array     then get = -> view.getInt16 byteOffset + this, iLE
                        when Uint16Array    then get = -> view.getUint16 byteOffset + this, iLE
                        when Int32Array     then get = -> view.getInt32 byteOffset + this, iLE
                        when Uint32Array    then get = -> view.getUint32 byteOffset + this, iLE
                        when Float32Array   then get = -> view.getFloat32 byteOffset + this, iLE
                        when BigUint64Array then get = -> Number view.getBigUint64 byteOffset + this, iLE
                        else throw /ERR_DEF/
                            
                    if  Boolean  onemptyget
                        switch def.typedArray
                            when Uint8Array     then get = -> view.getUint8( byteOffset + this ) or onemptyget.call(@)
                            when Int16Array     then get = -> view.getInt16( byteOffset + this, iLE ) or onemptyget.call(@)
                            when Uint16Array    then get = -> view.getUint16( byteOffset + this, iLE ) or onemptyget.call(@)
                            when Int32Array     then get = -> view.getInt32( byteOffset + this, iLE ) or onemptyget.call(@)
                            when Uint32Array    then get = -> view.getUint32( byteOffset + this, iLE ) or onemptyget.call(@)
                            when Float32Array   then get = -> view.getFloat32( byteOffset + this, iLE ) or onemptyget.call(@)
                            when BigUint64Array then get = -> view.getBigUint64( byteOffset + this, iLE ) or onemptyget.call(@)
                            else throw /ERR_DEF/


                    if  Boolean keys = def.keys or def.indexedKeys
                        
                        if !def.indexedKeys and (keyvalue = {})
                            switch keys.constructor
                                when Array  then for k in keys then keyvalue[ k*1 ] = k
                                when Object then for k, v of keys then keyvalue[ k*1 ] = v
                                else throw /KEYS_MUSTBE_ARRAY_OR_OBJECT/
                        else keyvalue = keys

                        if  Boolean  onemptyget
                            switch def.typedArray
                                when Uint8Array     then get = -> keyvalue[ view.getUint8( byteOffset + this ) or onemptyget.call(@) ]
                                when Int16Array     then get = -> keyvalue[ view.getInt16( byteOffset + this, iLE ) or onemptyget.call(@) ]
                                when Uint16Array    then get = -> keyvalue[ view.getUint16( byteOffset + this, iLE ) or onemptyget.call(@) ]
                                when Int32Array     then get = -> keyvalue[ view.getInt32( byteOffset + this, iLE ) or onemptyget.call(@) ]
                                when Uint32Array    then get = -> keyvalue[ view.getUint32( byteOffset + this, iLE ) or onemptyget.call(@) ]
                                when Float32Array   then get = -> keyvalue[ view.getFloat32( byteOffset + this, iLE ) or onemptyget.call(@) ]
                                when BigUint64Array then get = -> keyvalue[ view.getBigUint64( byteOffset + this, iLE ) or onemptyget.call(@) ]
                                else throw /ERR_DEF/

                        else
                            switch def.typedArray
                                when Uint8Array     then get = -> keyvalue[ view.getUint8( byteOffset + this ) ]
                                when Int16Array     then get = -> keyvalue[ view.getInt16( byteOffset + this, iLE ) ]
                                when Uint16Array    then get = -> keyvalue[ view.getUint16( byteOffset + this, iLE ) ]
                                when Int32Array     then get = -> keyvalue[ view.getInt32( byteOffset + this, iLE ) ]
                                when Uint32Array    then get = -> keyvalue[ view.getUint32( byteOffset + this, iLE ) ]
                                when Float32Array   then get = -> keyvalue[ view.getFloat32( byteOffset + this, iLE ) ]
                                when BigUint64Array then get = -> keyvalue[ view.getBigUint64( byteOffset + this, iLE ) ]
                                else throw /ERR_DEF/

                    if  Boolean !onafterset and !onbeforeset
                        switch def.typedArray
                            when Uint8Array     then set = (v) -> view.setUint8 byteOffset + this, v
                            when Int16Array     then set = (v) -> view.setInt16 byteOffset + this, v, iLE
                            when Uint16Array    then set = (v) -> view.setUint16 byteOffset + this, v, iLE
                            when Int32Array     then set = (v) -> view.setInt32 byteOffset + this, v, iLE
                            when Uint32Array    then set = (v) -> view.setUint32 byteOffset + this, v, iLE
                            when Float32Array   then set = (v) -> view.setFloat32 byteOffset + this, v, iLE
                            when BigUint64Array then set = (v) -> view.setBigUint64 byteOffset + this, BigInt(v), iLE
                            else throw /ERR_DEF/

                    else if !onbeforeset and onafterset
                        switch def.typedArray
                            when Uint8Array     then set = (v) -> view.setUint8 byteOffset + this, v ; onafterset.call(@, v)
                            when Int16Array     then set = (v) -> view.setInt16 byteOffset + this, v, iLE ; onafterset.call(@, v)
                            when Uint16Array    then set = (v) -> view.setUint16 byteOffset + this, v, iLE ; onafterset.call(@, v)
                            when Int32Array     then set = (v) -> view.setInt32 byteOffset + this, v, iLE ; onafterset.call(@, v)
                            when Uint32Array    then set = (v) -> view.setUint32 byteOffset + this, v, iLE ; onafterset.call(@, v)
                            when Float32Array   then set = (v) -> view.setFloat32 byteOffset + this, v, iLE ; onafterset.call(@, v)
                            when BigUint64Array then set = (v) -> view.setBigUint64 byteOffset + this, BigInt(v), iLE ; onafterset.call(@, v)
                            else throw /ERR_DEF/

                    else if onbeforeset and !onafterset
                        switch def.typedArray
                            when Uint8Array     then set = (v) -> view.setUint8 byteOffset + this, onbeforeset.call(@, v); v
                            when Int16Array     then set = (v) -> view.setInt16 byteOffset + this, onbeforeset.call(@, v), iLE; v
                            when Uint16Array    then set = (v) -> view.setUint16 byteOffset + this, onbeforeset.call(@, v), iLE; v
                            when Int32Array     then set = (v) -> view.setInt32 byteOffset + this, onbeforeset.call(@, v), iLE; v
                            when Uint32Array    then set = (v) -> view.setUint32 byteOffset + this, onbeforeset.call(@, v), iLE; v
                            when Float32Array   then set = (v) -> view.setFloat32 byteOffset + this, onbeforeset.call(@, v), iLE; v
                            when BigUint64Array then set = (v) -> view.setBigUint64 byteOffset + this, BigInt(onbeforeset.call(@, v)), iLE; v
                            else throw /ERR_DEF/

                    else if onbeforeset and onafterset
                        switch def.typedArray
                            when Uint8Array     then set = (v) -> view.setUint8 byteOffset + this, onbeforeset.call(@, v); onafterset.call(@, v)
                            when Int16Array     then set = (v) -> view.setInt16 byteOffset + this, onbeforeset.call(@, v), iLE ; onafterset.call(@, v)
                            when Uint16Array    then set = (v) -> view.setUint16 byteOffset + this, onbeforeset.call(@, v), iLE ; onafterset.call(@, v)
                            when Int32Array     then set = (v) -> view.setInt32 byteOffset + this, onbeforeset.call(@, v), iLE ; onafterset.call(@, v)
                            when Uint32Array    then set = (v) -> view.setUint32 byteOffset + this, onbeforeset.call(@, v), iLE ; onafterset.call(@, v)
                            when Float32Array   then set = (v) -> view.setFloat32 byteOffset + this, onbeforeset.call(@, v), iLE ; onafterset.call(@, v)
                            when BigUint64Array then set = (v) -> view.setBigUint64 byteOffset + this, BigInt(onbeforeset.call(@, v)), iLE ; onafterset.call(@, v)
                            else throw /ERR_DEF/

                Object.defineProperty this, key, { get, set }

            bpe = desc.typedArray.BYTES_PER_ELEMENT
            byteOffset = target.byteLength

            if  mod = byteOffset % bpe
                byteOffset += bpe - mod

            define.call( target.prototype,
                prop, desc, byteOffset
            )

            target.byteLength = byteOffset + bpe

            target

        registerProperty : value : ( target, prop, desc ) ->

            define = ( key, def, byteOffset ) ->

                { required , inheritable, onafterset, onbeforeset } = def

                set = switch true

                    when Boolean(!onafterset and !onbeforeset) then (v) ->
                        view.setInt32 byteOffset + this, v, iLE

                    when Boolean( onafterset and !onbeforeset) then (v) ->
                        view.setInt32 byteOffset + this, v, iLE
                        onafterset.call(this, v)

                    when Boolean(!onafterset and  onbeforeset) then (v) ->
                        v = onbeforeset.call(this, v)
                        view.setInt32 byteOffset + this, v, iLE

                    when Boolean( onafterset and  onbeforeset) then (v) ->
                        v = onbeforeset.call(this, v)
                        view.setInt32 byteOffset + this, v, iLE
                        onafterset.call(this, v)                

                switch true

                    when Boolean def.scopeIndex
                        get = ->
                            if !scpi = view.getInt32 byteOffset + this, iLE
                                return undefined unless required
                                scpi = @[ key ] = def.scopeIndex.call this 

                            scope[ scpi ]

                    when Boolean Class = def.instanceof
                        get = ->
                            if !ptri = view.getInt32 byteOffset + this, iLE

                                if  inheritable
                                    ptrj = +this
                                    clsi = extref Class

                                    while !ptri and ptrj
                                        ptri = findChildren ptrj, clsi, off
                                        ptrj = getHeaderParentPtri ptrj

                                if !ptri and required
                                    ptri = malloc Class
                                    @appendChild ptri
                            
                                if  ptri
                                    @[ key ] = ptri

                            new Class ptri

                Object.defineProperty this, key, { get, set }

            byteOffset = target.byteLength

            if  mod = byteOffset % 4
                byteOffset += 4 - mod

            define.call( target.prototype,
                prop, desc, byteOffset
            )

            target.byteLength =
                4 + byteOffset

            target

    BUFFER_BYTEOFFSET =   0
    BUFFER_ALLOCCOUNT =   4
    BUFFER_INITIALLOC =  24

    HEADER_BYTELENGTH = -24
    HEADER_NEXTOFFSET = -20
    HEADER_PARENT_PTR = -16           
    HEADER_CLASSINDEX = -12           
    HEADER_SCOPEINDEX =  -8           
    HEADER_TYPEDARRAY =  -4
    
    view.setInt32 BUFFER_BYTEOFFSET, BUFFER_INITIALLOC, iLE

    view.setInt32 BUFFER_ALLOCCOUNT, 1, iLE

    getBufferByteOffset = ->
        view.getInt32 BUFFER_BYTEOFFSET, iLE
   
    setBufferByteOffset = ( value ) ->
        view.setInt32 BUFFER_BYTEOFFSET, value, iLE

    getBufferAllocCount = ->
        view.getInt32 BUFFER_ALLOCCOUNT, iLE
   
    setBufferAllocCount = ( value ) ->
        view.setInt32 BUFFER_ALLOCCOUNT, value, iLE

    getHeaderByteLength = ( ptri ) ->
        view.getInt32 ptri + HEADER_BYTELENGTH, iLE

    setHeaderByteLength = ( ptri, value ) ->
        view.setInt32 ptri + HEADER_BYTELENGTH, value, iLE

    getHeaderNextOffset = ( ptri ) ->
        view.getInt32 ptri + HEADER_NEXTOFFSET, iLE

    setHeaderNextOffset = ( ptri, value ) ->
        view.setInt32 ptri + HEADER_NEXTOFFSET, value, iLE

    getHeaderParentPtri = ( ptri ) ->
        view.getInt32 ptri + HEADER_PARENT_PTR, iLE

    setHeaderParentPtri = ( ptri, value ) ->
        view.setInt32 ptri + HEADER_PARENT_PTR, value, iLE

    getHeaderClassIndex = ( ptri ) ->
        view.getInt32 ptri + HEADER_CLASSINDEX, iLE

    setHeaderClassIndex = ( ptri, value ) ->
        view.setInt32 ptri + HEADER_CLASSINDEX, value, iLE

    getHeaderScopeIndex = ( ptri ) ->
        view.getInt32 ptri + HEADER_SCOPEINDEX, iLE

    setHeaderScopeIndex = ( ptri, value ) ->
        view.setInt32 ptri + HEADER_SCOPEINDEX, value, iLE

    getHeaderTypedArray = ( ptri ) ->
        view.getInt32 ptri + HEADER_TYPEDARRAY, iLE

    setHeaderTypedArray = ( ptri, value ) ->
        view.setInt32 ptri + HEADER_TYPEDARRAY, value, iLE

    getPonterTypedArray = ( ptri = this ) ->
        byteOffset = +ptri
        byteLength = getHeaderByteLength byteOffset
        classIndex = getHeaderClassIndex byteOffset

        TypedArray = scope[ classIndex ].TypedArray
        length     = byteLength / TypedArray.BYTES_PER_ELEMENT

        new TypedArray buffer, byteOffset, length

    getPonterHeaders    = ( ptri = this ) ->
        byteOffset = ptri + HEADER_BYTELENGTH
        length     = HEADER_BYTELENGTH / -4

        new Int32Array buffer, byteOffset, length

    getPointer          = ( ptri ) ->
        clsi = getHeaderClassIndex ptri
        new scope[ clsi ] ptri

    getPointers         = ( clsi ) ->
        matchs = []
        offset = 48
        length = getBufferByteOffset()

        unless clsi
            while length >= offset
                matchs.push getPointer offset
                offset = getHeaderNextOffset offset
            return matchs

        while length >= offset
            unless clsi - getHeaderClassIndex offset
                matchs.push getPointer offset
            offset = getHeaderNextOffset offset

        return matchs

    getParent           = ( ptri = this ) ->
        if  ptrj = getHeaderParentPtri ptri
            return getPointer ptrj

    setParent           = ( ptri, ptrj ) ->
        setHeaderParentPtri ptri, ptrj ; ptri

    getChildren         = ( ptri = this ) ->
        childs = []
        offset = 48
        length = getBufferByteOffset()

        while length >= offset
            unless ptri - getHeaderParentPtri offset
                childs.push getPointer offset
            offset = getHeaderNextOffset offset
            
        childs

    hasChildren         = ( ptri = this, ptrj ) ->
        childs = []
        offset = 48
        length = getBufferByteOffset()

        while length >= offset
            unless ptri - getHeaderParentPtri offset
                return 1 unless ptri - ptrj
            offset = getHeaderNextOffset offset
            
        0

    findChildren        = ( ptri, clsi, inheritable = on ) ->
        if  Pointer.isPrototypeOf clsi
            clsi = scope .indexOf clsi

        ptrj = getChildren( ptri ).find ( i ) ->
            0 is clsi - getHeaderClassIndex i

        if !inheritable or ptrj
            return ptrj

        findChildren getParent( ptri ) , clsi, on

    filterChildren      = ( ptri, clsi ) ->
        if  Pointer.isPrototypeOf clsi
            clsi = scope .indexOf clsi

        getChildren( ptri ).filter ( i ) ->
            0 is clsi - getHeaderClassIndex i

    extref = ( object ) ->
        if -1 is i = scope.indexOf object
            i += scope.push object
        i

    palloc = ( PtrSuper, PtrChild, options = {} ) ->
        clsi = extref PtrSuper
        clsj = extref PtrChild

    malloc = ( PtrClass = Pointer, byteLength = 0 ) ->
        byteLength = PtrClass.byteLength + byteLength
        classIndex = extref PtrClass

        allocCount = getBufferAllocCount()
        byteOffset = getBufferByteOffset()

        byteOffset = byteOffset - HEADER_BYTELENGTH
        nextOffset = byteOffset + byteLength

        if  mod = nextOffset % 8
            nextOffset += 8 - mod

        setBufferAllocCount allocCount + 1
        setBufferByteOffset nextOffset
        
        setHeaderByteLength byteOffset, byteLength
        setHeaderClassIndex byteOffset, classIndex
        setHeaderNextOffset byteOffset, nextOffset - HEADER_BYTELENGTH 

        ptri = new PtrClass byteOffset
        ptri . onalloc()
        ptri


    class Pointer               extends Number
        constructor : -> super( arguments[0] ).oninit()
    class Window                extends Pointer
    class HTMLElement           extends Pointer
    class HTMLDocument          extends HTMLElement
    class HTMLBodyElement       extends HTMLElement
    class HTMLCanvasElement     extends HTMLElement
    class HTMLScriptElement     extends HTMLElement
    class RenderingContext      extends Pointer
    class Screen                extends Pointer
    class GLBuffer              extends Pointer
    class GLProgram             extends Pointer
    class ContextUpload         extends Pointer
    class ContextUploads        extends Pointer
    class DrawCall              extends Pointer
    class ShaderSource          extends Pointer
    class GLShader              extends Pointer
    class GLSLProcedure         extends Pointer
    class LinkedPointer         extends Pointer
    class Text                  extends Pointer

    VERTEX_SHADER = new (class VERTEX_SHADER extends Number)(
        WebGL2RenderingContext.VERTEX_SHADER
    )

    FRAGMENT_SHADER = new (class FRAGMENT_SHADER extends Number)(
        WebGL2RenderingContext.FRAGMENT_SHADER
    )

    COMPUTE_SHADER = new (class COMPUTE_SHADER extends Number)(
        WebGL2RenderingContext.FRAGMENT_SHADER+2
    )

    MALLOC_PER_CONTEXT  = new (class MALLOC_PER_CONTEXT extends Number)(1)
    MALLOC_PER_UPLOAD   = new (class MALLOC_PER_UPLOAD extends Number)(2)
    MALLOC_PER_INSTANCE = new (class MALLOC_PER_INSTANCE extends Number)(3)

    MARK_ONLY_REQUESTED = new (class MARK_ONLY_REQUESTED extends Number)(1)
    MARK_PARENT_UPDATED = new (class MARK_PARENT_UPDATED extends Number)(2)

    Object.defineProperties Pointer,

        TypedArray      :
            configurable: on
            value       : Uint8Array

        byteLength      :
            writable    : on
            value       : 0

    Object.defineProperties Pointer::,

        toString        : value : ->
            throw "toString"

        subarray        :
            get         : getPonterTypedArray

        headers         :
            get         : getPonterHeaders

        children        : 
            get         : getChildren

        parent          :
            get         : getParent
            set         : -> setParent this, arguments[0]

        oninit          : value : -> this

        onalloc         : value : -> this

        appendChild     : value : ( node ) ->
            if  node instanceof Pointer
                return setParent node, this
            return @extref.appendChild node

    Object.defineProperties LinkedPointer::,

        oninit          : value : ->
            clsi = getHeaderClassIndex this
            proto = scope[  clsi  ].prototype
            Object.setPrototypeOf this, proto

    Object.defineProperties HTMLElement::,

        document        : get   : ->
            if  this instanceof HTMLDocument
                return this
            return @parent.document

        window          : get   : ->
            if  this instanceof HTMLDocument
                return @parent
            return @parent.window

    Object.defineProperties HTMLDocument::,

        createElement       : value : ( tagName ) ->
            @extref.createElement tagName

        querySelector       : value : ( query, all = off ) ->
            if !all then return @extref.querySelector query
            else return @extref.querySelectorAll query

    Object.defineProperties GLProgram::,

        attach              : value : ( ptri ) ->
            @parent.attachShader( @glObject, s = ptri.glObject )
            @parent.attachedShaders( @glObject ) . includes( s )

        link                : value : ->
            unless  state = @isLinked
                if  @vertexShader and @fragmentShader
                    @parent.linkProgram @glObject
                    @parent.validateProgram @glObject
                    state = @isLinked = @PARAMETERS.LINK_STATUS
            state 

        use                 : value : ( fast = on ) ->
            unless state = @isActive
                if @link() then @parent.useProgram( @glObject )
                state = @isActive = fast or @PARAMETERS.IS_CURRENT
            state

        draw                : value : ( ptri ) ->
            drawCall = @appendChild malloc DrawCall
            drawCall . contextUpload = ptri

            log drawCall

        PARAMETERS          : get   : ->

            IS_PROGRAM      : @parent.isProgram(
                @glObject )

            INFO_LOG        : @parent.programInfoLog(
                @glObject )

            VALIDATE_STATUS : @parent.programParameter( @glObject, 
                WebGL2RenderingContext.VALIDATE_STATUS )

            LINK_STATUS     : @parent.programParameter( @glObject, 
                WebGL2RenderingContext.LINK_STATUS )

            IS_CURRENT      : @glObject is @parent.getParameter(
                WebGL2RenderingContext.CURRENT_PROGRAM )
            
            DELETE_STATUS   : @parent.programParameter( @glObject, 
                WebGL2RenderingContext.DELETE_STATUS )

        attachDefault       : value : ( type ) ->

            kind = type.constructor.name
            ptri = @parent.shaderSources.find (ptr) ->
                0 is type - ptr.type

            return throw /ERR_NONSHADER/+kind unless ptri 
            return throw /ERR_UNCOMPILEDVERT/ unless ptri.compile()
            return throw @PARAMETERS.INFO_LOG unless @attach ptri 

            ptrj = malloc GLShader
            ptrj . shaderSource = ptri
            ptrj

    Object.defineProperties RenderingContext::,

        shaderScripts   : value : ->
            Array.from @parent.document.querySelector(
                "[type^='x-shader']", on
            )

        shaderSources   : get   : ->
            childs = filterChildren this, ShaderSource
            
            for ref in @shaderScripts()
                if !childs.find (c) -> ref is c.target.extref
                    shader = malloc HTMLScriptElement
                    shader.extref = extref ref

                    source = malloc ShaderSource
                    source.target = shader
                    childs.push @appendChild source
                    
            childs

        linkedPrograms  : get   : ->
            childs = filterChildren this, GLProgram

            unless childs.length
                @appendChild ptri = malloc GLProgram
                if ptri.link() then childs.push ptri 

            childs.filter (p) -> p.isLinked

        PARAMETERS          : get   : ->
            
            gl = @glObject
            fn = @getParameter.bind this
            
            CURRENT_PROGRAM : fn gl.CURRENT_PROGRAM

        draw                : value : ( contextUpload ) ->
            @linkedPrograms.at().draw( contextUpload )

        createBuffer        : value : ( type ) ->
            @glObject.createBuffer()

        shaderInfoLog       : value : ( glShader ) ->
            @glObject.getShaderInfoLog glShader

        attachedShaders     : value : ( glProgram ) ->
            @glObject.getAttachedShaders glProgram

        programInfoLog      : value : ( glProgram ) ->
            @glObject.getProgramInfoLog glProgram

        linkProgram         : value : ( glProgram ) ->
            @glObject.linkProgram glProgram

        isProgram           : value : ( glProgram ) ->
            @glObject.isProgram glProgram

        useProgram          : value : ( glProgram ) ->
            @glObject.useProgram glProgram

        validateProgram     : value : ( glProgram ) ->
            @glObject.validateProgram glProgram

        programParameter    : value : ( glProgram, param ) ->
            @glObject.getProgramParameter glProgram, param

        getParameter        : value : ( param ) ->
            @glObject.getParameter param

        createProgram       : value : ->
            @glObject.createProgram()

        createShader        : value : ( type ) ->
            @glObject.createShader type

        attachShader        : value : ( glProgram, glShader ) ->
            @glObject.attachShader glProgram, glShader

        compileShader       : value : ( glShader ) ->
            @glObject.compileShader glShader

        shaderSource        : value : ( glShader, source ) ->
            @glObject.shaderSource glShader, source

        bindBuffer          : value : ( ptri ) ->
            @glObject.bindBuffer( 
                ptri.bindingPoint,
                ptri.glObject,
                ptri.drawingMode
            )

            for buf in filterChildren this, GLBuffer
                buf.isActive and= 0

            ptri.isActive = 1

        upload              : value : ( arrayLike ) ->
            ptri = malloc ContextUpload
            ptri.extref = extref arrayLike
            @uploads.appendChild ptri     

    Object.defineProperties HTMLCanvasElement::,

        getContext          : value : ( type ) ->
            @extref.getContext type

        resizeToFullWindow  : value : ->
            @resizeNode( @extref ).reloadContext()

        resizeNode          : value : ( node, width, height, dpr ) ->
            dpr ||= @window.extref.devicePixelRatio

            width               =  width || @window.extref.innerWidth
            node.width          =  width * dpr
            node.style.width    =  width + "px"

            height              = height || @window.extref.innerHeight
            node.height         = height * dpr
            node.style.height   = height + "px"
            node

        reloadContext       : value : ->
            @renderingContext.glObject = 0
            @renderingContext.glObject.viewport(
                0, 0, width * dpr, height * dpr
            )


    Object.registerProperty Window              , "document", {
        required    : on
        inheritable : off
        instanceof  : HTMLDocument
    }

    Object.registerProperty GLShader            , "shaderSource", {
        required    : on
        inheritable : off
        instanceof  : ShaderSource
    }

    Object.registerProperty ShaderSource        , "target", {
        required    : on
        inheritable : off
        onafterset  : -> @resolveSource()
        instanceof  : LinkedPointer
    }

    Object.registerProperty ShaderSource        , "glObject", {
        required    : on
        inheritable : off
        scopeIndex  : -> extref @parent.createShader @type           
    }    
    
    Object.defineProperties ShaderSource::      , 

        PARAMETERS          : get   : -> 

            INFO_LOG : @parent.shaderInfoLog @glObject

        resolveSource       : value : ->

            isVariable      = ( l ) ->
                /attr|unif/.test l.trim().substring( 0, 4 )

            parseLine       = ( a, i, o ) ->

                [ kind, type, name ] =
                    a.split(/\s+/).filter Boolean

                [ rows, cols ] = type.substring(3)
                    .split("x").map Number

                size = switch type.substring 0, 3
                    when "mat" then rows * ( cols or rows ) 
                    else rows

                return { kind, type, name, size }

            definitions = @text.split( /\n|\;/ )
                .filter( isVariable ).map( parseLine )

            log definitions
        
        compile             : value : ->
            unless @isCompiled
                @parent.shaderSource @glObject, @text
                @parent.compileShader @glObject
                throw e if e = @PARAMETERS.INFO_LOG
            @isCompiled = 1

        text                : get   : -> 
            "#{@target.text}".trim()

        attachedPrograms    : get   : -> 
            ptri = +this
            programs = []
            for prog in filterChildren @parent, GLProgram
                if !prog.vertexShader - ptri
                    programs.push prog
                    continue

                if !prog.fragmentShader - ptri
                    programs.push prog
                    continue
            programs
        
        type                : get   : -> 

            if  @text.match /gl_Position/
                return VERTEX_SHADER

            if  @text.match /gl_FragColor/
                return FRAGMENT_SHADER

            if  @text.match /gl_Compute/
                return COMPUTE_SHADER
                
            throw /ERR_SHADER_TYPE/


    Object.allocateProperty ShaderSource        , "isCompiled", {
        typedArray  : Uint8Array
    }

    Object.registerProperty Window              , "screen", {
        required    : on
        inheritable : on
        instanceof  : Screen
    }

    Object.registerProperty HTMLCanvasElement   , "renderingContext", {
        required    : on
        inheritable : off
        instanceof  : RenderingContext
    }

    Object.registerProperty RenderingContext    , "uploads", {
        required    : on
        inheritable : off
        instanceof  : ContextUploads
    }

    Object.registerProperty Window              , "extref", {
        required    : on
        inheritable : off
        scopeIndex  : -> extref window
    }

    Object.registerProperty RenderingContext    , "glObject", {
        required    : on
        inheritable : off
        scopeIndex  : -> extref @parent.getContext "webgl2"
    }

    Object.registerProperty GLBuffer            , "glObject", {
        required    : on
        scopeIndex  : -> extref @parent.createBuffer()
    }

    Object.registerProperty GLProgram           , "glObject", {
        required    : on
        scopeIndex  : -> extref @parent.createProgram()
    }

    Object.allocateProperty GLProgram           , "vertexShader", {
        isPointer   : on
        onempty     : -> @attachDefault VERTEX_SHADER
    }

    Object.allocateProperty GLProgram           , "fragmentShader", {
        isPointer   : on
        onempty     : -> @attachDefault FRAGMENT_SHADER
    }

    Object.allocateProperty GLProgram           , "isLinked", {
        typedArray : Uint8Array
    }

    Object.allocateProperty GLProgram           , "isActive", {
        typedArray : Uint8Array
    }

    Object.registerProperty HTMLDocument        , "extref", {
        required    : on
        inheritable : off
        scopeIndex  : ->
            extref @window.extref.document
    }

    Object.registerProperty Screen              , "extref", {
        required    : on
        inheritable : off
        scopeIndex  : ->
            extref @window.extref.screen
    }

    Object.registerProperty HTMLBodyElement     , "extref", {
        required    : on
        inheritable : off
        scopeIndex  : ->
            extref @document.extref.body
    }

    Object.registerProperty HTMLBodyElement     , "scene", {
        required    : on
        inheritable : off
        instanceof  : HTMLCanvasElement
    }

    Object.registerProperty HTMLCanvasElement   , "extref", {
        required    : on
        inheritable : off
        scopeIndex  : ->            
            node = @document.createElement "canvas"
            extref @parent.appendChild @resizeNode node
    }

    Object.registerProperty HTMLDocument        , "body", {
        required    : on
        inheritable : off
        instanceof  : HTMLBodyElement
    }

    Object.allocateProperty HTMLCanvasElement   , "width", {
        typedArray  : Int16Array
        value       : -> @window.extref.innerWidth
    }

    Object.allocateProperty HTMLCanvasElement   , "height", {
        typedArray  : Int16Array
        value       : -> @window.extref.innerHeight
    }

    Object.allocateProperty ContextUpload       , "byteLength", {
        typedArray  : Uint32Array
        value       : -> @dataLength * 4
    }

    Object.allocateProperty ContextUpload       , "dataLength", {
        typedArray  : Uint32Array
        value       : -> @extref.length * 1
    }

    Object.allocateProperty ContextUpload       , "pointCount", {
        typedArray  : Uint32Array
        value       : -> @dataLength / 3
    }

    Object.allocateProperty ContextUpload       , "triangleCount", {
        typedArray  : Uint32Array
        value       : -> @dataLength / 9
    }

    Object.registerProperty ContextUpload       , "extref", {
        required    : on
        inheritable : off
        scopeIndex  : -> extref new Array()
    }

    Object.registerProperty HTMLScriptElement   , "extref", {
        required    : on
        inheritable : off
        scopeIndex  : -> 0
    }

    Object.defineProperties HTMLScriptElement:: , 
        text        : get : -> "#{@extref.text}"


    Object.allocateProperty DrawCall            , "dstByteOffset", {
        typedArray  : Uint32Array
    }
    
    Object.allocateProperty DrawCall            , "begin", {
        typedArray  : Uint32Array
    }

    Object.defineProperties DrawCall::          , 
        length      : get : -> @parent.dataLength


    Object.allocateProperty DrawCall            , "start", {
        typedArray  : Uint32Array
    }

    Object.allocateProperty DrawCall            , "count", {
        typedArray  : Uint32Array
    }

    Object.allocateProperty DrawCall            , "mode", {
        typedArray  : Uint16Array
    }

    Object.registerProperty DrawCall            , "contextUpload", {
        required    : on
        inheritable : off
        instanceof  : ContextUpload
    }

    Object.allocateProperty GLSLProcedure       , "mallocEvent", {
        typedArray  : Uint8Array
        keys        : [
            MALLOC_PER_UPLOAD, 
            MALLOC_PER_CONTEXT,
            MALLOC_PER_INSTANCE ]
    }

    Object.allocateProperty GLSLProcedure       , "markEvent", {
        typedArray  : Uint8Array
        keys        : [
            MARK_ONLY_REQUESTED, 
            MARK_PARENT_UPDATED ]
    }

    Object.allocateProperty GLSLProcedure       , "targetClass", {
        typedArray  : Uint32Array
        indexedKeys : scope
        onbeforeset : ( PointerClass ) ->
            if !isNaN PointerClass
                PointerClass = scope[ PointerClass ]

            if !Pointer.isPrototypeOf PointerClass
                throw /SCOPEINDEX_NOTFOUND/

            scopeIndex = extref PointerClass

            if !Object.hasOwn PointerClass, "procedures"
                PointerClass.procedures = new Array()
            PointerClass.procedures.push this

            Object.defineProperty PointerClass::, "glProcedures", get : ->
                PointerClass.procedures.filter ( procedure ) ->
                    procedure instanceof GLSLProcedure


            return scopeIndex
    }

    Object.allocateProperty GLSLProcedure       , "variable", {
        isPointer   : on
        onemptyget  : -> throw /UNDEFINED_VARIABLE/
    }

    Object.registerProperty GLSLProcedure       , "function", {
        required    : on
        inheritable : off
        scopeIndex  : yes
    }

    Object.defineProperties GLSLProcedure::,

        name        : get   : -> @variable.value

    Object.defineProperties Text,
    
        from        : value : ( text ) -> 

            if  typeof text is "string"
                return @from this::encode text

            if  Array.isArray text
                return @from Uint8Array.from text

            if  text instanceof Uint8Array 
                ptri = malloc Text, text.byteLength
                ptri . subarray.set text
                return ptri

            throw /ERR_TEXTFROM/
        
    Object.defineProperties Text::,

        encode      : value : TextEncoder::encode.bind new TextEncoder 
            
        decode      : value : TextDecoder::decode.bind new TextDecoder 

        value       : get   : -> @decode @subarray.slice 0


    Object.defineProperties ContextUpload::, 

        draw        : value : ( ptri ) ->
            call = malloc DrawCall
            call.program = ptri
            @appendChild call


    Object.defineProperties ContextUploads::, 

        byteLength          : get   : ->
            filterChildren(this, ContextUpload).sum "byteLength"
            
        dataLength          : get   : ->
            filterChildren(this, ContextUpload).sum "dataLength"

        pointCount          : get   : ->
            filterChildren(this, ContextUpload).sum "pointCount"
            
        triangleCount       : get   : ->
            filterChildren(this, ContextUpload).sum "triangleCount"
            

    win = malloc Window

    do  context = ->
        body = win.document.body
        scene = body.scene
        context = scene.renderingContext
        
        log context.upload [1,1,1,1,1,1]
        log up1 = context.upload [1,1,1,1,1,1,1,1]
        log context.draw up1
        log context.draw up1
        
        program = context.linkedPrograms.at(0)
        vShader = program.vertexShader


        u_ViewMatrix                = malloc GLSLProcedure 
        u_ViewMatrix.parent         = vShader
        u_ViewMatrix.targetClass    = RenderingContext
        u_ViewMatrix.mallocEvent    = MALLOC_PER_CONTEXT
        u_ViewMatrix.markEvent      = MARK_ONLY_REQUESTED
        u_ViewMatrix.variable       = Text.from "u_ViewMatrix"
        u_ViewMatrix.function       = extref( ( e ) ->
            log e
        )

        a_Position                  = malloc GLSLProcedure
        a_Position.parent           = vShader
        a_Position.targetClass      = ContextUpload
        a_Position.mallocEvent      = MALLOC_PER_UPLOAD
        a_Position.markEvent        = MARK_ONLY_REQUESTED
        a_Position.variable         = Text.from "a_Position"
        a_Position.function         = extref( (e) ->
            log "handle"
        )

        self.addEventListener "pointermove", ({clientX:x, clientY: y}) ->
            log x,y

        log u_ViewMatrix
        log a_Position