<template>
    <div id="employeeGroup" class="stableAsideWrap">
        <div class="left-card  aside-main">
            <el-row>
                <el-button type="success" size="mini" @click="addGroup">新增</el-button>
                <el-button type="danger" size="mini" @click="delExpire">一键清除已过期</el-button>
            </el-row>
            <div class="left-grid">
                <div class="fix-grid">
                    <div class="title">固定分组</div>
                    <el-table :data="fixGrid" style="width:100%" highlight-current-row @row-click='rowClick'>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="name" label="巡逻组名称"></el-table-column>
                        <el-table-column prop="opt" label="操作">
                            <template slot-scope="scope">
                                <el-button class="tinyBtn" plain type="primary" size="mini" @click="editGroup(scope.row)">编辑</el-button>
                                <el-button class="tinyBtn" plain type="danger" size="mini" @click="delGroup">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="temp-grid">
                    <div class="title">临时分组</div>
                    <el-table :data="tempGrid" style="width:100%" highlight-current-row @row-click='rowClick'>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="name" label="巡逻组名称"></el-table-column>
                        <el-table-column prop="is_expire" label="是否已过期"></el-table-column>
                        <el-table-column prop="opt" label="操作">
                            <template slot-scope="scope">
                                <el-button class="tinyBtn" plain type="primary" size="mini" @click.stop="editGroup(scope.row)">编辑</el-button>
                                <el-button class="tinyBtn" plain type="danger" size="mini" @click="delGroup">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
            </div>
        </div>
        <div class="right-card  main-main">
            <div class="title"> {{groupName}} </div>
            <el-table :data="empsGrid" style="width:100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="jyxm" label="警员姓名"></el-table-column>
                <el-table-column prop="jybh" label="警员编号"></el-table-column>
                <el-table-column prop="cpxh" label="设备编号"></el-table-column>
                <el-table-column prop="opt" label="操作">
                    <template slot-scope="scope">
                        <el-button class="tinyBtn" plain type="danger" size="mini" @click="delEmp">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title='dialogTitle' :visible.sync='dialogVisible' width='80%' id="empGroupDlg">
            <div class="empGroupDlgBody">
                <el-row>
                    <el-col :span='24'>
                        <el-form :model="form" :inline='true'>
                            <el-form-item label='巡逻组名称'>
                                <el-input v-model="form.groupName"></el-input>
                            </el-form-item>
                            <el-form-item label='巡逻组类型'>
                                <el-select v-model="form.groupType" @change="changeGroupType">
                                    <el-option label="固定分组" :value='0'></el-option>
                                    <el-option label="临时分组" :value='1'></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label='周期' v-if="dlgVisiable.expire">
                                <el-select v-model="form.is_expire">
                                    <el-option label='1天' :value='1'></el-option>
                                    <el-option label='3天' :value='3'></el-option>
                                    <el-option label='7天' :value='7'></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label='创建时间' class="date" v-if="dlgVisiable.createTime">
                                <el-date-picker v-model="form.create_time" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" :disabled="true" :editable="false">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label='结束时间' class="date" v-if="dlgVisiable.expireTime">
                                <el-date-picker v-model="form.expire_time" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" :editable="false">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <div class="title"> 所有警员 </div>
                        <el-table :data='allEmps' style="width:100%" height='500'>
                            <el-table-column type="index"></el-table-column>
                            <el-table-column property='jyxm' label='警员姓名'></el-table-column>
                            <el-table-column property='jybh' label='警员编号'></el-table-column>
                            <el-table-column property='cpxh' label='设备编号'></el-table-column>
                            <el-table-column property='opt' label='操作'>
                                <template slot-scope="scope">
                                    <el-button plain type="success" size="mini" @click="addEmp(scope.row)">添加</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="paginationBottom" background layout="prev, pager, next" :total="page.total" :page-size='page.size' @current-change='pageCurrent'>
                        </el-pagination>
                    </el-col>
                    <el-col :span='12'>
                        <div class="title"> 已选警员 </div>
                        <el-table :data='selEmps' style="width:100%" height='533'>
                            <el-table-column type="index"></el-table-column>
                            <el-table-column property='jyxm' label='警员姓名'></el-table-column>
                            <el-table-column property='jybh' label='警员编号'></el-table-column>
                            <el-table-column property='cpxh' label='设备编号'></el-table-column>
                            <el-table-column property='opt' label='操作'>
                                <template slot-scope="scope">
                                    <el-button plain type="danger" size="mini" @click="cancelEmp(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>

            <div slot='footer' class="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type='primary' @click="dialogOk">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// 获取所有警员组
import { getEmployeeGroup, getEmployees, getAllEmployees, addEmpGroup, editEmpGroup } from '@/api';
export default {
    data() {
        return {
            fixGrid: [],
            tempGrid: [],
            dialogTitle: '',
            dialogFormVisible: false,
            empsGrid: [],
            groupName: '',
            optGroup: '',//当前操作组
            dialogVisible: false,//dialog不可见
            form: {
                groupName: '',
                groupType: 0,
                is_expire: 1,
                create_time: '',
                expire_time: ''

            },
            dlgVisiable: {
                expire: false,
                createTime: false,
                expireTime: false,
            },
            page: {
                total: 1,
                current: 1,
                size: 8
            },
            allEmps: [],
            selEmps: [],
        };
    },
    methods: {
        // 获取警员组
        _getEmployeeGroup(d) {
            const self = this;
            getEmployeeGroup(d).then(res => {
                if (res.status) {
                    if (d.type == 0) {
                        this.fixGrid = res.data.list;
                        if (this.fixGrid.length) {
                            this.optGroup = this.fixGrid[0];
                            self._getEmployees({ page: 1, rows: 999, id: self.optGroup.id });
                        }
                    } else {
                        this.tempGrid = res.data.list;
                        this.tempGrid = this.tempGrid.map((v, arr) => {
                            if (v.is_expire == 1) {
                                v.is_expire = '已过期';
                            } else {
                                v.is_expire = '未过期';
                            }
                            return v;
                        });
                        if (this.tempGrid.length && this.optGroup == '') {
                            this.optGroup = this.tempGrid[0];
                            self._getEmployees({ page: 1, rows: 999, id: self.optGroup.id });
                        }
                    }
                } else {
                    this.$message({ message: res.message, type: 'error' });

                }
            });
        },
        // 获取警员组成员
        _getEmployees(d) {
            getEmployees(d).then(res => {
                if (res.status) {
                    this.groupName = this.optGroup.name;
                    this.empsGrid = res.data.list;
                    this.selEmps = res.data.list;
                } else {
                    this.$message({ message: res.message, type: 'error' });
                }
            });
        },
        // 获取所有警员
        _getAllEmployees(d) {
            getAllEmployees(d).then(res => {
                if (res.status) {
                    this.allEmps = res.data.list;
                    this.page.total = res.data.total;
                } else {
                    this.$message({ message: res.message, type: 'error' });
                }
            });
        },
        // 新增警员组
        addGroup() {
            this.dialogTitle = '新增';
            this.dialogVisible = true;
            this._getAllEmployees({ page: 1, rows: this.page.size });
            this.dlgVisiable.expire = false;
            this.dlgVisiable.createTime = false;
            this.dlgVisiable.expireTime = false;
            this.form.groupName = '';
            this.form.groupType = 0;
        },
        // 一键清除已过期
        delExpire() { },
        // 编辑警员组
        editGroup(row) {
            // 弹出dialog,row 的数据
            this.dialogTitle = '编辑';
            this.dialogVisible = true;
            this._getAllEmployees({ page: 1, rows: this.page.size });
            this.form.groupName = row.name;
            this.form.groupType = row.type;
            if (row.type == 0) {
                this.dlgVisiable.expire = false;
                this.dlgVisiable.createTime = false;
                this.dlgVisiable.expireTime = false;
            } else {
                this.dlgVisiable.expire = false;
                this.dlgVisiable.createTime = true;
                this.dlgVisiable.expireTime = true;
                this.form.create_time = row.create_time;
                this.form.expire_time = row.expire_time;
            }

        },
        changeGroupType(r) {
            if (this.dialogTitle == '新增') {
                this.dlgVisiable.createTime = false;
                this.dlgVisiable.expireTime = false;
                if (r == 0) {
                    this.dlgVisiable.expire = false;
                } else {
                    this.dlgVisiable.expire = true;
                }
            } else {
                this.dlgVisiable.expire = false;
                if (r == 0) {
                    this.dlgVisiable.createTime = false;
                    this.dlgVisiable.expireTime = false;
                } else {
                    this.form.create_time = this.optGroup.create_time;
                    this.form.expire_time = this.optGroup.expire_time;
                    this.dlgVisiable.createTime = true;
                    this.dlgVisiable.expireTime = true;
                }
            }
        },
        // 删除警员组
        delGroup() { },
        // 删除警员组中警员
        delEmp() { },
        // 警员组行点击事件
        rowClick(row) {
            this.optGroup = row;
            this._getEmployees({ page: 1, rows: 999, id: this.optGroup.id });
        },
        // 警员组追加警员
        addEmp(row) {
            // 根据row.cpxh 判断警员是否在selEmp中
            let i = this.selEmps.findIndex(function(v, i, arr) {
                return row.cpxh === v.cpxh;
            });
            if (i == -1) {
                this.selEmps.push(row);
            } else {
                this.$message({ message: '该警员已在巡逻组中', type: 'info' });
            }
        },
        // 警员组取消警员
        cancelEmp(row) {
            let i = this.selEmps.findIndex(function(v, i, arr) {
                return row.cpxh === v.cpxh;
            });
            this.selEmps.splice(i, 1);
        },
        dialogOk() {
            // 获取表单数据和selEmps中的id
            var d = {};
            const ids = [];
            for (let i = 0; i < this.selEmps.length; i++) {
                ids.push(this.selEmps[i].id);
            }
            d.ids = ids.join(',');
            d.groupName = this.form.groupName;
            d.groupType = this.form.groupType;
            let submitEmpGroup = null;
            if (this.dialogTitle == '新增') {
                submitEmpGroup = addEmpGroup;
                if (this.form.groupType == 1) {
                    d = Object.assign(d, { is_expire: this.form.is_expire });
                }
            } else {
                submitEmpGroup = editEmpGroup
                if (this.form.groupType == 1) {
                    d = Object.assign(d, { expire_time: this.form.expire_time });
                }
            }
            submitEmpGroup(d).then(res => {
                if (res.status) {
                    this.$message({ message: res.message, type: 'success' });
                    this._getEmployeeGroup({ type: d.groupType, page: 1, rows: 20 });
                } else {
                    this.$message({ message: res.message, type: 'error' });
                }
            });
        },
        pageCurrent(page) {
            this._getAllEmployees({ page: page, rows: this.page.size });
        },
    },
    created() {
        // 获取固定分组
        this._getEmployeeGroup({ type: 0, page: 1, rows: 20 });
        // 获取临时分组
        this._getEmployeeGroup({ type: 1, page: 1, rows: 20 });

    },
    // watch: {
    //     "form.expire_time"(value) { console.log(value) }
    // }
}
</script>
<style lang="less" scoped>
.left-card {
    position: relative;
    width: 40%;
}

.left-grid {
    position: absolute;
    top: 55px;
    bottom: 15px;
    left: 15px;
    right: 15px;
}

.fix-grid,
.temp-grid {
    width: 100%;
    height: 50%;
}

.tinyBtn {
    padding: 4px 7px;
    margin-right: 0;
    margin-left: 0;
}

.title {
    height: 30px;
    line-height: 30px;
    padding: 2px 5px;
    color: #555;
    background-color: #f7f7f7;
}

.paginationBottom {
    border-bottom: 1px solid #ebeef5;
}
</style>
<style>
#empGroupDlg .el-dialog__header {
    background-color: #f4f4f4;
}

#empGroupDlg .el-dialog__body {
    padding: 0 5px;
}

.empGroupDlgBody form {
    height: 50px;
    line-height: 50px;
}

.empGroupDlgBody .el-form-item__content {
    vertical-align: middle;
}

.empGroupDlgBody .el-input {
    width: 120px;
}

#empGroupDlg .el-dialog__footer {
    padding: 10px 20px;
}

.empGroupDlgBody .date .el-input {
    width: 200px;
}
</style>
