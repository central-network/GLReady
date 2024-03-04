import Matrix4 from "./Matrix4.coffee"
import Pointer from "./Pointer.coffee"

OFFSET_Y_FOV        = 4 * 16
OFFSET_A_RATIO      = 4 * 17
OFFSET_Z_NEAR       = 4 * 18
OFFSET_Z_FAR        = 4 * 19

export class CameraServer extends Pointer
    @byteLength : 4 * 20
    @TypedArray : Float32Array

    Object.defineProperties this::,

        matrix  :
            get : -> new Matrix4 @buffer, @byteOffset, 16
            set : -> @matrix.set arguments[0]

        yFov    :
            get : -> @getFloat32 OFFSET_Y_FOV
            set : -> @setFloat32 OFFSET_Y_FOV, arguments[0]

        aRatio  :
            get : -> @getFloat32 OFFSET_A_RATIO
            set : -> @setFloat32 OFFSET_A_RATIO, arguments[0]

        zNear   :
            get : -> @getFloat32 OFFSET_Z_NEAR
            set : -> @setFloat32 OFFSET_Z_NEAR, arguments[0]

        zFar    :
            get : -> @getFloat32 OFFSET_Z_FAR
            set : -> @setFloat32 OFFSET_Z_FAR, arguments[0]


export class Perspective extends CameraServer

    @create     : ( yFov, aRatio, zNear, zFar ) ->

        ptr = new this malloc this.byteLength 

        ptr.matrix.toPerspective(
            ptr.yFov   = yFov, 
            ptr.aRatio = aRatio,
            ptr.zNear  = zNear,
            ptr.zFar   = zFar
        )

        ptr

export default CameraServer