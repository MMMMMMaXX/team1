<template>
  <!-- 订单详情页 -->
  <div>
    <div class="header">
      <el-button
        class="el-icon-caret-left"
        round
        @click="back"
        style="width: 120px"
        >返 回</el-button
      >
    </div>
    <div class="table_content">
      <el-table :data="orderData.orderLines" style="width: 100%" stripe>
        <el-table-column prop="id" label="订单顶编号" align="center">
        </el-table-column>
        <el-table-column prop="productId" label="产品编号" align="center">
        </el-table-column>
        <el-table-column prop="product.name" label="产品" align="center">
        </el-table-column>
        <el-table-column prop="product.photo" label="产品图片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 40px; height: 40px"
              :src="scope.row.product.photo"
              :preview-src-list="[scope.row.product.photo]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="center">
          <template slot-scope="scope">
            ￥<span style="color: #e65d6e; font-size: 18px"
              >{{ scope.row.price }} </span
            >元
          </template>
        </el-table-column>
        <el-table-column prop="number" label="数量" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="card_content">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>订单基本信息</span>
        </div>
        <div class="text item">
          订单编号：{{ orderData.id }}
          <br />
          <br />
          订单金额：￥<span style="color: #e65d6e; font-size: 18px">
            {{ orderData.total }}</span
          >元
          <br />
          <br />
          <span
            >下单时间：{{
              moment(orderData.orderTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span
          >
          <br />
          <br />
          订单状态：{{ orderData.status }}
        </div>
      </el-card>
      <el-card
        class="box-card"
        v-if="orderData.employee != null"
        shadow="hover"
      >
        <div slot="header" class="clearfix">
          <span>接单者信息</span>
        </div>
        <div class="text item">
          接单者：{{ orderData.employee.realname }}
          <br />
          <br />
          接单者手机号：{{ orderData.employee.telephone }}
        </div>
      </el-card>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>下单者信息</span>
        </div>
        <div class="text item">
          下单者：{{ orderData.customer.realname }}
          <br />
          <br />
          下单者手机号：{{ orderData.customer.telephone }}
          <br />
          <br />
        </div>
      </el-card>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>订单基本信息</span>
        </div>
        <div class="text item">
          雇主：{{ orderData.address.username }}
          <br />
          <br />
          雇主手机号：{{ orderData.address.telephone }}
          <br />
          <br />
          服务地址：{{ orderData.address.province }}{{ orderData.address.area }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/utils/request";
let moment = require("moment");
export default {
  data() {
    return {
      moment,
      orderData: [],
    };
  },
  computed: {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    async getOrderDataById() {
      //获取参数
      let data = {
        id: this.$route.query.id,
      };
      //通过对应的参数发送网络请求
      let res = await get("/order/findById", data);
      this.orderData = res.data;
      console.log(res);
    },
  },
  created() {
    this.getOrderDataById();
  },
  mounted() {},
};
</script>
<style scoped>
.header {
  margin-left: 12px;
}
.box-card {
  display: inline-block;
  padding: 4px;
  margin: 20px;
  width: 400px;
  height: 250px;
}
</style>