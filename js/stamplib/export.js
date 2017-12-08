/*
 * 模块：矢量导出
 */
var dataPro;
var datum;

if (!STAMP) {
    var STAMP = {};
}

/**
 * 导出shape文件
 * @param  {[type]} usearth        [description]
 * @param  {[type]} savePath       [description]
 * @param  {[type]} spatialRefPath [description]
 * @return {[type]}                [description]
 */
STAMP.ExportSHP = function(usearth, savePath, spatialRefPath, coordinates, type) {

    var exportSHP = {};
    var rawPoint = null;
    var latObj;
    //导出shape
    var _exportFileToShape = function() {
        var fileNameTemp = savePath.split("\\");
        var tempA = fileNameTemp[fileNameTemp.length - 1];

        //载入数据处理对象
        dataPro = document.getElementById("dataProcess");
        dataPro.Load();

        //加载空间参考文件(投影变换)
        var spatialRef = dataPro.CoordFactory.CreateSpatialRef();
        spatialRef.InitFromFile(spatialRefPath);
        datum = dataPro.CoordFactory.CreateDatum();
        datum.init(spatialRef);

        //获取创建对象 传入要保存的文件位置
        var folderStr = savePath.slice(0, savePath.lastIndexOf("\\"));
        var writeData = getWriteDataSource(folderStr);
        //创建空间参考
        var spatialReference = dataPro.OGRDataProcess.OGRFactory.CreateOGRSpatialReference();
        var wkt = "PROJCS[\"Xian_1980_3_Degree_GK_CM_120E\",GEOGCS[\"GCS_Xian_1980\",DATUM[\"Xian_1980\",SPHEROID[\"Xian_1980\",6378140.0,298.257]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"False_Easting\",500000.0],PARAMETER[\"False_Northing\",0.0],PARAMETER[\"Central_Meridian\",120.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]";
        spatialReference.ImportFromWkt(wkt);

        //创建layer
        var layer;
        var tipText = "";
        if (type === 211) {//面
            tipText = "面数据";
            layer = writeData.CreateLayer(tempA, spatialReference, 3);
        } else if (type === 220) {//线
            tipText = "线数据";
            layer = writeData.CreateLayer(tempA, spatialReference, 2);
        }else if (type === 209) {//点增加
            tipText = "点数据";
            layer = writeData.CreateLayer(tempA, spatialReference, 1);
        }
        var attributes = [];
        attributes.push({
            key: "GUID",
            value: "1234-5678-90",
            type: 4
        }, {
            key: "name",
            value: "北京",
            type: 4
        }, {
            key: "height",
            value: 10.0,
            type: 0
        });
        var fields = addFieldToLayer(layer, attributes);

        if (coordinates instanceof Array) {
            createFeatures(layer, coordinates, attributes, fields, type);
        } else {
            var feature = createFeature(coordinates, attributes, fields);
            layer.SetFeature(feature);
        }
        //保存到本地shape文件
        layer.SyncToDisk();
        dataPro.Suicide();
        alert(tipText + "数据导出成功!");
        $("#exportShape").attr("disabled", false);
        $("#clear").attr("disabled", false);
        $("#saveLinePath").val("");
        $("#savePolygonPath").val("");
        $("#savePointPath").val("");
        $("#referenceInput").val("");
    }

    /**
     * 导出文件
     * @param  {[type]} shapePath      [description]
     * @param  {[type]} spatialRefPath [description]
     * @param  {[type]} layerType      [description]
     * @return {[type]}                [description]
     */
    var _importFile = function(shapePath, spatialRefPath, layerType, userdata,thisDatum) {
        //载入数据处理对象
        dataPro = document.getElementById("dataProcess");
        dataPro.Load();
        var ogrDataProcess = dataPro.OGRDataProcess;
        //参见接口tagSEOGRRegisterDriverType枚举类型 44 shape 7 dxf 8 dwg
        var driver;
        switch (layerType) {
            case "shp":
                driver = ogrDataProcess.GetDriverByType(44);
                break;
            case "dxf":
                driver = ogrDataProcess.GetDriverByType(7);
                break;
            default:
                break;
        };

        if(!driver){//非shp和dxf时直接返回
            return;
        }
        //SHAPE的路径
        var readData = driver.Open(shapePath, 0);
        var layerNum = readData.GetLayerCount();
        if(spatialRefPath){
            //加载空间参考文件(投影变换)
            var spatialRef = dataPro.CoordFactory.CreateSpatialRef();
            spatialRef.InitFromFile(spatialRefPath); //支持如下写法
            datum = dataPro.CoordFactory.CreateDatum();
            datum.init(spatialRef);
        }else{
            datum = thisDatum;
        }
        

        var readLayer;
        var lonLat;
        for (var i = 0; i < layerNum; i++) {
            readLayer = readData.GetLayer(i);
            var type = 0;
            var featureNum = readLayer.GetFeatureCount();
            for (var j = 0; j < featureNum; j++) {
                //获取feature
                var feature = readLayer.GetFeature(j);
                type = feature.GetGeometryType();

                //获取feature对应的属性字段
                var featureDefn = feature.GetFeatureDefn();

                //获取空间信息
                var v3s;
                var guid = usearth.Factory.CreateGUID();
                var element;

                //判断几何类型 参见SEWkbGeometryType枚举类型
                if (type === 3 || type === 403 || type == -2147483645 || type === 1027) { // 面
                    var poly = feature.GetPolygon();
                    v3s = transformPolygon(poly);
                    
                    var beginPoint = v3s.Items(0);
                    lonLat = [beginPoint.X, beginPoint.Y, beginPoint.Z];
                    if(spatialRefPath){
                        element = usearth.Factory.CreateElementPolygon(guid, "测试");
                        element.name = "polygon";
                        element.BeginUpdate();
                        element.FillStyle.FillColor = parseInt("0x" + "3200ff00");
                        element.LineStyle.LineColor = parseInt("0x" + "ffffff00");
                        element.SetExteriorRing(v3s);
                        element.AltitudeType = 1;
                    }
                } else if (type === 2 || type === 402) { //线
                    var lineString = feature.GetLineString();
                    v3s = transformLinearRing(lineString);
                    //todo:该处的代码需要优化一下......
                    var lineVects = usearth.Factory.CreateVector3s();
                    for (var k = 0; k < v3s.length; k++) {
                        var v = v3s[k];
                        var v3 = usearth.Factory.CreateVector3();
                        v3.X = v.X;
                        v3.Y = v.Y;
                        v3.Z = v.Z;
                        lineVects.AddVector(v3);
                        if (k === 0) {
                            lonLat = [v3s[0].X, v3s[0].Y, v3s[0].Z];
                        };
                    }
                    if(spatialRefPath){
                        element = usearth.Factory.CreateElementLine(guid, "测试");
                        element.name = "line";
                        element.BeginUpdate();
                        element.LineStyle.LineColor = parseInt("0x" + "ffffff00");
                        element.LineStyle.LineWidth = 1;
                        element.SetPointArray(lineVects);
                        element.AltitudeType = 1;
                    }
                } else if (type === 1 || type === 401 || type === 1025) { //点
                    var point = feature.GetPoint();
                    rawPoint = TransformPoint(point);
                    var pointAlt = usearth.Measure.MeasureAltitude(rawPoint.X,rawPoint.Y);
                    rawPoint.Z = pointAlt;
                    if(spatialRefPath){
                        var iconPath = usearth.Environment.RootPath + "userdata\\icon.png"
                        element = usearth.Factory.CreateElementIcon(guid,"icon");
                        element.name = "point";
                        element.BeginUpdate();
                        element.textFormat = parseInt("0x100");
                        element.textColor = parseInt("0xffffffff");
                        element.showHandle = false;
                        element.handleHeight = 2;
                        element.handleColor = parseInt("0xffffffff");
                        element.minVisibleRange = 0;
                        element.maxVisibleRange = 100;
                        element.LineSize = 7;
                        element.Create(rawPoint.X,rawPoint.Y,pointAlt,iconPath,iconPath,"point")

                    }
                }

                if (element && spatialRefPath) {
                    
                    element.Visibility = true;
                    element.EndUpdate();
                    usearth.AttachObject(element);

                    //保存到本地xml中
                    createElementLocal(element);

                    //还要添加到userdataAry数组中 否则右键不会立即生效
                    userdata.addElementFromOuter(element);

                    //添加到树显示列表中
                    var zTree = earth.userdataTree;
                    var root = zTree.getNodes()[0];
                    zTree.addNodes(root, {
                        id: element.guid,
                        pId: -1,
                        name: element.name,
                        checked: true
                    }, false);

                    var tempzTree = earth.tempUserdataTree;
                    if(tempzTree == null){
                        return;
                    }
                    var tempRootNode = tempzTree.getNodes()[0];
                    tempzTree.addNodes(tempRootNode, {
                        id: element.guid,
                        pId: -1,
                        name: element.name,
                        checked: true
                    }, false);
                }
            }
        }
        
        $("#selectPath").attr("disabled", false);
        $("#selectImg").attr("disabled", false);
        $("#referenceInput").attr("disabled", false);
        $("#selectSpat").attr("disabled", false);
        $("#importBtn").attr("disabled", false);
        $("#clear").attr("disabled", false);
        if(thisDatum){//代表是从挖填方分析来调用的
            if(ve3){
                alert("导入成功!");
                return v3s;
            }else{
                alert("导入失败");
                return false;
            }
            
        }else{
           alert("添加成功!"); 
        }
    }

    /**
     * 添加到userdata中
     * @return {[type]} [description]
     */
    var createElementLocal = function(element) {
        var rootxml = getUserdata(filename);

        var xmlData = createElementXml(element);
        var xmlDoc = loadXMLStr("<xml>" + xmlData + "</xml>");

        var lookupNode = null;

        if (rootxml.childNodes.length > 1) {
            lookupNode = rootxml.childNodes[rootxml.childNodes.length - 1].firstChild;
        } else {
            lookupNode = rootxml.documentElement.firstChild;
        }
        lookupNode.appendChild(xmlDoc.documentElement.firstChild);

        var root = usearth.Environment.RootPath + "userdata\\" + filename;
        usearth.UserDocument.saveXmlFile(root, rootxml.xml);
    }

    var filename = "MyPlace";
    var getUserdata = function(filename) {
        var url = usearth.Environment.RootPath + "userdata\\" + filename + ".xml";
        var xmlData = usearth.UserDocument.loadXmlFile(url); // 得到xml数据；
        if (xmlData == "") {
            var userdataGUID = usearth.Factory.createGuid();
            var userdataXml = "<Xml><ElementDocument id='" + userdataGUID + "' name='MyPlace' im0='folderOpen.gif' type='folder' checked='0' open='false'></ElementDocument></Xml>";
            var userdata = usearth.Environment.RootPath + "userData\\" + filename;
            usearth.UserDocument.saveXmlFile(userdata, userdataXml);
            xmlData = userdataXml;
        }
        return loadXMLStr(xmlData);
    }

    var loadXMLStr = function(xmlStr) {
        var xmlDoc;

        try {
            if (window.ActiveXObject || window.ActiveXObject.prototype) {
                var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM', 'MSXML2.DOMDocument'];
                for (var i = 0; i < activeX.length; i++) {
                    try {
                        xmlDoc = new ActiveXObject(activeX[i]);
                        xmlDoc.async = false;
                        break;
                    } catch(e) {
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
    };

    var createElementXml = function(element) {
        var xmlData = "";
        xmlData += "<Element id='" + element.guid + "' name='" + element.name + "' shadow_cast='1' type='" + element.rtti + "' checked='1' >";
        xmlData += " <Visibility>true</Visibility>";
        xmlData += " <Description></Description>";
        
        xmlData += " <RenderStyle>";
        if(element.rtti != 209){
            var lineColor = "#" + element.LineStyle.LineColor.toString(16);
            xmlData += "  <LineColor>" + lineColor + "</LineColor>";
            xmlData += "  <LineWidth>" + element.LineStyle.LineWidth + "</LineWidth>";
            if (element.FillStyle) {
                xmlData += "  <FillColor>" + "#" + element.FillStyle.FillColor.toString(16) + "</FillColor>";
            }

            xmlData += "  <ShadowStyle>";
            //alert(obj.shadow);
            xmlData += "   <ShadowType>" + element.AltitudeType + "</ShadowType>";
            xmlData += "   <ShadowColor>" + lineColor + "</ShadowColor>";
            //贴地模式记录
            if(element.rtti == 220 || element.rtti == 211 || element.rtti == 245){
                xmlData += "   <ClampAltitudes>";
                var altStr = '';
                if(element.AltitudeType == 1){
                    var altitudes = element.GetClampAltitude();
                    if(altitudes != null && altitudes.Count > 0){
                        for(var m = 0; m < altitudes.Count; m++){
                            var alt = altitudes.GetAt(m);
                            if(altStr != ''){
                                altStr += ',';
                            }
                            altStr += alt;
                        }
                    }
                }
                xmlData += altStr + '</ClampAltitudes>';
            }
            xmlData += "  </ShadowStyle>";

            xmlData += "  <Selectable>" + element.selectable + "</Selectable>";
            xmlData += "  <Editable>" + element.editable + "</Editable>";
            xmlData += " <DrawOrder>" + element.drawOrder + "</DrawOrder>";
            var vector3s = "";
            if (element.rtti === 220) {
                xmlData += "  <isShadowArrow>" + element.IsAddArrow + "</isShadowArrow>";
                xmlData += "  <Length>" + element.Length + "</Length>";
                vector3s = element.GetPointArray();
            } else if (element.rtti === 211) {
                vector3s = element.GetExteriorRing();
            }

            if (element.rtti === 211) {
                xmlData += "  <Perimeter>" + element.Perimeter + "</Perimeter>";
                xmlData += "  <Area>" + element.Area + "</Area>";
            }
        
            var ptString = "";
            for (var i = 0; i < vector3s.Count; i++) {
                ptString += " " + vector3s.Items(i).x + "," + vector3s.Items(i).y + "," + vector3s.Items(i).z;
            }
            xmlData += " <Coordinates>" + ptString + "</Coordinates>";
        }

        xmlData += " </RenderStyle>";
        if (element.rtti === 209) { //icon
            var iconPath = usearth.Environment.RootPath +"userdata\\icon.png";
            xmlData += " <RenderStyle type='normal'>";
            xmlData += "  <Icon>" + iconPath + "</Icon>";
            xmlData += " </RenderStyle>";
            xmlData += " <RenderStyle type='selected'>";
            xmlData += "  <Icon>" + iconPath + "</Icon>";
            xmlData += " </RenderStyle>";
            xmlData += " <Location>" + rawPoint.X + "," + rawPoint.Y + "," + rawPoint.Z + "</Location>";
            //新增属性
            xmlData += "  <TextFormat>#100</TextFormat>";
            xmlData += "  <TextColor>#ffffffff</TextColor>";
            xmlData += "  <TextHorizontalScale>" + element.TextHorizontalScale + "</TextHorizontalScale>";
            xmlData += "  <TextVerticalScale>" + element.TextVerticalScale + "</TextVerticalScale>";
            xmlData += "  <ShowHandle>" + element.ShowHandle + "</ShowHandle>";
            xmlData += "  <HandleHeight>" + element.HandleHeight + "</HandleHeight>";
            xmlData += "  <HandleColor>#ffffffff</HandleColor>";
            xmlData += "  <MinVisibleRange>" + element.minVisibleRange + "</MinVisibleRange>";
            xmlData += "  <MaxVisibleRange>" + element.maxVisibleRange + "</MaxVisibleRange>";
            xmlData += "  <Selectable>" + element.selectable + "</Selectable>";
            xmlData += "  <Editable>" + element.editable + "</Editable>";

        }

        var Rotation = element.SphericalTransform.GetRotation();
        var Scale = element.SphericalTransform.GetScale();
        var Position = element.SphericalTransform.GetLocation();

        xmlData += " <ControlParams>";
        xmlData += "    <Rotation>" + Rotation.X + "," + Rotation.Y + "," + Rotation.Z + "</Rotation>";
        xmlData += "    <Scale>" + Scale.X + "," + Scale.Y + "," + Scale.Z + "</Scale>";
        xmlData += "    <Position>" + Position.X + "," + Position.Y + "," + Position.Z + "</Position>";
        xmlData += " </ControlParams>";

        var heading = usearth.GlobeObserver.Pose.heading;
        var tilt = usearth.GlobeObserver.Pose.tilt;
        var range = usearth.GlobeObserver.PickRange();

        xmlData += " <LookAt>";
        xmlData += "  <Longitude>" + element.SphericalTransform.Longitude + "</Longitude>";
        xmlData += "  <Latitude>" + element.SphericalTransform.Latitude + "</Latitude>";
        xmlData += "  <Altitude>" + element.SphericalTransform.Altitude + "</Altitude>";
        xmlData += "  <Heading>" + heading + "</Heading>";
        xmlData += "  <Tilt>" + tilt + "</Tilt>";
        xmlData += "  <Range>" + range + "</Range>";
        xmlData += " </LookAt>";

        xmlData += "</Element>";
        return xmlData;
    };

    var getLocationObj = function() {
        if (latObj) {
            return latObj;
        }
        return null;
    }

    // 对线数据进行空间数据转换
    var transformPolygon = function(poly) {
        var inerLine = poly.GetExteriorRing();
        var wInerLine = transformLinearRing(inerLine);
        var v3s = usearth.Factory.CreateVector3s();
        for (var k = 0; k < wInerLine.length; k++) {
            var v = wInerLine[k];
            var v3 = usearth.Factory.CreateVector3();
            v3.X = v.X;
            v3.Y = v.Y;
            v3.Z = v.Z;
            v3s.AddVector(v3);
        }
        return v3s;
    }

    var transformLinearRing = function(line) {
        var result = [];
        var pointNum = line.GetPointsCount();
        for (var j = 0; j < pointNum; j++) {
            var point = line.GetPoint(j);
            var rawPoint = TransformPoint(point);
            result.push(rawPoint);
        }

        return result;
    }

    // 对点数据进行空间数据转换 平面转经纬度
    var TransformPoint = function(point) {
        var rawPoint = datum.src_xy_to_des_BLH(point.X, point.Y, 0);
        return rawPoint;
    }

    /**
     * 给layer赋属性字段
     * @param {[type]} layer      [description]
     * @param {[type]} attributes [description]
     */
    function addFieldToLayer(layer, attributes) {
        result = [];
        for (var m = 0; m < attributes.length; m++) {
            var field = attributes[m]["key"];
            //alert(field);
            var fieldDefnWrite1 = dataPro.OGRDataProcess.OGRFactory.CreateSEOGRFieldDefn(field, attributes[m]["type"]);
            layer.CreateField(fieldDefnWrite1);

            result.push(fieldDefnWrite1);
        }
        return result;
    }

    var addRings = function(part, polygon, isMult) {
        var linearRing = dataPro.OGRDataProcess.OGRFactory.CreateOGRLinearRing();
        var vecs = part.split(" ");
        for (var j = 0; j < vecs.length; j++) {
            var v3 = dataPro.OGRDataProcess.OGRFactory.CreateOGRPoint();
            var part = vecs[j].split(",");
            v3.X = part[0];
            v3.Y = part[1];
            v3.Z = part[2];
            var pt = datum.des_BLH_to_src_xy(v3.X, v3.Y, 0);
            linearRing.SetPointOfXYZ(j, pt.X, pt.Y, part[2]); //这里直接保存z值
        }
        //如果有多个part
        if (isMult) {
            var partPolygon = dataPro.OGRDataProcess.OGRFactory.CreateOGRPolygon();
            partPolygon.AddRing(linearRing);
            polygon.AddGeometry(partPolygon);
        } else {
            polygon.AddRing(linearRing);
        }
        return polygon;
    };
    /*
     * 增加点数据处理
     * */
    var addPoints = function(part, point) {
        var vecs = part.split(" ");
        for (var j = 0; j < vecs.length; j++) {
            var v3 = dataPro.OGRDataProcess.OGRFactory.CreateOGRPoint();
            var part = vecs[j].split(",");
            v3.X = part[0];
            v3.Y = part[1];
            v3.Z = part[2];
            var pt = datum.des_BLH_to_src_xy(v3.X, v3.Y, 0);
            point.X = pt.X;
            point.Y = pt.Y;
            point.Z = part[2];
        }
        return point;
    }
    var addLineRings = function(part, line) {
        var vecs = part.split(" ");
        for (var j = 0; j < vecs.length; j++) {
            var v3 = dataPro.OGRDataProcess.OGRFactory.CreateOGRPoint();
            var part = vecs[j].split(",");
            v3.X = part[0];
            v3.Y = part[1];
            v3.Z = part[2];
            var pt = datum.des_BLH_to_src_xy(v3.X, v3.Y, 0);
            line.SetPointOfXYZ(j, pt.X, pt.Y, part[2]);
        }
        return line;
    }

    function createFeatures(layer, vects, attributes, fields, type) {

        if (vects instanceof Array) {

            for (var i = vects.length - 1; i >= 0; i--) {
                var name = "feature";
                var ogrDataProcess = dataPro.OGRDataProcess;
                //创建要素属性 从layer中把字段赋值过来
                var featureDefn = ogrDataProcess.OGRFactory.CreateFeatureDefn(name);
                for (var f = 0; f < fields.length; f++) {
                    featureDefn.AddFieldDefn(fields[f]);
                }

                //创建Feature要素(关联要素属性表)
                var feature = ogrDataProcess.OGRFactory.CreateFeature(featureDefn);

                //创建面或者线对象
                if (type === 211) { //面
                    var polygon = dataPro.OGRDataProcess.OGRFactory.CreateOGRPolygon();
                    var part = vects[i];
                    polygon = addRings(part, polygon);
                    feature.SetGeometryDirectly(polygon);
                } else if (type === 220) { //线
                    var line = dataPro.OGRDataProcess.OGRFactory.CreateOGRLineString();
                    var part = vects[i];
                    line = addLineRings(part, line);
                    feature.SetGeometryDirectly(line);
                }else if (type === 209) {
                    var point = dataPro.OGRDataProcess.OGRFactory.CreateOGRPoint();
                    var part = vects[i];
                    point = addPoints(part, point);
                    feature.SetGeometryDirectly(point);
                }

                //给feature的字段赋值
                for (var m = 0; m < attributes.length; m++) {
                    var fieldValue = attributes[m]["value"];
                    var fieldType = attributes[m]["type"];
                    var fieldWrite = dataPro.OGRDataProcess.OGRFactory.CreateOGRField(fieldType); //string
                    if (fieldType === 4) { //string
                        fieldWrite.SetFieldAsString(fieldValue);
                    } else if (fieldType === 0) { //int
                        fieldWrite.SetFieldAsInteger(fieldValue);
                    } else if (fieldType === 2) { //float
                        fieldWrite.SetFieldAsDouble(fieldValue);
                    }

                    feature.SetField(m, fieldWrite);
                }
                layer.SetFeature(feature);
            };
        }
    }

    /**
     * 创建Feaure要素
     * 这里都导出为一个layer
     * 该接口暂时废弃
     * @param  {[type]} vects      [description]
     * @param  {[type]} attributes [description]
     * @param  {[type]} fields     [description]
     * @return {[type]}            [description]
     */
    function createFeature(vects, attributes, fields) {

        var name = "feature";
        var ogrDataProcess = dataPro.OGRDataProcess;
        //创建要素属性 从layer中把字段赋值过来
        var featureDefn = ogrDataProcess.OGRFactory.CreateFeatureDefn(name);
        for (var f = 0; f < fields.length; f++) {
            featureDefn.AddFieldDefn(fields[f]);
            //alert(fields[f]);
        }

        //创建Feature要素(关联要素属性表)
        var feature = ogrDataProcess.OGRFactory.CreateFeature(featureDefn);

        var polygon;
        if (vects instanceof Array) {
            //多个面情况 vects传入的为数组类型
            var polygon = dataPro.OGRDataProcess.OGRFactory.CreateOGRMultiPolygon();
            for (var i = vects.length - 1; i >= 0; i--) {
                var part = vects[i];
                polygon = addRings(part, polygon, true);
            };
        } else {
            //只有一个面的情况 vects传入的为字符串类型
            var polygon = dataPro.OGRDataProcess.OGRFactory.CreateOGRPolygon();
            polygon = addRings(vects, polygon);
        }

        //给feature设置polygon(空间对象)
        feature.SetGeometryDirectly(polygon);

        //给feature的字段赋值
        //var fieldCount = feature.getFieldCount();
        for (var m = 0; m < attributes.length; m++) {
            var fieldValue = attributes[m]["value"];
            var fieldWrite = dataPro.OGRDataProcess.OGRFactory.CreateOGRField(4); //string
            fieldWrite.SetFieldAsString(fieldValue);
            feature.SetField(m, fieldWrite);
        }

        return feature;
    }

    function getWriteDataSource(path) {
        var ogrDataProcess = dataPro.OGRDataProcess;
        var driver = ogrDataProcess.GetDriverByType(44);
        //这里的path路径在底层没有做最后的字符判断...底层问题 这里先在前端处理一下 底层要做容错性处理
        return driver.CreateDataSource(path);
    }

    exportSHP.exportFileToShape = _exportFileToShape;
    exportSHP.importFile = _importFile;
    exportSHP.getLocationObj = getLocationObj;
    return exportSHP;
}
