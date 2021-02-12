<template>
  <div>
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分類</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分類</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        show-index
        index-text="#"
        :data="goodsCateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        border
        class="tree-table"
      >
        <template v-slot:isok="scope">
          <div>
            <i
              class="el-icon-success"
              v-if="!scope.row.cat_deleted"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </div>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level == 0">一級</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1"
            >二級</el-tag
          >
          <el-tag type="warning" v-else>三級</el-tag>
        </template>
        <template v-slot:opt>
          <el-button class="el-icon-edit" type="primary">編輯</el-button>
          <el-button class="el-icon-delete" type="danger">刪除</el-button>
        </template>
      </tree-table>
      <!-- 分頁 -->
      <el-pagination
        @current-change="currChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分類的對話框 -->
      <el-dialog
        title="添加分類"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分類名稱:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父級分類:">
            <el-cascader
              v-model="selectCate"
              :options="parentCateList"
              :props="cascaderProps"
              @change="selectChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate"
            >確 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      goodsCateList: [],
      total: 0,
      columns: [
        {
          label: '分類名稱',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '請輸入分類名稱', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      selectCate: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    async getGoodsCate() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取商品分類列表失敗')
      }
      this.goodsCateList = res.data.result
      this.total = res.data.total
      console.log(this.goodsCateList)
    },
    currChange(newC) {
      this.queryInfo.pagenum = newC
      this.getGoodsCate()
    },
    showAddCateDialog() {
      this.getParentCate()
      this.addCateDialogVisible = true
    },
    async getParentCate() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取父級分類失敗')
      }
      this.parentCateList = res.data
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加失敗')
        }
        this.$message.success('添加成功')
        this.getGoodsCate()
      })
      this.addCateDialogVisible = false
    },
    selectChange() {
      if (this.selectCate.length > 0) {
        this.addCateForm.cat_pid = this.selectCate[this.selectCate.length - 1]
        this.addCateForm.cat_level = this.selectCate.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectCate = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  },
  created() {
    this.getGoodsCate()
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
