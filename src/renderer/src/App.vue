<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-14 14:55:34
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-20 09:27:32
-->
<template>
  <router-view />
  <cp-update-app />
</template>

<script>
import CpUpdateApp from '@renderer/components/update-app/index.vue'
export default {
  data() {
    return {
    };
  },
  components: {
    CpUpdateApp
  },
  mounted() {
    // console.log(this.$route.query)
  }
}
</script>

<style lang="less">
body{
  // margin: 0;
}
</style>
