function WebGLGeometry(){
   
   // Create the vertex data for a square to be drawn
   this.InitLine=function(gl) {    
      var vertexBuffer=gl.createBuffer();
      vertexBuffer.itemSize=3;
      vertexBuffer.numberOfVertex = 2;
      
      return {
        "vertexbuffer":vertexBuffer, 
        "primtype":gl.LINE_STRIP,
        "method":"drawArrays"
     };
   }
   
   this.ConfigLine=function(gl,AVerts) {
      var xLine=this.primitives["line"];
      gl.bindBuffer(gl.ARRAY_BUFFER, xLine["vertexbuffer"]);
      xLine["vertexbuffer"].numberOfVertex=AVerts.length/3;
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(AVerts), gl.STATIC_DRAW); 
     return xLine;
   }

    // Create the vertex, color and index data for a multi-colored cube
   this.InitCube=function(gl) {
      // Vertex Data
      var vertices =[
                // ������� �����
                -0.5, -0.5, 0.5,
                -0.5, 0.5, 0.5,//1
                 0.5, 0.5, 0.5,//2
                 0.5, -0.5, 0.5,
                 
                 // ������ ����� 
                -0.5, -0.5, -0.5,
                -0.5, 0.5, -0.5,//5
                 0.5, 0.5, -0.5,//6
                 0.5, -0.5, -0.5,
                  
                 // ����� ������� �����
                -0.5, -0.5, 0.5,
                -0.5, 0.5, 0.5,//
                -0.5, 0.5, -0.5,//
                -0.5, -0.5, -0.5,
                 
                // ������ ������� �����
                 0.5, -0.5, 0.5,
                 0.5, 0.5, 0.5,//
                 0.5, 0.5, -0.5,//
                 0.5, -0.5, -0.5,
                 
                 //������� �������
                -0.5, -0.5, 0.5,  //16
                 0.5, -0.5, 0.5,  //17
                 0.5, -0.5, -0.5, //18
                -0.5, -0.5, -0.5, //19 

                -0.5, 0.5, 0.5,  
                 0.5, 0.5, 0.5,  
                 0.5, 0.5, -0.5, 
                -0.5, 0.5, -0.5,           
                
                 ];
                  
                  
      var indices = [ 
                // ������� �����
                0, 1, 2, 
                2, 3, 0,
                // ������ �����
                4, 5, 6,
                6, 7, 4,
                //����� ������� �����
                8, 9, 10, 
                10, 11, 8,
                // ������ ������� �����
                12, 13, 14, 
                14, 15, 12,
                
                //����
                16, 17, 19,
                19, 18, 17,

                //���
                20, 21, 23,
                23, 22, 21
            ];
 

      // ���������� ��������
      var textureCoords = [];
      for(var i=0;i<6;i++){
         textureCoords.push(
                 0.0, 0.0,
                 0.0, 1.0,
                 1.0, 1.0,
                 1.0, 0.0
         )
      };
                 
      return {
         vertexbuffer:this.CreateArrayBuffer(gl,new Float32Array(vertices),3),
         indexbuffer:this.CreateElementArrayBuffer(gl,new Uint16Array(indices)),
         texturecoordsbuffer:this.CreateArrayBuffer(gl,new Float32Array(textureCoords),2),
         vertices:vertices,
         indices: indices
      }  
      
   }
   
   this.ConfigCube=function(){
      return this.primitives["cube"];
   }
   
   this.InitPlane=function(gl){
            // Vertex Data
      var vertices =[
                -0.5, -0.5, 0.0,
                -0.5, 0.5,  0.0,//1
                 0.5, 0.5,  0.0,//2
                 0.5, -0.5, 0.0,
                 ];
                  
      var indices = [ 
                0, 1, 2, 
                2, 3, 0,
            ];
 
   
      // ���������� ��������
      var textureCoords = [
             0.0, 0.0,
             0.0, 1.0,
             1.0, 1.0,
             1.0, 0.0
      ];
                        
      return {
         vertexbuffer:this.CreateArrayBuffer(gl,new Float32Array(vertices),3),
         indexbuffer:this.CreateElementArrayBuffer(gl,new Uint16Array(indices)),
         texturecoordsbuffer:this.CreateArrayBuffer(gl,new Float32Array(textureCoords),2),
         vertices:vertices
      }  
   }
   
   this.CreateArrayBuffer=function(gl,AData,itemSize){
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, AData, gl.STATIC_DRAW);
      
      if(itemSize) buffer.itemSize = itemSize;
      buffer.numberOfItems = AData.length;
      return buffer;
   }
   
   this.CreateElementArrayBuffer=function(gl,AData,itemSize){
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, AData, gl.STATIC_DRAW);
      
      if(itemSize) buffer.itemSize = itemSize;
      buffer.numberOfItems = AData.length;
      return buffer;
   }
   
   
   this.ConfigPlane=function(){
      return this.primitives["plane"];
   } 
   
   //������������� ���������
   this.Init=function(gl){
      this.primitives={
         "plane":this.InitPlane(gl), //�������� ���         
         "cube":this.InitCube(gl),
         "line":this.InitLine(gl)
      }
   }
};

var webglgeometry=new WebGLGeometry();
