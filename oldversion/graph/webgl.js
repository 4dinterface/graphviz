var xCanvas=document.getElementById("test");
var xGL=webgl.Init(xCanvas);

xGL["projectionmatrix"]=webgl.initProjectionMatrix(xCanvas);

var duration = 5000; // ms
var currentTime = Date.now();
var angleX=0;

var xTexture=webgl.CreateTextTexture(xGL, "hello", 100, 50);  

(function animate() {
   var now = Date.now();
   var deltat = now - currentTime;
   currentTime = now;
   var fract = deltat / duration;
   var angle = Math.PI * 2 * fract;
   angleX=angleX+angle;
   
   webgl.Clear(xGL);
   webgl.SetCamera(xGL,{}); 

   webgl.SetProgram(xGL,"multicolor"); 
   
   webgl.DrawCube(xGL,{
      "x":5,
      "z":-20,
      "rotatex":angleX,
      //"primtype":xGL.POINTS
   });
   
   //======================== texture =============================// 
   webgl.SetProgram(xGL,"texture");
   xGL.bindTexture(xGL.TEXTURE_2D, xTexture);
   
   webgl.DrawCube(xGL,{
      "x":-5,
      "z":-20,
      "rotatex":angleX
      // "primtype":xGL.LINE_STRIP
   });
   
   //==============================================================//
   webgl.SetProgram(xGL,"color",{red:0.1,green:0.2,blue:0.3}); 
   webgl.DrawBox(xGL,{
      "x":0,
      "z":-18,
      "rotatey":-angleX
   });
   
   webgl.SetProgram(xGL,"color",{red:1,green:0.2,blue:0.3}); 
   webgl.DrawLine(xGL,{
      "x":-1,
      "y":4,
      "z":0,
      
      "x1":1,
      "y1":2,
      "z1":0,
   });
   
   //mat4.rotate(xGL["projectionmatrix"], xGL["projectionmatrix"], angle, [0,0,1]); 
   requestAnimationFrame(animate);
})();
