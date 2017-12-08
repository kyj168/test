/**
 * 导入模型
 */

var earth = "";

function getEarth(earthObj) {
    earth = earthObj;
    var loop = 0;
    var recordDic = {};
    var temp = earth.userdata;
    var filename = "MyAnimate";
    var analysis = STAMP.Analysis(earth);
    var userdata = STAMP.Userdata(earth);
    $("#btnAdd").click(function () {

        var filePath = earth.UserDocument.OpenFileDialog(earth.RootPath, "dynamic文件(*.dynamic)|*.dynamic");
        if (filePath == "") {
            return;
        }
        //如果已经存在该记录 则不再执行重复导入
        if (recordDic[filePath]) {
            return;
        }
        loop++;
        recordDic[filePath] = loop;

        $("#filepath").attr("value", filePath);

        //var row = {"name":loop,"desp":filePath };
        var row = {
            "name": loop,
            "desp": filePath
        };
        //$("#viewpointList").datagrid("appendRow", row);
        //添加记录后 "清空"可用
        //$("#btnClear").removeAttr("disabled");
        if ("" != $("#referenceInput").val()) {
            $("#btnImport").removeAttr("disabled");
        }
    });

    //选择投影文件
    $("#addSpatialReference").click(function () {
        var filePath = earth.UserDocument.OpenFileDialog(earth.RootPath, "spatial文件(*.spatial)|*.spatial");
        if (filePath == "") {
            return;
        }
        $("#referenceInput").attr("value", filePath);
        if ("" != $("#filepath").val()) {
            $("#btnImport").removeAttr("disabled");
        }
    });

    //导入动画
    $("#btnImport").click(function () {
        if (check()) {

            var reference = $("#referenceInput").val();
            $('#btnAdd').attr("disabled", true);
            $('#addSpatialReference').attr("disabled", true);
            $('#clear').attr("disabled", true);
            $('#btnImport').attr("disabled", true);
            if (reference != undefined && reference != "") {
                var dataProcess = document.getElementById("dataProcess");
                dataProcess.Load();
                var link = $('#filepath').val();
                var texttrue = link.split("\\");
                var texttrueFname = texttrue[texttrue.length - 1];
                var fileName = texttrueFname.split(".")[0];
                var folderName = link.split(".")[0];
                //从folderName中把fileName字符去掉
                var nFolder = folderName.replace(fileName, "");
                var guid = earth.Factory.CreateGuid();
                var model = earth.Factory.CreateDynamicModelByLocal(guid, fileName, nFolder);

            } else {
                alert("请选择投影文件!");
                $('#btnAdd').attr("disabled", false);
                $('#addSpatialReference').attr("disabled", false);
                $('#clear').attr("disabled", false);
                $('#btnImport').attr("disabled", true);
                $("#filepath").val("");
                $("#referenceInput").val("");
            }
        }
    });


    function check() {
        var filepath = document.getElementById("filepath").value;
        if ("" == filepath) {
            alert("请选择文件！");
            //document.getElementById("selectVect").focus()
            return false;
        }
        var referenceInput = document.getElementById("referenceInput").value;
        if ("" == referenceInput) {
            alert("请选择投影文件！");
            //document.getElementById("referenceInput").focus()
            return false;
        }
        return true;
    }
}