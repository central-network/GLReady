var baseBuffer, localMachine;

import LocalMachine from "./lib/LocalMachine.js";

baseBuffer = new ArrayBuffer(24096);

LocalMachine.setBuffer(baseBuffer);

localMachine = LocalMachine.malloc();

console.warn(LocalMachine.name);

console.warn(localMachine);
