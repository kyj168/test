var earth,analysis;
function fillColorDlg(id){
    var sColor = null;
    sInitColor = $('#'+id).val();
    if (sInitColor == null) {
        sColor = dlgHelper.ChooseColorDlg();
    } else {
        sColor = dlgHelper.ChooseColorDlg(sInitColor);
    }
    sColor = sColor.toString(16);
    if (sColor.length < 6) {
        var sTempString = "00000000".substring(0,6-sColor.length);
        sColor = sTempString.concat(sColor);
    }
    sColor = "#" + sColor;
    $('#'+id).val(sColor);
    var fillColorSel = id + "Choose";
    $("#"+fillColorSel).css("backgroundColor",sColor);
    $("#"+id).val(sColor);
}
function validation(){
    var pumpFilePath = $("#pumpFilePath").val();
    if(!pumpFilePath){
        alert("请选择抽水井文件");
        return false;
    }
    var checkFilePath = $("#checkFilePath").val();
    if(!checkFilePath){
        alert("请选择测水井文件");
        return false;
    }
    return true;
}
function getFilePath(id){
    var filePath =  earth.UserDocument.OpenFileDialog(earth.RootPath, "txt文件(*.txt)|*.txt");
    if (filePath == ""){
        return;
    }
    $("#"+id).attr("value", filePath);
}
    
function getEarth(earthObj){
    earth = earthObj;
    analysis = earth.analysisObj; 
}
$(function(){
    $("#btnSet").click(function(){ 
        var checkLegal = validation();
        if(!checkLegal){
            return;
        }
        var upColor = $("#upColor").val();
        upColor = upColor.substr(1,6);
        upColor = "0x50" + upColor;
        var sideColor = $("#sideColor").val();
        sideColor = sideColor.substr(1,6);
        sideColor = "0xdd" + sideColor;
        analysis.createUndergroundWater($("#pumpFilePath").val(),
                               $("#pumpFilePath").val(),
                               parseInt(upColor),
                               parseInt(sideColor));
    });
    $("#checkFile").click(function(){
        getFilePath("checkFilePath");  
    });
    $("#pumpFile").click(function(){
        getFilePath("pumpFilePath");
    })
    window.onunload = function(){
        if(undergroundWaterObj){
            earth.DestroyObject(undergroundWaterObj);
        }
    }
})