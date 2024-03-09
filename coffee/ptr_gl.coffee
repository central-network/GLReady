import Pointer from "./ptr.coffee"

export class GL extends Pointer

export default GL.registerClass()

Object.defineProperties GL,

    byteLength  : value : 4 * 48

Object.defineProperties GL::,

    gl          : get   : -> 1