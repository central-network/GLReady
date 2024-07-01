import Pointer from "./Pointer.js"
import { HEADERS } from "./Pointer.js"
export default ExtRef = Pointer.extend "ExtRef"

Object.defineProperty scope = [,], "index",
    value       : ( any ) ->
        if -1 is i = @indexOf any
            i += @push any
        i

ExtRef.staticProperty "includes",
    value       : ( any ) ->
        scope.includes any

ExtRef.staticProperty "malloc",
    value       : ( object ) ->
        scpi = scope.index object if object
        ptri = Pointer.malloc 0, ExtRef
        HEADERS.scopeIndex.set ptri, scpi
        ptri

ExtRef.objectProperty "scopeArray",
    value       : scope

ExtRef.objectProperty "object",
    get         : -> this.scopeArray[ @scopeIndex ]
    enumerable  : on

ExtRef.objectProperty "scopeIndex",
    get         : -> HEADERS.scopeIndex.get this