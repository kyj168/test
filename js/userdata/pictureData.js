/**
 * 添加图片
 */

var userdataObj = window.dialogArguments;
var earth=userdataObj.earth;
var iconFileName = "";
var isSubmit = false;
function billboard_submit(){
    isSubmit = true;

    if(check()) {
        if(userdataObj != null) {
            userdataObj.click="true";
            userdataObj.name = document.getElementById("billboardName").value;
            userdataObj.desc = document.getElementById("description").value;
            userdataObj.width = document.getElementById("width").value;
            userdataObj.height = document.getElementById("height").value;
            /* userdataObj.maxHeight = document.getElementById("maxHeight").value; */
            var dataProcess=document.getElementById("dataProcess");
            dataProcess.Load();
            var iconpath=iconFileName.split(".");
            if(iconFileName!=null&&iconFileName!=""&&iconpath[iconpath.length-1]!="dds"&&iconpath[iconpath.length-1]!="DDS"){
                var texttrue=iconFileName.split("\\");
                var texttrueFname=texttrue[texttrue.length-1];
                //edit by yzp 2014-08-04 17:52 修改存储路径为userdata
                var  rootpath= userdataObj.earth.RootPath+"userdata\\"+texttrueFname;
                var a=dataProcess.DataConvert.Convert_File(iconFileName,rootpath)  ;
                if(a===1){
                    iconFileName=  iconFileName;
                }else if(a===0){
                    iconFileName=  rootpath;
                } else if(a===-1){
                    alert("模型转换没成功！");
                    return;
                }
                //iconFileName=  rootpath;
            }
            userdataObj.iconFileName = iconFileName;
            /* userdataObj.maxHeight = document.getElementById("maxHeight").value; */
            window.close();
        }
    }
}
function check(){
    var billboardName = document.getElementById("billboardName").value;
    if("" == billboardName){
        alert("请输入名字！");
        document.getElementById("billboardName").focus()
        return false;
    }
    var width = document.getElementById("width").value;
    if("" == width){
        alert("请输入宽度！");
        document.getElementById("width").focus()
        return false;
    }
    if(isNaN(width)){
        alert("宽度必须是数字！");
        document.getElementById("width").focus()
        return false;
    }
    if(parseInt(width) < 1){
        alert("宽度不能小于1！");
        document.getElementById("width").focus()
        return false;
    }
    var height = document.getElementById("height").value;
    if("" == height){
        alert("请输入高度！");
        document.getElementById("height").focus()
        return false;
    }
    if(isNaN(height)){
        alert("高度必须是数字！");
        document.getElementById("height").focus()
        return false;
    }
    if(parseInt(height) < 1){
        alert("高度不能小于1！");
        document.getElementById("height").focus()
        return false;
    }
    return true;
}
function billboard_close(){
    isSubmit = false;
    userdataObj.click="false";
    window.close();
}

function unloadPictureWindow(){
    if(!isSubmit){
        userdataObj.click="false";
    }
}

var iconPath;
function attribute(){
    var nodeObj = null;
    iconPath = userdataObj.path;
    if(!userdataObj.iconFileName){
        iconFileName ="";//iconPath  + "icon\\icon.dds";
    }else{
        iconFileName = userdataObj.iconFileName;//iconPath  + "icon\icon.png";
    }

    document.getElementById("iconId").src = iconFileName;
    document.getElementById("iconValue").value = iconFileName;
    if("add" == userdataObj.action){
        return;
    }else if("edit" == userdataObj.action){
        document.getElementById("billboardName").value =userdataObj.name;
        document.getElementById("width").value = userdataObj.width;
        document.getElementById("height").value = userdataObj.height;
        document.getElementById("description").value = userdataObj.desc;
        document.getElementById("iconId").src=iconFileName;
    }
    if(""!=document.getElementById("iconValue").value){
        document.getElementById("buttAdd").disabled = false;
    }
}
function addIcon(){
    iconFileName = earth.UserDocument.openFileDialog( userdataObj.path, "所有支持类型|*.DDS;*.BMP;*.DIB;*.JPG;*.JPEG;*.PNG;*.TIF;*.TIFF;*.GIF|DDS文件(*.DDS)|*.DDS|BMP文件(*.BMP;*.DIB)|*.BMP;*.DIB|JPEG文件(*.JPG;*.JPEG)|*.JPG;*.JPEG|PNG文件(*.PNG)|*.PNG|GIF文件(*.GIF)|*.GIF");
    if (iconFileName == "")
        return;
    var fileType = iconFileName.substring(iconFileName.lastIndexOf(".") + 1).toLowerCase();
    document.getElementById("iconId").src = iconFileName;
    document.getElementById("iconValue").value = iconFileName;
    document.getElementById("buttAdd").disabled = false;
}
var img=null;
function s() {
    if(img){
        img.removeNode(true);
    }
    img=document.createElement("img");
    img.style.position="absolute";
    img.style.visibility="hidden";
    img.attachEvent("onreadystatechange",orsc);
    img.attachEvent("onerror",oe);
    document.body.insertAdjacentElement("beforeend",img);
    img.src=iconFileName;
}
function oe() {
    alert("cant load img");
}
function orsc() {
    if(img.readyState!="complete"){
        return false;
    };
    if(img.offsetHeight != 32 && img.offsetWidth != 32){
        alert("请选择像素为32X32的图片");
        iconFileName = iconPath  + "icon/icon.png";
        document.getElementById("iconId").src = iconFileName;
        document.getElementById("iconValue").value = iconFileName;
        return false;
    }
    //alert("高:"+img.offsetHeight+"\n宽:"+img.offsetWidth);
}