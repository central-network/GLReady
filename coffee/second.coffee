#`import font from "./ibmplex.json" with { type: "json" }`
#sessionStorage.setItem "font", JSON.stringify font


{log,warn,error} = console



Object.defineProperties Math,
    rad             : value : ( deg ) -> deg * Math.PI / 180
    deg             : value : ( rad ) -> rad * 180 / Math.PI
    powsum          : value : ( arr, pow = 2 ) ->
        [ ...arr ].flat().reduce (a, b) -> a + Math.pow b, pow

init2dContext = ( width = 500, height, margin = "0" ) ->

    ctx = document.createElement "canvas"
        . getContext "2d", { willReadFrequently: on }
    ctx . scale devicePixelRatio, devicePixelRatio

    height ||= width

    document.body.append ctx.canvas 
    
    Object.assign( ctx.canvas, {
        width : width * devicePixelRatio
        height : height * devicePixelRatio
    }).setAttribute "style", [
        "width:#{CSS.px width}"
        "height:#{CSS.px height}"
        "outline:1px dashed red"
        "inset:50%"
        "background:transparent"
        "display:block"
        "margin:#{margin}"
        "transform:translate(-50%, -50%) scaleY(-1)"
        "position:fixed"
    ].join ";"

    ctx

do ->
    sekilKalip = init2dContext(500, 500, "0 0 0 -260px")
    sekilGecen = init2dContext(500, 500, "0 0 0 260px")
    triangle = init2dContext(500, 500, "0 0 0 -260px")
    triangles = init2dContext(500, 500, "0 0 0 -260px")
    pin = init2dContext(500, 500, "0 0 0 -260px")
    offscreen = new OffscreenCanvas(1000,1000).getContext("2d")

    noktaSekilUzerindeMi = ( sekil, x, y ) ->
        offscreen.isPointInPath( sekil, x, y ) or
        offscreen.isPointInStroke( sekil, x, y )


    pixelpin = ( x, y, color = "red" ) ->
        if  isNaN x 
            {x, y} = x

        pin.strokeStyle = color;
        pin.beginPath();
        pin.arc(x, y, 10, 0, 2 * Math.PI);
        pin.closePath()
        pin.stroke();
        {x,y}

    drawTriangle = ( x1, y1, x2, y2, x3, y3 ) ->

        path = new Path2D();
        path.moveTo( x1, y1 )
        path.lineTo( x2, y2 )
        path.lineTo( x3, y3 )
        path.lineTo( x1, y1 )
        path.closePath()
        triangles.fillStyle = "rgb(#{Math.floor(Math.random()*255)},#{Math.floor(Math.random()*255)},#{Math.floor(Math.random()*255)})"
        triangles.fill( path )

        path
    
    pathTriangle = ( x1,x2,x3, y1,y2,y3 ) ->

        path = new Path2D();
        path.moveTo( x1, y1 )
        path.lineTo( x2, y2 )
        path.lineTo( x3, y3 )
        path.lineTo( x1, y1 )
        path.closePath()
        path
    
    

    drawPin = ->




    xMin = 0
    yMin = 0
    xMax = 1000
    yMax = 1000

    p = 0
    findFromMin = ->
        xi = Math.trunc Math.random() * 1000
        while xi < xMax
            yi = Math.floor Math.random() * 1000
            while yi < yMax
                if  isin = sekilKalip.isPointInPath(c, xi, yi ) or sekilKalip.isPointInStroke(c, xi, yi )
                    return pixelpin xi , yi
                    throw [ "first", xi, yi ]
                yi++
            xi++

        if p++ > 100
            throw "p"

        return findFromMin()

    findFromMax = ->
        xi = xMax
        while --xi
            yi = 0
            while yi < yMax
                if  isin = sekilKalip.isPointInPath(c, xi, yi )
                    return pixelpin xi , yi
                    throw [ "first", xi, yi ]
                yi++
        return 0

    enVerimliCikisiBul = ({x,y}) ->

        ust = mesafe : 0, x: 0, y: 0
        alt = mesafe : 0, x: 0, y: 0
        sag = mesafe : 0, x: 0, y: 0
        sol = mesafe : 0, x: 0, y: 0

        xi = x
        yi = y
        while xi <= xMax
            if  sekilKalip.isPointInPath(c, xi, yi ) or sekilKalip.isPointInStroke(c, xi, yi )
                if !sekilKalip.getImageData( xi, yi, 1, 1 ).data.at(3)
                    sag.mesafe = Math.abs xi - x
                    sag.x = xi
                    sag.y = yi
                    break
            xi++

        xi = x
        yi = y
        while 0 > xi--
            if  sekilKalip.isPointInPath(c, xi, yi ) or sekilKalip.isPointInStroke(c, xi, yi )
                if !sekilKalip.getImageData( xi, yi, 1, 1 ).data.at(3)
                    sol.mesafe = Math.abs xi - x
                    sol.x = xi
                    sol.y = yi
                    break

        xi = x
        yi = y
        while 0 > yi--
            if  sekilKalip.isPointInPath(c, xi, yi ) or sekilKalip.isPointInStroke(c, xi, yi )
                if !sekilKalip.getImageData( xi, yi, 1, 1 ).data.at(3)
                    alt.mesafe = Math.abs yi - y
                    alt.x = xi
                    alt.y = yi
                    break


        xi = x
        yi = y
        while yMax >= yi
            if  sekilKalip.isPointInPath(c, xi, yi ) or sekilKalip.isPointInStroke(c, xi, yi )
                if !sekilKalip.getImageData( xi, yi, 1, 1 ).data.at(3)
                    ust.mesafe = Math.abs yi - y
                    ust.x = xi
                    ust.y = yi
                    break

            yi++

        unless maxMesafe = Math.max alt.mesafe, ust.mesafe, sag.mesafe, sol.mesafe
            return 0

        switch maxMesafe
            when alt.mesafe then return pixelpin alt.x, alt.y
            when ust.mesafe then return pixelpin ust.x, ust.y
            when sag.mesafe then return pixelpin sag.x, sag.y
            when sol.mesafe then return pixelpin sol.x, sol.y

        throw "bir hata"

    ucgenAlaniHesapla = ( x1, y1,  x2, y2,  x3, y3 ) ->
        0.5 * (
            x1 * Math.abs( y2 - y3 ) + 
            x2 * Math.abs( y3 - y1 ) +
            x3 * Math.abs( y2 - y1 )  
        )        

    ucgenAlaninTamDoluMu = ( x1, y1,  x2, y2,  x3, y3 ) ->
        xMin = Math.min x1, x2, x3
        yMin = Math.min y1, y2, y3

        xMax = Math.max x1, x2, x3
        yMax = Math.max y1, y2, y3

        ucgen = new Path2D()
        ucgen . moveTo x1, y1
        ucgen . lineTo x2, y2
        ucgen . lineTo x3, y3
        ucgen . lineTo x1, y1
        ucgen . closePath()

        xi = xMin
        while xi < xMax
            yi = yMin
            while yi < yMax
                if  noktaSekilUzerindeMi( ucgen, xi, yi )
                    if !triangle.getImageData( xi, yi, 1, 1 ).data.at(3)
                        return no
                yi++
            xi++
        return yes

    ucgenAlaniniBosalt = ( x1, y1,  x2, y2,  x3, y3 ) ->
        xMin = Math.min x1, x2, x3
        yMin = Math.min y1, y2, y3

        xMax = Math.max x1, x2, x3
        yMax = Math.max y1, y2, y3

        ucgen = new Path2D()
        ucgen . moveTo x1, y1
        ucgen . lineTo x2, y2
        ucgen . lineTo x3, y3
        ucgen . lineTo x1, y1
        ucgen . closePath()

        xi = xMin
        while xi < xMax
            yi = yMin
            while yi < yMax
                if  noktaSekilUzerindeMi( ucgen, xi, yi )
                    triangle.clearRect( xi, yi, 1, 1 )
                yi++
            xi++
        return yes

    bulunanlar = []
    k = 0
    maksimumDoluUcgeniBul = ({ x: x1, y: y1 }, {x:x2, y:y2}) ->

        icbulunanlar = []
        
        xi = 1000
        while xi > 0
            yi = 1000
            while yi > 0
                if  k++ > 5138000
                    throw "of hata " + k
                if  noktaSekilUzerindeMi( c, xi, yi ) and (( xi isnt x1 ) and ( xi isnt x2 ))
                    area = ucgenAlaniHesapla x1, y1, x2, y2, xi, yi
                    icbulunanlar.push { area, xi, yi }
                yi--
            xi--

        

        icbulunanlar.sort((a, b) ->
            if a.area <= b.area then 1 else -1
        )

        for { xi, yi } in icbulunanlar

            if  bulunanlar.find (v) -> (v.xi is xi) and (v.yi is yi) 
                continue

            #drawTriangle x1, y1, x2, y2, xi, yi 
            tamdoluluk = ucgenAlaninTamDoluMu x1, y1, x2, y2, xi, yi 
            
            if  tamdoluluk
                error { x1, y1, x2, y2, xi, yi }
                ucgenAlaniniBosalt x1, y1, x2, y2, xi, yi 
                bulunanlar.push { x1, y1, x2, y2, xi, yi }
                break


        pixelpin xi, yi


    delay = -> new Promise (done) =>
        setTimeout done, arguments[0] or 1000
    


    drawCircle = ( x, y, r = 100 ) ->
        arc = new Path2D()
        arc.arc(x, y, r, 0, 2 * Math.PI)
        sekilKalip.save()
        sekilKalip.fillStyle = "aqua"
        sekilKalip.fill(arc)
        sekilKalip.restore()
        arc

    c = drawCircle(500, 500)

    data = null
    size = null

    dataGuncelle = ->
        size = sekilKalip.canvas.width
        data = sekilKalip.getImageData(0,0,size, size).data

    yon = 0
    baslangicAl = ->

        dataGuncelle()

        if !yon
            i = data.indexOf 0xff
            yon = 1

        else
            i = data.lastIndexOf 0xff
            yon = 0

        i = Math.trunc i / 4
        y = i / size
        x = i % size

        x1: x
        y1: y

    indeks = ( x, y ) ->
        4 * ( Math.trunc(y) * size + x )

    oku = ( x, y, rgba = 3 ) ->
        i = indeks( x, y )
        [r,g,b,a] = data.slice i, i + 4
        r + g + b + a

    sonlanisBul = ( x1, y1 ) ->
        dataGuncelle()

        ust = mesafe: 0, x: x1, y: y1
        alt = mesafe: 0, x: x1, y: y1
        sag = mesafe: 0, x: x1, y: y1
        sol = mesafe: 0, x: x1, y: y1

        while oku ust.x, ust.y
            ust.mesafe++
            ust.y++ 
        
        while oku alt.x, alt.y
            alt.mesafe++
            alt.y--
        
        while oku sag.x, sag.y
            sag.mesafe++
            sag.x++
        
        while oku sol.x, sol.y
            sol.mesafe++
            sol.x--

        warn { ust, alt, sag, sol }

        cikis = switch Math.max sol.mesafe, sag.mesafe, ust.mesafe, alt.mesafe
            when 0
                throw "MESAFE YOK"
            when ust.mesafe then ust
            when alt.mesafe then alt
            when sol.mesafe then sol
            when sag.mesafe then sag
        
        x2: cikis.x
        y2: cikis.y

    sagaKaykil = ( x1, y1, x2, y2 ) ->

        dataGuncelle()

        aci = Math.PI/180
        sin = Math.sin aci

        x3 = Math.min x2, x1
        y3 = if x3 is x2 then y1 else y2

        sx = 0
        sy = 0

        while oku x3 + sx, y3 + sy
            y3 += sy
            x3 += sx
            
            sy = y3 * sin
            sx = x3 * sin

        x3 += sx
        y3 += sy

        return { x3, y3 }

    ucgeniKes = ( x1, y1, x2, y2, x3, y3 ) ->
        dataGuncelle()

        ucgen = new Path2D()
        ucgen.moveTo x1, y1
        ucgen.lineTo x2, y2
        ucgen.lineTo x3, y3
        ucgen.lineTo x1, y1
        ucgen.closePath()

        sekilGecen.fill( ucgen )
        sekilKalip.stroke( ucgen )

        sekilKalip.save()
        sekilKalip.clip( ucgen )
        sekilKalip.clearRect( 0, 0 , size*2, size*2)
        sekilKalip.restore()

        ucgen


    do  window.onclick = ->
        dataGuncelle()
        pin.clearRect 0, 0, size*2, size*2

        girisAcisi = 45
        x = isinBaslangicX = 350
        y = isinBaslangicY = 350

        pin.moveTo 0, 0
        pin.lineTo isinBaslangicX, isinBaslangicY
        pin.stroke()

        cos = Math.sin 45 / ( Math.PI / 180 )
        
        i = 0
        giris = no
        cikis = no
        sonxy = { x:isinBaslangicX, y:isinBaslangicY }


        kanatlandir = ( cosTeta, sonxy ) ->

            log cosTeta
            # geri geri gel
            #! beyaz üzerinde ilerle
            pin.strokeStyle = "black"
            pin.lineWidth = 2
            pin.beginPath()
            pin.moveTo sonxy.x, sonxy.y
            pin.lineTo(
                cikis.x -= 1 * cosTeta,
                cikis.y -= 1 * cosTeta
            )
            pin.closePath()
            pin.stroke()

            if (cikis.x <= giris.x) and (cikis.y <= giris.y )
                return


            # her adimda beyaza kadar ilerle
            # en fazla toplam mesafeyi sec
        acisal = {}

        mm = 0
        at = 0
        do t = ->
            rgba = oku x, y
            log rgba

            if  giris and rgba and !cikis
                at++

                for aci, { ax, ay, sin } of acisal
                
                    pin.save()
                    pin.beginPath() 
                    pin.strokeStyle = "red"
                    pin.lineWidth = 3
                    pin.moveTo giris.x, giris.y
                    pin.lineTo ax, ay
                    pin.closePath()
                    pin.stroke()   
                    pin.restore()   

                    acisal[aci].ax += cos
                    acisal[aci].ay += cos

                

            if !rgba and giris and !cikis
                cikis = { ...sonxy }
                
                log "cikis saglandi:", cikis
                pixelpin x, y

            if !giris and rgba
                giris = { x, y }

                log "giris saglandi:", giris
                pixelpin x, y

                for teta in [ 45 .. 90 ]
                    acisal[ teta ] = {
                        sin: Math.sin Math.rad teta
                        ax: giris.x 
                        ay: giris.y 
                    }

            if !cikis
                pin.save()
                pin.beginPath()
                pin.strokeStyle = "orange"
                pin.lineWidth = 2
                pin.moveTo sonxy.x, sonxy.y
                pin.lineTo(x += cos, y += cos)
                pin.closePath()
                pin.stroke()
                pin.restore()
                
            sonxy = { x, y }

            return 1 if 300 < mm++
            requestAnimationFrame t


        ->
            { x1, y1 } = baslangicAl()
            { x2, y2 } = sonlanisBul( x1, y1 )
            { x3, y3 } = sagaKaykil( x1, y1, x2, y2 )

            ucgen = ucgeniKes( x1, y1, x2, y2, x3, y3 )
            
            pixelpin x1, y1
            pixelpin x2, y2
            pixelpin x3, y3

            pin.stroke ucgen


0 and do ->
    delay = -> new Promise (done) =>
        setTimeout done, arguments[0] or 1000



    ctx = init2dContext size = 500
    pin = init2dContext size

    stepCtx = init2dContext 500, 50, "-225px 0 0 0"


    
    ctx.font = "#{size * devicePixelRatio}px serif";
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText( "a", size, size )

    state_full_text = null
    state_full_data = null

    setContext = ->
        state_full_text =
            ctx.getImageData(0, 0, size * 2, size * 2)

        j = 0
        l = state_full_text.data.length
        state_full_data = new Uint8Array l / 4

        while l > j += 4
            if  state_full_text.data[j + 3] is 0xff
                state_full_data[j/4] = 0xff

    setContext()
        
    readPixel = ( x, y ) ->
        state_full_data.at( ( y * state_full_text.width ) + x )
        
    fillPixel = ( x, y, color = "aqua" ) ->
        pin.fillStyle = "color";
        pin.fillRect(x, y, 1, 1);


    clearTriangle = ({ x1, y1, x2, y2, x3, y3 }) ->
        ctx.save();
        ctx.fillStyle = "#00000000";

        ctx.beginPath()
        ctx.moveTo( x1, y1 )
        ctx.lineTo( x2, y2 )
        ctx.lineTo( x3, y3 )

        ctx.closePath();
        ctx.fill();
        ctx.restore();

        #ctx.clearRect(0, 0, size*2, size*2);



    findTriangle = ( x0, x1, y0 ) ->
        # todo draw triangles    x0 -- y0 -------- x1
        # todo                          |          
        # todo                          |          
        # todo                         y1            find max abs(y) for every x in range [x0, x1]

        #todo       triangle ABC   [x0, y0]
        #todo       triangle BAC   [x1, y0]
        #todo       triangle CAB   [x?, y?]


        #todo       triangle CAB   x0 < x? < x1
        #todo       triangle CAB        y?  

        xMin = Math.min x1, x0
        xMax = Math.max x1, x0

        yMin = y0
        yMax = state_full_text.height

        xi = xMin
        yi = yMin

        usable = on
        while xi < xMax
            break unless usable
            while yi < yMax
                break unless usable
                usable =readPixel xi, yi
                yi++
            xi++

                
        pin.beginPath()

        pin.moveTo( x0, y0 )
        pin.lineTo( xi, yi )
        pin.lineTo( x1, y0 )

        error { x: xi, y: yi }
    
        pin.closePath()
        pin.strokeStyle = "aqua"
        pin.stroke()

        return { x: xi, y: yi }


    stepCtx.font = "40px serif";
    stepInterval = 0
    stepinfo = ( text = "", wait = 200 ) ->
        console.warn text

        i = 0
        clearInterval stepInterval
        stepInterval = setInterval =>
            stepCtx.clearRect( 0, 0, 1e3, 100 )
            if i++ % 2
                stepCtx.fillText( text, 15, 60 )
        , 500
        stepCtx.clearRect( 0, 0, 1e3, 100 )
        stepCtx.fillText( text, 15, 60 )

        await delay wait

    pixelpin = ( x, y, color = "red" ) ->
        pin.strokeStyle = color;
        pin.beginPath();
        pin.arc(x, y, 10, 0, 2 * Math.PI);
        pin.closePath()
        pin.stroke();

    step_00_echo = ->
        await stepinfo "echo letter"


    triangles = []
    a = 0
    step_01_slice = ( ati = a + 1 ) ->
        
        await stepinfo "remove right part"
        ctx.clearRect( size, 0, size, size * 2 )
        
        dataRight = ctx.getImageData(0, 0, size * 2, size * 2)
        countRight = dataRight.data.indexOf 0xff 
        await stepinfo "counting black pixels " + countRight

            
        ctx.putImageData state_full_text, 0, 0
        ctx.clearRect( 0, 0, size, size * 2 )
        dataLeft = ctx.getImageData(0, 0, size * 2, size * 2)
        countLeft = dataLeft.data.indexOf 0xff 
        await stepinfo "counting black pixels " + countLeft

            
        ctx.putImageData state_full_text, 0, 0
        ctx.clearRect( 0, size, size * 2, size )
        dataTop = ctx.getImageData(0, 0, size * 2, size * 2)
        countTop = dataTop.data.indexOf 0xff 
        await stepinfo "counting black pixels " + countTop

            
        ctx.putImageData state_full_text, 0, 0
        ctx.clearRect( 0, 0, size * 2, size )
        dataBottom = ctx.getImageData(0, 0, size * 2, size * 2)
        countBottom = dataBottom.data.indexOf 0xff 
        await stepinfo "counting black pixels " + countBottom
        
        maxCount = Math.max countLeft, countTop, countBottom, countRight
        [ partName, partData ] = switch maxCount
            when countTop then [ "top", dataTop ]
            when countLeft then [ "left", dataLeft ] 
            when countRight then [ "right", dataRight ]
            when countBottom then [ "bottom", dataBottom ]

        await stepinfo "max #{partName}(#{maxCount})", 100

        ctx.putImageData partData, 0, 0

        j = 0
        l = partData.data.length
        data = new Uint8Array l / 4
        while l > j += 4
            if  partData.data[j + 3] is 0xff
                data[j/4] = 0xff


        i = state_full_data.indexOf 0xff
        x = i % state_full_text.width
        y = Math.trunc i / state_full_text.width

        await stepinfo "index:" + i
        await stepinfo "x:" + x
        await stepinfo "y:" + y
        
        pixelpin( x, y )

        x1 = x
        xright = x1
        iright = i
        while xright++ < state_full_text.width
            break if !state_full_data.at( ++iright )

        #pixelpin( --xright, y )
        dright = xright - x1
        await stepinfo "looked to right: #{xright} " + dright

        xleft = x1
        ileft = i 
        while --xleft
            break if !state_full_data.at( --ileft )

        #pixelpin( --xleft, y )
        dleft = x1 - xleft
        await stepinfo "looking to left: #{xleft} " + dleft

        [ vdir, x2 ] = if dright > dleft
            [ "right", xright ]
        else [ "left", xleft ]

        await stepinfo "chosen direction: [#{vdir}] at x2: " + x2

        y1 = y2 = y
        { x: x3, y: y3 } =
            findTriangle( x1, x2, y )

        #pixelpin( x1, y1, "aqua" )
        #pixelpin( x2, y2, "aqua" )
        #pixelpin( x3, y3, "aqua" )

        clearTriangle({
            x1, x2, x3,
            y1, y2, y3
        })

        setContext()

        log "cleared:", triangles[triangles.length] = {
            x1, x2, x3,
            y1, y2, y3
        }



    await step_00_echo()
    await step_01_slice()

    self.onclick = ->
        step_01_slice()
        log triangles
        pin.clearRect 0, 0, size *2 ,size * 2



0 and do ->        
    class M4 extends Float32Array

        #? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html

        Object.defineProperty this, "Identity", value : ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                0,  0,  0,  1,
            ] 

        Object.defineProperty this::, "position", get : ->
            @subarray 12, 15
        
        @Camera     : class Camera extends this
            constructor : ( yFov, rAspect, zNear, zFar ) ->

                f = Math.tan Math.PI/2 - yFov/2
                rangeInv = 1.0 / ( zNear - zFar )

                super [
                    f / rAspect,   0,                             0,    0,
                    0,             f,                             0,    0,
                    0,             0,     (zNear + zFar) * rangeInv,   -1,
                    0,             0, (zNear * zFar) * rangeInv * 2,    0
                ]

        @fromVec3   = ( vec3 ) ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                ... vec3,  1,
            ]

        modifyVertex : ( vertex ) ->
            vertex.position.set M4.multiply(
                this, M4::translation ...vertex
            ).position

        multiply    : ( b ) -> @set( M4.multiply @, b ); this

        @multiply   = ( a, b ) ->
            a00 = a[0 * 4 + 0]; a01 = a[0 * 4 + 1]; a02 = a[0 * 4 + 2]; a03 = a[0 * 4 + 3]
            a10 = a[1 * 4 + 0]; a11 = a[1 * 4 + 1]; a12 = a[1 * 4 + 2]; a13 = a[1 * 4 + 3]
            a20 = a[2 * 4 + 0]; a21 = a[2 * 4 + 1]; a22 = a[2 * 4 + 2]; a23 = a[2 * 4 + 3] 
            a30 = a[3 * 4 + 0]; a31 = a[3 * 4 + 1]; a32 = a[3 * 4 + 2]; a33 = a[3 * 4 + 3]

            b00 = b[0 * 4 + 0]; b01 = b[0 * 4 + 1]; b02 = b[0 * 4 + 2]; b03 = b[0 * 4 + 3] 
            b10 = b[1 * 4 + 0]; b11 = b[1 * 4 + 1]; b12 = b[1 * 4 + 2]; b13 = b[1 * 4 + 3] 
            b20 = b[2 * 4 + 0]; b21 = b[2 * 4 + 1]; b22 = b[2 * 4 + 2]; b23 = b[2 * 4 + 3] 
            b30 = b[3 * 4 + 0]; b31 = b[3 * 4 + 1]; b32 = b[3 * 4 + 2]; b33 = b[3 * 4 + 3]
            
            new M4 [
                b00 * a00 +  b01 * a10 +  b02 * a20 +  b03 * a30,
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
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                tx,  0,  0,  1,
            ]

        yTranslation : ( ty = 0 ) ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                0, ty,  0,  1,
            ]

        zTranslation : ( tz = 0 ) ->
            new M4 [
                1,  0,  0,  0,
                0,  1,  0,  0,
                0,  0,  1,  0,
                0,  0, tz,  1,
            ]

        xRotation   : ( angleInRadians = 0 ) ->
            c = Math.cos angleInRadians
            s = Math.sin angleInRadians

            new M4 [
                1,  0,  0,  0,
                0,  c,  s,  0,
                0, -s,  c,  0,
                0,  0,  0,  1,
            ]

        yRotation   : ( angleInRadians = 0 ) ->
            c = Math.cos angleInRadians
            s = Math.sin angleInRadians
            
            new M4 [
                c,  0, -s,  0,
                0,  1,  0,  0,
                s,  0,  c,  0,
                0,  0,  0,  1,
            ]

        zRotation   : ( angleInRadians = 0 ) ->
            c = Math.cos angleInRadians
            s = Math.sin angleInRadians
            
            new M4 [
                c,  s,  0,  0,
                -s,  c,  0,  0,
                0,  0,  1,  0,
                0,  0,  0,  1,
            ]

        scaling     : ( sx, sy, sz ) ->
            sz ?= ( sy ?= ( sx ?= 1 ) ) 
            new M4 [
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

    CHARCODE_VERTICES = JSON.parse sessionStorage.font

    gl = document.getElementById("gl").getContext "webgl2"
    iLE = new Uint8Array( Uint16Array.of(1).buffer )[0] is 1
    verticesGLBuffer = gl.createBuffer()
    bufferInstancesInfo = gl.createBuffer()
    program = gl.createProgram()

    vshader = gl.createShader gl.VERTEX_SHADER
    fshader = gl.createShader gl.FRAGMENT_SHADER

    gl.shaderSource vshader, document.getElementById( "vshader" ).text
    gl.shaderSource fshader, document.getElementById( "fshader" ).text

    gl.compileShader vshader
    gl.compileShader fshader

    gl.attachShader program, vshader
    gl.attachShader program, fshader

    gl.linkProgram program
    gl.useProgram program


    arrClearColor   = Float32Array.of 0.05, .2, 0.3, 1
    backgroundColor = arrClearColor.slice(0,3).map( (i) -> i * 0xff ).join " "
    document.body.style.backgroundColor = "rgb(#{backgroundColor})"

    pointCount = 0
    instanceCount = 0
    verticesOffset = 0

    BYTES_PER_VERTEX = 12
    BYTES_PER_INSTANCE = 12
    maxInstanceCount = 100

    verticesBufferArray  = new Float32Array new ArrayBuffer 1e6
    arrayInstancesInfo = new Float32Array new ArrayBuffer maxInstanceCount * BYTES_PER_INSTANCE

    gl.bindBuffer gl.ARRAY_BUFFER, verticesGLBuffer
    gl.bufferData gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW

    gl.bindBuffer gl.ARRAY_BUFFER, bufferInstancesInfo
    gl.bufferData gl.ARRAY_BUFFER, arrayInstancesInfo.byteLength, gl.DYNAMIC_READ

    u_ViewMatrix    = gl.getUniformLocation program, "u_ViewMatrix"
    u_Color         = gl.getUniformLocation program, 'u_Color'

    i_Position      = gl.getAttribLocation  program, 'i_Position'
    a_Position      = gl.getAttribLocation  program, 'a_Position'
    a_ModelMatrix   = gl.getAttribLocation  program, "a_ModelMatrix"

    viewMatrix      = new M4.Camera 90, innerWidth/innerHeight, 0.01, 1e5
    modelMatrix     = new M4.Identity()

    glClearColor    = gl.clearColor.apply.bind gl.clearColor, gl, arrClearColor
    glClear         = gl.clear.bind gl, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT


    drawTriangles   = ->
    drawPoints      = ->


    reup = ( offset ) ->

        gl.enableVertexAttribArray i_Position
        gl.vertexAttribPointer(
            i_Position,  # location
            3,           # size (num values to pull from buffer per iteration)
            gl.FLOAT,    # type of data in buffer
            false,       # normalize
            0, # stride (0 = compute from size and type above)
            offset  # offset in buffer
        )
        
        gl.vertexAttribDivisor i_Position, 1


    Object.defineProperty verticesBufferArray, "upload", value : ( array ) ->    

        pointCount  = array.length / 3
        length      = array.length
        
        byteOffset  = verticesOffset
        byteLength  = length * 4

        begin       = byteOffset / 4
        subarray    = @subarray begin, begin + length

        verticesOffset =
            byteLength + verticesOffset

        subarray.set array

        gl.bufferSubData(
            gl.ARRAY_BUFFER, byteOffset,
            verticesBufferArray, begin, length
        )

        Object.defineProperties subarray,
            start : value : byteOffset / BYTES_PER_VERTEX
            count : value : pointCount
            clone : value : 0, writable: on
            instanceOffset : value : 0, writable: on

        ( (vertices) ->

            Object.defineProperty vertices, "instance", get : ->

                ++@clone

                instanceByteOffset  = BYTES_PER_INSTANCE * instanceCount++
                instanceLength      = BYTES_PER_INSTANCE / 4
                instanceBegin       = instanceByteOffset / 4
                instanceEnd         = instanceBegin + instanceLength
                instanceSubarray    = arrayInstancesInfo.subarray instanceBegin, instanceEnd

                return ( ( instance ) ->
                    translateX : -> instance[0] += arguments[0]
                    translateY : -> instance[1] += arguments[0]
                    translateZ : -> instance[2] += arguments[0]
                )( instanceSubarray )

        )(subarray)
                        
        subarray

    Object.defineProperties modelMatrix, {
        dx: { writable:1, value:  0 },
        dy: { writable:1, value:  0 },
        dz: { writable:1, value:  0 },
        
        rx: { writable:1, value:  0 },
        ry: { writable:1, value:  0 },
        rz: { writable:1, value:  0 },

        sx: { writable:1, value:  1 },
        sy: { writable:1, value:  1 },
        sz: { writable:1, value:  1 },
        
        location    : value : gl.getAttribLocation( program, "a_ModelMatrix" )
        upload      : value : ( mat4 ) ->
            @set mat4 if mat4
            gl.enableVertexAttribArray @location
            gl.vertexAttribPointer(
                @location,  # location
                4,           # size (num values to pull from buffer per iteration)
                gl.FLOAT,    # type of data in buffer
                false,       # normalize
                16,          # stride (0 = compute from size and type above)
                0,           # offset in buffer
            )

    }

    Object.defineProperties viewMatrix, {
        dx: { writable:1, value:  0 },
        dy: { writable:1, value:  0 },
        dz: { writable:1, value: -150 },
        
        rx: { writable:1, value: 0 },
        ry: { writable:1, value: 0 },
        rz: { writable:1, value: 0 },

        sx: { writable:1, value: 1 },
        sy: { writable:1, value: 1 },
        sz: { writable:1, value: 1 },
        
        location: value : gl.getUniformLocation( program, "u_ViewMatrix" )
    }
        
    Object.defineProperty viewMatrix, "upload", value : ->
        gl.uniformMatrix4fv @location, no,
            @slice()
                .translate @dx, @dy, @dz
                .rotate @rx, @ry, @rz
                .scale @sx, @sy, @sz
        0

    init = ->
        glViewport = ->
            Object.assign( gl.canvas, {
                width : innerWidth * devicePixelRatio
                height : innerHeight * devicePixelRatio
            }).setAttribute "style", [
                "width=#{CSS.px innerWidth}"
                "height=#{CSS.px innerHeight}"
            ].join ";"

            gl.viewport( 0, 0, 
                innerWidth * devicePixelRatio, 
                innerHeight * devicePixelRatio
            )
            
        glViewport()
        glClearColor()
        glClear()

        gl.bindBuffer gl.ARRAY_BUFFER, verticesGLBuffer
        gl.bufferData gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW

        gl.enableVertexAttribArray i_Position
        gl.vertexAttribDivisor i_Position, 1

        gl.enableVertexAttribArray a_Position
        gl.vertexAttribPointer(
            a_Position,  # location
            3,           # size (num values to pull from buffer per iteration)
            gl.FLOAT,    # type of data in buffer
            false,       # normalize
            0, # stride (0 = compute from size and type above)
            0  # offset in buffer
        )


    charMalloc = ( char ) ->
        vertices   = CHARCODE_VERTICES[ char.charCodeAt 0 ]
        pointCount = vertices.length / 3
        charBuffer = verticesBufferArray.malloc pointCount
        charBuffer . upload vertices
        charBuffer


    init()


    text = {
        letters : {}
        lineCount : 0
        letterCount : 0
        letterCount : 0
        length : 0
        
        charCount   : 0
        lineWidth   : 100
        lineHeight  : 10
        letterSpace : 2.0
        offsetLeft  : 0
        
        positions : new Float32Array new ArrayBuffer 0, maxByteLength : 400 * 12

        rebind : -> for char, info of @letters

            Object.defineProperty info, "vertexAttribPointer",
                configurable: on
                value : gl.vertexAttribPointer.bind(
                    gl, i_Position, 3, gl.FLOAT, false, 12, info.offset
                )

            Object.defineProperty info, "drawArraysInstanced",
                configurable: on
                value : gl.drawArraysInstanced.bind(
                    gl, gl.TRIANGLES, info.model.start, info.model.count,  info.model.clone
                )     

            Object.defineProperty info, "bufferSubData",
                configurable: on
                value : gl.bufferSubData.bind(
                    gl, gl.ARRAY_BUFFER, info.offset, text.positions.slice(), info.begin, info.length * 3
                )     

            info

        draw : ( force = on ) ->
            for k, l of @letters when force or l.needsUpload
                l.bufferSubData()
                l.vertexAttribPointer()
                l.drawArraysInstanced()
                l.needsUpload = 0 
    }

    textBufferView = new DataView text.positions.buffer

    writeLetter = ( letter ) ->

        text.letterCount += 1

        if !l = text.letters[ letter ]
            l = text.letters[ letter ] = []

            charCode = letter.charCodeAt 0

            Object.defineProperty l, "begin",
                value : text.length
                writable: on

            Object.defineProperty l, "offset",
                value : text.length * 4
                writable: on

            Object.defineProperty l, "model",
                value : verticesBufferArray.upload(
                    vertices = CHARCODE_VERTICES[ charCode ]
                )

            if  vertices.length % 3
                throw [ MOD_TRIANGLE: letter ]

            min = +Infinity
            max = -Infinity
            len = vertices.length
            i = 0
            
            while i < len
                if  null isnt val = vertices[i]
                    if  val > max 
                        max = val

                    if  min > val
                        min = val
                i += 3
            
            Object.defineProperties l,
                xMax  : value : max
                xMin  : value : min
                width : value : max - min
                left  : value : min + ( max - min ) / 2

            warn letter, l.model

        text.positions.buffer.resize(
            ( text.length += 3 ) * 4
        )

        l.unshift instance =
            l.model.instance

        for char, info of text.letters when char is letter
            text.positions.copyWithin info.begin + 3, info.begin
            text.positions.set [0, 0, 0], info.begin
            break

        prop = ->
            (( instanceOffset ) ->
                configurable : on
                get : textBufferView.getFloat32.bind textBufferView, instanceOffset, iLE
                set : ( value ) -> textBufferView.setFloat32 instanceOffset, value, iLE
            )( arguments... )    

        begin = 0
        for char, info of text.letters
            info.begin  = begin
            info.offset = info.begin * 4

            for ins, instanceIndex in info

                attributeOffset =
                    info.offset + instanceIndex * 12

                Object.defineProperties ins,
                    x : prop attributeOffset
                    y : prop attributeOffset + 4
                    z : prop attributeOffset + 8

            begin += info.length * 3

        #left = text.letterSpace * text.charCount++
        #top  = Math.trunc left / text.lineWidth

        instance.x = text.offsetLeft
        #instance.y = top * text.lineHeight 
        
        text.offsetLeft += l.left + l.width/2
        text.offsetLeft += text.letterSpace

        l.needsUpload = 1
        instance

    writeLetter "e"


    text.rebind()
    log text.positions.slice 0

    viewMatrix.dx -= 20

    i = 0
    j = 1
    render = ->
        text.draw()
            
        viewMatrix.dx += 0.1 * j
        #viewMatrix.dy += 0.4 * j
        viewMatrix.upload()

        unless ++i % 120
            j *= -1


        requestAnimationFrame render

    render()