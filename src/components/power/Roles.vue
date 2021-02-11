<template>
  <div>
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Card 卡片 -->
    <el-card>
      <!-- 角色列表 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展開列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一級權限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三級權限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二級 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三級 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名稱" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editRoleDialog(scope.row)"
              >編輯</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
              >刪除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightsDialog(scope.row)"
            >
              分配權限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色的對話框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addRoleRules"
          ref="addFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名稱" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">確 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改角色的對話框 -->
      <el-dialog
        title="修改用戶"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item label="角色名稱">
            <el-input v-model="editForm.roleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editUserInfo">確定</el-button>
        </span>
      </el-dialog>
      <!-- 分配權限的對話框 -->
      <el-dialog
        title="分配權限"
        :visible.sync="setRightsDialogVisible"
        width="50%"
        @close="setRightsDialogClosed"
      >
        <el-tree
          :data="rightsList"
          :props="treetProps"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="allotRights">確定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '請輸入角色名', trigger: 'blur' },
          { min: 4, max: 10, message: '長度在4~10字符之間', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '請輸入角色描述', trigger: 'blur' }
        ]
      },
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: '請輸入角色名', trigger: 'blur' },
          { min: 4, max: 10, message: '長度在4~10字符之間', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '請輸入角色描述', trigger: 'blur' }
        ]
      },
      setRightsDialogVisible: false,
      rightsList: [],
      treetProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$messahe.error('獲取角色列表失敗')
      }
      this.rolesList = res.data
    },
    addRoleDialog() {
      this.addDialogVisible = true
    },
    async addRole() {
      this.$refs.addFormRef.validate(async (vali) => {
        if (!vali) {
          return false
        }
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('創建失敗')
        }
        this.$message.success('創建成功')
        this.getRolesList()
      })
      this.addDialogVisible = false
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editRoleDialog(roleInfo) {
      this.editDialogVisible = true
      this.editForm.roleName = roleInfo.roleName
      this.editForm.roleDesc = roleInfo.roleDesc
      this.editForm.id = roleInfo.id
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('編輯失敗')
        }
        this.$message.success('編輯成功')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    removeRole(id) {
      this.$confirm('此操作將永久刪除該角色, 是否繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete('roles/' + id)
            .then(() => {
              this.$message.success('刪除成功')
              this.getRolesList()
            })
            .catch(() => {
              this.$message.error('刪除失敗')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async removeRightsById(role, rightId) {
      const confirmRes = await this.$confirm(
        '此操作將永久刪除該權限, 是否繼續?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消刪除操作')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('刪除失敗')
      }
      // 1.role指向了一個地址，所以修改後也會同步
      // 2.這樣做可以避面整個頁面更新而導致expand展開列閉合
      role.children = res.data
    },
    async showSetRightsDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('獲取權限信息失敗')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
      console.log(role)
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    setRightsDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const ridsArr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const ridsStr = ridsArr.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: ridsStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配權限失敗')
      }
      this.$message.success('分配權限成功')
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid rgba(0, 0, 0, 0.15);
}
.bdbottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
