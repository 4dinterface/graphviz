function WebGl(){  
   
   this.Init=function(canvas){
      var gl=this.initWebGL(canvas);
      this.Viewport(gl,0,0,canvas.width, canvas.height);
      gl["currentprogram"]=null;
      gl["camera"]=webglcamera.CreateOrbitCamera();
      gl["camera"].projectionMatrix=this.initProjectionMatrix(canvas);
      gl["commands"]=[];
      gl["issafecommands"]=false;
      
      webglgeometry.Init(gl);
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
      return gl;
   }
   
   this.Viewport=function(gl, x, y, width, height){
      gl.viewport(x, y, width, height);
   }
   
   this.initProjectionMatrix=function(canvas){
      // Create a project matrix with 45 degree field of view
      var projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
      return projectionMatrix;
   }
   
   this.PushCommands=function(AGL,ACmd,AOptions){
      AGL["commands"].push({
         command:ACmd,
         options:AOptions
      })
   }
   
   

   //================================== Program   ============================//
   this.SetProgram=function(gl,AName,AOptions){
      var xFnName="Set"+AName[0].toUpperCase() + AName.substring(1,AName.length)+"Program";
      gl["currentprogram"]=webglprogram[xFnName](gl,AOptions);
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
   //============================ draw =======================================//   
   this.DrawText=function(AGL,AOptions){
      //generate text texture
  
      //set program and create geometry
      var xCube=webglgeometry.ConfigPlane(AGL,AOptions);   
      var xViewMatrix=this.CreateMatrix(AOptions); 

      AOptions["width"]=AOptions["widthtexture"];
      AOptions["height"]=AOptions["heighttexture"];
      AGL["temptexttexture"]=webgltextures.CreateTextTexture(AGL,AOptions);
 
      webgl.SetProgram(AGL,"texture",{
         "texture":AGL["temptexttexture"]
      });         
      
      //render program
      this.Draw(AGL,xCube,AGL["currentprogram"],xViewMatrix,AOptions);
   }
   
   this.DrawLine=function(AGL,AOptions){
      
      var  xLineGeometry=webglgeometry.ConfigLine(AGL,AOptions); 
      var xViewMatrix=this.CreateMatrix({});      
      
      this.Draw(AGL,xLineGeometry,AGL["currentprogram"],xViewMatrix,AOptions);
   }
   
   this.DrawPlane=function(AGL,AOptions){ 
      var xPlane=webglgeometry.ConfigPlane(AGL,AOptions); 
      var xViewMatrix=this.CreateMatrix(AOptions); 
      this.Draw(AGL,xPlane,AGL["currentprogram"],xViewMatrix,AOptions);
   }
   
   this.DrawCube=function(AGL,AOptions){     
      var xCube=webglgeometry.ConfigCube(AGL,AOptions);
      
      var xViewMatrix=this.CreateMatrix(AOptions); 
      this.Draw(AGL,xCube,AGL["currentprogram"],xViewMatrix,AOptions);
   }
   
   
   this.Draw=function(AGL, AGeometry, AShaderProgram, mvMatrix,AOptions) {
      this.PushCommands(AGL,"draw",{
         "geometry":AGeometry,
         "mvmatrix":mvMatrix,
         "data":AOptions["data"]
      });
      
      //var xCamera=gl["camera"].getModelViewMatrix();
      var xCamera=AGL["camera"].view();//<-пересчитывается на каждой фигуре, это не есть хорошо
      //var xProjectionMatrix=gl["camera"].getProjectionMatrix(); 
      var xProjectionMatrix=AGL["camera"].projectionMatrix;        
      var pMatrix=mat4.create();
      mat4.multiply(pMatrix, xProjectionMatrix,xCamera);
      
      //====================================================//
      //gl.enable( gl.BLEND );
      //gl.blendEquation( gl.FUNC_ADD );
      //gl.blendFunc(gl.SRC_ALPHA, gl.SRC_ALPHA );
      //====================================================//

     //vertexbuffer
      AGL.bindBuffer(AGL.ARRAY_BUFFER, AGeometry["vertexbuffer"]);
      AGL.vertexAttribPointer(AShaderProgram.vertexPositionAttribute, AGeometry["vertexbuffer"].itemSize, AGL.FLOAT, false, 0, 0);
 
      //texturebuffer
      if("vertexTextureAttribute" in AShaderProgram){
         AGL.bindBuffer(AGL.ARRAY_BUFFER, AGeometry["texturecoordsbuffer"]);
         AGL.vertexAttribPointer(AShaderProgram.vertexTextureAttribute, AGeometry["texturecoordsbuffer"].itemSize, AGL.FLOAT, false, 0, 0);
      }      
         
      //apply uniforms
      AGL.uniformMatrix4fv(AShaderProgram.ProjMatrix,false, pMatrix);
      AGL.uniformMatrix4fv(AShaderProgram.MVMatrix, false, mvMatrix);  

      AGL.enable(AGL.DEPTH_TEST);//тестирование глубины
      if(AGeometry["method"]=="drawArrays"){
         AGL.drawArrays(AGeometry["primtype"], 0, AGeometry["vertexbuffer"].numberOfVertex);
      } else {
         AGL.drawElements(AGL.TRIANGLES, AGeometry["indexbuffer"].numberOfItems, AGL.UNSIGNED_SHORT,0); 
      }   
   }
   
   this.Clear=function(gl,AColor){
      //if(!AOptions))AOptions)=[]
      var xR=AColor[0]||AColor["r"]/255||0;
      var xG=AColor[1]||AColor["g"]/255||0;
      var xB=AColor[2]||AColor["b"]/255||0;
      
      gl.clearColor(xR, xG, xB, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
      gl["commands"]=[];
   }

   //================================ camera =================================//
   this.CreateOrbitCamera=function(xGL,AOptions){
      var xCamera=webglcamera.CreateOrbitCamera();
      xCamera.projectionMatrix=webgl.initProjectionMatrix(xGL.canvas);
      return xCamera;
   }
   
   this.GetCamera=function(xGL,AOptions){
      return xGL["camera"];
   }
   
   this.SetCamera=function(xGL,ACamera){
      xGL["camera"]=ACamera;
   }
   
   this.GetObjectFromMouse=function(AGL,AMouseX,AMouseY,debugcontext){
      var triangles= canvasrenderer.GetTrianglesFromProectionPoint(AGL,AMouseX,AMouseY,debugcontext);
      return (triangles.length>0)?triangles[0]["command"]:null;
   }
   //======================= texture framebuffer  ============================//  
   this.InitTextureFramebuffer=function(gl,AOptions) {
      var AOptions=AOptions||{};
      var xWidth=AOptions["width"]||512;
      var xHeight=AOptions["height"]||512;
      
      var rttFramebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
      rttFramebuffer.width = xWidth;
      rttFramebuffer.height = xHeight;

      var rttTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, rttTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      //gl.generateMipmap(gl.TEXTURE_2D);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      var renderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
      return {
         "framebuffer":rttFramebuffer,
         "texture":rttTexture
      }  
   }
   
   this.BeginRenderToTexture=function(gl,ATextureFramebuffer){
      var framebuffer=ATextureFramebuffer["framebuffer"];
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); 
      gl.viewport(0, 0, framebuffer.width, framebuffer.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   }
   
   this.EndRenderToTexture=function(gl,options){
      gl.bindTexture(gl.TEXTURE_2D, options["texture"]);
      gl.generateMipmap(gl.TEXTURE_2D);
      
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return options["texture"];
   }
};

var webgl=new WebGl();