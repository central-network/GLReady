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
  var char, charcode, fcontent, filename, i, name;
  [filename] = file.split(".obj");
  for (name in replaces) {
    char = replaces[name];
    filename = filename.replace(name, char);
  }
  charcode = filename.charCodeAt(0);
  fcontent = fs.readFileSync(dir + file).toString();
  chars[charcode] = fcontent.substring(fcontent.indexOf("v "), fcontent.indexOf("vt ")).replace(/v /g, "").split(/\n/).flatMap(function(line) {
    var x, y, z;
    [y, z, x] = line.split(" ").map(function(v) {
      return parseFloat(v);
    });
    return [x, y, z];
  });
  if (-1 !== (i = chars[charcode].findIndex(function(v) {
    return isNaN(v);
  }))) {
    return chars[charcode] = chars[charcode].slice(0, i - i % 3);
  }
});

fs.writeFile("ibmplex.json", JSON.stringify(chars, null, "  "), function() {
  console.log("font file created: ibmplex.json");
  //font = JSON.parse fs.readFileSync "./ibmplex.json"
  return process.exit();
});
