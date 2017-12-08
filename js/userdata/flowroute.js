/**
 * 逃生路线
 */

var userdataObj = window.dialogArguments;
returnValue = null;

/**

 * 添加材质

 */

function addLink(textId,hz) {

    var filePath =  userdataObj.earth.UserDocument.OpenFileDialog(   userdataObj.earth.RootPath, "所有支持类型|*.BMP;*.DIB;*.JPG;*.JPEG;*.PNG;*.TIF;*.TIFF;*.GIF|BMP文件(*.BMP;*.DIB)|*.BMP;*.DIB|JPEG文件(*.JPG;*.JPEG)|*.JPG;*.JPEG|PNG文件(*.PNG)|*.PNG");

    if (filePath == "")

        return;

    var fileType = filePath.substring(filePath.lastIndexOf(".") + 1).toLowerCase();

    if ("jpg" == fileType || "jpeg" == fileType || "png" == fileType || "bmp" == fileType || "gif" == fileType) {

        document.getElementById(textId).value = filePath;

        //setDisabledByHZ(false,hz);

    } else {

        alert("支持图片格式为:jpeg,jpg,png,bmp,gif");

    }

}

function submit() {
    var radius = $('#radius').val(),
        texture = $('#texture0').val();
    if(radius == '' || isNaN(radius) || radius <= 0) {
        alert('管径需为正数');
        return;
    }
    if(texture == '') {
        alert('请选择纹理图片');
        return;
    }
    returnValue = {
        radius: Number(radius),
        texture: texture
    };
    window.close();
}

function closeWindow(){
    window.close();
}
