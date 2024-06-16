import font from "./ibmplex.json" with { type: "json" };
var delay, error, init2dContext, log, warn;

sessionStorage.setItem("font", JSON.stringify(font));

({log, warn, error} = console);

delay = function() {
  return new Promise((done) => {
    return setTimeout(done, arguments[0] || 1000);
  });
};

Object.defineProperties(Math, {
  rad: {
    value: function(deg) {
      return deg * Math.PI / 180;
    }
  },
  deg: {
    value: function(rad) {
      return rad * 180 / Math.PI;
    }
  },
  powsum: {
    value: function(arr, pow = 2) {
      return [...arr].flat().reduce(function(a, b) {
        return a + Math.pow(b, pow);
      });
    }
  }
});

init2dContext = function(width = 500, height, margin = "0") {
  var ctx;
  ctx = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true
  });
  ctx.scale(devicePixelRatio, devicePixelRatio);
  height || (height = width);
  document.body.append(ctx.canvas);
  Object.assign(ctx.canvas, {
    width: width * devicePixelRatio,
    height: height * devicePixelRatio
  }).setAttribute("style", [`width:${CSS.px(width)}`, `height:${CSS.px(height)}`, "outline:1px dashed red", "inset:50%", "background:transparent", "display:block", `margin:${margin}`, "transform:translate(-50%, -50%) scaleY(-1)", "position:fixed"].join(";"));
  return ctx;
};

0 && (function() {
  var baslangicAl, bulunanlar, c, data, dataGuncelle, drawCircle, drawPin, drawTriangle, enVerimliCikisiBul, findFromMax, findFromMin, indeks, k, maksimumDoluUcgeniBul, noktaSekilUzerindeMi, offscreen, oku, p, pathTriangle, pin, pixelpin, sagaKaykil, sekilGecen, sekilKalip, size, sonlanisBul, triangle, triangles, ucgenAlaniHesapla, ucgenAlaninTamDoluMu, ucgenAlaniniBosalt, ucgeniKes, xMax, xMin, yMax, yMin, yon;
  sekilKalip = init2dContext(500, 500, "0 0 0 -260px");
  sekilGecen = init2dContext(500, 500, "0 0 0 260px");
  triangle = init2dContext(500, 500, "0 0 0 -260px");
  triangles = init2dContext(500, 500, "0 0 0 -260px");
  pin = init2dContext(500, 500, "0 0 0 -260px");
  offscreen = new OffscreenCanvas(1000, 1000).getContext("2d");
  noktaSekilUzerindeMi = function(sekil, x, y) {
    return offscreen.isPointInPath(sekil, x, y) || offscreen.isPointInStroke(sekil, x, y);
  };
  pixelpin = function(x, y, color = "red") {
    if (isNaN(x)) {
      ({x, y} = x);
    }
    pin.strokeStyle = color;
    pin.beginPath();
    pin.arc(x, y, 10, 0, 2 * Math.PI);
    pin.closePath();
    pin.stroke();
    return {x, y};
  };
  drawTriangle = function(x1, y1, x2, y2, x3, y3) {
    var path;
    path = new Path2D();
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
    path.lineTo(x3, y3);
    path.lineTo(x1, y1);
    path.closePath();
    triangles.fillStyle = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
    triangles.fill(path);
    return path;
  };
  pathTriangle = function(x1, x2, x3, y1, y2, y3) {
    var path;
    path = new Path2D();
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
    path.lineTo(x3, y3);
    path.lineTo(x1, y1);
    path.closePath();
    return path;
  };
  drawPin = function() {};
  xMin = 0;
  yMin = 0;
  xMax = 1000;
  yMax = 1000;
  p = 0;
  findFromMin = function() {
    var isin, xi, yi;
    xi = Math.trunc(Math.random() * 1000);
    while (xi < xMax) {
      yi = Math.floor(Math.random() * 1000);
      while (yi < yMax) {
        if (isin = sekilKalip.isPointInPath(c, xi, yi) || sekilKalip.isPointInStroke(c, xi, yi)) {
          return pixelpin(xi, yi);
          throw ["first", xi, yi];
        }
        yi++;
      }
      xi++;
    }
    if (p++ > 100) {
      throw "p";
    }
    return findFromMin();
  };
  findFromMax = function() {
    var isin, xi, yi;
    xi = xMax;
    while (--xi) {
      yi = 0;
      while (yi < yMax) {
        if (isin = sekilKalip.isPointInPath(c, xi, yi)) {
          return pixelpin(xi, yi);
          throw ["first", xi, yi];
        }
        yi++;
      }
    }
    return 0;
  };
  enVerimliCikisiBul = function({x, y}) {
    var alt, maxMesafe, sag, sol, ust, xi, yi;
    ust = {
      mesafe: 0,
      x: 0,
      y: 0
    };
    alt = {
      mesafe: 0,
      x: 0,
      y: 0
    };
    sag = {
      mesafe: 0,
      x: 0,
      y: 0
    };
    sol = {
      mesafe: 0,
      x: 0,
      y: 0
    };
    xi = x;
    yi = y;
    while (xi <= xMax) {
      if (sekilKalip.isPointInPath(c, xi, yi) || sekilKalip.isPointInStroke(c, xi, yi)) {
        if (!sekilKalip.getImageData(xi, yi, 1, 1).data.at(3)) {
          sag.mesafe = Math.abs(xi - x);
          sag.x = xi;
          sag.y = yi;
          break;
        }
      }
      xi++;
    }
    xi = x;
    yi = y;
    while (0 > xi--) {
      if (sekilKalip.isPointInPath(c, xi, yi) || sekilKalip.isPointInStroke(c, xi, yi)) {
        if (!sekilKalip.getImageData(xi, yi, 1, 1).data.at(3)) {
          sol.mesafe = Math.abs(xi - x);
          sol.x = xi;
          sol.y = yi;
          break;
        }
      }
    }
    xi = x;
    yi = y;
    while (0 > yi--) {
      if (sekilKalip.isPointInPath(c, xi, yi) || sekilKalip.isPointInStroke(c, xi, yi)) {
        if (!sekilKalip.getImageData(xi, yi, 1, 1).data.at(3)) {
          alt.mesafe = Math.abs(yi - y);
          alt.x = xi;
          alt.y = yi;
          break;
        }
      }
    }
    xi = x;
    yi = y;
    while (yMax >= yi) {
      if (sekilKalip.isPointInPath(c, xi, yi) || sekilKalip.isPointInStroke(c, xi, yi)) {
        if (!sekilKalip.getImageData(xi, yi, 1, 1).data.at(3)) {
          ust.mesafe = Math.abs(yi - y);
          ust.x = xi;
          ust.y = yi;
          break;
        }
      }
      yi++;
    }
    if (!(maxMesafe = Math.max(alt.mesafe, ust.mesafe, sag.mesafe, sol.mesafe))) {
      return 0;
    }
    switch (maxMesafe) {
      case alt.mesafe:
        return pixelpin(alt.x, alt.y);
      case ust.mesafe:
        return pixelpin(ust.x, ust.y);
      case sag.mesafe:
        return pixelpin(sag.x, sag.y);
      case sol.mesafe:
        return pixelpin(sol.x, sol.y);
    }
    throw "bir hata";
  };
  ucgenAlaniHesapla = function(x1, y1, x2, y2, x3, y3) {
    return 0.5 * (x1 * Math.abs(y2 - y3) + x2 * Math.abs(y3 - y1) + x3 * Math.abs(y2 - y1));
  };
  ucgenAlaninTamDoluMu = function(x1, y1, x2, y2, x3, y3) {
    var ucgen, xi, yi;
    xMin = Math.min(x1, x2, x3);
    yMin = Math.min(y1, y2, y3);
    xMax = Math.max(x1, x2, x3);
    yMax = Math.max(y1, y2, y3);
    ucgen = new Path2D();
    ucgen.moveTo(x1, y1);
    ucgen.lineTo(x2, y2);
    ucgen.lineTo(x3, y3);
    ucgen.lineTo(x1, y1);
    ucgen.closePath();
    xi = xMin;
    while (xi < xMax) {
      yi = yMin;
      while (yi < yMax) {
        if (noktaSekilUzerindeMi(ucgen, xi, yi)) {
          if (!triangle.getImageData(xi, yi, 1, 1).data.at(3)) {
            return false;
          }
        }
        yi++;
      }
      xi++;
    }
    return true;
  };
  ucgenAlaniniBosalt = function(x1, y1, x2, y2, x3, y3) {
    var ucgen, xi, yi;
    xMin = Math.min(x1, x2, x3);
    yMin = Math.min(y1, y2, y3);
    xMax = Math.max(x1, x2, x3);
    yMax = Math.max(y1, y2, y3);
    ucgen = new Path2D();
    ucgen.moveTo(x1, y1);
    ucgen.lineTo(x2, y2);
    ucgen.lineTo(x3, y3);
    ucgen.lineTo(x1, y1);
    ucgen.closePath();
    xi = xMin;
    while (xi < xMax) {
      yi = yMin;
      while (yi < yMax) {
        if (noktaSekilUzerindeMi(ucgen, xi, yi)) {
          triangle.clearRect(xi, yi, 1, 1);
        }
        yi++;
      }
      xi++;
    }
    return true;
  };
  bulunanlar = [];
  k = 0;
  maksimumDoluUcgeniBul = function({
      x: x1,
      y: y1
    }, {
      x: x2,
      y: y2
    }) {
    var area, icbulunanlar, len1, m, tamdoluluk, xi, yi;
    icbulunanlar = [];
    xi = 1000;
    while (xi > 0) {
      yi = 1000;
      while (yi > 0) {
        if (k++ > 5138000) {
          throw "of hata " + k;
        }
        if (noktaSekilUzerindeMi(c, xi, yi) && ((xi !== x1) && (xi !== x2))) {
          area = ucgenAlaniHesapla(x1, y1, x2, y2, xi, yi);
          icbulunanlar.push({area, xi, yi});
        }
        yi--;
      }
      xi--;
    }
    icbulunanlar.sort(function(a, b) {
      if (a.area <= b.area) {
        return 1;
      } else {
        return -1;
      }
    });
    for (m = 0, len1 = icbulunanlar.length; m < len1; m++) {
      ({xi, yi} = icbulunanlar[m]);
      if (bulunanlar.find(function(v) {
        return (v.xi === xi) && (v.yi === yi);
      })) {
        continue;
      }
      //drawTriangle x1, y1, x2, y2, xi, yi 
      tamdoluluk = ucgenAlaninTamDoluMu(x1, y1, x2, y2, xi, yi);
      if (tamdoluluk) {
        error({x1, y1, x2, y2, xi, yi});
        ucgenAlaniniBosalt(x1, y1, x2, y2, xi, yi);
        bulunanlar.push({x1, y1, x2, y2, xi, yi});
        break;
      }
    }
    return pixelpin(xi, yi);
  };
  delay = function() {
    return new Promise((done) => {
      return setTimeout(done, arguments[0] || 1000);
    });
  };
  drawCircle = function(x, y, r = 100) {
    var arc;
    arc = new Path2D();
    arc.arc(x, y, r, 0, 2 * Math.PI);
    sekilKalip.save();
    sekilKalip.fillStyle = "aqua";
    sekilKalip.fill(arc);
    sekilKalip.restore();
    return arc;
  };
  c = drawCircle(500, 500);
  data = null;
  size = null;
  dataGuncelle = function() {
    size = sekilKalip.canvas.width;
    return data = sekilKalip.getImageData(0, 0, size, size).data;
  };
  yon = 0;
  baslangicAl = function() {
    var i, x, y;
    dataGuncelle();
    if (!yon) {
      i = data.indexOf(0xff);
      yon = 1;
    } else {
      i = data.lastIndexOf(0xff);
      yon = 0;
    }
    i = Math.trunc(i / 4);
    y = i / size;
    x = i % size;
    return {
      x1: x,
      y1: y
    };
  };
  indeks = function(x, y) {
    return 4 * (Math.trunc(y) * size + x);
  };
  oku = function(x, y, rgba = 3) {
    var a, b, g, i, r;
    i = indeks(x, y);
    [r, g, b, a] = data.slice(i, i + 4);
    return r + g + b + a;
  };
  sonlanisBul = function(x1, y1) {
    var alt, cikis, sag, sol, ust;
    dataGuncelle();
    ust = {
      mesafe: 0,
      x: x1,
      y: y1
    };
    alt = {
      mesafe: 0,
      x: x1,
      y: y1
    };
    sag = {
      mesafe: 0,
      x: x1,
      y: y1
    };
    sol = {
      mesafe: 0,
      x: x1,
      y: y1
    };
    while (oku(ust.x, ust.y)) {
      ust.mesafe++;
      ust.y++;
    }
    while (oku(alt.x, alt.y)) {
      alt.mesafe++;
      alt.y--;
    }
    while (oku(sag.x, sag.y)) {
      sag.mesafe++;
      sag.x++;
    }
    while (oku(sol.x, sol.y)) {
      sol.mesafe++;
      sol.x--;
    }
    warn({ust, alt, sag, sol});
    cikis = (function() {
      switch (Math.max(sol.mesafe, sag.mesafe, ust.mesafe, alt.mesafe)) {
        case 0:
          throw "MESAFE YOK";
        case ust.mesafe:
          return ust;
        case alt.mesafe:
          return alt;
        case sol.mesafe:
          return sol;
        case sag.mesafe:
          return sag;
      }
    })();
    return {
      x2: cikis.x,
      y2: cikis.y
    };
  };
  sagaKaykil = function(x1, y1, x2, y2) {
    var aci, sin, sx, sy, x3, y3;
    dataGuncelle();
    aci = Math.PI / 180;
    sin = Math.sin(aci);
    x3 = Math.min(x2, x1);
    y3 = x3 === x2 ? y1 : y2;
    sx = 0;
    sy = 0;
    while (oku(x3 + sx, y3 + sy)) {
      y3 += sy;
      x3 += sx;
      sy = y3 * sin;
      sx = x3 * sin;
    }
    x3 += sx;
    y3 += sy;
    return {x3, y3};
  };
  ucgeniKes = function(x1, y1, x2, y2, x3, y3) {
    var ucgen;
    dataGuncelle();
    ucgen = new Path2D();
    ucgen.moveTo(x1, y1);
    ucgen.lineTo(x2, y2);
    ucgen.lineTo(x3, y3);
    ucgen.lineTo(x1, y1);
    ucgen.closePath();
    sekilGecen.fill(ucgen);
    sekilKalip.stroke(ucgen);
    sekilKalip.save();
    sekilKalip.clip(ucgen);
    sekilKalip.clearRect(0, 0, size * 2, size * 2);
    sekilKalip.restore();
    return ucgen;
  };
  return (window.onclick = function() {
    var acisal, at, cikis, cos, giris, girisAcisi, i, isinBaslangicX, isinBaslangicY, kanatlandir, mm, sonxy, t, x, y;
    dataGuncelle();
    pin.clearRect(0, 0, size * 2, size * 2);
    girisAcisi = 45;
    x = isinBaslangicX = 350;
    y = isinBaslangicY = 350;
    pin.moveTo(0, 0);
    pin.lineTo(isinBaslangicX, isinBaslangicY);
    pin.stroke();
    cos = Math.sin(45 / (Math.PI / 180));
    i = 0;
    giris = false;
    cikis = false;
    sonxy = {
      x: isinBaslangicX,
      y: isinBaslangicY
    };
    kanatlandir = function(cosTeta, sonxy) {
      log(cosTeta);
      // geri geri gel
      //! beyaz üzerinde ilerle
      pin.strokeStyle = "black";
      pin.lineWidth = 2;
      pin.beginPath();
      pin.moveTo(sonxy.x, sonxy.y);
      pin.lineTo(cikis.x -= 1 * cosTeta, cikis.y -= 1 * cosTeta);
      pin.closePath();
      pin.stroke();
      if ((cikis.x <= giris.x) && (cikis.y <= giris.y)) {

      }
    };
    // her adimda beyaza kadar ilerle
    // en fazla toplam mesafeyi sec
    acisal = {};
    mm = 0;
    at = 0;
    (t = function() {
      var aci, ax, ay, m, rgba, sin, teta;
      rgba = oku(x, y);
      log(rgba);
      if (giris && rgba && !cikis) {
        at++;
        for (aci in acisal) {
          ({ax, ay, sin} = acisal[aci]);
          pin.save();
          pin.beginPath();
          pin.strokeStyle = "red";
          pin.lineWidth = 3;
          pin.moveTo(giris.x, giris.y);
          pin.lineTo(ax, ay);
          pin.closePath();
          pin.stroke();
          pin.restore();
          acisal[aci].ax += cos;
          acisal[aci].ay += cos;
        }
      }
      if (!rgba && giris && !cikis) {
        cikis = {...sonxy};
        log("cikis saglandi:", cikis);
        pixelpin(x, y);
      }
      if (!giris && rgba) {
        giris = {x, y};
        log("giris saglandi:", giris);
        pixelpin(x, y);
        for (teta = m = 45; m <= 90; teta = ++m) {
          acisal[teta] = {
            sin: Math.sin(Math.rad(teta)),
            ax: giris.x,
            ay: giris.y
          };
        }
      }
      if (!cikis) {
        pin.save();
        pin.beginPath();
        pin.strokeStyle = "orange";
        pin.lineWidth = 2;
        pin.moveTo(sonxy.x, sonxy.y);
        pin.lineTo(x += cos, y += cos);
        pin.closePath();
        pin.stroke();
        pin.restore();
      }
      sonxy = {x, y};
      if (300 < mm++) {
        return 1;
      }
      return requestAnimationFrame(t);
    })();
    return function() {
      var ucgen, x1, x2, x3, y1, y2, y3;
      ({x1, y1} = baslangicAl());
      ({x2, y2} = sonlanisBul(x1, y1));
      ({x3, y3} = sagaKaykil(x1, y1, x2, y2));
      ucgen = ucgeniKes(x1, y1, x2, y2, x3, y3);
      pixelpin(x1, y1);
      pixelpin(x2, y2);
      pixelpin(x3, y3);
      return pin.stroke(ucgen);
    };
  })();
})();

0 && (async function() {
  var a, clearTriangle, ctx, fillPixel, findTriangle, pin, pixelpin, readPixel, setContext, size, state_full_data, state_full_text, stepCtx, stepInterval, step_00_echo, step_01_slice, stepinfo, triangles;
  ctx = init2dContext(size = 500);
  pin = init2dContext(size);
  stepCtx = init2dContext(500, 50, "-225px 0 0 0");
  ctx.font = `${size * devicePixelRatio}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("a", size, size);
  state_full_text = null;
  state_full_data = null;
  setContext = function() {
    var j, l, results;
    state_full_text = ctx.getImageData(0, 0, size * 2, size * 2);
    j = 0;
    l = state_full_text.data.length;
    state_full_data = new Uint8Array(l / 4);
    results = [];
    while (l > (j += 4)) {
      if (state_full_text.data[j + 3] === 0xff) {
        results.push(state_full_data[j / 4] = 0xff);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  setContext();
  readPixel = function(x, y) {
    return state_full_data.at((y * state_full_text.width) + x);
  };
  fillPixel = function(x, y, color = "aqua") {
    pin.fillStyle = "color";
    return pin.fillRect(x, y, 1, 1);
  };
  clearTriangle = function({x1, y1, x2, y2, x3, y3}) {
    ctx.save();
    ctx.fillStyle = "#00000000";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
    return ctx.restore();
  };
  findTriangle = function(x0, x1, y0) {
    var usable, xMax, xMin, xi, yMax, yMin, yi;
    // todo draw triangles    x0 -- y0 -------- x1
    // todo                          |          
    // todo                          |          
    // todo                         y1            find max abs(y) for every x in range [x0, x1]

    //todo       triangle ABC   [x0, y0]
    //todo       triangle BAC   [x1, y0]
    //todo       triangle CAB   [x?, y?]

    //todo       triangle CAB   x0 < x? < x1
    //todo       triangle CAB        y?  
    xMin = Math.min(x1, x0);
    xMax = Math.max(x1, x0);
    yMin = y0;
    yMax = state_full_text.height;
    xi = xMin;
    yi = yMin;
    usable = true;
    while (xi < xMax) {
      if (!usable) {
        break;
      }
      while (yi < yMax) {
        if (!usable) {
          break;
        }
        usable = readPixel(xi, yi);
        yi++;
      }
      xi++;
    }
    pin.beginPath();
    pin.moveTo(x0, y0);
    pin.lineTo(xi, yi);
    pin.lineTo(x1, y0);
    error({
      x: xi,
      y: yi
    });
    pin.closePath();
    pin.strokeStyle = "aqua";
    pin.stroke();
    return {
      x: xi,
      y: yi
    };
  };
  stepCtx.font = "40px serif";
  stepInterval = 0;
  stepinfo = async function(text = "", wait = 200) {
    var i;
    console.warn(text);
    i = 0;
    clearInterval(stepInterval);
    stepInterval = setInterval(() => {
      stepCtx.clearRect(0, 0, 1e3, 100);
      if (i++ % 2) {
        return stepCtx.fillText(text, 15, 60);
      }
    }, 500);
    stepCtx.clearRect(0, 0, 1e3, 100);
    stepCtx.fillText(text, 15, 60);
    return (await delay(wait));
  };
  pixelpin = function(x, y, color = "red") {
    pin.strokeStyle = color;
    pin.beginPath();
    pin.arc(x, y, 10, 0, 2 * Math.PI);
    pin.closePath();
    return pin.stroke();
  };
  step_00_echo = async function() {
    return (await stepinfo("echo letter"));
  };
  triangles = [];
  a = 0;
  step_01_slice = async function(ati = a + 1) {
    var countBottom, countLeft, countRight, countTop, data, dataBottom, dataLeft, dataRight, dataTop, dleft, dright, i, ileft, iright, j, l, maxCount, partData, partName, vdir, x, x1, x2, x3, xleft, xright, y, y1, y2, y3;
    await stepinfo("remove right part");
    ctx.clearRect(size, 0, size, size * 2);
    dataRight = ctx.getImageData(0, 0, size * 2, size * 2);
    countRight = dataRight.data.indexOf(0xff);
    await stepinfo("counting black pixels " + countRight);
    ctx.putImageData(state_full_text, 0, 0);
    ctx.clearRect(0, 0, size, size * 2);
    dataLeft = ctx.getImageData(0, 0, size * 2, size * 2);
    countLeft = dataLeft.data.indexOf(0xff);
    await stepinfo("counting black pixels " + countLeft);
    ctx.putImageData(state_full_text, 0, 0);
    ctx.clearRect(0, size, size * 2, size);
    dataTop = ctx.getImageData(0, 0, size * 2, size * 2);
    countTop = dataTop.data.indexOf(0xff);
    await stepinfo("counting black pixels " + countTop);
    ctx.putImageData(state_full_text, 0, 0);
    ctx.clearRect(0, 0, size * 2, size);
    dataBottom = ctx.getImageData(0, 0, size * 2, size * 2);
    countBottom = dataBottom.data.indexOf(0xff);
    await stepinfo("counting black pixels " + countBottom);
    maxCount = Math.max(countLeft, countTop, countBottom, countRight);
    [partName, partData] = (function() {
      switch (maxCount) {
        case countTop:
          return ["top", dataTop];
        case countLeft:
          return ["left", dataLeft];
        case countRight:
          return ["right", dataRight];
        case countBottom:
          return ["bottom", dataBottom];
      }
    })();
    await stepinfo(`max ${partName}(${maxCount})`, 100);
    ctx.putImageData(partData, 0, 0);
    j = 0;
    l = partData.data.length;
    data = new Uint8Array(l / 4);
    while (l > (j += 4)) {
      if (partData.data[j + 3] === 0xff) {
        data[j / 4] = 0xff;
      }
    }
    i = state_full_data.indexOf(0xff);
    x = i % state_full_text.width;
    y = Math.trunc(i / state_full_text.width);
    await stepinfo("index:" + i);
    await stepinfo("x:" + x);
    await stepinfo("y:" + y);
    pixelpin(x, y);
    x1 = x;
    xright = x1;
    iright = i;
    while (xright++ < state_full_text.width) {
      if (!state_full_data.at(++iright)) {
        break;
      }
    }
    //pixelpin( --xright, y )
    dright = xright - x1;
    await stepinfo(`looked to right: ${xright} ` + dright);
    xleft = x1;
    ileft = i;
    while (--xleft) {
      if (!state_full_data.at(--ileft)) {
        break;
      }
    }
    //pixelpin( --xleft, y )
    dleft = x1 - xleft;
    await stepinfo(`looking to left: ${xleft} ` + dleft);
    [vdir, x2] = dright > dleft ? ["right", xright] : ["left", xleft];
    await stepinfo(`chosen direction: [${vdir}] at x2: ` + x2);
    y1 = y2 = y;
    ({
      x: x3,
      y: y3
    } = findTriangle(x1, x2, y));
    //pixelpin( x1, y1, "aqua" )
    //pixelpin( x2, y2, "aqua" )
    //pixelpin( x3, y3, "aqua" )
    clearTriangle({x1, x2, x3, y1, y2, y3});
    setContext();
    return log("cleared:", triangles[triangles.length] = {x1, x2, x3, y1, y2, y3});
  };
  await step_00_echo();
  await step_01_slice();
  return self.onclick = function() {
    step_01_slice();
    log(triangles);
    return pin.clearRect(0, 0, size * 2, size * 2);
  };
})();

(function() {
  var BYTES_PER_INSTANCE, BYTES_PER_VERTEX, CHARCODE_VERTICES, M4, a_ModelMatrix, a_Position, arrClearColor, arrayInstancesInfo, backgroundColor, buf, bufferInstancesInfo, charMalloc, drawPoints, drawTriangles, fshader, gl, glClear, glClearColor, i, iLE, i_Position, init, instanceCount, j, maxInstanceCount, modelMatrix, pointCount, program, render, reup, text, u_Color, u_ViewMatrix, verticesBufferArray, verticesGLBuffer, verticesOffset, viewMatrix, vshader;
  M4 = (function() {
    var Camera;

    class M4 extends Float32Array {
      static fromVec3(vec3) {
        return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ...vec3, 1]);
      }

      modifyVertex(vertex) {
        return vertex.position.set(M4.multiply(this, M4.prototype.translation(...vertex)).position);
      }

      multiply(b) {
        this.set(M4.multiply(this, b));
        return this;
      }

      static multiply(a, b) {
        var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33;
        a00 = a[0 * 4 + 0];
        a01 = a[0 * 4 + 1];
        a02 = a[0 * 4 + 2];
        a03 = a[0 * 4 + 3];
        a10 = a[1 * 4 + 0];
        a11 = a[1 * 4 + 1];
        a12 = a[1 * 4 + 2];
        a13 = a[1 * 4 + 3];
        a20 = a[2 * 4 + 0];
        a21 = a[2 * 4 + 1];
        a22 = a[2 * 4 + 2];
        a23 = a[2 * 4 + 3];
        a30 = a[3 * 4 + 0];
        a31 = a[3 * 4 + 1];
        a32 = a[3 * 4 + 2];
        a33 = a[3 * 4 + 3];
        b00 = b[0 * 4 + 0];
        b01 = b[0 * 4 + 1];
        b02 = b[0 * 4 + 2];
        b03 = b[0 * 4 + 3];
        b10 = b[1 * 4 + 0];
        b11 = b[1 * 4 + 1];
        b12 = b[1 * 4 + 2];
        b13 = b[1 * 4 + 3];
        b20 = b[2 * 4 + 0];
        b21 = b[2 * 4 + 1];
        b22 = b[2 * 4 + 2];
        b23 = b[2 * 4 + 3];
        b30 = b[3 * 4 + 0];
        b31 = b[3 * 4 + 1];
        b32 = b[3 * 4 + 2];
        b33 = b[3 * 4 + 3];
        return new M4([b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30, b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31, b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32, b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33, b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30, b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31, b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32, b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33, b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30, b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31, b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32, b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33, b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30, b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31, b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32, b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33]);
      }

      translation(tx = 0, ty = 0, tz = 0) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      }

      xTranslation(tx = 0) {
        return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, 0, 0, 1]);
      }

      yTranslation(ty = 0) {
        return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ty, 0, 1]);
      }

      zTranslation(tz = 0) {
        return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, tz, 1]);
      }

      xRotation(angleInRadians = 0) {
        var c, s;
        c = Math.cos(angleInRadians);
        s = Math.sin(angleInRadians);
        return new M4([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
      }

      yRotation(angleInRadians = 0) {
        var c, s;
        c = Math.cos(angleInRadians);
        s = Math.sin(angleInRadians);
        return new M4([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
      }

      zRotation(angleInRadians = 0) {
        var c, s;
        c = Math.cos(angleInRadians);
        s = Math.sin(angleInRadians);
        return new M4([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      }

      scaling(sx, sy, sz) {
        if (sz == null) {
          sz = (sy != null ? sy : sy = (sx != null ? sx : sx = 1));
        }
        return new M4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
      }

      translate(tx, ty, tz) {
        return this.multiply(this.translation(tx, ty, tz));
      }

      rotate(rx, ry, rz) {
        return this.xRotate(rx).yRotate(ry).zRotate(rz);
      }

      scale(sx, sy, sz) {
        return this.multiply(this.scaling(sx, sy, sz));
      }

      xRotate(rx) {
        return this.multiply(this.xRotation(rx));
      }

      yRotate(ry) {
        return this.multiply(this.yRotation(ry));
      }

      zRotate(rz) {
        return this.multiply(this.zRotation(rz));
      }

      xTranslate(tx) {
        return this.multiply(this.xTranslation(tx));
      }

      yTranslate(ty) {
        return this.multiply(this.yTranslation(ty));
      }

      zTranslate(tz) {
        return this.multiply(this.zTranslation(tz));
      }

    };

    //? https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
    Object.defineProperty(M4, "Identity", {
      value: function() {
        return new M4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      }
    });

    Object.defineProperty(M4.prototype, "position", {
      get: function() {
        return this.subarray(12, 15);
      }
    });

    M4.Camera = Camera = class Camera extends M4 {
      constructor(yFov, rAspect, zNear, zFar) {
        var f, rangeInv;
        f = Math.tan(Math.PI / 2 - yFov / 2);
        rangeInv = 1.0 / (zNear - zFar);
        super([f / rAspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (zNear + zFar) * rangeInv, -1, 0, 0, (zNear * zFar) * rangeInv * 2, 0]);
      }

    };

    return M4;

  }).call(this);
  CHARCODE_VERTICES = JSON.parse(sessionStorage.font);
  gl = document.getElementById("gl").getContext("webgl2");
  iLE = new Uint8Array(Uint16Array.of(1).buffer)[0] === 1;
  verticesGLBuffer = gl.createBuffer();
  bufferInstancesInfo = gl.createBuffer();
  program = gl.createProgram();
  vshader = gl.createShader(gl.VERTEX_SHADER);
  fshader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vshader, document.getElementById("vshader").text);
  gl.shaderSource(fshader, document.getElementById("fshader").text);
  gl.compileShader(vshader);
  gl.compileShader(fshader);
  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  gl.useProgram(program);
  arrClearColor = Float32Array.of(0.05, .2, 0.3, 1);
  backgroundColor = arrClearColor.slice(0, 3).map(function(i) {
    return i * 0xff;
  }).join(" ");
  document.body.style.backgroundColor = `rgb(${backgroundColor})`;
  pointCount = 0;
  instanceCount = 0;
  verticesOffset = 0;
  BYTES_PER_VERTEX = 12;
  BYTES_PER_INSTANCE = 12;
  maxInstanceCount = 100;
  verticesBufferArray = new Float32Array(new ArrayBuffer(1e6));
  arrayInstancesInfo = new Float32Array(new ArrayBuffer(maxInstanceCount * BYTES_PER_INSTANCE));
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesGLBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInstancesInfo);
  gl.bufferData(gl.ARRAY_BUFFER, arrayInstancesInfo.byteLength, gl.DYNAMIC_READ);
  u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
  u_Color = gl.getUniformLocation(program, 'u_Color');
  i_Position = gl.getAttribLocation(program, 'i_Position');
  a_Position = gl.getAttribLocation(program, 'a_Position');
  a_ModelMatrix = gl.getAttribLocation(program, "a_ModelMatrix");
  viewMatrix = new M4.Camera(90, innerWidth / innerHeight, 0.01, 1e5);
  modelMatrix = new M4.Identity();
  glClearColor = gl.clearColor.apply.bind(gl.clearColor, gl, arrClearColor);
  glClear = gl.clear.bind(gl, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawTriangles = function() {};
  drawPoints = function() {};
  reup = function(offset) {
    gl.enableVertexAttribArray(i_Position);
    gl.vertexAttribPointer(i_Position, 3, gl.FLOAT, false, 0, offset); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
    return gl.vertexAttribDivisor(i_Position, 1);
  };
  Object.defineProperty(verticesBufferArray, "upload", {
    value: function(array) {
      var begin, byteLength, byteOffset, length, subarray;
      pointCount = array.length / 3;
      length = array.length;
      byteOffset = verticesOffset;
      byteLength = length * 4;
      begin = byteOffset / 4;
      subarray = this.subarray(begin, begin + length);
      verticesOffset = byteLength + verticesOffset;
      subarray.set(array);
      gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, verticesBufferArray, begin, length);
      Object.defineProperties(subarray, {
        start: {
          value: byteOffset / BYTES_PER_VERTEX
        },
        count: {
          value: pointCount
        },
        clone: {
          value: 0,
          writable: true
        },
        instanceOffset: {
          value: 0,
          writable: true
        }
      });
      (function(vertices) {
        return Object.defineProperty(vertices, "instance", {
          get: function() {
            var instanceBegin, instanceByteOffset, instanceEnd, instanceLength, instanceSubarray;
            this.clone += 1;
            instanceByteOffset = BYTES_PER_INSTANCE * instanceCount++;
            instanceLength = BYTES_PER_INSTANCE / 4;
            instanceBegin = instanceByteOffset / 4;
            instanceEnd = instanceBegin + instanceLength;
            instanceSubarray = arrayInstancesInfo.subarray(instanceBegin, instanceEnd);
            return (function(instance) {
              return {
                translateX: function() {
                  return instance[0] += arguments[0];
                },
                translateY: function() {
                  return instance[1] += arguments[0];
                },
                translateZ: function() {
                  return instance[2] += arguments[0];
                }
              };
            })(instanceSubarray);
          }
        });
      })(subarray);
      return subarray;
    }
  });
  Object.defineProperties(modelMatrix, {
    dx: {
      writable: 1,
      value: 0
    },
    dy: {
      writable: 1,
      value: 0
    },
    dz: {
      writable: 1,
      value: 0
    },
    rx: {
      writable: 1,
      value: 0
    },
    ry: {
      writable: 1,
      value: 0
    },
    rz: {
      writable: 1,
      value: 0
    },
    sx: {
      writable: 1,
      value: 1
    },
    sy: {
      writable: 1,
      value: 1
    },
    sz: {
      writable: 1,
      value: 1
    },
    location: {
      value: gl.getAttribLocation(program, "a_ModelMatrix")
    },
    upload: {
      value: function(mat4) {
        if (mat4) {
          this.set(mat4);
        }
        gl.enableVertexAttribArray(this.location);
        return gl.vertexAttribPointer(this.location, 4, gl.FLOAT, false, 16, 0); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
      }
    }
  });
  Object.defineProperties(viewMatrix, {
    dx: {
      writable: 1,
      value: 0
    },
    dy: {
      writable: 1,
      value: 0
    },
    dz: {
      writable: 1,
      value: -150
    },
    rx: {
      writable: 1,
      value: 0
    },
    ry: {
      writable: 1,
      value: 0
    },
    rz: {
      writable: 1,
      value: 0
    },
    sx: {
      writable: 1,
      value: 1
    },
    sy: {
      writable: 1,
      value: 1
    },
    sz: {
      writable: 1,
      value: 1
    },
    location: {
      value: gl.getUniformLocation(program, "u_ViewMatrix")
    }
  });
  Object.defineProperty(viewMatrix, "upload", {
    value: function() {
      gl.uniformMatrix4fv(this.location, false, this.slice().translate(this.dx, this.dy, this.dz).rotate(this.rx, this.ry, this.rz).scale(this.sx, this.sy, this.sz));
      return 0;
    }
  });
  init = function() {
    var glViewport;
    glViewport = function() {
      Object.assign(gl.canvas, {
        width: innerWidth * devicePixelRatio,
        height: innerHeight * devicePixelRatio
      }).setAttribute("style", [`width=${CSS.px(innerWidth)}`, `height=${CSS.px(innerHeight)}`].join(";"));
      return gl.viewport(0, 0, innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
    };
    glViewport();
    glClearColor();
    glClear();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesGLBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesBufferArray.byteLength, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(i_Position);
    gl.vertexAttribDivisor(i_Position, 1);
    gl.enableVertexAttribArray(a_Position);
    return gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // location // size (num values to pull from buffer per iteration) // type of data in buffer // normalize // stride (0 = compute from size and type above) // offset in buffer
  };
  charMalloc = function(char) {
    var charBuffer, vertices;
    vertices = CHARCODE_VERTICES[char.charCodeAt(0)];
    pointCount = vertices.length / 3;
    charBuffer = verticesBufferArray.malloc(pointCount);
    charBuffer.upload(vertices);
    return charBuffer;
  };
  init();
  self.a = 1;
  text = {
    letters: {},
    chars: [],
    charCount: 0,
    letterCount: 0,
    byteLength: 0,
    lineCount: 0,
    lineWidth: 100,
    lineHeight: 10,
    letterSpace: 1,
    width: 0,
    height: 0,
    length: 0,
    buffer: buf = new ArrayBuffer(0, {
      maxByteLength: 400 * 12
    }),
    view: new DataView(buf),
    positions: new Float32Array(buf),
    attrLocation: i_Position,
    draw: function(force = true) {
      var begin, byteOffset, end, i, instances, len1, length, m, ref, results;
      ref = this.chars;
      results = [];
      for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
        instances = ref[i];
        if (instances.needsUpload || instances.needsRebind) {
          if (instances.needsUpload) {
            instances.needsUpload = 0;
            byteOffset = instances.byteOffset;
            length = instances.length * 3;
            begin = byteOffset / 4;
            end = begin + length;
            gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, this.positions.slice(begin, end));
          }
          if (instances.needsRebind) {
            instances.needsRebind = 0;
            instances.vertexAttribPointer = gl.vertexAttribPointer.bind(gl, this.attrLocation, 3, gl.FLOAT, 0, 12, byteOffset);
            instances.drawArraysInstanced = gl.drawArraysInstanced.bind(gl, gl.TRIANGLES, instances.model.start, instances.model.count, instances.length);
          }
          0;
        }
        instances.vertexAttribPointer();
        instances.drawArraysInstanced();
        results.push(1);
      }
      return results;
    },
    writeLetter: function(letter) {
      var base, byteOffset, charCode, chars, dview, i, index, instance, instances, len, len1, len2, length, m, max, min, n, offset, positions, ref, ref1, val, vertices;
      this.length += 3;
      this.charCount += 1;
      this.byteLength += 12;
      this.buffer.resize(this.byteLength);
      dview = this.view;
      chars = (base = this.letters)[letter] || (base[letter] = this.chars[index = this.chars.length] = new Array());
      charCode = letter.charCodeAt(0);
      if (!Object.hasOwn(chars, "index")) {
        Object.defineProperties(chars, {
          byteLength: {
            get: function() {
              return this.length * 12;
            }
          },
          byteOffset: {
            value: 0,
            writable: true
          },
          needsUpload: {
            value: 1,
            writable: true
          },
          needsRebind: {
            value: 1,
            writable: true
          },
          index: {
            value: index
          },
          letter: {
            value: letter
          },
          charCode: {
            value: charCode
          },
          getPosition: {
            value: function(offset = 0) {
              return dview.getFloat32(this.byteOffset + offset, iLE);
            }
          },
          setPosition: {
            value: function(offset = 0, value) {
              this.needsUpload = true;
              return dview.setFloat32(this.byteOffset + offset, value, iLE);
            }
          }
        });
        chars.byteOffset = this.byteLength - 12;
        vertices = CHARCODE_VERTICES[charCode];
        min = +2e308;
        max = -2e308;
        len = vertices.length;
        i = 0;
        while (i < len) {
          if (null !== (val = vertices[i])) {
            if (val > max) {
              max = val;
            }
            if (min > val) {
              min = val;
            }
          }
          i += 3;
        }
        Object.defineProperties(chars, {
          charCode: {
            value: charCode
          },
          xMax: {
            value: max
          },
          xMin: {
            value: min
          },
          width: {
            value: max + min
          },
          left: {
            value: min
          },
          model: {
            value: verticesBufferArray.upload(vertices)
          }
        });
        if (vertices.length % 3) {
          throw [
            {
              MOD_TRIANGLE: letter
            }
          ];
        }
        this.letterCount += 1;
      }
      log(letter, chars);
      chars[index = chars.length] = instance = chars.model.instance;
      offset = +12 * index;
      Object.defineProperty(instance, "x", {
        get: chars.getPosition.bind(chars, offset),
        set: chars.setPosition.bind(chars, offset)
      });
      Object.defineProperty(instance, "y", {
        get: chars.getPosition.bind(chars, offset + 4),
        set: chars.setPosition.bind(chars, offset + 4)
      });
      Object.defineProperty(instance, "z", {
        get: chars.getPosition.bind(chars, offset + 8),
        set: chars.setPosition.bind(chars, offset + 8)
      });
      positions = [];
      ref = this.chars;
      for (m = 0, len1 = ref.length; m < len1; m++) {
        ({byteOffset, length} = ref[m]);
        positions.push.apply(positions, new Float32Array(this.buffer, byteOffset, length * 3));
      }
      byteOffset = 0;
      ref1 = this.chars;
      for (n = 0, len2 = ref1.length; n < len2; n++) {
        instances = ref1[n];
        instances.byteOffset = byteOffset;
        instances.needsUpload = 1;
        instances.needsRebind = 1;
        byteOffset = byteOffset + (instances.length * 12);
      }
      this.positions.set(positions);
      instance.x = this.width + chars.left;
      instance.y = this.height;
      instance.z = 0;
      this.width += chars.width + this.letterSpace;
      positions = null;
      return instance;
    },
    write: function(text) {
      var len1, letter, m, ref, results;
      ref = `${text}`;
      results = [];
      for (m = 0, len1 = ref.length; m < len1; m++) {
        letter = ref[m];
        results.push(this.writeLetter(letter));
      }
      return results;
    }
  };
  self.text = text;
  text.write("192.168.002.003");
  viewMatrix.dx -= 20;
  i = 0;
  j = 1;
  render = function() {
    text.draw();
    viewMatrix.dx += 0.1 * j;
    //viewMatrix.dy += 0.4 * j
    viewMatrix.upload();
    if (!(++i % 120)) {
      j *= -1;
    }
    return requestAnimationFrame(render);
  };
  return render();
})();
