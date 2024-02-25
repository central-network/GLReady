export default class Bind extends EventTarget

    constructor : ( canvas, buffer = new SharedArrayBuffer 256 ) ->

        super()

        events = new Uint8Array buffer, 0, 24
        positions = new Float32Array buffer, 24, 16
        
        Object.defineProperties this,

            press       : 
                set     : -> Atomics.store events, @click = arguments[0], 1

            release     : 
                set     : -> Atomics.store events, arguments[0], 0

            rotating    :
                get     : -> @looking and Atomics.load( events,  0 )

            draging     :
                get     : -> @looking and Atomics.load( events,  2 )

            moving      :
                get     : -> Atomics.load( events, 12 )
                set     : -> Atomics.store events, 12, arguments[0]

            jumping     :
                get     : -> Atomics.load( events, 19 )
                set     : -> Atomics.store events, 19, arguments[0]

            running     :
                get     : -> @moving and @shift

            shift       :
                get     : -> Atomics.load( events, 20 )
                set     : -> Atomics.store events, 20, arguments[0]

            alt         :
                get     : -> Atomics.load( events, 21 )
                set     : -> Atomics.store events, 21, arguments[0]

            ctrl        :
                get     : -> Atomics.load( events, 22 )
                set     : -> Atomics.store events, 22, arguments[0]

            meta        :
                get     : -> Atomics.load( events, 23 )
                set     : -> Atomics.store events, 23, arguments[0]

            forward     :
                get     : -> Atomics.load( events, 13 )
                set     : -> Atomics.store events, 13, arguments[0]

            backward    :
                get     : -> Atomics.load( events, 14 )
                set     : -> Atomics.store events, 14, arguments[0]

            left        :
                get     : -> Atomics.load( events, 15 )
                set     : -> Atomics.store events, 15, arguments[0]

            right       :
                get     : -> Atomics.load( events, 16 )
                set     : -> Atomics.store events, 16, arguments[0]

            up          :
                get     : -> Atomics.load( events, 17 )
                set     : -> Atomics.store events, 17, arguments[0]

            down        :
                get     : -> Atomics.load( events, 18 )
                set     : -> Atomics.store events, 18, arguments[0]

            looking     :
                get     : -> Atomics.load( events, 11 )
                set     : ->
                    return unless Atomics.store events, 11, arguments[0]
                    requestIdleCallback -> Atomics.store events, 11, 0

            zooming     :
                get     : -> Atomics.load( events, 10 )
                set     : ->
                    return unless Atomics.store events, 10, arguments[0]
                    requestIdleCallback -> Atomics.store events, 10, 0

            dblclick    :
                get     : -> Atomics.load( events,  9 )
                set     : ->
                    Atomics.store events, 9, 1
                    requestIdleCallback -> Atomics.store events, 9, 0

            click       :
                get     : -> Atomics.load( events,  8 )
                set     : ->
                    Atomics.store events, 8, 1
                    requestIdleCallback -> Atomics.store events, 8, 0

            offsetX     :
                set     : ->
                    @dx = -@x + (@x = arguments[0])
                    @ry = ( - @dx / 100 ) % Math.PI

            offsetY     :
                set     : ->
                    @dy = +@y - (@y = arguments[0])
                    @rx = ( - @dy / 100 ) % Math.PI

            deltaX      :
                set     : ->
                    @sx = arguments[0]

            deltaY      :
                set     : ->
                    @sy = arguments[0]
                    @sz = arguments[0] / 1e2

            x           :
                get     : -> positions[0]
                set     : -> positions[0] = arguments[0]
                    
            dx          :
                get     : -> positions[1]
                set     : -> positions[1] = arguments[0]
                    
            rx          :
                get     : -> positions[2]
                set     : -> positions[2] = arguments[0]
                    
            sx          :
                get     : -> positions[3]
                set     : -> positions[3] = arguments[0]
                    
            vx          :
                get     : -> positions[4]
                set     : -> positions[4] = arguments[0]
                    
            y           :
                get     : -> positions[5]
                set     : -> positions[5] = arguments[0]
                    
            dy          :
                get     : -> positions[6]
                set     : -> positions[6] = arguments[0]
                    
            ry          :
                get     : -> positions[7]
                set     : -> positions[7] = arguments[0]
                    
            sy          :
                get     : -> positions[8]
                set     : -> positions[8] = arguments[0]
                    
            vy          :
                get     : -> positions[9]
                set     : -> positions[9] = arguments[0]
                
            sz          :
                get     : -> positions[10]
                set     : -> positions[10] = arguments[0]
                
            vz          :
                get     : -> positions[11]
                set     : -> positions[11] = arguments[0]
                  
            multiply    :
                get     : -> positions[12]
                set     : -> positions[12] = arguments[0]


        canvas.addEventListener "pointerup",    @pointerup.bind @
        canvas.addEventListener "pointermove",  @pointermove.bind( @ ), passive: !0
        canvas.addEventListener "pointerdown",  @pointerdown.bind @
        canvas.addEventListener "dblclick",     @doubleclick.bind @
        canvas.addEventListener "wheel",        @wheel.bind( @ ), passive: !0
        canvas.addEventListener "contextmenu",  @contextmenu.bind @
        
        document = canvas.ownerDocument
        document.addEventListener "keyup",      @keyup.bind @
        document.addEventListener "keydown",    @keydown.bind @ 

        @multiply = 5

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

        factor = @multiply
        factor *= 2 if @running

        @vx *= factor
        @vz *= factor
        @vy *= @multiply

        null
