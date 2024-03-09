import Pointer from "./ptr.coffee"
export default class GL extends Pointer


Object.defineProperties GL.registerClass(),

    byteLength  : value : 4 * 48

Object.defineProperties GL::,

    gl          : get   : -> 1