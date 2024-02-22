var GL2,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

export default GL2 = (function() {
  class GL2 extends EventTarget {
    constructor(canvas) {
      var ref;
      Object.defineProperties((ref = super(), this.render = this.render.bind(this), ref), {
        gl: {
          value: canvas.getContext("webgl2")
        },
        canvas: {
          value: canvas
        },
        boundingRect: {
          get: function() {
            return canvas.getBoundingClientRect();
          }
        },
        pixelRatio: {
          get: function() {
            return (typeof window !== "undefined" && window !== null ? window.devicePixelRatio : void 0) || 1;
          }
        }
      });
      Object.defineProperties(this, {
        width: {
          get: function() {
            return this.boundingRect.width;
          }
        },
        height: {
          get: function() {
            return this.boundingRect.height;
          }
        },
        left: {
          get: function() {
            return this.boundingRect.x;
          }
        },
        top: {
          get: function() {
            return this.boundingRect.y;
          }
        },
        vertical: {
          value: this.width / Math.PI
        },
        horizontal: {
          value: this.height / Math.PI
        }
      });
      Object.assign(this.canvas, {
        width: this.width * this.pixelRatio,
        height: this.height * this.pixelRatio
      });
      Object.defineProperties(this, {
        program: {
          value: this.gl.createProgram()
        },
        vertexBuffer: {
          value: this.gl.createBuffer()
        },
        vertexShader: {
          value: this.gl.createShader(this.gl.VERTEX_SHADER)
        },
        colorBuffer: {
          value: this.gl.createBuffer()
        },
        fragmentShader: {
          value: this.gl.createShader(this.gl.FRAGMENT_SHADER)
        }
      });
      Object.defineProperties(this, {
        pointSize: {
          value: new Number(20)
        },
        points: {
          value: new Number(1e6)
        },
        vertices: {
          value: new Float32Array(3 * 1e6)
        },
        colors: {
          value: new Float32Array(4 * 1e6)
        },
        clearColor: {
          value: new Float32Array([15 / 100, 17 / 100, 26 / 100, 1])
        },
        clearMask: {
          value: new Number(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)
        },
        clearDepth: {
          value: new Number(1)
        },
        camera: {
          value: new Float32Array([1.56, 0, 0, 0, 1.73, 0, 0, 0, -1, -1, 0, 0, 4.7, 5])
        }
      });
      this.gl.shaderSource(this.vertexShader, this.vertexShaderSource);
      this.gl.compileShader(this.vertexShader);
      this.gl.attachShader(this.program, this.vertexShader);
      this.gl.shaderSource(this.fragmentShader, this.fragmentShaderSource);
      this.gl.compileShader(this.fragmentShader);
      this.gl.attachShader(this.program, this.fragmentShader);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      this.gl.clearDepth(this.clearDepth);
      this.gl.clearColor(...this.clearColor);
      this.gl.linkProgram(this.program);
      this.gl.useProgram(this.program);
      Object.defineProperties(this.program, {
        a_Vertex: {
          value: this.gl.getAttribLocation(this.program, "a_Vertex")
        },
        a_Color: {
          value: this.gl.getAttribLocation(this.program, "a_Color")
        },
        u_Camera: {
          value: this.gl.getUniformLocation(this.program, "u_Camera")
        },
        u_PointSize: {
          value: this.gl.getUniformLocation(this.program, "u_PointSize")
        }
      });
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Vertex);
      this.gl.vertexAttribPointer(this.a_Vertex, 3, this.gl.FLOAT, false, 12, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Color);
      this.gl.vertexAttribPointer(this.a_Color, 4, this.gl.FLOAT, true, 16, 0);
      this.gl.uniform1f(this.u_PointSize, this.pointSize);
      this.gl.uniformMatrix4fv(this.u_Camera, !true, this.camera);
      this.dump();
      this.render();
    }

    dump() {
      setInterval(() => {
        return console.warn({stats: this.stats});
      }, 3000);
      return this;
    }

    reload() {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Vertex);
      this.gl.vertexAttribPointer(this.a_Vertex, 3, this.gl.FLOAT, false, 12, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.a_Color);
      return this.gl.vertexAttribPointer(this.a_Color, 4, this.gl.FLOAT, true, 16, 0);
    }

    render() {
      boundMethodCheck(this, GL2);
      this.stats[0]++;
      this.gl.clear(this.clearMask);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.pointCount);
      this.gl.drawArrays(this.gl.POINTS, 0, this.pointCount);
      return requestAnimationFrame(this.render);
    }

  };

  GL2.prototype.vertexShaderSource = 'precision mediump  int; precision mediump  float; attribute vec3     a_Vertex; attribute vec4     a_Color; uniform   mat4     u_Camera; uniform   float    u_PointSize; varying   vec4     v_Color; void main() { gl_Position  = u_Camera * ( vec4( a_Vertex, 1.0 ) ); gl_PointSize = u_PointSize; v_Color      = a_Color; }';

  GL2.prototype.fragmentShaderSource = 'precision mediump  int; precision mediump  float; varying   vec4     v_Color; void main() { gl_FragColor = v_Color; }';

  GL2.prototype.stats = new Uint32Array(256);

  GL2.prototype.pointCount = 0;

  return GL2;

}).call(this);
