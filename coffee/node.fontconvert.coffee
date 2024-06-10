fs = require('fs')
dir = './fonts/ibmplex/';
replaces = {
    dot : "."
    comma : ","
}

chars = {}
fs
    .readdirSync dir
    .filter (file) -> file.endsWith ".obj"
    .forEach (file) ->

        [ filename ] = file.split ".obj"
        for name, char of replaces
            filename = filename.replace name, char

        charcode = filename.charCodeAt 0
        fcontent = fs
            .readFileSync dir + file
            .toString()

        chars[ charcode ] = fcontent
            .substring(
                fcontent.indexOf("v "),
                fcontent.indexOf("vt "),
            )
            .replace( /v /g, "" )
            .split( /\n/)
            .flatMap ( line ) ->
                [ x, z, y ] = line
                    .split( " " )
                    .map parseFloat
                [ x, y, z ]

fs.writeFile "ibmplex.json", JSON.stringify( chars, null, "  " ), ->
    console.log "font file created: ibmplex.json"
    process.exit()