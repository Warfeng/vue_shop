<template>
  <div id="login_container">
    <div id="login_box">
      <!--  -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo">
      </div>
      <!-- 表单 -->
      <el-form ref="loginFormRef" class="login_form" :model="form" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-key" show-password></el-input>
        </el-form-item>
        <!-- 登录事件and重置事件 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证 效验规则
      loginRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "请输入3-10位字符", trigger: "blur"}
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "请输入6-15位字符", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    // 重置按钮
    resetLoginForm() {
      // console.log(this.$refs.loginFormRef)
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // 结构出data 并重命名为res
        const { data: res } = await this.$http.post('login', this.form)
        // console.log(res)
        // 请求成功 200
        if (res.meta.status !== 200) return this.$message.error('login 失败')
        this.$message.success('login 成功')
        // 1、登录成功之后将 token，保存在客户端 sessionStorage 中
        // 
        console.log(res)
        window.sessionStorage.setItem("token", res.data.token)
        // 2、通过编程式导航跳转到后台主页，路由/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
#login_container {
  height: 100%;
  background-color: skyblue;

  #login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #ccc;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      // top: 40%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  
  .btns {
    float: right;
  }
}
</style>
