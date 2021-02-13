<template>
  <div>
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分類參數</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card 卡片 -->
    <el-card>
      <el-alert
        title="注意：只允許為第三級分類設置參數"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>選擇商品分類：</span>
          <el-cascader
            v-model="selectedCate"
            :options="goodsCateList"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="動態參數" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="addDIalogVisible = true"
            >添加參數</el-button
          >
          <!-- 動態參數表格 -->
          <el-table :data="manyDataTable" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="參數名稱"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  @click="editDialog(scope.row)"
                  >編輯</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  @click="removeParams(scope.row)"
                  >刪除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="靜態屬性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="addDIalogVisible = true"
            >添加屬性</el-button
          >
          <!-- 靜態屬性表格 -->
          <el-table :data="onlyDataTable" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="屬性名稱"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  @click="editDialog(scope.row)"
                  >編輯</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  @click="removeParams(scope.row)"
                  >刪除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加參數/屬性的對話框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDIalogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDIalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">確 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改參數/屬性的對話框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDIalogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDIalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsCateList: [],
      selectedCate: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 標籤頁選中的那一項
      activeName: 'many',
      manyDataTable: [],
      onlyDataTable: [],
      addDIalogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '請輸入',
            trigger: 'blur'
          }
        ]
      },
      editDIalogVisible: false,
      editForm: {
        attr_name: '',
        attrId: ''
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '請輸入',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getGoodsCate() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('獲取商品列表失敗')
      }
      this.goodsCateList = res.data
    },
    handleChange() {
      this.getParamsList()
    },
    handleTabClick() {
      this.getParamsList()
    },
    async getParamsList() {
      if (this.selectedCate.length !== 3) {
        this.selectedCate = []
        this.manyDataTable = []
        this.onlyDataTable = []
        return false
      }
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('獲取參數列表失敗')
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 防止數據重合的問題
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      // 判斷是動態參數or靜態屬性
      if (this.activeName === 'many') {
        this.manyDataTable = res.data
      } else {
        this.onlyDataTable = res.data
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失敗')
        }
        this.$message.success('添加成功')
        this.getParamsList()
        this.addDIalogVisible = false
      })
    },
    async editDialog(info) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${info.attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('獲取參數失敗')
      }
      this.editForm.attr_name = res.data.attr_name
      this.editForm.attrId = res.data.attr_id
      this.editDIalogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editForm.attrId}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改失敗')
        }
        this.$message.success('修改成功')
        this.getParamsList()
        this.editDIalogVisible = false
      })
    },
    async removeParams(info) {
      const confirmStr = await this.$confirm(
        '此操作將永遠刪除該參數，是否繼續?',
        '提示',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmStr === 'cancel') {
        return this.$message.info('已取消操作')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${info.attr_id}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('刪除失敗')
      }
      this.$message.success('刪除成功')
      this.getParamsList()
    },
    async handleInputConfirm(row) {
      // 判斷用戶輸入的是否無用東西(如只有空格)，如是則直接返回
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      // 如有用，則進行後面的處理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改失敗')
      }
      this.$message.success('修改成功')
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    showInput(row) {
      row.inputVisible = true
      // $nextTick:防止input還未被渲染時就去自動獲取焦點
      this.$nextTick((_) => {
        // 讓input自動獲取焦點
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isBtnDisable() {
      if (this.selectedCate.length !== 3) {
        return true
      }
      return false
    },
    getCateId() {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[this.selectedCate.length - 1]
      }
      return this.$message.error('getCateId失敗')
    },
    titleText() {
      if (this.activeName === 'many') {
        return '動態參數'
      } else {
        return '靜態屬性'
      }
    }
  },
  created() {
    this.getGoodsCate()
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
