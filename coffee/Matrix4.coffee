Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI
    powsum          : value : ( arr, pow = 2 ) ->
        [ ...arr ].flat().reduce (a, b) -> a + Math.pow b, pow

export class Matrix4 extends Float32Array

    @byteLength : 64

    #? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html

    Object.defineProperty this, "identity", get : ->
        new Matrix4 [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            0,  0,  0,  1,
        ] 

    Object.defineProperty this::, "position", get : ->
        @subarray 12, 15

    @fromVec3   = ( vec3 ) ->
        new Matrix4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
              ... vec3,  1,
        ]

    modifyVertex : ( vertex ) ->
        vertex.position.set Matrix4.multiply(
            this, Matrix4::translation ...vertex
        ).position

    multiply    : ( b ) -> @set( Matrix4.multiply @, b ); this

    @multiply   = ( a, b ) ->
        a00 = a[0 * 4 + 0]; a01 = a[0 * 4 + 1]; a02 = a[0 * 4 + 2]; a03 = a[0 * 4 + 3]
        a10 = a[1 * 4 + 0]; a11 = a[1 * 4 + 1]; a12 = a[1 * 4 + 2]; a13 = a[1 * 4 + 3]
        a20 = a[2 * 4 + 0]; a21 = a[2 * 4 + 1]; a22 = a[2 * 4 + 2]; a23 = a[2 * 4 + 3] 
        a30 = a[3 * 4 + 0]; a31 = a[3 * 4 + 1]; a32 = a[3 * 4 + 2]; a33 = a[3 * 4 + 3]

        b00 = b[0 * 4 + 0]; b01 = b[0 * 4 + 1]; b02 = b[0 * 4 + 2]; b03 = b[0 * 4 + 3] 
        b10 = b[1 * 4 + 0]; b11 = b[1 * 4 + 1]; b12 = b[1 * 4 + 2]; b13 = b[1 * 4 + 3] 
        b20 = b[2 * 4 + 0]; b21 = b[2 * 4 + 1]; b22 = b[2 * 4 + 2]; b23 = b[2 * 4 + 3] 
        b30 = b[3 * 4 + 0]; b31 = b[3 * 4 + 1]; b32 = b[3 * 4 + 2]; b33 = b[3 * 4 + 3]
        
        new Matrix4 [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
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
        new Matrix4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
            tx,  0,  0,  1,
        ]

    yTranslation : ( ty = 0 ) ->
        new Matrix4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
             0, ty,  0,  1,
        ]

    zTranslation : ( tz = 0 ) ->
        new Matrix4 [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
             0,  0, tz,  1,
        ]

    xRotation   : ( angleInRadians = 0 ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians

        new Matrix4 [
             1,  0,  0,  0,
             0,  c,  s,  0,
             0, -s,  c,  0,
             0,  0,  0,  1,
        ]

    yRotation   : ( angleInRadians = 0 ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians
        
        new Matrix4 [
             c,  0, -s,  0,
             0,  1,  0,  0,
             s,  0,  c,  0,
             0,  0,  0,  1,
        ]

    zRotation   : ( angleInRadians = 0 ) ->
        c = Math.cos angleInRadians
        s = Math.sin angleInRadians
        
        new Matrix4 [
             c,  s,  0,  0,
            -s,  c,  0,  0,
             0,  0,  1,  0,
             0,  0,  0,  1,
        ]

    scaling     : ( sx, sy, sz ) ->
        sz ?= ( sy ?= ( sx ?= 1 ) ) 
        new Matrix4 [
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

    toPerspective : ( yFov, rAspect, zNear, zFar ) ->

        f = Math.tan Math.PI/2 - yFov/2
        rangeInv = 1.0 / ( zNear - zFar )

        @set [
            f / rAspect,   0,                             0,    0,
            0,             f,                             0,    0,
            0,             0,     (zNear + zFar) * rangeInv,   -1,
            0,             0, (zNear * zFar) * rangeInv * 2,    0
        ]

        ; @

export default Matrix4