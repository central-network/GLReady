import Pointer from "../raw.js"

nos = new BroadcastChannel "nos"
nos . addEventListener "message", ({ data }) ->
    console.log data

nos.drivers = {
    methods : postMessage : ( data ) ->
        dev = nos[ data.from ]
        nos.drivers[ m ] = dev for m in data.args
}

device = ( name ) ->

    dev = new Worker "#{name}/driver.js", { name }

    dev.addEventListener "message", ({ data }) ->
        nos.drivers[ data.call ].postMessage(
            { ...data, ...from: @name }
        )

    nos[ name ] = Object.defineProperties(
        dev , name : { value : name }
    )
    
export default { device }