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
                [y,z,x] = line
                    .split( " " )
                    .map (v) -> parseFloat v
                [x,y,z]

        if -1 isnt i = chars[ charcode ].findIndex (v) -> isNaN v 
            chars[ charcode ] = chars[ charcode ].slice(
                0, i - i % 3
            )


fs.writeFile "ibmplex.json", JSON.stringify( chars, null, "  " ), ->
    console.log "font file created: ibmplex.json"
    #font = JSON.parse fs.readFileSync "./ibmplex.json"
    process.exit()
