export default class Bind extends EventTarget

    #don't split in/out, no need to check is reached top
    linearInOut : [ ...[ 0 ... 100 ], ...[ 100 ... 0 ] ]

    constructor : ( canvas, buffer = new SharedArrayBuffer 80 ) ->

        super()

        events = new Uint8Array buffer, 0, 24       #? 24 bytes
        values = new Float32Array buffer, 24, 14    #? 56 bytes
                                                    #> 80 bytes
        
        Object.defineProperties this,

            press       : 
                set     : -> events[ @click = arguments[ 0 ] ] = 1

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
                    @sz = ( @sy = arguments[ 0 ] ) / 100

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
                set     : -> values[  1 ] = arguments[ 0 ]
                    
            rx          :
                get     : -> values[  2 ]
                set     : -> values[  2 ] = arguments[ 0 ]
                    
            sx          :
                get     : -> values[  3 ]
                set     : -> values[  3 ] = arguments[ 0 ]
                    
            vx          :
                get     : -> values[  4 ]
                set     : -> values[  4 ] = arguments[ 0 ]
                    
            y           :
                get     : -> values[  5 ]
                set     : -> values[  5 ] = arguments[ 0 ]
                    
            dy          :
                get     : -> values[  6 ]
                set     : -> values[  6 ] = arguments[ 0 ]
                    
            ry          :
                get     : -> values[  7 ]
                set     : -> values[  7 ] = arguments[ 0 ]
                    
            sy          :
                get     : -> values[  8 ]
                set     : -> values[  8 ] = arguments[ 0 ]
                    
            vy          :
                get     : -> values[  9 ]
                set     : -> values[  9 ] = arguments[ 0 ]
                
            sz          :
                get     : -> values[ 10 ]
                set     : -> values[ 10 ] = arguments[ 0 ]
                
            vz          :
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
