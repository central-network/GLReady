import Pointer from "./ptr.coffee"

export default class GL extends Pointer
    @byteLength = 4 * 48

    getCanvasNode   : -> @getLinkedNode().canvas

    setCanvasNode   : -> @setLinkedNode arguments[0].getContext "webgl2"

    Object.defineProperties this::,

        gl          : get : GL::getLinkedNode

        canvas      : get : GL::getCanvasNode , set : GL::setCanvasNode

GL.registerClass()

