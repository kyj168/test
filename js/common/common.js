/**
 * 打开子窗口
 * @param url - 子窗口地址
 * @param params - 父窗口传给子窗口的参数
 * @param width - 子窗口宽度
 * @param height - 子窗口高度
 * @returns 子窗口传给父窗口的参数
 */
function openDialog(url,params,width,height){
    var is_opera = /opera/i.test(navigator.userAgent);  
    var is_ie = (/msie/i.test(navigator.userAgent) && !is_opera);
    var is_ie_6 = (is_ie && /msie 6\.0/i.test(navigator.userAgent));
    
    var value = "";
    if(is_ie_6){
        height = height + 50;
        value = window.showModalDialog(url,params,"menubar:no;dialogWidth:"+width+"px;status:yes;title:no;help:no;resizable:no;scroll:yes;location:no;toolbar:no;dialogHeight:"+height+"px");
    }else{
        value = window.showModalDialog(url,params,"menubar:no;dialogWidth:"+width+"px;status:yes;title:no;help:no;resizable:no;scroll:yes;location:no;toolbar:no;dialogHeight:"+height+"px");
    }
    return value;
}

/**
 * 将xml字符串转换为dom对象
 * @param xmlStr - xml要转换的字符串对象
 * @returns dom对象
 */
function loadXMLStr(xmlStr){
	var xmlDoc;
	
	try {
		if (window.ActiveXObject || window.ActiveXObject.prototype) {
			var activeX = ['Microsoft.XMLDOM', 'MSXML5.XMLDOM', 'MSXML.XMLDOM', 'MSXML2.XMLDOM','MSXML2.DOMDocument'];
			for (var i=0; i<activeX.length; i++){
				xmlDoc = new ActiveXObject(activeX[i]);
				xmlDoc.async = false;
				break;
			}
			if (/http/ig.test(xmlStr.substring(0,4))){
				xmlDoc.load(xmlStr);
			}else{
				xmlDoc.loadXML(xmlStr);
			}
		} else if (document.implementation && document.implementation.createDocument) {
			xmlDoc = document.implementation.createDocument('', '', null);
			xmlDoc.loadXml(xmlStr);
		} else {
			xmlDoc = null;
		}
	}catch (exception){
		xmlDoc = null;
	}
		
	return xmlDoc;
}

/**
 * 将指定的XML文件转换为dom对象
 * @param file - XML文件
 * @returns dom对象
 */
function loadXMLFile(file){	
	var xmlDoc = null;
	if (window.ActiveXObject || window.ActiveXObject.prototype){
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	}else if(document.implementation.createDocument){
		xmlDoc = document.implementation.createDocument("","",null);
	}else{
		alert("error");
	}
	if(xmlDoc != null){
		xmlDoc.async = false;
		xmlDoc.load(file);
	}
	return xmlDoc;
}

/**
 * 通过ID查找节点
 * @param xmlData-xml字符串或xml dom对象
 * @param id-要查找的节点的ID
 * @returns 查找到的节点
 */
function lookupNodeById(xmlData,id){
	if (xmlData == undefined || xmlData == null) return null;
	
	var xmlDoc = null;
	if (typeof(xmlData) == "string"){
		xmlDoc = loadXMLStr(xmlData);
	}else{
		xmlDoc = xmlData;
	}
	
	var resultNode = null;	//返回节点
	
	//判断当前元素
	var rootNode = xmlDoc.documentElement;
	
	if (rootNode!=undefined){
		for (var i=0; rootNode.attributes!=null && rootNode.attributes.length>0 && i<rootNode.attributes.length; i++){
			if (rootNode.attributes[i].name=="id" && rootNode.attributes[i].value==id){
				resultNode = rootNode;
				return rootNode;
			}
		}
	}else{
		rootNode = xmlDoc;
	}
	
	for (var i=0; rootNode!=null && i<rootNode.childNodes.length; i++){	
		var node1 = rootNode.childNodes[i];	//子节点
		
		//判断当前元素
		if (node1.attributes!=null && node1.attributes.length>0){
			for (var j=0; j<node1.attributes.length; j++){
				if (node1.attributes[j].name=="id" && node1.attributes[j].value==id){
					resultNode = node1;
					break;
				}
			}
		}
		if (resultNode != null) break;
		
		//判断当前节点下的子元素
		if (node1.childNodes.length > 0){
			resultNode = this.lookupNodeById(node1, id);
			if (resultNode != null) break;
		}
	}
	
	return resultNode;
}

/**
 * 通过Name查找节点
 * @param xmlData-xml字符串或xml dom对象
 * @param name-要查找的节点的Name
 * @returns 查找到的节点
 */
function lookupNodeByName(xmlData,name){
	if (xmlData == undefined || xmlData == null) return null;
	
	var xmlDoc = null;
	if (typeof(xmlData) == "string"){
		xmlDoc = loadXMLStr(xmlData);
	}else{
		xmlDoc = xmlData;
	}
	
	var resultNode = null;	//返回节点
	
	//判断当前元素
	var rootNode = xmlDoc.documentElement;
	
	if (rootNode!=undefined){
		for (var i=0; rootNode.attributes!=null && rootNode.attributes.length>0 && i<rootNode.attributes.length; i++){
			if (rootNode.attributes[i].name=="name" && rootNode.attributes[i].value==name){
				resultNode = rootNode;
				return rootNode;
			}
		}
	}else{
		rootNode = xmlDoc;
	}
	
	for (var i=0; rootNode!=null && i<rootNode.childNodes.length; i++){	
		var node1 = rootNode.childNodes[i];	//子节点
		
		//判断当前元素
		if (node1.attributes!=null && node1.attributes.length>0){
			for (var j=0; j<node1.attributes.length; j++){
				if (node1.attributes[j].name=="name" && node1.attributes[j].value==name){
					resultNode = node1;
					break;
				}
			}
		}
		if (resultNode != null) break;
		
		//判断当前节点下的子元素
		if (node1.childNodes.length > 0){
			resultNode = this.lookupNodeByName(node1, name);
			if (resultNode != null) break;
		}
	}
	
	return resultNode;
}

/**
 * 功能：创建带有属性的Element节点
 * 参数：tagName-标签名；attrArr-属性列表；xmlDoc-添加的dom对象
 * 返回值：Element节点
 */
var createElementNode = function(tagName,attrArr,xmlDoc){
	var elementNode = xmlDoc.createElement(tagName);
	if(attrArr != null){
		for(var i=0; i<attrArr.length; i++){
			var itemIndex = attrArr[i];
			elementNode.setAttribute(itemIndex.name, itemIndex.value);
		}
	}
	return elementNode;
};

/**
 * 功能：创建没有属性的Element节点
 * 参数：tagName-标签名；textValue-节点文字；xmlDoc-添加的dom对象
 * 返回值：Element节点
 */
var createElementText = function(tagName,textValue,xmlDoc){
	var elementNode = xmlDoc.createElement(tagName);
	elementNode.text = textValue;
	return elementNode;
};
/*遮罩层添加方法*/
function divload(tableId){
	var divHeight = $("#"+tableId).height();
	divHeight = divHeight/2;
    $("<div id='loadingdiv' style='text-align:center;padding-top:"+divHeight+"px;height:100%;width:100%;background:#eee;filter:alpha(Opacity=60);-moz-opacity:0.6;opacity: 0.6; position:absolute; top:0px; left:0; z-index:2' ><img src='../../images/dialog/dialogLoad.gif' style=''><span>页面加载中,请稍后</span></div>").appendTo("#"+tableId);
}
/*去除遮罩层方法*/
function divloaded(){
   $("div#loadingdiv").remove();
}

//将str字符串中的特殊字符去掉
//str:需要判断的字符串
//返回:没有特殊字符:返回legalInput字符串,有特殊字符返回截取后的字符串
var regStr = function(str){
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】《》‘；：”“'。，、？?\\%]");
	var rs = ""; 
    for (var i = 0; i < str.length; i++) {
        rs = rs+str.substr(i, 1).replace(pattern, ''); 
    } 
    if(rs==str){
    	return "legalInput";
    }else{
		return rs;
    }
}

/*
 *不允许thisobj输入特殊字符,将合格的字符串填充到thisObj中
 *@param thisObj 判断的dom对象
 *@return true：满足 false：不满足
 */
var checkStr = function(thisObj){
	var whereValue = thisObj.value;
    var newValue = regStr(whereValue);
    if(newValue != "legalInput"){
        thisObj.value = newValue;
    }
};

/*
 *只允许输入数字以及小数点
 *@param thisObj 判断的dom对象
 *@return true：满足 false：不满足
 */
function  checkNum(thisObj) {
    var thisValue = thisObj.value;
    thisValue = thisValue.replace(/[^0-9.]/g,'');
    thisObj.value = thisValue;
}

/*
 *只允许输入数字以及小数点
 *@param thisObj 判断的dom对象
 *@return true：满足 false：不满足
 */
function  checkAllNum(thisObj) {
    $(thisObj).val($(thisObj).val().replace(/[^0-9.-]/g,''));
}

/*
 *只允许输入正整数
 *@param thisObj 判断的dom对象
 *@return true：满足 false：不满足
 */
function checkPositiveInt(thisObj) {
    var thisValue = thisObj.value;
    thisValue = thisValue.replace(/[^0-9]/g,'');
    thisObj.value = thisValue;
}

//获取location参数
var parseLocation = function() {
    var urlSegs = location.href.split("?");
    var params;
    var keyvalue = null;
    var results = {};
    if (urlSegs.length > 1) {
        params = urlSegs[1].split("&");
        for (var i = 0; i < params.length; i++) {
            keyvalue = params[i].split("=");
            results[keyvalue[0]] = keyvalue[1];
        }
    }
    return results;
};