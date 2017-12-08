var earth = parent.earth;
    var trackManager = STAMP.TrackManager(earth);
    var params;  // 获取动画设置参数
    var id = ""; // 新建动画的ID
    var xmlAnimListFile = earth.RootPath + STAMP_config.constants.ANIMFILE;  // 动画列表XML文件路径
    $(function () {
        getAnims();
        // 树基本设置
        var setting = {
            callback : {
                onClick: "",
                onDblClick: "",
                onRightClick: rightClickuserdataTreeNode,
                beforeDrop: "",
                onDrop: "",
                onCollapse: "",
                onExpand: "",
                onCheck: zTreeOnCheck,
                onNodeCreated: ""
            },
            edit : {
                enable: false,//禁止编辑：拖动
                showRenameBtn: false,
                showRemoveBtn: false
            },
            check : {
                enable: false,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            data: {
                simpleData: {
                    enable: true
                },
               keep:{
                   parent: true
               }
            }
        };
        //用于捕获 checkbox / radio 被勾选 或 取消勾选的事件回调函数
        function zTreeOnCheck(event, treeId, treeNode) {
            var level = treeNode.level;
            var guid = treeNode.id;
            if(treeNode.isParent){
                setFolderChecked(guid, treeNode.checked);
            } else {
                setElementChecked(guid, treeNode.checked, level);
            }
        };
        // 右键选中节点，并弹出右键菜单
        var rightEId="";
        var xmlNode="";
        var rightClickuserdataTreeNode = function (event, treeId, node){
            if(node){
                rightEId=node.id;
                $.fn.zTree.getZTreeObj(treeId).selectNode(node);
                if(node.id != -1 && node.isParent){ // 漫游路径对象节点
                    xmlNode="folder";
                    $('#contextMenu').menu('show', {
                        left: event.pageX,
                        top: event.pageY
                    });
                }else  if(node && node.isParent && node.id == -1){
                    
                } else {
                    xmlNode="record";
                    $('#contextMenu').menu('show', {
                        left: event.pageX,
                        top: event.pageY
                    });
                }
            }
        };
        var dbClickNode =function (event, treeId, node){
            if(node){
                if(node.isParent&&node.id === -1){
                    //不需要操作
                    return;
                }else if(node.isParent&&node.id != -1){
                    if(node.check_Child_State === 0){
                        flytoAnam(node.children[0].id);
                    } else if(node.check_Child_State === -1){
                        return;
                    }
                } else{
                    flytoAnam(node.id);
                }
            }
        };
        var flytoAnam =function (id){
            var points= earth.UserDocument.LoadXmlFile(xmlAnimListFile + id + '.xml');
            var pointArr = points.split("|");
            if(pointArr.length>0){
                var point = pointArr[0];
                point = point.split(",");
                earth.GlobeObserver.FlytoLookat(point[3], point[2], point[0], point[1], point[6], point[5], point[4], 3);
            }
        };
        //选中节点操作
        var clickNode = function (event,treeId,node){
            if(tag=="new"){
                tag="";
            }
            var selNode = TreeObj.getSelectedNodes()[0];

            //earth.PoseRecorder.StopPlayback();
            if(selNode.id!=-1&&!selNode.isParent){
                $("#btnRecord").attr("disabled","disabled");
            } else {
                $("#btnRecord").removeAttr("disabled");
            }
            $("#btnRecord").text("录制");
            $("#btnPlay").text("播放");

            $("#btnPlay").removeAttr("disabled");
            $("#btnStop").attr("disabled","disabled");
            //开启右键
            TreeObj.setting.callback.onRightClick = rightClickuserdataTreeNode;
            if(node.id != -1&&node.isParent){ // 漫游路径对象节点
                var childerNodes=TreeObj.getNodesByParam("pId",node.id,node);
                if(childerNodes.length===0){ //判断有无子节点
                    $("#btnRecord").removeAttr("disabled");
                    $("#btnPlay").attr("disabled","disabled");
                } else {
                    $("#btnRecord").removeAttr("disabled");
                    $("#btnPlay").removeAttr("disabled");
                }

            }else if(node.id != -1&&!node.isParent){
                $("#btnRecord").attr("disabled","disabled");
                $("#btnPlay").removeAttr("disabled");
            } else if(node.id == -1&& node.isParent){
                $("#btnRecord").attr("disabled","disabled");
                $("#btnPlay").attr("disabled","disabled");
            }
        }
        $("#rename").click(function (){
            var node = TreeObj.getSelectedNodes()[0];
            var xmlAnimList = earth.UserDocument.LoadXmlFile(xmlAnimListFile + '.xml');
            if(xmlAnimList==""){
                return;
            }
            var xmlDoc=loadXMLStr(xmlAnimList) ;
            var nodes;
            if(xmlNode=="folder"){
                nodes=xmlDoc.getElementsByTagName("RecordFolder");
                var height = "90px";
            }else if(xmlNode=="record"){
                nodes=xmlDoc.getElementsByTagName("Record");
                var height = "150px";
            }

            var resObj = window.showModalDialog("animationSetting.html", {
                name:node.name,
                fps:node.fps,
                xmlNode: xmlNode
            }, 'dialogWidth=238px;dialogHeight=' + height + ';status=no');
            if(!resObj){
                return;
            }
           for(var i=0;i<nodes.length;i++){
                if(node.id==nodes[i].getAttribute("ID")){
                    nodes[i].setAttribute("NAME",resObj.name);
                    nodes[i].setAttribute("FPS",resObj.fps);
                }
           }
            earth.UserDocument.saveXmlFile(xmlAnimListFile,xmlDoc.xml);
            initVisitTree();
        });
        $("#deleteVisit").click(function (){
            var node = TreeObj.getSelectedNodes()[0];
            var id="";
            if(!node){
                id=rightEId;
            } else{
                id=node.id;
            }
                if(confirm("是否确定要删除该动画？")){
                    var xmlAnimList = earth.UserDocument.LoadXmlFile(xmlAnimListFile + '.xml');
                    var xmlDoc=loadXMLStr(xmlAnimList) ;
                    var nodes;
                    var childNodes;
                    if(xmlNode=="folder"){
                        nodes=xmlDoc.getElementsByTagName("RecordFolder");
                        childNodes = xmlDoc.getElementsByTagName("Record");
                        for(var j=0;j<childNodes.length;j++){
                            earth.UserDocument.DeleteXmlFile (xmlAnimListFile+childNodes[j].getAttribute("ID")+'.xml');
                        }
                        for(var i=0;i<nodes.length;i++){
                            if(id==nodes[i].getAttribute("ID")){
                                nodes[i].parentNode.removeChild( nodes[i]);
                            }
                        }
                        earth.UserDocument.saveXmlFile(xmlAnimListFile ,xmlDoc.xml);
                    }else if(xmlNode=="record"){
                        childNodes=xmlDoc.getElementsByTagName("Record");
                        for(var i=0;i<childNodes.length;i++){
                            if(id==childNodes[i].getAttribute("ID")){
                                childNodes[i].parentNode.removeChild( childNodes[i]);
                            }
                        }
                        earth.UserDocument.saveXmlFile(xmlAnimListFile ,xmlDoc.xml);
                        earth.UserDocument.DeleteXmlFile (xmlAnimListFile+id+'.xml');
                    }
                    //var nodes=xmlDoc.getElementsByTagName("Record");
                    initVisitTree();
                    $("#btnRecord").attr("disabled","disabled");
                    $("#btnPlay").attr("disabled","disabled");
            }

        });
        $("#btnCreate").click(function (){
            var anims = trackManager.getAnims();
            var Name = showModalDialog("getTrackName.html",anims,"dialogWidth=230px;dialogHeight=90px;status=no");
            if(Name){
                var guid= earth.Factory.CreateGUID();
                var zTree = $.fn.zTree.getZTreeObj("userdataTree");
                var nodes = zTree.getNodes();
                var treeNode = nodes[0];
                //从右键的节点作为父对象进行添加
                var newNodes = zTree.addNodes(treeNode, {name:Name, isParent:true, pId:treeNode.pId, id:guid,checked:true});
                zTree.selectNode( newNodes[0],false);
                createElementsFolder(treeNode, newNodes[0]);
                $("#btnRecord").removeAttr("disabled");
                $("#btnPlay").attr("disabled","disabled");
            }
        });
        function createElementsFolder(target, node){
            var xmlData = "<RecordFolder ID='" + node.id  + "' NAME='" + node.name + "' TYPE='folder' OPEN='"+ node.open +"'   >" + "</RecordFolder>";
            var xmlDoc = loadXMLStr("<xml>" + xmlData + "</xml>");
            //获取usedata文件夹下的xml数据
            var url =xmlAnimListFile+".xml";
            var rootxmlData = earth.UserDocument.loadXmlFile(url); // 得到xml数据；
            var rootxml= loadXMLStr(rootxmlData);
            var lookupNode = null;

            //直接添加到右键目标文件夹下
            if(target.id != -1){
                var target = getElementByGUID(rootxml, target.id);
                // insertAfter(xmlDoc.documentElement.firstChild, target);
                target.appendChild(xmlDoc.documentElement.firstChild);
            } else { //根节点
                if(rootxml.childNodes.length>1){
                    lookupNode = rootxml.childNodes[rootxml.childNodes.length-1].firstChild;
                } else {
                    lookupNode = rootxml.documentElement.firstChild;
                }
                lookupNode.appendChild(xmlDoc.documentElement.firstChild);
            }

            earth.UserDocument.saveXmlFile(xmlAnimListFile, rootxml.xml);
        };
        var oncheck=function (event, treeId, node) {
           /* if(node.isParent&&node.checked==false){
                checkNodeArr=[];
                return;
            }
            if( node.checked==true){
                if(checkNodeArr.length!=0){
                    for(var m=0;m<checkNodeArr.length;m++){
                        if(node.id==checkNodeArr[m].id){
                             return;
                        }
                    }
                    checkNodeArr.push({id:node.id,fps:node.fps});
                }else{
                    checkNodeArr.push({id:node.id,fps:node.fps});
                }
            }else {
                if(checkNodeArr.length!=0){
                    for(var m=0;m<checkNodeArr.length;m++){
                        if(node.id==checkNodeArr[m].id){
                            checkNodeArr.splice(m,1);
                        }
                    }
                }
            };*/

        }
        //初始化element树
        var TreeObj;
        var initVisitTree=function(){
            var userTreeData = [];
            setting.callback = {
                onClick:clickNode,
                onDblClick:dbClickNode,
                onRightClick: rightClickuserdataTreeNode,
                onCheck:oncheck
            };
            var res = getAnims();
            if(res && res.Visit){
                userTreeData.push({
                    id: -1,
                    pId: -1,
                    name:res.Visit["NAME"]  ,
                    open:true,
                    isParent:true
                });
            }
            if(res.Visit &&res.Visit.RecordFolder ){
                if($.isArray(res.Visit.RecordFolder)){
                    $.each(res.Visit.RecordFolder, function (i ,r){
                        userTreeData.push({
                            id: r["ID"],
                            pId: -1,
                            name:r["NAME"],
                            fps: r["FPS"] ,
                            open:true,
                            isParent:true
                        });
                        if(r.Record){
                            if($.isArray(r.Record)){
                                $.each(r.Record, function (m ,k){
                                    userTreeData.push({
                                        id: k["ID"],
                                        pId: r["ID"],
                                        name:k["NAME"],
                                        fps:k["FPS"]
                                    });
                                });
                            }else{
                                userTreeData.push({
                                    id: r.Record["ID"],
                                    pId: r["ID"],
                                    name:r.Record["NAME"],
                                    fps: r.Record["FPS"]
                                });
                            }
                        }
                    });
                }else{
                    userTreeData.push({
                        id: res.Visit.RecordFolder["ID"],
                        pId: -1,
                        name:res.Visit.RecordFolder["NAME"],
                        fps: res.Visit.RecordFolder["FPS"] ,
                        isParent:true
                    });
                    if(res.Visit.RecordFolder.Record){
                        if($.isArray(res.Visit.RecordFolder.Record)){
                            $.each(res.Visit.RecordFolder.Record, function (m ,k){
                                userTreeData.push({
                                    id: k["ID"],
                                    pId: res.Visit.RecordFolder["ID"],
                                    name:k["NAME"],
                                    fps:k["FPS"]
                                });
                            });
                        }else{
                            userTreeData.push({
                                id: res.Visit.RecordFolder.Record["ID"],
                                pId: res.Visit.RecordFolder["ID"],
                                name:res.Visit.RecordFolder.Record["NAME"],
                                fps: res.Visit.RecordFolder.Record["FPS"]
                            });
                        }
                    }
                }
            }
            TreeObj = $.fn.zTree.init($("#userdataTree"), setting, userTreeData);
        };
        initVisitTree();
        var divHeight = $("#tablediv").height() - $(".cardTitle").height();
        $("#dgDiv").height(divHeight);
        $("#dgDiv").mCustomScrollbar();
        var tag;
        var recordNode;
        $("#btnRecord").click(function () {
            var recordNode =TreeObj.getSelectedNodes()[0];
            if(!recordNode){
               alert("请先选择动画节点")
                return;
            }
            if(recordNode && recordNode.isParent && recordNode.id == -1){
                alert("父节点不能进行录制视频")
                return;
            }
            if(recordNode && !recordNode.isParent ){
                alert("请先选择动画节点")
                return;
            }
            tag="new";

            if ($(this).text() == "录制") {
                if (record()) {
                    $("#checkBntn div",parent.document).attr("disabled", true);
                    $(this).text("暂停");
                    $("#btnPlay").attr("disabled","disabled");
                    //$("#btnStop").attr("disabled","disabled");
                    earth.PoseRecorder.StartRecord(params.fps);
                }
            }else if($(this).text() == "暂停"){
                $(this).text("继续");
                earth.PoseRecorder.Pause(true);
            }else {
                $(this).text("暂停");
                earth.PoseRecorder.Pause(false);
            }
        });
        $("#btnStop").click(function(){
            if(tag=="new"){
                tag="";
                stopRecord();
            }
            var selNode = TreeObj.getSelectedNodes()[0];

            earth.PoseRecorder.StopPlayback();
            if(selNode.id!=-1&&!selNode.isParent){
                $("#btnRecord").attr("disabled","disabled");
            } else {
                $("#btnRecord").removeAttr("disabled");
            }
            $("#btnRecord").text("录制");
            $("#btnPlay").text("播放");

            $("#btnPlay").removeAttr("disabled");
            $("#btnStop").attr("disabled","disabled");
            $("#checkBntn div",parent.document).attr("disabled", false);
            //开启右键
            TreeObj.setting.callback.onRightClick = rightClickuserdataTreeNode;            
        });
        function stopRecord(){
            earth.GlobeObserver.Stop();
            $("#btnStop").attr("disabled","disabled");
            var points = earth.PoseRecorder.StopRecord();
            saveAnimList();
            earth.UserDocument.SaveXmlFile(xmlAnimListFile + id, points);
            var recordNode =TreeObj.getSelectedNodes()[0];
            //var newNodes = TreeObj.addNodes(recordNode, {name:params.name,  pId:recordNode.pId, id:id,fps:params.fps});
            TreeObj.selectNode(recordNode,false);
            //initVisitTree();
        }
        var playTag=1;
        $("#btnPlay").click(function () {    //DeleteXmlFileDeleteXmlFile
            earth.PoseRecorder.StopRecord();//播放前县停止动画录制
            if(!TreeObj.getSelectedNodes()[0]){
                return;
            }
            $("#checkBntn div",parent.document).attr("disabled", true);
            $("#btnRecord").attr("disabled","disabled");
            if($(this).text() == "播放"){
                //播放开始屏蔽右键操作
                TreeObj.setting.callback.onRightClick = null;
                var xmlData= earth.UserDocument.LoadXmlFile(xmlAnimListFile  + '.xml');
                var AnimList =loadXMLStr(xmlData);
                var checkNodeArr =[];
                var nodesFolder=AnimList.getElementsByTagName("RecordFolder");
                for(var i=0;i<nodesFolder.length;i++){
                    var folderId=nodesFolder[i].getAttribute("ID");
                    if(folderId==TreeObj.getSelectedNodes()[0].id){
                        if(nodesFolder[i].childNodes.length!=0){
                            $("#btnStop").removeAttr("disabled");
                            for(var n=0;n<nodesFolder[i].childNodes.length;n++){
                                var recordId=nodesFolder[i].childNodes[n].getAttribute("ID");
                                var recordFps =nodesFolder[i].childNodes[n].getAttribute("FPS");
                                checkNodeArr.push({id:recordId,fps:recordFps});
                            }
                        }else{
                            alert("该动画没有动画片段，请重新选择")
                            return;
                        }
                    }
                }
                if(checkNodeArr.length==0 && !TreeObj.getSelectedNodes()[0]){
                    alert("请先选择动画")
                    return;
                }
                $(this).text( "暂停") ;
                var points="";
                var fps;
                if(checkNodeArr.length!=0 ){
                    var playAnimList=true;
                    var m=0;
                    var timers=setInterval(function(){
                        if(playAnimList && checkNodeArr.length!=0){
                            var p= earth.UserDocument.LoadXmlFile(xmlAnimListFile + checkNodeArr[m].id + '.xml');
                            earth.Event.OnPosePlaybackOneFrame = function (ncount,nframe){

                                playAnimList=false;
                                if(ncount == nframe){
                                    m=m+1;
                                    playAnimList=true;
                                    earth.PoseRecorder.StopPlayback();
                                    //播放停止时候 开启右键操作
                                    if(m==checkNodeArr.length){
                                        TreeObj.setting.callback.onRightClick = rightClickuserdataTreeNode;
                                        clearInterval(timers);
                                        $("#btnPlay").text("播放");
                                        $("#btnRecord").removeAttr("disabled");
                                        $("#btnStop").attr("disabled","disabled");
                                        $("#checkBntn div",parent.document).attr("disabled", false);
                                    }
                                }
                            };
                            earth.PoseRecorder.StartPlayback( checkNodeArr[m].fps, p);
                            if(playTag==1){
                                playTag++;
                                earth.PoseRecorder.Pause(true);
                                earth.PoseRecorder.Pause(false);
                            }
                        }
                    },500);
                }else if(TreeObj.getSelectedNodes()[0]){
                    var id =  TreeObj.getSelectedNodes()[0].id;
                    fps =TreeObj.getSelectedNodes()[0].fps;
                    points = earth.UserDocument.LoadXmlFile(xmlAnimListFile + id + '.xml');
                }

                if(points){
                    //alert(fps+"///////"+points)
                    earth.Event.OnPosePlaybackOneFrame = function (ncount,nframe){
                        $("#btnStop").removeAttr("disabled");
                        if(ncount == nframe){
                            TreeObj.setting.callback.onRightClick = rightClickuserdataTreeNode;
                            earth.PoseRecorder.StopPlayback();
                            $("#btnPlay").text("播放");
                           // $("#btnRecord").removeAttr("disabled");
                            $("#btnStop").attr("disabled","disabled");
                            $("#btnRecord").attr("disabled","disabled");
                            $("#checkBntn div",parent.document).attr("disabled", false);
                        }
                    };
                    earth.PoseRecorder.StartPlayback( fps, points);
                    if(playTag==1){
                        playTag++;
                        earth.PoseRecorder.Pause(true);
                        earth.PoseRecorder.Pause(false);
                    }
                }
                $("#btnRecord").attr("disabled","disabled");
            }else if($(this).text() == "暂停"){
                $(this).text("继续");
                earth.PoseRecorder.Pause(true);
            }else if($(this).text() == "继续"){
                earth.PoseRecorder.Pause(false);
                $(this).text("暂停");

            }
        });
        window.onunload=function(){
            if(earth.PoseRecorder){
                earth.PoseRecorder.StopPlayback();
            }

        }
    });
    function record() {
        params = window.showModalDialog("animationSetting.html",null,"dialogWidth=196px;dialogHeight=150px;status=no");
        if(params){
            id = earth.Factory.CreateGUID();
            $("#btnPlay").attr("disabled","disabled");
            $("#btnStop").removeAttr("disabled");
            return true;
        }
        return false;
    }

    function showContextMenu(row, e){
        $('#contextMenu').menu('show', {
            left: e.clientX,
            top: e.clientY
        });
    }
    function getAnims(){
        var xmlAnimList = earth.UserDocument.LoadXmlFile(xmlAnimListFile + '.xml');
        var res = $.xml2json(xmlAnimList);
        if(xmlAnimList==""){
            var animXml = "<Xml><Visit  NAME='visit' ID='1'></Visit></Xml>";
            earth.UserDocument.saveXmlFile(xmlAnimListFile, animXml);
            xmlAnimList=earth.UserDocument.LoadXmlFile(xmlAnimListFile + '.xml');
            res= $.xml2json(xmlAnimList);
        }
        return res;
    }
    function removeAnim(){
        var selRow = TreeObj.getSelectedNodes()[0];
        if(confirm("是否确定要删除该动画？")){
            if(selRow){
                $(selRow).remove();
                saveAnimList();
            }
        }
    }

    /**
     * 保存动画列表
     */
    function saveAnimList(){
        var xmlAnimList= exportAnims();
        earth.UserDocument.SaveXmlFile(xmlAnimListFile,xmlAnimList.xml );
    }
    /**
     * 将动画列表转换为XML格式的字符串
     * @return {String}
     */
    function exportAnims(){
        var xmlData = "<Record ID='" + id  + "' NAME='" + params.name + "'  FPS='"+ params.fps +"'   >" + "</Record>";
        var xmlDoc = loadXMLStr("<xml>" + xmlData + "</xml>");
        var xmlAnimList = earth.UserDocument.LoadXmlFile(xmlAnimListFile + '.xml');
        var AnimList=  loadXMLStr(xmlAnimList);
        var lookupNode = null;
        var zTree = $.fn.zTree.getZTreeObj("userdataTree");
        var nodes = zTree.getSelectedNodes();
        var treeNode = nodes[0];
        var newNodes = zTree.addNodes(treeNode, {name:params.name,  pId:treeNode.pId, id:id,fps:params.fps});
        //createElementsFolder(treeNode, newNodes[0]);
        if(treeNode.id != -1){
            var foderxml=AnimList.getElementsByTagName('RecordFolder');
            var folder;
            for(var m=0;m<foderxml.length;m++){
                var folderId=foderxml[m].getAttribute("ID");
                 if(treeNode.id==folderId){
                     folder= foderxml[m];
                 }
            }
            folder.appendChild(xmlDoc.documentElement.firstChild);
        }
        return AnimList;
    }
        var loadXMLStr=function(xmlStr){
            var xmlDoc;

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