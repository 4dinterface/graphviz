function WebGLTextures(){

   this.LoadTexture=function(gl,APath){
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      var image = new Image();
      image.onload = SetGLTexture.bind(this,gl,image, texture);
      image.src = APath;
      
      return texture;
   }

   function SetGLTexture(gl,image, texture) { 
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
   }
   
   this.ctx=document.createElement("canvas").getContext("2d");
   this.RenderTextToCanvas=function(AOptions){
      var ctx = this.ctx;

      // make it a desired size 
      ctx.canvas.width  = AOptions["width"]||128;
      ctx.canvas.height = AOptions["height"]||64;

      // fill it a certain color
      ctx.fillStyle = AOptions["background"] || "rgba(0,0,0,0)";  // red
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // draw some text into it.
      ctx.fillStyle = AOptions["color"]||"rgb(0,0,0)"; 
      ctx.font = (AOptions["fontsize"]||"20px")+" "+(AOptions["fontname"]||"sans-serif");
      ctx.fillText(AOptions["text"], 5, 40);
      return ctx;
   }
   
           
   this.CreateTextTexture=function(gl, AOptions){ 
      var ctx=this.RenderTextToCanvas(AOptions);
      var tex = AOptions["texture"]||gl.createTexture();
      SetGLTexture(gl,ctx.canvas,tex);
      return tex;
   };
   
};

var webgltextures=new WebGLTextures();