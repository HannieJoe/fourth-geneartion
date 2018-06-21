<template>
    <div id="realtimeCommandTab">
        <div v-for="(group,index) in groups" :key="index">
            <div @click.self="groupClk(group)" class="groupList">
                <el-checkbox v-model="group.checked" @change='groupCheck(group)'></el-checkbox>
                {{group.name}}
            </div>

            <div v-if="group.showEmps">
                <div v-for="(employee ,index) in group.employees" :key="index" class="employeeList">
                    <el-checkbox v-model="employee.checked" @change='empCheck(employee,group)'></el-checkbox>
                    {{employee.jyxm}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getEmployees } from '@/api';
export default {
    props: {
        groups: {
            type: Array,
            required: true,
        }
    },
    methods: {
        _getEmployees(param, group) {
            getEmployees(param).then(res => {
                if (res.status) {
                    group.employees = res.data.list.map((obj, i) => {
                        return Object.assign({}, obj, { checked: group.checked });
                    });

                    group.showEmps = true;
                }
            });
        },
        groupClk(group) {
            // 获取组成员
            if (group.showEmps) {
                group.showEmps = false;
            } else {
                this._getEmployees({ id: group.id, is_online: 1 }, group);
            }
        },
        groupCheck(group) {
            if (!group.showEmps) {
                this._getEmployees({ id: group.id, is_online: 1 }, group);
            } else {
                group.employees = group.employees.map((obj, i) => {
                    return Object.assign({}, obj, { checked: group.checked });
                });
            }
        },
        empCheck(emp, group) {
            if (emp.checked) {
                // 查看是否group.employees的所有emp都checked
                let i = group.employees.findIndex((v, i, arr) => {
                    return v.checked == false;
                });
                if (i == -1) {
                    group.checked = true;
                } else {
                    group.checked = false;
                }
            } else {
                group.checked = false;
            }
        },
    },
}
</script>

<style lang="less" scoped>
@import '~@/styles/vars.less'; //模块路径 加~
// @import '../../../styles/vars.less'; //相对路径
@treeList: treeList;
.@{treeList} {
    padding-left: 15px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #fff;
    font-size: 12px;
}

.groupList {
    background-color: @groupListBg;
    cursor: pointer;
    .treeList;
}

.employeeList {
    background-color: @empListBg;
    cursor: default;
    .treeList;
}
</style>

