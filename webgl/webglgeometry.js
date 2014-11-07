function WebGLGeometry(){
   
   // Create the vertex data for a square to be drawn
   this.InitLine=function(gl) {    
      return {
        "buffer":gl.createBuffer(), 
        "vertSize":3, 
        "nVerts":2, 
        "primtype":gl.LINE_STRIP,
        "method":"drawArrays"
     };
   }
   
   this.ConfigLine=function(gl,AOptions) {
      var xLine=gl["geometry"]["line"];
      gl.bindBuffer(gl.ARRAY_BUFFER, xLine["buffer"]);
      var verts = [
         AOptions["x"],  AOptions["y"],  AOptions["z"],
         AOptions["x1"],  AOptions["y1"],  AOptions["z1"],
     ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW); 
     return xLine;
  }
   
   
   // Create the vertex data for a square to be drawn
   this.InitBox=function(gl) {
      var vertexBuffer;
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      var verts = [
         1,  1,  0.0,
        -1,  1,  0.0,
         1, -1,  0.0,
        -1, -1,  0.0
     ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
     
     var square = {
        "buffer":vertexBuffer, 
        "vertSize":3, 
        "nVerts":4, 
        "primtype":gl.TRIANGLE_STRIP,
        "method":"drawArrays"
     };
     return square;
   }
   
   
    // Create the vertex, color and index data for a multi-colored cube
   this.InitCube=function(gl) {
      // Vertex Data
      var vertexBuffer=gl.createBuffer();
     
       // Index data (defines the triangles to be drawn)
      var cubeIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
      var cubeIndices = [
         0, 1, 2,      0, 2, 3,    // Front face
         4, 5, 6,      4, 6, 7,    // Back face
         8, 9, 10,     8, 10, 11,  // Top face
         12, 13, 14,   12, 14, 15, // Bottom face
         16, 17, 18,   16, 18, 19, // Right face
         20, 21, 22,   20, 22, 23  // Left face
      ];
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

      //texture
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);      
      var texcoords = [
         1, 0,
         0, 0,
         0, 1,
         1, 1,
         1, 0,
         0, 0,
         0, 1,
         1, 1,
         1, 0,
         0, 0,
         0, 1,
         1, 1,
         1, 0,
         0, 0,
         0, 1,
         1, 1,
         1, 0,
         0, 0,
         0, 1,
         1, 1,
         1, 0,
         0, 0,
         0, 1,
         1, 1,
      ];     
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);


      // Color data
      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      var faceColors = [
         [1.0, 0.0, 0.0, 1.0], // Front face
         [0.0, 1.0, 0.0, 1.0], // Back face
         [0.0, 0.0, 1.0, 1.0], // Top face
         [1.0, 1.0, 0.0, 1.0], // Bottom face
         [1.0, 0.0, 1.0, 1.0], // Right face
         [0.0, 1.0, 1.0, 1.0]  // Left face
      ];
      var vertexColors = [];
      for (var i in faceColors) {
         var color = faceColors[i];
         for (var j=0; j < 4; j++) {
            vertexColors = vertexColors.concat(color);
         }
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

     
      

      var xCube = {
         buffer:vertexBuffer, 
         colorBuffer:colorBuffer, 
         indices:cubeIndexBuffer,
         
         //vertexArray:
         
         vertSize:3,
         nVerts:24, 
         colorSize:4, 
         nColors: 24, 
         nIndices:36,
         "primtype":gl.TRIANGLES,
         "method":"drawElements",
         "texcoordsbuffer":buffer,
      };
      return xCube;
   }  
    
   this.ConfigCube=function(gl,AOptions){
      var xCube=gl["geometry"]["cube"];
      
      
      var xWidth=("width" in AOptions)?AOptions["width"]:1;
      var xHeight=("height" in AOptions)?AOptions["height"]:1;
      
      gl.bindBuffer(gl.ARRAY_BUFFER, xCube["buffer"]);
      var verts = [
         // Front face
        -1.0*xWidth, -1.0*xHeight,   1.0,
         1.0*xWidth, -1.0*xHeight,  1.0,   
         1.0*xWidth,  1.0*xHeight,  1.0,
        -1.0*xWidth,  1.0*xHeight,  1.0,

         // Back face
        -1.0*xWidth, -1.0*xHeight, -1.0,
        -1.0*xWidth,  1.0*xHeight, -1.0,
         1.0*xWidth,  1.0*xHeight, -1.0,
         1.0*xWidth, -1.0*xHeight, -1.0,

         // Top face
        -1.0*xWidth,  1.0*xHeight, -1.0,
        -1.0*xWidth,  1.0*xHeight,  1.0,
         1.0*xWidth,  1.0*xHeight,  1.0,
         1.0*xWidth,  1.0*xHeight, -1.0,

         // Bottom face
        -1.0*xWidth, -1.0*xHeight, -1.0,
         1.0*xWidth, -1.0*xHeight, -1.0,
         1.0*xWidth, -1.0*xHeight,  1.0,
        -1.0*xWidth, -1.0*xHeight,  1.0,

         // Right face
         1.0*xWidth, -1.0*xHeight, -1.0,
         1.0*xWidth,  1.0*xHeight, -1.0,
         1.0*xWidth,  1.0*xHeight,  1.0,
         1.0*xWidth, -1.0*xHeight,  1.0,

         // Left face
         -1.0*xWidth, -1.0*xHeight, -1.0,
         -1.0*xWidth, -1.0*xHeight,  1.0,
         -1.0*xWidth,  1.0*xHeight,  1.0,
         -1.0*xWidth,  1.0*xHeight, -1.0
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
      return xCube;
   }
}
var webglgeometry=new WebGLGeometry();
