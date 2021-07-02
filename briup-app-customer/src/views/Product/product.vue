<template>
  <div>
    <div class="header">
      <van-sticky>
        <van-nav-bar
          title="服务项目"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />
      </van-sticky>
    </div>
    <div class="contect_product">
      <!-- //左边导航栏 -->
      <div class="leftSideBar">
        <van-sidebar v-model="activeKey" @change="onChange">
          <van-sidebar-item
            v-for="category in categroyData"
            :key="category.id"
            :title="category.name"
          />
        </van-sidebar>
      </div>
      <!-- 右边产品展示栏 -->
      <div class="rightProduct">
        <van-card
          v-for="product in productData"
          :key="product.id"
          :price="product.price + '.00'"
          :desc="product.description"
          :title="product.name"
          :thumb="product.photo"
        >
          <template #footer>
            <van-stepper
              default-value="0"
              :min="0"
              v-model="product.number"
              @change="numberChangeHandler(product)"
            />
          </template>
        </van-card>
      </div>
    </div>
    <div class="submitBar"></div>
  </div>
</template>

<script>
//引入
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      //根据首页点击的索引，确定侧边菜单栏 默认被点击的是哪一个
      activeKey: this.$route.query.key,
      //首页点击跳转到产品页面时 传递的id
      categoryId: this.$route.query.id,
    };
  },
  methods: {
    ...mapActions("category", ["getAllCategoryData"]),
    ...mapActions("product", ["getAllProductData"]),
    ...mapMutations("shopcart", ["addShopcart", "clearShopcart"]),
    //获取栏目数据
    queryCategory() {
      let data = {
        page: 1,
        pageSize: 100,
      };
      this.getAllCategoryData(data);
    },
    //获取产品数据
    queryProduct() {
      let data = {
        page: 1,
        pageSize: 100,
        productCategoryId: this.categoryId,
      };
      this.getAllProductData(data);
    },
    //根据左边导航栏 获取不同数据
    onChange(index) {
      this.categoryId = this.categroyData[index].id;
      this.queryProduct();
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    //根据监听步进器获取产品信息
    numberChangeHandler(product) {
      //定义一个产品参数
      let orderLine = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        number: product.number,
      };
      //调用添加购物车的方法
      this.addShopcart(orderLine);
    },
  },
  computed: {
    ...mapState("category", ["categroyData"]),
    ...mapState("product", ["productData"]),
    ...mapGetters("shopcart", ["total"]),
  },
  created() {
    this.queryCategory();
    this.queryProduct();
  },
};
</script>

<style scoped>
/* 产品展示的区域 */
.contect_product {
  display: flex;
}

.van-sidebar {
  width: 120px;
  text-align: center;
}
.contect_product .rightProduct {
  flex: 1;
}
</style>