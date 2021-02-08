<template>
  <div>
    <el-button type="info" @click="getout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    getout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>>
