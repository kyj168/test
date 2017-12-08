var earth,analysis,htmlBalloon;
function getEarth(earthObj){
    earth = earthObj;
    analysis = STAMP.Analysis(earth);
    htmlBalloon = earth.htmlBallon;
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
    $('#'+id).val(sColor);
    var fillColorSel = id + "Choose";
    $("#"+fillColorSel).css("backgroundColor",sColor);
    $("#"+id).val(sColor);
}
//容错判断
function check(path, reference){

    var pathStr = path.split(".");
    var type = pathStr[pathStr.length - 1];
    if (type != "dwg" && type != "dxf" && type != "shp"){
        alert("矢量文件格式不正确,请重新选择文件!");
        return false;
    }

    var referenceStr = reference.split(".");
    var referencetype = referenceStr[referenceStr.length - 1];
    if (referencetype != "spatial"){
        alert("空间参考文件格式不正确,请重新选择文件!");
        return false;
    }

    if (path === "" || path === undefined || reference === "" || reference === undefined) {
        alert("请选择文件与投影文件!");
        return false;
    }

    return true;
}

$(function(){
    $("#clear").click(function(){
        analysis.clear();
        htmlBalloon.DestroyObject();
    })
    $("#btnSet").click(function(){

        var stride = $("#stride").val();
        if(isNaN(parseFloat(stride))){
            alert("请输入正确的间距值");
            return;
        }
        var color = $("#color").val();
        color = color.substr(1,6);
        color = "0xff" + color;
        analysis.contour(parseFloat($("#stride").val()),parseInt(color),$("#exportShp"));
    });
    //选择导入文件
    $("#selectImg").click(function (){
        var filePath = earth.UserDocument.SaveFileDialog(earth.RootPath, "*.shp", "shp");
        if (filePath == "") {
            return;
        }
        $("#selectPath").attr("value", filePath);
    });
    //选择投影文件
    $("#selectSpat").click(function(){
        var filePath =  earth.UserDocument.OpenFileDialog(earth.RootPath, "spatial文件(*.spatial)|*.spatial");
        if (filePath == ""){
            return;
        }
        $("#referenceInput").attr("value", filePath);
    });
    $("#exportShp").click(function(){
        if(contourPolygonObj){
            var path = $("#selectPath").val();
            var reference = $("#referenceInput").val();
            if(!check(path,reference)){
                return;
            }
            var coords = [];
            var contourPolygonLen = contourPolygonObj.GetContourCount();
            for(var i=0; i<contourPolygonLen; i++){
                var thisCoords = ""
                var thisVec3s = contourPolygonObj.GetContourBynNum(i);
                for(var j=0; j<thisVec3s.Count; j++){
                    var thisVec3 = thisVec3s.Items(j);
                    if(j == thisVec3s.Count - 1){
                        thisCoords += thisVec3.X + "," + thisVec3.Y + "," + thisVec3.Z;
                    }else{
                        thisCoords += thisVec3.X + "," + thisVec3.Y + "," + thisVec3.Z + " ";
                    }
                }
                coords.push(thisCoords);
            }
            if(!coords.length){
                alert("未生成等高线，请重新绘制区域");
                return;
            }
            path = path.substring(0, path.lastIndexOf("."))
            var exp = STAMP.ExportSHP(earth, path, reference, coords, 220);
            exp.exportFileToShape();

        }else{
            alert("未生成等高线，请绘制区域");
        }
    });
    window.onunload = function(){
        analysis.clear();
    }
})