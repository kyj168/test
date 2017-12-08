var earth = "";

function getEarth(earthObj) {
    earth = earthObj;
    var analysis = STAMP.Analysis(earth);
    $(function () {
        $("#btnStart").click(function () {
            if (check()) {
                analysis.skyline((chkDem.checked ? true : false), $("#height").val(), $("#length").val(), $("#deep").val(), (chkUder.checked ? true : false));
                //$("#btnStart").text("结束分析");
                $("#chkModel").attr("disabled", "disabled");
                $("#chkDem").attr("disabled", "disabled");
                $("#length").attr("disabled", "disabled");
                $("#height").attr("disabled", "disabled");
                $("#mHeight").attr("disabled", "disabled");
                $("#btnStart").attr("disabled", "disabled");
                $("#clear").attr("disabled", "disabled");
                $("#deep").attr("disabled", "disabled");
            }
        });
        //打开保存路径
        $("#addSavepath").click(function () {
            var filePath = earth.UserDocument.OpenFilePathDialog("", "");
            if (filePath == "")
                return;
            document.getElementById("savepath").value = filePath;
        });
        //出图事件
        $("#prinOut").click(function () {
            var filePath = document.getElementById("savepath").value;
            if (filePath == "") {
                alert("请选择文件路径！");
            }
            else {
                if (!lineparam) {
                    alert("请选择范围");
                    return;
                }
                var iSkyline = earth.GlobeObserver.FixedPoint_Image(lineparam, $("#height").val(), $("#length").val(), $("#deep").val(), (chkDem.checked ? true : false), true, filePath + "\\fixed_point.png");
                var totalCount = iSkyline.begin();
                var imgIndex = 0;
                var recordState = true;
                iSkyline.goto(imgIndex);
                var tag = setInterval(function Loop() {
                    if (recordState == false) return;
                    var count = earth.GetDownloadCount();
                    if (count == 0) {
                        iSkyline.Generate(imgIndex); // 生成一张图片 
                        imgIndex++;
                        if (imgIndex >= totalCount) {
                            recordState = false;
                            iSkyline.End();
                            clearInterval(tag);
                        }
                        else {
                            iSkyline.goto(imgIndex); // 定位到下一张图所在的位置
                        }
                    }
                }, 500);
                alert("出图成功");
            }
        });

        $("#mHeight").click(function () {

            earth.Event.OnMeasureFinish = function (result, type) {
                analysis.clear();
                result = result * 1000;
                document.getElementById("height").value = result.toFixed(2);
                $("#btnStart").attr("disabled", false);
                earth.Event.OnMeasureFinish = function () {

                };
            };
            earth.Measure.MeasureHeight();
        });
        $("#height").change(function () {
            if ("" == $("#height").val()) {
                alert("无效的高度值");
                $("#height").focus();
                return false;
            }

            if (isNaN($("#height").val()) == true) {
                alert("无效的高度值");
                $("#height").focus();
                return false;
            }
            if ($("#height").val() < 0) {
                alert("无效的高度值");
                $("#height").focus();
                return false;
            }
            if ($("#height").val() > 0) {
                $("#btnStart").attr("disabled", false);
            }
            if (isNaN($("#deep").val()) == true) {
                alert("无效深度");
                $("deep").focus();
                return false;
            }
        });
        $("#clear").click(function () {
            analysis.clearHtmlBallon(earth.htmlBallon);
        });
    });
    window.onunload = function () {
        earth.GlobeObserver.StopFixedPointObserve();
        analysis.clear();
    };
}

function check() {
    if ("" == $("#height").val()) {
        alert("无效的高度值");
        $("#height").focus();
        return false;
    }
    if (isNaN($("#height").val()) == true) {
        alert("无效的高度值");
        $("#height").focus();
        return false;
    }
    if ($("#height").val() < 0) {
        alert("无效的高度值");
        $("#height").focus();
        return false;
    }
    if (isNaN($("#deep").val()) == true) {
        alert("无效深度");
        $("deep").focus();
        return false;
    }
    if ("" == $("#length").val()) {
        alert("无效的分析距离");
        $("#length").focus();
        return false;
    }
    if (isNaN($("#length").val()) == true) {
        alert("无效的分析距离");
        $("#length").focus();
        return false;
    }
    if ($("#length").val() < 0) {
        alert("无效的分析距离");
        ;
        $("#length").focus();
        return false;
    }
    return true;
}