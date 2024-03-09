self.log = ->
    iw = !window?
    t = if iw then [ "%c[worker]", "color: yellow;" ] else [ "%c[window]", "color: aqua;" ]
    console.groupCollapsed ...t, arguments[0]
    console.log v for v in [ ...arguments ].slice 1
    console.groupEnd()

self.def = -> Object.defineProperties.apply Object, arguments
self.val = ( obj, value ) -> Object.defineProperty obj, { value }

self.bc = new BroadcastChannel "ptr"