
<template>
    <!-- 登录页 -->
    <div id="login">
        <el-form :model="loginForm" :rules="loginRules" ref="loginRef" label-width='100px' class="loginForm">
            <el-form-item label='警员编号' prop='code'>
                <el-input v-model='loginForm.code'></el-input>
            </el-form-item>
            <el-form-item label='密码' prop='password'>
                <el-input v-model='loginForm.password'></el-input>
            </el-form-item>
            <el-form-item prop='remember'>
                <el-checkbox v-model="loginForm.is_remember" true-label='1' false-label='0'>记住登录状态</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button type='success' @click="submitForm('loginRef')"> 登 录 </el-button>
                <el-button type='primary' @click="resetForm('loginRef')"> 重 置 </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import axios from "axios";
import { login } from '@/api';
import store from '@/store';
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                code: '',
                password: '',
                is_remember: 0,//1:记住,0:不记住
            },
            loginRules: {
                code: [
                    { required: true, message: 'please input username', trigger: 'blur' },
                    // { pattern: /^[a-zA-Z]\w{5,17}$/, message: 'beginning with letters, length 6-18, can only contain characters, numbers and underlines', trigger: 'blur' }//以字母开头，长度在6-18之间， 只能包含字符、数字和下划线
                ],
                password: [
                    { required: true, message: 'please input password', trigger: 'blur' },
                    // { min: 6, max: 8, message: 'password must be between 6 to 8 characters', trigger: 'blur' },
                ],
            },
        };
    },
    methods: {
        submitForm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    login(this.loginForm).then(res => {
                        if (res.status === '1') {
                            this.$message({ message: res.message, type: 'success' });
                            // 登录成功,页面跳转
                            store.dispatch('login', true);
                            this.$router.push({ path: '/' });
                        } else {
                            this.$message({ message: res.message, type: 'error' });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        resetForm(form) {
            this.$refs[form].resetFields();
        },
    },
}
</script>

<style lang="less" scoped>
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

#app {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #f4f4f4;
}

.loginForm {
    position: absolute;
    padding: 60px 40px 10px 20px;
    width: 400px;
    left: 50%;
    margin-left: -230px;
    bottom: 160px;
    border: 1px solid #aaf;
    box-shadow: 1px 0px 10px -2px;
    border-radius: 8px;
}

.loginForm .el-form-item__content {
    margin-bottom: 20px;
}
</style>
