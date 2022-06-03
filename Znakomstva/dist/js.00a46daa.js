// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@georgedoescode/spline/spline.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spline = spline;

function formatPoints(points, close) {
  points = [...points]; // so that coords can be passed as objects or arrays

  if (!Array.isArray(points[0])) {
    points = points.map(({
      x,
      y
    }) => [x, y]);
  }

  if (close) {
    const lastPoint = points[points.length - 1];
    const secondToLastPoint = points[points.length - 2];
    const firstPoint = points[0];
    const secondPoint = points[1];
    points.unshift(lastPoint);
    points.unshift(secondToLastPoint);
    points.push(firstPoint);
    points.push(secondPoint);
  }

  return points.flat();
}

function spline(points = [], tension = 1, close = false, cb) {
  points = formatPoints(points, close);
  const size = points.length;
  const last = size - 4;
  const startPointX = close ? points[2] : points[0];
  const startPointY = close ? points[3] : points[1];
  let path = "M" + [startPointX, startPointY];
  cb && cb("MOVE", [startPointX, startPointY]);
  const startIteration = close ? 2 : 0;
  const maxIteration = close ? size - 4 : size - 2;
  const inc = 2;

  for (let i = startIteration; i < maxIteration; i += inc) {
    const x0 = i ? points[i - 2] : points[0];
    const y0 = i ? points[i - 1] : points[1];
    const x1 = points[i + 0];
    const y1 = points[i + 1];
    const x2 = points[i + 2];
    const y2 = points[i + 3];
    const x3 = i !== last ? points[i + 4] : x2;
    const y3 = i !== last ? points[i + 5] : y2;
    const cp1x = x1 + (x2 - x0) / 6 * tension;
    const cp1y = y1 + (y2 - y0) / 6 * tension;
    const cp2x = x2 - (x3 - x1) / 6 * tension;
    const cp2y = y2 - (y3 - y1) / 6 * tension;
    path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
    cb && cb("CURVE", [cp1x, cp1y, cp2x, cp2y, x2, y2]);
  }

  return path;
}
},{}],"node_modules/simplex-noise/dist/esm/simplex-noise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimplexNoise = void 0;
exports.buildPermutationTable = buildPermutationTable;
exports.default = void 0;

/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.

 Copyright (c) 2021 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;
const F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
const G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
const grad3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]);
const grad4 = new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]);
/** Deterministic simplex noise generator suitable for 2D, 3D and 4D spaces. */

class SimplexNoise {
  /**
   * Creates a new `SimplexNoise` instance.
   * This involves some setup. You can save a few cpu cycles by reusing the same instance.
   * @param randomOrSeed A random number generator or a seed (string|number).
   * Defaults to Math.random (random irreproducible initialization).
   */
  constructor(randomOrSeed = Math.random) {
    const random = typeof randomOrSeed == 'function' ? randomOrSeed : alea(randomOrSeed);
    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);

    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }
  /**
   * Samples the noise field in 2 dimensions
   * @param x
   * @param y
   * @returns a number in the interval [-1, 1]
   */


  noise2D(x, y) {
    const permMod12 = this.permMod12;
    const perm = this.perm;
    let n0 = 0; // Noise contributions from the three corners

    let n1 = 0;
    let n2 = 0; // Skew the input space to determine which simplex cell we're in

    const s = (x + y) * F2; // Hairy factor for 2D

    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t; // Unskew the cell origin back to (x,y) space

    const Y0 = j - t;
    const x0 = x - X0; // The x,y distances from the cell origin

    const y0 = y - Y0; // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.

    let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords

    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    else {
      i1 = 0;
      j1 = 1;
    } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6


    const x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords

    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords

    const y2 = y0 - 1.0 + 2.0 * G2; // Work out the hashed gradient indices of the three simplex corners

    const ii = i & 255;
    const jj = j & 255; // Calculate the contribution from the three corners

    let t0 = 0.5 - x0 * x0 - y0 * y0;

    if (t0 >= 0) {
      const gi0 = permMod12[ii + perm[jj]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;

    if (t1 >= 0) {
      const gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;

    if (t2 >= 0) {
      const gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
    } // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].


    return 70.0 * (n0 + n1 + n2);
  }
  /**
   * Samples the noise field in 3 dimensions
   * @param x
   * @param y
   * @param z
   * @returns a number in the interval [-1, 1]
   */


  noise3D(x, y, z) {
    const permMod12 = this.permMod12;
    const perm = this.perm;
    let n0, n1, n2, n3; // Noise contributions from the four corners
    // Skew the input space to determine which simplex cell we're in

    const s = (x + y + z) * F3; // Very nice and simple skew factor for 3D

    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const X0 = i - t; // Unskew the cell origin back to (x,y,z) space

    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0; // The x,y,z distances from the cell origin

    const y0 = y - Y0;
    const z0 = z - Z0; // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.

    let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords

    let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // X Y Z order
      else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // X Z Y order
      else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // Z X Y order

    } else {
      // x0<y0
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } // Z Y X order
      else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } // Y Z X order
      else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // Y X Z order

    } // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.


    const x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords

    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords

    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords

    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3; // Work out the hashed gradient indices of the four simplex corners

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255; // Calculate the contribution from the four corners

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0;else {
      const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0;else {
      const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0;else {
      const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0;else {
      const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
    } // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]

    return 32.0 * (n0 + n1 + n2 + n3);
  }
  /**
   * Samples the noise field in 4 dimensions
   * @param x
   * @param y
   * @param z
   * @returns a number in the interval [-1, 1]
   */


  noise4D(x, y, z, w) {
    const perm = this.perm;
    let n0, n1, n2, n3, n4; // Noise contributions from the five corners
    // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in

    const s = (x + y + z + w) * F4; // Factor for 4D skewing

    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const l = Math.floor(w + s);
    const t = (i + j + k + l) * G4; // Factor for 4D unskewing

    const X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space

    const Y0 = j - t;
    const Z0 = k - t;
    const W0 = l - t;
    const x0 = x - X0; // The x,y,z,w distances from the cell origin

    const y0 = y - Y0;
    const z0 = z - Z0;
    const w0 = w - W0; // For the 4D case, the simplex is a 4D shape I won't even try to describe.
    // To find out which of the 24 possible simplices we're in, we need to
    // determine the magnitude ordering of x0, y0, z0 and w0.
    // Six pair-wise comparisons are performed between each possible pair
    // of the four coordinates, and the results are used to rank the numbers.

    let rankx = 0;
    let ranky = 0;
    let rankz = 0;
    let rankw = 0;
    if (x0 > y0) rankx++;else ranky++;
    if (x0 > z0) rankx++;else rankz++;
    if (x0 > w0) rankx++;else rankw++;
    if (y0 > z0) ranky++;else rankz++;
    if (y0 > w0) ranky++;else rankw++;
    if (z0 > w0) rankz++;else rankw++; // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
    // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
    // impossible. Only the 24 indices which have non-zero entries make any sense.
    // We use a thresholding to set the coordinates in turn from the largest magnitude.
    // Rank 3 denotes the largest coordinate.
    // Rank 2 denotes the second largest coordinate.
    // Rank 1 denotes the second smallest coordinate.
    // The integer offsets for the second simplex corner

    const i1 = rankx >= 3 ? 1 : 0;
    const j1 = ranky >= 3 ? 1 : 0;
    const k1 = rankz >= 3 ? 1 : 0;
    const l1 = rankw >= 3 ? 1 : 0; // The integer offsets for the third simplex corner

    const i2 = rankx >= 2 ? 1 : 0;
    const j2 = ranky >= 2 ? 1 : 0;
    const k2 = rankz >= 2 ? 1 : 0;
    const l2 = rankw >= 2 ? 1 : 0; // The integer offsets for the fourth simplex corner

    const i3 = rankx >= 1 ? 1 : 0;
    const j3 = ranky >= 1 ? 1 : 0;
    const k3 = rankz >= 1 ? 1 : 0;
    const l3 = rankw >= 1 ? 1 : 0; // The fifth corner has all coordinate offsets = 1, so no need to compute that.

    const x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords

    const y1 = y0 - j1 + G4;
    const z1 = z0 - k1 + G4;
    const w1 = w0 - l1 + G4;
    const x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords

    const y2 = y0 - j2 + 2.0 * G4;
    const z2 = z0 - k2 + 2.0 * G4;
    const w2 = w0 - l2 + 2.0 * G4;
    const x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords

    const y3 = y0 - j3 + 3.0 * G4;
    const z3 = z0 - k3 + 3.0 * G4;
    const w3 = w0 - l3 + 3.0 * G4;
    const x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords

    const y4 = y0 - 1.0 + 4.0 * G4;
    const z4 = z0 - 1.0 + 4.0 * G4;
    const w4 = w0 - 1.0 + 4.0 * G4; // Work out the hashed gradient indices of the five simplex corners

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const ll = l & 255; // Calculate the contribution from the five corners

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
    if (t0 < 0) n0 = 0.0;else {
      const gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
      t0 *= t0;
      n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
    if (t1 < 0) n1 = 0.0;else {
      const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
      t1 *= t1;
      n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
    if (t2 < 0) n2 = 0.0;else {
      const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
      t2 *= t2;
      n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
    if (t3 < 0) n3 = 0.0;else {
      const gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
      t3 *= t3;
      n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
    }
    let t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
    if (t4 < 0) n4 = 0.0;else {
      const gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
      t4 *= t4;
      n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
    } // Sum up and scale the result to cover the range [-1,1]

    return 27.0 * (n0 + n1 + n2 + n3 + n4);
  }

}

exports.SimplexNoise = SimplexNoise;
var _default = SimplexNoise;
/**
 * Builds a random permutation table.
 * This is exported only for (internal) testing purposes.
 * Do not rely on this export.
 * @private
 */

exports.default = _default;

function buildPermutationTable(random) {
  const p = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }

  for (let i = 0; i < 255; i++) {
    const r = i + ~~(random() * (256 - i));
    const aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }

  return p;
}
/*
The ALEA PRNG and masher code used by simplex-noise.js
is based on code by Johannes Baagøe, modified by Jonas Wagner.
See alea.md for the full license.
*/


function alea(seed) {
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let c = 1;
  const mash = masher();
  s0 = mash(' ');
  s1 = mash(' ');
  s2 = mash(' ');
  s0 -= mash(seed);

  if (s0 < 0) {
    s0 += 1;
  }

  s1 -= mash(seed);

  if (s1 < 0) {
    s1 += 1;
  }

  s2 -= mash(seed);

  if (s2 < 0) {
    s2 += 1;
  }

  return function () {
    const t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

    s0 = s1;
    s1 = s2;
    return s2 = t - (c = t | 0);
  };
}

function masher() {
  let n = 0xefc8249d;
  return function (data) {
    data = data.toString();

    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }

    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };
}
},{}],"js/index.js":[function(require,module,exports) {
"use strict";

var _spline = require("@georgedoescode/spline");

var _simplexNoise = _interopRequireDefault(require("simplex-noise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var openModal = document.getElementById('open_modal');
var closeModal = document.getElementById('close_modal');
var modal = document.getElementById('modal');
openModal.addEventListener('click', function (e) {
  e.preventDefault();
  modal.classList.add('active');
  console.log('почему не выводит окно');
});
closeModal.addEventListener('click', function () {
  modal.classList.remove('active');
});
// our <path> element
var path = document.querySelector("path"); // used to set our custom property values

var root = document.documentElement;
var hueNoiseOffset = 0;
var noiseStep = 0.005;
var simplex = new _simplexNoise.default();
var points = createPoints();

(function animate() {
  path.setAttribute("d", (0, _spline.spline)(points, 1, true)); // for every point...

  for (var i = 0; i < points.length; i++) {
    var point = points[i]; // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"

    var nX = noise(point.noiseOffsetX, point.noiseOffsetX);
    var nY = noise(point.noiseOffsetY, point.noiseOffsetY); // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20

    var x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
    var y = map(nY, -1, 1, point.originY - 20, point.originY + 20); // update the point's current coordinates

    point.x = x;
    point.y = y; // progress the point's x, y values through "time"

    point.noiseOffsetX += noiseStep;
    point.noiseOffsetY += noiseStep;
  }

  var hueNoise = noise(hueNoiseOffset, hueNoiseOffset);
  var hue = map(hueNoise, -1, 1, 0, 360);
  root.style.setProperty("--startColor", "hsl(".concat(hue, ", 100%, 75%)"));
  root.style.setProperty("--stopColor", "hsl(".concat(hue + 60, ", 100%, 75%)"));
  document.body.style.background = "hsl(".concat(hue + 60, ", 75%, 5%)");
  hueNoiseOffset += noiseStep / 6;
  requestAnimationFrame(animate);
})();

function map(n, start1, end1, start2, end2) {
  return (n - start1) / (end1 - start1) * (end2 - start2) + start2;
}

function noise(x, y) {
  return simplex.noise2D(x, y);
}

function createPoints() {
  var points = []; // how many points do we need

  var numPoints = 6; // used to equally space each point around the circle

  var angleStep = Math.PI * 2 / numPoints; // the radius of the circle

  var rad = 75;

  for (var i = 1; i <= numPoints; i++) {
    // x & y coordinates of the current point
    var theta = i * angleStep;
    var x = 100 + Math.cos(theta) * rad;
    var y = 100 + Math.sin(theta) * rad; // store the point's position

    points.push({
      x: x,
      y: y,
      // we need to keep a reference to the point's original point for when we modulate the values later
      originX: x,
      originY: y,
      // more on this in a moment!
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000
    });
  }

  return points;
}

document.querySelector("path").addEventListener("mouseover", function () {
  noiseStep = 0.01;
});
document.querySelector("path").addEventListener("mouseleave", function () {
  noiseStep = 0.005;
});
},{"@georgedoescode/spline":"node_modules/@georgedoescode/spline/spline.js","simplex-noise":"node_modules/simplex-noise/dist/esm/simplex-noise.js"}],"../../Users/noname/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62610" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../Users/noname/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map