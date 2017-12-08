var earth = "";
var analysis;
var sInitColor = null;
var viewShedObj = null;//创建的视锥体
var htmlBalloon = null;//气泡
//选色卡触发事件
function noShadowColorDlg() {
    var sColor = null;
    sInitColor = document.getElementById("noShadowColor").value;
    if (sInitColor == null) {
        sColor = dlgHelper.ChooseColorDlg();
    } else {
        sColor = dlgHelper.ChooseColorDlg(sInitColor);
    }
    sColor = sColor.toString(16);
    if (sColor.length < 6) {
        var sTempString = "00000000".substring(0, 6 - sColor.length);
        sColor = sTempString.concat(sColor);
    }
    var xColor = "0x99" + sColor;
    sColor = "#" + sColor;
    document.getElementById("noShadowColor").value = xColor;
    document.getElementById("noShadowColorsel").style.background = sColor;
    sInitColor = sColor;
}
//选色卡触发事件
function shadowColorDlg() {
    var sColor = null;
    sInitColor = document.getElementById("shadowColor").value;
    if (sInitColor == null) {
        sColor = dlgHelper.ChooseColorDlg();
    } else {
        sColor = dlgHelper.ChooseColorDlg(sInitColor);
    }
    sColor = sColor.toString(16);
    document.getElementById("shadowColor").value = sColor;
    if (sColor.length < 6) {
        var sTempString = "00000000".substring(0, 6 - sColor.length);
        sColor = sTempString.concat(sColor);
    }
    var xColor = "0x99" + sColor;
    sColor = "#" + sColor;
    document.getElementById("shadowColor").value = xColor;
    document.getElementById("shadowColorsel").style.background = sColor;
    sInitColor = sColor;
}

function getEarth(earthObj) {
    earth = earthObj;
    htmlBalloon = earthObj.htmlBallon;
    var resArr = parent.resArr;
    analysis = STAMP.Analysis(earth);
    var btn = [$("#btnStart"), $("#angle"), $("#height"), $("#clear")];
    $(function () {
        $("#btnStart").click(function () {
            if (check()) {
                var shadowColor = $("#shadowColor").val();
                var noShadowColor = $("#noShadowColor").val();
                if (viewShedObj) {
                    earth.DetachObject(viewShedObj);
                    viewShedObj = null;
                }
                analysis.viewShed(angle.value, height.value, btn, shadowColor, noShadowColor);
            }
        });
        $("#btnStop").click(function () {
            analysis.clear();
            $("#btnStop").attr("disabled", "disabled");
            $("#btnStart").removeAttr("disabled");
            $("#angle").removeAttr("disabled");
            $("#height").removeAttr("disabled");
            $("#clear").removeAttr("disabled");
        });
        $("#clear").click(function () {
            if (viewShedObj) {
                earth.DetachObject(viewShedObj);
                viewShedObj = null;
            }
            htmlBalloon.DestroyObject();
        });
    });
    window.onunload = function () {
        analysis.clear();
        if (viewShedObj) {
            earth.DetachObject(viewShedObj);
        }

    };
}
function check() {
    if (isNaN($("#angle").val()) == true) {
        alert("无效的视角");
        angle.select();
        angle.focus();
        return false;
    }
    if (isNaN($("#height").val()) == true) {
        alert("无效的高度");
        height.select();
        height.focus();
        return false;
    }
    return true;
}