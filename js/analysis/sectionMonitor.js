
var earth = null;
var demArr = [];
var legalDemArr = [];
var thisProject = null;



$(function(){
    $("#project").change(function(){
        initDemList();
    });
    $("#btnStart").click(function(){
        var resultObj = [];
        var maxHeight = null;
        var minHeight = null;
        var checkLen = $("#demList input:checkbox[checked=checked]").length;
        if(checkLen < 1){
            alert("请至少选择1个dem图层");
            return;
        }
        
        clear();
        earth.Event.OnAnalysisFinished = function (res) {
            var resultXml = res.BriefDescription;
            if(!resultXml){
                alert("服务返回值为空");
                return;
            }
            var resultJson = $.xml2json(resultXml);
            if(!resultJson){
                return;
            }
            var layer = resultJson.layer
            if(!layer){
                return;
            }
            if(!layer.length){
                layer = [layer];
            }
            var seriesList = [];
            for(var i=0; i<layer.length; i++){
                var layerGuid = layer[i].guid;
                for(var z=0; z<thisProject.dem.length; z++){
                    var thisDem = thisProject.dem[z];
                    if(layerGuid == thisDem.id){
                        var layerName = thisDem.name;
                        break;
                    }
                }
                var layerMaxHeight = layer[i].max_height;
                var layerMinHeight = layer[i].min_height;
                var layerPointNum = layer[i].point_number;
                var pointArr = layer[i].point_array;
                pointArr = pointArr.split(",")
                var layerPointArr = [];
                var layerHeightArr = [];
                for(var j=0; j<layerPointNum; j++){
                    var thisPoint = [pointArr[j*4],pointArr[j*4+1],pointArr[j*4+2]];
                    var thisPointHeight = pointArr[j*4+2];
                    layerPointArr.push(thisPoint);
                    layerHeightArr.push(thisPointHeight);
                }
                if(!maxHeight){
                    maxHeight = layerMaxHeight;
                }else{
                    layerMaxHeight>maxHeight?maxHeight=layerMaxHeight:maxHeight;
                }
                if(!minHeight){
                    minHeight = layerMinHeight;
                }else{
                    layerMinHeight < minHeight?minHeight = layerMinHeight:minHeight;
                }
                var thisObj = {
                    guid:layerGuid,
                    name:layerName,
                    max:layerMaxHeight,
                    min:layerMinHeight,
                    pointArr:layerPointArr,
                    heightArr:layerHeightArr
                }
                resultObj.push(thisObj);
                var thisData = {
                    name:layerName,
                    data:layerHeightArr
                }
                seriesList.push(thisData);

            }
            documentObj.showSectionMonitor(seriesList,minHeight,maxHeight,resultObj);
            
        };
        earth.Event.OnCreateGeometry = function(p,cType){
            if(p.Count < 2){
                alert("请至少画两个点");
                return;
            }
            var guidStr = "";
            $("#demList input:checkbox[checked=checked]").each(function (i, v) {
                var len = $("#demList input:checkbox[checked=checked]").length;
                if(i==len-1){
                    guidStr += $(v).val();
                }else{
                    guidStr += $(v).val()+",";
                }
            });
            var geoPoints = earth.Factory.CreateGeoPoints();
            for(var i=0; i<p.Count; i++){
                var thisVec = p.Items(i);
                geoPoints.Add(thisVec.X,thisVec.Y,thisVec.Z)
            }
            var space = $("#space").val();
            earth.Analysis.ProfilePoints(1,space, geoPoints,guidStr)
            
        }
        earth.ShapeCreator.CreatePolyline(0, 0xcc111111)
    });
    window.onunload = function(){
        clear();
    }
    $("#clear").click(function(){
        clear();
        if(earth.htmlBallon){
            earth.htmlBallon.DestroyObject();
            earth.htmlBallon = null;
        }
    });
    $("#scrollParamDiv").mCustomScrollbar({});
})
function initProject(demArr){
    var legalIdArr = [];
    for(var i=0; i<demArr.length; i++){
        if(demArr[i].dem.length > 1){
            var thisPid = demArr[i].id;
            if($.inArray(thisPid,legalIdArr) < 0){
                legalDemArr.push(demArr[i]);
                var str = "<option value='"+demArr[i].id +"'>"
                str += demArr[i].name + "</option>";
                $(str).appendTo("#project");
            }
        }
    }
}
function getThisDem(){
    var thisProjectId = $("#project").val();
    if(!thisProjectId){
        alert("没有符合要求的工程");
        $("#btnStart").attr("disabled",true);
        return;
    }
    for(var i=0; i<legalDemArr.length; i++){
        if(legalDemArr[i].id == thisProjectId){
            thisProject = legalDemArr[i];
            break;
        }
    }
}
function initDemList(){
    getThisDem();
    var str = "";
    for(var i = 0; i<thisProject.dem.length; i++){
        var thisDemLayer = thisProject.dem[i];
        str += "<div><input type='checkbox' demName ='"+thisDemLayer.name+"' id='demLayer"+i+"' value='" + thisDemLayer.id +"'>";
        str += "<label for='demLayer"+i+"'>"+thisDemLayer.name+"</label><div>"
    }
    $(str).appendTo("#demList");
}
function getEarth(earthObj){
    earth = earthObj;
    documentObj = earth.ifEarth;
    demArr = earth.demArr;
    var projectId = earth.projectId;
    initProject(demArr);
    initDemList();
}


function clear(){
    earth.ShapeCreator.Clear();
    documentObj.hideProfile()
}