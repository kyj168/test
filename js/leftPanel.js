/**
 * 模块：左侧面板
 * 功能：左侧面板相关方法
 */
var dialogId = null;
var bLayerVisible = true;//图层管理关闭状态
var menuItem = null;

/*打开左侧面板*/
window.showDialog = function(src,clickId,_onClose){
    closeDialog();
	if(clickId && clickId == dialogId && clickId != "QueryProperty"){
		closeDialog();
		return;
	}
	if(dialogId){
		Tools.singleStyleCancel(dialogId);
	}
	Tools.singleSelectedStyle(clickId);
	dialogId = clickId;
	
	LayerManagement.clearHtmlBalloons();
	if($("#leftPanel").is(":hidden")){
		setLayerShow(true);//显示左侧面板
		bLayerVisible = false;
	}
	var title = "";
	var titleImg = "";
	for(var i = 0; i < STAMP.menuConfig.menu.length; i++){
		for(var j = 0; j < STAMP.menuConfig.menu[i].item.length; j++){
			if(STAMP.menuConfig.menu[i].item[j].id == clickId){
				title = STAMP.menuConfig.menu[i].item[j].title;
				titleImg = STAMP.menuConfig.menu[i].item[j].src;
				menuItem = STAMP.menuConfig.menu[i].item[j];
			}
		}
	}
	if(clickId == "QueryProperty"){//属性查询
		title = "属性查询";
		titleImg = "images/tools/QueryProperty.png";
	}else if(clickId == "systemSettingNow"){
		title = "系统设置";
		titleImg = "images/tools/系统设置.png";
	}
	$("#id_left_operator").show();
	$("#id_left_operator").dialog({
		shadow: false,
        draggable: false,
        title: title,
        titleImg: titleImg,
		onClose: function() {
			$("#id_left_operator").hide();
			$("#operator").attr("src", "");
			LayerManagement.clearHtmlBalloons();
			Tools.singleStyleCancel(dialogId);
			dialogId = null;
			if(!bLayerVisible){
				setLayerShow(false);//隐藏左侧面板
			}
			if( typeof _onClose == "function"){
				_onClose();
			}
		}
	}).panel({
        height: $(document).height() - 70,
        width: 255
    }).panel("move", {
        top: "70px",
        left: "0px"
    });
    
    $("#id_left_operator").show();
    $("#operator").attr("src", src);
};

function closeDialog(){
	if($("#id_left_operator").css("display") != "none"){
		$("#id_left_operator").hide();
		$("#id_left_operator").dialog('close');
		Tools.singleStyleCancel(dialogId);
		dialogId = null;
	}
}