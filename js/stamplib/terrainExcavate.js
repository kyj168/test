var TerrainExcavate = {};
(function() {
    var _result = null; // 分析结果
    var tempClipModel = null,
        tempClipLayer = null,
        clipDepth = 0,
        level = 11,
        bufDist = 10,
        depth = 0,
        imgLocation = "http://" + getRootPath() + "/image/PipeMaterial/",
        profileTexturePath = imgLocation + "bottom.jpg";
    bottomTexturePath = imgLocation + "profile.jpg";

    function getRootPath() {
        var pathName = window.document.location.pathname;
        var localhost = window.location.host;
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhost + projectName);
    }

    var clear = function() {
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry = function() {};
    };
    var tempClipLayersList = [];
    //开挖
    var createNewLayer = function() {
        earth.Event.OnAnalysisFinished = function(res) {
            _result = res;
        };
        var tempDemPath = earth.Environment.RootPath + "\\temp\\terrain\\";
        var tempPolyPath = earth.Environment.RootPath + "\\temp\\polygon\\";
        var rect = earth.TerrainManager.GetTempLayerRect();
        var levelMin = earth.TerrainManager.GetTempLayerMinLevel();
        var levelMax = earth.TerrainManager.GetTempLayerMaxLevel();

        var guid = earth.Factory.CreateGUID();
        if (tempClipLayer != null) {
            earth.DetachObject(tempClipLayer);
            tempClipLayer = null;
        }
        tempClipLayer = earth.Factory.CreateDemLayer(guid, "TempTerrainLayer", tempDemPath,
            rect, levelMin, levelMax, 1000);
        earth.AttachObject(tempClipLayer);
        //tempClipLayersList.push(tempClipLayer);
    };
    var clipModelList = [];
    var createClipModel = function(args, modelGuid, modelName) {
        if (modelGuid == null) {
            modelGuid = earth.Factory.CreateGUID();
        }
        if (modelName == null) {
            modelName = "ClipModel";
        }
        var terrain = earth.TerrainManager;
        var sampArgs = terrain.GenerateSampledCoordinates(args);
        //这里的贴图没有设置 默认不起作用?
        tempClipModel = terrain.GenerateClipModel(modelGuid, modelName, args, sampArgs, profileTexturePath, bottomTexturePath);

        //earth.AttachObject(tempClipModel);
        clipModelList.push(tempClipModel);
        return tempClipModel;
    };
    var onCreatePolyline = function(pFeat, geoType) {
        clear();
        var pntNum = pFeat.Count;
        if (pntNum < 2) {
            alert("应至少取两个点以进行开挖!");
            return;
        }
        var height = pFeat.Items(0).Z;
        clipDepth = height - depth;
        var pntNum = pFeat.Count,
            i = 0,
            vec3 = null,
            gpts = earth.Factory.CreateGeoPoints();
        for (i = 0; i < pntNum; i++) {
            vec3 = pFeat.Items(i);
            gpts.Add(vec3.X, vec3.Y, clipDepth);
        }
        var bufferedPts = earth.GeometryAlgorithm.CreatePolygonFromPolylineAndWidth(gpts, bufDist, bufDist);

        var vec3s = earth.Factory.CreateVector3s();
        for (i = 0; i < bufferedPts.Count; i++) {
            var pt = bufferedPts.GetPointAt(i);
            vec3s.Add(pt.Longitude, pt.Latitude, pt.Altitude);
        }

        earth.TerrainManager.SetMinClipLevel(level);
        earth.TerrainManager.ClipTerrainByPolygon(vec3s);

        createNewLayer();
        var clipModel = createClipModel(vec3s);
        var id = clipModel.Guid;
        var name = clipModel.Name;
        createClipTerrainNode(id, name, level, vec3s);
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry = function() {};
    };
    /**
     * 道路开挖
     */
    var roadClip = function(pDepth, pLevel, dist) {
        // deleteTempTerrain();
        earth.Event.OnCreateGeometry = onCreatePolyline;
        earth.ShapeCreator.Clear();
        depth = parseFloat(pDepth);
        level = parseFloat(pLevel);
        bufDist = dist;
        earth.ShapeCreator.CreatePolyline(2, 255);
    };
    //自定义开挖
    var onCreatePolygon = function(pFeat, geoType) {
        clear();
        var pntNum = pFeat.Count;

        if (pntNum < 3) {
            alert("应至少取三个点以进行开挖!");
            $("#elevationValue").attr("disabled", false);
            $("#getElevation").attr("disabled", false);
            $("#excavationFill").attr("disabled", false);
            $("#hideTerrain").attr("disabled", true);
            $("#clear").attr("disabled", false);
            return;
        }
        var height = pFeat.Items(0).Z;
        //clipDepth = height - depth;
        clipDepth = depth;
        for (var i = 0; i < pntNum; i++) {
            pFeat.SetAt(i, pFeat.Items(i).X, pFeat.Items(i).Y, clipDepth);
        }

        earth.TerrainManager.SetMinClipLevel(level);
        earth.TerrainManager.ClipTerrainByPolygon(pFeat);
        if (tempClipLayer != null) {
            earth.DetachObject(tempClipLayer);
            tempClipLayer = null;
        }
        createNewLayer();

        var clipModel = createClipModel(pFeat);
        var id = clipModel.Guid;
        var name = clipModel.Name;
        createClipTerrainNode(id, name, level, pFeat);
        earth.ShapeCreator.Clear();
        earth.Event.OnCreateGeometry = function() {};
        $("#elevationValue").attr("disabled", false);
        $("#getElevation").attr("disabled", false);
        $("#excavationFill").attr("disabled", false);
        $("#hideTerrain").attr("disabled", false);
        $("#clear").attr("disabled", false);
    };
    /**
     * 自定义开挖
     */
    var customClip = function(pDepth, pLevel) {
        //deleteTempTerrain();
        earth.Event.OnCreateGeometry = onCreatePolygon;
        earth.ShapeCreator.Clear();
        depth = parseFloat(pDepth);
        level = parseFloat(pLevel);
        earth.ShapeCreator.CreatePolygon();
    };

    /**
     * 设置地形的可见性
     */
    var setClipTerrainVis = function(visibility) {
        debugger;
        for (var i = 0; i < clipModelList.length; i++) {
            var tempClipModel = clipModelList[i];//当前开挖地形
            tempClipModel.Visibility = visibility;
        }
        if (tempClipModel != []) {//开挖后生成的临时地形
            if (visibility == true) {
                earth.AttachObject(tempClipLayer);
            } else {
                earth.DetachObject(tempClipLayer);
            }
        }
    };

    /**
     * 删除临时地形
     */
    var deleteTempTerrain = function() {
        earth.ShapeCreator.Clear();
        earth.TerrainManager.ClearTempLayer();
        if (_result) {
            _result.ClearRes();
            _result = null;
        }
        if (clipModelList.length > 0) {
            for (var i = 0; i < clipModelList.length; i++) {
                var tempClipModel = clipModelList[i];
                if (tempClipModel != null) {
                    earth.DetachObject(tempClipModel);
                    deleteClipTerrainNode(tempClipModel.Guid);
                    tempClipModel = null;
                }
            }
        }
        clipModelList.splice(0, clipModelList.length);
        if (tempClipLayer != null) {
            earth.DetachObject(tempClipLayer);
            tempClipLayer = null;
        }

        tempClipLayersList.splice(0, tempClipLayersList.length);
    };

    function lookupNodeById(xmlData, id) {
        if (xmlData == undefined || xmlData == null) return null;

        var xmlDoc = null;
        if (typeof(xmlData) == "string") {
            xmlDoc = loadXMLStr(xmlData);
        } else {
            xmlDoc = xmlData;
        }

        var resultNode = null; //返回节点

        //判断当前元素
        var rootNode = xmlDoc.documentElement;

        if (rootNode != undefined) {
            for (var i = 0; rootNode.attributes != null && rootNode.attributes.length > 0 && i < rootNode.attributes.length; i++) {
                if (rootNode.attributes[i].name == "id" && rootNode.attributes[i].value == id) {
                    resultNode = rootNode;
                    return rootNode;
                }
            }
        } else {
            rootNode = xmlDoc;
        }

        for (var i = 0; rootNode != null && i < rootNode.childNodes.length; i++) {
            var node1 = rootNode.childNodes[i]; //子节点

            //判断当前元素
            if (node1.attributes != null && node1.attributes.length > 0) {
                for (var j = 0; j < node1.attributes.length; j++) {
                    if (node1.attributes[j].name == "id" && node1.attributes[j].value == id) {
                        resultNode = node1;
                        break;
                    }
                }
            }
            if (resultNode != null) break;

            //判断当前节点下的子元素
            if (node1.childNodes.length > 0) {
                resultNode = this.lookupNodeById(node1, id);
                if (resultNode != null) break;
            }
        }

        return resultNode;
    }

    /**
     * 功能：保存开挖信息信息
     * 参数：docXml-要保存的开挖信息信息
     * 返回：无
     */
    var saveClipTerrainFile = function(docXml) {
        var savePath = earth.Environment.RootPath + "temp\\clipterrain";
        earth.UserDocument.SaveXmlFile(savePath, docXml);
    };

    /**
     * 功能：创建开挖信息文档
     * 参数：无
     * 返回：新建创建的文档内容
     */
    var createClipTerrainFile = function() {
        var xmlStr = '<xml></xml>';
        saveClipTerrainFile(xmlStr);
        return xmlStr;
    };

    /**
     * 功能：获取开挖信息文档对象
     * 参数：无
     * 返回：开挖信息文档对象
     */
    var getClipTerrainFile = function() {
        var loadPath = earth.Environment.RootPath + "temp\\clipterrain.xml";
        var docXml = earth.UserDocument.LoadXmlFile(loadPath);
        if ((docXml == null) || (docXml == "")) {
            docXml = createClipTerrainFile();
        }
        var clipTerrainDoc = loadXMLStr(docXml);
        return clipTerrainDoc;
    };

    /**
     * 功能：创建开挖对象节点
     * 参数：id-开挖的模型对象的编号；name-开挖的模型对象的名称；minLevel-开挖地形的最小级别；clipVec3s-开挖地形的范围点集
     * 返回：开挖对象节点
     */
    var createClipTerrainNode = function(id, name, minLevel, clipVec3s) {
        var attrArr = [{
            name: "id",
            value: id
        }, {
            name: "name",
            value: name
        }];
        var clipCoordinate = "";
        for (var i = 0; i < clipVec3s.Count; i++) {
            var pt = clipVec3s.Items(i);
            if (clipCoordinate == "") {
                clipCoordinate = pt.X + "," + pt.Y + "," + pt.Z;
            } else {
                clipCoordinate = clipCoordinate + "," + pt.X + "," + pt.Y + "," + pt.Z;
            }
        }
        var clipTerrainDoc = TerrainExcavate.clipTerrainDoc;
        var clipTerrainNode = createElementNode("ClipTerrain", attrArr, clipTerrainDoc);
        clipTerrainNode.appendChild(createElementText("ClipCoordinate", clipCoordinate, clipTerrainDoc));
        clipTerrainNode.appendChild(createElementText("MinClipLevel", minLevel, clipTerrainDoc));
        clipTerrainDoc.documentElement.appendChild(clipTerrainNode);
        saveClipTerrainFile(clipTerrainDoc.xml);
        return clipTerrainNode;
    };

    /**
     * 功能：删除开挖对象节点
     * 参数：id-开挖的ID编号
     * 返回：无
     */
    var deleteClipTerrainNode = function(id) {
        var clipTerrainNode = lookupNodeById(TerrainExcavate.clipTerrainDoc, id);
        clipTerrainNode.parentNode.removeChild(clipTerrainNode);
        saveClipTerrainFile(TerrainExcavate.clipTerrainDoc.xml);
    };

    /**
     * 功能：初始化开挖列表，从开挖文档中读取信息并将信息转化成开挖对象
     * 参数：clipTerrainDoc-开挖文档对象
     * 返回：无
     */
    var initClipTerrainObj = function(clipTerrainDoc) {
        var clipTerrainRoot = clipTerrainDoc.documentElement;
        for (var i = 0; i < clipTerrainRoot.childNodes.length; i++) {
            var clipTerrainNode = clipTerrainRoot.childNodes[i];
            var id = clipTerrainNode.getAttribute("id");
            var name = clipTerrainNode.getAttribute("name");
            var clipCoordinate = clipTerrainNode.selectSingleNode("ClipCoordinate").text;
            var minClipLevel = parseFloat(clipTerrainNode.selectSingleNode("MinClipLevel").text);
            var vec3s = earth.Factory.CreateVector3s();
            var clipCoordArr = clipCoordinate.split(",");
            for (var k = 0; k < clipCoordArr.length; k = k + 3) {
                vec3s.Add(clipCoordArr[k], clipCoordArr[k + 1], clipCoordArr[k + 2]);
            }
            earth.TerrainManager.SetMinClipLevel(minClipLevel);
            earth.TerrainManager.ClipTerrainByPolygon(vec3s);
            createNewLayer();
            createClipModel(vec3s, id, name);
        }
    };

    var createElementNode = function(tagName, attrArr, xmlDoc) {
        var elementNode = xmlDoc.createElement(tagName);
        if (attrArr != null) {
            for (var i = 0; i < attrArr.length; i++) {
                var attr = attrArr[i];
                elementNode.setAttribute(attr.name, attr.value);
            }
        }
        return elementNode;
    };

    /**
     * 功能：创建没有属性的Element节点
     * 参数：tagName-标签名；textValue-节点文字；xmlDoc-添加的dom对象
     * 返回值：Element节点
     */
    var createElementText = function(tagName, textValue, xmlDoc) {
        var elementNode = xmlDoc.createElement(tagName);
        elementNode.text = textValue;
        return elementNode;
    };

    var initTerrain = function(clipTerrainDoc,obj) {
        if (clipTerrainDoc == null) {
            TerrainExcavate.clipTerrainDoc = getClipTerrainFile();
            initClipTerrainObj(TerrainExcavate.clipTerrainDoc);
            debugger;
            if(tempClipModel){
                obj.attr("disabled",false);
            }
        }
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
    }

    TerrainExcavate.roadClip = roadClip;
    TerrainExcavate.customClip = customClip;
    TerrainExcavate.setClipTerrainVis = setClipTerrainVis;
    TerrainExcavate.deleteTempTerrain = deleteTempTerrain;
    //added by yamin
    TerrainExcavate.initTerrain = initTerrain;
    TerrainExcavate.getClipTerrainFile = getClipTerrainFile;
    TerrainExcavate.initClipTerrainObj = initClipTerrainObj;

})();
