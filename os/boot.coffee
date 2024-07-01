{ log, warn, error } = console

iLE = new self.Uint8Array( self.Float32Array.of(1).buffer )[3] 
scp = new self.Array null
buf = new self.ArrayBuffer 4e5
i32 = new self.Int32Array buf
ui8 = new self.Uint8Array i32.buffer
dvw = new self.DataView i32.buffer

Atomics.or i32, 0, 24

define = self.Object.defineProperties.bind self.Object

scopei = ( any ) ->
    throw /SCP/ unless any

    if -1 is i = scp.indexOf any
        i += scp.push any
    
    return i

malloc = ( byteLength = 0, Prototype = Number ) ->
    allocBytes = byteLength + 24
    
    if  0 < mod = allocBytes % 8
        allocBytes += 8 - mod

    ptriOffset = Atomics.add i32, 0, allocBytes
    nextOffset = ptriOffset + allocBytes + 24
    byteOffset = ptriOffset + 24
    classIndex = scopei Prototype

    dvw.setInt32 byteOffset - 12, classIndex, iLE 
    dvw.setInt32 byteOffset -  8, nextOffset, iLE 
    dvw.setInt32 byteOffset -  4, byteLength, iLE 
    
    byteOffset

verify = ( byteOffset ) ->
    return 0 if byteOffset < 8
    return 0 if byteOffset % 8

    nextOffset = dvw.getInt32 byteOffset - 8, iLE
    byteLength = dvw.getInt32 byteOffset - 4, iLE
    calcOffset = byteOffset + byteLength + 24
    
    return 0 if (calcOffset - nextOffset) > 0
    return byteOffset    

pointerOf = ( byteOffset ) ->
    return 0 unless ptri = verify byteOffset
    return 0 unless clsi = dvw.getInt32 ptri - 12, iLE

    new scp[ clsi ] ptri

class ExtRef extends Number
    @byteLength : 4
    @from       : ( object ) ->
        ptri = new this malloc @byteLength, this
        ptri . object = object
        ptri

class Uint8Array extends Number

    @from       : ( uInt8Array ) ->
        blen = uInt8Array.byteLength
        ptri = new this malloc blen, this
        ptri.toArray().set uInt8Array 
        ptri

class Function extends ExtRef

define ExtRef::,

    object      :
        get     : -> scp[ dvw.getInt32 this, iLE ]
        set     : (v) -> dvw.setInt32 this, scopei(v), iLE

define Function::,

    exec        :
        value   : -> @object arguments...

    name        :
        get     : -> @object.name

define Uint8Array::,

    array       :
        get     : -> ui8.subarray this , this + @byteLength

    byteLength  :
        get     : -> dvw.getInt32 this - 4, iLE

    set         :
        value   : ( array, index = 0 ) ->
            @array.set array , index ; this

class String extends Number
    
    @encoder    : Function.from TextEncoder::encode.bind new TextEncoder

    @decoder    : Function.from TextDecoder::decode.bind new TextDecoder

    @from       : ( string = "" ) ->
        data = @encoder.exec string
        Uint8Array.from.call this, data

define String::,

    value       :
        get     : -> @toString()

    length      :
        get     : -> dvw.getInt32 this - 4, iLE

    toArray     :
        value   : -> ui8.subarray this , this + @length

    toString    :
        value   : -> String.decoder.exec @toArray()


class Class extends Number

    @byteLength : 12

    @from       : ( Any ) ->
        ptri = new this malloc @byteLength, this
        ptri . class = scopei Any
        ptri 

define Class::,
    name        : 
        set     : ( ptri ) -> dvw.setInt32 this, ptri, iLE
        get     : ->
            if  ptrn = dvw.getInt32 this, iLE
                return new String ptrn
            @name = String.from @class.name

    parent      : 
        set     : ( ptri ) ->  dvw.setInt32 this + 4, ptri, iLE
        get     : -> pointerOf dvw.getInt32 this + 4, iLE

    extend      :
        value   : ( name, Prototype = @constructor ) ->
            ptri = malloc Prototype.byteLength, Prototype
            ptrc = new Prototype ptri
            ptrc.name = String.from name
            ptrc.parent = this
            ptrc.create()
            ptrc

    create      :
        value   : ->
            if  parent = @parent or ""
                self.pclass = parent.class 
                parent = "extends #{self.pclass.name}"

            document.body.appendChild(Object.assign(
                document.createElement("script"), {text: (
                    "self.iclass = (class #{@name} #{parent} {})")}
            )).remove()

            @class = scopei self.iclass

            delete self.iclass
            delete self.pclass

            scp[ @class ]

    class       :
        set     : (v) -> dvw.setInt32 this + 8, v, iLE
        get     : -> scp[ dvw.getInt32 this + 8, iLE ] or @create()

clssNumber = Class.from Number
clssPointer = clssNumber.extend "Pointer"
log clssNumber
log clssPointer

log i32.subarray 0, 12
log scp

a = ->

    headersLength = 0
    ptrNextOffset = headersLength += 4 
    getNextOffset = ( ptri = this ) -> dvw.getInt32 ptri - ptrNextOffset, iLE
    setNextOffset = ( i32v , ptri = this ) -> dvw.setInt32 ptri - ptrNextOffset, i32v, iLE

    ptrByteLength = headersLength += 4 
    getByteLength = ( ptri = this ) -> dvw.getInt32 ptri - ptrByteLength, iLE
    setByteLength = ( i32v , ptri = this ) -> dvw.setInt32 ptri - ptrByteLength, i32v, iLE

    ptrClassIndex = headersLength += 4 
    getClassIndex = ( ptri = this ) -> dvw.getInt32 ptri - ptrClassIndex, iLE
    hasClassIndex = ( clsi , ptri = this ) -> 0 is clsi - dvw.getInt32 ptri - ptrClassIndex, iLE
    setClassIndex = ( i32v , ptri = this ) -> dvw.setInt32 ptri - ptrClassIndex, i32v, iLE

    ptrScopeIndex = headersLength += 4 
    getScopeIndex = ( ptri = this ) -> dvw.getInt32 ptri - ptrScopeIndex, iLE
    setScopeIndex = ( i32v , ptri = this ) -> dvw.setInt32 ptri - ptrScopeIndex, i32v, iLE

    ptrParentPtri = headersLength += 4 
    getParentPtri = ( ptri = this ) -> dvw.getInt32 ptri - ptrParentPtri, iLE
    setParentPtri = ( i32v , ptri = this ) -> dvw.setInt32 ptri - ptrParentPtri, i32v, iLE

    ptrUsersInt32 = headersLength += 4 
    getUsersInt32 = ( ptri = this ) -> dvw.getInt32 ptri - ptrUsersInt32, iLE
    setUsersInt32 = ( i32v , ptri = this ) -> dvw.setInt32 ptri - ptrUsersInt32, i32v, iLE

    class Pointer extends Number
        constructor : (n) -> super(n).oninit()
    class GlobalScope extends Pointer
    class StringPointer extends Pointer
    class ClassPointer extends StringPointer
    class ClassProperty extends StringPointer
    class FunctionPointer extends StringPointer

    class BufferPointer extends Pointer

    read = Atomics.load.bind Atomics, i32
    write = Atomics.store.bind Atomics, i32
    malloc = Atomics.add.bind Atomics, i32, 0
    scope = Object.defineProperty [ Pointer ], "i", value : (o) ->
        if -1 is i = @indexOf(o) then i + @push(o) else i


    Object.defineProperty String::, "toCamelCase",
        value : -> @[0].toLowerCase() + @substring(1)

    Object.defineProperties Pointer::,
        onalloc     : configurable : on, value : -> this
        oninit      : configurable : on, value : -> this
        buffer      : configurable : on, value : dvw.buffer
        set         : value : ( arrayLike = [], index = 0, TypedArray = this.TypedArray ) ->
            @subarray( TypedArray ).set( arrayLike, index ); this

        subarray    : value : ( TypedArray = Uint8Array ) ->
            byteOffset = +this
            length = @getByteLength()

            if  1 < TypedArray.BYTES_PER_ELEMENT
                length /= TypedArray.BYTES_PER_ELEMENT

            new TypedArray @buffer, byteOffset, length
        
    Object.defineProperties Pointer::,

        ["{{Pointer}}"] : get  : -> new Int32Array @buffer, this - headersLength, headersLength/4 

        filter        : value : ( fn ) ->

            next = headersLength
            ptri = this+
            index = 0
            matchs = [] 
            
            while next = getNextOffset next
                continue if ptri - getParentPtri next
                ptrj = Pointer.of next

                continue if fn and !fn.call this, ptrj, index
                matchs[ index++ ] = ptrj

            matchs
        

    Object.defineProperties Pointer::,
        getNextOffset : value : getNextOffset
        getByteLength : value : getByteLength
        getClassIndex : value : getClassIndex
        hasClassIndex : value : hasClassIndex
        getScopeIndex : value : getScopeIndex
        getParentPtri : value : getParentPtri
        getUsersInt32 : value : getUsersInt32

    Object.defineProperties Pointer::,
        setNextOffset : value : setNextOffset
        setByteLength : value : setByteLength
        setClassIndex : value : setClassIndex
        setScopeIndex : value : setScopeIndex
        setParentPtri : value : setParentPtri
        setUsersInt32 : value : setUsersInt32

    Object.defineProperties Pointer,

        byteLength    : value : 0, writeable : yes

        TypedArray    : value : Uint8Array, configurable : yes

        malloc        : value : ( byteLength = 0, ProtoClass = this ) ->
            allocBytes = byteLength + headersLength

            if  mod = allocBytes % 8
                allocBytes += 8 - mod

            byteOffset = malloc allocBytes
            classIndex = scope.i ProtoClass
            ptriOffset = byteOffset + headersLength
            nextOffset = ptriOffset + allocBytes

            ptri = new this ptriOffset

            ptri.setNextOffset nextOffset
            ptri.setByteLength byteLength
            ptri.setClassIndex classIndex 

            ptri.onalloc()
            ptri

        of          : value : ( ptri, Prototype = this ) ->
            return 0 if !ptri
            
            if !Pointer is Prototype 
                return new Prototype ptri

            new scope[ getClassIndex ptri ] ptri

    Object.defineProperties GlobalScope::,

        onalloc             : value : -> @setScopeIndex scope.i self

        self                : get   : -> scope[ @getScopeIndex() ]
        
        buffer              : get   : -> dvw.buffer

        scope               : get   : -> scope

        bufferLength        : get   : -> dvw.byteLength

        bufferOffset        : get   : -> @getNextOffset()

        int32array          : get   : -> new Int32Array @buffer, 0, @bufferOffset/4

        pointers            : get   : ->
            next = headersLength
            matchs = []
            while next = getNextOffset next
                matchs.push Pointer.of next
            matchs


    Object.defineProperties StringPointer,
        encode : value : TextEncoder::encode.bind new TextEncoder
        decode : value : TextDecoder::decode.bind new TextDecoder
        from   : value : ( text = "" ) ->
            data = @encode text
            ptri = @malloc( data.byteLength )
            ptri . set( data )

    Object.defineProperties StringPointer::,
        toString            : value : -> StringPointer.decode @subarray().slice()

    Object.defineProperties Map::,
        class               : set   : setParentPtri, get : -> Pointer.of @getParentPtri()

    Object.defineProperties FunctionPointer::,
        name                : get   : -> @toString()

        value               :
            get   : -> scope[ getScopeIndex( this ) ]
            set   : -> @setScopeIndex scope.i arguments[0]

        call                : value : -> scope[ getScopeIndex( this ) ].call arguments...

        bind                : value : -> scope[ getScopeIndex( this ) ].bind arguments...

        apply               : value : -> scope[ getScopeIndex( this ) ].apply arguments...
            
    Object.defineProperties ClassPointer::,
        name                : get   : -> @toString()

        parent              :
            get   : -> Pointer.of @getParentPtri()
            set   : -> @setParentPtri arguments[0]

        extend              : value : ->
            if  parent = @parent or ""
                parent = "extends " + parent.class.name
                self.pclass = parent.class

            document.body.appendChild(Object.assign(
                document.createElement("script"), {text: (
                    "self.iclass = (class #{@name} #{parent} {})")}
            )).remove()

            @class = self.iclass

            delete self.pclass
            delete self.iclass

            @class

        class               :
            set   : (c) -> @setScopeIndex scope.i c
            get   : -> scope[ @getScopeIndex() or -1 ] or @extend()

        extends             : get   : -> @filter()
        malloc              : value : -> @class.malloc arguments...


    Object.defineProperties Map::,

        propertyOffset      : set   : setByteLength, get : getByteLength

        parent              : set   : setParentPtri, get : -> Pointer.of @getParentPtri()

        children            : get   : Pointer::filter

        extends             : get   : -> @filter ( ptrj ) -> ptrj instanceof ClassPointer
            
        properties          : get   : -> @filter ( ptrj ) -> ptrj instanceof ClassProperty

        extend              : value : ( name ) ->
            ptrc = ClassPointer.malloc()
            self[ @name ] = @prototype

            document.body.appendChild(Object.assign(
                document.createElement("script"), { text: (
                    "self.NEW = (class #{name} extends #{@name} {})") }
            )).remove()

            ptrc.setParentPtri this
            ptrc.setScopeIndex scope.i self.NEW

            delete self[ @name ]
            delete self[ "NEW" ]

            ptrc

        defineProperty      : value : ( ptrc, name ) ->

            prop = ClassProperty.from(
                name || ptrc.name.toCamelCase()
            )

            prop.setParentPtri this
            prop.setScopeIndex ptrc

            this

        prototype           : 
            set : (v) -> @setScopeIndex scope.i v
            get : -> scope[ @getScopeIndex() ]

        malloc              : value : ( byteLength = 0 ) ->
            @prototype.malloc byteLength

        name                : get   : -> @prototype.name
        

        encodeMethod = FunctionPointer.from "encodeText"
        encodeMethod.value = TextEncoder::encode.bind new TextEncoder

        decodeMethod = FunctionPointer.from "decodeText"
        decodeMethod.value = TextDecoder::decode.bind new TextDecoder

        numberClass = ClassPointer.from "Number"
        numberClass.class = Number

        memoryClass = ClassPointer.from "Pointer0"
        memoryClass.parent = numberClass

        warn encodeMethod
        warn decodeMethod
        warn memoryClass


    document.body.appendChild(Object.assign(
        document.createElement("script"), { text : document.querySelector(
            "[src*='#{`import.meta.url.split(/\//).at(-1)`}']").text.trim() }
    )).ownerDocument.querySelectorAll("script").forEach (n) -> n.remove()

