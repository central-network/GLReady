export class BufGL2Screen extends Float32Array

    @byteLength     : 120
    
    readCanvas      : ( canvas ) ->

        { width, height, x: left, y: top } =
            ( @canvas = canvas ).getBoundingClientRect()

        [
            @left, @top, @width, @height,  
            @aspectRatio, @depth, @pixelRatio
        ] = [
            left , top , width , height , 
            width / height , width / 2 , 
            devicePixelRatio ? 1,
        ]

        @update()

    update          : ->
        @canvas.width  = @pixelRatio * @width
        @canvas.height = @pixelRatio * @height
        @canvas.style.backgroundColor = "rgba(
            #{@red  * 0xff}, #{@green * 0xff},
            #{@blue * 0xff}, #{@alpha * 0x01}
        )"
        
        this

    set             : ->
        @update super ...arguments

Object.defineProperties BufGL2Screen::,

    INDEX_WIDTH             : value : 0
    INDEX_HEIGHT            : value : 1
    INDEX_DEPTH             : value : 2
    INDEX_LEFT              : value : 3
    INDEX_TOP               : value : 4
    INDEX_BACKGROUND        : value : 5
    INDEX_RED               : value : 5
    INDEX_GREEN             : value : 6
    INDEX_BLUE              : value : 7
    INDEX_ALPHA             : value : 8
    INDEX_ASPECT_RATIO      : value : 9
    INDEX_PIXEL_RATIO       : value : 10

Object.defineProperties BufGL2Screen::,

    width       :
        get     : -> this[ @INDEX_WIDTH ]
        set     : -> @set arguments, @INDEX_WIDTH

    height      :
        get     : -> this[ @INDEX_HEIGHT ]
        set     : -> @set arguments, @INDEX_HEIGHT

    depth       :
        get     : -> this[ @INDEX_DEPTH ]
        set     : -> @set arguments, @INDEX_DEPTH

    left        :
        get     : -> this[ @INDEX_LEFT ]
        set     : -> @set arguments, @INDEX_LEFT

    top         :
        get     : -> this[ @INDEX_TOP ]
        set     : -> @set arguments, @INDEX_TOP

    background  :
        get     : -> @subarray @INDEX_BACKGROUND, @INDEX_BACKGROUND + 4
        set     : -> [ @red, @green, @blue, @alpha = 1 ] = arguments[ 0 ]

    red         :
        get     : -> this[ @INDEX_RED ]
        set     : -> @set arguments, @INDEX_RED

    green       :
        get     : -> this[ @INDEX_GREEN ]
        set     : -> @set arguments, @INDEX_GREEN

    blue        :
        get     : -> this[ @INDEX_BLUE ]
        set     : -> @set arguments, @INDEX_BLUE

    alpha       :
        get     : -> this[ @INDEX_ALPHA ]
        set     : -> @set arguments, @INDEX_ALPHA

    aspectRatio :
        get     : -> this[ @INDEX_ASPECT_RATIO ]
        set     : -> @set arguments, @INDEX_ASPECT_RATIO

    pixelRatio  :
        get     : -> this[ @INDEX_PIXEL_RATIO ]
        set     : -> @set arguments, @INDEX_PIXEL_RATIO
