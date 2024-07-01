class Pointer extends Number
class ClassPointer extends Number    
class ClassProperty extends Pointer    

export encode = TextEncoder::encode.bind new TextEncoder
export decode = TextDecoder::decode.bind new TextDecoder

{ log, warn, error } = console
[ iLE, dvw, ui8, i32, u32, f32, i16, u16 ] = [1]
[ wait, self.scope, thread, lock, plen ] = [ {}, [], -1, ->, 24 ]

Object.defineProperties scope, i : value : ->
    if -1 is i = @indexOf arguments[0]
        i += @push arguments[0]
    i

Object.defineProperties Object.getPrototypeOf(Uint8ClampedArray),
    DataViewGetter : get : -> "get#{ @name.replace('Array', '')}"
    DataViewSetter : get : -> "set#{ @name.replace('Array', '')}"

getNextOffset = ( ptri = this ) -> dvw.getInt32 ptri - 24, iLE 
setNextOffset = ( ptri , next ) -> dvw.setInt32 ptri - 24, next, iLE 

getByteLength = ( ptri = this ) -> dvw.getInt32 ptri - 20, iLE 
setByteLength = ( ptri , byte ) -> dvw.setInt32 ptri - 20, byte, iLE 

getScopeIndex = ( ptri = this ) -> dvw.getInt32 ptri - 16, iLE 
setScopeIndex = ( ptri , scpi ) -> dvw.setInt32 ptri - 16, scpi, iLE 

getClassIndex = ( ptri = this ) -> dvw.getInt32 ptri - 12, iLE 
setClassIndex = ( ptri , clsi ) -> dvw.setInt32 ptri - 12, clsi, iLE 

getParentPtri = ( ptri = this ) -> dvw.getInt32 ptri -  8, iLE 
setParentPtri = ( ptri , ptrj ) -> dvw.setInt32 ptri -  8, ptrj, iLE 

getFree4Bytes = ( ptri = this ) -> dvw.getInt32 ptri -  4, iLE 
setFree4Bytes = ( ptri , byte ) -> dvw.setInt32 ptri -  4, byte, iLE 

export HEADERS = {
    nextOffset : { get: getNextOffset, set: setNextOffset }
    byteLength : { get: getByteLength, set: setByteLength }
    scopeIndex : { get: getScopeIndex, set: setScopeIndex }
    classIndex : { get: getClassIndex, set: setClassIndex }
    parentPtri : { get: getParentPtri, set: setParentPtri }
    free4Bytes : { get: getFree4Bytes, set: setFree4Bytes }
}

findInstances = ( clsi ) ->

    matchs = []
    ptri = ptri+0
    next = plen*2

    while ptrj = getNextOffset next
        unless clsi - getClassIndex ptrj
            matchs[ matchs.length ] = Pointer.of ptrj
        next = ptrj
    matchs

findAllChilds = ( ptri = this ) ->

    matchs = []

    ptri = ptri+0
    next = plen*2

    while ptrj = getNextOffset next
        unless ptri - getParentPtri ptrj
            matchs[ matchs.length ] =
                new scope[ getClassIndex ptrj ] ptrj
        next = ptrj

    matchs


malloc = ( Class, byteLength = 0 ) ->
    allocLength = byteLength + plen

    if  mod = allocLength % 8
        allocLength += 8 - mod
        
    ptriOffset = Atomics.add i32, 0, allocLength
    nextOffset = ptriOffset + allocLength + plen
    ptri = ptriOffset + plen

    setNextOffset ptri , nextOffset
    setByteLength ptri , byteLength
    setClassIndex ptri , scope.i Class

    new Class ptri

Object.defineProperties Pointer,

    TypedArray          : value : Uint8Array

    byteLength          : value : 0, writable : 1

    encode              : value : -> +arguments[0]
    
    decode              : value : -> Pointer.of arguments[0]

    setHeader           : value : ( offset, value ) ->
        dvw.setInt32 this + offset, value, iLE 
    
    getHeader           : value : ( offset ) ->
        dvw.getInt32 this + offset, iLE 

    of                  : value : ( ptri ) ->
        ptri && new scope[ getClassIndex ptri ] ptri

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

    [ "{{Pointer}}" ]   : get   : ->
    
        NextOffset : getNextOffset this
        ByteLength : getByteLength this
        ScopeIndex : getScopeIndex this
        ClassIndex : getClassIndex this
        ParentPtri : getParentPtri this

        subarrays       :
            Uint8Array  : @subarray Uint8Array
            Uint16Array : @subarray Uint16Array
            Uint32Array : @subarray Uint32Array
            Int32Array  : @subarray Int32Array
            Float32Array: @subarray Float32Array

    children            :
        get             : findAllChilds
        configurable    : on
        enumerable      : on

    parent              :
        get             : -> Pointer.of getParentPtri this
        set             : -> setParentPtri this, arguments[0]
        enumerable      : on

    subarray            : value : ->
        if  isNaN(arguments[0])
            TypedArray = arguments[0] or this.constructor.TypedArray
            byteOffset = arguments[1] or 0
            byteLength = arguments[2] or getByteLength this

        else
            TypedArray = this.constructor.TypedArray
            byteOffset = arguments[0] or 0
            byteLength = arguments[1] || getByteLength this

        offset = byteOffset + this
        length = ( byteLength - byteOffset ) / TypedArray.BYTES_PER_ELEMENT

        new TypedArray dvw.buffer, offset, length 

    setUint8Array       : value : ( data, index = 0 ) ->
        @subarray( Uint8Array ).set( data, index ); this

    appendChild         : value : ( ptri ) -> setParentPtri ptri, this ; ptri

Object.defineProperties ClassPointer,

    of                  : value : ( ptri ) -> ptri and new ClassPointer ptri

Object.defineProperties ClassProperty::,

    name                : enumerable : on, get : ->
        decode @nameArray()

    pointerOffset       :
        enumerable      : on
        get : -> dvw.getUint8 this
        set : -> dvw.setUint8 this, arguments[0]

    byteLength          :
        enumerable      : on
        get : -> dvw.getUint8 this + 1
        set : -> dvw.setUint8 this + 1, arguments[0]

    children            : value : []

    nameArray           : value : -> @subarray 12

Object.defineProperties ClassPointer::,

    class       :
        get     : -> scope.at getScopeIndex this
        set     : -> setScopeIndex this, scope.i arguments[0]
        enumerable: on
    
    parent      :
        get     : -> ClassPointer.of getParentPtri this
        set     : -> setParentPtri this, arguments[0]
        enumerable: on

    extends     : enumerable : on, get : ->
        findAllChilds( this ).filter (i) -> i instanceof ClassPointer

    extend      : value : ( ClassName ) ->
        scopei = getScopeIndex this

        document.body.appendChild(Object.assign(
            document.createElement("script"), {
                text : "scope.i(class #{ClassName} 
                extends scope[#{scopei}]{})"
            })).remove()

        if !Class = scope.find (i) -> i.name is ClassName
            return throw /EXTEND/

        ptrc = malloc ClassPointer
        setScopeIndex ptrc, scope.i Class 
        setParentPtri ptrc, this

        Object.defineProperties Class::,
            classPointer : value : ptrc
        
        ptrc

    name        : enumerable : on, get : -> @class.name

    children    : enumerable : on, get : ->
        findAllChilds( this ).filter (i) -> i instanceof ClassProperty 

    byteLength  : enumerable : on, get : getByteLength
    
    instances   : enumerable : on, get : -> findInstances scope.i @class

    malloc      : value : ( byteLength = 0, Class = this.class ) ->
        malloc Class, byteLength

    staticProperty : value : ( prop, desc ) ->
        Object.defineProperty @class, prop, desc

    objectProperty : value : ( prop, desc ) ->
        Object.defineProperty @class.prototype, prop, desc

    mallocProperty : value : ( prop, desc ) ->
        byteOffset = getByteLength this

        if  desc.instanceof instanceof ClassPointer
            encodedName = encode prop
            propByteLength = encodedName.byteLength + 12
            ptri = malloc ClassProperty, propByteLength

            setParentPtri ptri, this
            setScopeIndex ptri, scope.i desc.instanceof

            ptri.nameArray().set encodedName
            ptri.pointerOffset = byteOffset 
            ptri.byteLength = byteLength = 4
            
            #getter = "getInt32"
            #setter = "setInt32"
            #decode = Pointer.of
            #encode = (v) -> +v

        setByteLength this, byteOffset + byteLength

        return warn this, byteOffset, getByteLength this

        if  Pointer.isPrototypeOf desc.instanceof
            byteLength = 4
            getter = "getInt32"
            setter = "setInt32"
            decode = Pointer.of
            encode = (v) -> +v

        else            
            byteLength = desc.byteLength or (
                ( desc.instanceof.BYTES_PER_ELEMENT ) * 
                ( desc.length || 1 )
            )
            getter = desc.getter || desc.instanceof.DataViewGetter
            setter = desc.setter || desc.instanceof.DataViewSetter
            encode = desc.encode || desc.instanceof.encode || ((v) -> v)
            decode = desc.decode || desc.instanceof.decode || ((v) -> v)
    
        ifnull = desc.ifnull || (-> 0)

        #defines on Class (static)
        if  Pointer.isPrototypeOf target
            constructor = target
            
        #defines on Class.prototype
        if  target instanceof Pointer
            constructor = target.constructor
            byteOffset = constructor.byteLength
            options = {
                writable : desc.writable
                enumerable : desc.enumerable
                configurable : desc.configurable
            }

            delete options[k] for k, v of options when !v

            Object.defineProperty target, prop, {

                get : ->
                    if  val = decode.call( @, dvw[getter]( @ + byteOffset, iLE ) )
                        return val

                    if  val = ifnull.call( @ )
                        return @[ prop ] = val 
                    
                    0
                
                set : (v) ->
                    dvw[setter]( @ + byteOffset, encode.call(@, v), iLE)

                ...options
            }
        
        constructor.byteLength += byteLength

        return target



Pointer.setBuffer new ArrayBuffer(12096)
PointerClass = malloc ClassPointer 
setScopeIndex PointerClass, scope.i Pointer

export default PointerClass 