<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 頭像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 用戶輸入 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用戶名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-s-custom"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密碼 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-unlock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <div class="btns">
          <el-button type="primary" @click="login">登陸</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用戶填入數據的綁定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 驗證用戶名和密碼的規則
      loginFormRules: {
        username: [
          { required: true, message: '他媽的還不快填????', trigger: 'blur' },
          { min: 5, max: 10, message: '長度在5到10個字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '他媽的還不快填????', trigger: 'blur' },
          { min: 6, max: 18, message: '長度在6到18個字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormReset () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登陸失敗')
        }
        this.$message.success('登陸成功')
        window.sessionStorage.setItem('token', res.data.token)
        // 跳轉到/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 500px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 150px;
    height: 150px;
    border: 1px solid #ddd;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
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

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
