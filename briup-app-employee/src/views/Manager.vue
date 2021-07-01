<template>
  <div class="manager">
    <router-view></router-view>
    <!-- 用于接受管理页面，首页，订单页，我的页面 -->
    <van-tabbar v-model="active" active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item to="/manager/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/manager/order" icon="orders-o"
        >订单</van-tabbar-item
      >
      <van-tabbar-item to="/manager/money" icon="smile-o">收益</van-tabbar-item>
      <van-tabbar-item to="/manager/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style scoped>
</style>