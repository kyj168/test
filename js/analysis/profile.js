var earth;

function getEarth(earthObj) {
    earth = earthObj;
    var seearth = earth;
    var AnalysisResult = null; // 分析结果对象
    var b_synchronization = false; //分析结果的请求方式，默认是false，异步
    var g_polyline = null;
    var resArr = parent.resArr;
    var analysis = STAMP.Analysis(earth);
    /**
     * 选择折线
     */
    $("#btnStart").click(function () {
        if (check()) {
            clearResult();
            var documentObject = earth.ifEarth;
            documentObject.hideProfile();
            //$("#btnStart").text("结束分析");
            seearth.Event.OnCreateGeometry = OnProfile;
            seearth.ShapeCreator.CreatePolyline(1, 0xccff0000);

            $("#space").attr("disabled", "disabled");
            $("#btnStart").attr("disabled", "disabled");
            $("#clear").attr("disabled", "disabled");
        }
    });

    function clearProfile() {
        clearResult();
        var documentObject = earth.ifEarth;
        documentObject.hideProfile();
        $("#space").removeAttr("disabled");
        $("#btnStart").removeAttr("disabled");
        $("#clear").removeAttr("disabled");
    }

    /**
     * 折线回调
     */
    function OnProfile(p, cType) {
        if (p.Count < 2) {
            alert('采样折线不能少于两个点');
            $("#space").removeAttr("disabled");
            $("#btnStart").removeAttr("disabled");
            $("#clear").removeAttr("disabled");
            return;
        }
        var space = document.getElementById("space").value;
        var geoPoints = seearth.Factory.CreateGeoPoints();
        var geoCalculator = seearth.GeometryAlgorithm;
        for (var i = 0; i < p.Count; i++) {
            var geoPoint = seearth.Factory.CreateGeoPoint();
            geoPoint.Longitude = p.Items(i).x;
            geoPoint.Latitude = p.Items(i).y;
            geoPoint.Altitude = p.Items(i).z;
            geoPoints.AddPoint(geoPoint);
        }
        var length = geoCalculator.CalculatePolylineLength(geoPoints);
        if (space > length) {
            var slength = parseInt(length) / 3 - 1;
            space = parseInt(slength);
            if (p.Count >= 2) {
                alert("采样间距过大，目前折线总长为" + parseInt(length) + ",自动采用了" + parseInt(slength) + "采样率");
            }
        }
        seearth.Event.OnAnalysisFinished = function (result) {
            seearth.Event.OnAnalysisFinished = function () {
            };

            var resXml = result.BriefDescription;

            if (resXml) {
                showHtmlWindow(resXml);
            }
            $("#space").removeAttr("disabled");
            $("#btnStart").removeAttr("disabled");
            $("#clear").removeAttr("disabled");
        };
        var res = seearth.Analysis.Profile(1, space, geoPoints);
        // if (res) {
        //     showHtmlWindow(res);
        // }
        // $("#space").removeAttr("disabled");
        // $("#btnStart").removeAttr("disabled");
        // $("#clear").removeAttr("disabled");
    }

    /**
     * 显示剖面分析页面
     */
    var documentObj;

    function showHtmlWindow(res) {
        var xmlDoc = loadXMLStr(res);
        var root = xmlDoc.documentElement;
        if (xmlDoc == null || xmlDoc == undefined) {
            alert('分析错误，请重试');
            return;
        }
        if (root == null || root == undefined) {
            alert('分析错误，请重试');
            return;
        }
        var pointCount = parseInt(root.selectSingleNode("point_number").text);
        var pointStr = root.selectSingleNode("point_array").text;
        var pointArr = pointStr.split(",");
        var serieList = [];
        var xPoints = [];
        var lineData = [];
        for (var i = 0; i < pointCount; i++) {
            var index = i * 4;
            xPoints.push(i);
            lineData.push(parseFloat(pointArr[index + 2]));
        }
        var serieData = {
            name: "profile",
            data: lineData
        };
        serieList.push(serieData);
        documentObj = earth.ifEarth;
        documentObj.showProfile(xPoints, serieList, pointArr);
    }

    /**
     * 清除分析结果
     */
    function clearResult() {
        if (AnalysisResult != null) {
            AnalysisResult.ClearRes();
            AnalysisResult = null;
        }
        seearth.ShapeCreator.Clear();
    }

    function loadXMLStr(xmlStr) {
        var xmlDoc;

        try {
            if (window.ActiveXObject || window.ActiveXObject.prototype) {
                var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM', 'MSXML2.DOMDocument'];
                for (var i = 0; i < activeX.length; i++) {
                    try {
                        xmlDoc = new ActiveXObject(activeX[i]);
                        xmlDoc.async = false;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
                if (/http/ig.test(xmlStr.substring(0, 4))) {
                    xmlDoc.load(xmlStr);
                } else {
                    xmlDoc.loadXML(xmlStr);
                }
            } else if (document.implementation && document.implementation.createDocument) {
                xmlDoc = document.implementation.createDocument('', '', null);
                xmlDoc.loadXml(xmlStr);
            } else {
                xmlDoc = null;
            }
        } catch (exception) {
            xmlDoc = null;
        }
        return xmlDoc;
    }

    $("#clear").click(function () {
        analysis.clearHtmlBallon(earth.htmlBallon);
    });
    window.onunload = function () {
        clearProfile();
        analysis.clear();
    };

}

function check() {
    if (isNaN($("#space").val()) == true) {
        alert("无效的采样间距");
        space.select();
        space.focus();
        return false;
    }
    if ($("#space").val() <= 0) {
        alert("无效的采样间距");
        space.select();
        space.focus();
        return false;
    }
    return true;
}