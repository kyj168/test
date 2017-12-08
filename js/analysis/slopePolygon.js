
var earth = null;
var analysis = null;

function getEarth(earthObj) {
	earth = earthObj;
	analysis = STAMP.Analysis(earth);
	
}
$(function() {
	$('#ok').on('click', function(e) {
		analysis.slope("slopeTable");
	});
	
	$('#cancel').on('click', function(e) {
		analysis.clear();
		earth.htmlBallon.DestroyObject();
	});
	$('#section').on('click', function(e) {
		var slopeSection = $('#slopeSection').val();
		var secAngle = Math.ceil(90/(slopeSection-1));
		$("#slopeTable tr:not(:first)").empty();
		for(var i = 0;i<slopeSection;i++){ 
			var trHTML = "<tr><td>"+i*secAngle+"</td><td><input type='text' id='fillColor"+i*secAngle+"' value='#00ff00' class='colorInput' readonly/><input type='button' id='fillColorSel"+i*secAngle+"' class='colorBtn' style='background-color:#00ff00' class='button' value='' onClick='fillColorDlg("+'"fillColor'+i*secAngle+'")'+"' /></td></tr>";
			$("#slopeTable").append(trHTML);
		}
	});
	window.onunload = function(){
		analysis.clear();
	}

});
function fillColorDlg(id){
    var sColor = null;
    sInitColor = $('#'+id).val();
    if (sInitColor == null) {
        sColor = dlgHelper.ChooseColorDlg();
    } else {
        sColor = dlgHelper.ChooseColorDlg(sInitColor);
    }
    sColor = sColor.toString(16);
    if (sColor.length < 6) {
        var sTempString = "00000000".substring(0,6-sColor.length);
        sColor = sTempString.concat(sColor);
    }
    sColor = "#" + sColor;
    //document.getElementById("fillColor").value = sColor;
    $('#'+id).val(sColor);
    var fillColorSel = "fillColorSel" + id.substring(9,id.length);
    document.getElementById(fillColorSel).style.background = sColor;
    sInitColor = sColor;
}

