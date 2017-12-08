//modefied by lq 2017-08-25
//线缓冲
function bufferSubmit() {
    var leftRadiusValue = document.getElementById("leftRadiusValue");
    var rightRadiusValue = document.getElementById("rightRadiusValue");
    if (checkBuffer(leftRadiusValue, rightRadiusValue)) {
        var mySelect = document.getElementById("bufferStyle");
        var index = mySelect.selectedIndex;

        var resultVelue = {
            bufferStyle: mySelect.options[index].value,
            leftRadius: leftRadiusValue.value,
            rightRadius: rightRadiusValue.value
        };
        window.returnValue = resultVelue;
        window.close();
    }
}

function checkBuffer(leftRadiusValue, rightRadiusValue) {
    if ("" == leftRadiusValue.value) {
        alert("请输入半径！");
        leftRadiusValue.focus();
        return false;
    }
    if (isNaN(leftRadiusValue.value) || leftRadiusValue.value < 0) {
        alert("半径输入不正确！");
        leftRadiusValue.focus();
        return false;
    }
    if ("" == rightRadiusValue.value) {
        alert("请输入半径！");
        rightRadiusValue.focus();
        return false;
    }
    if (isNaN(rightRadiusValue.value) || rightRadiusValue.value < 0) {
        alert("半径输入不正确！");
        rightRadiusValue.focus();
        return false;
    }
    if (rightRadiusValue.value == 0 && leftRadiusValue.value == 0) {
        alert("半径不能同时为0，请重新输入！");
        rightRadiusValue.focus();
        return false;
    }
    return true;
}

function closeWindow() {
    window.returnValue = false;
    window.close();
}
