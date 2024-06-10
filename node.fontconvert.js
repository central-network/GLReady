var chars, dir, fs, replaces;

fs = require('fs');

dir = './fonts/ibmplex/';

replaces = {
  dot: ".",
  comma: ","
};

chars = {};

fs.readdirSync(dir).filter(function(file) {
  return file.endsWith(".obj");
}).forEach(function(file) {
  var char, charcode, fcontent, filename, name;
  [filename] = file.split(".obj");
  for (name in replaces) {
    char = replaces[name];
    filename = filename.replace(name, char);
  }
  charcode = filename.charCodeAt(0);
  fcontent = fs.readFileSync(dir + file).toString();
  return chars[charcode] = fcontent.substring(fcontent.indexOf("v "), fcontent.indexOf("vt ")).replace(/v /g, "").split(/\n/).flatMap(function(line) {
    var x, y, z;
    [x, z, y] = line.split(" ").map(parseFloat);
    return [x, y, z];
  });
});

fs.writeFile("ibmplex.json", JSON.stringify(chars, null, "  "), function() {
  console.log("font file created: ibmplex.json");
  return process.exit();
});
