
    document.oncontextmenu = function () {
        event.returnValue = false;//212221
    };
    var earth ="";
    function setTranScroll(earthObj){
        earth = earthObj;
        var Rectangle = "";// 范围
        var type = "";
        var recordState = false;
        var totalCount;
        var cur_num = 0;
        var tag;
        var path="";//保存路径
        var xmlData="";;//webjain信息
        $("#amount,#path,#height,#width").change(function(){
            if($("#amount").val()!="" && $("#path").val()!="" && $("#height").val()!="" && $("#width").val()!="" ){
                if(isNaN($("#amount").val())){
                    alert("分辨率不是数字，请重新设置！")
                    $("#btn_select_sector").attr("disabled","disabled");
                    return;
                } else if($("#amount").val()<=0){
                    alert("分辨率必须大于0，请重新输入！")
                    $("#btn_select_sector").attr("disabled","disabled");
                    return;
                }else if(isNaN($("#height").val())){
                    alert("图片高度不是数字，请重新设置！")
                    $("#btn_select_sector").attr("disabled","disabled");
                    return;
                } else if($("#height").val()<=0){
                    alert("图片高度必须大于0，请重新输入！")
                    $("#btn_select_sector").attr("disabled","disabled");
                    return;
                }else if(isNaN($("#width").val())){
                    alert("图片宽度不是数字，请重新设置！")
                    $("#btn_select_sector").attr("disabled","disabled");
                    return;
                }else if($("#width").val()<=0){
                    alert("图片宽度必须大于0，请重新输入！")
                    $("#btn_select_sector").attr("disabled","disabled");
                    return;
                }
                $("#btn_select_sector").removeAttr("disabled");
            } else {
                $("#btn_select_sector").attr("disabled","disabled");
            }
        });
        $("#amount,#path,#height,#width").trigger("change");
        $("#select").click(function(){
            var path = earth.UserDocument.OpenFilePathDialog("", "");
            if(!path){
                return;
            }
            $("#path").val(path);
            if(""!=$("#path").val()&&""!=$("#width").val()&&""!=$("#height").val()&&""!=$("amount").val()){
                $("#btn_select_sector").attr("disabled",false);
            }
        });
        $("#cameraPose").click(function(){
            $("#heading").val(earth.GlobeObserver.Pose.heading.toFixed(2)) ;
            $("#tilt").val(earth.GlobeObserver.Pose.tilt.toFixed(2)) ;
            $("#range").val(earth.GlobeObserver.Pose.range.toFixed(2));
        })
        function pathEdit(path){
            var pathArr=path.split("\\");
            var savepath=pathArr[0];
            for(var i=1;i<pathArr.length-1;i++){
                savepath +="\\"+pathArr[i] ;
            }
            xmlData += " <Path>"+savepath+"</Path>";
            return  savepath;
        }
        $(function(){
            $("#btn_select_sector").click(function(){
                earth.Event.OnCreateGeometry  = function(pval,t){
                    if(!pval || pval.Count <= 3){
                        alert("至少绘制3个点");
                        return;
                    }
                    // Rectangle = pval;
                    var maxLon = 0;
                    var maxLat = 0;
                    var minLon = 0;
                    var minLat = 0;
                    maxLon = minLon = pval.Items(0).x;
                    maxLat = minLat = pval.Items(0).y;
                    for(var i = 1; i < pval.Count; i++){
                        var obj = pval.Items(i);
                        if(obj.x > maxLon){
                            maxLon = obj.x;
                        }
                        if(obj.x < minLon){
                            minLon = obj.x;
                        }
                        if(obj.y > maxLat){
                            maxLat = obj.y;
                        }
                        if(obj.y < minLat){
                            minLat = obj.y;
                        }
                    }
                    var v3s = earth.Factory.CreateVector3s();
                    v3s.Add(minLon, maxLat, earth.Measure.MeasureTerrainAltitude(minLon, maxLat));
                    v3s.Add(maxLon, maxLat, earth.Measure.MeasureTerrainAltitude(maxLon, maxLat));
                    v3s.Add(maxLon, minLat, earth.Measure.MeasureTerrainAltitude(maxLon, minLat));
                    v3s.Add(minLon, minLat, earth.Measure.MeasureTerrainAltitude(minLon, minLat));
                    Rectangle = v3s;
                    // type = t;
                    $("#btnStart").removeAttr("disabled");
                };
                earth.ShapeCreator.Clear();
                earth.ShapeCreator.CreatePolygon();
                // earth.ShapeCreator.CreateRectangle();
            });
            $("#btnStart").click(function(){
                earth.ShapeCreator.Clear();
                if($("#btnStart").text()=="开始"){
                    var height=$("#height").val();
                    var width=$("#width").val();
                    var sec = parseFloat($("#sec").val());
                    var amount=$("#amount").val();
                    var path=$("#path").val();
                    if (isNaN(height) || isNaN(width) || isNaN(amount) ) {
                        alert("请输入数字！");
                        return;
                    }
                    if (amount == "") {
                        alert("请输入像素个数");
                        return;
                    }
                    if (width == "") {
                        alert("请输入像素宽度！");
                        return;
                    }
                    if (height == "") {
                        alert("请输入像素高度！");
                        return;
                    }
                    if (path == "") {
                        alert("输出路径不能为空！");
                        return;
                    }
                    if (parseInt(amount) < 1) {
                        alert("个数不能为零或小于零！");
                        return;
                    }
                    if (parseInt(width) <= 0) {
                        alert("宽度不能为零或小于零！");
                        return;
                    }
                    if (parseInt(height) <= 0) {
                        alert("高度不能为零或小于零！");
                        return;
                    }
                    $("#btnStart").text("停止");
                    $("#btn_select_sector").attr("disabled","disabled");
                    $("#amount").attr("disabled","disabled");
                    $("#width").attr("disabled","disabled");
                    $("#height").attr("disabled","disabled");
                    $("#path").attr("disabled","disabled");
                    $("#clear").attr("disabled","disabled");
                    // if (type == 6) {
                        totalCount = earth.ImageGenerator.Begin(path, Rectangle, width, height, amount);
                        earth.ImageGenerator.GotoImage(cur_num);
                        tag = setInterval(function Loop(){
                            if(recordState==false) return;
                            var count= earth.GetDownloadCount();
                            if(count==0){
                                earth.ImageGenerator.GenerateOne();      // 生成一张图片
                                cur_num++;
                                if (cur_num>=totalCount){
                                    recordState = false;
                                    earth.ImageGenerator.End();
                                    clearInterval(tag);
                                    cur_num = 0;
                                    $("#btnStart").text("开始") ;
                                    $("#btnStart").attr("disabled","disabled");
                                    $("#btn_select_sector").removeAttr("disabled");
                                    $("#amount").removeAttr("disabled");
                                    $("#width").removeAttr("disabled");
                                    $("#height").removeAttr("disabled");
                                    $("#path").removeAttr("disabled");
                                    $("#clear").removeAttr("disabled");
                                } else{
                                    earth.ImageGenerator.GotoImage(cur_num);
                                    var value= (cur_num*100)/totalCount  ;
                                }
                            }
                        }, sec * 1000);
                        recordState = true;
                    // }
                }else {
                    $("#btnStart").text("开始") ;
                    recordState = false;
                    earth.ImageGenerator.End();
                    clearInterval(tag);
                    cur_num = 0;
                    $("#btnStart").attr("disabled","disabled");
                    $("#btn_select_sector").removeAttr("disabled");
                    $("#amount").removeAttr("disabled");
                    $("#width").removeAttr("disabled");
                    $("#height").removeAttr("disabled");
                    $("#path").removeAttr("disabled");
                    $("#clear").removeAttr("disabled");
                }
            });
            $("#clear").click(function(){
                earth.ShapeCreator.Clear();
                if (earth.htmlBallon != null){
                    earth.htmlBallon.DestroyObject();
                    earth.htmlBallon = null;
                }
            });
            $("#btn_set_sector").click(function(){

               var heading =  $("#heading").val();//相机朝向
               if(!Number(heading)){
                    alert("请设置正确的朝向");
                    return;
               }
               var tilt =  $("#tilt").val();//相机俯仰
               if(!Number(tilt)){
                    alert("请设置正确的朝向");
                    return;
               }
                var range = $("#range").val();//相机高度
                if(!Number(range)){
                    alert("请设置正确的高度");
                    return;
               }

               var targetPost =  earth.GlobeObserver.TargetPose;

               earth.GlobeObserver.FlytoLookat(targetPost.Longitude,targetPost.Latitude,targetPost.Altitude,heading,tilt,earth.GlobeObserver.Pose.roll,range, 3);

            });

        });
    }