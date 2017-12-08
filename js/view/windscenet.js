var earth;
$(function() {
    var divHeight = $(parent.document).height() - 435;
    $("#dgDiv").height(divHeight);
    $("#dgDiv").mCustomScrollbar({});
    earth = parent.earth;
    var analysis = STAMP.Analysis(earth);
    var wind = [];
    $("#select").click(function(){
        var path = earth.UserDocument.OpenFilePathDialog("", "");
        if(!path){
            return;
        }
        $("#path").val(path);
        
        var nCount = 0;
        nCount = analysis.GetWindSceneLayersCount($("#path").val());
        var fSubName = new Array();
        for(var i = 0; i < nCount; i++)
        {
        	fSubName[i] = 0;
        }
        analysis.GetWindSceneLayers($("#path").val(),fSubName, nCount);
        fSubName.sort(sortNumber);
        var rootNodes = [];
        var dataRoot = {
            "id": earth.Factory.CreateGuid(),
            "name": path.substr(path.lastIndexOf("\\")+1,path.length),
            "value":"0",
            "checked":true
        };
        var nodes = [];
        for(var i = 0;i<fSubName.length;i++){
            var data = {
                "id": earth.Factory.CreateGuid(),
                "name": "第"+fSubName[i]+"层",
                "value":fSubName[i],
                "checked":true
            };
            wind.push(parseInt(fSubName[i]))
            nodes.push(data);

            /*var fChild = fso.GetFolder($("#path").val()+"\\"+fSubName[i]);
            if(fChild){
                var fkChild = new Enumerator(fChild.SubFolders);
                var fChildSubName = [];
                for (; !fkChild.atEnd(); fkChild.moveNext()){
                    fChildSubName.push(fkChild.item().Name);
                }
                fChildSubName.sort(sortNumber);
                var childNodes = []
                for(var j = 0;j<fChildSubName.length;j++){
                    var childData = {
                        "id": earth.Factory.CreateGuid(),
                        "name": fChildSubName[j]
                    };
                    childNodes.push(childData);
                }
                data.children = childNodes;
            }*/
        }
        dataRoot.children = nodes;
        rootNodes.push(dataRoot);
        initTree(rootNodes);
        if(wind.length>0){
            $("#btnStartAnalysis").attr("disabled",false);
            $("#btnSelect").attr("disabled",false);
        }
        if(wind.length>0){
           analysis.windScene($("#path").val(),wind, 0, 0);
        }
    });

    $("#btnStartAnalysis").click(function(){
        var lonOffset = $("#lonOffset").val();
        var latOffset = $("#latOffset").val();
        var windSpeed = $("#windSpeed").val();
        var LZMD = $("#LZMD").val();
        var LZDX = $("#LZDX").val();
        if(lonOffset == "" || isNaN(lonOffset)){
            lonOffset = 0;
        }
        if(latOffset == "" || isNaN(latOffset)){
            latOffset = 0;
        }
        if(wind.length>0){
            analysis.windScene($("#path").val(),wind,lonOffset,latOffset);
        }
        setTimeout(function(){
            if(windSpeed != "" && !isNaN(windSpeed)){
                earth.Measure.SetWindSceneVelocityBoost(windSpeed);
            }
            if(LZMD != "" && !isNaN(LZMD)){
                earth.Measure.SetWindSceneDensity(LZMD);
            }
            if(LZDX != "" && !isNaN(LZDX)){
                earth.Measure.SetWindSceneSize(LZDX);
            }
        }, 100);
    });
    $("#btnSelect").click(function(){	
    	    GeneralQuery.propertyQueryWindScen();	
    });
    /*
    $("#btnCameraDistance").click(function(){
    	analysis.SetWindScenCameraDistance(parseFloat($("#CameraDistance").val()));
    });
    
    $("#btnVisibleRange").click(function(){
    	analysis.SetWindScenVisibleRange(parseFloat($("#VisibleRange").val()));
    });
    */ 
    function sortNumber(a,b){
        return a - b;
    }
    /*$("#btnStartAnalysis").click(function (){
        var obj=document.getElementsByName('windSceneLayer'); //选择所有name="'test'"的对象，返回数组
        //取到对象数组后，我们来循环检测它是不是被选中
        var s=[];
        for(var i=0; i<obj.length; i++){
            if(obj[i].checked){
                s.push(parseInt(obj[i].value));
            } //如果选中，将value添加到变量s中
        }
        if(""!=$("#path").val()&& s.length>0){
            analysis.windScene($("#path").val(),s);
        }
        else{
            alert("风场层级没有选择！");
        }
    });*/
    window.onbeforeunload = function(){
        analysis.clear();
    };
    function initTree(nodes) {
        var zNodes = nodes;
        var setting = {
            check: {
                enable: true,
                //是否显示checkbox或radio
                chkStyle: "checkbox" //显示类型,可设置(checbox,radio)
            },
            view: {
                dblClickExpand: false,
                //双击节点时，是否自动展开父节点的标识
                expandSpeed: "",
                //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
                selectedMulti: false //设置是否允许同时选中多个节点
            },
            callback: {
                onClick: function(event, treeId, node) {

                },
                onDblClick: function(event, treeId, node) {
                    if (node && node.id) {
                        if(node.level==0){
                            analysis.windScene($("#path").val(),wind);
                        }
                        else{
                            earth.Measure.SelectWindSceneLayer(parseInt(node.value));
                        }
                    }
                },
                onCheck: function(event, treeId, node)
                {
                   if (node && node.id) 
                   {
                    	 if(node.level==0)
                    	 {
                          for(var i =0;i<node.children.length;i++)
                          {
                             earth.Measure.SetWindSceneLayerVisible(parseInt(node.children[i].value),node.checked);
                          }
                       }
                       else
                       {
                          earth.Measure.SetWindSceneLayerVisible(parseInt(node.value),node.checked);
                       }
                    }
                }
            }
        };
        $.fn.zTree.init($("#windSceneTree"), setting, zNodes);
    }
})