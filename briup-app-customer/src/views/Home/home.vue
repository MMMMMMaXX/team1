<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <div class="header">
      <van-sticky><van-nav-bar class="title" title="家政" /></van-sticky>
    </div>

    <div class="content">
      <!-- 菜单栏 -->
      <div class="menu">
        <van-grid :column-num="3" :gutter="10">
          <van-grid-item
            v-for="category in categroyData"
            :key="category.id"
            :icon="category.icon"
            :text="category.name"
          />
        </van-grid>
      </div>
      <!-- 轮播图 -->
      <div class="swipe">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="swipe in swipeData" :key="swipe.id"
            ><img :src="swipe.url"
          /></van-swipe-item>
        </van-swipe>
      </div>
      <!-- 底部产品展示区 -->
      <div class="product">
        <van-card
          v-for="product in productData"
          :key="product.id"
          :price="product.price + '.00'"
          :desc="product.description"
          :title="product.name"
          :thumb="product.photo"
        />
      </div>
      <div style="height: 80px"></div>
    </div>
  </div>
</template>

<script>
//引入axios
import { get } from "@/http/axios";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      swipeData: [],
    };
  },
  computed: {
    ...mapState("category", ["categroyData"]),
    ...mapState("product", ["productData"]),
  },
  methods: {
    ...mapActions("category", ["getAllCategoryData"]),
    ...mapActions("product", ["getAllProductData"]),
    queryCategory() {
      let data = {
        page: 1,
        pageSize: 6,
      };
      this.getAllCategoryData(data);
    },
    queryProduct() {
      let data = {
        page: 1,
        pageSize: 8,
      };
      this.getAllProductData(data);
    },
    //获取所有轮播图的数据
    async getAllSwipeData() {
      let res = await get("/carousel/query", { status: "正常" });
      this.swipeData = res.data.data;
    },
  },
  created() {
    this.getAllSwipeData();
    this.queryCategory();
    this.queryProduct();
  },
};
</script>

<style scoped>
.title {
  height: 120px;
  background-image: linear-gradient(55deg, #7579ff, #bf73ff);
}
.content {
  height: 100%;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
}
.swipe {
  margin: 10px;
  border-radius: 10px;
}
.my-swip {
  border-radius: 10px;
  width: 100%;
  height: 150px;
}
.my-swipe img {
  border-radius: 10px;
  width: 100%;
  height: 150px;
}
</style>