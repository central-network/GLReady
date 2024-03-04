import Pointer from "./Pointer.coffee"

OFFSET_MOVING   = 4 * 10
OFFSET_JUMPING  = 4 * 11
OFFSET_SHIFT    = 4 * 12
OFFSET_ALT      = 4 * 13
OFFSET_CTRL     = 4 * 14
OFFSET_META     = 4 * 15
OFFSET_FORWARD  = 4 * 16
OFFSET_BACKWARD = 4 * 17
OFFSET_LEFT     = 4 * 18
OFFSET_RIGHT    = 4 * 19
OFFSET_UP       = 4 * 20
OFFSET_DOWN     = 4 * 21
OFFSET_LOOKING  = 4 * 22
OFFSET_ZOOMING  = 4 * 23
OFFSET_DBLCLICK = 4 * 24
OFFSET_CLICK    = 4 * 25
OFFSET_ROTATING = 4 * 26
OFFSET_DRAGING  = 4 * 27

OFFSET_VALUES   = 4 * 30
OFFSET_X        = 4 * 31
OFFSET_Y        = 4 * 32
OFFSET_DX       = 4 * 34
OFFSET_DY       = 4 * 35
OFFSET_RX       = 4 * 37
OFFSET_RY       = 4 * 38
OFFSET_SX       = 4 * 40
OFFSET_SY       = 4 * 41
OFFSET_SZ       = 4 * 42
OFFSET_VX       = 4 * 43
OFFSET_VY       = 4 * 44
OFFSET_VZ       = 4 * 45
OFFSET_FACTOR   = 4 * 46
OFFSET_TIME     = 4 * 47

export length       = 1 * 64
export byteLength   = 4 * length

export class BindClient extends Pointer

    @byteLength : byteLength

    @easing     :
        linearInOut : ( v ) ->
            #don't split in/out, no need to check is reached top
            [ ...[ 0 ... 10 ], ...[ 10 .. 0 ] ].map (d) -> v * d/10 

    Object.defineProperties this::,
        moving      : get     : -> @getInt32 OFFSET_MOVING 
        jumping     : get     : -> @getInt32 OFFSET_JUMPING 
        shift       : get     : -> @getInt32 OFFSET_SHIFT 
        alt         : get     : -> @getInt32 OFFSET_ALT 
        ctrl        : get     : -> @getInt32 OFFSET_CTRL 
        meta        : get     : -> @getInt32 OFFSET_META 
        forward     : get     : -> @getInt32 OFFSET_FORWARD 
        backward    : get     : -> @getInt32 OFFSET_BACKWARD 
        left        : get     : -> @getInt32 OFFSET_LEFT 
        right       : get     : -> @getInt32 OFFSET_RIGHT 
        up          : get     : -> @getInt32 OFFSET_UP 
        down        : get     : -> @getInt32 OFFSET_DOWN 
        looking     : get     : -> @getInt32 OFFSET_LOOKING 
        zooming     : get     : -> @getInt32 OFFSET_ZOOMING 
        dblclick    : get     : -> @getInt32 OFFSET_DBLCLICK 
        click       : get     : -> @getInt32 OFFSET_CLICK 
        rotating    : get     : -> @getInt32( OFFSET_LOOKING ) and @getInt32( OFFSET_ROTATING )
        draging     : get     : -> @getInt32( OFFSET_LOOKING ) and @getInt32( OFFSET_DRAGING )
        running     : get     : -> @getInt32( OFFSET_MOVING  ) and @getInt32( OFFSET_SHIFT )
        x           : get     : -> @getFloat32 OFFSET_X 
        dx          : get     : -> @getFloat32 OFFSET_DX 
        rx          : get     : -> @getFloat32 OFFSET_RX 
        sx          : get     : -> @getFloat32 OFFSET_SX 
        vx          : get     : -> @getFloat32 OFFSET_VX 
        y           : get     : -> @getFloat32 OFFSET_Y 
        dy          : get     : -> @getFloat32 OFFSET_DY 
        ry          : get     : -> @getFloat32 OFFSET_RY 
        sy          : get     : -> @getFloat32 OFFSET_SY 
        vy          : get     : -> @getFloat32 OFFSET_VY 
        sz          : get     : -> @getFloat32 OFFSET_SZ 
        vz          : get     : -> @getFloat32 OFFSET_VZ 
        factor      : get     : -> @getFloat32 OFFSET_FACTOR 
        time        : get     : -> @getFloat32 OFFSET_TIME 

export class BindServer extends Pointer

    @byteLength : BindClient.byteLength

    @easing     : BindClient.easing

    bind : ( canvas ) ->
        canvas.addEventListener "pointerup",    @pointerup.bind @
        canvas.addEventListener "pointermove",  @pointermove.bind( @ ), passive: !0
        canvas.addEventListener "pointerdown",  @pointerdown.bind @
        canvas.addEventListener "dblclick",     @doubleclick.bind @
        canvas.addEventListener "wheel",        @wheel.bind( @ ), passive: !0
        canvas.addEventListener "contextmenu",  @contextmenu.bind @
        
        document = canvas.ownerDocument
        document.addEventListener "keyup",      @keyup.bind @
        document.addEventListener "keydown",    @keydown.bind @ 

        @factor = 5

        null

    contextmenu : ( e ) ->
        e.preventDefault()

    wheel       : ( e ) ->
        { @deltaX , @deltaY } = e
        ( @zooming = 1 )
    
    pointermove : ( e ) ->
        { @offsetX , @offsetY } = e
        ( @looking = 1 )
    
    pointerup   : ( e ) ->
        ( @release = e.button )
    
    doubleclick : ( e ) ->
        ( @dblclick = e.button )
    
    pointerdown : ( e ) ->
        ( @press = e.button )

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

        [ @vx, @vz ] = if @right

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
        @vz *= factor
        @vy *= @factor

        null

Object.defineProperties BindServer::,

    moving      :
        get     : -> @getInt32 OFFSET_MOVING 
        set     : -> @setInt32 OFFSET_MOVING, arguments[ 0 ]

    jumping     :
        get     : -> @getInt32 OFFSET_JUMPING
        set     : -> @setInt32 OFFSET_JUMPING, arguments[ 0 ]

    shift       :
        get     : -> @getInt32 OFFSET_SHIFT
        set     : -> @setInt32 OFFSET_SHIFT, arguments[ 0 ]

    alt         :
        get     : -> @getInt32 OFFSET_ALT
        set     : -> @setInt32 OFFSET_ALT, arguments[ 0 ]

    ctrl        :
        get     : -> @getInt32 OFFSET_CTRL
        set     : -> @setInt32 OFFSET_CTRL, arguments[ 0 ]

    meta        :
        get     : -> @getInt32 OFFSET_META
        set     : -> @setInt32 OFFSET_META, arguments[ 0 ]

    forward     :
        get     : -> @getInt32 OFFSET_FORWARD
        set     : -> @setInt32 OFFSET_FORWARD, arguments[ 0 ]

    backward    :
        get     : -> @getInt32 OFFSET_BACKWARD
        set     : -> @setInt32 OFFSET_BACKWARD, arguments[ 0 ]

    left        :
        get     : -> @getInt32 OFFSET_LEFT
        set     : -> @setInt32 OFFSET_LEFT, arguments[ 0 ]

    right       :
        get     : -> @getInt32 OFFSET_RIGHT
        set     : -> @setInt32 OFFSET_RIGHT, arguments[ 0 ]

    up          :
        get     : -> @getInt32 OFFSET_UP
        set     : -> @setInt32 OFFSET_UP, arguments[ 0 ]

    down        :
        get     : -> @getInt32 OFFSET_DOWN
        set     : -> @setInt32 OFFSET_DOWN, arguments[ 0 ]

    looking     :
        get     : -> @getInt32 OFFSET_LOOKING
        set     : -> @setInt32 OFFSET_LOOKING, arguments[ 0 ]
        
    zooming     :
        get     : -> @getInt32 OFFSET_ZOOMING
        set     : -> @setInt32 OFFSET_ZOOMING, arguments[ 0 ]

    dblclick    :
        get     : -> @getInt32 OFFSET_DBLCLICK
        set     : -> @setInt32 OFFSET_DBLCLICK, arguments[ 0 ]

    click       :
        get     : -> @getInt32 OFFSET_CLICK
        set     : -> @setInt32 OFFSET_CLICK, arguments[ 0 ]

    x           :
        get     : -> @getFloat32 OFFSET_X
        set     : -> @setFloat32 OFFSET_X, arguments[ 0 ]
            
    dx          :
        get     : -> @getFloat32 OFFSET_DX
        set     : -> @setFloat32 OFFSET_DX, arguments[ 0 ]
            
    rx          :
        get     : -> @getFloat32 OFFSET_RX
        set     : -> @setFloat32 OFFSET_RX, arguments[ 0 ]
            
    sx          :
        get     : -> @getFloat32 OFFSET_SX
        set     : -> @setFloat32 OFFSET_SX, arguments[ 0 ]
            
    vx          :
        get     : -> @getFloat32 OFFSET_VX
        set     : -> @setFloat32 OFFSET_VX, arguments[ 0 ]
            
    y           :
        get     : -> @getFloat32 OFFSET_Y
        set     : -> @setFloat32 OFFSET_Y, arguments[ 0 ]
            
    dy          :
        get     : -> @getFloat32 OFFSET_DY
        set     : -> @setFloat32 OFFSET_DY, arguments[ 0 ]
            
    ry          :
        get     : -> @getFloat32 OFFSET_RY
        set     : -> @setFloat32 OFFSET_RY, arguments[ 0 ]
            
    sy          :
        get     : -> @getFloat32 OFFSET_SY
        set     : -> @setFloat32 OFFSET_SY, arguments[ 0 ]
            
    vy          :
        get     : -> @getFloat32 OFFSET_VY
        set     : -> @setFloat32 OFFSET_VY, arguments[ 0 ]
        
    sz          :
        get     : -> @getFloat32 OFFSET_SZ
        set     : -> @setFloat32 OFFSET_SZ, arguments[ 0 ]
        
    vz          :
        get     : -> @getFloat32 OFFSET_VZ
        set     : -> @setFloat32 OFFSET_VZ, arguments[ 0 ]
            
    factor      :
        get     : -> @getFloat32 OFFSET_FACTOR
        set     : -> @setFloat32 OFFSET_FACTOR, arguments[ 0 ]

    time        :
        get     : -> @getFloat32 OFFSET_TIME
        set     : ->
            @erase OFFSET_LOOKING, OFFSET_EVENTS
            @setFloat32 OFFSET_TIME, arguments[ 0 ]

    press       : 
        set     : -> @setUint8 @click, arguments[ 0 ], 1

    release     : 
        set     : -> @setUint8 arguments[ 0 ], 0

    rotating    :
        get     : -> @looking and @getUint8 0 

    draging     :
        get     : -> @looking and @getUint8 2 

    running     :
        get     : -> @moving and @shift

    offsetX     :
        set     : ( x ) ->
            @dx = -@x + (@x = x)
            @ry = ( - @dx / 100 ) % Math.PI

    offsetY     :
        set     : ( y ) ->
            @dy = +@y - (@y = y)
            @rx = ( - @dy / 100 ) % Math.PI

    deltaX      :
        set     : ( x ) ->
            @sx = ( x )

    deltaY      :
        set     : ( y ) ->
            @sz = ( @sy = y ) / 100
