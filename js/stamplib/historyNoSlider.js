/*
 * 模块：历史管理
 */
(function(context) {
	function History(earth) {
		this.slider = earth.GUIManager.CreateHistoryWithoutWindow();
	}
	History.prototype = {
		constructor: History,
		load: function(dateTxt) {
			// this.restore();
			this.slider.LoadHistoryData();
			this.slider.CurrentHistoryDateTimeTxt = dateTxt;
		},
		restore: function() {
			this.slider.ResumeNormalData();
		}
	};
	function HistoryNoSlider(earthArr) {
		if(!this instanceof HistoryNoSlider) return new HistoryNoSlider(earthArr);
		this.initialize(earthArr);
	}
	HistoryNoSlider.prototype = {
		constructor: HistoryNoSlider,
		initialize: function(earthArr) {
			var earth;
			this.data = {};
			earthArr = [].concat(earthArr);
			for(var i=0,len=earthArr.length;i<len;i++) {
				earth = earthArr[i];
				this.data[earth.id] = new History(earth);
			}
		},
		load: function(dateTxt, earth1, earth2id) {
			var earthArr = [].concat([].slice.call(arguments)),
				dateTxt = earthArr.shift(),
				len = earthArr.length,
				id;
			if(len) {
				for(var i=0;i<len;i++) {
					id = earthArr[i].id || earthArr[i];
					this.data[id].load(dateTxt);
				}
			}
			else {
				for(var key in this.data) {
					if(this.data.hasOwnProperty(key)) {
						this.data[key].load(dateTxt);
					}
				}
			}
		},
		restore: function() {
			for(var key in this.data) {
				var history = this.data[key];
				history.restore();
			}
		}
	};

	context.STAMP = context.STAMP || {};
	context.STAMP.HistoryNoSlider = HistoryNoSlider;
})(this);