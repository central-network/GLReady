
nos = new BroadcastChannel "nos"
nos . addEventListener "message", ({ data }) ->
    @methods[ data.call ].postMessage data
nos.methods = {}

device = ( name ) ->

    dev = new Worker "#{name}/driver.js", { name }
    dev.name = name

    dev.addEventListener "message", ({ data: methods }) ->
        nos.methods[ m ] = this for m in methods
        nos[ this.name ] = this

    nos

export default {
    device
}