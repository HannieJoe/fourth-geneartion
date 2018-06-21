<template>
    <div id="realtimeCommand" class="stableAsideWrap">
        <div class="aside-main">
            <div class="aside-wrap">
                <el-button class="tinyBtn" type="primary" plain size="mini" :disabled="commandDisabled">指挥</el-button>
                <el-button class="tinyBtn" type="primary" plain size="mini">追加</el-button>
                <el-button class="tinyBtn" type="primary" plain size="mini" @click="showAllDevs">所有在线设备</el-button>
                <el-tabs tab-position="top" v-model="activeType" @tab-click="changeType">
                    <el-tab-pane label="固定分组" name='0'>
                    </el-tab-pane>
                    <el-tab-pane label="临时分组" name='1'>
                    </el-tab-pane>
                    <realtime-command-tab :groups="groups"></realtime-command-tab>
                </el-tabs>
            </div>

        </div>
        <div class="main-map">
            <div id="realtimeCommandMap" class="map-container"></div>
            <el-row class="map-btns">
                <el-button type="primary" size="small" @click="setCasePoint" :disabled="casePointDisabled">设置案发点</el-button>
                <el-button type="primary" size="small" @click="drawRectMap">框选</el-button>
                <el-button type="primary" size="small" @click="addRectMap">添加框选</el-button>
            </el-row>
            <!-- <realtime-command-infoWin v-if="infoMark.isShowing" :mark='infoMark.mark'></realtime-command-infoWin> -->
        </div>
        <realtime-command-videos v-if="videoDialog.isShowing" :devs='videoDialog.devs' @colseVideosDialog="colseVideosDialog"></realtime-command-videos>
    </div>
</template>
<script>
// 地图 //ajax
import AMap from 'AMap';
import axios from 'axios'
// 获取所有警员组// 获取所有在线设备// 获取所有案发点
import { getEmployeeGroup } from '@/api';
import { getAllDevs } from '@/api';
import { getCrimePoint } from '@/api';
// 添加案发点// 编辑案发点// 删除案发点
import { addCasePoint } from '@/api';
import { editCasePoint } from '@/api';
import { delCasePoint } from '@/api';
// 在线警员图标// 案发点图标
import onlinePliceIcon from '@/assets/online.png'
import casePointIcon from '@/assets/tag_b3.png'
// 导入组件
import RealtimeCommandTab from './components/realtimeCommandTab'
import RealtimeCommandVideos from './components/realtimeCommandVideos'


export default {
    props: {
        aMapCenter: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            activeType: '0',
            aMap: null,
            groups: [],
            commandDisabled: true,
            casePointDisabled: false,
            allDevsMarker: [],
            crimePointMarker: [],
            isSettingCrimePoint: false,
            activeCasePoint: null,//当前操作的case point
            activeInfoWindow: null,//当前操作的infowindow,
            videoDialog: { isShowing: false, devs: [] },
        }
    },
    created() {
        this._getEmployeeGroup({ page: 1, rows: 999, type: this.activeType });
    },
    components: { RealtimeCommandTab, RealtimeCommandVideos },
    methods: {
        _getEmployeeGroup(param) {
            getEmployeeGroup(param).then(res => {
                if (res.status) {
                    this.groups = res.data.list.map((obj, i) => {
                        return Object.assign({}, obj, { checked: false, showEmps: false, employees: [] });
                    });
                }
            });
        },
        changeType() {
            if (this.activeType == '0') {
                this._getEmployeeGroup({ page: 1, rows: 999, type: 0 });
            } else {
                this._getEmployeeGroup({ page: 1, rows: 999, type: 1 });
            }
        },
        // 显示所有在线设备
        showAllDevs() {
            const map = this.aMap;
            getAllDevs({ page: 1, rows: 999, status: 1, bind: 1, is_online: 1 }).then(res => {
                if (res.status) {
                    // 先清除marker
                    this.aMap.remove(this.allDevsMarker);
                    this.allDevsMarker = null;
                    this.allDevsMarker = res.data.map((v, i) => {
                        return new AMap.Marker({
                            map: map,
                            position: [v.glon, v.glat],
                            title: v.jyxm,
                            icon: onlinePliceIcon,
                        });
                    });
                }
            });
        },
        // 新建案发点mark
        newCrimePointMark(m) {
            const self = this;
            return new AMap.Marker({
                // position: new AMap.LngLat(m.lon, m.lat),
                position: [m.lon, m.lat],
                pixel: m.pixel,//相对父元素的px坐标
                map: self.aMap,
                remark: m.remark,
                status: m.status,
                id: m.id,
                title: m.remark,
                icon: casePointIcon
            });
        },
        // 显示案发点的infowindow
        showInfoWindow(mk) {
            const self = this;
            self.activeInfoWindow = new AMap.InfoWindow({
                content: '<div style="width:220px;height:70px;">' +
                '<div style="height:35px;"><label style="font-size:14px;line-height:26px;">备注: </label><input id="remark"  type="text"   style="height:26px;line-height:26px;border-radius:5px;outline:0;border:1px solid #dcdfe6" value="' +
                mk.Uh.remark +
                '"/></div>' +
                '<div style="text-align:right;margin-top:5px;"><button style="margin-right:5px;" class="btn-zhx btn-success" id="saveRemark" >保存</button><button id="delRemark" class="btn-zhx btn-danger" >删除</button><div>' +
                "</div>",
            });
            self.activeInfoWindow.open(this.aMap, [mk.Uh.position.lng, mk.Uh.position.lat]);
            let dom = self.activeInfoWindow.Uh.contentDom;
            dom.onclick = function(e) {
                if (e.target.id == 'saveRemark') {
                    let remark = document.getElementById('remark').value;
                    if (remark.trim() == "") {
                        this.$message({ message: '请设置备注信息', type: 'warning' });
                        return false;
                    }
                    self.activeInfoWindow.Uh.remark = remark;
                    self.activeCasePoint.Uh.remark = remark;
                    self.saveRemark();
                } else if (e.target.id == 'delRemark') {
                    self.delRemark();
                }
            };
            // 关闭infowindow事件
            AMap.event.addListener(self.activeInfoWindow, 'close', function() {
                if (self.activeCasePoint.Uh.status == 'new') {
                    self.activeCasePoint.setMap(null);
                }
            });
        },
        // 获取案发点
        getCrimePoints() {
            const self = this;
            getCrimePoint({ page: 1, rows: 999 }).then(res => {
                if (res.status) {
                    self.aMap.remove(this.crimePointMarker);
                    this.crimePointMarker = null;
                    this.crimePointMarker = res.data.list.map((v, i) => {
                        const mk = self.newCrimePointMark(v);
                        AMap.event.addListener(mk, 'click', function() {
                            self.activeCasePoint = mk;
                            self.showInfoWindow(mk);
                        });
                    });
                }
            });
        },
        setCasePoint() {
            // 获取鼠标点击处的latlng
            const self = this;
            this.isSettingCrimePoint = true;
            AMap.event.addListener(this.aMap, 'click', function(e) {
                if (self.isSettingCrimePoint) {
                    self.isSettingCrimePoint = false;
                    const m = Object.assign({}, { remark: '', lat: e.lnglat.lat, lon: e.lnglat.lng, status: 'new', pixel: e.pixel });
                    self.activeCasePoint = self.newCrimePointMark(m);
                    self.showInfoWindow(self.activeCasePoint);
                }
            });

        },
        drawRectMap(selMarker = []) {
            const self = this;
            // 鼠标工具插件
            const mouseTool = new AMap.MouseTool(this.aMap);
            mouseTool.rectangle();
            // 获取rectangle的lat lon
            let latMin, latMax, lngMin, lngMax;
            mouseTool.on('draw', function(data) {
                // 将被框住的marker放入selMarker
                selMarker = self.allDevsMarker.filter((v, i, arr) => {
                    if (data.obj.contains(v.getPosition())) {
                        return v;
                    }
                });
                console.log(selMarker.length);
                mouseTool.close(true);
                self.videoDialog.isShowing = true;
                self.videoDialog.devs = selMarker;
            });

        },
        addRectMap() { },
        saveRemark() {
            // 根据activeCasePoint的status判断是增加还是修改
            const self = this;
            var param = {};
            param.remark = self.activeCasePoint.Uh.remark;
            param.lat = self.activeCasePoint.Uh.position.lat;
            param.lon = self.activeCasePoint.Uh.position.lng;
            let submitCasePoint = null;
            if (self.activeCasePoint.Uh.status == 'new') {
                submitCasePoint = addCasePoint;
            } else {
                submitCasePoint = editCasePoint;
                param.id = self.activeCasePoint.Uh.id;
            }
            submitCasePoint(param).then(res => {
                if (res.status) {
                    this.$message({ message: res.message, type: 'success' });
                    self.activeInfoWindow.close();
                    self.activeCasePoint.setMap(null);
                    let m = res.data;
                    m.status = 'old';
                    const mk = self.newCrimePointMark(m);
                    AMap.event.addListener(mk, 'click', function() {
                        self.activeCasePoint = mk;
                        self.showInfoWindow(mk);
                    });
                } else {
                    this.$message({ message: res.message, type: 'danger' });
                }
            });
        },
        delRemark() {
            const self = this;
            // 根据marker.status判断是否发送请求,new不发,old发
            if (self.activeCasePoint.Uh.status == 'new') {
                self.activeCasePoint.setMap(null);
                self.activeInfoWindow.close();
                return;
            }
            delCasePoint({ id: self.activeCasePoint.Uh.id }).then(res => {
                if (res.status) {
                    this.$message({ message: res.message, type: 'success' });
                    self.activeInfoWindow.close();
                    self.activeCasePoint.setMap(null);
                } else {
                    this.$message({ message: res.message, type: 'danger' });
                }
            });
        },
        // 关闭dialog
        colseVideosDialog() {
            this.videoDialog.isShowing = false;
        },
    },
    mounted() {
        var self = this;
        this.aMap = new AMap.Map('realtimeCommandMap', {
            zoom: 15,
            center: [this.aMapCenter.lon, this.aMapCenter.lat]
        });

        // 显示所有设备
        this.showAllDevs();
        // 获取案发点
        this.getCrimePoints();

        this.aMap.plugin(["AMap.MouseTool"], function() {
        });
    },
}
</script>

<style lang="less" scoped>
.aside-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.map-btns {
    position: absolute;
    top: 5px;
    left: 260px;
}

.el-button+.el-button {
    margin-left: 0;
}


.tinyBtn {
    padding: 4px 7px;
}
</style>
