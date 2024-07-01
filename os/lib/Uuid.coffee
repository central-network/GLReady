import Pointer from "./Pointer.js"
export default UUID = Pointer.extend "UUID"
import { encode, decode } from "./Pointer.js"

UUID.staticProperty "TypedArray",
    value           : Uint8Array

UUID.staticProperty "malloc",
    value           : ->
        text = crypto.randomUUID()
        ptri = Pointer.malloc 36, UUID
        ptri . setUint8Array encode text
        ptri
    
UUID.objectProperty "value",
    get             : -> decode @subarray()
    enumerable      : on