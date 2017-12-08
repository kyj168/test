
var earth = null;
var demArr = [];
var legalDemArr = [];
var thisProject = null;
$(function(){
    $("#project").change(function(){
        initBeforSlide();
        initAfterSlide();
    });
    $("#beforSlide").change(function(){
        var beforDem = $("#beforSlide").val();
        var afterDem = $("#afterSlide").val();
        if(beforDem == afterDem){
            var beforIndex =  $('option:selected', '#beforSlide').index();
            initAfterSlide(beforIndex);
        }else{
            return;
        }
    });
    $("#afterSlide").change(function(){
        var beforDem = $("#beforSlide").val();
        var afterDem = $("#afterSlide").val();
        if(beforDem == afterDem){
            var afterIndex =  $('option:selected', '#afterSlide').index();
            initAfterSlide(afterIndex);
        }else{
            return;
        }
    });
    $("#btnStart").click(function(){
        earth.Event.OnAnalysisFinished = function (fillVolume,fillArea,slideVolume,slideArea) {
            if(fillVolume){
                $("#fillVolume").val(fillVolume.toFixed(2));
            }
            if(fillArea){
                $("#fillArea").val(fillArea.toFixed(2));
            }
            if(slideVolume){
                $("#slideVolume").val(slideVolume.toFixed(2));
            }
            if(slideArea){
                $("#slideArea").val(slideArea.toFixed(2));
            }
        };
        earth.Event.OnCreateGeometry = function(p,cType){
            if(p.Count < 3){
                alert("请至少画三个点");
                return
            }
            var beforDem = $("#beforSlide").val();
            var afterDem = $("#afterSlide").val();
            earth.Analysis.ComparedLandSlide(p,beforDem,afterDem);
        }
        earth.ShapeCreator.CreatePolygon();
    });
    window.onunload = function(){
        earth.ShapeCreator.Clear();
    }
    $("#clear").click(function(){
        earth.ShapeCreator.Clear();
        if(earth.htmlBallon){
            earth.htmlBallon.DestroyObject();
            earth.htmlBallon = null;
        }
    });
})
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
function initProject(demArr){
    var legalIdArr = [];
    for(var i=0; i<demArr.length; i++){
        if(demArr[i].dem.length > 1){
            var thisPid = demArr[i].id;
            if($.inArray(thisPid,legalIdArr) < 0){
                legalIdArr.push(thisPid);
                legalDemArr.push(demArr[i]);
                var str = "<option value='"+demArr[i].id +"'>"
                str += demArr[i].name + "</option>";
                $(str).appendTo("#project");
            }
        }
    }
}
function initSlideDem(){
    getThisDem();
    var str = "";
    for(var i = 0; i<thisProject.dem.length; i++){
        var thisDemLayer = thisProject.dem[i];
        str += "<option value='" + thisDemLayer.id +"'>";
        str += thisDemLayer.name + "</option>"
    }
    return str;
}
function initAfterSlide(index){
    var optionStr = initSlideDem();
    $(optionStr).appendTo("#afterSlide");
    if(index){
        var thisDemLayer = thisProject.dem.length;
        if(index == (thisDemLayer-1)){
            $("#afterSlide").get(0).selectedIndex = 0;
        }else{
            $("#afterSlide").get(0).selectedIndex = index + 1;
        }
    }else{
        $("#afterSlide").get(0).selectedIndex = 1;
    }
}
function initBeforSlide(index){
    var optionStr = initSlideDem();
    $(optionStr).appendTo("#beforSlide");
    if(index){
        if(index == 0 ){
           $("#beforSlide").get(0).selectedIndex = 1; 
       }else{
            $("#beforSlide").get(0).selectedIndex = index - 1;
       }
    }else{
        $("#beforSlide").get(0).selectedIndex = 0;
    }
}
function getEarth(earthObj){
    earth = earthObj;
    demArr = earth.demArr;
    var projectId = earth.projectId;
    initProject(demArr);
    initBeforSlide();
    initAfterSlide();
}