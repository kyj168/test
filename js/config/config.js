/*
 * 模块：配置文件
 * 功能：配置
 */
var params = {
	ip: "http://192.168.100.222", //加载球地址
	screen: 0,//数据配置文件索引
	transparency:100//球透明度（1-100)
};
window.params = params;

//LocalSearch返回数据类型
var localSearchDataType = {
    "xml": 1,
    "xmlWithMesh": 4, 
    "json": 5,
    "jsonWithMesh": 6
};

var STAMP_config = {};
//权限及后台管理配置
STAMP_config.auth = {
	authentication: params.ip + ':8080/StampManager2/functionAction.do?method=webServiceList&p=StampExplorer'
};
//顶部标题栏配置
STAMP_config.topInfo = {
	logo:"images/top/logo.png",
	titleImg:"images/top/title.png",//系统标题图片
	titleText:"三维基础平台应用系统"//系统标题文字
};

STAMP_config.constants = {
    TRACKFILE : "\\track\\trackList",                // 飞行路线
    ANIMFILE : "\\visit\\visit",                  // 动画
    CAMERAFILE : "\\camera\\camera",                  // 摄像机
    VIEWPOINTFILE: '\\viewpoint\\viewpoint',             // 视点
    USERDATA: '\\userdata\\'             // 用户数据
};

//默认显示的管线字段
STAMP_config.LineProperty={
	DLLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		"US_VENTNUM",	//电缆条数
		"US_HOLETOL",	//总孔数
		"US_HOLEUSE",	//已用孔数
		"US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	DXLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		"US_VENTNUM",	//电缆条数
		"US_HOLETOL",	//总孔数
		"US_HOLEUSE",	//已用孔数
		"US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	JSLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	PSLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		"US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	RQLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	RLLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	GYLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		"US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	DEFAULTLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	]
};

//默认显示的管点字段
STAMP_config.PointProperty = {
	WELLPOINT:[
		"US_KEY",		//编号
		"X",			//X坐标
		"Y",			//Y坐标
		"US_PT_ALT",	//地面高程
		"US_PT_TYPE",	//特征
		"US_ATTACHMENT",//附属物
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_UPDATE",	//更新状态
		"US_WELL",		//井类型
		"US_WDIA",		//井直径
		"US_NDEEP",		//井脖深
		"US_WDEEP",		//井底深
		"US_PLATE",		//井盖类型
		"US_PSIZE",		//井盖规格
		"US_PMATER",	//井盖材质
		"US_WMATER",	//井材质
		"US_ANGLE",		//旋转角度
		"US_OFFSET"		//偏心井点号
	],
	DEFAULTPOINT:[
		"US_KEY",		//编号
		"X",			//X坐标
		"Y",			//Y坐标
		"US_PT_ALT",	//地面高程
		"US_PT_TYPE",	//特征
		"US_ATTACHMENT",//附属物
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_UPDATE"		//更新状态
	]
};