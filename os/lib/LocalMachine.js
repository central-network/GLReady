var LocalMachine;

import Pointer from "./Pointer.js";

import UUID from "./Uuid.js";

import ExtRef from "./ExtRef.js";

LocalMachine = Pointer.extend("LocalMachine");

LocalMachine.mallocProperty("uuid", {
  instanceof: UUID,
  enumerable: true,
  ifnull: function() {
    return this.appendChild(UUID.malloc());
  }
});

LocalMachine.mallocProperty("extref", {
  instanceof: ExtRef,
  enumerable: true,
  ifnull: function() {
    return this.appendChild(ExtRef.malloc(window));
  }
});

export default LocalMachine;
