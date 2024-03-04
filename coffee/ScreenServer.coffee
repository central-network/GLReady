import Pointer from "./Pointer.coffee"

OFFSET_WIDTH        = 4 * 0
OFFSET_HEIGHT       = 4 * 1
OFFSET_DEPTH        = 4 * 2
OFFSET_LEFT         = 4 * 3
OFFSET_TOP          = 4 * 4

OFFSET_RED          = 4 * 5
OFFSET_GREEN        = 4 * 6
OFFSET_BLUE         = 4 * 7
OFFSET_ALPHA        = 4 * 8
OFFSET_ASPECT_RATIO = 4 * 9
OFFSET_PIXEL_RATIO  = 4 * 10

OFFSET_BACKGROUND   = OFFSET_RED
LENGTH_BACKGROUND   = 4

export length       = 32
export byteLength   = 4 * length

export class ScreenClient extends Pointer

    @byteLength     : byteLength

    Object.defineProperties ScreenClient::,
        width       : get : -> @getFloat32 OFFSET_WIDTH 
        height      : get : -> @getFloat32 OFFSET_HEIGHT 
        depth       : get : -> @getFloat32 OFFSET_DEPTH 
        left        : get : -> @getFloat32 OFFSET_LEFT 
        top         : get : -> @getFloat32 OFFSET_TOP 
        red         : get : -> @getFloat32 OFFSET_RED 
        green       : get : -> @getFloat32 OFFSET_GREEN 
        blue        : get : -> @getFloat32 OFFSET_BLUE 
        alpha       : get : -> @getFloat32 OFFSET_ALPHA 
        aspectRatio : get : -> @getFloat32 OFFSET_ASPECT_RATIO 
        pixelRatio  : get : -> @getFloat32 OFFSET_PIXEL_RATIO 
        background  : get : -> @subFloat32 OFFSET_BACKGROUND, LENGTH_BACKGROUND    


export class ScreenServer extends Pointer

    @byteLength     : byteLength
    @TypedArray     : Float32Array

    bind            : ( canvas ) ->

        { width, height, x: left, y: top } =
            canvas.getBoundingClientRect()

        [
            @left, @top, @width, @height,  
            @aspectRatio, @depth, @pixelRatio
        ] = [
            left , top , width , height , 
            width / height , width / 2 , 
            devicePixelRatio ? 1,
        ]

        Object.defineProperty this, "canvas", get : -> canvas

        @update()

    update          : ->
        @canvas.width  = @pixelRatio * @width
        @canvas.height = @pixelRatio * @height
        @canvas.style.backgroundColor = "rgba(
            #{@red  * 0xff}, #{@green * 0xff},
            #{@blue * 0xff}, #{@alpha * 0x01}
        )"
        
        this

    Object.defineProperties this::,

        width       :
            get     : -> @getFloat32 OFFSET_WIDTH 
            set     : -> @setFloat32 OFFSET_WIDTH, arguments[0]

        height      :
            get     : -> @getFloat32 OFFSET_HEIGHT 
            set     : -> @setFloat32 OFFSET_HEIGHT, arguments[0]

        depth       :
            get     : -> @getFloat32 OFFSET_DEPTH 
            set     : -> @setFloat32 OFFSET_DEPTH, arguments[0]

        left        :
            get     : -> @getFloat32 OFFSET_LEFT 
            set     : -> @setFloat32 OFFSET_LEFT, arguments[0]

        top         :
            get     : -> @getFloat32 OFFSET_TOP 
            set     : -> @setFloat32 OFFSET_TOP, arguments[0]

        red         :
            get     : -> @getFloat32 OFFSET_RED 
            set     : -> @setFloat32 OFFSET_RED, arguments[0]

        green       :
            get     : -> @getFloat32 OFFSET_GREEN 
            set     : -> @setFloat32 OFFSET_GREEN, arguments[0]

        blue        :
            get     : -> @getFloat32 OFFSET_BLUE 
            set     : -> @setFloat32 OFFSET_BLUE, arguments[0]

        alpha       :
            get     : -> @getFloat32 OFFSET_ALPHA 
            set     : -> @setFloat32 OFFSET_ALPHA, arguments[0]

        aspectRatio :
            get     : -> @getFloat32 OFFSET_ASPECT_RATIO 
            set     : -> @setFloat32 OFFSET_ASPECT_RATIO, arguments[0]

        pixelRatio  :
            get     : -> @getFloat32 OFFSET_PIXEL_RATIO 
            set     : -> @setFloat32 OFFSET_PIXEL_RATIO, arguments[0]

        background  :
            get     : -> @subFloat32 OFFSET_BACKGROUND, LENGTH_BACKGROUND
            set     : -> [ @red, @green, @blue, @alpha = 1 ] = arguments[ 0 ]
