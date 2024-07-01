import Pointer from "./Pointer.js"
export default Text = Pointer.extend "Text"
import { encode, decode } from "./Pointer.js"

Text.staticProperty "TypedArray",
    value : Uint8Array

Text.objectProperty "value",
    get   : ->
        subarray = @subarray()
        
        unless end = subarray.indexOf 0
            return ""

        if !subarray.buffer instanceof ArrayBuffer
            return decode subarray.slice 0, end
            
        decode subarray.subarray 0, end