var xGL;
var xCanvas;
var xCanvasReal;

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
   
   //real
   xCanvasReal=document.createElement("canvas");
   document.body.appendChild(xCanvasReal);
   xCanvasReal.width=document.body.clientWidth;
   xCanvasReal.height=document.body.clientHeight;
   xCanvasReal.style.position="absolute";
   xCanvasReal.style.left="0px";
   xCanvasReal.style.top="0px";
   xCanvasReal.style.zIndex="1";
   
   
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
   

   webgl.Clear(xGL,[0.0, 0.0, 0.0]);   
   xGL.viewport(0,0,xCanvas.width, xCanvas.height);
   
   webgl.SetProgram(xGL,"color",{
      "color":[0.0, 0.0, 0.3, 0.5],
      "bordercolor":[0.0, 0.0, 1.0],
      "bordersize":0.01
   });
   
   /*webgl.DrawCube(xGL,{
      "x":-2,
      "y":0,
      "z":0,
      "rotatey":alpha,      
      "rotatex":-alpha            
   });
   */

};

Init();
setTimeout(function(){
      
   //RenderCanvas();  
   setInterval(function(){
      Render();
      RenderCanvas();
   },19);
},100)


var xRealCtx=xCanvasReal.getContext("2d");
var RenderCanvas=function(){
   var width=xCanvasReal.width;
   var height=xCanvasReal.height;
   var xCenterX=width/2;
   var xCenterY=height/2;
   xRealCtx.clearRect(0, 0, width, height);
   
   var vertices=webglgeometry["primitives"]["cube"]["vertices"];
   var indices=webglgeometry["primitives"]["cube"]["indices"];

   var xViewMatrix=xCamera.view();
   var xProjectionMatrix=xCamera.GetProjectionMatrix(xGL);
   var mMatrix=webgl.CreateMatrix({
      "x":-2,
      "y":0,
      "z":0,
      "rotatey":alpha,      
      "rotatex":-alpha  
   });
   mat4.multiply(xViewMatrix,xProjectionMatrix,xViewMatrix);
   mat4.multiply(mMatrix,xViewMatrix,mMatrix);
   
   //=========================================================================//
   var xTriangles=[];
   //var count=0;
   for(var i=0;i<indices.length;i+=3){
      var xTriangle=[];
      for(var iIndex=i;iIndex<i+3;iIndex++){   
         var xIndex=indices[iIndex];
         
         var point=[ 
            vertices[ (xIndex*3)+0 ], 
            vertices[ (xIndex*3)+1 ], 
            vertices[ (xIndex*3)+2 ] 
         ];
         
         vec3.transformMat4(point, point, mMatrix);
         point[0]=point[0] * ( width /2) + xCenterX;
         point[1]=point[1] * (-height/2) + xCenterY;
         
         xTriangle.push(point);         
      }
      
      RenderTriangle(xRealCtx,xTriangle);
   }
   //=========================================================================//   
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
    
    vec3.transformQuat(out, [0,0,0], xCamera.rotation);
   // console.log(out)
    //rectx0=(rectx0*xCanvas.width)    
    //rectx0=((out[0]-0.1)*(xZoom-1))*xCanvas.width;//+(xCanvas.width/2)
    //rectx1=(out[0]+0.1)*xCanvas.width;
    
    //x=xCanvas.width
    //console.log(rectx0, x);    
});