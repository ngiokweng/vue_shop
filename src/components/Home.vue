<template>
  <el-container>
    <!-- 頭部區域 -->
    <el-header>
      <div>
        <img src="../assets/homeLogo.jpg" />
        <span>電商後台管理系統</span>
      </div>
      <el-button type="info" @click="getout">退出</el-button>
    </el-header>
    <!-- 內容區域 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleButton" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#2d3d4d"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一級菜單 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一級菜單模板 -->
            <template slot="title">
              <!-- 圖標字體 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二級菜單 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActivePath('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 圖標字體 -->
                <i class="el-icon-menu"></i>
                <!-- 文字 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-box',
        101: 'el-icon-shopping-bag-1',
        102: 'el-icon-news',
        145: 'el-icon-data-line'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    getout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #3d4d5d;
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  color: #fff;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #2d3d4d;
  .el-menu {
    border-right: none;
  }
}
.toggleButton {
  background-color: #4a5060;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  font-weight: 600;
  cursor: pointer;
}
.el-main {
  background-color: #ddd;
}
</style>
