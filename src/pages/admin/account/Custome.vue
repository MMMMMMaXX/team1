<template>
  <!-- 顾客账户管理 -->
  <div class="customeAccount">
    <div class="header">
      <el-date-picker
        v-model="timeValue"
        clearable
        :picker-options="pickerOptions"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        align="right"
      />
      <el-select v-model="customeType" clearable placeholder="请选择类型">
        <el-option label="充值" value="充值" />
        <el-option label="消费" value="消费" />
      </el-select>
      <el-select v-model="customeStatus" clearable placeholder="请选择状态">
        <el-option label="正常" value="正常" />
        <el-option label="未审核" value="未审核" />
      </el-select>
      <el-select v-model="customeBianhao" clearable placeholder="请选择顾客编号">
        <el-option
          v-for="category in customes"
          :key="category.id"
          :label="category.userId"
          :value="category.id"
        />
      </el-select>
      <!-- 查询按钮 -->
      <el-button v-buttonThrotFromMx="queryCustome" type="primary">查询</el-button>
    </div>
    <!-- 表格内容展示区 -->
    <div class="table_content">
      <!-- :data 整个表格的数据源 -->
      <el-table :data="customeData" style="width: 100%">
        <!-- 顾客编号 -->
        <el-table-column prop="id" label="顾客编号" align="center" />
        <!-- 交易金额 -->
        <el-table-column prop="transferMoney" label="交易金额" align="center" />
        <!-- 交易时间 -->
        <el-table-column label="交易时间" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">{{ scope.row.transferTime | fmtDate }}</template>
        </el-table-column>
        <!-- 交易类型 -->
        <el-table-column prop="type" label="交易类型" align="center" />
        <!-- 状态 -->
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              v-show="scope.row.status == '正常'"
              style="width: 60px; height: 30px"
              type="success"
            >{{ scope.row.status }}</el-tag>
            <el-tag
              v-show="scope.row.status == '未审核'"
              style="width: 60px; height: 30px"
              type="danger"
            >{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <!-- 描述 -->
        <el-table-column prop="description" label="描述" align="center" />
      </el-table>
    </div>
    <!-- 底部分页区域 -->
    <div class="paginetion">
      <!-- 分页组件 -->
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// 引入axios
import { get } from '@/utils/request'
// 引入vuex的辅助函数
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      // 日期间隔的快捷选择
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 顾客数组 - 表格的数据源的数据
      customeData: [],
      // 查询的参数
      queryData: '',
      // 当前的页码
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 8,
      // 页面展示数据的总条数
      total: 10,
      // 起至日期
      timeValue: '',
      // 顾客状态
      customeStatus: '',
      // 顾客类型
      customeType: '',
      // 顾客编号
      customeBianhao: ''
      /*       // 角色Id
      roleId: "", */
    }
  },
  computed: {
    // 使用辅助函数
    ...mapState('custome', ['customes'])
  },
  methods: {
    // 控制每页数据条数
    handleSizeChange(val) {
      // 将每页要展示的数据的条数 进行一个更新
      this.pageSize = val
      // 将当前的页数 重置到第一页
      this.currentPage = 1
      // 重新调用获取所有产品数据的方法
      this.getAllCustomeData()
    },
    // 控制当前显示的页数
    handleCurrentChange(val) {
      // 将当前页数 与 分页插件动态点击控制的页数相绑定
      this.currentPage = val
      // 重新调用获取所有产品数据的方法
      this.getAllCustomeData()
    },
    ...mapActions('custome', ['pageQueryCustome']),
    // 查询所有顾客的信息
    async getAllCustomeData() {
      // 获取参数
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      // queryData和data结合成一个对象
      // 通过对应的参数发送网络请求 获取顾客数组数据
      const res = await get('/account/pageQueryCustomerAccount', {
        ...data,
        ...this.queryData
      })
      // 将data中的顾客数组 进行赋值
      this.customeData = res.data.list
      // 页面总数据条数 赋值
      this.total = res.data.total
    },
    // 根据条件模糊查询顾客信息
    queryCustome() {
      console.log('查询')
      // 定义参数
      const data = {
        // 顾客类型
        type: this.customeType,
        // 顾客状态
        status: this.customeStatus,
        // 顾客编号
        userId: this.customeBianhao,
        // 开始时间
        beginTime: Date.parse(this.timeValue[0]),
        endTime: Date.parse(this.timeValue[1])
      }

      // 格式化参数，当某个属性没有值的时候，将其删除，以防影响网络请求的操作
      for (const key in data) {
        // 如果属性值为空
        if (!data[key]) {
          delete data[key]
        }
      }
      console.log(data)
      this.queryData = data
      // 将页面强制回到第一页
      this.currentPage = 1
      // 重新加载页面
      this.getAllCustomeData()
      this.timeValue = ''
    },
    // 查询所有栏目的数据
    queryCategoryData() {
      const data = {
        page: 1,
        pageSize: 100,
        roleId: 6
      }
      // 调用vuex定义好的方法
      this.pageQueryCustome(data)
    }
  },
  created() {
    // 自动获取全部数据
    this.getAllCustomeData()
    // 自动获取栏目数据
    this.queryCategoryData()
  },
  mounted() {}
}
</script>
<style scoped>
</style>
