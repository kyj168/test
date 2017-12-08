/**
 * 搜索
 */
var divHeight = $("#id_left_operator",parent.document).height() - 210;
$("#dgDiv").height(divHeight);
$("#srcollDiv").height(divHeight-30);

var earth=parent.earth;
var result=parent.searchResult;

var search=STAMP.Search(earth);
var locationHref = window.location.href;
var idIndex = locationHref.indexOf("?id=");
var id = locationHref.substr(idIndex+4);

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
$(function(){
    $("#searchBtn").click(function(){

        var layerId = $("#layerSelect").val();
        if(id == "polygon"){
            search.polygonSearch(layerId);
        }else if(id == "circle"){
            search.circleSearch(layerId);
        }else if(id == "rectangle"){
            search.rectangleSearch(layerId);
        }
    });
    $("#drawBtn").click(function(){
        if(id == "polygon"){
            search.drawPolygon();
        }else if(id == "circle"){
            search.drawCircle();
        }else if(id == "rectangle"){
            search.drawRectangle();
        }
    });
})


//分页控件引用
var pagePagination  = function(){
    var totalPageNum = Math.ceil(result.RecordCount / pageRecordCount);
    if(totalPageNum==0){
        totalPageNum = 1;
    }
    //console.log(searchResult.recordCount+' , '+pageRecordCount);
    $("#page").pagination({
        total:result.RecordCount,//总的记录数
        pageSize:pageRecordCount,//每页显示的大小。
        showPageList:false,
        showRefresh:false,
        displayMsg:"",
        beforePageText: "",
        afterPageText: "/" + totalPageNum,
        onSelectPage: function(pageNumber, ps){//选择相应的页码时刷新显示内容列表。
            search.showResult(pageNumber);
            //$("#searchData").attr("style","height:"+(180+640-((1080-$(window).height())*11/12))+"px;");
        }
    });
}
window.onunload = function(){
    search.clearBolloan();
};