
    var earth="";
    function getEarth(earthObj){
        earth = earthObj;
        var usearth = earth ;
        var analysis = usearth.analysisObj;
        /**
         * 最佳路径分析
         */
        $("#btnStart").click(function(){
            analysis.clear();
            if($("#btnStart").text()=="开始分析"){
                //$("#btnStart").text("结束分析");
                if(check()){
                    $("#btnStart").attr("disabled","disabled");
                    $("#climbLimited").attr("disabled","disabled");
                    $("#descentLimited").attr("disabled","disabled");
                    $("#clear").attr("disabled","disabled");
                    var climbLimited = document.getElementById("climbLimited").value;
                    var descentLimited = document.getElementById("descentLimited").value;
                    var btn = [$("#climbLimited"),$("#descentLimited"),$("#btnStart"),$("#clear")];
                    analysis.bestPath(climbLimited,descentLimited,btn);
                    usearth.Event.OnRBDown = function () {
                        clearBestpath();
                        usearth.Event.OnRBDown = function () {
                        };
                    };
                }
            }else {
                $("#btnStart").text("开始分析");
                $("#climbLimited").removeAttr("disabled");
                $("#descentLimited").removeAttr("disabled");
                $("#clear").removeAttr("disabled");
            }

        });
        function  clearBestpath(){
            analysis.clear();
            $("#climbLimited").removeAttr("disabled");
            $("#descentLimited").removeAttr("disabled");
            $("#btnStart").removeAttr("disabled");
            $("#clear").removeAttr("disabled");
        }
        $("#clear").click(function(){
            analysis.clearHtmlBallon(earth.htmlBallon);
        });
        window.onunload=function(){
            analysis.clear();
        };
    }
    function check(){
        if(isNaN($("#climbLimited").val()) == true){
            alert("无效的上坡值");
            climbLimited.select();
            climbLimited.focus();
            return false;
        }
        if($("#climbLimited").val() < 0  || $("#climbLimited").val() >90 ){
            var str = "无效的上坡值"+($("#climbLimited").val()>90?"，不能大于90":"");
            alert(str);
            climbLimited.select();
            climbLimited.focus();
            return false;
        }
        if(isNaN($("#descentLimited").val()) == true){
            alert("无效的下坡值");
            descentLimited.select();
            descentLimited.focus();
            return false;
        }
        if($("#descentLimited").val() < 0  || $("#descentLimited").val()>90){
            var str = "无效的下坡值"+($("#descentLimited").val()>90?"，不能大于90":"");
            alert(str);
            descentLimited.select();
            descentLimited.focus();
            return false;
        }
        return true;
    }