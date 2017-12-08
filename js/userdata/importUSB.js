/**
 * 导入模型
 */

var earth = "";

function getEarth(earthObj) {
    earth = earthObj;
    var loop = 0;
    var recordDic = {};
    var temp = earth.userdata;
    var filename = "MyPlace";
    var analysis = STAMP.Analysis(earth);
    var userdata = STAMP.Userdata(earth);
    $("#btnAdd").click(function() {
        var filePath = earth.UserDocument.OpenFileDialog(earth.RootPath, "usb文件(*.usb)|*.usb");
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
        var row = {
            "name": loop,
            "desp": filePath
        };

        //添加记录后 "清空"可用
        if ("" != $("#referenceInput").val()) {
            $("#btnImport").removeAttr("disabled");
        }
    });

    //选择投影文件
    $("#addSpatialReference").click(function() {
        var filePath = earth.UserDocument.OpenFileDialog(earth.RootPath, "spatial文件(*.spatial)|*.spatial");
        if (filePath == "") {
            return;
        }
        $("#referenceInput").attr("value", filePath);
        if ("" != $("#filepath").val()) {
            $("#btnImport").removeAttr("disabled");
        }
    });

    //导入模型
    $("#btnImport").click(function() {
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
                var rootpath = earth.RootPath + "userdata";
                var singleimport = dataProcess.SingleMeshImport;
                singleimport.Set_Reference_file(reference);
                singleimport.Set_Save_Type(0);
                singleimport.Set_Desc_Path(rootpath);
                singleimport.Init();
                var fileName = texttrueFname.split(".")[0];
                var folderName = link.split(".")[0];
                //从folderName中把fileName字符去掉
                var nFolder = folderName.replace(fileName, "");
                var modelUtil = singleimport.Process_File_Local(nFolder, texttrueFname);
                showModel(modelUtil, fileName);
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

    function showModel(param, fileName) {
        var guid = earth.Factory.CreateGuid();
        var model = earth.Factory.CreateEditModelByLocal(guid, fileName, param.path, 3);
        model.name = fileName;
        //model.SetIsCollapse(true);
        var altitude = earth.Measure.MeasureTerrainAltitude(param.Longitude, param.Latitude);
        model.SphericalTransform.SetLocationEx(param.Longitude, param.Latitude, altitude);
        earth.AttachObject(model);
        earth.GlobeObserver.FlytoLookat(param.Longitude, param.Latitude, 50, 0, 60, 0, 200, 5);

        //保存到本地xml中
        var rootxml = temp.getUserdata(filename);
        createElementLocal(model, rootxml);
        //还要添加到userdataAry数组中 否则右键不会立即生效
        temp.addElementFromOuter(model);
        //添加到树显示列表中
        /*var zTree = parent.$.fn.zTree.getZTreeObj("userdataTree");
         var root = zTree.getNodes()[0];
         zTree.addNodes(root, {id: model.guid, pId: -1, name:model.name,  checked:true}, false);*/
        var zTree = earth.userdataTree;
        var root = zTree.getNodes()[0];
        zTree.addNodes(root, {
            id: model.guid,
            pId: -1,
            name: model.name,
            checked: true
        }, false);

        var tempzTree = earth.tempUserdataTree;
        if(tempzTree == null){
            return;
        }
        var tempRootNode = tempzTree.getNodes()[0];
        tempzTree.addNodes(tempRootNode, {
            id: model.guid,
            pId: -1,
            name: model.name,
            checked: true
        }, false);

        alert("导入成功!");
        $('#btnAdd').attr("disabled", false);
        $('#addSpatialReference').attr("disabled", false);
        $('#clear').attr("disabled", false);
        $('#btnImport').attr("disabled", true);
        $("#filepath").val("");
        $("#referenceInput").val("");
    }

    /**
     * 创建model数据xml
     * @param  {[type]} element [description]
     * @param  {[type]} rootxml [description]
     * @return {[type]}         [description]
     */
    var createElementLocal = function(element, rootxml) {

        var xmlData = createElementXml(element);
        var xmlDoc = loadXMLStr("<xml>" + xmlData + "</xml>");

        var lookupNode = null;

        if (rootxml.childNodes.length > 1) {
            lookupNode = rootxml.childNodes[rootxml.childNodes.length - 1].firstChild;
        } else {
            lookupNode = rootxml.documentElement.firstChild;
        }
        lookupNode.appendChild(xmlDoc.documentElement.firstChild);

        var root = earth.Environment.RootPath + "userdata\\" + filename;
        earth.UserDocument.saveXmlFile(root, rootxml.xml);
    }

    /**
     * 针对model单独生成xml数据节点
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    var createElementXml = function(element) {
        var xmlData = "";
        xmlData += "<Element id='" + element.guid + "' name='" + element.name + "' shadow_cast='1' type='" + element.rtti + "' checked='1' >";
        xmlData += " <Visibility>true</Visibility>";
        xmlData += " <Description></Description>";

        //新增属性
        xmlData += "  <Selectable>" + element.selectable + "</Selectable>";
        xmlData += "  <Editable>" + element.editable + "</Editable>";
        xmlData += "  <ObjectFlagType>" + element.objectFlagType + "</ObjectFlagType>";

        xmlData += " <EditModel>";
        xmlData += "  <Link>" + element.Link + "</Link>";
        xmlData += "  <Pivot>0.00000000,0.00000000,0.00000000</Pivot>";
        xmlData += "  <BBox>";
        xmlData += "   <MinBoundary>-10,0.0,-10</MinBoundary>";
        xmlData += "   <MaxBoundary>10,10,10</MaxBoundary>";
        xmlData += "  </BBox>";
        xmlData += " </EditModel>";

        var Rotation = element.SphericalTransform.GetRotation();
        var Scale = element.SphericalTransform.GetScale();
        var Position = element.SphericalTransform.GetLocation();

        xmlData += " <ControlParams>";
        xmlData += "    <Rotation>" + Rotation.X + "," + Rotation.Y + "," + Rotation.Z + "</Rotation>";
        xmlData += "    <Scale>" + Scale.X + "," + Scale.Y + "," + Scale.Z + "</Scale>";
        xmlData += "    <Position>" + Position.X + "," + Position.Y + "," + Position.Z + "</Position>";
        xmlData += " </ControlParams>";

        var heading = earth.GlobeObserver.Pose.heading;
        var tilt = earth.GlobeObserver.Pose.tilt;
        var range = earth.GlobeObserver.PickRange();

        xmlData += " <LookAt>";
        xmlData += "  <Longitude>" + element.SphericalTransform.Longitude + "</Longitude>";
        xmlData += "  <Latitude>" + element.SphericalTransform.Latitude + "</Latitude>";
        xmlData += "  <Altitude>" + 50 + "</Altitude>";
        xmlData += "  <Heading>" + 0 + "</Heading>";
        xmlData += "  <Tilt>" + 60 + "</Tilt>";
        xmlData += "  <Range>" + 200 + "</Range>";
        xmlData += " </LookAt>";

        xmlData += "</Element>";
        return xmlData;
    };
    $("#clear").click(function() {
        analysis.clearHtmlBallon(earth.htmlBallon);
    });
    //todo:代码优化...
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
}

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