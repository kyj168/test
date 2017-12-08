/*
 * 模块：一级菜单
 * 功能：菜单功能方法
 */

var lastClickId = "";
var tagArr = [];
function getTagArr(){
    var menuTotal = cpPs.config.menu;
    var menuList = authMgr.getMenus();
    for(var i = 0; i < menuTotal.length; i++){
        for(var j = 0; j < menuTotal[i].item.length;j++){
            var thisMenu = menuTotal[i].item[j].name;
            if($.inArray(thisMenu, menuList) >= 0){
                tagArr.push(menuTotal[i].tag);
                break;
            }
        }
    }
}


function initMenu(){
    for(var i = 0; i < STAMP.menuConfig.menu.length;i++){
        tagArr.push(STAMP.menuConfig.menu[i].tag);
    }
    var minTag = Math.min.apply(null,tagArr);
    var menuHtml = getMenusHtml();
    $("#DB_ul").html(menuHtml);

    lastClickId = $(".topLi[tagIndex=" + minTag + "]").attr("id");
    $("#"+lastClickId + " img").attr("src","images/top/activeIcons/"+lastClickId+".png");
    getTableObjectById(minTag);
}

function getMenusHtml(){
    var menuHtml = "";
    for(var i = STAMP.menuConfig.menu.length-1; i >= 0 ; i--){
        var item = STAMP.menuConfig.menu[i];
        menuHtml += '<li tagIndex="' + parseInt(item.tag) + '" id="' + item.id + '" class="topLi"><img id="' + item.id + 'Img" tagIndex="' + parseInt(item.tag) + '" class="topImg" src="' + item.src + '" alt="' + item.name + '" /></li>';
    }
    var ulWidth = STAMP.menuConfig.menu.length * 85;
    $("#DB_ul").width(ulWidth)
    return menuHtml;
}

//菜单禁用
function disableAll(isDisable){
	$("#DB_navi").attr("disabled",isDisable);
	$(".topImg").attr("disabled",isDisable);
}

$(document).ready(function(){
	var DB_navi = document.getElementById("DB_navi");
	var DB_ul = document.getElementById("DB_ul");
	$("#DB_navi").click(function(e){//一级菜单点击事件
		if($("#DB_navi").attr("disabled") == true || $("#DB_navi").attr("disabled") == "disabled"){
			return;
		}
		var ev = null;
		if(e){
			ev = e.target;
		}else{
			ev = window.event.srcElement;
		}
		var id = ev.getAttribute("tagIndex");

        if(id == undefined){
            return;
        }

		id = parseInt(id);

		if(!isNaN(id)){
			var thisId = ev.id;
            var imgIndex = thisId.indexOf("Img");
            if(imgIndex>0){
                imgId = thisId.substr(0,thisId.lastIndexOf("Img"));
            }else{
                imgId = $("#"+thisId)[0].id;
            }
            $("#"+lastClickId + " img").attr("src","images/top/inactiveIcons/"+lastClickId+".png");
            lastClickId = imgId;
            $("#"+imgId + " img").attr("src","images/top/activeIcons/"+imgId+".png");
			top.getTableObjectById(id);//二级菜单根据一级菜单点击事件
		}else{
			return;
		}
	});
});
	
	
