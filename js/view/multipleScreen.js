 $(function (){
    var earth = top.LayerManagement.earth;
    var locationHref = window.location.href;
    var typeIndex = locationHref.indexOf("type=");
    var type = locationHref.substr(typeIndex+5,1);
    var bMultiple = false;   // 当前是否是多屏显示状态
    var bSync = false;       // 当前是否联动
     var selectSetFile = null;//设置存储值
    var selectTag = "";
     var obj = {
         selectSet:"" ,
         tag:false
     };
    $("#btnSetup").click(function(){
        obj.selectSet = selectSetFile;
        window.showModalDialog("../view/multipleScreenSetup.html",obj,"dialogWidth=256px;dialogHeight=105px;status=no");
        if(!obj.tag){
            return;
        }
        selectTag = obj.selectSet;
        selectSetFile = obj.selectSet;
    });
    /**
     * 获取图层数据
     * @param layer 图层根节点
     * @param bWithIcon 是否需要图标
     * @return 图层数据数组
     */
    var getLayerData = function (layer,bWithIcon) {
        if( !layer ){
            layer = earth.LayerManager.LayerList;
        }
        var layerData = [];
        var childCount = layer.GetChildCount();
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            var name = _enName2cnName(childLayer.Name);

            if(childLayer.LayerType.toLowerCase() == "map"){
                childLayer.Visibility = false;
            }
            var data = {
                "id":childLayer.Guid,
                "name":name,
                "checked":childLayer.Visibility
            };
            if(childLayer.LayerType === "Project"){
                //STAMP_config.spatial.push({id:childLayer.Guid,name:name});
            }
            if(bWithIcon){
                data["icon"] = _getLayerIcon(childLayer.LayerType);
            }
            if (childLayer.GetChildCount() > 0) {
                data.children = getLayerData(childLayer, true);
            }
            if(name!="buffer"&&name!="room"){
                layerData.push(data);
            }
        }
        return layerData;
    };
    /**
     * 将管线子图层中的英文名标识改为中文标识
     * @param name
     * @return {*}
     */
    var _enName2cnName = function (name) {
        var map = {
            "equipment":"附属设施",
            "container":"管线",
            "well":"井",
            "joint":"附属点",
            "plate":"井盖",
            "room": "井室",
            //free add 2014年8月11日17:09:35 
            "container_og":"地上管线",
            "joint":"特征",
            "joint_og":"地上特征"
        };
        if(map[name]){
            name = map[name];
        }
        return name;
    };
    /**
     * 功能：根据图层类型，获取图标样式
     * 参数：layerType-图层类型
     * 返回值：图标样式
     */
    function _getLayerIcon (layerType) {
        var icon = "../../images/layer/";
        if (layerType === "POI") {
            icon += 'layer_poi.gif';
        } else if (layerType === "Vector") {
            icon += 'layer_vector.gif';
        } else if (layerType === "Model") {
            icon += 'layer_model.png';
        } else if (layerType === "Block") {
            icon += 'layer_block.gif';
        } else if (layerType === "MatchModel") {
            icon += 'layer_matchmodel.gif';
        } else if (layerType === "Billboard") {
            icon += 'layer_billboard.gif';
        } else if (layerType === "Annotation") {
            icon += 'layer_annotation.gif';
        } else if (layerType === "Equipment") {
            icon += 'layer_equipment.png';
        } else if (layerType === "Container") {
            icon += 'layer_container2.png';
        } else if (layerType === "Well") {
            icon += 'layer_well.png';
        } else if (layerType === "Joint") {
            icon += 'layer_joint2.png';
        } else if (layerType === "Plate") {
            icon += 'layer_plate.png';
        } else if (layerType === "Pipeline") {
            icon += 'layer_pipeline.png';
        } else if (layerType === "Project") {
            icon += 'projectIcon.png';
        } else if (layerType === "Powerline") {
            icon += 'layer_powerline.gif';
        } else if (layerType === "Line") {
            icon += 'layer_line.gif';
        } else if (layerType === "Tower") {
            icon += 'layer_tower.gif';
        }else if(layerType === 'Folder'){
            icon += 'folder.png';
        }else if(layerType === "Container_Og"){
            icon +='Container_Og.png';
        }else if(layerType === "Joint_Og"){
            icon +='Joint_Og.png';
        }else{
            icon += "default.png";
        }
        return icon;
    }
    /**
     * 定位到经纬度范围
     */
    var flyToLayer = function (layer,earthObj) {
        var lonLatRect = layer.LonLatRect;
        var centerX = (lonLatRect.East + lonLatRect.West) / 2;
        var centerY = (lonLatRect.North + lonLatRect.South) / 2;
        var width = (parseFloat(lonLatRect.North) - parseFloat(lonLatRect.South)) / 2;
        var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
        earthObj.GlobeObserver.FlytoLookat(centerX, centerY, 0, 0, 90, 0, range, 4);
    };
    /**
     * 创建图层树
     * @param treeId 图层树ul元素的ID，含#井号
     * @param earth
     */
    var earthTag = 0;
    function createLayerTree(treeId, earthObj){
        var zNodes = getLayerData(earthObj.LayerManager.LayerList, false);
        var setting = {
            check:{
                enable:true, //是否显示checkbox或radio
                chkStyle:"checkbox" //显示类型,可设置(checbox,radio)
            },
            view:{
                dblClickExpand:false, //双击节点时，是否自动展开父节点的标识
                expandSpeed:"", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
                selectedMulti:false //设置是否允许同时选中多个节点
            },
            callback:{
                onDblClick:function (event, treeId, node) {
                    if(node && node.id){
                        if (bSync) {
                            top.setFocus(earthTag)();
                        }
                        var layer = earthObj.LayerManager.GetLayerByGUID(node.id);
                        if (layer) {
                            if (bSync) {
                                top.setLock(4);
                            }
                            flyToLayer(layer,earthObj); //定位图层
                        }
                    }
                },
                onCheck: function(event, treeId, node) {
                    var layer = earthObj.LayerManager.GetLayerByGUID(node.id);
                    layer.Visibility = node.checked;
                }
            }
        };

        $.fn.zTree.init($(treeId), setting, zNodes);
    }
    createLayerTree("#layerTree", earth);
    var divHeight = $("#tablediv").height() - $(".cardTitle").height();
    $("#dgDiv").height(divHeight);
    $("#layerTree").height($("#dgDiv").height() - $("#dgDivHeader").height() - 20);
    $("#layerTree").mCustomScrollbar();

    $("#rdoLeft").click(function (){
        $("#rdoRight").removeAttr("checked");
        $("#rdoLeft").attr("checked","checked");
        earthTag = 0;
        createLayerTree("#layerTree", top.LayerManagement.earthArray[0]);
    });
    $("#rdoRight").click(function (){
        $("#rdoLeft").removeAttr("checked");
        $("#rdoRight").attr("checked","checked");
        earthTag = 1;
        createLayerTree("#layerTree", top.LayerManagement.earthArray[1]);
    });
    $("#btnCompare").click(function (){
        if(bMultiple){
            top.LayerManagement.showHistorySlider(false, true, true);
            $(this).text("双屏显示");
            top.setScreen(1,"");   // 恢复到一屏
            bMultiple = false;
            bSync = false;
            top.setSync(bSync);
            $("#btnSync").text("联动").attr("disabled", "disabled");
            $("#rdoRight").attr("disable", "disabled"); //btnSetup
            $("#btnSetup").removeAttr("disabled"); //
            $("#rdoRight").removeAttr("checked");
            $("#rdoLeft").attr("checked","checked");
            createLayerTree("#layerTree", top.LayerManagement.earthArray[0]);  // 恢复为默认球的图层树

            setAlphaSync(false);
        }else{
            $(this).text("单屏显示");
            bMultiple = true;
            $("#btnSync").text("联动").removeAttr("disabled");
            $("#btnIndexCompare").removeAttr("disabled");
            top.setScreen(2,selectTag,false,function(){
                if (type == 2) {
                    top.LayerManagement.showHistorySlider(true);
                }
            });
            top.setSync(false);
            $("#rdoRight").removeAttr("disabled");
            $("#btnSetup").attr("disabled", "disabled");
            setAlphaSync(true);
        }
    });
    $("#btnSync").click(function() {
        bSync = !bSync;
        top.bSync = bSync;
        top.setSync(bSync);
        $(this).text(bSync ? "取消联动" : "联动");
    });

    function setAlphaSync(isMulti){
        top.isMultiScreen_2 = isMulti;
        if(isMulti){
            if(top.LayerManagement.earthArray[1]){
                top.LayerManagement.earthArray[1].Environment.TerrainTransparency = top.LayerManagement.earthArray[0].Environment.TerrainTransparency;
            }
        }
    }

    $(window).unload(function (){
        top.setScreen(1,"");
        top.bSync = false;
        if(type == 2){
            if(!($(parent.document).find("#historyData").hasClass("selected"))){
                top.LayerManagement.showHistorySlider(false);
            }
        }
    });
});