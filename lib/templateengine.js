function TemplateEngine() {   
   this.name="uicomp";  

   this.Compile=function(xTemplate){
      var xMe=this;
      var xTemp=document.createElement("div");
      xTemp.innerHTML=xTemplate;
      var xChilds=xTemp.childNodes;
      
      var xResult="var xRenderingData={virtualdom:[]};\n";
      xResult+="this.InitCreate(xRenderingData);";
      xResult+="with(AData){\n"
      
      for(var xI=0;xI<xChilds.length;xI++){       
         xResult=xResult+this.CompileNode(xChilds[xI]);
      }
      
      xResult+="};\n";
      xResult+="AComp.innerHTML=this.RenderToHTML(xRenderingData);";
     
      var xFn=(new Function("AComp","AData","AContext", xResult )).bind(this)
      return function(AComp,AData,AContext){
         xFn(AComp,AData,AContext);
         xMe.UpdateRefs(AComp)
      };
   };
     
   this.UpdateRefs=function(AComp,ATarget){
      ATarget=ATarget||AComp;
      AComp["refs"]=AComp["refs"]||{};
      
      if((ATarget.hasAttribute)&&(ATarget.hasAttribute("ref"))){
         AComp["refs"][ATarget.getAttribute("ref")]=ATarget;
      }
      
      if(!ATarget.childNodes){return};
      for(var xI=0;xI<ATarget.childNodes.length;xI++){
         this.UpdateRefs(AComp,ATarget.childNodes[xI])
      }      
   }
   
    
   this.CompileNode=function(xNode){
      //это текстовая нода
      if(xNode.nodeType==3){
         if(xNode.textContent.split("<%=").length>1){
            var xName=xNode.textContent.split("<%=")[1].split("%>")[0];
            return "this.TextNode(xRenderingData,"+xName+");\n";
         } else if(xNode.textContent.split("<%").length>1){
            return  this.CompileCodeLine(xNode);
         } else {         
            return "this.TextNode(xRenderingData,'"+xNode.textContent.replace("\n","")+"');\n";
         }
      }
      
      //подготовим ноду
      var xResult="this.BeginNode(xRenderingData,'"+xNode.tagName+"',{\n";  
      
      if(xNode.attributes){
         for (var i=0;i<xNode.attributes.length;i++){
            var xAttribute=xNode.attributes[i];
            xResult+="'"+xAttribute.name+"':"+this.CompileAttribute(xAttribute.value);
            if(i<xNode.attributes.length-1) xResult+=","
         }
      }
      xResult+="});\n";  
      
      var xChilds=xNode.childNodes;
      
      //подготовим детей
      for(var xI=0;xI<xChilds.length;xI++){
         xResult+=this.CompileNode(xChilds[xI]); 
         xResult+="\n";           
      }
      
      xResult+="this.EndNode(xRenderingData);\n";     
      return xResult;
   }
   
   this.CompileCodeLine=function(ACode){
      var xConts=ACode.textContent.split("<%");
      var xResult="";
      
      for (var xI=0;xI<xConts.length;xI++){
         var xRes=xConts[xI].split("%>");
         xResult=xResult+xRes[0].replace("this.","AContext");
         if(xRes[1]){
            xResult=xResult+"this.TextNode(xRenderingData,"+xRes[1]+");\n";
         };
      }     
      return xResult;
   }
   
   //
   this.CompileAttribute=function(ACode){
      var xResult="";
      var xBlocks=ACode.split("%>");
                  
      xBlocks.forEach(function(xItem,xCount){
         var xCmd=xItem.split("<%=");
         
         xResult+="'"+xCmd[0]+"'";
         
         if(xCmd.length>1){
            xResult+="+("+xCmd[1]+")";
         }
         
         if(xCount<xBlocks.length-1){xResult+="+"};                         
      })
      
      //console.log(xResult);
      return xResult;
   }
   
   
   
   //================= Create vitual doom tree ===============================//
   this.InitCreate=function( ARenderData){
      ARenderData["stack"]=[{
         "tagname":"root",
         "childs":[],
         "isroot":true
      }];
   }  
   
   this.BeginNode=function(ARenderData,ATagName,AAttributes){
      var xItem={
         "tagname":ATagName,
         "childs":[],
         "attributes":{},
         "nodetype":1
      };
      
      ARenderData["stack"].push(xItem);    
      
      for(xKey in AAttributes){
         xItem["attributes"][xKey]=AAttributes[xKey];
      } 
   }
   
   this.EndNode=function(ARenderData){
      var xItem=ARenderData["stack"].pop();
      ARenderData["stack"][ARenderData["stack"].length-1]["childs"].push(xItem);    
   }
   
   this.TextNode=function(ARenderData,xText){
      ARenderData["stack"][ARenderData["stack"].length-1]["childs"].push({
         "nodetype":3,
         "tagname":"text",
         "text":xText
      });
   }
   
   //=========================== Create Real DOM =============================//
   
   this.RenderToHTML=function(ARenderData){
      return this.RenderNode(ARenderData["stack"][0]);
   }
   
   this.RenderNode=function(ANode){  
      var xResult="";
      
      if(!ANode["isroot"]){
         xResult+="<"+ANode["tagname"];
         for(xKey in ANode["attributes"]){
            xResult+=" "+xKey+"='"+ANode["attributes"][xKey]+"'";
         }     
         xResult+=">";
      }
      
      for(var xI=0;xI<ANode["childs"].length;xI++){
         var xItem=ANode["childs"][xI];
         xResult+=(xItem["nodetype"]==3)?xItem["text"]:this.RenderNode(xItem);
      }
      
      if(!ANode["isroot"]){
         xResult+="</"+ANode["tagname"]+">";
      };   
      
      return xResult;
   }
}

config["classes"]["templateengine"]={
   "templateengine":"TemplateEngine"
};