var earth = "";
function getEarth(earthObj) {
    earth = earthObj;
    var analysis = STAMP.Analysis(earth);
    $(function () {
        $("#btnStart").click(function () {
            $("#btnStart").attr("disabled", "disabled");
            analysis.fixedObserver($("#height").val());
            $("#height").attr("disabled", "disabled");
            $("#clear").attr("disabled", "disabled");
        });
    });
    $("#clear").click(function () {
        analysis.clearHtmlBallon(earth.htmlBallon);
    });
    $("#height").change(function () {
        if (isNaN($("#height").val())) {
            $("#btnStart").attr("disabled", "disabled");
            alert("观察高度必须是数字！");

        }
        else {
            $("#btnStart").removeAttr("disabled");
        }
    });
    $("#height").trigger("change");
    window.onunload = function () {
        analysis.clear();
    };
}