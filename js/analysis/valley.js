var earth="";
    function getEarth(earthObj){
        earth = earthObj;
        var usearth = earth ;
        var analysis = usearth.analysisObj;
        /**
         * 获得高程值
         */
        $("#getHeight").click(function() {
            document.getElementById("getHeight").style.cursor = "crosshair";
            analysis.getAltitude(function(val){ valleyLine1.value = val; });
            usearth.Event.OnLBUp = function(p) {
                document.getElementById("getHeight").style.cursor ="auto";
                usearth.Event.OnLBUp = function() {};
            };
        });
        function chkNum(obj){
            //检查是否是非数字值
            if (isNaN(obj.val())) {
                obj.val("") ;
            }
            if (obj != null) {
                //检查小数点后是否对于两位
                if (obj.val() < 0) {
                    return false;
                } else {
                    return true;
                }
            }
        };
        /**
         * 流域分析
         */
        $("#btnStart").click(function() {
            analysis.clear();
            var altitude = document.getElementById("valleyLine1").value;
            var altitude1 = document.getElementById("valleyLine").value;
            var radius = document.getElementById("valleyRadius").value;
            if(!chkNum($("#valleyLine"))){
                alert("水位埋深必须为数字且不能小于0");
                return ;
            };
            if (isNaN(radius) || isNaN(altitude)||isNaN(altitude1)) {
                alert("请输入数字！");
                return;
            }
            if (radius == "") {
                alert("请输入半径或选取范围！");
                return;
            }
            if (radius <= 0) {
                alert("半径不能为零或小于零！");
                return;
            }
            if (altitude == "") {
                alert("请输入水位！");
                return;
            }
            if (altitude1 == "") {
                alert("请输入水位！");
                return;
            }
            if (altitude1 <= 0) {
                alert("水位埋深必须大于0！");
                return;
            }
            if($("#btnStart").text()==="开始分析"){
                //$("#btnStart").text("结束分析");
                $("#btnStart").attr("disabled","disabled") ;
                $("#clear").attr("disabled","disabled") ;
                $("#valleyLine1").attr("disabled","disabled") ;
                $("#valleyLine").attr("disabled","disabled") ;
                $("#valleyRadius").attr("disabled","disabled") ;
                $("#getHeight").attr("disabled","disabled") ;
                var alt1 = document.getElementById("valleyLine1").value;
                var alt2 = document.getElementById("valleyLine").value;
                var radius = document.getElementById("valleyRadius").value;
                var  altitude = parseFloat(alt1)  + parseFloat(alt2) ;
                var btn = [$("#valleyLine1"),$("#valleyLine"),$("#valleyRadius"),$("#btnStart"),$("#getHeight"),$("#clear")];
                analysis.valley(altitude,radius,btn);
            }
        });
        $("#clear").click(function(){
            analysis.clearHtmlBallon(earth.htmlBallon);
        });
        window.onunload=function(){
            analysis.clear();
        };
    }