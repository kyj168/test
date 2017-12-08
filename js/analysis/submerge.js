var earth,anaysis,htmlBalloon;
//根据选择的分析类型给input框设置状态
function setStatus(){
	var pointChecked = $("#point").is(":checked");
	if(pointChecked){
		$("#subWaterRadius").attr("disabled",true);
	}else{
		$("#subWaterRadius").attr("disabled",false);
	}
	$("#btnSimulation").attr("disabled",true);
}
function setAnalysisStatus(flag){
	$("#btnStart").attr("disabled",flag);
}
function getEarth(earthObj){
	earth = earthObj;
	analysis = STAMP.Analysis(earth);
	htmlBalloon = earth.htmlBallon;
}
//type=0代表只是分析，type=1代表动态模拟
function submergeAnalysis(type){
	analysis.clear();
	var subWater = document.getElementById("subWaterLine1").value;
    var subWater1 = document.getElementById("subWaterLine").value;
    var waterHeight= parseInt(subWater)+parseInt(subWater1);
	var pointChecked = $("#point").is(":checked");
	var lineChecked = $("#line").is(":checked");
	var polygonChecked = $("#polygon").is(":checked");
	var showSide = $("#showSide").is(":checked");
	var buffer = $("#subWaterRadius").val();
	if(type === 1){
		var perHeight = $("#perHeight").val();
		var frequency = $("#frequency").val();
		var speed = perHeight*frequency;
		var time = subWater1/speed;
		analysis.createSubmergePolygon(null,subWater1,waterHeight,time,showSide);
		return;
	}

	if(pointChecked){
		analysis.submergePoint(null,waterHeight,null,showSide);
	}
	if(lineChecked){
		analysis.submergeLine(null,waterHeight,null,showSide,buffer);  
	}
	if(polygonChecked){
		analysis.submergePolygons(null,waterHeight,null,showSide,buffer);
	}
}
$(function(){
	setStatus();
	/**
     * 获得高程值
     */
    $("#getAltitude").on("click",function() {
        document.getElementById("getAltitude").style.cursor = "crosshair";
        analysis.getAltitude(function(val){
        	$("#subWaterLine1").val(val) ;
        });
        earth.Event.OnLBUp = function(p) {
            document.getElementById("getAltitude").style.cursor ="auto";
            earth.Event.OnLBUp = function() {};
        };
    });
	$("input[type='radio']").click(function(){
		setStatus();
	});

	$("#btnSimulation").click(function(){
		submergeAnalysis(1);

	})
	$("#btnStart").click(function(){
		submergeAnalysis(0);
	});
	$("#clear").click(function(){
		analysis.clear();
		htmlBalloon.DestroyObject();
	})
	
})