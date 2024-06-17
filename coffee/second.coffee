#`import font from "./ibmplex.json" with { type: "json" }`
#sessionStorage.setItem "font", JSON.stringify font
#fetch("test.dump").then( (r) -> r.blob() ).then( (b) -> b.arrayBuffer() ).then (udp) -> 
#    sessionStorage.setItem "dump", new Uint8Array( udp ).join(" ")


{log,warn,error} = console

font = JSON.parse sessionStorage.font
dump = Uint8Array.from sessionStorage.dump.split " "

delay = -> new Promise (done) =>
    setTimeout done, arguments[0] or 1000

Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI
    powsum          : value : ( arr, pow = 2 ) ->
        [ ...arr ].flat().reduce (a, b) -> a + Math.pow b, pow

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
    
    ux = null
    gl = document.getElementById("gl").getContext "webgl2"
    iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
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


    Object.assign self, text : {
        vertices    : font
        letters     : {}
        chars       : []

        charCount   : 0
        letterCount : 0
        byteLength  : 0
        
        lineCount   : 0
        lineWidth   : 100
        lineHeight  : 10
        letterSpace : 1
        spaceWidth  : 5
        fontSize    : 12
        monospace   : on
        

        width       : -300
        height      : +300
        depth       : -300
        length      : 0
        
        buffer      : buf = new ArrayBuffer 1e6 * ( 12 + 16 )
        view        : new DataView buf
        attributes  : new Float32Array buf 

        a_Position  : a_Position
        a_Color     : a_Color

        draw        : ( force = on ) ->

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
            offset = +28 * index

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

            byteOffset = 0
            for instances in @chars
                instances.byteOffset    = byteOffset
                instances.needsUpload   = 1
                instances.needsRebind   = 1
                instances.needsColor    = 1
                byteOffset = byteOffset +
                    (  instances.length * 28  )    

            @attributes.set( attributes )

            instance.x = if !@monospace then (
                @width + chars.left
            ) else @width + @letterSpace - chars.width/2

            instance.y = @height
            instance.z = @depth

            instance.r = Math.random()
            instance.a = 1 

            @width += if !@monospace then (
                @letterSpace + chars.width 
            ) else @letterSpace * 8

            attributes = null

            instance
            
        write       : ( text, delays = 40 ) ->
            
            if  delays > 0
                @delay = clearTimeout( @delay ) or setTimeout =>
                    @char letter for letter in "#{text}" 
                ,delays

            else for l in "#{text}" then @char l
                
            0

    }        

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
                
    do  writeUDPDump = ->

        text.width += 125
        zero = text.width

        length = dump.length
        offset = 0
        length = 16 * 32

        while offset < length
            text.write (dump[ offset++ ].toString(16)).padStart(2, "0") + " ", no
            text.write (dump[ offset++ ].toString(16)).padStart(2, "0") + " ", no
            text.write (dump[ offset++ ].toString(16)).padStart(2, "0") + " ", no
            text.write (dump[ offset++ ].toString(16)).padStart(2, "0") + " ", no
            text.char " "

            unless offset % 16
                text.height -= 20
                text.width = zero

    scrollDump = ( height, step = 120, fn = "easeOutQuint" ) ->
        
        
        for ls in text.chars then for l in ls

            l.steps = new Float32Array step
            i = -1
            
            while ++i < step then l.steps[i] =
                easing[ fn ]( i / step ) * height + l.y
                    
        i = -1
        queueIndex = -1 + renderQueue.push ->

            if  ++i < step

                for l in text.chars then for instance in l
                    instance.y = instance.steps[ i ]

                return 0

            renderQueue.splice queueIndex, 1
    
    i = 0
    j = 1

    render = ( t ) ->
        text.draw()

        unless i % 240
            scrollDump( 160 * j )

        job t for job in renderQueue
        requestAnimationFrame render

        j *= -1 unless ++i % 240

    render 0