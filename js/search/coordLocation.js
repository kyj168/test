/**
 * 坐标定位
 */

var earth="";
var cook=document.cookie;
var arrCookie=cook.split(";");
var tRadio = "";
var selectSet = "";
var zRadio = "";
for(var i=0;i<arrCookie.length;i++){
    var arr=arrCookie[i].split("=");
    //alert(arr);
    if(arr[0].indexOf("tRadio")>=0){
        tRadio=arr[1];
        //break;
    }
    if(arr[0].indexOf("selectSet")>=0){
        selectSet = arr[1];
    }
    if(arr[0].indexOf("zRadio")>=0){
        zRadio = arr[1];
    }
    if(selectSet){
        $("#xyItem").removeAttr("disabled");
    }
}
var spaPath = "";
function getEarth(earthObj){
    earth = earthObj;
    $(function(){
        var analysis = STAMP.Analysis(earth);
        var SYSTEMPARAMS = getSystemConfig();
        var layer = earth.LayerManager.GetLayerByGUID(SYSTEMPARAMS.project);
        if(layer){
            var projectSetting = layer.ProjectSetting;
            spaPath = projectSetting.SpatialRefFile;//空间参考文件
        }
        $("#lbItem").click(function(){
            $(":text").val("0.00");
            $(".geo").show();
            $(".shadow").hide();
            document.getElementById("locateBtn").disabled = false;
        });

        $("#xyItem").click(function(){
            $(":text").val("0.00");
            $(".geo").hide();
            $(".shadow").show();
            if(spaPath){
                document.getElementById("locateBtn").disabled = false;
                document.getElementById("coordX").disabled = false;
                document.getElementById("coordY").disabled = false;
            }
            else{
                document.getElementById("locateBtn").disabled = true;
                document.getElementById("coordX").disabled = true;
                document.getElementById("coordY").disabled = true;
            }
        });

        //平面坐标（x，y）反算到经纬度
        function project_Inverse(x,y){
            if(!spaPath){
                alert("该工程未设空间参考！")
                return;
            }

            var dataPro=document.getElementById("dataProcess");
            dataPro.Load();
            var datum;
            var spatialRef = dataPro.CoordFactory.CreateSpatialRef();
            var filePath = earth.Environment.RootPath+"\\temp\\spatialFile";
            earth.UserDocument.SaveFile(spaPath,"spatialFile");
            spatialRef.InitFromFile(filePath);
            earth.UserDocument.DeleteFile (filePath);
            datum = dataPro.CoordFactory.CreateDatum();
            datum.init(spatialRef);
            var point = datum.src_xy_to_des_BLH(x, y, 0);
            return point;
        }
        /**
         * 将指定的XML文件转换为dom对象
         * @param file - XML文件
         * @returns dom对象
         */
        function loadXMLFile(xmlStr){
            var xmlDoc = null;
            try {
                if(window.ActiveXObject || window.ActiveXObject.prototype) {
                    var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM','MSXML2.DOMDocument'];
                    for (var i=0; i<activeX.length; i++){
                        try {
                            xmlDoc = new ActiveXObject(activeX[i]);
                            xmlDoc.async = false;
                            break;
                        } catch(e) {
                            continue;
                        }
                    }
                    if (/http/ig.test(xmlStr.substring(0,4))){
                        xmlDoc.load(xmlStr);
                    }else{
                        xmlDoc.loadXML(xmlStr);
                    }
                } else if (document.implementation && document.implementation.createDocument) {
                    xmlDoc = document.implementation.createDocument('', '', null);
                    xmlDoc.loadXml(xmlStr);
                } else {
                    xmlDoc = null;
                }
            }catch (exception){
                xmlDoc = null;
            }
            return xmlDoc;
        }

        $("#locateBtn").click(function(){
            if(check()){
                var locationType = $("input:radio[name='coordinate']:checked").val();
                var lon = null;
                var lat = null;
                if(locationType === $("#lbItem").val()){ //测试数据：lon=117.189747; lat=34.23187
                    lon = $("#longitude").val();
                    lat = $("#latitude").val();
                }else {//测试数据：coordX=832063.655394191; coordY=1584868.3150751288
                    var coordX = $("#coordX").val();
                    var coordY = $("#coordY").val();
                    var geoPoint = project_Inverse(coordX,coordY);
                    if(geoPoint){
                        lon = geoPoint.X;
                        lat = geoPoint.Y;
                    }
                }
                var alt = earth.GlobeObserver.GetDEMHeight();
                if(lon!=null&&lat!=null){
                    earth.GlobeObserver.FlytoLookat(lon, lat, alt, 0, 90, 0, 300, 3);
                }
            }
        });
        $("#clear").click(function(){
            analysis.clearHtmlBallon(earth.htmlBallon);
        });
        function getSystemConfig(){
            var rootPath = earth.Environment.RootPath + "temp\\SystemConfig";
            var configPath = rootPath + ".xml";
            var configXml = earth.UserDocument.LoadXmlFile(configPath);
            if (configXml === "") {
                configXml = initSystemConfig();
                earth.UserDocument.SaveXmlFile(rootPath, configXml);
            }
            var systemDoc = loadXMLStr(configXml);
            var systemJson = $.xml2json(systemDoc);
            if (systemJson == null) {
                return false;
            }
            if (systemJson.Project==""||systemJson.Project.length!=36) { //如果工程不存在，默认选第一个
                var pipeProjArr = getProjectList();
                if (pipeProjArr.length > 0) {
                    var obj = {
                        ip: params.ip,
                        project: pipeProjArr[0].id
                    };
                    earth.UserDocument.DeleteXmlFile(configPath);
                    var newXml = initSystemConfig(pipeProjArr[0].id);
                    earth.UserDocument.SaveXmlFile(rootPath, newXml);

                    systemDoc = loadXMLStr(newXml);
                    systemJson = $.xml2json(systemDoc);
                }

            }
            //////////////////////////////////////////////////////////
            //IE9 不支持selectSingleNode
            //////////////////////////////////////////////////////////
            /*var root = systemDoc.documentElement;*/
            var systemData = {};
            systemData.project = systemJson.Project;
            return systemData;
        }
        function initSystemConfig(id) {
            var configXml = '<xml>';
            if (id) {
                configXml = configXml + '<Project>' + id + '</Project>'; //project
            } else {
                configXml = configXml + '<Project></Project>'; //project
            }
            configXml = configXml + '</xml>';
            return configXml;
        }
        function getProjectList() {
            var projectList = [];
            var rootLayerList = earth.LayerManager.LayerList;
            var projectCount = rootLayerList.GetChildCount();
            for (var i = 0; i < projectCount; i++) {
                var childLayer = rootLayerList.GetChildAt(i);
                var layerType = childLayer.LayerType;
                var pipeTag = false;
                if (layerType === "Project"&&!pipeTag) {  //17
                    var projectId = childLayer.Guid;
                    var projectName = childLayer.Name;
                    var chlildrenCount = childLayer.GetChildCount();
                    projectList.push({id: projectId, name: projectName});
                }
            }
            return projectList;
        }
    });
};
function check(){
    if(isNaN($("#longitude").val()) == true){
        alert("无效的经度值");
        longitude.select();
        longitude.focus();
        return false;
    }
    if(isNaN($("#latitude").val()) == true){
        alert("无效的纬度值");
        latitude.select();
        latitude.focus();
        return false;
    }
    if(isNaN($("#coordX").val()) == true){
        alert("无效的输入值");
        coordX.select();
        coordX.focus();
        return false;
    }
    if(isNaN($("#coordY").val()) == true){
        alert("无效的输入值");
        coordY.select();
        coordY.focus();
        return false;
    }
    return true;
}