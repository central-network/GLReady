{ log, warn, error } = console

iLE = new self.Uint8Array( self.Float32Array.of(1).buffer )[3] 
scp = new self.Array null
buf = new self.ArrayBuffer 4e5
i32 = new self.Int32Array buf
ui8 = new self.Uint8Array i32.buffer
dvw = new self.DataView i32.buffer

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

getAllHeaders = ( ptri = this ) ->
    hlen = headersLength / 4
    begin = ptri / 4

    [   usersInt32, parentPtri, scopeIndex, 
        classIndex, byteLength, nextOffset ] =
            i32.subarray begin - hlen, begin

    return {
        usersInt32, parentPtri, scopeIndex, 
        classIndex, byteLength, nextOffset,

        class : scp[ classIndex ]
        scopeItem : scp[ scopeIndex ]
        parent : renew_Pointer( parentPtri )
        next : renew_Pointer( nextOffset )
        byteArray : ui8.subarray(ptri, ptri + byteLength).slice()
        byteOffset : +ptri
    }

int32Property = ( byteOffset, classPointer, desc = {} ) ->

    setAsNumber         : ( i32v ) ->
        dvw.setInt32 this + byteOffset, i32v, iLE

    setAsScopei         : ( object ) ->
        dvw.setInt32 this + byteOffset, scopei(object), iLE

    getAsScopei         : ->
        scp[ dvw.getInt32 this + byteOffset, iLE ]

    getAsNumber         : ->
        dvw.getInt32 this + byteOffset, iLE

    getAsPointer        : ->
        renew_Pointer dvw.getInt32 this + byteOffset, iLE 

    getOrMalloc         : ->
        if  ptri = dvw.getInt32 this + byteOffset, iLE
            return renew_Pointer ptri

        if  typeof desc.default isnt "function"
            ptri = classPointer.malloc desc.byteLength

        else unless ptri = desc.default.call( this, classPointer, byteOffset )
            return 0

        dvw.setInt32 this + byteOffset, ptri, iLE

        return ptri

renew_Pointer = ( ptri = this ) ->
    if  ptri and clsi = getClassIndex ptri
        return new scp[ clsi ] ptri
    0

self.dump =
filterMallocs = ( test , ptri = this ) ->
    next = headersLength * 2
    index = 0
    matchs = [] 
    test = test and test.call and test
    
    while   next = getNextOffset next

        if  ptri
            if  ptri - getParentPtri next
                continue 

        
        if !ptrj = renew_Pointer next
            continue

        if  test
            if !test.call ptri, ptrj, index
                continue 
         
        matchs[ index++ ] = ptrj 
        
    matchs

Atomics.or i32, 0, headersLength

define = self.Object.defineProperties.bind self.Object

scopei = ( any ) ->
    throw /SCP/ unless any

    if -1 is i = scp.indexOf any
        i += scp.push any
    
    return i

malloc = ( byteLength = 0, Prototype = Number ) ->
    allocBytes = byteLength + headersLength
    
    if  0 < mod = allocBytes % 8
        allocBytes += 8 - mod

    ptriOffset = Atomics.add i32, 0, allocBytes
    nextOffset = ptriOffset + allocBytes + headersLength
    classIndex = scopei Prototype
    byteOffset = ptriOffset + headersLength

    setClassIndex classIndex, byteOffset
    setNextOffset nextOffset, byteOffset
    setByteLength byteLength, byteOffset
    
    new Prototype byteOffset

class Uint8ArrayPointer extends Number

    @from       : ( uInt8Array ) ->
        blen = uInt8Array.byteLength
        ptri = malloc blen, this
        ptri . toArray().set uInt8Array 
        ptri

class ObjectPointer extends Number
    @byteLength : 0
    @from       : ( object ) ->
        ptri = malloc @byteLength, this
        ptri . object = object
        ptri

define ObjectPointer::,
    object      :
        get     : -> scp[ getScopeIndex this ]
        set     : (v) -> setScopeIndex scopei(v), this

class FunctionPointer extends Number
    @byteLength : 4
    @from       : ( object ) ->
        ptri = malloc @byteLength, this
        ptri . object = object
        ptri

define FunctionPointer::,
    object      :
        get     : -> scp[ dvw.getInt32 this, iLE ]
        set     : (v) -> dvw.setInt32 this, scopei(v), iLE

    exec        :
        value   : -> @object arguments...

    name        :
        get     : -> @object.name

define Uint8ArrayPointer::,

    array       :
        get     : -> ui8.subarray this , this + @byteLength

    byteLength  :
        get     : -> getByteLength this

    set         :
        value   : ( array, index = 0 ) -> @array.set array , index ; this

class StringPointer extends Number
    
    @encoder    : FunctionPointer.from TextEncoder::encode.bind new TextEncoder

    @decoder    : FunctionPointer.from TextDecoder::decode.bind new TextDecoder

    @from       : ( string = "" ) ->
        data = @encoder.exec string
        Uint8ArrayPointer.from.call this, data

define StringPointer::,

    value       :
        get     : -> @toString()

    length      :
        get     : -> getByteLength this

    toArray     :
        value   : -> ui8.subarray this , this + @length

    toString    :
        value   : -> StringPointer.decoder.exec @toArray()

    toCamelCase :
        value   : -> @value[0].toLowerCase() + @value.substring(1)


class ClassPointer extends Number

    @byteLength : 12

    @from       : ( Any ) ->
        ptri = malloc @byteLength, ClassPointer
        ptri . name = StringPointer.from Any.name
        ptri . class = Any
        ptri . create()
        ptri 

class PropertyPointer extends Number

    @byteLength : 16

    @from       : ( classi, name ) ->
        ptri = malloc @byteLength, this        
        ptri . name = StringPointer.from name
        ptri . classPointer = classi
        ptri 

define PropertyPointer::,
    offset      :
        set     : ( i32v ) -> dvw.setInt32 this + 8, i32v, iLE
        get     : -> dvw.getInt32 this + 8, iLE

    classPointer:
        set     : ( ptri ) -> dvw.setInt32 this + 4, ptri, iLE
        get     : -> renew_Pointer dvw.getInt32 this + 4, iLE

    name        : 
        set     : ( ptri ) -> dvw.setInt32 this, ptri, iLE
        get     : -> renew_Pointer dvw.getInt32 this, iLE

    parent      : 
        set     : setParentPtri
        get     : -> renew_Pointer getParentPtri( this )

    malloc      :
        value   : ( byteLength = 0 ) ->
            @classPointer.malloc byteLength 

define ClassPointer::,
    name        : 
        set     : ( ptri ) ->
            dvw.setInt32 this, ptri, iLE

        get     : ->
            if  ptrn = dvw.getInt32 this, iLE
                return new StringPointer ptrn
            @name = StringPointer.from @class.name

    byteLength  :
        set     : ( i32v ) -> dvw.setInt32 this + 4, i32v, iLE
        get     : -> dvw.getInt32 this + 4, iLE

    parent      : 
        set     : setParentPtri
        get     : -> renew_Pointer getParentPtri( this )

    children    :
        get     : filterMallocs

    extends     : enumerable : on, get : ->
        filterMallocs.call this, ( ptri ) ->
            ptri instanceof ClassPointer

    malloc      :
        value   : ( byteLength = 0 ) ->
            malloc @byteLength + byteLength, @class 

    extend      :
        value   : ( name ) ->
            clss = ClassPointer
            ptri = malloc clss.byteLength, clss
            ptri.name = StringPointer.from name
            ptri.parent = this
            ptri.create()
            ptri

    create      :
        value   : ->
            if !parent = @parent and @parent.class
                return scp[ getScopeIndex this ]
                
            self[ pname = parent.name ] = parent 

            document.body.appendChild(Object.assign(
                document.createElement("script"), {text: (
                    "self.iclass = (class #{@name} extends #{pname} {})")}
            )).remove()

            this.class =
                self.iclass

            delete self.iclass
            delete self[pname]

            @class

    class       :
        set     : (cl) -> setScopeIndex scopei( cl ) , this
        get     : -> scp[ getScopeIndex this ] or @create()

    of          :
        value   : ( ptri ) ->
            setClassIndex getScopeIndex(this), ptri
            renew_Pointer ptri

    define      : 
        value   : ( prop, desc ) ->
            define @class.prototype, [ prop ]: {
                enumerable : on, 
                configurable : on, desc... 
            } ; this

    allocate    :
        value   : ( byteLength, prop, desc = -> ) ->
            byteOffset = this.byteLength
            this.byteLength += byteLength

            prop = prop || classPointer.name.toCamelCase()
            ptri = PropertyPointer.from prop

            ptri . parent = this
            ptri . offset = byteOffset
            
            @define prop, desc.call( this, byteOffset, prop )

            prop

    property    :
        value   : ( classPointer, prop, desc = {} ) ->
            byteOffset = this.byteLength
            this.byteLength += 4

            prop = prop || classPointer.name.toCamelCase()
            ptri = PropertyPointer.from prop

            ptri . parent = this
            ptri . offset = byteOffset
            ptri . classPointer = classPointer

            io = int32Property byteOffset, classPointer, desc

            @define prop, { 
                get : io.getOrMalloc
                set : io.setAsNumber, desc...
            }
            
            prop
        
rootClass = ClassPointer.from( Number )
rootPointerClass = rootClass.extend "Pointer"

extRefClass = rootPointerClass.extend "ExtRef"
extRefClass . define "object", {
    get : -> scp[ getScopeIndex this ]
    set : ( any ) -> setScopeIndex scopei(any), this 
}

uInt32Class = rootPointerClass.extend "Uint32Number"
uInt32Class . allocate 4, "value", ( byteOffset ) ->  
    get : -> dvw.getUint32 this + byteOffset, iLE
    set : -> dvw.setUint32 this + byteOffset, arguments[0], iLE

stringClass = rootPointerClass.extend "String"
stringClass . property uInt32Class, "length"
stringClass . define "byteArray", {
    get : -> getAllHeaders this
}

stringClass . define "value", {
    get : -> getAllHeaders this
}

localWindowClass = rootPointerClass.extend "LocalWindow"

localWindowClass . allocate 4, "document", ( byteOffset, prop ) ->

    set : -> dvw.setInt32 this + byteOffset, arguments[0], iLE
    get : ->
        if  ptri = dvw.getInt32 this + byteOffset, iLE
            return renew_Pointer ptri
        return @[ prop ] = ObjectPointer.from document

localWindowClass . allocate 4, "extRef", ( byteOffset, prop ) ->

    set : -> dvw.setInt32 this + byteOffset, arguments[0], iLE
    get : ->
        if  ptri = dvw.getInt32 this + byteOffset, iLE
            return renew_Pointer ptri
        return @[ prop ] = ObjectPointer.from self

localWindowClass . allocate 4, "name", ( byteOffset, prop ) ->

    set : -> dvw.setInt32 this + byteOffset, arguments[0], iLE
    get : ->
        if  ptri = dvw.getInt32 this + byteOffset, iLE
            return renew_Pointer ptri
        return @[ prop ] = StringPointer.from self.name

log rootPointerClass
log localWindowClass
log win = localWindowClass.malloc()


#warn win.name

log i32.subarray 0, 12
log scp
log getAllHeaders win.name
log filterMallocs()

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

