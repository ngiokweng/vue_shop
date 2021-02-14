<template>
  <div>
    <!-- Breadcrumb 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>訂單管理</el-breadcrumb-item>
      <el-breadcrumb-item>訂單列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card 卡片 -->
    <el-card>
      <!-- 搜尋 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="請輸入內容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 訂單表單 -->
      <el-table :data="orders" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="訂單編號" prop="order_number"></el-table-column>
        <el-table-column label="訂單價格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否發貨">
          <template v-slot="scope">
            <span v-if="scope.row.is_send === '是'">是</span>
            <span type="danger" v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="下單時間">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的對話框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="adDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市區/縣" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="詳細地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >確 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流的對話框 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      orders: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: {
          required: true,
          message: '請選擇',
          trigger: 'blur'
        },
        address2: {
          required: true,
          message: '請輸入',
          trigger: 'blur'
        }
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  methods: {
    async getOrders() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('獲取訂單列表失敗')
      }
      this.orders = res.data.goods
      this.total = res.data.total
      console.log(this.orders)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrders()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrders()
    },
    showBox() {
      this.addressVisible = true
    },
    adDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        this.$message.error('獲取物流信息失敗')
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.progressVisible = true
    }
  },
  created() {
    this.getOrders()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
