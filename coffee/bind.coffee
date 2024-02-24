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


export default class Bind extends EventTarget

    passive     : yes

    disableContextMenu : yes

    zoom        : 0

    slide       : 0

    draging     : no
    turning    : no
    looking     : no

    deltaY      : 0
    deltaS      : 0
    deltaX      : 0

    pressing    : {}

    shiftKey    : no
    altKey      : no
    ctrlKey     : no
    metaKey     : no

    walking     : no
    moving      : no
    jumping     : no
    zooming     : no

    rx          : 0
    ry          : 0

    Object.defineProperties this::,
        isRotating  : get : -> @turning isnt no
        isDraging   : get : -> @draging isnt no
        isMoving    : get : -> @walking isnt no
        isJumping   : get : -> @jumping isnt no
        isLooking   : get : -> @looking isnt no
        isZooming   : get : -> l = @zooming ; @zooming = no ; l 

    constructor : ( canvas ) ->
        Object.assign super(), { canvas }
            .listen()
        
    listen      : ->
        @width = @canvas.getBoundingClientRect().width
        @height = @canvas.getBoundingClientRect().height
        @document = @canvas.ownerDocument

        @canvas.addEventListener "wheel", @onwheel.bind( this ), { passive: yes }
        @canvas.addEventListener "pointermove", @onmove.bind( this ), { passive: yes }
        @canvas.addEventListener "contextmenu", @oncontext.bind( this )
        @canvas.addEventListener "pointerdown", @ondown.bind( this )
        @canvas.addEventListener "pointerup", @onup.bind( this )
        @canvas.addEventListener "dblclick", @ondouble.bind( this )
        
        @document.addEventListener "keydown", @onkeydown.bind( this )
        @document.addEventListener "keyup", @onkeyup.bind( this )

    on          : ( event, handle, options ) ->
        @addEventListener event, handle, options ; @

    emit        : ( event, detail ) ->
        @dispatchEvent new CustomEvent event, { detail } ; @

    onwheel     : ({ @deltaX, @deltaY }) ->
        @dx = @deltaX
        @dy = @deltaY
        @dz = @deltaY / 100
        @zooming = yes
        @dispatchEvent new ZoomEvent this

    onmove      : ( e ) ->
        {   offsetX,
            offsetY   } = e

        @dx = ( offsetX - @offsetX )
        @dy = ( @offsetY - offsetY )
            
        @rx = ( -@dy / 100 ) % Math.PI
        @ry = ( -@dx / 100 ) % Math.PI

        { @offsetX, @offsetY } =
            { offsetX, offsetY }

        @looking = no

        if @draging isnt no
            @dispatchEvent new DragEvent this

        else if @turning isnt no
            @dispatchEvent new TurnEvent this

        else @looking = yes 

        @dispatchEvent new LookEvent this
        
    oncontext   : ( e ) ->
        e.preventDefault() if @disableContextMenu

    ondown      : ( e ) ->
        { @offsetX, @offsetY, @button } = e

        if @button is e.buttons
            @draging = @button
        else @turning = @button
            
        @dispatchEvent new PickEvent this

    onup        : ( e ) ->
        @button = no

        switch e.button
            when @draging then @draging = no 
            when @turning then @turning = no

        @dispatchEvent new ReleaseEvent this

    ondouble    : ( e ) ->
        @dispatchEvent new CustomEvent "dblclick", { ...e, detail: e }

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