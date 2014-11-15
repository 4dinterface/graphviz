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
      var xProjectionMatrix=xCamera.GetProjectionMatrix(xGL);
      mat4.multiply(xViewMatrix,xProjectionMatrix,xViewMatrix)
      
      for(var xI=0;xI<xCommands.length;xI++){
         var xCommand=xCommands[xI];
         if(xCommand!="draw") {continue};
      
         //prepary matrix
         var mMatrix=xCommand["mvmatrix"]
         mat4.multiply(mMatrix,xViewMatrix,mMatrix);  
         
         //prepary geometry
         var xGeometry=xCommands["geometry"];
         var xVertices = xGeometry["vertices"];
         var xIndices  = xGeometry["indices"];
         
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
               vec3.transformMat4(xPoint, xPoint, mMatrix);
               xTriangle["points"].push(xPoint);         
            }
            
            xTriangles.push(xTriangle);
         }
      } 
      return xTriangles;
   }
   
   this.RenderCommands=function(gl,ATargetContext){
      var xCanvas=ATargetContex||gl["canvas"];
      var xWidth=xCanvas.width/2;
      var xHeight=xCanvas.height/2;
      
      var xTriangles=this.PrepareTriangles(gl);
      
      for (var xI=0;xI<xTriangles.length;xI++){      
         this.RenderTriangle(xCanvas, xTriangles[xI],xWidth,xHeight);
      }
   }
      
   function RenderTriangle(ACtx,triangle,AW,AH){
      ACtx.strokeStyle = 'red';
      ACtx.beginPath();

      ACtx.moveTo( triangle[0][0]*AW+AW, triangle[0][1]*AH+AH );
      ACtx.lineTo( triangle[1][0]*AW+AW, triangle[1][1]*AH+AH );
      ACtx.lineTo( triangle[2][0]*AW+AW, triangle[2][1]*AH+AH );
      ACtx.lineTo( triangle[0][0]*AW+AW, triangle[0][1]*AH+AH );  
      ACtx.stroke();
   };
   
}
webglraycaster=new WebGLRaycaster();