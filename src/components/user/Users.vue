<template>
  <div>
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card 卡片 -->
    <el-card>
      <!-- 搜尋 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用戶</el-button
          >
        </el-col>
      </el-row>
      <!-- 用戶列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="郵箱" prop="email"></el-table-column>
        <el-table-column label="電話" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="狀態">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showDialogEdit(scope.row.id)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeUser(scope.row.id)"></el-button>
            <el-tooltip
              effect="dark"
              content="設置角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用戶的對話框 -->
      <el-dialog
        title="添加用戶"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用戶名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密碼" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="郵箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="電話" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">確 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用戶的對話框 -->
      <el-dialog title="修改用戶" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px">
          <el-form-item label="用戶名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="郵箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="電話" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editUserInfo">確定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z0-9-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      return callback(new Error('郵箱格式錯誤'))
    }

    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(853)?6\d{7}$/
      if (regMobile.test(value)) {
        return callback()
      }
      return callback(new Error('電話格式錯誤'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '請輸入用戶名', trigger: 'blur' },
          { min: 4, max: 10, message: '長度在4~10字符之間', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 6, max: 18, message: '長度在6~18字符之間', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '請輸入郵箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '請輸入郵箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取用戶列表失敗')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 當pageSize發生變化時
    handleSizeChange(newP) {
      this.queryInfo.pagesize = newP
      this.getUserList()
    },
    // 當當前頁數發生變化時
    handleCurrentChange(newC) {
      this.queryInfo.pagenum = newC
      this.getUserList()
    },
    async stateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('改變狀態失敗')
      }
      this.$message.success('狀態成功改變')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (vali) => {
        if (!vali) {
          return false
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('創建失敗')
        }
        this.$message.success('創建成功')
        this.getUserList()
      })
      this.addDialogVisible = false
    },
    async showDialogEdit(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查詢用戶信息失敗')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.clearValidate()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email, mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用戶信息失敗')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用戶信息成功')
      })
    },
    removeUser(id) {
      this.$confirm('此操作將永久刪除該用戶, 是否繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + id)
          .then(() => {
            this.$message.success('刪除成功')
            this.getUserList()
          })
          .catch(() => {
            this.$message.error('刪除失敗')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
