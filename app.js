function GraphView(){
   
   this.Options={
      width:2000,      //that.layout_options.width = that.layout_options.width || 2000;
      height:2000,//that.layout_options.height = that.layout_options.height || 2000;
      iterations:100000,//that.layout_options.iterations = that.layout_options.iterations || 100000;
      
      layout:GLOBALLAYOUT, //that.layout_options.layout = that.layout_options.layout || that.layout;  
      attraction: 5, 
      repulsion: 0.5
   }
   
   this.InitWebGl=function(AComp){
      var xCanvas=AComp["refs"]["canvas"]
      var xGL=webgl.Init(xCanvas);
      AComp["state"]["gl"]=xGL; 
      var xCamera=webgl.GetCamera(xGL);
      xCamera.setEye([0,0,100]);
   }
   
   this.RenderWebGl=function(){
      var xGL=AComp["state"]["gl"]
      var xGraph=AComp["state"]["graph"];
      var xCamera=webgl.GetCamera(xGL);
     
      xGraph.layout.generate();    
      webgl.Clear(xGL,[0.0,0.0,0.0]);      
      var xSize=20;
      
      xGraph["nodes"].forEach(function(xItem){
         var xPos=xItem.position;

         webgl.SetProgram(xGL,"color",{
            color:[1.0, 0.9, 0.0],
            "bordercolor":[0.3, 0.2, 0.0],
            "bordersize":0.03
         }); 
      
         webgl.DrawCube(xGL,{
            "x":xPos["x"]/xSize,
            "y":xPos["y"]/xSize,
            "z":xPos["z"]/xSize,
            "scalex":2,
            "scaley":2,
            "scalez":2
         });       
         
         webgl.DrawText(xGL,{
            "x":xPos["x"]/xSize,
            "y":xPos["y"]/xSize-2.2,
            "z":xPos["z"]/xSize,
            "rotatey":xCamera.orbitYaw*2,
            "scalex":2,
            "scaley":2,
            "color":"#FFF",
            "fontsize":"30px",
            
            "widthtexture":128,
            "heightexture":64,
            "text":"hello"
         });
      });
      
      //line
      webgl.SetProgram(xGL,"color",{ red:1, green:0.2, blue:0.3});
      webgl.SetProgram(xGL,"color",{ color:[1, 1, 1], "bordercolor":[1, 1, 1]});
  
      //webgl.SetProgram(xGL,"multicolor"); 
      
      xGraph["edges"].forEach(function(xItem){
         var xPosSource=xItem["source"]["position"];
         var xPosTarget=xItem["target"]["position"];     
            
          webgl.DrawLine(xGL,[
            xPosSource["x"]/xSize,
            xPosSource["y"]/xSize,
            xPosSource["z"]/xSize,

            xPosTarget["x"]/xSize,
            xPosTarget["y"]/xSize,
            xPosTarget["z"]/xSize
          ]);
         
      });   
   }
   
   this.RenderCanvas=function(AComp){
      var xContext=AComp["state"]["context"];
      var xCanvas=AComp["refs"]["canvas"];
      var xZoom=AComp["state"]["zoom"];
      var xGraph=AComp["state"]["graph"];
      
      
      xGraph.layout.generate();
      xContext.clearRect(0, 0, xCanvas.width, xCanvas.height);
      var xCenterX=xCanvas.width/2;
      var xCenterY=xCanvas.height/2;
            
      xGraph["edges"].forEach(function(xItem){
         var xPosSource=xItem["source"]["position"];
         var xPosTarget=xItem["target"]["position"];     
         xContext.beginPath();
         xContext.moveTo(xCenterX+(xPosSource["x"]/xZoom), xCenterY+(xPosSource["y"]/xZoom));
         xContext.lineTo(xCenterX+(xPosTarget["x"]/xZoom), xCenterY+(xPosTarget["y"]/xZoom));
         xContext.stroke();
     })
     
     xGraph["nodes"].forEach(function(xItem){
         var xPos=xItem.position;
         xContext.beginPath();
         xContext.rect(xCenterX+(xPos["x"]/xZoom)-10, xCenterY+(xPos["y"]/xZoom)-10, 20, 20);
         xContext.fillStyle = 'green';
         xContext.fill();
         xContext.lineWidth = 1;
         xContext.strokeStyle = 'black';
         xContext.stroke();
      })
   }
   
   
   this.Fill=function(AComp){
      var xLimit=100;
      var xGraph =new Graph({limit: xLimit})
      AComp["state"]["graph"]=xGraph;
      
      var area = 5000;
      var xNodes=[];
      
      for(var xI=0;xI<xLimit;xI++){
         var xItem = new Node(xI);  // create nodes with id
         
         xGraph.addNode( xItem );    // add nodes
         xNodes.push(xItem);
      
         xItem.position.x = Math.floor(Math.random() * (area + area + 1) - area);
         xItem.position.y = Math.floor(Math.random() * (area + area + 1) - area);
         if(AComp["options"]["layout"]=="3d"){
            xItem.position.z = Math.floor(Math.random() * (area + area + 1) - area);
         }else{
            xItem.position.z=0;
         }   
      }
      
      xNodes.forEach(function(xSource){
         var xEdgeCount=0;
         xNodes.forEach(function(xTarget){
            if((Math.random() *xLimit)<2){
               xGraph.addEdge( xSource, xTarget );
               xEdgeCount++;
            }   
         })        
         if(xEdgeCount==0){
            xGraph.addEdge( xSource, xNodes[0] );
         }    
      });  
      
      xGraph.layout = new Layout.ForceDirected(xGraph, this.Options);
      xGraph.layout.init();
   }
   
   
   this.MouseDown=function(AComp,AEvent){
      AComp["state"]["mouselastx"]=AEvent.clientX    
      AComp["state"]["mouselasty"]=AEvent.clientY;
      //console.log( AComp["state"]["mouselastx"] );
      //console.log( AComp["state"]["mouselasty"] );
      
      //var xGraph=AComp["state"]["graph"];
      //var xCamera=webgl.GetCamera(xGL);     
      //var xSize=20;
      
      //xGraph["nodes"].forEach(function(xItem){
      //var xPos=xItem.position;
      
      
      
      AComp["state"]["cameradrag"]=true;
   }
   
   this.MouseUp=function(AComp){
      AComp["state"]["cameradrag"]=false;
   }
   
  
   this.MouseMove=function(AComp,AEvent){ 
    
      if(!AComp["state"]["cameradrag"]) {return};
      
      
      var xCamera=AComp["state"]["gl"]["camera"];
      var xMouseOffsetX=(AComp["state"]["mouselastx"]-AEvent.offsetX);
      var xMouseOffsetY=(AComp["state"]["mouselasty"]-AEvent.offsetY);
      var xCanvas=AComp["refs"]["canvas"];
      
      var timeDeltaMove=2;
      
      //console.log(xCamera.orbitRotation[0]);
      //console.log(xCamera.orbitYaw);
      if(AComp["options"]["layout"]=="2d"){
         xCamera.Pan([-(xMouseOffsetX/xCanvas.width)*timeDeltaMove, -(xMouseOffsetY/xCanvas.height)*timeDeltaMove, 0.0]);
      } else {
         
         if(AEvent.button==2){
            xCamera.Pan([-(xMouseOffsetX/xCanvas.width)*timeDeltaMove, -(xMouseOffsetY/xCanvas.height)*timeDeltaMove, 0.0]);
         } else {
            var timeDelta=2;

            xCamera.Rotate(
               [AEvent.offsetX/xCanvas.width-0.5, AEvent.offsetY/xCanvas.height-0.5],
               [AComp["state"]["mouselastx"]/xCanvas.width-0.5, AComp["state"]["mouselasty"]/xCanvas.height-0.5]
            );   
         }
      }

      AComp["state"]["mouselastx"]=AEvent.offsetX;
      AComp["state"]["mouselasty"]=AEvent.offsetY;
   }
   
   //wheel
   this.MouseWheel=function(AComp,e){
      var e = window.event || e; // old IE support
      var delta = Math.max(-8, Math.min(8, (e.wheelDelta || -e.detail)));
      var xCamera=AComp["state"]["gl"]["camera"];
      xCamera.Zoom(delta);
   }
   
   this.KeyDown=function(AComp,AEvent){
      var xGL=AComp["state"]["gl"];    
      if(AComp["options"]["layout"]=="2d"){
           switch(AEvent.keyCode){
            case 37:
               //webgl.TranslateCamera(xGL,{x:1});
            break;
         
            case 39:
               //webgl.TranslateCamera(xGL,{x:-1});
            break;              
            
            case 38:
              //webgl.TranslateCamera(xGL,{y:-1});    
            break;
            
            case 40:
               //webgl.TranslateCamera(xGL,{y:1});
            break;
         };               
      } else {   
         switch(AEvent.keyCode){
            case 37:
               if(AEvent.shiftKey) {

               }else{
               }
            break;
         
            case 39:
               if(AEvent.shiftKey) {
               } else{
               }   
            break;              
            
            case 38:
               if(AEvent.shiftKey) {
               } else{
                  AComp["state"]["cameray"]-=1;
               }   
    
            break;
            
            case 40:
               if(AEvent.shiftKey) {
               } else{
               }   
            break;
         };
      }      
   }
   
   var templateengine=new TemplateEngine();//temp code
   this.Template=templateengine.Compile(
      '<canvas ref="canvas" width="1900px" height="800px" style="position:absolute;"></canvas>'+
      '<div style="position:absolute;color:white;padding:5px;">'+
//         '<a href="index2d.html" ref=button2d"> 2d mode </a>'+
//         '<a href="index.html"   ref=button3d"> 3d mode </a>'+         
      '</div>'
   );
   
   
   this.Create=function(AComp){
      var AComp=document.createElement('div');
      AComp.style.position="absolute";
      
      this.Template(AComp,{});
      
      AComp["options"]=this.Options;
      
      //AComp["state"]["context"]=AComp["refs"]["canvas"].getContext("2d");
      AComp["state"]={
         "zoom":3
      }
      
      this.InitWebGl(AComp);
      
      //AComp["texture"]=webgl.CreateTextTexture( AComp["state"]["gl"], "xxx", 0,0);
      
      /*document.body.addEventListener('keydown',function(e){ 
         this.KeyDown(AComp,e);
      }.bind(this));*/
      
      
      return AComp;
   }
   
   this.ModifyBox=function(){
      AComp.style.width=document.body.clientWidth+"px";
      //console.log(document.body.offsetWidth);
      AComp["refs"]["canvas"].style.width=document.body.clientWidth+"px";
      AComp["refs"]["canvas"].style.height=document.body.clientHeight+"px";
      //webgl.GetCamera(AComp["state"]["gl"]).setAspectRatio(document.body.clientWidth/document.body.clientHeight);
   }
   
}

var graphview=new GraphView();
AComp=graphview.Create();    
graphview.Fill(AComp);

+function animate(){
   requestAnimationFrame( animate );
   //xGraph.RenderCanvas(AComp);   
   graphview.RenderWebGl(AComp);
}()


document.body.appendChild(AComp);
window.addEventListener("resize",graphview.ModifyBox.bind(graphview,AComp));
graphview.ModifyBox(AComp);

document.body.addEventListener('mousedown',function(e){ 
         this.MouseDown(AComp,e);
}.bind(graphview));

      document.body.addEventListener('mousemove',function(e){
         var target = e.target || e.srcElement,
         rect = target.getBoundingClientRect();
         e.offsetX = e.offsetX || e.clientX - rect.left;
         e.offsetY = e.offsetY || e.clientY - rect.top;
        
         this.MouseMove(AComp,e);
      }.bind(graphview));
      
      document.body.addEventListener('mouseup',function(e){
         this.MouseUp(AComp,e);
      }.bind(graphview));
      
      document.body.addEventListener("mousewheel", function(e){
         this.MouseWheel(AComp,e);
      }.bind(graphview), false);
      