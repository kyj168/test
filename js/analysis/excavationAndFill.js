var earth = "";
var spatialDatum = null;
    function getEarth(earthObj) {
        earth = earthObj;
        spatialDatum = earthObj.datum;
        var analysis = STAMP.Analysis(earth);
        //var resArr=parent.resArr;
        $(function() {
            $("#btnStart").click(function() {
                if (check()) {
                    //var altitudeGround=parseInt($("#altitudeGround").val());
                    var altitude = parseInt($("#altitude").val());
                    if ($("#btnStart").text() === "开始分析") {
                        var isCustomer = $("#customer").is(":checked");

                        $("#btnStart").attr("disabled", "disabled");
                        if(isCustomer){
                            analysis.excavationAndFill(altitude, chkDem.checked, digDem.checked);  
                        }else{
                            var path = $("#shpPath").val();
                            if(path){
                                var pathStr = path.split(".");
                                var type = pathStr[pathStr.length - 1];
                                if (type != "dwg" && type != "dxf" && type != "shp"){
                                    alert("矢量文件格式不正确,请重新选择文件!");
                                    return false;
                                }
                                var exp = STAMP.ExportSHP(earth);//digDem开挖地面模型，checkDem生成辅助模型
                                var polygon = exp.importFile(path,null,type,null,spatialDatum);
                                analysis.vectorExcaveAndFill(polygon,chkDem.checked, digDem.checked)
                            }else{
                                alert("请导入矢量文件");
                                return;
                            }
                        }
                        $("#altitude").attr("disabled", "disabled");
                        $("#getAltBtn").attr("disabled", "disabled");
                        $("#clear").attr("disabled", "disabled");
                        $("#checkDiv").attr("disabled", "disabled");
                    }
                }
            });

            $("#clear").click(function() {
                analysis.clearHtmlBallon(earth.htmlBallon);
            });
            $("#shpFile").attr("disabled",true);
            function setStatus(){
                var isCustomer = $("#customer").is(":checked");
                if(isCustomer){
                    $("#shpFile").attr("disabled",true);
                    $("#altitude").attr("disabled",false);
                }else{
                    $("#shpFile").attr("disabled",false);
                    $("#altitude").attr("disabled",true);
                }
            }
            $("#customer").click(function(){
                setStatus();
            })
            $("#importShp").click(function(){
                setStatus();
            })
            $("#shpFile").click(function(){
                var filePath =  earth.UserDocument.OpenFileDialog(earth.RootPath, "shape文件(*.shp)|*.shp|dxf文件(*.dxf)|*.dxf|dwg文件(*.dwg)|*.dwg");
                if (filePath == ""){
                    return;
                }
                $("#shpPath").attr("value", filePath);
            })
        });
        $("#getAltBtn").click(function() {
            document.getElementById("getAltBtn").style.cursor = "crosshair";
            //
            analysis.getAltitude(function(val) {
                altitudeGround.value = val;
            });
            earth.Event.OnLBUp = function(p) {
                document.getElementById("getAltBtn").style.cursor = "auto";
                earth.Event.OnLBUp = function() {};
            };
        });
        window.onunload = function() {
            analysis.clear();
        };
    }

    function check() {
        if (isNaN($("#altitude").val()) == true) {
            alert("无效的开挖深度");
            altitude.select();
            altitude.focus();
            return false;
        }
        return true;
    }