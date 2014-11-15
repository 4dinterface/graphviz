function WebGlProgram(){ 
   
   this.programs={};
   
   //=========================================================================//
   //=============================== Texture program =========================//
   //=========================================================================//
   
   this.CreateTextureProgram=function(gl){
      var vertexShaderSource =  
         "  attribute vec3 aVertexPosition;"+
         "  attribute vec2 aVertexTextureCoords;"+
         "  varying vec2 vTextureCoords;"+
         "  uniform mat4 uMVMatrix;"+
         "  uniform mat4 uPMatrix;"+
         "  void main(void) {"+
         "      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);"+
         "      vTextureCoords = aVertexTextureCoords;"+
         "  }";

      var fragmentShaderSource =
         "  precision highp float;"+
         "  uniform sampler2D uSampler;"+
         "  varying vec2 vTextureCoords;"+
         "  void main(void) {"+
                "gl_FragColor = texture2D(uSampler, vTextureCoords);"+
         "  }";
 
      var shaderProgram=this.initProgram(gl,fragmentShaderSource,vertexShaderSource);      
      gl.useProgram(shaderProgram);
 
      //shader program
      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute); 
      shaderProgram.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "aVertexTextureCoords");
      gl.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);
      
      //todo перекинул код с sampleUniform из загрузки текстуры, вообще не понятно почему в уроке его там разместили
      shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
      gl.uniform1i(shaderProgram.samplerUniform, 0);
 

      shaderProgram.MVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
      shaderProgram.ProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
      
      return shaderProgram;         
   }
   
   this.SetTextureProgram=function(gl,AOption){
      var shaderProgram=this.programs["texture"]=this.programs["texture"]||this.CreateTextureProgram(gl);
      gl.useProgram(shaderProgram);
      
      gl.activeTexture(gl.TEXTURE0);//активная текстура
      gl.bindTexture(gl.TEXTURE_2D, AOption["texture"]);
      
      return shaderProgram;
   }
   
   //=========================================================================//
   //=============================== Color program ===========================//
   //=========================================================================//

   this.CreateColorProgram=function(gl){           
      var vertexShaderSource =  
         "  attribute vec3 aVertexPosition;"+
         "  uniform mat4 uMVMatrix;"+
         "  uniform mat4 uPMatrix;"+
         "  varying vec3 vVertexPos;"+ 
         "  void main(void) {"+
         "      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);"+
         "      vVertexPos=aVertexPosition;"+
         "  }";

      var fragmentShaderSource =
         "  precision highp float;"+//?
         "  uniform vec4 uColor;\n" +
         "  uniform vec4 uBorderColor;\n" + 
         "  uniform float uBorderSize;\n" + 
         "  varying vec3 vVertexPos;"+ 
         //"  const vec2 resolution=vec2(100,100);"+

         "  void main(void) {"+
         //"      vec2 position = ( gl_FragCoord.xy / resolution.xy );"+
         "      vec4 texelColor = uColor; "+        
         "      int count=0;"+
         "      if(abs(vVertexPos.x)>0.5-uBorderSize) count++;"+
         "      if(abs(vVertexPos.y)>0.5-uBorderSize) count++;"+
         "      if(abs(vVertexPos.z)>0.5-uBorderSize) count++;"+
         "      if(count>1) texelColor=uBorderColor;"+         
         "      gl_FragColor = texelColor;"+      
         "  }";
 
      var shaderProgram=this.initProgram(gl,fragmentShaderSource,vertexShaderSource);      
      gl.useProgram(shaderProgram);
 
      //shader program
      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute); 
      
      shaderProgram.color = gl.getUniformLocation(shaderProgram, "uColor");
      shaderProgram.borderSize = gl.getUniformLocation(shaderProgram, "uBorderSize");
      shaderProgram.borderColor = gl.getUniformLocation(shaderProgram, "uBorderColor");
      
      shaderProgram.MVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
      shaderProgram.ProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
      return shaderProgram;
   }
   
   //Color
   this.SetColorProgram=function(gl,AOptions){
      var xOptions=AOptions||{};
      var xColor=xOptions["color"]||[1.0,1.0,1.0,1.0];
      var xBorderColor=xOptions["bordercolor"]||[0.0,0.0,0.0,1.0];
      var xBorderSize=xOptions["bordersize"]||0.0;
      
      var shaderProgram=this.programs["color"]=this.programs["color"]||this.CreateColorProgram(gl);
      gl.useProgram(shaderProgram);
      gl.uniform4f(shaderProgram.color,xColor[0],xColor[1],xColor[2], xColor[3]||1);  
      gl.uniform4f(shaderProgram.borderColor, xBorderColor[0], xBorderColor[1], xBorderColor[2],xBorderColor[3]||1 );
      gl.uniform1f(shaderProgram.borderSize,xBorderSize);
      return shaderProgram;
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
}
var webglprogram=new WebGlProgram();