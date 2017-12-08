var earth="";
var analysis;
var COLOR_16_REGEXP = /^0x[0-9a-fA-F]{8}$/;
var sInitColor = null;
//选色卡触发事件
function noShadowColorDlg(){
  var sColor = null;
  sInitColor = document.getElementById("noShadowColor").value;
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
  var xColor="0x99"+sColor;
  sColor = "#" + sColor;
  document.getElementById("noShadowColor").value = xColor;
  document.getElementById("noShadowColorsel").style.background = sColor;
  sInitColor = sColor;
}
//选色卡触发事件
function shadowColorDlg(){
      var sColor = null;
      sInitColor = document.getElementById("shadowColor").value;
      if (sInitColor == null) {
            sColor = dlgHelper.ChooseColorDlg();
      } else {
          sColor = dlgHelper.ChooseColorDlg(sInitColor);
      }
      sColor = sColor.toString(16);
      document.getElementById("shadowColor").value = sColor;
      if (sColor.length < 6) {
          var sTempString = "00000000".substring(0,6-sColor.length);
          sColor = sTempString.concat(sColor);
      }
      var xColor="0x99"+sColor;
      sColor = "#" + sColor;
      document.getElementById("shadowColor").value = xColor;
      document.getElementById("shadowColorsel").style.background = sColor;
      sInitColor = sColor;
}
function getEarth(earthObj){
    earth = earthObj;
    analysis = earth.analysisObj;
    var doc = earth.ifEarth.document,
        d = earth.doc,
        balloon = earth.htmlBallon;
    var vs, curTrack;

    var dMgr = new Stamp.Dynamic(earth);

    function initUi() {
      $('#dRole').empty();
      dMgr.getList(function(list) {
        var i, len = list.Count, dynamic;
        for(i=0; i < len; i++) {
          dynamic = list.Items(i);
          $('#dRole').append($('<option value="'+ dynamic.Name +'">'+dynamic.Name+'</option>'));
        }
      });
    }

    function createViewshed(pos, angleH, angleV, height, radius, shadowColor, noShadowColor) {
      var viewshed = earth.Factory.CreateViewShed(earth.Factory.CreateGUID(), ""),
      offset = earth.Factory.CreateVector3();
      offset.X = 0;
      offset.Y = Number(height);
      offset.Z = 0.5;
      viewshed.BeginUpdate();
      viewshed.PosOffset = offset;
      viewshed.SphericalTransform.SetLocationEx(pos.Longitude, pos.Latitude, pos.Altitude + 1);
      viewshed.FovH = Number(angleH);
      viewshed.FovV = Number(angleV);
      //viewshed.Aspect = 1.732;
      viewshed.Radius = Number(radius);
      viewshed.ShadowColor = parseInt(shadowColor);
      viewshed.NoShadowColor = parseInt(noShadowColor);
      viewshed.EnableAssistantCone = chkCone.checked;
      viewshed.EndUpdate();
      earth.AttachObject(viewshed);
      return viewshed;
    }
    $(function(){
      initUi();
      earth.Event.OnHtmlBalloonFinished = function() {
        if(curTrack) {
            dMgr.stopTrack(curTrack);
          }
      };
      $("#chkCone").click(function(){
        if($(this).attr("checked") == "checked"){
          if(vs){
            vs.Visibility = true;  
          }
          
        }else{
          if(vs){
            vs.Visibility = false;  
          }
        }
      });
      $("#btnStart").click(function(){
          if(check()){
            var name = $('#dRole').val(),
              angleH = $('#angleH').val(),
              angleV = $('#angleV').val(),
              radius = $('#radius').val(),
              height = $('#height').val(),
              speed = $("#speed").val(),
              shadowColor = $('#shadowColor').val() || '0x99ff0000',
              noShadowColor = $('#noShadowColor').val() || '0x9900ff00';
            dMgr.track({
              name: name,
              flyHeight: $('#pathheight').val(),
              speed: speed,
              visible: true,
              autoClear: false,
              document: doc,
              onBefore: function(track, guid) {
                var dObj = earth.DynamicSystem.GetSphericalObject(guid);
                vs = createViewshed(track.GetPose(0), angleH, angleV, height, radius, shadowColor, noShadowColor);
                dObj.AttachObject(vs);
                curTrack = track;
                $('#btnStart').prop('disabled', true);
                $('#btnPause').prop('disabled', false);
              },
              onFinish: function(track, guid) {
              	if (chkLoop.checked){
                		curTrack.BindObject = guid;
                		curTrack.Play(false);
              	}
              	else{
                  dMgr.deleteTrack(curTrack);
                  var dObj = earth.DynamicSystem.GetSphericalObject(guid);
                  if(dObj){
                    dObj.DetachObject(vs);  
                  }
                  earth.DetachObject(vs);
                  vs = null;
                  curTrack = null;
                }
              },
              onEnd: function() {
                $('#btnStart').prop('disabled', false);
                $('#btnPause').prop('disabled', true);
                $('#btnPause').text("暂停");
              }
            });
          }
      });
      $("#btnPause").click(function(){
        if($("#btnPause").text() == "暂停"){
          $("#btnPause").text("继续");
        }else{
          $("#btnPause").text("暂停");
        }
    		if (curTrack.Status == 1){
        	dMgr.pauseTrack(curTrack);
        }else if (curTrack.Status == 2){
          dMgr.resumeTrack(curTrack);
        }
      });
      $("#clear").click(function(){
        if(curTrack) {
          dMgr.stopTrack(curTrack);
          chkLoop.checked = false;
        }
      });
  }) ;
  window.onunload=function(){
      analysis.clear();
  };
}

function check(){
  if(isNaN($("#angleH").val()) == true){
      alert("无效的视角");
      return false;
  }   
  if(isNaN($("#height").val()) == true){
      alert("无效的高度");
      return false;
  }
  if(isNaN($("#speed").val()) == true){
      alert("无效的速度");
      return false;
  }
  return true;
}