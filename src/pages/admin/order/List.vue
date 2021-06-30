<template>
  <!-- 订单管理页 -->
  <div>
    <div class="header">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="所有订单" name="first"></el-tab-pane>
        <el-tab-pane label="待支付" name="second"></el-tab-pane>
        <el-tab-pane label="待派单" name="third"></el-tab-pane>
        <el-tab-pane label="待接单" name="fourth"></el-tab-pane>
        <el-tab-pane label="待服务" name="fifth"></el-tab-pane>
        <el-tab-pane label="待确定" name="sixth"></el-tab-pane>
        <el-tab-pane label="已完成" name="seventh"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="table_content">
      <el-table :data="orderArr" style="width: 100%" stripe>
        <el-table-column prop="id" label="订单编号" align="center">
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间" align="center">
          <template slot-scope="scope">
            <span>{{
              moment(scope.row.orderTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总价" align="center">
          <template slot-scope="scope">
            ￥<span style="color: #e65d6e; font-size: 18px"
              >{{ scope.row.total }} </span
            >元
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '待派单'" type="danger">{{
              scope.row.status
            }}</el-tag>
            <el-tag v-else-if="scope.row.status == '待接单'" type="warning">{{
              scope.row.status
            }}</el-tag>
            <el-tag v-else-if="scope.row.status == '待服务'" type="success">{{
              scope.row.status
            }}</el-tag>
            <el-tag v-else-if="scope.row.status == '已完成'" type="info">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerId" label="顾客ID" align="center">
        </el-table-column>
        <el-table-column
          v-if="tabLabel != '待支付' && tabLabel != '待派单'"
          prop="employeeId"
          label="员工ID"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              round
              @click="moreOrderMsg(scope.row)"
              style="color: #606266"
              size="mini"
              >详情</el-button
            >
            <el-button
              round
              @click="cancelOrder(scope.row.id)"
              v-if="scope.row.status == '待接单'"
              type="warning"
              size="mini"
              >取消派单</el-button
            >
            <el-button
              round
              @click="clickOrder(scope.row.id)"
              v-if="scope.row.status == '待派单'"
              type="danger"
              size="mini"
              >派单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginetion">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 模态框 -->
    <el-dialog title="派单" :visible.sync="dialogVisible">
      <el-radio
        v-for="(item, index) in employeeArr"
        v-model="waiterId"
        :label="item.id"
        :key="index"
      >
        {{ item.username }} {{ item.realname }}
      </el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from "@/utils/request";
let moment = require("moment");
export default {
  data() {
    return {
//测试
      moment,
      orderArr: [],
      activeName: "first",
      //当前的页码
      currentPage: 1,
      queryData: {},
      //每页要展示的数据条数
      pageSize: 10,
      //页码展示数据的总条数
      total: 10,
      tabLabel: "",
      dialogVisible: false,
      employeeArr: [],
      waiterId: "",
      orderId: "",
    };
  },
  computed: {},
  methods: {
    //提交派单 通过get方式请求接口 实现派单
    async submitOrder() {
      let data = {
        waiterId: this.waiterId,
        orderId: this.orderId,
      };
      //通过对应的参数发送网络请求
      let res = await get("/order/sendOrder", { ...data });
      this.getAllOrderData();
      this.waiterId = "";
      this.dialogVisible = false;
    },
    //点击了派单按钮后
    clickOrder(id) {
      this.orderId = id;
      this.dialogVisible = true;
    },
    //取消派单
    async cancelOrder(id) {
      let data = {
        orderId: id,
      };
      //通过对应的参数发送网络请求
      let res = await get("/order/cancelSendOrder", { ...data });
      this.getAllOrderData();
    },
    //选择分页的大小后
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllOrderData();
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllOrderData();
    },
    //顶部导航栏 点击其中一个导航项目后
    handleClick(tab, event) {
      this.tabLabel = tab.label;
      this.queryData = { status: tab.label };
      this.currentPage = 1;
      this.getAllOrderData();
    },
    //通过get方法获取全部的订单信息
    async getAllOrderData() {
      //获取参数
      let data = {
        page: this.currentPage,
        pageSize: this.pageSize,
      };
      //通过对应的参数发送网络请求
      let res;
      if (this.queryData.status == "所有订单") {
        res = await get("/order/pageQuery", { ...data });
      } else {
        res = await get("/order/pageQuery", { ...data, ...this.queryData });
      }
      this.orderArr = res.data.list;
      this.total = res.data.total;
    },
    //通过get方法 获取全部的员工信息
    async getEmployeeData() {
      //获取参数
      let data = {
        page: 1,
        pageSize: 100,
        roleId: 1,
      };
      //通过对应的参数发送网络请求
      let res = await get("/baseUser/pageQuery", { ...data });
      this.employeeArr = res.data.list;
      console.log(this.employeeArr);
    },
  },
  created() {
    this.getAllOrderData();
    this.getEmployeeData();
  },
  mounted() {},
};
</script>
<style scoped>
.paginetion {
  position: fixed;
  bottom: 30px;
  right: 30px;
}
</style>