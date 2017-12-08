/**
 * 搜索 - geo
 */

var earth=parent.earth;
var searchResult=parent.searchResult;
var search=STAMP.Search(earth);

var divHeight = $("#id_left_operator",parent.document).height() - 55;
$("#dgDiv").height(divHeight);
$("#srcollDiv").height(divHeight-28);

//分页控件引用
var pagePagination  = function(){
    var totalPageNum = searchResult.totalPageNum;
    if(totalPageNum==0){
        totalPageNum = 1;
    }
    $("#page").pagination({
        total:searchResult.recordCount,//总的记录数
        pageSize:pageRecordCount,//每页显示的大小。
        showPageList:false,
        showRefresh:false,
        displayMsg:"",
        beforePageText: "",
        afterPageText: "/" + totalPageNum,
        onSelectPage: function(pageNumber, ps){//选择相应的页码时刷新显示内容列表。
            search.showGeoResult(pageNumber);
        }
    });
}
if ((searchResult == null) || (searchResult.recordCount == 0)) {
    search.emptyResultHtml();
    pagePagination();
} else {
    search.showGeoResult(1);
    pagePagination();
}
window.onunload = function(){
    search.clearBolloan();
};