import Promise from "./public";
/* ============================登录============================= */
// 登录
export const login = params => {
    return Promise.$promise("d_member/login", params);
};
// 判断是否已登录
export const isLogin = params => {
    return Promise.$promise("d_user/isLogin", params);
};
// 获取地图中心点
export const getAMapCenter = params => {
    return Promise.$promise("d_point_start/dataGet", params);
};
// home nav
export const getMenus = params => {
    return Promise.$promise("d_user/dataUserMenu", params);
};
/* ===============================实时指挥======================================== */
// realtimeCommand
// 获取巡逻组
export const getEmployeeGroup = params => {
    return Promise.$promise("d_employee_group/dataList", params);
};
// 获取巡逻组成员
export const getEmployees = params => {
    return Promise.$promise("d_employee_group/bindList", params);
};
// 获取所有在线设备
export const getAllDevs = params => {
    return Promise.$promise("pe_base/dataGpsOnLine", params);
};
// 获取案发点
export const getCrimePoint = params => {
    return Promise.$promise("d_crime_point/dataList", params);
};
// 添加案发点
export const addCasePoint = params => {
    return Promise.$promise("d_crime_point/dataAdd", params);
};
// 修改案发点
export const editCasePoint = params => {
    return Promise.$promise("d_crime_point/dataUpdate", params);
};
// 删除案发点
export const delCasePoint = params => {
    return Promise.$promise("d_crime_point/dataDelete", params);
};
/* ==================================巡逻组管理===================================== */
// 获取巡逻组 固定分组,临时分组type:0,type:1
// getEmployeeGroup
// 获取警员组下成员
// getEmployees
// 获取所有警员
export const getAllEmployees = params => {
    return Promise.$promise("pe_base/getBind", params);
};
// 新增警员组
export const addEmpGroup = params => {
    return Promise.$promise("d_employee_group/dataAdd", params);
};
// 编辑警员组
export const editEmpGroup = params => {
    return Promise.$promise("d_employee_group/dataUpdate", params);
};
// 删除警员组
export const delEmpGroup = params => {
    return Promise.$promise("d_employee_group/dataDelete", params);
};
// 删除警员组成员
export const delGroupEmp = params => {
    return Promise.$promise("d_employee_group/bindDelete", params);
};
// 一键清除已过期
export const delExpire = params => {
    return Promise.$promise("d_employee_group/expireDelete", params);
};

/* ==================================对讲频道==================================== */
// 获取频道列表
export const getIntercomList = params => {
    return Promise.$promise("d_voice_room/dataList", params);
};
// 获取频道警员
export const getIntercomEmps = params => {
    return Promise.$promise("d_voice_room_relevance/getListByRoomId", params);
};
