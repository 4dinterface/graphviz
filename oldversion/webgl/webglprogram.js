function WebGlProgram(){ 
   
   this.CreateTexture=function(gl){
      var vertexShaderSource =  
         "  attribute vec3 vertexPos;\n"+
    
         "  attribute vec2 a_texcoord;\n"+
         "  varying vec2 v_texcoord;\n"+

         "  uniform mat4 projectionMatrix;\n"+//u_worldViewProjection;
         "  uniform mat4 modelViewMatrix;\n"+

         "  void main() {\n"+
         "     gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);\n"+
         "     v_texcoord = a_texcoord;\n"+
         "  }\n";

      var fragmentShaderSource =
         "  precision mediump float;"+
         "  varying vec2 v_texcoord;"+

         "  uniform sampler2D u_texture;"+
         "  void main() {"+
         "     gl_FragColor = texture2D(u_texture, v_texcoord);"+
         "  }"
 
      var shaderProgram=this.initProgram(gl,fragmentShaderSource,vertexShaderSource);      
      gl.useProgram(shaderProgram);
 
      // get pointers to the shader params


      shaderProgram.shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");      
      shaderProgram.shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
      
      shaderProgram.shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
      gl.enableVertexAttribArray(shaderProgram.shaderVertexPositionAttribute);

      //++++
      var texcoordLoc = gl.getAttribLocation(shaderProgram, "a_texcoord");
      gl.enableVertexAttribArray(texcoordLoc); 
      gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
      
      shaderProgram.texcoordsbuffer=texcoordLoc;
      //+++++
      
      return shaderProgram;         
   }
   
   this.CreateColor=function(gl){           
      var vertexShaderSource =
         "    attribute vec3 vertexPos;\n" +
         "    uniform mat4 modelViewMatrix;\n" +
         "    uniform mat4 projectionMatrix;\n" +
         "    void main(void) {\n" +
         "        // Return the transformed and projected vertex value\n" +
         "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
         "            vec4(vertexPos, 1.0);\n" +
         "    }\n";

       var fragmentShaderSource =
           //"    attribute vec4 color;\n" +    
           "    void main(void) {\n" +
           "    // Return the pixel color: always output white\n" +
           "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n" +
           "}\n";
   
      var shaderProgram=this.initProgram(gl,fragmentShaderSource,vertexShaderSource);
      
      // get pointers to the shader params  
      shaderProgram.shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
      gl.enableVertexAttribArray(shaderProgram.shaderVertexPositionAttribute);   
      shaderProgram.shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
      shaderProgram.shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

      return shaderProgram;
   }
   
   this.SetColor=function(gl,program,AOption){
      
   }
   
   this.CreateMultiColor=function(gl){   
      //3d Shaders
      var vertexShaderSource =
           "    attribute vec3 vertexPos;\n" +
           "    attribute vec4 vertexColor;\n" +
           "    uniform mat4 modelViewMatrix;\n" +
           "    uniform mat4 projectionMatrix;\n" +
           "    varying vec4 vColor;\n" +
           "    void main(void) {\n" +
           "        // Return the transformed and projected vertex value\n" +
           "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
           "            vec4(vertexPos, 1.0);\n" +
           "        // Output the vertexColor in vColor\n" +
           "        vColor = vertexColor;\n" +
           "    }\n";

      var fragmentShaderSource =
           "    precision mediump float;\n" +
           "    varying vec4 vColor;\n" +
           "    void main(void) {\n" +
           "    // Return the pixel color: always output white\n" +
           "    gl_FragColor = vColor;\n" +
           "}\n";
   
      var shaderProgram=this.initProgram(gl,fragmentShaderSource,vertexShaderSource);
      
      // get pointers to the shader params
      shaderProgram.shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
      gl.enableVertexAttribArray(shaderProgram.shaderVertexPositionAttribute);
        
      //shaderVertexColorAttribute
      shaderProgram.shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
          
      shaderProgram.shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
      shaderProgram.shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
      
      return shaderProgram;
   };
   
   this.createShader=function (gl, str, type) {
        var shader;
        if (type == "fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == "vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return null;
        }
        return shader;
    }

   this.initProgram=function(gl,fragmentShaderSource,vertexShaderSource) {
        // load and compile the fragment and vertex shader
        //var fragmentShader = getShader(gl, "fragmentShader");
        //var vertexShader = getShader(gl, "vertexShader");
        var fragmentShader = this.createShader(gl, fragmentShaderSource, "fragment");
        var vertexShader = this.createShader(gl, vertexShaderSource, "vertex");

        // link them together into a new program
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

   
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        
        return shaderProgram;
   }
   
   this["multicolor"]={
      "create":this.CreateMultiColor.bind(this)
   }
   this["color"]={
      "create":this.CreateColor.bind(this)
   }
   
   this["texture"]={
      "create":this.CreateTexture.bind(this)
   }
}
var webglprogram=new WebGlProgram();