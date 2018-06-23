<template>
    <div id="intercom" class="stableAsideWrap">
        <div class="left-card aside-main">
            <el-row>
                <el-button type="success" size="mini" @click="addChannel">新增</el-button>
            </el-row>
            <div class="title">频道列表</div>
            <div class="channel-grid">
                <el-table :data="channelGrid" style="width:100%" height="100%" @row-click='rowClick'>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="name" label='频道名称'></el-table-column>
                    <el-table-column prop="type_id" label='频道类型'></el-table-column>
                    <el-table-column prop="password" label='频道密码'></el-table-column>
                    <el-table-column label='操作'>
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="primary" size='mini'>编辑</el-button>
                                <el-button type="danger" size='mini'>删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="prev, pager, next" :total="channelPage.total" :page-size='channelPage.size' @current-change='pageCurrent'>
                </el-pagination>
            </div>
        </div>
        <div class="right-card main-main">
            <div class="title">{{channelTitle}}</div>
            <div class="channelEmps-grid">
                <el-table :data="channelEmps" style="width:100%" height="100%">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="jyxm" label='警员姓名'></el-table-column>
                    <el-table-column prop="jybh" label='警员编号'></el-table-column>
                    <el-table-column label='操作'>
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" size='mini'>删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width='80%' id="channelDlg">
            <div class="channelDlgBody">
                <el-row>
                    <el-col :span="24">
                        <el-form :model="form" :inline="true">
                            <el-form-item label="频道名称">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="频道类型">
                                <el-input v-model="form.type_id"></el-input>
                            </el-form-item>
                            <el-form-item label="频道密码" v-if="form.type_id==2">
                                <el-input v-model="form.password"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row v-if="form.type_id==1">
                    <el-col :span="12">
                        <div class="title"> 所有警员 </div>
                        <el-table :data='allEmps' style="width:100%" height="500">
                            <el-table-column type="index"></el-table-column>
                            <el-table-column prop="jyxm" label="警员姓名"></el-table-column>
                            <el-table-column prop="jybh" label="警员编号"></el-table-column>
                            <el-table-column prop="opt" label="操作">
                                <template slot-scope='scope'>
                                    <el-button size="mini" type="success">添加</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="12">
                        <div class="title"> 已选警员 </div>
                        <el-table :data='selEmps' style="width:100%" height="500">
                            <el-table-column type="index"></el-table-column>
                            <el-table-column prop="jyxm" label="警员姓名"></el-table-column>
                            <el-table-column prop="jybh" label="警员编号"></el-table-column>
                            <el-table-column prop="opt" label="操作">
                                <template slot-scope='scope'>
                                    <el-button size="mini" type="danger">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dlgOk">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getIntercomList, getIntercomEmps } from '@/api';
export default {
    data() {
        return {
            channelGrid: [],
            channelPage: {
                total: 1,
                size: 10,
                current: 1
            },
            optChannel: null,
            channelTitle: '',
            channelEmps: [],
            dialogTitle: '',
            dialogVisible: false,
            form: {
                name: '',
                type_id: 1,
                password: ''
            },
            allEmps: [],
            selEmps: [],
        }
    },
    methods: {
        // 获取频道列表
        _getIntercomList(d) {
            getIntercomList(d).then(res => {
                if (res.status) {
                    this.channelPage.total = res.data.total;
                    this.channelGrid = res.data.list;
                    if (this.optChannel == null && res.data.list.length > 0) {
                        this.optChannel = res.data.list[0];
                        this.channelTitle = this.optChannel.name;
                        this._getIntercomEmps({ page: 1, rows: 999, room_id: this.optChannel.room_id });
                    }
                } else {
                    this.$message({ message: res.message, type: 'error' });
                }
            });
        },
        // 获取频道成员
        _getIntercomEmps(d) {
            getIntercomEmps(d).then(res => {
                if (res.status) {
                    this.channelEmps = res.data.list;
                } else {
                    this.$message({ message: res.message, type: 'error' });
                }
            });
        },
        // 新增频道
        addChannel() {
            this.dialogVisible = true;
            this.dialogTitle = '新增';
        },
        rowClick(row) {
            console.log(row);
            this.optChannel = row;
            this.channelTitle = row.name;
            this._getIntercomEmps({ page: 1, rows: 999, room_id: this.optChannel.room_id });
        },
        pageCurrent(page) {
            this._getIntercomList({ page: page, rows: this.channelPage.size });
        },
        dlgOk() {
            console.log(this.form);
        },
    },
    created() {
        this._getIntercomList({ page: 1, rows: this.channelPage.size });
    },
}
</script>
<style lang="less" scoped>
.left-card {
    width: 60%;
    position: relative;
}

.right-card {
    position: relative;
}

.title {
    margin-top: 10px;
    height: 30px;
    line-height: 30px;
    padding: 2px 5px;
    color: #555;
    background-color: #f7f7f7;
}

.channel-grid {
    position: absolute;
    top: 87px;
    left: 10px;
    right: 10px;
    bottom: 40px;
}

.channelEmps-grid {
    position: absolute;
    top: 59px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background-color: #acc;
}
</style>
<style >
#channelDlg .el-dialog__header {
    background-color: #f4f4f4;
}

#channelDlg .el-dialog__body {
    padding: 0 5px;
}

.channelDlgBody form {
    height: 50px;
    line-height: 50px;
}

.channelDlgBody .el-form-item__content {
    vertical-align: middle;
}

.channelDlgBody .el-input {
    width: 120px;
}

#channelDlg .el-dialog__footer {
    padding: 10px 20px;
}
</style>


