/*
 * 模块：菜单配置文件
 * 功能：菜单配置
 */
var STAMP = STAMP||{};
STAMP.menuConfig =  {
    "menu":
    [
        {
            "id":"view",
            "name":"场景",
            "title":"场景",
            "tag":"1",
            "src":"images/top/inactiveIcons/view.png",
            "item":
            [
                {
                    "name":"飞行路径",
                    "title":"飞行路径",
                    "tag":"102",
                    "id":"ViewFlyMode",
                    "src":"images/tools/路径.png"
                },{
                    "tag":"103",
                    "id":"ViewPersonMode",
                    "name":"场景漫游",
                    "title":"场景漫游",
                    "src":"images/tools/漫游.png"
                },{
                    "tag":"103",
                    "id":"surround",
                    "name":"环绕浏览",
                    "title":"环绕浏览",
                    "src":"images/tools/漫游.png"
                },{
                    "name":"视点管理",
                    "title":"视点管理",
                    "tag":"101",
                    "id":"ViewPointManagement",
                    "src":"images/tools/视点.png"
                },{
                    "tag": "107",
                    "id": "mMultipleScreen",
                    "name": "双屏比对",
                    "title": "双屏比对",
                    "src": "images/tools/双屏对比.png"
                },{
                    "tag": "104",
                    "id": "animation",
                    "name": "录制浏览",
                    "title": "录制浏览",
                    "src": "images/tools/动画.png"
                },{
                    "tag": "111",
                    "id": "independentscene",
                    "name": "独立场景",
                    "title": "独立场景",
                    "src": "images/tools/独立场景.png"
                },{
                    "tag": "110",
                    "id": "vistaSet",
                    "name": "街景浏览",
                    "title": "街景浏览",
                    "src": "images/tools/街景浏览.png"
                },{
                    "tag": "114",
                    "id": "mCamera",
                    "name": "视频监控",
                    "title": "视频监控",
                    "src": "images/tools/监控.png"
                },{
                    "tag": "115",
                    "id": "GPS",
                    "name": "GPS",
                    "title": "GPS",
                    "src": "images/tools/GPS.png"
                },{
                    "tag": "115",
                    "id": "GPSTrack",
                    "name": "GPS监控",
                    "title": "GPS监控",
                    "src": "images/tools/GPS监控.png"
                },{
                    "tag": "116",
                    "id": "Map2D",
                    "name": "电子地图",
                    "title": "电子地图",
                    "src": "images/tools/电子地图.png",
                    "item":[{
                        "title": "二维鹰眼",
                        "tag": "1",
                        "src": "images/panelMenu/inactiveIcons/二维鹰眼.png",
                        "srcd": "images/panelMenu/activeIcons/二维鹰眼.png",
                        "id": "ViewHawkeye2D",
                        "name": "鹰眼"
                    },{
                        "title": "二维叠加",
                        "tag": "4",
                        "src": "images/panelMenu/inactiveIcons/二维叠加.png",
                        "srcd": "images/panelMenu/activeIcons/二维叠加.png",
                        "id": "ViewScreen2D",
                        "name": "叠加"
                    },{
                       "title": "二维联动",
                        "tag": "2",
                        "src": "images/panelMenu/inactiveIcons/二维联动.png",
                        "srcd": "images/panelMenu/activeIcons/二维联动.png",
                        "id": "ViewLink",
                        "name": "联动" 
                    },{
                        "title": "二维全屏",
                        "tag": "3",
                        "src": "images/panelMenu/inactiveIcons/二维全屏.png",
                        "srcd": "images/panelMenu/activeIcons/二维全屏.png",
                        "id": "ViewFullScreen2D",
                        "name": "全屏"
                    }]
                },{
                    "tag": "105",
                    "id": "mScreenShot",
                    "name": "屏幕截图",
                    "title": "屏幕截图",
                    "src": "images/tools/截屏.png"
                },{
                    "tag": "106",
                    "id": "pictures",
                    "name": "2.5D出图",
                    "title": "2.5D出图",
                    "src": "images/tools/出图.png"
                },{
                    "tag": "112",
                    "id": "SpecialEffect",
                    "name": "特效",
                    "title": "特效",
                    "src": "images/tools/特效.png",
                    "item":[{
                        "title": "雨",
                        "tag": "1",
                        "src": "images/panelMenu/inactiveIcons/雨.png",
                        "srcd": "images/panelMenu/activeIcons/雨.png",
                        "id": "EffectRain",
                        "name": "雨"
                    }, {
                        "title": "雪",
                        "tag": "2",
                        "src": "images/panelMenu/inactiveIcons/雪.png",
                        "srcd": "images/panelMenu/activeIcons/雪.png",
                        "id": "EffectSnow",
                        "name": "雪"
                    }, {
                        "title": "雾",
                        "tag": "3",
                        "src": "images/panelMenu/inactiveIcons/雾.png",
                        "srcd": "images/panelMenu/activeIcons/雾.png",
                        "id": "EffectFog",
                        "name": "雾"
                    }]
                },{
                    "tag": "113",
                    "id": "windScenet",
                    "name": "风场",
                    "title": "风场",
                    "src": "images/tools/风场.png"
                }/*,{
                    "tag": "117",
                    "id": "systemSetting",
                    "name": "系统设置",
                    "title": "系统设置",
                    "src": "images/tools/系统设置.png"
                },{
                    "tag": "118",
                    "id": "systemSettingNow",
                    "name": "实时配置",
                    "title": "实时配置",
                    "src": "images/tools/实时配置.png"
                }
             */
            ]
        },
        {
            "id":"measure",
            "name":"量算",
            "title":"量算",
            "tag":"2",
            "src":"images/top/inactiveIcons/measure.png",
            "item":
            [
                {
                    "tag":"201",
                    "id":"mHorizontalDist",
                    "name":"水平距离",
                    "title":"水平距离测量",
                    "src":"images/tools/水平距离.png"
                },
                {
                    "tag":"202",
                    "id":"mHeight",
                    "name":"垂直距离",
                    "title":"垂直距离测量",
                    "src":"images/tools/垂直距离.png"
                },
                {
                    "tag":"203",
                    "id":"mLineLength",
                    "name":"空间距离",
                    "title":"空间距离测量",
                    "src":"images/tools/空间距离.png"
                },
                {
                    "tag":"204",
                    "id":"mPathLength",
                    "name":"地表距离",
                    "title":"地表距离",
                    "src":"images/tools/地表距离.png"
                },
                {
                    "tag":"211",
                    "id":"mArea",
                    "name":"水平面积",
                    "title":"水平面积",
                    "src":"images/tools/水平面积.png"
                },
                {
                    "tag":"212",
                    "id":"mSurfaceArea",
                    "name":"地表面积",
                    "title":"地表面积",
                    "src":"images/tools/地表面积.png"
                },
                {
                    "tag":"213",
                    "id":"mSpatialArea",
                    "name":"空间面积",
                    "title":"空间面积",
                    "src":"images/tools/空间面积.png"
                },
                {
                    "tag":"214",
                    "id":"mVerticalArea",
                    "name":"立面面积",
                    "title":"立面面积",
                    "src":"images/tools/立面面积.png"
                },
                {
                    "tag":"205",
                    "id":"pointToline",
                    "name":"点-折线",
                    "title":"点-折线",
                    "src":"images/tools/点-折线.png"
                },
                {
                    "tag":"206",
                    "id":"pointToZline",
                    "name":"点-直线",
                    "title":"点-直线",
                    "src":"images/tools/点-直线.png"
                },
                {
                    "tag":"207",
                    "id":"lineToline",
                    "name":"线线距离",
                    "title":"线线距离",
                    "src":"images/tools/线线距离.png"
                },
                {
                    "tag":"208",
                    "id":"SurfacesToSurfaces",
                    "name":"面面距离",
                    "title":"面面距离",
                    "src":"images/tools/面面距离.png"
                },
                {
                    "tag":"209",
                    "id":"PointToSurfaces",
                    "name":"点面距离",
                    "title":"点面距离",
                    "src":"images/tools/点面距离.png"
                },
                {
                    "tag":"210",
                    "id":"LineToSurfaces",
                    "name":"线面距离",
                    "title":"线面距离",
                    "src":"images/tools/线面距离.png"
                },
                {
                    "tag":"214",
                    "id":"mPlaneAngle",
                    "name":"平面角度",
                    "title":"平面角度",
                    "src":"images/tools/平面角度.png"
                }
                /*,
                {
                    "tag":"215",
                    "id":"FloorToFloor",
                    "name":"楼间距",
                    "title":"楼间距",
                    "src":"images/tools/楼间距.png"
                }*/
            ]
        },
        {
            "id":"query",
            "name":"查询",
            "title":"查询",
            "tag":"3",
            "src":"images/top/inactiveIcons/query.png",
            "item":
            [
                {
                    "tag":"401",
                    "id":"QueryProperty",
                    "name":"属性查询",
                    "title":"属性查询",
                    "src":"images/tools/属性查询.png"
                },{
                    "tag":"402",
                    "id":"keywordSearch",
                    "name":"关键字查询",
                    "title":"关键字查询",
                    "src":"images/tools/关键字查询.png"
                },/*{
                    "tag":"402",
                    "id":"poiSearch",
                    "name":"兴趣点查询",
                    "title":"兴趣点查询",
                    "src":"images/tools/兴趣点查询.png"
                },*/{
                    "tag":"403",
                    "id":"polygonSearch",
                    "name":"面域查询",
                    "title":"面域查询",
                    "src":"images/tools/面域查询.png"
                },{
                    "tag":"404",
                    "id":"circleSearch",
                    "name":"圆域查询",
                    "title":"圆域查询",
                    "src":"images/tools/圆域查询.png"
                },{
                    "tag":"405",
                    "id":"rectangleSearch",
                    "name":"矩形查询",
                    "title":"矩形查询",
                    "src":"images/tools/矩形查询.png"
                },{
                    "tag":"406",
                    "id":"coordSearch",
                    "name":"坐标查询",
                    "title":"坐标查询",
                    "src":"images/tools/坐标查询.png"
                },{
                    "tag":"407",
                    "id":"coordlocation",
                    "name":"坐标定位",
                    "title":"坐标定位",
                    "src":"images/tools/坐标定位.png"
                }
            ]
        },
        {
            "id":"analysis",
            "name":"分析",
            "title":"分析",
            "tag":"4",
            "src":"images/top/inactiveIcons/analysis.png",
            "item":
            [
                {
                    "tag": "109",
                    "id": "historyNoSlider",
                    "name": "历史查看",
                    "title": "历史查看",
                    "src": "images/tools/查看历史.png"
                },{
                    "tag": "108",
                    "id": "historyData",
                    "name": "历史变迁",
                    "title": "历史变迁",
                    "src": "images/tools/历史管理.png"
                },{
                    "tag": "108",
                    "id": "historyCompare",
                    "name": "历史比对",
                    "title": "历史比对",
                    "src": "images/tools/历史比对.png"
                },{
                    "tag":"301",
                    "id":"mLineSight",
                    "name":"通视分析",
                    "title":"通视分析",
                    "src":"images/tools/通视分析.png"
                },{
                    "tag":"302",
                    "id":"mViewshed",
                    "name":"视域分析",
                    "title":"视域分析",
                    "src":"images/tools/视域分析.png"
                },{
                    "tag":"303",
                    "id":"mShinning",
                    "name":"阴影分析",
                    "title":"阴影分析",
                    "src":"images/tools/阴影分析.png"
                },{
                    "tag":"314",
                    "id":"mInsolation",
                    "name":"日照分析",
                    "title":"日照分析",
                    "src":"images/tools/日照分析.png"
                },{
                    "tag":"304",
                    "id":"mSkyline",
                    "name":"天际线分析",
                    "title":"天际线分析",
                    "src":"images/tools/天际线分析.png"
                },{
                    "tag":"305",
                    "id":"mFixedObserver",
                    "name":"视野分析",
                    "title":"视野分析",
                    "src":"images/tools/视野分析.png"
                },{
                    "tag":"313",
                    "id":"dViewshed",
                    "name":"动态视域",
                    "title":"动态视域",
                    "src":"images/tools/动态视域.png"
                },{
                    "tag":"315",
                    "id":"clipScene",
                    "name":"剖切分析",
                    "title":"剖切分析",
                    "src":"images/tools/剖面分析.png"
                },{
                    "tag":"306",
                    "id":"mExcavationAndFill",
                    "name":"挖填方分析",
                    "title":"挖填方分析",
                    "src":"images/tools/挖填方分析.png"
                },{
                    "tag":"307",
                    "id":"submerge",
                    "name":"淹没分析",
                    "title":"淹没分析",
                    "src":"images/tools/流域分析.png"
                }/*,{
                    "tag":"307",
                    "id":"submerge",
                    "name":"点源淹没",
                    "title":"点源淹没",
                    "src":"images/tools/点源淹没.png"
                },{
                    "tag":"308",
                    "id":"valley",
                    "name":"流域分析",
                    "title":"流域分析",
                    "src":"images/tools/流域分析.png"
                }*/,{
                    "tag":"309",
                    "id":"bestPath",
                    "name":"地形路径",
                    "title":"地形路径",
                    "src":"images/tools/地形路径.png"
                },{
                    "tag":"310",
                    "id":"profile",
                    "name":"地形剖面",
                    "title":"地形剖面",
                    "src":"images/tools/地形剖面.png"
                },{
                    "tag":"319",
                    "id":"demExagger",
                    "name":"地形夸张",
                    "title":"地形夸张",
                    "src":"images/tools/地形夸张.png"
                },{
                    "tag":"311",
                    "id":"slopePoint",
                    "name":"坡度分析",
                    "title":"坡度分析",
                    "src":"images/tools/坡度分析.png"
                },{
                    "tag":"312",
                    "id":"slopePolygon",
                    "name":"坡度图",
                    "title":"坡度图",
                    "src":"images/tools/坡度图.png"
                },{
                    "tag":"316",
                    "id":"contourPolygon",
                    "name":"等高线",
                    "title":"等高线",
                    "src":"images/tools/等高线.png"
                },{
                    "tag":"317",
                    "id":"heatMapPolygon",
                    "name":"热力图",
                    "title":"热力图",
                    "src":"images/tools/热力图.png"
                },{
                    "tag":"317",
                    "id":"landSlideAnalysis",
                    "name":"滑坡分析",
                    "title":"滑坡分析",
                    "src":"images/tools/滑坡分析.png"
                },{
                    "tag":"317",
                    "id":"sectionMonitor",
                    "name":"断面监测",
                    "title":"断面监测",
                    "src":"images/tools/断面监测.png"
                },{
                    "tag":"317",
                    "id":"pointMonitor",
                    "name":"单点监测",
                    "title":"单点监测",
                    "src":"images/tools/单点监测.png"
                },{
                    "tag":"317",
                    "id":"areaMonitor",
                    "name":"区域监测",
                    "title":"区域监测",
                    "src":"images/tools/区域监测.png"
                }/*,{
                    "tag":"318",
                    "id":"undergroundWater",
                    "name":"地下水",
                    "title":"地下水",
                    "src":"images/tools/地下水.png"
                }*/
            ]
        },
        {
            "id":"userdata",
            "name":"对象",
            "title":"对象",
            "tag":"5",
            "src":"images/top/inactiveIcons/userdata.png",
            "item":
            [
                {
                    "tag":"508",
                    "id":"dynamicObject",
                    "name":"动态特效",
                    "title":"动态特效",
                    "src":"images/tools/动态对象.png",
                    "item":
                    [
                        {
                            "tag":"50801",
                            "id":"fire",
                            "name":"火",
                            "title":"火",
                            "src":"images/panelMenu/inactiveIcons/火.png",
                            "srcd":"images/panelMenu/activeIcons/火.png"
                        },{
                            "tag":"50802",
                            "id":"mist",
                            "name":"烟",
                            "title":"烟",
                            "src":"images/panelMenu/inactiveIcons/烟.png",
                            "srcd":"images/panelMenu/activeIcons/烟.png"
                        },{
                            "tag":"50806",
                            "id":"Explosion",
                            "name":"爆炸",
                            "title":"爆炸",
                            "src":"images/panelMenu/inactiveIcons/爆炸.png",
                            "srcd":"images/panelMenu/activeIcons/爆炸.png"
                        },{
                            "tag":"50805",
                            "id":"SprayNozzle",
                            "name":"喷雾",
                            "title":"喷雾",
                            "src":"images/panelMenu/inactiveIcons/喷雾喷泉.png",
                            "srcd":"images/panelMenu/activeIcons/喷雾喷泉.png"
                        },{
                            "tag":"50804",
                            "id":"nozzle",
                            "name":"喷泉",
                            "title":"喷泉",
                            "src":"images/panelMenu/inactiveIcons/喷泉.png",
                            "srcd":"images/panelMenu/activeIcons/喷泉.png"
                        },{
                            "tag":"50803",
                            "id":"fountain",
                            "name":"喷泉组",
                            "title":"喷泉组",
                            "src":"images/panelMenu/inactiveIcons/多头喷泉.png",
                            "srcd":"images/panelMenu/activeIcons/多头喷泉.png"
                        },{
                            "tag":"50806",
                            "id":"WaterGunSmall",
                            "name":"小水枪",
                            "title":"小水枪",
                            "src":"images/panelMenu/inactiveIcons/喷雾水枪.png",
                            "srcd":"images/panelMenu/activeIcons/喷雾水枪.png"
                        },{
                            "tag":"50807",
                            "id":"dWater",
                            "name":"动态水面",
                            "title":"动态水面",
                            "src":"images/panelMenu/inactiveIcons/动态水面.png",
                            "srcd":"images/panelMenu/activeIcons/动态水面.png"
                        }
                    ]
                },
                {
                    "tag":"501",
                    "id":"object2DDraw",
                    "name":"二维对象绘制",
                    "title":"二维对象绘制",
                    "src":"images/tools/二维对象绘制.png",
                    "item":[
                        {
                            "tag":"50101",
                            "id":"icon",
                            "name":"符号标注",
                            "title":"符号标注",
                            "src":"images/panelMenu/inactiveIcons/地标.png",
                            "srcd":"images/panelMenu/activeIcons/地标.png"
                        },{
                            "tag":"50102",
                            "id":"createline",
                            "name":"折线",
                            "title":"折线",
                            "src":"images/panelMenu/inactiveIcons/折线.png",
                            "srcd":"images/panelMenu/activeIcons/折线.png"
                        },{
                            "tag":"50103",
                            "id":"createcurve",
                            "name":"曲线",
                            "title":"曲线",
                            "src":"images/panelMenu/inactiveIcons/曲线.png",
                            "srcd":"images/panelMenu/activeIcons/曲线.png"
                        },{
                            "tag":"50104",
                            "id":"createpolygon",
                            "name":"多边形",
                            "title":"多边形",
                            "src":"images/panelMenu/inactiveIcons/多边形.png",
                            "srcd":"images/panelMenu/activeIcons/多边形.png"
                        },{
                            "tag":"50107",
                            "id":"createcircle",
                            "name":"圆",
                            "title":"圆",
                            "src":"images/panelMenu/inactiveIcons/圆.png",
                            "srcd":"images/panelMenu/activeIcons/圆.png"
                        },{
                            "tag":"50108",
                            "id":"createellipse",
                            "name":"椭圆",
                            "title":"椭圆",
                            "src":"images/panelMenu/inactiveIcons/椭圆.png",
                            "srcd":"images/panelMenu/activeIcons/椭圆.png"
                        },{
                            "tag":"50109",
                            "id":"createsector",
                            "name":"扇形",
                            "title":"扇形",
                            "src":"images/panelMenu/inactiveIcons/扇形.png",
                            "srcd":"images/panelMenu/activeIcons/扇形.png"
                        },{
                            "tag":"50105",
                            "id":"createTexturePolygon",
                            "name":"纹理多边形",
                            "title":"纹理多边形",
                            "src":"images/panelMenu/inactiveIcons/纹理多边形.png",
                            "srcd":"images/panelMenu/activeIcons/纹理多边形.png"
                        },{
                            "tag":"50106",
                            "id":"createrectangle",
                            "name":"矩形贴图",
                            "title":"矩形贴图",
                            "src":"images/panelMenu/inactiveIcons/矩形贴图.png",
                            "srcd":"images/panelMenu/activeIcons/矩形贴图.png"
                        }
                    ]
                },
                {
                    "tag":"502",
                    "id":"object2DManager",
                    "name":"二维对象处理",
                    "title":"二维对象处理",
                    "src":"images/tools/二维对象处理.png",
                    "item":[
                        {
                            "tag": "50201",
                            "id": "lineBuffer",
                            "name": "线缓冲",
                            "title": "线缓冲",
                            "src": "images/panelMenu/inactiveIcons/线缓冲.png",
                            "srcd": "images/panelMenu/activeIcons/线缓冲.png"
                        },
                        {
                            "tag": "50202",
                            "id": "parallelLines",
                            "name": "平行线",
                            "title": "平行线",
                            "src": "images/panelMenu/inactiveIcons/平行线.png",
                            "srcd": "images/panelMenu/activeIcons/平行线.png"
                        },
                        {
                            "tag": "50203",
                            "id": "parallelSurface",
                            "name": "平行面",
                            "title": "平行面",
                            "src": "images/panelMenu/inactiveIcons/平行面.png",
                            "srcd": "images/panelMenu/activeIcons/平行面.png"
                        },
                        {
                            "tag": "50204",
                            "id": "surfaceTosurface_1",
                            "name": "面面求并",
                            "title": "面面求并",
                            "src": "images/panelMenu/inactiveIcons/面面求并.png",
                            "srcd": "images/panelMenu/activeIcons/面面求并.png"
                        },
                        {
                            "tag": "50205",
                            "id": "surfaceTosurface_2",
                            "name": "面面相减",
                            "title": "面面相减",
                            "src": "images/panelMenu/inactiveIcons/面面相减.png",
                            "srcd": "images/panelMenu/activeIcons/面面相减.png"
                        },
                        {
                            "tag": "50206",
                            "id": "surfaceTosurface_0",
                            "name": "面面求交",
                            "title": "面面求交",
                            "src": "images/panelMenu/inactiveIcons/面面求交.png",
                            "srcd": "images/panelMenu/activeIcons/面面求交.png"
                        }
                    ]
                },
                {
                    "tag":"503",
                    "id":"importExport2D",
                    "name":"二维导入导出",
                    "title":"二维导入导出",
                    "src":"images/tools/二维导入导出.png",
                    "item":[
                        {
                            "tag":"50301",
                            "id":"importVector",
                            "name":"导入矢量",
                            "title":"导入矢量",
                            "src":"images/panelMenu/inactiveIcons/导入矢量.png",
                            "srcd":"images/panelMenu/activeIcons/导入矢量.png"
                        },
                        {
                            "tag":"50302",
                            "id":"exportSHP",
                            "name":"导出SHP",
                            "title":"导出SHP",
                            "src":"images/panelMenu/inactiveIcons/导出SHP.png",
                            "srcd":"images/panelMenu/activeIcons/导出SHP.png"
                        }
                    ]
                },
                {
                    "tag":"505",
                    "id":"object3DDraw",
                    "name":"几何对象绘制",
                    "title":"几何对象绘制",
                    "src":"images/tools/几何对象绘制.png",
                    "item":[
                        {
                            "tag":"50501",
                            "id":"sphere",
                            "name":"球体",
                            "title":"球体",
                            "src":"images/panelMenu/inactiveIcons/球体.png",
                            "srcd":"images/panelMenu/activeIcons/球体.png"
                        },{
                            "tag":"50502",
                            "id":"box",
                            "name":"立方体",
                            "title":"立方体",
                            "src":"images/panelMenu/inactiveIcons/立方体.png",
                            "srcd":"images/panelMenu/activeIcons/立方体.png"
                        },{
                            "tag":"50503",
                            "id":"volume",
                            "name":"立体多边形",
                            "title":"立体多边形",
                            "src":"images/panelMenu/inactiveIcons/立体多边形.png",
                            "srcd":"images/panelMenu/activeIcons/立体多边形.png"
                        },{
                            "tag":"50504",
                            "id":"cylinder",
                            "name":"圆柱",
                            "title":"圆柱",
                            "src":"images/panelMenu/inactiveIcons/圆柱体.png",
                            "srcd":"images/panelMenu/activeIcons/圆柱体.png"
                        },{
                            "tag":"50505",
                            "id":"cone",
                            "name":"圆锥",
                            "title":"圆锥",
                            "src":"images/panelMenu/inactiveIcons/圆锥.png",
                            "srcd":"images/panelMenu/activeIcons/圆锥.png"
                        },{
                            "tag":"50506",
                            "id":"prism",
                            "name":"棱柱",
                            "title":"棱柱",
                            "src":"images/panelMenu/inactiveIcons/棱柱.png",
                            "srcd":"images/panelMenu/activeIcons/棱柱.png"
                        },{
                            "tag":"50507",
                            "id":"pyramid",
                            "name":"棱锥",
                            "title":"棱锥",
                            "src":"images/panelMenu/inactiveIcons/棱锥.png",
                            "srcd":"images/panelMenu/activeIcons/棱锥.png"
                        },
                        {
                            "tag":"50412",
                            "id":"signalSphere",
                            "name":"雷达基站",
                            "title":"雷达基站",
                            "src":"images/panelMenu/inactiveIcons/辐射球.png",
                            "srcd":"images/panelMenu/activeIcons/辐射球.png"
                        },{
                            "tag":"50508",
                            "id":"simplebuilding",
                            "name":"简单建筑",
                            "title":"简单建筑",
                            "src":"images/panelMenu/inactiveIcons/简单建筑.png",
                            "srcd":"images/panelMenu/activeIcons/简单建筑.png"
                        }/*,{
                            "tag":"50509",
                            "id":"flowRoute",
                            "name":"路线",
                            "title":"路线",
                            "src":"images/panelMenu/inactiveIcons/路线.png",
                            "srcd":"images/panelMenu/activeIcons/路线.png"
                        }*/,{
                            "tag":"50510",
                            "id":"cordon",
                            "name":"警戒线",
                            "title":"警戒线",
                            "src":"images/panelMenu/inactiveIcons/警戒线.png",
                            "srcd":"images/panelMenu/activeIcons/警戒线.png"
                        }
                    ]
                },
                {
                    "tag":"506",
                    "id":"object3DAdd",
                    "name":"三维对象添加",
                    "title":"三维对象添加",
                    "src":"images/tools/三维对象添加.png",
                    "item":[
                        {
                            "tag":"50601",
                            "id":"model",
                            "name":"添加模型",
                            "title":"添加模型",
                            "src":"images/panelMenu/inactiveIcons/模型添加.png",
                            "srcd":"images/panelMenu/activeIcons/模型添加.png"
                        },{
                            "tag":"50602",
                            "id":"tree",
                            "name":"添加树",
                            "title":"添加树",
                            "src":"images/panelMenu/inactiveIcons/添加树.png",
                            "srcd":"images/panelMenu/activeIcons/树添加.png"
                        },{
                            "tag":"50603",
                            "id":"furniture",
                            "name":"添加小品",
                            "title":"添加小品",
                            "src":"images/panelMenu/inactiveIcons/小品添加.png",
                            "srcd":"images/panelMenu/activeIcons/小品添加.png"
                        },{
                            "tag":"50604",
                            "id":"picture",
                            "name":"添加图片",
                            "title":"添加图片",
                            "src":"images/panelMenu/inactiveIcons/添加图片.png",
                            "srcd":"images/panelMenu/activeIcons/添加图片.png"
                        }
                    ]
                },
                {
                    "tag":"507",
                    "id":"importExport3D",
                    "name":"三维导入导出",
                    "title":"三维导入导出",
                    "src":"images/tools/三维导入导出.png",
                    "item":[
                        {
                            "tag":"50701",
                            "id":"exportObj",
                            "name":"导出OBJ",
                            "title":"导出OBJ",
                            "src":"images/panelMenu/inactiveIcons/导出OBJ.png",
                            "srcd":"images/panelMenu/activeIcons/导出OBJ.png"
                        },{
                            "tag":"50702",
                            "id":"exportUSX",
                            "name":"导出USX",
                            "title":"导出USX",
                            "src":"images/panelMenu/inactiveIcons/导出USX.png",
                            "srcd":"images/panelMenu/activeIcons/导出USX.png"
                        },{
                            "tag":"50703",
                            "id":"importBuilding",
                            "name":"导入楼块",
                            "title":"导入楼块",
                            "src":"images/panelMenu/inactiveIcons/导入楼块.png",
                            "srcd":"images/panelMenu/activeIcons/导入楼块.png"
                        },{
                            "tag":"50704",
                            "id":"importModel",
                            "name":"导入模型",
                            "title":"导入模型",
                            "src":"images/panelMenu/inactiveIcons/导入模型.png",
                            "srcd":"images/panelMenu/activeIcons/导入模型.png"
                        }
                    ]
                },
                {
                    "tag":"504",
                    "id":"emergencyPlot",
                    "name":"应急标绘",
                    "title":"应急标绘",
                    "src":"images/tools/应急标绘.png",
                    "item":[
                        {
                            "tag":"50401",
                            "id":"sArrow",
                            "name":"简单箭头",
                            "title":"简单箭头",
                            "src":"images/panelMenu/inactiveIcons/简单箭头.png",
                            "srcd":"images/panelMenu/activeIcons/简单箭头.png"
                        },
                        {
                            "tag":"50402",
                            "id":"customArrow",
                            "name":"自定义箭头",
                            "title":"自定义箭头",
                            "src":"images/panelMenu/inactiveIcons/自定义箭头.png",
                            "srcd":"images/panelMenu/activeIcons/自定义箭头.png"
                        },
                        {
                            "tag":"50403",
                            "id":"tailSArrow",
                            "name":"燕尾箭头",
                            "title":"燕尾箭头",
                            "src":"images/panelMenu/inactiveIcons/燕尾箭头.png",
                            "srcd":"images/panelMenu/activeIcons/燕尾箭头.png"
                        },
                        {
                            "tag":"50404",
                            "id":"customTailArrow",
                            "name":"自定义燕尾箭头",
                            "title":"自定义燕尾箭头",
                            "src":"images/panelMenu/inactiveIcons/自定义燕尾箭头.png",
                            "srcd":"images/panelMenu/activeIcons/自定义燕尾箭头.png"
                        },
                        {
                            "tag":"50405",
                            "id":"equalSArrow",
                            "name":"直箭头",
                            "title":"直箭头",
                            "src":"images/panelMenu/inactiveIcons/直箭头.png",
                            "srcd":"images/panelMenu/activeIcons/直箭头.png"
                        },
                        {
                            "tag":"50406",
                            "id":"doubleArrow",
                            "name":"双箭头",
                            "title":"双箭头",
                            "src":"images/panelMenu/inactiveIcons/双箭头.png",
                            "srcd":"images/panelMenu/activeIcons/双箭头.png"
                        },
                        {
                            "tag":"50407",
                            "id":"xArrow",
                            "name":"多箭头",
                            "title":"多箭头",
                            "src":"images/panelMenu/inactiveIcons/三箭头.png",
                            "srcd":"images/panelMenu/activeIcons/三箭头.png"
                        },
                        {
                            "tag":"50408",
                            "id":"assemblyArea",
                            "name":"集结地域",
                            "title":"集结地域",
                            "src":"images/panelMenu/inactiveIcons/集结地域.png",
                            "srcd":"images/panelMenu/activeIcons/集结地域.png"
                        },
                        {
                            "tag":"50409",
                            "id":"curveFlag",
                            "name":"曲线旗标",
                            "title":"曲线旗标",
                            "src":"images/panelMenu/inactiveIcons/曲线旗标.png",
                            "srcd":"images/panelMenu/activeIcons/曲线旗标.png"
                        },
                        {
                            "tag":"50410",
                            "id":"rightAngleFlag",
                            "name":"直角旗标",
                            "title":"直角旗标",
                            "src":"images/panelMenu/inactiveIcons/直角旗标.png",
                            "srcd":"images/panelMenu/activeIcons/直角旗标.png"
                        },
                        {
                            "tag":"50411",
                            "id":"triangleFlag",
                            "name":"三角旗标",
                            "title":"三角旗标",
                            "src":"images/panelMenu/inactiveIcons/三角旗标.png",
                            "srcd":"images/panelMenu/activeIcons/三角旗标.png"
                        }
                    ]
                }
            ]
        },
        {
            "id":"edit",
            "name":"编辑",
            "title":"编辑",
            "tag":"6",
            "src":"images/top/inactiveIcons/edit.png",
            "item":
            [
                {
                    "tag":"60101",
                    "id":"select",
                    "name":"选择",
                    "title":"选择",
                    "src":"images/tools/选择.png",
                    "srcd":"images/tools/选择.png"
                },{
                    "tag":"60102",
                    "id":"move",
                    "name":"移动",
                    "title":"移动",
                    "src":"images/tools/移动.png",
                    "srcd":"images/tools/移动.png"
                },{
                    "tag":"60103",
                    "id":"rotate",
                    "name":"旋转",
                    "title":"旋转",
                    "src":"images/tools/旋转.png",
                    "srcd":"images/tools/旋转.png"
                },{
                    "tag":"60104",
                    "id":"scale",
                    "name":"缩放",
                    "title":"缩放",
                    "src":"images/tools/缩放.png",
                    "srcd":"images/tools/缩放.png"
                },{
                    "tag":"60106",
                    "id":"group",
                    "name":"组合",
                    "title":"组合",
                    "src":"images/tools/组合.png",
                    "srcd":"images/tools/组合.png"
                },{
                    "tag":"60107",
                    "id":"ungroup",
                    "name":"拆分",
                    "title":"拆分",
                    "src":"images/tools/拆分.png",
                    "srcd":"images/tools/拆分.png"
                },{
                    "tag":"60105",
                    "id":"ground",
                    "name":"贴地",
                    "title":"贴地",
                    "src":"images/tools/贴地.png",
                    "srcd":"images/tools/贴地.png"
                },{
                    "tag":"60206",
                    "id":"clone",
                    "name":"克隆",
                    "title":"克隆",
                    "src":"images/tools/克隆.png",
                    "srcd":"images/tools/克隆.png"
                },{
                "tag":"60109",
                "id":"delObj",
                "name":"删除",
                "title":"删除",
                "src":"images/tools/克隆.png",
                "srcd":"images/tools/克隆.png"
                },{
                    "tag":"60201",
                    "id":"editpoint",
                    "name":"移动顶点",
                    "title":"移动顶点",
                    "src":"images/tools/移动顶点.png",
                    "srcd":"images/tools/移动顶点.png"
                },{
                    "tag":"60203",
                    "id":"addpoint",
                    "name":"增加顶点",
                    "title":"增加顶点",
                    "src":"images/tools/增加顶点.png",
                    "srcd":"images/tools/增加顶点.png"
                },{
                    "tag":"60202",
                    "id":"deletepoint",
                    "name":"删除顶点",
                    "title":"删除顶点",
                    "src":"images/tools/删除顶点.png",
                    "srcd":"images/tools/删除顶点.png"
                },{
                    "tag":"60204",
                    "id":"SegmentExtrude",
                    "name":"边拉伸",
                    "title":"边拉伸",
                    "src":"images/tools/边拉伸.png",
                    "srcd":"images/tools/边拉伸.png"
                },{
                    "tag":"60205",
                    "id":"VolumeSegmentExtrude",
                    "name":"体拉伸",
                    "title":"体拉伸",
                    "src":"images/tools/体拉伸.png",
                    "srcd":"images/tools/体拉伸.png"
                },{
                    "tag":"60207",
                    "id":"terrainSmooth",
                    "name":"地形平整",
                    "title":"地形平整",
                    "src":"images/tools/地形平整.png",
                    "srcd":"images/tools/地形平整.png"
                }      
            ]
        }
    ]
}
