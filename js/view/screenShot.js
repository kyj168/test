
    document.oncontextmenu = function () {
        event.returnValue = false;//212221
    };

    var earth ="";
    function setTranScroll(earthObj){
        earth = earthObj;
        $("#width").val(earth.clientWidth);
        $("#height").val(earth.clientHeight);
        $("#btn_select_sector").click(function(){
            var path=$("#path").val();
            var width= $("#width").val();
            var height = $("#height").val();
            if(check()){
                if(path){
                    $("#width").attr("disabled",true);
                    $("#height").attr("disabled",true);
                    $("#clear").attr("disabled",true);
                    var isGuiVisible = $("#isFloatSelect").is(":checked");
                    var shotWay = $("#shotWay").val();
                    earth.ScreenShot(path,width,height,shotWay,isGuiVisible);
                    $("#path").val("");
                    $("#btn_select_sector").attr("disabled",true);
                }
                $("#width").attr("disabled",false);
                $("#height").attr("disabled",false);
                $("#clear").attr("disabled",false);
            }
        });

        $("#select").click(function(){
            var path = earth.UserDocument.SaveFileDialog("", "*.jpg|*.JPG","jpg");
            if(!path){
                return;
            }
            var filename = path.substring(path.lastIndexOf("\\")+1,path.lastIndexOf("."));
            if(containSpecial(filename)){
                alert("名称不能有特殊字符！");
                return;
            }
            $("#path").val(path);
            if(""!=$("#path").val()&&""!=$("#width").val()&&""!=$("#height").val()){
                $("#btn_select_sector").attr("disabled",false);
            }
        });

        $("#clear").click(function(){
            if (earth.htmlBallon != null){
                earth.htmlBallon.DestroyObject();
                earth.htmlBallon = null;
            }
        });
    }
    function check(){
        if(height.value == ""){
            alert("无效的高度值");
            height.focus();
            return false;
        }
        if(isNaN(height.value)){
            alert("无效的高度值");
            height.select();
            height.focus();
            return false;
        }
        if(height.value<=0|| height.value > 4000){
            alert("无效的高度值高度值不能为负数或者大于4000");
            height.select();
            height.focus();
            return false;
        }
        if(width.value == ""){
            alert("无效的宽度值");
            width.focus();
            return false;
        }
        if(isNaN(width.value)){
            alert("无效的宽度值");
            width.select();
            width.focus();
            return false;
        }
        if(width.value<=0 || width.value> 6000){
            alert("无效的宽度值,宽度值不能为负数或者不能大于6000");
            width.select();
            width.focus();
            return false;
        }
        if(path.value == ""){
            alert("请选择存储路径");
            path.focus();
            return false;
        }
        return true;
    }
    function containSpecial( s ){
        var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
        return ( containSpecial.test(s) );
    }