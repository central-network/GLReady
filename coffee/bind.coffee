export class ZoomEvent extends CustomEvent
    constructor : ( detail ) -> super "zoom", { detail }

export class LookEvent extends CustomEvent
    constructor : ( detail ) -> super "look", { detail }

export class PickEvent extends CustomEvent
    constructor : ( detail ) -> super "pick", { detail }

export class ReleaseEvent extends CustomEvent
    constructor : ( detail ) -> super "free", { detail }

export class TurnEvent extends CustomEvent
    constructor : ( detail ) -> super "turn", { detail }

export class DragEvent extends CustomEvent
    constructor : ( detail ) -> super "drag", { detail }

export class MoveEvent extends CustomEvent
    constructor : ( detail ) -> super "move", { detail }


buf = new SharedArrayBuffer 1e5
u32 = new Uint32Array buf
Atomics.store u32, 0, 4

self.malloc = ( byteLength, typedArray ) ->
    offset = Atomics.add u32, 0, byteLength
    length = byteLength / typedArray.BYTES_PER_ELEMENT
    new typedArray buf, offset, length

export default class Bind extends EventTarget

    pressing    : {}

    shiftKey    : no
    altKey      : no
    ctrlKey     : no
    metaKey     : no

    walking     : no
    moving      : no
    jumping     : no


    Object.defineProperties this::,
        isMoving    : get : -> @walking isnt no
        isJumping   : get : -> @jumping isnt no
        isLooking   : get : -> @looking isnt no

    constructor : ( canvas, buffer = new SharedArrayBuffer 256 ) ->
        Object.assign super(), { canvas, buffer }
        
        Object.defineProperties this,
            events      : value : events = new Uint8Array @buffer, 0, 12
            positions   : value : positions = new Float32Array @buffer, 12, 10
        
        Object.defineProperties this,
            press       : 
                set     : -> Atomics.store events, @button = arguments[0], 1

            release     : 
                set     : -> Atomics.store events, arguments[0], 0

            rotating    :
                get     : -> @looking and Atomics.load events, 0

            draging     :
                get     : -> @looking and Atomics.load events, 2

            looking     :
                get     : -> Atomics.load events, 11
                set     : ->
                    return unless Atomics.store events, 11, arguments[0]
                    requestIdleCallback -> Atomics.store events, 11, 0

            zooming     :
                get     : -> Atomics.load events, 10
                set     : ->
                    return unless Atomics.store events, 10, arguments[0]
                    requestIdleCallback -> Atomics.store events, 10, 0

            dblclick    :
                get     : -> Atomics.load events, 9
                set     : ->
                    Atomics.store events, 9, 1
                    requestIdleCallback -> Atomics.store events, 9, 0

            click       :
                get     : -> Atomics.load events, 8
                set     : ->
                    Atomics.store events, 8, 1
                    requestIdleCallback -> Atomics.store events, 8, 0

            button      :
                get     : -> Atomics.load( events, 7 ) - 10
                set     : ->
                    @click = Atomics.store events, 7, arguments[0] + 10
                    requestIdleCallback -> Atomics.store events, 7, 0

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
                    
    
            sz          :
                get     : -> positions[9]
                set     : -> positions[9] = arguments[0]
                  
        @listen()
        
    listen      : ->
        @width = @canvas.getBoundingClientRect().width
        @height = @canvas.getBoundingClientRect().height
        @document = @canvas.ownerDocument

        @canvas.addEventListener "contextmenu", (e) -> e.preventDefault()
        @canvas.addEventListener "wheel", @onwheel.bind( this ), { passive: yes }
        @canvas.addEventListener "pointermove", @onmove.bind( this ), { passive: yes }
        @canvas.addEventListener "pointerdown", @ondown.bind( this )
        @canvas.addEventListener "pointerup", @onup.bind( this )
        @canvas.addEventListener "dblclick", @ondbl.bind( this )
        
        @document.addEventListener "keydown", @onkeydown.bind( this )
        @document.addEventListener "keyup", @onkeyup.bind( this )


    onwheel     : ({ @deltaX, @deltaY }) -> @zooming = 1
    onmove      : ({ @offsetX, @offsetY }) -> @looking = 1
    onup        : ({ button }) -> @release = button 
    ondbl       : ({ button }) -> @dblclick = button
    ondown      : ({ button }) -> @press = button

    deg45       : Math.PI/4
    deg90       : Math.PI/2
    deg135      : Math.PI/2 + Math.PI/4
    deg180      : Math.PI
    deg215      : Math.PI + Math.PI/4
    deg270      : Math.PI + Math.PI/2
    deg315      : Math.PI + Math.PI/2 + Math.PI/4

    onkeydown   : ( e ) ->
        @shiftKey   = e.shiftKey
        @altKey     = e.altKey
        @metaKey    = e.metaKey
        @ctrlKey    = e.ctrlKey

        @pressing[ e.code ] = e.keyCode

        @walking = no
        @jumping = no

        switch e.code 
            when "KeyW", "ArrowUp"      then @forward   = @walking = yes
            when "KeyS", "ArrowDown"    then @backward  = @walking = yes
            when "KeyA", "ArrowLeft"    then @left      = @walking = yes
            when "KeyD", "ArrowRight"   then @right     = @walking = yes
            when "Space"                then @jump      = @jumping = yes 


        #?          1
        #?    14        12
        #? 4        0        2
        #?   -14       -12
        #?         -1

        j = if @jumping then -1 else 0 

        [ @angle = 0, @direction = 0, [ dx, dz, dy ] ] = if @right

            if @forward then [ @deg45, 12, [ 1, 1, j ] ]
            else if @backward then [ @deg135, -12, [ 1, -1, j ] ]
            else [ @deg90, 2, [ 1, 0, j ] ]

        else if @left

            if @forward then [ @deg315, 14, [ -1, 1, j ] ]
            else if @backward then [ @deg215, -14, [ -1, -1, j ] ]
            else [ @deg270, 4, [ -1, 0, j ] ]

        else if @backward then [ @deg180, -1, [ 0, -1, j ] ]
        else if @forward then [ 0, 1, [ 0, 1, j ] ]

        else [ 0, 0, [ 0, 0, j ] ]

        @dx = dx * 10
        @dy = dy * 10
        @dz = dz * 10

        @dispatchEvent new MoveEvent { @dx, @dy, @dz }

    onkeyup     : ( e ) ->
        delete @pressing[ e.code ]

        switch e.code
            when "KeyW", "ArrowUp"      then @forward   = no
            when "KeyS", "ArrowDown"    then @backward  = no
            when "KeyA", "ArrowLeft"    then @left      = no
            when "KeyD", "ArrowRight"   then @right     = no
            when "Space"                then @jump      = no

        switch e.key
            when "Shift"                then @shiftKey  = no
            when "Alt"                  then @altKey    = no
            when "Meta"                 then @metaKey   = no
            when "Control"              then @ctrlKey   = no

        if !@forward and !@backward and !@right and !@left
            @walking = no

        if !@jump
            @jumping = no