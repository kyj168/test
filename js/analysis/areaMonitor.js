
var earth = null;
var demArr = [];
var legalDemArr = [];
var thisProject = null;
var diffPolygon = null;
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
        clear();
        earth.Event.OnCreateGeometry = function(p,cType){
            if(p.Count < 3){
                alert("请至少画三个点");
                return
            }
            var strGuid1 = $("#beforSlide").val();
            var strGuid2 = $("#afterSlide").val();
            var guid = earth.Factory.CreateGuid();
            diffPolygon = earth.Factory.CreateElementHeightDiffPolygon (guid,"diffPolygon",params.ip,strGuid1,strGuid2)
            diffPolygon.BeginUpdate(); 
            diffPolygon.SetExteriorRing(p); 
            diffPolygon.AltitudeType = 1; 
            diffPolygon.AddGrade(-20, parseInt("0x00ffff")); 
            diffPolygon.AddGrade(-25, parseInt("0x00ff00")); 
            diffPolygon.AddGrade(-30, parseInt("0xffff00")); 
            diffPolygon.AddGrade(-35, parseInt("0xff0000")); 
            diffPolygon.AddGrade(0, parseInt("0x0000ff")); 
            diffPolygon.AddGrade(20, parseInt("0x0000ff")); 
            diffPolygon.AddGrade(25, parseInt("0x00ffff")); 
            diffPolygon.AddGrade(30, parseInt("0x00ff00")); 
            diffPolygon.AddGrade(35, parseInt("0xffff00")); 
            diffPolygon.AddGrade(40, parseInt("0xff0000")); 
            diffPolygon.EndUpdate();  
            earth.AttachObject(diffPolygon);
            
        }
        earth.ShapeCreator.CreatePolygon();
        
    });
    $("#clear").click(function(){
        clear();
        if(earth.htmlBallon){
            earth.htmlBallon.DestroyObject();
            earth.htmlBallon = null;
        }
    });
    window.onunload = function(){
        clear();
    }
})
function getThisDem(){
    var thisProjectId = $("#project").val();
    if(!thisProjectId){
        alert("没有符合要求的工程");
        $("#btnStart").attr("disabled",true);
        $("#btnAll").attr("disabled",true);
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
function clear(){
    if(diffPolygon){
        earth.DetachObject(diffPolygon);
    }
    earth.ShapeCreator.Clear();
}