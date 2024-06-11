#`import font from "./ibmplex.json" with { type: "json" }`
#sessionStorage.setItem "font", JSON.stringify font


{log,warn,error} = console



Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI
    powsum          : value : ( arr, pow = 2 ) ->
        [ ...arr ].flat().reduce (a, b) -> a + Math.pow b, pow

export class M4                 extends Float32Array

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

CHARCODE_VERTICES = JSON.parse sessionStorage.font

gl = document.getElementById("gl").getContext "webgl2"
iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
verticesGLBuffer = gl.createBuffer()
bufferInstancesInfo = gl.createBuffer()
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

BYTES_PER_VERTEX = 12
BYTES_PER_INSTANCE = 12
maxInstanceCount = 100

verticesBufferArray  = new Float32Array new ArrayBuffer 1e6
arrayInstancesInfo = new Float32Array new ArrayBuffer maxInstanceCount * BYTES_PER_INSTANCE

gl.bindBuffer gl.ARRAY_BUFFER, verticesGLBuffer
gl.bufferData gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW

gl.bindBuffer gl.ARRAY_BUFFER, bufferInstancesInfo
gl.bufferData gl.ARRAY_BUFFER, arrayInstancesInfo.byteLength, gl.DYNAMIC_READ

u_ViewMatrix    = gl.getUniformLocation program, "u_ViewMatrix"
u_Color         = gl.getUniformLocation program, 'u_Color'

i_Position      = gl.getAttribLocation  program, 'i_Position'
a_Position      = gl.getAttribLocation  program, 'a_Position'
a_ModelMatrix   = gl.getAttribLocation  program, "a_ModelMatrix"

viewMatrix      = new M4.Camera 90, innerWidth/innerHeight, 0.01, 1e5
modelMatrix     = new M4.Identity()

glClearColor    = gl.clearColor.apply.bind gl.clearColor, gl, arrClearColor
glClear         = gl.clear.bind gl, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT


drawTriangles   = ->
drawPoints      = ->


reup = ( offset ) ->

    gl.enableVertexAttribArray i_Position
    gl.vertexAttribPointer(
        i_Position,  # location
        3,           # size (num values to pull from buffer per iteration)
        gl.FLOAT,    # type of data in buffer
        false,       # normalize
        0, # stride (0 = compute from size and type above)
        offset  # offset in buffer
    )
    
    gl.vertexAttribDivisor i_Position, 1


Object.defineProperty verticesBufferArray, "upload", value : ( array ) ->    

    pointCount  = array.length / 3
    length      = array.length
    
    byteOffset  = verticesOffset
    byteLength  = length * 4

    begin       = byteOffset / 4
    subarray    = @subarray begin, begin + length

    verticesOffset =
        byteLength + verticesOffset

    subarray.set array

    gl.bufferSubData(
        gl.ARRAY_BUFFER, byteOffset,
        verticesBufferArray, begin, length
    )

    Object.defineProperties subarray,
        start : value : byteOffset / BYTES_PER_VERTEX
        count : value : pointCount
        clone : value : 0, writable: on
        instanceOffset : value : 0, writable: on

    ( (vertices) ->

        Object.defineProperty vertices, "instance", get : ->

            ++@clone

            instanceByteOffset  = BYTES_PER_INSTANCE * instanceCount++
            instanceLength      = BYTES_PER_INSTANCE / 4
            instanceBegin       = instanceByteOffset / 4
            instanceEnd         = instanceBegin + instanceLength
            instanceSubarray    = arrayInstancesInfo.subarray instanceBegin, instanceEnd

            return ( ( instance ) ->
                translateX : -> instance[0] += arguments[0]
                translateY : -> instance[1] += arguments[0]
                translateZ : -> instance[2] += arguments[0]
            )( instanceSubarray )

    )(subarray)
                       
    subarray

Object.defineProperties modelMatrix, {
    dx: { writable:1, value:  0 },
    dy: { writable:1, value:  0 },
    dz: { writable:1, value:  0 },
    
    rx: { writable:1, value:  0 },
    ry: { writable:1, value:  0 },
    rz: { writable:1, value:  0 },

    sx: { writable:1, value:  1 },
    sy: { writable:1, value:  1 },
    sz: { writable:1, value:  1 },
    
    location    : value : gl.getAttribLocation( program, "a_ModelMatrix" )
    upload      : value : ( mat4 ) ->
        @set mat4 if mat4
        gl.enableVertexAttribArray @location
        gl.vertexAttribPointer(
            @location,  # location
            4,           # size (num values to pull from buffer per iteration)
            gl.FLOAT,    # type of data in buffer
            false,       # normalize
            16,          # stride (0 = compute from size and type above)
            0,           # offset in buffer
        )

}

Object.defineProperties viewMatrix, {
    dx: { writable:1, value:  0 },
    dy: { writable:1, value:  0 },
    dz: { writable:1, value: -100 },
    
    rx: { writable:1, value: 0 },
    ry: { writable:1, value: 0 },
    rz: { writable:1, value: 0 },

    sx: { writable:1, value: 1 },
    sy: { writable:1, value: 1 },
    sz: { writable:1, value: 1 },
    
    location: value : gl.getUniformLocation( program, "u_ViewMatrix" )
}
    
Object.defineProperty viewMatrix, "upload", value : ->
    gl.uniformMatrix4fv @location, no,
        @slice()
            .translate @dx, @dy, @dz
            .rotate @rx, @ry, @rz
            .scale @sx, @sy, @sz
    0

init = ->
    glViewport = ->
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
        
    glViewport()
    glClearColor()
    glClear()

    gl.bindBuffer gl.ARRAY_BUFFER, verticesGLBuffer
    gl.bufferData gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW

    gl.enableVertexAttribArray i_Position
    gl.vertexAttribDivisor i_Position, 1

    gl.enableVertexAttribArray a_Position
    gl.vertexAttribPointer(
        a_Position,  # location
        3,           # size (num values to pull from buffer per iteration)
        gl.FLOAT,    # type of data in buffer
        false,       # normalize
        0, # stride (0 = compute from size and type above)
        0  # offset in buffer
    )


charMalloc = ( char ) ->
    vertices   = CHARCODE_VERTICES[ char.charCodeAt 0 ]
    pointCount = vertices.length / 3
    charBuffer = verticesBufferArray.malloc pointCount
    charBuffer . upload vertices
    charBuffer


init()


text = {
    letters : {}
    lineCount : 0
    letterCount : 0
    letterCount : 0
    length : 0
    
    charCount   : 0
    lineWidth   : 100
    lineHeight  : 10
    letterSpace : 6.0
    offsetLeft  : 0
    
    positions : new Float32Array new ArrayBuffer 0, maxByteLength : 400 * 12

    rebind : -> for char, info of @letters

        Object.defineProperty info, "vertexAttribPointer",
            configurable: on
            value : gl.vertexAttribPointer.bind(
                gl, i_Position, 3, gl.FLOAT, false, 12, info.offset
            )

        Object.defineProperty info, "drawArraysInstanced",
            configurable: on
            value : gl.drawArraysInstanced.bind(
                gl, gl.TRIANGLES, info.model.start, info.model.count,  info.model.clone
            )     

        Object.defineProperty info, "bufferSubData",
            configurable: on
            value : gl.bufferSubData.bind(
                gl, gl.ARRAY_BUFFER, info.offset, text.positions.slice(), info.begin, info.length * 3
            )     

        info

    draw : ( force = on ) ->
        for k, l of @letters when force or l.needsUpload
            l.bufferSubData()
            l.vertexAttribPointer()
            l.drawArraysInstanced()
            l.needsUpload = 0 
}

textBufferView = new DataView text.positions.buffer

writeLetter = ( letter ) ->

    text.letterCount += 1

    if !l = text.letters[ letter ]
        l = text.letters[ letter ] = []

        charCode = letter.charCodeAt 0

        Object.defineProperty l, "begin",
            value : text.length
            writable: on

        Object.defineProperty l, "offset",
            value : text.length * 4
            writable: on

        Object.defineProperty l, "model",
            value : verticesBufferArray.upload(
                vertices = CHARCODE_VERTICES[ charCode ]
            )

        if  vertices.length % 3
            throw [ MOD_TRIANGLE: letter ]

        min = +Infinity
        max = -Infinity
        len = vertices.length
        i = 0
        
        while i < len
            if  null isnt val = vertices[i]
                if  val > max 
                    max = val

                if  min > val
                    min = val
            i += 3
        
        Object.defineProperties l,
            xMax  : value : max
            xMin  : value : min
            width : value : max - min
            offsetLeft : value : (
                (text.letterSpace / 2) -
                ((max - min) / 2)
            )

    text.positions.buffer.resize(
        ( text.length += 3 ) * 4
    )

    next = no
    for char, info of text.letters
        if  next is on
            text.positions.copyWithin(
                info.begin + 3, info.begin
            )
            next = -1
        
        if  next is -1
            info.begin += 3
            info.offset += 12
            continue

        next = char is letter

            
    letterIndex     = Object.keys( text.letters ).indexOf letter
    instanceIndex   = -1 + l.push instance = l.model.instance
    attributeOffset = ( l.begin + instanceIndex * 3 ) * 4

    prop = ->
        (( letter, byteOffset ) ->
            configurable : on
            get : textBufferView.getFloat32.bind textBufferView, byteOffset, iLE
            set : ( value ) ->
                l.needsUpload = !textBufferView.setFloat32 @l.offset + @i, value, iLE
        )(letter, arguments[0])

    Object.defineProperties instance,
        i : value : instanceIndex * 12
        l : value : l
        x : prop attributeOffset
        y : prop attributeOffset + 4
        z : prop attributeOffset + 8

    left = text.letterSpace * text.charCount++
    top  = Math.trunc left / text.lineWidth

    instance.x = text.offsetLeft + l.width/2
    #instance.y = top * text.lineHeight 

    text.offsetLeft += l.width + 5

    log letter, text.offsetLeft, l.width/2

    l.needsUpload = 1
    instance

log text.positions.slice 0

writeLetter "f"
log text.positions.slice 0

writeLetter "e"
log text.positions.slice 0
writeLetter "f"
log text.positions.slice 0
writeLetter "b"
log text.positions.slice 0
writeLetter "c"
log text.positions.slice 0
writeLetter "2"
log text.length


log text.rebind()
log text.positions.slice 0


i = 0
j = 1
render = ->
    text.draw()
        
    viewMatrix.dx += 0.4 * j
    #viewMatrix.dy += 0.4 * j
    viewMatrix.upload()

    unless ++i % 120
        j *= -1


    requestAnimationFrame render

render()