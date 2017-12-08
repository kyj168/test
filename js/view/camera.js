$(function() {
        var earth = parent.earth;
        top.cameraLayer = earth.Factory.CreateEditLayer(earth.Factory.CreateGuid(), "my_layer", earth.Factory.CreateLonLatRect(-90, 90, -180, 180, 0, 10), 0, 10, '');
        earth.AttachObject(top.cameraLayer);
        var divHeight = $(parent.document).height() - 380;
        $("#dgDiv").height(divHeight);
        top.cameras = [];
        //创建新摄像机
        $("#btnNew").click(function() {
            earth.Event.OnCreateGeometry = function(pt, type) {
                if (pt) {
                    var guid = earth.Factory.CreateGuid();
                    var obj = {};
                    obj.name = "";
                    obj.earth = earth;
                    obj.model = "";
                    obj.cx = pt.Longitude;
                    obj.cy = pt.Latitude;
                    obj.cz = pt.Altitude;
                    obj.tx = earth.GlobeObserver.TargetPose.Longitude;
                    obj.ty = earth.GlobeObserver.TargetPose.Latitude;
                    obj.tz = earth.GlobeObserver.TargetPose.Altitude;
                    obj.maskUrl = earth.Environment.RootPath + 'res\\mask.png';
                    obj = window.showModalDialog("getcameradata.html", obj, "dialogWidth=400px;dialogHeight=488px;status=no");
                    if(!obj){
                        return;
                    }
                    var name = obj.name;
                    if (obj.name == "") {
                        return;
                    }
                    var camera = earth.factory.CreateElementCamera(guid, name || "摄像机");
                    camera.SphericalTransform.SetLocationEx(pt.Longitude, pt.Latitude, pt.Altitude);
                    if (obj.model) {
                        camera.MeshURL = obj.model;
                        camera.RtspURL = obj.rtsp;
                        camera.MaskURL = obj.maskUrl;
                    }
                    if(obj.cx && !isNaN(obj.cx) && 
                        obj.cy && !isNaN(obj.cy) && 
                        obj.cz && !isNaN(obj.cz) && 
                        obj.tx && !isNaN(obj.tx) && 
                        obj.ty && !isNaN(obj.ty) && 
                        obj.tz && !isNaN(obj.tz)){
                        var v1 = earth.Factory.CreateVector3();
                        v1.X = obj.cx;
                        v1.Y = obj.cy;
                        v1.Z = obj.cz;
                        var v2 = earth.Factory.CreateVector3();
                        v2.X = obj.tx;
                        v2.Y = obj.ty;
                        v2.Z = obj.tz;
                        
                        camera.SetPoseByLocationAndTarget(v1, v2);
                    }

                    top.cameraLayer.BeginUpdate();
                    top.cameraLayer.AttachObject(camera);
                    top.cameraLayer.EndUpdate();

                    top.cameras[guid] = camera;

                    var treeObj = $.fn.zTree.getZTreeObj("mTree");
                    var nodes = treeObj.getNodes();
                    var newnode = treeObj.addNodes(nodes[0], {
                        id: camera.Guid,
                        name: camera.Name,
                        checked: true
                    }, false);
                    treeObj.selectNode(newnode[0], false);
                    setTimeout(function() {
                        saveCameras();
                    }, 500);

                    $("#chkRTSP,#chkImage,#btnIncreaseFov,#btnIncreaseAspect,#btnDecreaseFov,#btnDecreaseAspect,#chkShowFrustum,#connectType").removeAttr("disabled");
                    $("#btnNew").attr("disabled", "disabled");
                    $("#chkShowFrustum").attr("checked", "checked");
                }
            };
            earth.ShapeCreator.CreatePoint();
        });

        //加载保存相机
        function createCamera(record) {
            var camera = earth.factory.CreateElementCamera(record["ID"], record["NAME"]);
            camera.RtspURL = record["RTSP"];
            camera.MeshURL = record["MESHURL"];
            camera.EnableCameraShot = false;
            camera.Fov = record["Fov"];
            camera.Aspect = record["Aspect"];
            var pt = record["LOCATION"].split(",");
            camera.SphericalTransform.SetLocationEx(pt[0], pt[1], pt[2]);
            pt = record["ROTATION"].split(",");
            camera.SphericalTransform.SetRotationEx(pt[0], pt[1], pt[2]);
            pt = record["SCALE"].split(",");
            camera.SphericalTransform.SetScaleEx(pt[0], pt[1], pt[2]);

            top.cameraLayer.BeginUpdate();
            top.cameraLayer.AttachObject(camera);
            top.cameraLayer.EndUpdate();

            top.cameras[record["ID"]] = camera;
        }

        // 右键选中节点，并弹出右键菜单
        //右键删除
        $("#divDeletedata").click(function() {
            var userId = camerasTrees.getSelectedNodes()[0].id;
            if (userId) {
                if (confirm("是否确定要删除？")) {
                    camerasTrees.removeNode(camerasTrees.getSelectedNodes()[0]);
                    var xmlCameraData = earth.UserDocument.LoadXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE + ".xml");
                    var cameraXml = loadXMLStr(xmlCameraData);
                    var camera = cameraXml.getElementsByTagName("record");
                    for (var i = 0; i < camera.length; i++) {
                        var cameraData = camera[i];
                        var id = cameraData.getAttribute("ID");
                        if (id === userId) {
                            cameraData.parentNode.removeChild(cameraData);
                            if (top.cameras.hasOwnProperty(id)) {
                                earth.ToolManager.SphericalObjectEditTool.Browse();
                                var thisCamera = top.cameras[id];
                                if(thisCamera){
                                    if(thisCamera.EnableRTSP){
                                        thisCamera.EnableRTSP = false;
                                    }
                                }
                                top.cameraLayer.DetachWithDeleteObject(thisCamera);
                                top.cameras[id] = "";
                            }
                            earth.UserDocument.saveXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE, cameraXml.xml);
                            break;
                        }
                    }
                    earth.ShapeCreator.Clear();
                    camerasTrees.removeNode(camerasTrees.getSelectedNodes()[0]);
                    var rootNode = camerasTrees.getNodes();
                    if (rootNode.length === 1) {
                        camerasTrees.getNodes()[0].isParent = true;
                        camerasTrees.updateNode(camerasTrees.getNodes()[0]);
                    }

                    $("#chkImage,#chkRTSP,#btnIncreaseFov,#btnIncreaseAspect,#btnDecreaseFov,#btnDecreaseAspect,#chkShowFrustum").attr("disabled", "disabled");
                    $("#btnNew").removeAttr("disabled");
                }
            }
        });
        //编辑
        $("#divUpdate").click(function() {
            var userId = camerasTrees.getSelectedNodes()[0].id;
            if (userId) {
                var xmlCameraData = earth.UserDocument.LoadXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE + ".xml");
                var cameraXml = loadXMLStr(xmlCameraData);
                var camera = cameraXml.getElementsByTagName("record");
                for (var i = 0; i < camera.length; i++) {
                    var cameraData = camera[i];
                    var id = cameraData.getAttribute("ID");
                    if (id === userId) {
                        var obj = {};
                        obj.name = cameraData.getAttribute("NAME");
                        obj.rtsp = cameraData.getAttribute("RTSP");
                        obj.model = cameraData.getAttribute("MESHURL");
                        obj.cx = cameraData.getAttribute('cx');
                        obj.cy = cameraData.getAttribute('cy');
                        obj.cz = cameraData.getAttribute('cz');
                        obj.tx = cameraData.getAttribute('tx');
                        obj.ty = cameraData.getAttribute('ty');
                        obj.tz = cameraData.getAttribute('tz');

                        obj.maskUrl = cameraData.getAttribute('MaskUrl');
                        if(!obj.maskUrl){
                            obj.maskUrl = earth.Environment.RootPath + 'res\\mask.png';
                        }

                        obj.earth = earth;
                        obj = window.showModalDialog("getcameradata.html", obj, "dialogWidth=400px;dialogHeight=488px;status=no");
                        if(!obj){
                            return;
                        }
                        cameraData.setAttribute("RTSP", obj.rtsp);
                        cameraData.setAttribute("NAME", obj.name);
                        cameraData.setAttribute("MESHURL", obj.model);
                        cameraData.setAttribute("MaskUrl", obj.maskUrl);
                        earth.UserDocument.saveXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE, cameraXml.xml);

                        //var treeObj = $.fn.zTree.getZTreeObj("mTree");
                        //var nodes = treeObj.transformToArray(treeObj.getNodes());
                        var camera = top.cameras[userId];
                        camera.RtspURL = obj.rtsp;
                        camera.MaskURL = obj.maskUrl;

                        if(obj.cx && !isNaN(obj.cx) && 
                            obj.cy && !isNaN(obj.cy) && 
                            obj.cz && !isNaN(obj.cz) && 
                            obj.tx && !isNaN(obj.tx) && 
                            obj.ty && !isNaN(obj.ty) && 
                            obj.tz && !isNaN(obj.tz)){
                            var v1 = earth.Factory.CreateVector3();
                            v1.X = obj.cx;
                            v1.Y = obj.cy;
                            v1.Z = obj.cz;
                            var v2 = earth.Factory.CreateVector3();
                            v2.X = obj.tx;
                            v2.Y = obj.ty;
                            v2.Z = obj.tz;
                            
                            camera.SetPoseByLocationAndTarget(v1, v2);
                        }

                        saveCameras();

                        var node = camerasTrees.getSelectedNodes()[0];
                        node.name = obj.name;
                        node.rtsp = obj.rtsp;
                        node.model = obj.model;
                        camerasTrees.updateNode(node);
                    }
                }

            }
        });
        /**
         * 读取摄像机xml记录文件，创建保存的摄像机
         */
        var camerasTrees;

        function loadCameras() {
            var setting = {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                check: {
                    enable: true, //是否显示checkbox或radio
                    chkStyle: "checkbox" //显示类型,可设置(checbox,radio)
                },
                view: {
                    dblClickExpand: false, //双击节点时，是否自动展开父节点的标识
                    expandSpeed: "", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
                    selectedMulti: false //设置是否允许同时选中多个节点
                },
                callback: {
                    onRightClick: function rightClickuserdataTreeNode(event, treeId, node) {
                        if (node) {
                            $.fn.zTree.getZTreeObj(treeId).selectNode(node);
                            if (node.id != -1) { // 漫游路径对象节点
                                $('#contextMenuUserdata').menu('show', {
                                    left: event.pageX,
                                    top: event.pageY
                                });
                            }
                        }
                    },
                    onClick: function(event, treeId, node) {
                        if (node && node.id) {
                            if (node.isParent) {
                                $("#chkImage").attr("disabled", "disabled");
                                $("#chkRTSP").attr("disabled", "disabled");
                                $("#chkImage").text("反投");
                                $("#chkRTSP").text("连接");
                                $("#btnNew").removeAttr("disabled");
                                $("#chkShowFrustum").removeAttr("checked");
                                $("#btnIncreaseFov,#btnIncreaseAspect,#btnDecreaseFov,#btnDecreaseAspect,#chkShowFrustum").attr("disabled", "disabled");
                                $("#connectType").attr("disabled", "disabled");
                                return;
                            }
                            var camera = top.cameras[node.id];
                            if (camera) {
                                $("#txtRtspAddress").val(camera.RtspURL);

                                $("#btnIncreaseFov,#btnIncreaseAspect,#btnDecreaseFov,#btnDecreaseAspect,#chkShowFrustum").removeAttr("disabled");
                                $("#btnNew").attr("disabled", "disabled");

                                if (camera.EnableRTSP) {
                                    $("#chkRTSP").attr("checked", "checked");
                                    $("#chkImage").removeAttr("checked");

                                    $("#chkImage").text("反投");
                                    $("#chkRTSP").text("停止");
                                    $("#chkRTSP").removeAttr("disabled");
                                    $("#chkImage").attr("disabled", "disabled");
                                    $("#connectType").attr("disabled", "disabled");
                                } else if (camera.EnableCameraShot) {
                                    $("#chkRTSP").removeAttr("checked");
                                    $("#chkImage").attr("checked", "checked");

                                    $("#chkImage").text("停止");
                                    $("#chkRTSP").text("连接");
                                    $("#chkImage").removeAttr("disabled");
                                    $("#chkRTSP").attr("disabled", "disabled");
                                } else {
                                    $("#chkRTSP,#chkImage").removeAttr("checked");
                                    $("#chkImage").removeAttr("disabled");
                                    $("#chkRTSP").removeAttr("disabled");
                                    $("#connectType").removeAttr("disabled");
                                    $("#chkImage").text("反投");
                                    $("#chkRTSP").text("连接");
                                }

                                if (camera.EnableFrustum) {
                                    $("#chkShowFrustum").attr("checked", "checked");
                                } else {
                                    $("#chkShowFrustum").removeAttr("checked");
                                }
                            }
                        }
                    },
                    onDblClick: function(event, treeId, node) {
                        if (node && node.id) {
                            var camera = top.cameras[node.id];
                            if (camera) {
                                var transform = camera.SphericalTransform;
                                earth.GlobeObserver.FlytoLookat(transform.Longitude, transform.Latitude, transform.Altitude,
                                    90, 45, 0, 500, 3);
                                camera.ShowHighLight();
                            }
                        }
                    },
                    onCheck: function(event, treeId, node) {
                        var camera = top.cameras[node.id];
                        if (camera) {
                            camera.Visibility = node.checked;
                        }
                    }
                }
            };
            var zNodes = [{
                id: -1,
                name: 'camera',
                open: true,
                isParent: true,
                checked: true
            }];
            var xmlCameraData = earth.UserDocument.LoadXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE + ".xml");
            var res = $.xml2json(xmlCameraData);
            if (res && res.record) {
                if (res.record['ID']) {
                    zNodes.push({
                        id: res.record["ID"],
                        pId: -1,
                        name: res.record["NAME"],
                        checked: res.record["CHECKED"]
                    });
                    createCamera(res.record);
                } else {
                    for (var r in res.record) {
                        if (res.record.hasOwnProperty(r)) {
                            zNodes.push({
                                id: res.record[r]["ID"],
                                pId: -1,
                                name: res.record[r]["NAME"],
                                checked: res.record[r]["CHECKED"]
                            });
                            createCamera(res.record[r]);
                        }
                    }
                }
            }
            camerasTrees = $.fn.zTree.init($("#mTree"), setting, zNodes);
        }
        loadCameras();

        /**
         * 保存所有创建的摄像机到xml中
         */
        function saveCameras() {
            earth.UserDocument.SaveXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE, exportCameras());
        }

        /**
         * 将摄像机转换为xml字符串
         * @return {String}
         */
        function exportCameras() {
            var xml = "<xml>";
            var treeObj = $.fn.zTree.getZTreeObj("mTree");
            var nodes = treeObj.transformToArray(treeObj.getNodes());
            for (var i = 1; i < nodes.length; i++) {
                var camera = top.cameras[nodes[i].id];
                var location = camera.SphericalTransform.GetLocation();
                var rotation = camera.SphericalTransform.GetRotation();
                var scale = camera.SphericalTransform.GetScale();

                xml += "\n\t<record ID='" + camera.Guid +
                    "' NAME='" + camera.Name +
                    "' CHECKED='" + camera.Visibility +
                    "' RTSP='" + camera.RtspURL +
                    "' MESHURL='" + camera.MeshURL +
                    "' Aspect='" + camera.Aspect +
                    "' Fov='" + camera.Fov +
                    "' LOCATION='" + [location.X, location.Y, location.Z].join(",") +
                    "' ROTATION='" + [rotation.X, rotation.Y, rotation.Z].join(",") +
                    "' SCALE='" + [scale.X, scale.Y, scale.Z].join(",") +
                    "' MaskUrl='" + camera.MaskURL +
                    "' />";
            }
            xml += "\n</xml>";
            return xml;
        }

        function getSelecteNode() {
            var treeObj = $.fn.zTree.getZTreeObj("mTree");
            var selNodes = treeObj.getSelectedNodes();
            var selNode = null;
            if (selNodes.length > 0) {
                selNode = selNodes[0];
            }
            return selNode;
        }

        function getSelectedCamera() {
            var selNode = getSelecteNode();
            var camera = null;
            if (selNode) {
                camera = top.cameras[selNode.id];
            }
            return camera;
        }

        function useTCP() {
            var value = $("#connectType").val();
            if (value == "true") {
                return true;
            } else {
                return false;
            }
        }

        $("#connectType").change(function() {
            var camera = getSelectedCamera();
            if (camera) {
                var $this = $(this);
                if ($("#chkRTSP").text() == "连接") {} else {
                    camera.UseTCP = useTCP();
                }
            }
        });

        //var rtspObj = {}; //记录camera的连接状态
        $("#chkRTSP").click(function() {
            var camera = getSelectedCamera();
            if (camera) {
                var $this = $(this);
                if ($("#chkRTSP").text() == "连接") {
                    $("#chkRTSP").text("停止");
                    camera.EnableCameraShot = false;
                    camera.EnableRTSP = true;
                    //add by yzp 2014-08-05 11:46 增加摄像机的连接方式
                    camera.UseTCP = useTCP();
                    $("#chkImage").attr("disabled", "disabled");
                    //$("#chkImage").removeAttr("checked");
                } else {
                    $("#chkRTSP").text("连接");
                    $("#chkImage").removeAttr("disabled");
                    camera.EnableRTSP = false;
                }
            }
        });
        $("#chkImage").click(function() {
            var camera = getSelectedCamera();

            if (camera) {
                var $this = $(this);
                if ($("#chkImage").text() == "反投") {
                    $("#chkImage").text("停止");
                    camera.EnableRTSP = false;
                    camera.EnableCameraShot = true;
                    $("#chkRTSP").attr("disabled", "disabled");
                    //$("#chkRTSP").removeAttr("checked");
                } else {
                    $("#chkRTSP").removeAttr("disabled");
                    $("#chkImage").text("反投");
                    camera.EnableCameraShot = false;
                }
            }
        });

        $("#chkShowFrustum").click(function() {
            var camera = getSelectedCamera();
            if (camera) {
                camera.EnableFrustum = !!$(this).attr("checked");
            }
        });
        $("#btnDecreaseFov,#btnIncreaseFov,#btnIncreaseAspect,#btnDecreaseAspect").click(function() {
            var camera = getSelectedCamera();
            if (camera) {
                var action = $(this).attr("id").substring(3);
                switch (action) {
                    case "IncreaseFov":
                        camera.Fov += 0.01;
                        break;
                    case "DecreaseFov":
                        camera.Fov -= 0.01;
                        break;
                    case "IncreaseAspect":
                        camera.Aspect += 0.1;
                        break;
                    case "DecreaseAspect":
                        camera.Aspect -= 0.1;
                        break;
                    case "IncreaseRange":
                        camera.Range += 0.1;
                        break;
                    case "DecreaseRange":
                        camera.Range -= 0.1;
                        break;
                }
                var userId = camera.Guid;
                if (userId) {
                    var xmlCameraData = earth.UserDocument.LoadXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE + ".xml");
                    var cameraXml = loadXMLStr(xmlCameraData);
                    var camera1 = cameraXml.getElementsByTagName("record");
                    for (var i = 0; i < camera1.length; i++) {
                        var cameraData = camera1[i];
                        var id = cameraData.getAttribute("ID");
                        if (id === userId) {
                            cameraData.setAttribute("Fov", camera.Fov);
                            cameraData.setAttribute("Aspect", camera.Aspect);
                            earth.UserDocument.saveXmlFile(earth.RootPath + STAMP_config.constants.CAMERAFILE, cameraXml.xml);
                        }
                    }

                }
            }
        });

        $("#btnConnect").click(function() {
            var camera = getSelectedCamera();
            if (camera) {
                var addr = $("#txtRtspAddress").val();
                if (addr) {
                    camera.RtspURL = addr;
                    saveCameras();
                }
            }
        });
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
        };

        function close() {
            if (earth.UserDocument) {
                for (var id in top.cameras) {
                    if (top.cameras.hasOwnProperty(id)) {
                        if (top.cameras[id] != "") {
                            top.cameraLayer.DetachWithDeleteObject(top.cameras[id]);
                        }
                    }
                }
                earth.DetachObject(top.cameraLayer);
                top.cameras = [];
                top.cameraLayer = null;
            }
        }

        $(window).unload(function() {
            close();
        });
        //解决监控功能打开状态，退出浏览器时候浏览器提示崩溃错误
        $(top).unload(function() {
            close();
        });
    });