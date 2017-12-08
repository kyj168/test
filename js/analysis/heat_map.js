var earth,analysis;
function validation(){
    var filePath = $("#filePath").val();
    if(!filePath){
        alert("请选取文件");
        return false;
    }
    var radius = $("#radius").val();
    if(isNaN(parseFloat(radius))){
        alert("请输入正确的半径值");
        return false;
    }
    var density = $("#density").val();
    if(isNaN(parseFloat(density))){
        alert("请输入正确的密度值");
        return false;
    }
    var altitude = $("#altitude").val();
    if(isNaN(parseFloat(altitude))){
        alert("请输入正确的海拔值");
        return false;
    }
    return true;
}
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
    //document.getElementById("fillColor").value = sColor;
    $('#'+id).val(sColor);
    var fillColorSel = "fillColorSel" + id.substring(9,id.length);
    document.getElementById(fillColorSel).style.background = sColor;
    sInitColor = sColor;
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
    analysis = STAMP.Analysis(earth);
}
$(function(){
    $("#btnSet").click(function(){
        analysis.clear();
        var checkLegal = validation();
        if(!checkLegal){
            return;
        }
        var terrainCheck = $("#terrain").val();
        terrainCheck = terrainCheck?true:false;
        analysis.createHeatMap($("#filePath").val(),
                               parseFloat($("#radius").val()),
                               parseFloat($("#density").val()),
                               parseFloat($("#altitude").val()),
                               terrainCheck,"slopeTable");

    });
    $("#fileButton").click(function(){
        getFilePath("filePath");
    });
    $("#getAltBtn").click(function(){
        document.getElementById("getAltBtn").style.cursor = "crosshair";
        analysis.getAltitude(function(val){
            $("#altitude").val(val);});
        earth.Event.OnLBUp = function(p) {
            document.getElementById("getAltBtn").style.cursor ="auto";
            earth.Event.OnLBUp = function() {};
        };
    })
    $('#sectionBtn').on('click', function(e) {
        var gradeSection = $('#gradeSection').val();
        debugger;
        var secAngle = (1/(gradeSection-1)).toFixed(2);
        $("#slopeTable tr:not(:first)").empty();
        for(var i = 0;i<gradeSection;i++){ 
            var trHTML = "<tr><td>"+i*secAngle+"</td><td><input type='text' id='fillColor"+i+"' value='#00ff00' class='colorInput' readonly/><input type='button' id='fillColorSel"+i+"' class='colorBtn' style='background-color:#00ff00' class='button' value='' onClick='fillColorDlg("+'"fillColor'+i+'")'+"' /></td></tr>";
            $("#slopeTable").append(trHTML);
        }
    });
    window.onunload = function(){
        analysis.clear();
    }
    $("#clear").click(function(){
        analysis.clear();
    })
})