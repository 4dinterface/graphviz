var xGL;
var xCanvas;
var xCamera;
var xTexture;
var xTextureFramebuffer;

function Init(){
   xCanvas=document.createElement("canvas");
   document.body.appendChild(xCanvas);
   xCanvas.width=document.body.clientWidth;
   xCanvas.height=document.body.clientHeight;
   xCanvas.style.width=document.body.clientWidth+"px";
   xCanvas.style.height=document.body.clientHeight-5+"px";
   xGL=webgl.Init(xCanvas);
   
   
   xCamera=webgl.GetCamera(xGL);
   xCamera.Zoom(5);
   //xCamera.setEye([0,0,2]);
   //xCamera.Rotate([0.8, 0.00],[0.00, 0.00]);  
   xTexture=webgltextures.LoadTexture(xGL,"brickwall3.jpg");
   
   xTextTexture=webgltextures.CreateTextTexture(xGL,{
      "text":"Hello world !!!",
      "color":"rgb(0,160,0)",
      "backgroundcolor":"rgb(0,32,0)"
   });   
   
   xTextureFramebuffer=webgl.InitTextureFramebuffer(xGL);
}

var alpha=0 ;
function Render(){
   alpha+=0.02;
   var xCamera= webgl.GetCamera(xGL);
   
   //xCamera.Pan([0.001,0.0,0.0]);
   
   var tempTexture=RenderToTexture();
   
   webgl.Clear(xGL,[0.0, 0.0, 0.0]);   
   xGL.viewport(0,0,xCanvas.width, xCanvas.height);
   
   webgl.SetProgram(xGL,"color",{
      "color":[0.0, 0.0, 0.3, 0.5],
      "bordercolor":[0.0, 0.0, 1.0],
      "bordersize":0.01
   });
   
   webgl.DrawCube(xGL,{
      "x":-2,
      "y":0,
      "z":0,
      "rotatey":alpha,      
      "rotatex":-alpha            
   });


   webgl.SetProgram(xGL,"color",{
      "color":[1.0, 0.9, 0.0, 1.0],
      "bordercolor":[1.0, 0.0, 0.0],
      "bordersize":0.00
   });

   var xTest=[], xOffsetX=-1.5,xLength=30;
   for(var i=0;i<xLength;i++) { xTest.push( xOffsetX+i*(3/xLength), Math.cos(alpha+i/4)/2+1.5, 0 ) };
   webgl.DrawLine(xGL,xTest);
      
   webgl.SetProgram(xGL,"color",{ color:[0.3, 0.3, 0.3], "bordercolor":[0.3, 0.3, 0.3]});
   for(var i=0;i<11;i++) { webgl.DrawLine(xGL,[xOffsetX,i/10+1,0,xOffsetX+3,i/10+1,-0.0]); };
   for(var i=0;i<10;i++) { webgl.DrawLine(xGL,[i/3+xOffsetX,1,0, i/3+xOffsetX,2,-0.0]); };  
   
   webgl.SetProgram(xGL,"texture",{
      "texture":tempTexture
   }); 
   
   webgl.DrawPlane(xGL,{
      "x":0,
      "y":0,
      "z":0,
      "rotatey":alpha,      
   });
   
   
   webgl.SetProgram(xGL,"texture",{
      "texture":xTexture
   }); 
   
   webgl.DrawCube(xGL,{
      "x":2,
      "y":0,
      "z":0,
      "rotatey":alpha,
      "rotatex":-alpha           
   });
   
   webgl.DrawText(xGL,{
      "x":0,
      "y":-1.5,
      "z":0,
      "rotatex":-alpha,
      "widthtexture":128,
      "heightexture":64,      
      "text":"hello 2"
   });
   
}; 


function RenderToTexture(){
   webgl.BeginRenderToTexture(xGL,xTextureFramebuffer);
   webgl.Clear(xGL,{r:150,g:150,b:150})
   
   webgl.SetProgram(xGL,"color",{
      "color":[0.0, 0.0, 0.3, 0.5],
      "bordercolor":[0.0, 0.0, 1.0],
      "bordersize":0.01
   });
   
   webgl.DrawCube(xGL,{
      "x":-2,
      "y":0,
      "z":0,
      "rotatey":alpha,      
      "rotatex":-alpha            
   });

   webgl.SetProgram(xGL,"color",{
      "color":[0.3, 0.0, 0.0, 1.0],
      "bordercolor":[1.0, 0.0, 0.0],
      "bordersize":0.01
   });
   
   webgl.DrawCube(xGL,{
      "x":2,
      "y":0,
      "z":0,
      "rotatey":alpha,      
      "rotatex":-alpha            
   });   

   //green
   webgl.SetProgram(xGL,"color",{
      "color":[0.0, 0.3, 0.0, 1.0],
      "bordercolor":[0.0, 1.0, 0.0],
      "bordersize":0.01
   });
   
   webgl.DrawCube(xGL,{
      "x":0,
      "y":0,
      "z":0,
      "rotatey":alpha,      
      "rotatex":-alpha            
   });      
   
   return webgl.EndRenderToTexture(xGL,xTextureFramebuffer);
}


Init();
setTimeout(function(){
      
   //RenderCanvas();  
   setInterval(Render,19);
},100)

var RenderCanvas=function(){
   var ctx=xCanvas.getContext("2d");
   
   var vertices=webglgeometry["primitives"]["cube"]["vertices"];
   var xViewMatrix=xCamera.view();
   var xProjectionMatrix=xCamera.GetProjectionMatrix(xGL);
   mat4.multiply(xViewMatrix,xProjectionMatrix,xViewMatrix);
   
   var points=[];
   for(var i=0;i<vertices.length/3;i++){
     var point=[];
     vec3.transformMat4(point, [vertices[i], vertices[i+1], vertices[i+2]], xViewMatrix);
     points.push(point);
     
     //ctx.strokeRect(point[0],point[1],1,1);
   }
   
}

document.body.addEventListener('mousedown',function(e){ 
    var x=e.offsetX;//e.offsetX/xCanvas.width;
    var y=e.offsetY;//e.offsetY/xCanvas.height
    var aspect=xCanvas.width/xCanvas.height;
    
   
    var out=vec3.create();
    var outmouse=vec3.create();
    
    var xZoom=xCamera.GetZoom();
    
    var xViewMatrix=xCamera.view();
    var xProjectionMatrix=xCamera.GetProjectionMatrix(xGL);
    //mat4.multiply(xViewMatrix,xProjectionMatrix,xViewMatrix);
    
    //vec3.transformMat4(out, [-2,0,0], xViewMatrix);
    //console.log(xCamera.rotation)
    //rectx0=out[0]*(xZoom-1);
    
    vec3.transformQuat(out, [-2,0,0], xCamera.rotation);
   // console.log(out)
    //rectx0=(rectx0*xCanvas.width)    
    //rectx0=((out[0]-0.1)*(xZoom-1))*xCanvas.width;//+(xCanvas.width/2)
    //rectx1=(out[0]+0.1)*xCanvas.width;
    
    //x=xCanvas.width
    //console.log(rectx0, x);    
});