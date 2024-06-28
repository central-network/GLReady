class Pointer extends Number
class ClassPointer extends Number    

export default Pointer

{ log, warn, error } = console
[ iLE, dvw, ui8, i32, u32, f32, i16, u16 ] = [1]
[ wait, self.scope, thread, lock, plen ] = [ {}, [], -1, ->, 24 ]

Object.defineProperties scope, i : value : ->
    if -1 is i = @indexOf arguments[0]
        i += @push arguments[0]
    i

getByteLength = ( ptri = this ) -> dvw.getInt32 ptri - 24, iLE 
getScopeIndex = ( ptri = this ) -> dvw.getInt32 ptri - 20, iLE 
setScopeIndex = ( ptri , scpi ) -> dvw.setInt32 ptri - 20, scpi, iLE 
getClassIndex = ( ptri = this ) -> dvw.getInt32 ptri - 12, iLE 
setClassIndex = ( ptri , clsi ) -> dvw.setInt32 ptri - 12, clsi, iLE 

findInstances = ( clsi ) ->

    matchs = []
    create = Pointer.of

    ptrj = 2 * plen
    last = 1 + Atomics.load i32
    Clss = scope.at clsi

    while ptrj < last
        if  0 is clsi - getClassIndex ptrj
            ptri = create ptrj

            log ptri

            if  ptri instanceof Clss 
                matchs[ matchs.length ] = ptri

        ptrj += plen + getByteLength ptrj

    matchs

findAllChilds = ( ptri = this ) ->

    matchs = []
    create = ptri.of || ptri.constructor.of

    last = 1 + Atomics.load i32
    ptri = 0 + ptri
    ptrj = 2 * plen

    while ptrj < last
        if  0 is ptri - getParentPtri ptrj
            matchs[ matchs.length ] = create ptrj
        ptrj += plen + getByteLength ptrj

    matchs


getParentPtri = ( ptri = this ) -> dvw.getInt32 ptri - 16, iLE 
setParentPtri = ( ptri , ptrj ) -> dvw.setInt32 ptri - 16, ptrj, iLE 

malloc = ( Class, byteLength = 0 ) ->
    byteLength += Class.byteLength || 0 
    ptri = plen + Atomics.add i32, 0, byteLength + plen

    dvw.setInt32 ptri - 24, byteLength, iLE
    dvw.setInt32 ptri - 12, scope.i( Class ), iLE

    new Class ptri

Object.defineProperties Pointer,

    byteLength      : value : 0, writable : 1

    of              : value : ( ptri ) ->
        ptri && new scope[ getClassIndex ptri ] ptri

    malloc          : value : -> malloc this

    defineProperty  : value : ( name, byteLength ) ->

    extend          : value : ( ClassName ) ->

        scopei = scope.i( this )

        document.body.appendChild(Object.assign(
            document.createElement("script"), {
                text : "scope.i(class #{ClassName} 
                extends scope[#{scopei}]{})"
            })).remove()

        if !Class = scope.find (i) -> i.name is ClassName
            return throw /EXTEND/

        ptrc = malloc ClassPointer
        ptrc . class = Class
        ptrc . parent = this::pointerof
        
        Class

    setBuffer   : value : ( buffer ) ->
        old = dvw and i32.slice() or [plen]
        dvw = new DataView      buffer
        ui8 = new Uint8Array    buffer
        u32 = new Uint32Array   buffer
        f32 = new Float32Array  buffer
        i32 = new Int32Array    buffer
        i32 . set old

        this

Object.defineProperties Pointer::,
    
    byteLength  : get   : getByteLength

    children    : get   : findAllChilds

    parent      :
        get     : -> Pointer.of getParentPtri this
        set     : -> setParentPtri this, arguments[0]

    subarray    : get   : ( TypedArray = Uint32Array ) -> new TypedArray(
        dvw.buffer, this, @byteLength / TypedArray.BYTES_PER_ELEMENT )

Object.defineProperties ClassPointer,

    of          : value : ( ptri ) ->
        ptri and new ClassPointer ptri

Object.defineProperties ClassPointer::,

    class       :
        get     : -> scope.at getScopeIndex this
        set     : ( Class ) ->
            setScopeIndex this, scope.i Class
            Object.defineProperty Class::, "pointerof", {
                value : this, writable : on
            } 
    
    parent      :
        get     : -> ClassPointer.of getParentPtri this
        set     : -> setParentPtri this, arguments[0]

    extends     : get   : findAllChilds

    name        : get   : -> @class.name
    
    instances   : get   : -> findInstances scope.i @class


Pointer.setBuffer new ArrayBuffer(12096)
malloc( ClassPointer ).class = Pointer

