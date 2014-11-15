function WebGl(){  
   
   this.Init=function(canvas){
      var gl=this.initWebGL(canvas);
      this.initViewport(gl,canvas);
      gl["geometry"]={};
      gl["programs"]={};
      gl["currentprogram"];
      gl["camera"]=new WebGLCamera();
      return gl;
   }
   
   this.initWebGL=function(ACanvas) {
      var gl = null;
      var msg = "Your browser does not support WebGL, " +
            "or it is not enabled by default.";
      try
      {
         gl = ACanvas.getContext("experimental-webgl");
         //gl = canvas.getContext("webgl");
      }
      catch (e)
      {
         msg = "Error creating WebGL Context!: " + e.toString();
      }

      if (!gl)
      {
         alert(msg);
         throw new Error(msg);
      }      
      this.initViewport(gl,ACanvas);
      //gl["projectionmatrix"]=webgl.initProjectionMatrix(ACanvas);
      return gl;
   }
   
   this.initViewport=function(gl, canvas){
      gl.viewport(0, 0, canvas.width, canvas.height);
   }
   
   this.initProjectionMatrix=function(canvas){
      // Create a project matrix with 45 degree field of view
      var projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
      return projectionMatrix;
   }

   //================================== Program   ============================//   
   this.SetProgram=function(gl,AName){
      if(!gl["programs"][AName]){
         gl["programs"][AName]=webglprogram[AName]["create"](gl);
      }
      
      gl["currentprogram"]=gl["programs"][AName];
      //console.log(gl["currentprogram"]);
   };
   
   //======================= draw geometry ===================================//
   this.CreateMatrix=function(AOptions){
      var xModelViewMatrix = mat4.create();
      
      mat4.translate(xModelViewMatrix, xModelViewMatrix, [
         ("x" in AOptions)?AOptions["x"]:0,
         ("y" in AOptions)?AOptions["y"]:0,
         ("z" in AOptions)?AOptions["z"]:0
      ]);
      
      mat4.scale(xModelViewMatrix, xModelViewMatrix, [
         ("scalex" in AOptions)?AOptions["scalex"]:1,
         ("scaley" in AOptions)?AOptions["scaley"]:1,
         ("scalez" in AOptions)?AOptions["scalez"]:1
      ]);

      if("rotatex" in AOptions) {mat4.rotateX(xModelViewMatrix, xModelViewMatrix, AOptions["rotatex"])}
      if("rotatey" in AOptions) {mat4.rotateY(xModelViewMatrix, xModelViewMatrix, AOptions["rotatey"])}
      if("rotatez" in AOptions) {mat4.rotateZ(xModelViewMatrix, xModelViewMatrix, AOptions["rotatez"])}
  
      return xModelViewMatrix;
   }
   
   
   this.DrawBox=function(gl,AOptions){
      if(!gl["geometry"]["box"]){
         gl["geometry"]["box"]=webglgeometry.InitBox(gl);
      }
      var xViewMatrix=this.CreateMatrix(AOptions);      
      this.Draw(gl,gl["geometry"]["box"],gl["currentprogram"],xViewMatrix,AOptions);
   }
   
   this.DrawCube=function(gl,AOptions){
      if(!gl["geometry"]["cube"]){
         gl["geometry"]["cube"]=webglgeometry.InitCube(gl);
      }
      
      var xCube=webglgeometry.ConfigCube(gl,AOptions);
      
      var xViewMatrix=this.CreateMatrix(AOptions); 
      this.Draw(gl,xCube,gl["currentprogram"],xViewMatrix,AOptions);
   }
   
   this.DrawLine=function(gl,AOptions){
      if(!gl["geometry"]["line"]){
         gl["geometry"]["line"]=webglgeometry.InitLine(gl);
      }   
      var  xLineGeometry=webglgeometry.ConfigLine(gl,AOptions);
      var xViewMatrix=this.CreateMatrix({});  
      
      this.Draw(gl,xLineGeometry,gl["currentprogram"],xViewMatrix,AOptions);
   }
   
   //============================ draw =======================================//   
   this.Draw=function(gl, obj, shaderProgram, modelViewMatrix,options) {
      var xOptions=options||{};
      
      var xCamera=gl["camera"].getModelViewMatrix();
      var xProjectionMatrix=gl["camera"].getProjectionMatrix();         
      var xWorldMatrix=mat4.create();
      mat4.multiply(xWorldMatrix, xProjectionMatrix,xCamera);
      
      gl.enable(gl.DEPTH_TEST);
      
      gl.useProgram(shaderProgram);

      gl.bindBuffer(gl.ARRAY_BUFFER, obj["buffer"]);
      //if("texcoordsbuffer" in obj ) gl.bindBuffer(gl.ARRAY_BUFFER, obj["texcoordsbuffer"]);
      //if("indices" in obj) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj["indices"]);
        
      // connect up the shader parameters: vertex position, color and projection/model matrices
      // set up the buffers
      gl.vertexAttribPointer(shaderProgram.shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
        
      if(obj.colorBuffer){ gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer) };
      if(obj.colorSize && shaderProgram.shaderVertexColorAttribute){
         gl.enableVertexAttribArray(shaderProgram.shaderVertexColorAttribute);
         gl.vertexAttribPointer(shaderProgram.shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0)
      };
      
      if(obj["texcoordsbuffer"] && shaderProgram.texcoordsbuffer){
         gl.vertexAttribPointer(shaderProgram.texcoordsbuffer, 2, gl.FLOAT, false, 0, 0); 
      };
      
      if(obj.indices){ gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices)};

      //console.log(projectionMatrix);
      
      gl.uniformMatrix4fv(shaderProgram.shaderProjectionMatrixUniform, false, xWorldMatrix);
      gl.uniformMatrix4fv(shaderProgram.shaderModelViewMatrixUniform, false, modelViewMatrix);

      // draw the object
      switch(obj["method"]){
         case "drawElements":    
            gl.drawElements(options["primtype"]||obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
         break;   
         
         case "drawArrays":       
            gl.drawArrays(options["primtype"]||obj.primtype, 0, obj.nVerts);
         break;
      }
   }
   
   this.Clear=function(gl,AColor){
      //if(!AOptions))AOptions)=[]
      var xR=AColor[0]||AColor["r"]/255||0;
      var xG=AColor[1]||AColor["g"]/255||0;
      var xB=AColor[2]||AColor["b"]/255||0;
      
      gl.clearColor(xR, xG, xB, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
   }

   //================================ camera =================================//
   this.GetCamera=function(xGL,AOptions){
      return xGL["camera"];
   }
   
   this.SetCamera=function(xGL,ACamera){
      xGL["camera"]=ACamera;
   }
   
   //=============================== texture==================================//
   this.CreateTextTexture=function(gl, str, width, height) {
      // create an offscreen canvas with a 2D canvas context
      
      var ctxForMakingTextures;
      
      if (!ctxForMakingTextures) {
         ctxForMakingTextures = document.createElement("canvas").getContext("2d");
      }
      var ctx = ctxForMakingTextures;

      // make it a desired size 
      ctx.canvas.width = 128;
      ctx.canvas.height = 64;

      // fill it a certain color
      ctx.fillStyle = "rgb(255,0,0)";  // red
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // draw some text into it.
      ctx.fillStyle = "rgb(0,0,0)";  // yellow
      ctx.font = "20px sans-serif";
      ctx.fillText("Hello World", 5, 40);

      // Now make a texture from it
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);

      // generate mipmaps or set filtering 
      gl.generateMipmap(gl.TEXTURE_2D);

      return tex;
   };
}  


var webgl=new WebGl();
