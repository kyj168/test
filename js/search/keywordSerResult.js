/**
 * 关键字查询
 */
var divHeight = $("#id_left_operator",parent.document).height() - 250;
$("#dgDiv").height(divHeight);
$("#srcollDiv").height(divHeight-30);
$("#srcollDiv").mCustomScrollbar({});//滚动条

var earth=parent.earth;
var search=STAMP.Search(earth);
var poiLayerId = '';
search.loadSearch(earth);

//给select添加poi图层
var gisLayer = null;
var gisArr = top.LayerManagement.gisArr;
var projectId = top.SYSTEMPARAMS.project;
for(var j=0; j<gisArr.length; j++){
    if(gisArr[j].id == projectId){
        gisLayer = gisArr[j].gis;
        break;
    }
}
if(gisLayer == null || gisLayer == ''){
    $('#layerSelect').append(
        '<option>当前工程无兴趣点</option>'
    );
}else{
    for(var i = 0; i < gisLayer.length; i++){
        //console.log(gisLayer[i].Name+' , '+gisLayer[i].Guid+' , '+gisLayer[i].LayerType);
        $('#layerSelect').append(
            '<option value="'+gisLayer[i].id+'">'+gisLayer[i].name+'</option>'
        );
    }
}

//关键字搜索
$("#searchBtn").click(function(){
    var poiLayerId = $("#layerSelect").val();
    search.keyWordSearch(poiLayerId);
});
window.onunload = function(){
    search.clearBolloan();
};
