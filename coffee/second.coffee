#`import font from "./ibmplex.json" with { type: "json" }`

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
verticesBuffer = gl.createBuffer()
positionsBuffer = gl.createBuffer()
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
verticesBufferArray      = new Float32Array new ArrayBuffer 1e6

instanceCount = 1
lengthPerInstance = 3
bytesPerInstance = 12
maxInstanceCount = 100
positionsBufferArray = new Float32Array new ArrayBuffer maxInstanceCount * bytesPerInstance

u_ViewMatrix    = gl.getUniformLocation program, "u_ViewMatrix"
u_Color         = gl.getUniformLocation program, 'u_Color'

i_Position      = gl.getAttribLocation  program, 'i_Position'
a_Position      = gl.getAttribLocation  program, 'a_Position'
a_ModelMatrix   = gl.getAttribLocation  program, "a_ModelMatrix"

viewMatrix      = new M4.Camera 90, innerWidth/innerHeight, 0.1, 1e4
modelMatrix     = new M4.Identity()

glClearColor    = gl.clearColor.apply.bind gl.clearColor, gl, arrClearColor
glClear         = gl.clear.bind gl, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT


glVerticesOffset  = 0
glDrawTriangles = 0
glDrawPoints = 0


redefine = ->
    #rebind every time
    glDrawTriangles = gl.drawArraysInstanced.bind(
        gl, gl.TRIANGLES, 0, glVerticesOffset / 12, instanceCount
    )

    glDrawPoints = gl.drawArraysInstanced.bind(
        gl, gl.POINTS, 0, glVerticesOffset / 12, instanceCount
    )

Object.defineProperty verticesBufferArray, "resize", value : ( byteLength ) ->
    byteOffset = glVerticesOffset
    glVerticesOffset += byteLength

    gl.bindBuffer gl.ARRAY_BUFFER, verticesBuffer

    #resize allocated on glBuffer
    gl.bufferData(
        gl.ARRAY_BUFFER, @byteLength, gl.STATIC_DRAW
    )

    redefine()

    byteOffset

Object.defineProperty verticesBufferArray, "enable", value : ->

    gl.enableVertexAttribArray a_Position
    gl.vertexAttribPointer(
        a_Position,  # location
        3,           # size (num values to pull from buffer per iteration)
        gl.FLOAT,    # type of data in buffer
        false,       # normalize
        12,          # stride (0 = compute from size and type above)
        0,           # offset in buffer
    )

    0
    

Object.defineProperty positionsBufferArray, "instance", value : ->

    gl.bindBuffer gl.ARRAY_BUFFER, positionsBuffer

    byteOffset  = bytesPerInstance * instanceCount++
    begin       = byteOffset / 4
    length      = bytesPerInstance / 4
    end         = begin + length
    subarray    = @subarray begin, end

    gl.bindBuffer gl.ARRAY_BUFFER, positionsBuffer
    gl.bufferData gl.ARRAY_BUFFER, byteOffset + bytesPerInstance, gl.DYNAMIC_DRAW

    Object.defineProperty subarray, "upload", 
        value : ( arr ) ->
            @set arr if arr

            gl.bindBuffer gl.ARRAY_BUFFER, positionsBuffer
            gl.bufferSubData gl.ARRAY_BUFFER, @byteOffset, positionsBufferArray, begin, length
            gl.enableVertexAttribArray i_Position
            gl.vertexAttribPointer(
                i_Position,  # location
                3,           # size (num values to pull from buffer per iteration)
                gl.FLOAT,    # type of data in buffer
                false,       # normalize
                12,          # stride (0 = compute from size and type above)
                0,        # offset in buffer
            )

            redefine()

            this
        


Object.defineProperty verticesBufferArray, "malloc", value : ( pointCount ) ->    
    length = pointCount * 3
    byteLength = length * 4

    dstByteOffset = @resize byteLength

    begin = dstByteOffset / 4
    array = @subarray begin, begin + length

    Object.defineProperty array, "dstByteOffset",
        value : dstByteOffset

    Object.defineProperty array, "upload",
        value : ( values = [] ) ->
            @set values
            gl.bindBuffer gl.ARRAY_BUFFER, verticesBuffer
            gl.bufferSubData gl.ARRAY_BUFFER, @dstByteOffset, verticesBufferArray, begin, length

            gl.enableVertexAttribArray a_Position
            gl.vertexAttribPointer(
                a_Position,  # location
                3,           # size (num values to pull from buffer per iteration)
                gl.FLOAT,    # type of data in buffer
                false,       # normalize
                0,          # stride (0 = compute from size and type above)
                0,           # offset in buffer
            )

            this

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
            64,          # stride (0 = compute from size and type above)
            0,           # offset in buffer
        )

}

Object.defineProperties viewMatrix, {
    dx: { writable:1, value:  0 },
    dy: { writable:1, value:  0 },
    dz: { writable:1, value:-10 },
    
    rx: { writable:1, value:  0 },
    ry: { writable:1, value:  Math.PI },
    rz: { writable:1, value:  Math.PI/2 },

    sx: { writable:1, value:  1 },
    sy: { writable:1, value:  1 },
    sz: { writable:1, value:  1 },
    
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
        
    gl.vertexAttribDivisor i_Position, 1
    glViewport()
    glClearColor()
    glClear()


charMalloc = ( char ) ->
    vertices   = CHARCODE_VERTICES[ char.charCodeAt 0 ]
    pointCount = vertices.length / 3
    charBuffer = verticesBufferArray.malloc pointCount
    charBuffer . upload vertices
    verticesBufferArray . enable()

    charBuffer


init()

#_e00 = charMalloc("f")
verticesBufferArray.malloc(3).upload([
    4, -2, -1,
    -4, -2, 1,
    0, 2, -2,
])

xyz1 = positionsBufferArray.instance()
xyz2 = positionsBufferArray.instance()
xyz3 = positionsBufferArray.instance()
xyz1.upload([7, -1, 0])
xyz2.upload([5, -2, 0])
xyz3.upload([-5, 1, 0])


i = 0
j = 1
render = ->
    glClear()
    glDrawTriangles()
    glDrawPoints()

    
    viewMatrix.dx += 0.1 * j
    viewMatrix.dy -= 0.1 * j

    #viewMatrix.dz -= 0.01 * j
    #viewMatrix.rz += 0.01 * j
    viewMatrix.upload()

    xyz1[1] += 0.1 * j
    xyz2[0] += 0.3 * j
    xyz3[0] += 0.1 * j
    xyz3[1] += 0.02 * j
    xyz3[2] -= 0.05 * j

    xyz1.upload(xyz1)
    xyz2.upload(xyz2)
    xyz3.upload(xyz3)

    unless ++i % 60
        j *= -1

    requestAnimationFrame render

render()