import Pointer from "./Pointer.js"
import UUID from "./Uuid.js"
import ExtRef from "./ExtRef.js"

LocalMachine = Pointer.extend "LocalMachine"

LocalMachine.mallocProperty "uuid", {
    instanceof  : UUID
    enumerable  : on
    ifnull      : -> @appendChild UUID.malloc()
}

LocalMachine.mallocProperty "extref", {
    instanceof  : ExtRef
    enumerable  : on
    ifnull      : -> @appendChild ExtRef.malloc window 
}

export default LocalMachine