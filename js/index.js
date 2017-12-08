/**
 * 模块：主界面
 * 功能：最外层页面脚本，包括全局变量和方法
 */

/*全局变量*/
var areaTable = [];//配置单位、道路、区域数据表
var earthToolsDiv = null;
var SYSTEMPARAMS = {}; //系统参数对象
//验证半径的正则表达式:非0开头的正数，小数点之后保留最多三位,小数点之前最多三位
var regExpValidation = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
var objArrs = [];//用户对象
var earthToolsBalloon = null;
var earth = null;
var excuteType = 27;
var userdata = null;
var analysis = null;//三维分析
var picturesBalloons = null;//编辑对话框、截屏出图等
var seHistorySliderMgr = null;//查看历史slider
var SetDemcrazySliderMgr = null;//地形夸张slider;
var bSync = false;//两球联动
var cameraLayer = null;//视频监控新增图层
var cameras = [];//所有视频监控对象集合
var isUserdataTree = false;//面板打开是否加载了树

/*-------------标题栏样式 START--------------------*/
$(".logoImg").attr("src",STAMP_config.topInfo.logo);
if(STAMP_config.topInfo.titleImg && STAMP_config.topInfo.titleImg != ""){
	$(".titleImg").attr("src",STAMP_config.topInfo.titleImg);
	$(".titleText").hide();
	$(".titleImg").show();
}else{
	$(".titleText").text(STAMP_config.topInfo.titleText);
	$(".titleImg").hide();
	$(".titleText").show();
}

/*-------------标题栏样式 END--------------------*/

/*-------------重要方法：三维球加载完成后初始化方法--------------------*/
function init(){
	SystemSetting.initSystemParam(earth);
	LayerManagement.initLayerDataType(earth, null); //获取管线图层数据
	baseLayerTree(earth); // 将基本图层数据添加到左侧树
    userdata = STAMP.Userdata(earth);
    userdata.initTree();
    analysis = STAMP.Analysis(earth);
	initMenu();
	showEarthTools();
    SetDemcrazySliderMgr = new STAMP.SetDemcrazySliderMgr({
        onAllClose:function(){
            Tools.singleStyleCancel("demExagger");
        }
    });
    seHistorySliderMgr = new STAMP.SeHistorySliderMgr({
        onAllClose:function(){
            Tools.singleStyleCancel("historyData");
        }
    });
}

//获取数据处理object对象：空间参考等
function getDataProcessIndex () {
    var dataProcess = document.getElementById("dataProcess");
    return dataProcess;
}

//获取功能面板opendialog的frame
function getOperObject(){
	try {
        return window.frames["operator"];
    } 
    catch (e) { 
    	return; 
    }
}

//获取ResultView对象，目前只有视点在此
function getViewObject() {
	try {
        return window.frames["ResultMain"];
    } 
    catch (e) { 
    	return; 
    }
}

/*-----------------页面布局相关 START----------------------*/
//页面自适应布局
$("#mainDiv").height($(window).height() - 70);
$("#MapTwo").height($("#mainDiv").height() - ($("#viewpointMain").is(":hidden")?0:135) - 40);
$("#id_tree_body").height($("#id_left_layerTree").height() - $("#layerHeader").height() - $("#layer_title").height() - 2);
$("#layerTreeDiv").height($("#id_tree_body").height() - 35);
$("#userdataTreeDiv").height($("#id_tree_body").height() - 35);
$("#layerTreeDiv").mCustomScrollbar({});
$("#userdataTreeDiv").mCustomScrollbar({});
var earthToolHeightTemp = 0;
function resizeEarthToolWindow(){//工具栏重新调整窗口
    if(earthToolsBalloon && $("#earthDiv").height() < earthToolHeight){
        var temHeight = parseInt(($("#earthDiv").height() - 32 - 22)/45) * 45 + 32 + 22;
        earthToolsBalloon.SetRectSize(earthToolWidth, temHeight);
        earthToolHeightTemp = temHeight;
    }else if(earthToolsBalloon && earthToolHeightTemp < earthToolHeight){
        earthToolsBalloon.SetRectSize(earthToolWidth, earthToolHeight);
    }
}

window.onresize = function(){
	$("#mainDiv").height($(window).height() - 70);
	$("#MapTwo").height($("#mainDiv").height() - ($("#viewpointMain").is(":hidden")?0:135) - 40);
	$("#id_tree_body").height($("#id_left_layerTree").height() - $("#layerHeader").height() - $("#layer_title").height());
	setToolsIconStatus();
    resizeEarthToolWindow();
};


/**
*地形剖面图
*xCategories:X轴值,serieList,要生成图表的数据,POINTARR:剖面分析每个点的数据数组
*/

function showProfile(xCategories, serieList,POINTARR){
    $("#ResultMain").hide();
    $("#profileChart").show();
    var profileHeight = $("#MapTwo").height()/2;
    setTableView(true,profileHeight);
    createChart(xCategories, serieList,POINTARR);
}
/**
*单点监测
*xCategories:X轴值,minValue:Y轴最小值,maxValue:Y轴最大值,serieList:图表数据
*/
function showPointMonitor(xCategories,minValue,serieList,maxValue){
    $("#ResultMain").hide();
    $("#profileChart").show();
    var profileHeight = $("#MapTwo").height()/2;
    setTableView(true,profileHeight);
    createPointMonitor(xCategories,minValue,serieList,maxValue);
}
/**
*断面监测
*resultObj:每个DEM图层返回的结果,minValue:Y轴最小值,maxValue:Y轴最大值,serieList:图表数据
*/
function showSectionMonitor(serieList,minValue,maxValue,resultObj){
    $("#ResultMain").hide();
    $("#profileChart").show();
    var profileHeight = $("#MapTwo").height()/2;
    setTableView(true,profileHeight);
    createSectionMonitor(minValue,serieList,maxValue,resultObj);
}
//地形剖面图绘制
function createChart(xCategories, serieList,POINTARR){
    var minValue = null;
    var maxValue = null;
    for (var i = 0; i < serieList.length; i++) {
        var dataList = serieList[i].data;
        for (var k = 0; k < dataList.length; k++) {
            var dataValue = dataList[k];
            if (minValue == null) {
                minValue = dataValue;
            } else {
                if (dataValue < minValue) {
                    minValue = dataValue;
                }
            }
            if (maxValue == null) {
                maxValue = dataValue;
            } else {
                if (dataValue > maxValue) {
                    maxValue = dataValue;
                }
            }
        }
    }
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'profileChart',
            reflow: false,
            type: "areaspline",
            zoomType: 'xy', //xy均可以鼠标拖动缩放
            //animation: false, //更新的时候，是否有动画效果。
            margin: [50, 50, 50, 70]
        },
        credits: {
            enabled: false
        },
        title: {
            text: '地形剖面图'
        },
        xAxis: {
            title: {
                text: '距离(米)'
            },
            //tickInterval: 10, //控制X轴步长
            allowDecimals: false, //X轴不允许有小数标值
            //gridLineWidth: 1, //X轴网格线宽
            //categories: xCategories, //X轴标值列表
            labels: {
                rotation: -45,
                align: 'right'
            }
        },
        yAxis: {
            title: {
                text: '高程(米)'
            },
            //tickInterval: 10,
            min: minValue,
            max: maxValue,
            allowDecimals: false
        },
        tooltip: {
            formatter: function() {
                if (POINTARR == null) {
                    return;
                }
                var index = this.x * 4;
                var lon = POINTARR[index];
                var lat = POINTARR[index + 1];
                var alt = this.y;
                var formatStr = '<b>样点' + this.x + ': <br/>';
                formatStr = formatStr + '经度: ' + lon + '<br/>';
                formatStr = formatStr + '纬度: ' + lat + '<br/>';
                formatStr = formatStr + '高程: ' + alt + '</b>';
                return formatStr;
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false, //初始化时，是否有动画效果     
                cursor: 'pointer',
                events: {
                    click: function(e) {
                        if (POINTARR == null) {
                            return;
                        }
                        var index = e.point.x * 4;
                        var lon = POINTARR[index];
                        var lat = POINTARR[index + 1];
                        var alt = e.point.y;
                        seearth.GlobeObserver.FlytoLookat(lon, lat, alt, 0, 90, 0, 100, 5);
                    }
                },
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 3
                        }
                    }
                }
            }
        },
        series: serieList,
        exporting: {
            enabled: false
        }
    });
    return chart;
}
//单点监测图绘制
function createPointMonitor(xCategories,minValue,serieList,maxValue){
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'profileChart',
            reflow: false,
            zoomType: 'xy', //xy均可以鼠标拖动缩放
            margin: [50, 50, 50, 70]
        },
        title: {
            text: '单点监测图'
        },
        xAxis: {
            title: {
                text:"dem图层"
            },
            categories: xCategories//X轴标值列表
        },
        yAxis: {
            title: {
                text: '高程(米)'
            },
            min: minValue,
            max: maxValue,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        plotOptions: {
            series: {
                animation: false, //初始化时，是否有动画效果     
                cursor: 'pointer',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 3
                        }
                    }
                }
            }
        },
        series: serieList,
        exporting: {
            enabled: false
        }
    });
}
//断面监测图绘制
function createSectionMonitor(minValue,serieList,maxValue,resultObj){
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'profileChart',
            reflow: false,
            type: "areaspline",
            zoomType: 'xy', //xy均可以鼠标拖动缩放
            margin: [50, 50, 50, 70]
        },
        credits: {
            enabled: false
        },
        title: {
            text: '地形剖面图'
        },
        xAxis: {
            title: {
                text: '距离(米)'
            },
            categories: xCategories,//X轴标值列表
            allowDecimals: false, //X轴不允许有小数标值
            labels: {
                rotation: -45,
                align: 'right'
            }
        },
        yAxis: {
            title: {
                text: '高程(米)'
            },
            //tickInterval: 10,
            min: minValue,
            max: maxValue,
            allowDecimals: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false, //初始化时，是否有动画效果     
                cursor: 'pointer',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 3
                        }
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: serieList,
        exporting: {
            enabled: false
        }
    });
    return chart;
}
//隐藏球下方的图
function hideProfile(){
    ViewPointManagementBtn = false;
    $("#ResultMain").show();
    $("#profileChart").hide();
    var profileHeight = $("#viewpointMain").height();
    if($("#viewpointMain").css("display") != "none"){
        setTableView(false,profileHeight);
    }
}

//设置视点面板是否显示show:true显示，show:false不显示
function setTableView(show,height){
    if(!height){
        height = 135;
    }
    $("#viewpointMain").height(height);
	if(show){
        $("#viewpointMain").css("height",height)
		$("#viewpointMain").show();
		$("#MapTwo").height($("#MapTwo").height() - height);
	}else{
		$("#MapTwo").height($("#MapTwo").height() + height);
		$("#viewpointMain").hide();
	}
}

//设置左侧图层面板是否显示show:true显示，show:false不显示
function setLayerShow(show){
    bLayerVisible = show;
    if(show){
        $("#leftPanel").show();
        $("#mainEarth").css("margin-left","255px");
        $("#id_tree_body").height($("#id_left_layerTree").height() - $("#layerHeader").height() - $("#layer_title").height());

        if(dialogId){
            closeDialog();
        }
    }else{
        if(dialogId){
            BalloonHtml.setItemStyle("LayerManager");
            bLayerVisible = true;
            closeDialog();
            return;
        }
        $("#leftPanel").hide();
        $("#mainEarth").css("margin-left","0px");
    }
}

/*-----------------页面布局相关 END----------------------*/

$(function(){
	$("#userdataTitle").click(function(){
		if($("#userdataTitle").hasClass("active")){
			return;
		}else{
			$("#layerTreeTitle").removeClass("active");
			$("#userdataTitle").addClass("active");
			$("#layerTree").hide();
			$("#userdataTree").show();
		}
	});
	$("#layerTreeTitle").click(function(){
		if($("#layerTreeTitle").hasClass("active")){
			return;
		}else{
			$("#userdataTitle").removeClass("active");
			$("#layerTreeTitle").addClass("active");
			$("#userdataTree").hide();
			$("#layerTree").show();
		}
	})
});

var SystemSetting = {
    /**
     * 功能：初始化系统参数对象
     * 参数：无
     * 返回值：无
     */
    initSystemParam: function(earth) {
        if (SYSTEMPARAMS) {
            SYSTEMPARAMS = this.getSystemConfig();
        }
        if (SYSTEMPARAMS.project != "") {
            if (SYSTEMPARAMS.Position != "" && SYSTEMPARAMS.Position) {
                var longitude = SYSTEMPARAMS.Position.split(",")[0];
                var latitude = SYSTEMPARAMS.Position.split(",")[1];
                var altitude = SYSTEMPARAMS.Position.split(",")[2];
                var tilt = SYSTEMPARAMS.Position.split(",")[3];
                var heading = SYSTEMPARAMS.Position.split(",")[4];
                var roll = SYSTEMPARAMS.Position.split(",")[5];
                var range = SYSTEMPARAMS.Position.split(",")[6];
                earth.GlobeObserver.GotoLookat(longitude, latitude, altitude, heading, tilt, roll, range);
            }
            var layer = earth.LayerManager.GetLayerByGUID(SYSTEMPARAMS.project);
            if (layer) {
                //服务端属性配置开始！
                var projectSetting = layer.ProjectSetting;
                var fieldMap = projectSetting.FieldMapFile; //字段映射配置文件
                var valueMap = projectSetting.ValueMapFile; //值域映射文件
                var spatialRef = projectSetting.SpatialRefFile; //空间参考文件
                SYSTEMPARAMS.pipeFieldMap = fieldMap;

                if (fieldMap != "") {
                    if (/http/ig.test(fieldMap.substring(0, 4))) {
                        var filedPath = fieldMap;
                    } else {
                        var filedPath = "http://" + fieldMap.substr(2).replace("/", "/sde?/") + "_sde";
                    }
                    //fieldMap字段映射
                    earth.Event.OnEditDatabaseFinished = function(pRes, pFeature) {
                        if (pRes.ExcuteType == excuteType) {
                            SYSTEMPARAMS.pipeFieldMap = loadXMLStr(pRes.AttributeName);
                            createFieldMapObj();
                            if (valueMap != "") {
                                var vPath = "";
                                if (valueMap.indexOf("http") >= 0) {
                                    vPath = valueMap;
                                } else {
                                    vPath = "http://" + valueMap.substr(2).replace("/", "/sde?/") + "_sde";
                                }
                                //valueMap值域映射
                                earth.Event.OnEditDatabaseFinished = function(pRes, pFeature) {
                                    if (pRes.ExcuteType == excuteType) {
                                        SYSTEMPARAMS.valueMap = loadXMLStr(pRes.AttributeName); //初始化编码映射文件对象
                                    }
                                }
                                earth.DatabaseManager.GetXml(vPath);
                            }
                        }
                    }
                    earth.DatabaseManager.GetXml(filedPath);
                }

                if (spatialRef != "") {
                    if (/http/ig.test(spatialRef.substring(0, 4))) {
                        var spatialUrl = spatialRef;
                    } else {
                        var spatialUrl = "http://" + spatialRef.substr(2).replace("/", "/sde?/") + "_sde";
                    }
                    if (chkFile(spatialUrl)) {
                        SYSTEMPARAMS.pipeDatum =   CoordinateTransform.createDatum(spatialUrl);
                        SYSTEMPARAMS.spatialUrl = spatialUrl;
                        earth.Event.OnDocumentUpdate = function(res) {
                            //修改坐标显示单位 如果当前工程范围内 就转坐标 否则显示经纬度
                            var earthPose = earth.GlobeObserver.TargetPose;
                            var lon = earthPose.Longitude;
                            var lat = earthPose.Latitude;
                            var alt = earth.GlobeObserver.Pose.Altitude;
                            var pXY =   CoordinateTransform.createDatum(spatialUrl).des_BLH_to_src_xy(lon, lat, alt);
                            var layerBounds = layer.ProjectSetting.LonLatRect;
                            var layerMaxHeight = layerBounds.MaxHeight; //图层的最大可见高度
                            if (alt <= (layerMaxHeight + 10000) && lon >= layerBounds.West && lon <= layerBounds.east && lat >= layerBounds.South && lat <= layerBounds.North) {
                                earth.Environment.UseLocalCoord = true;
                                earth.Environment.SetLocalCoord(pXY.x, pXY.y);
                            } else {
                                earth.Environment.UseLocalCoord = false;
                            }
                        }
                    }
                } else {
                    SYSTEMPARAMS.pipeDatum = "";
                }
            }
        } else {
            SYSTEMPARAMS.pipeConfigDoc = "";
            SYSTEMPARAMS.pipeDatum = "";
            SYSTEMPARAMS.pipeFieldMap = "";
        }
    },

    /**
     * 功能：初始化系统配置文件内容
     * 参数：无
     * 返回值：初始化的系统配置文件内容
     */
    initSystemConfig: function(id) {
        var configXml = '<xml>';
        if (id) {
            configXml = configXml + '<Project>' + id + '</Project>'; //project
        } else {
            configXml = configXml + '<Project></Project>'; //project
        }
        configXml = configXml + '<Position></Position></xml>';
        return configXml;
    },

    /**
     * 功能：获取系统配置参数
     * 参数：无
     * 返回值：系统配置参数
     */
    getSystemConfig: function() {
        var rootPath = earth.Environment.RootPath + "temp\\SystemConfig";
        var configPath = rootPath + ".xml";
        var configXml = earth.UserDocument.LoadXmlFile(configPath);
        if (configXml === "") {
            configXml = this.initSystemConfig();
            earth.UserDocument.SaveXmlFile(rootPath, configXml);
        }
        var systemDoc = loadXMLStr(configXml);
        var systemJson = $.xml2json(systemDoc);
        if (systemJson == null) {
            return false;
        }
        if (systemJson.Project == "" || systemJson.Project.length != 36 || systemJson.Position == null) { //如果工程不存在，默认选第一个
            var pipeProjArr = SystemSetting.getProjectList();
            if (pipeProjArr.length > 0) {
                var obj = {
                    project: pipeProjArr[0].id
                };
                earth.UserDocument.DeleteXmlFile(configPath);
                var newXml = this.initSystemConfig(pipeProjArr[0].id);
                earth.UserDocument.SaveXmlFile(rootPath, newXml);
            }

        }
        //////////////////////////////////////////////////////////
        //IE9 不支持selectSingleNode
        //////////////////////////////////////////////////////////
        /*var root = systemDoc.documentElement;*/
        var systemData = {};
        systemData.project = systemJson.Project;
        systemData.Position = systemJson.Position;
        if(typeof systemJson.poiLayerId != 'undefined' && systemJson.poiLayerId != null){
            systemData.poiLayerId = systemJson.poiLayerId;
        }
        systemData.balloonAlpha = systemJson.BalloonAlpha;
        return systemData;
    },

    /**
     * 功能：设置系统配置参数
     * 参数：systemData-系统配置参数
     * 返回值：无
     */
    setSystemConfig: function(systemData) {
        var rootPath = earth.Environment.RootPath + "temp\\SystemConfig";
        var configPath = rootPath + ".xml";
        var configXml = earth.UserDocument.LoadXmlFile(configPath);
        var systemDoc = loadXMLStr(configXml);
        var root = systemDoc.documentElement;
        (root.getElementsByTagName("Project")[0]).text = systemData.project;
        //(root.getElementsByTagName("Ip")[0]).text = params.ip;
        (root.getElementsByTagName("Position")[0]).text = systemData.Position;
        if(root.getElementsByTagName("poiLayerId").length==0){
            newel=systemDoc.createElement('poiLayerId');
            newtext=systemDoc.createTextNode('');
            newel.appendChild(newtext);
            root.appendChild(newel);
        }
        if(systemData.poiLayerId!=null){
            (root.getElementsByTagName("poiLayerId")[0]).text = systemData.poiLayerId;
        }

        // htmlballoon alpha
        if(root.getElementsByTagName('BalloonAlpha').length == 0){
            var bn = systemDoc.createElement('BalloonAlpha');
            var bt = systemDoc.createTextNode('');
            bn.appendChild(bt);
            root.appendChild(bn);
        }
        if(systemData.balloonAlpha != null){
            root.getElementsByTagName('BalloonAlpha')[0].text = systemData.balloonAlpha;
        }
        earth.UserDocument.SaveXmlFile(rootPath, systemDoc.xml);
    },

    /**
     * 功能：获得项目列表
     * 参数：无
     * 返回值：项目列表
     */
    getProjectList: function() {
        var projectList = [];
        var rootLayerList = earth.LayerManager.LayerList;
        var projectCount = rootLayerList.GetChildCount();
        for (var i = 0; i < projectCount; i++) {
            var childLayer = rootLayerList.GetChildAt(i);
            var layerType = childLayer.LayerType;
            var pipeTag = false;
            if (layerType === "Project" && !pipeTag) { //17
                var projectId = childLayer.Guid;
                var projectName = childLayer.Name;
                var chlildrenCount = childLayer.GetChildCount();
                projectList.push({
                    id: projectId,
                    name: projectName
                });
            }
        }
        return projectList;
    }

};

var chkFile = function(fileURL) {
    return true;
}

//-----------------------------------------------------------------
//--坐标转换对象创建 - 开始
//-----------------------------------------------------------------
var CoordinateTransform = {
    sysDatum: null, //系统内部的坐标转换对象

    /**
     * 功能：获取系统内部的坐标转换对象
     */
    getSystemDatum: function() {
        if (this.sysDatum == null) {
            this.sysDatum = this.createDatum();
        }
        return this.sysDatum;
    },
    getRootPath: function() {
        var pathName = window.document.location.pathname;
        var localhost = window.location.host;
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhost + projectName);
    },
    /**
     * 功能：创建空间坐标转换对象
     */
    createDatum: function(spatialUrl) {

        var projectId =   SYSTEMPARAMS.project;
        var projLayer = SystemSetting.earth.LayerManager.GetLayerByGUID(projectId);
        var spatialUrl = projLayer.ProjectSetting.SpatialRefFile;
        if(this.sysDatum)
            return this.sysDatum;
        var filePath = SystemSetting.earth.Environment.RootPath+"\\temp\\spatialFile";
        SystemSetting.earth.UserDocument.SaveFile(spatialUrl,"spatialFile");
        var dataProcess = top.getDataProcessIndex();
        dataProcess.Load();
        var spatial = dataProcess.CoordFactory.CreateSpatialRef();
        spatial.InitFromFile(filePath);
        SystemSetting.earth.UserDocument.DeleteFile (filePath);
        var datum = dataProcess.CoordFactory.CreateDatum(); //earth.Factory.CreateDatum();
        datum.Init(spatial);
        this.sysDatum = datum;
        return datum;
    }
};

//common function -------------start
function pictureHtml(tag, sAltitudeType) {
    var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    var url = "";
    var dval;
    var ztree = $.fn.zTree.getZTreeObj("userdataTree");
    var width = 270,
        height = 240;
    if (tag === "mScreenShot") {
        url = loaclUrl + "/html/view/screenShot.html";
        dval = earth;
        height = 300;
        width = 322;
    } else if (tag === "pictures") {
        url = loaclUrl + "/html/view/pictures.html";
        dval = earth;
        height = 473;
        width = 322;
    } else if (tag === "move") {
        url = loaclUrl + "/html/userdata/objectEdit.html?action=move";
        dval = earth;
        height = 226;
        width = 274;
        dval.cameraArr =   cameraArr;
        dval.editDataArr = editDataArr;
        dval.ztree = ztree;
        dval.objArr =   objArr;
    } else if (tag === "scale") {
        url = loaclUrl + "/html/userdata/objectEdit.html?action=scale";
        dval = earth;
        height = 226;
        width = 274;
        dval.cameraArr =   cameraArr;
        dval.editDataArr = editDataArr;
        dval.ztree = ztree;
        dval.objArr =   objArr;
    } else if (tag === "rotate") {
        url = loaclUrl + "/html/userdata/objectEdit.html?action=rotate";
        dval = earth;
        height = 226;
        width = 274;
        dval.cameraArr =   cameraArr;
        dval.editDataArr = editDataArr;
        dval.ztree = ztree;
        dval.objArr =   objArr;
    }
    clearGlobalBalloons();
    picturesBalloons = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "屏幕坐标窗体URL");
    picturesBalloons.SetScreenLocation(width/2 + 80, 0);
    picturesBalloons.SetRectSize(width, height);
    picturesBalloons.SetIsAddBackgroundImage(false);
    picturesBalloons.ShowNavigate(url);
    earth.Event.OnDocumentReadyCompleted = function(guid) {
        dval.htmlBallon = picturesBalloons;
        if (picturesBalloons.Guid = guid) {
            picturesBalloons.InvokeScript("setTranScroll", dval);
            picturesBalloons.InvokeScript("altitudetype", sAltitudeType);
        }
    };
    Stamp.Tools.OnHtmlBalloonFinishedFunc(picturesBalloons.Guid,function(id){

        if (picturesBalloons != null && id === picturesBalloons.Guid){
            picturesBalloons.DestroyObject();
            picturesBalloons = null;
            dval.ShapeCreator.Clear();
        }
    });
};
//弹出可拖动气泡
function showMoveHtmlBalloon(id){
    var analysis = STAMP.Analysis(LayerManagement.earth);
    analysis.showMoveHtml(id);
}

//判断编辑的是摄像头还是element
var editCameraOrElement = function(editFlag) {
    var selectSet = earth.SelectSet;
    for (var i = 0; i < selectSet.GetCount(); i++) {
        var element = selectSet.GetObject(i);
        if (!element.Aspect) {
            if (editFlag === "move") {
                pictureHtml("move");
            } else if (editFlag === "scale") {
                pictureHtml("scale");
            } else if (editFlag === "rotate") {
                pictureHtml("rotate");
            }
        }
    }
    earth.Event.OnselectChanged = function() {
        var selectSet = earth.SelectSet;
        var bShow = true;
        var sAltitudeType = true;
        for (var i = 0; i < selectSet.GetCount(); i++) {
            var element = selectSet.GetObject(i);
            if (element.Aspect) {
                bShow = false;
            }
            if (element.AltitudeType == "1" || element.AltitudeType == "5") {
                sAltitudeType = false;
            }

            if(element.Rtti == 238){
                if(editFlag == 'move'){
                    sAltitudeType = true;
                }else{
                    sAltitudeType = false;
                }
            }
        }
        if (bShow && earth.selectSet.GetCount() != 0) {
            if (editFlag === "move") {
                pictureHtml("move", sAltitudeType);
            } else if (editFlag === "scale") {
                pictureHtml("scale", sAltitudeType);
            } else if (editFlag === "rotate") {
                pictureHtml("rotate", sAltitudeType);
            }
        }
        earth.Event.OnselectChanged = function() {};
    }
}

//清除全局气泡
function clearGlobalBalloons(){
    if (picturesBalloons != null) {
        picturesBalloons.DestroyObject();
        picturesBalloons = null;
    }
    if (htmlBalloonMove != null) {
        htmlBalloonMove.DestroyObject();
        htmlBalloonMove = null;
    }
}
//common function -------------start
