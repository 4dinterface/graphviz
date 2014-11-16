function CanvasRenderer(){
   
   this.PrepareTriangles=function(gl){
      var xPoint=[];
      var xTriangle=[];         
      var xTriangles=[];
      var xVertices=[];
      var xIndices=[];
      
      var xCommands=gl["commands"];
      
      var xCamera=gl["camera"];  
      var xViewMatrix=xCamera.view();
      var xProjectionMatrix=xCamera.GetProjectionMatrix(gl);
      mat4.multiply(xViewMatrix,xProjectionMatrix,xViewMatrix)
      
      //console.log(xCommands);
      for(var iCommand=0;iCommand<xCommands.length;iCommand++){
         var xCommand=xCommands[iCommand];

         if(xCommand["command"]!=="draw") {continue};
         //console.log(xCommand);
         
         //prepary matrix
         var mMatrix=xCommand["options"]["mvmatrix"]
         var rMatrix=mat4.create();
         mat4.multiply(rMatrix,xViewMatrix,mMatrix);  
         
         //prepary geometry
         var xGeometry=xCommand["options"]["geometry"];
         var xVertices = xGeometry["vertices"];
         var xIndices  = xGeometry["indices"];
         if(!xIndices){continue};
          
         for(var xI=0;xI<xIndices.length;xI+=3){
            xTriangle={
               points:[],
               command:xCommand//?
            };
            
            for(var iPoint=xI;iPoint<xI+3;iPoint++){   
               var xIndex=xIndices[iPoint];

               xPoint=[ 
                  xVertices[ (xIndex*3)+0 ], 
                  xVertices[ (xIndex*3)+1 ], 
                  xVertices[ (xIndex*3)+2 ] 
               ];
               vec3.transformMat4(xPoint, xPoint, rMatrix);
               xTriangle["points"].push(xPoint);         
            }
            
            xTriangles.push(xTriangle);
         }
      } 
      return xTriangles;
   }
   
   this.RenderCommands=function(gl,ATargetContext){
      var xCanvas=ATargetContext.canvas||gl["canvas"];
      var ctx=ATargetContext;
              
      var xWidth=xCanvas.width/2;
      var xHeight=xCanvas.height/2;
      
      var xTriangles=this.PrepareTriangles(gl);

      ctx.clearRect(0, 0, xWidth*2, xHeight*2);
      for (var xI=0;xI<xTriangles.length;xI++){     
         RenderTriangle(ctx, xTriangles[xI],xWidth,xHeight);
      }
   }
      
   function RenderTriangle(ACtx,ATriangle,AW,AH){
      var xPoints=ATriangle["points"];
      ACtx.strokeStyle = 'red';
      ACtx.beginPath();
      
      ACtx.moveTo( xPoints[0][0]*AW+AW, -xPoints[0][1]*AH+AH );
      ACtx.lineTo( xPoints[1][0]*AW+AW, -xPoints[1][1]*AH+AH );
      ACtx.lineTo( xPoints[2][0]*AW+AW, -xPoints[2][1]*AH+AH );
      ACtx.lineTo( xPoints[0][0]*AW+AW, -xPoints[0][1]*AH+AH );  
      ACtx.stroke();
   };
   
   this.GetTrianglesFromProectionPoint=function(AGL,AX,AY,targetcontext){
      //console.log(AX,AY);
      
      var xA,xB,xC;
      var x1,y1,x2,y2,x3,y3;
      var xPoints=[];
      var xResults=[];
      
      var xCanvas=AGL["canvas"];
      
      var xW=xCanvas.width/2;
      var yH=xCanvas.height/2;          
      //console.log(x,y);
      var xCount=0;
      
      var xTriangles=this.PrepareTriangles(AGL);
      for (var xI=0;xI<xTriangles.length;xI++){     
         xPoints=xTriangles[xI]["points"];
         x1=  xPoints[0][0]*xW+xW;
         y1= -xPoints[0][1]*yH+yH;
         x2=  xPoints[1][0]*xW+xW;
         y2= -xPoints[1][1]*yH+yH;
         x3=  xPoints[2][0]*xW+xW;
         y3= -xPoints[2][1]*yH+yH;
         
         xA = (x1 - AX) * (y2 - y1) - (x2 - x1) * (y1 - AY);
         xB = (x2 - AX) * (y3 - y2) - (x3 - x2) * (y2 - AY);
         xC = (x3 - AX) * (y1 - y3) - (x1 - x3) * (y3 - AY);
 
         if ((xA >= 0 && xB >= 0 && xC >= 0) || (xA <= 0 && xB <= 0 && xC <= 0)){
            xResults.push(xTriangles[xI]);
         }
         //DebugTriangle(targetcontext,x1,y1,x2,y2,x3,y3);
      }
      return xResults;
   }
   
   
   function DebugTriangle(ACtx,x1,y1,x2,y2,x3,y3){
      
      ACtx.strokeStyle = 'red';
      ACtx.beginPath();
      if(!x1){return;}
      console.log(x1,y1,x2,y2,x3,y3);
      
      ACtx.moveTo( x1,y1 );
      ACtx.lineTo( x2,y2 );
      ACtx.lineTo( x3,y3 );
      ACtx.lineTo( x1,y1 );  
      ACtx.stroke();
   };
}
canvasrenderer=new CanvasRenderer();