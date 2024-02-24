export class ZoomEvent extends CustomEvent
    constructor : ( detail ) -> super "zoom", { detail }

export class MovingEvent extends CustomEvent
    constructor : ( detail ) -> super "moving", { detail }

export class PickEvent extends CustomEvent
    constructor : ( detail ) -> super "pick", { detail }

export class ReleaseEvent extends CustomEvent
    constructor : ( detail ) -> super "free", { detail }

export class DragingEvent extends CustomEvent
    constructor : ( detail ) -> super "drag", { detail }

export class PanningEvent extends CustomEvent
    constructor : ( detail ) -> super "move", { detail }

export class ScaleEvent extends CustomEvent
    constructor : ( detail ) -> super "scale", { detail }


export default class Bind extends EventTarget

    passive     : yes

    disableContextMenu : yes

    zoom        : 0

    slide       : 0

    panning     : null

    draging     : null


    deltaY      : 0
    deltaS      : 0
    deltaX      : 0

    constructor : ( canvas ) ->
        Object.assign super(), { canvas }
            .listen()
        
    listen      : ->
        @width = @canvas.getBoundingClientRect().width
        @height = @canvas.getBoundingClientRect().height

        @canvas.addEventListener "wheel", @onwheel.bind( this ), { passive: yes }
        @canvas.addEventListener "pointermove", @onmove.bind( this ), { passive: yes }
        @canvas.addEventListener "contextmenu", @oncontext.bind( this )
        @canvas.addEventListener "pointerdown", @ondown.bind( this )
        @canvas.addEventListener "pointerup", @onup.bind( this )
        @canvas.addEventListener "dblclick", @ondouble.bind( this )

    on          : ( event, handle, options ) ->
        @addEventListener event, handle, options ; @

    emit        : ( event, detail ) ->
        @dispatchEvent new CustomEvent event, { detail } ; @

    onwheel     : ({ @deltaX, @deltaY, @altKey }) ->
        if  @altKey 
            @dispatchEvent new ScaleEvent { dx: @deltaX, dz: @deltaY, ds: @deltaY / 100 }
        else
            @dispatchEvent new ZoomEvent { dx: @deltaX, dz: @deltaY }

    onmove      : ( e ) ->
        {   offsetX,
            offsetY   } = e
        
        delta =
            dx : ( offsetX - @offsetX )
            dy : ( @offsetY - offsetY )
            
        delta.rx = ( -delta.dy / 100 ) % Math.PI
        delta.ry = ( -delta.dx / 100 ) % Math.PI

        { @offsetX, @offsetY } =
            { offsetX, offsetY }

        if @panning isnt null
            @dispatchEvent new PanningEvent delta 

        else if @draging isnt null
            @dispatchEvent new DragingEvent delta

        @dispatchEvent new MovingEvent delta
        
    oncontext   : ( e ) ->
        e.preventDefault() if @disableContextMenu

    ondown      : ( e ) ->
        { @offsetX, @offsetY, @button } = e

        if @button is e.buttons
            @panning = @button
        else @draging = @button
            
        @dispatchEvent new PickEvent { @offsetX, @offsetY }

    onup        : ( e ) ->
        @button = no

        switch e.button
            when @panning then @panning = null 
            when @draging then @draging = null

        @dispatchEvent new ReleaseEvent { @offsetX, @offsetY }

    ondouble    : ( e ) ->
        @dispatchEvent new CustomEvent "dblclick", { ...e, detail: e }