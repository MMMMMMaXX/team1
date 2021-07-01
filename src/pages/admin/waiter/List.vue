<template>
  <!-- 员工管理页 -->
  <div class="waiter">
    <!-- 头部区域 -->
    <div class="header">
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addWaiter">添加</el-button>
      <!-- 用户名输入框 -->
      <el-input
        v-model="waiterName"
        placeholder="请输入用户名"
        clearable
        style="width: 240px"
      />
      <!-- 产品状态下拉框 -->
      <el-select v-model="waiterStatus" clearable placeholder="请选择状态">
        <el-option label="正常" value="正常" />
        <el-option label="禁用" value="禁用" />
      </el-select>

      <!-- 查询按钮 -->
      <el-button type="primary" @click="querywaiter">查询</el-button>
    </div>
    <!-- 表格内容展示区域 -->
    <div class="table_content">
      <!-- :data 整个表格的数据源  父容器的100%-->
      <el-table :data="waiterData" style="width: 100%">
        <!-- 编号 -->
        <el-table-column label="编号" align="center" type="index" prop="id" />
        <!-- 用户名 -->
        <el-table-column prop="username" label="用户名" align="center" />
        <!-- 姓名 -->
        <el-table-column prop="realname" label="姓名" align="center" />
        <!-- 手机号 -->
        <el-table-column prop="telephone" label="手机号" align="center" />

        <!-- 性别 -->
        <el-table-column prop="gender" label="性别" align="center" />
        <!-- 状态 -->
        <el-table-column prop="status" label="状态" align="center" />

        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editWaiter(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteWaiter(scope.row.id)"
            >删除</el-button>
            <el-button
              type="text"
              size="small"
              @click="toDetail(scope.row.id)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部分页区域 -->
    <div class="paginetion">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 模态框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @close="dialogClose"
    >
      <!-- 表单区域 -->
      <!-- 绑定的时我们最终要提交的表单对象model -->
      <!-- 表单验证的规则rule -->
      <!-- ref类似于id 最终通过ref找到这张表单 -->
      <el-form
        ref="waiter_form"
        :model="waiterForm"
        :rules="rules"
        label-width="80px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="waiterForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="waiterForm.realname" />
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model.number="waiterForm.telephone" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.number="waiterForm.password" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="waiterForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部按钮操作区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from '@/utils/request'
export default {
  data() {
    return {
      waiterForm: {
        username: '',
        realname: '',
        telephone: '',
        password: '',
        gender: '',
        roleId: 1
      },
      dialogVisible: false,
      dialogTitle: '添加员工信息',
      waiterName: '',
      waiterStatus: '',
      queryData: {},
      waiterData: [],
      // 当前 的页码
      currentPage: 1,
      // 每一页要展示的数据条数
      PageSize: 8,
      roleId: 1,
      total: 100,
      // 表单验证
      rules: {
        // 产品名称
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
      }
    }
  },
  computed: {},
  created() {
    this.getAllWaiterData()
  },
  mounted() {},
  methods: {
    toDetail(id) {
      this.$router.push({
        path: '/admin/waiter/Details',
        query: {
          id
        }
      })
    },
    // 表单提交  更西门或编辑产品信息
    submitForm() {
      this.$refs['waiter_form'].validate(async(valid) => {
        // 发送表单验证请求，提交表单对象，给用户一个成功的提示，刷新页面  调用关闭模态框的方法
        if (this.dialogTitle == '编辑员工信息') {
          const res = await post('/baseUser/saveOrUpdate', this.waiterForm)
          if (valid) {
            // 重新刷新页面数据
            this.$message({
              message: res.message,
              type: 'success'
            })
            // 重新刷新页面数据
            this.getAllWaiterData()
          } else {
            this.$message.error(res.message)
          }
        } else {
          const res = await post('/baseUser/addUserWidthRole', this.waiterForm)

          if (res.status == 200) {
            // 重新刷新页面数据
            this.$message({
              message: res.message,
              type: 'success'
            })
            // 重新刷新页面数据
            this.getAllWaiterData()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    dialogClose() {
      this.$refs['waiter_form'].resetFields()
      setTimeout(() => {
        this.dialogVisible = false
      }, 200)
    },
    handleCurrentChange(val) {
      // 将当前页数与分页插件动态点击的页数相绑定
      this.currentPage = val
      // console.log(`当前页: ${val}`);
      // 重新调用获取所有数据的方法
      this.getAllWaiterData()
    },
    handleSizeChange(val) {
      // 将每一页要展示的数据的条数进行一个更新
      this.PageSize = val
      // 将当前页数倒置到第一页
      this.currentPage = 1
      // console.log(`每页 ${val} 条`);
    },
    addWaiter() {
      this.waiterForm = {}
      this.waiterForm.roleId = 1
      // 设置模态框标题
      this.dialogTitle = '添加员工信息'
      // 模态框显示
      this.dialogVisible = true
    },
    querywaiter() {
      // 定义一个参数
      const data = {
        // 产品名称
        username: this.waiterName,
        // 产品状态
        status: this.waiterStatus
      }
      // 当某个属性没有值时，将其删掉，以防影响网络请求
      for (const key in data) {
        if (!data[key]) {
          delete data[key]
        }
      }
      // 将参数赋值给queryData
      this.queryData = data
      // 将页面强制回到第一页
      this.currentPage = 1
      // 重新加载页面数据
      this.getAllWaiterData()
    },
    editWaiter(row) {
      // 将当前点击的这一行的对象复制到表单对象里
      // 浅拷贝，只是赋值了对象的引用，对象的内存地址用到的还是用一个
      // 深拷贝  把值赋值过去，放到一个新的地址
      // 将对象里面的内容全部解析出来

      this.waiterForm = { ...row }

      // 设置模态框标题
      this.dialogTitle = '编辑员工信息'
      // 模态框显示
      this.dialogVisible = true
    },
    async deleteWaiter(id) {
      const res = await get('/baseUser/deleteById', { id })
      if (res.status == 200) {
        // 重新刷新页面数据
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面数据
        this.getAllWaiterData()
      } else {
        this.$message.error(res.message)
      }
    },
    // 获取用户信息
    async getAllWaiterData() {
      //  获取参数
      const data = {
        page: this.currentPage,
        pageSize: this.PageSize,
        roleId: this.roleId
      }

      // 通过对应的参数发送网络请求，获取产品数组数据
      const res = await get('/baseUser/pageQuery', {
        ...data,
        ...this.queryData
      })
      // console.log(res);
      // 将产品的数组赋值
      this.waiterData = res.data.list
      // 页面数据条数的赋值
      this.total = res.data.total
    }
  }
}
</script>
<style scoped>
.paginetion {
  position: fixed;
  bottom: 40px;
  right: 10px;
}
</style>
