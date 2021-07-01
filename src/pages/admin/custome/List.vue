<template>
  <!-- 顾客管理 -->
  <!-- 产品管理页 -->
  <div class="User">
    <!-- 头部区域 -->
    <div class="header">
      <!-- 添加按钮 -->
      <el-button type="primary" size="mini" @click="addUser">添加</el-button>
      <!--用户名称输入框 -->

      <el-input v-model="userName" style="width: 240px" placeholder="请输入用户名" clearable size="mini" />
      <!-- 用户状态下拉框 -->
      <el-select v-model="userStatus" clearable placeholder="请选择状态" size="mini">
        <el-option label="正常" value="正常" />
        <el-option label="禁用" value="禁用" />
      </el-select>
      <!-- 查询按钮 -->
      <el-button type="primary" size="mini" @click="queryUser">查询</el-button>
    </div>
    <!-- 表格内容展示区 -->
    <div class="table_content">
      <!-- :data 整个表格的数据源 -->
      <el-table
        :data="userData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        size="mini"
      >
        <!-- 序号 -->
        <el-table-column type="index" label="序号" align="center" />
        <!-- 编号 -->
        <el-table-column prop="id" label="编号" align="center" />
        <!-- 用户名 -->
        <el-table-column prop="username" label="用户名" align="center" />
        <!-- 姓名 -->
        <el-table-column prop="realname" label="姓名" align="center" />
        <!-- 手机号 -->
        <el-table-column prop="telephone" label="手机号" align="center" />
        <!-- 性别   v-if="userData.gender == 'female'"-->

        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.gender == 'female'" type="danger" color="white">{{ "♀" }}</el-tag>
            <el-tag v-else-if="scope.row.gender == 'male'" type="success" color="white">{{ "♂" }}</el-tag>
            <el-tag v-else type="info" color="white">{{ "暂无" }}</el-tag>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '正常'" type="success" color="white">{{ "正常" }}</el-tag>
            <el-tag v-else type="danger" color="white">{{ "禁用" }}</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color:green" @click="editUser(scope.row)">编辑</el-button>

            <el-button
              style="color:red"
              type="text"
              size="small"
              @click="clickDelete(scope.row.id)"
            >删除</el-button>
            <el-button
              style="color:blue"
              type="text"
              size="small"
              @click="clickDetail(scope.row.id)"
            >详情</el-button>
          </template>
        </el-table-column>
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
    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
      <!-- 表单区域 -->
      <!-- model 表单对象， 最终我们要提交的那个表单对象 -->
      <!-- :rules 表单验证的规则 -->
      <!-- ref 类比与 id 最终通过ref 找到这张表单 -->
      <el-form ref="User_form" :model="UserForm" :rules="rules" label-width="80px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="UserForm.username" />
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="UserForm.realname" />
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model.number="UserForm.telephone" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="UserForm.password" />
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别" prop="gender">
          <template>
            <el-radio v-model="UserForm.gender" label="male">男</el-radio>
            <el-radio v-model="UserForm.gender" label="female">女</el-radio>
          </template>
        </el-form-item>
      </el-form>

      <!-- 底部操作按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后，调用重置表单的方法 -->
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入axios
import { get, post } from '@/utils/request'
export default {
  data() {
    return {
      // 控制模态框的显示与隐藏
      dialogVisible: false,
      // 模态框的标题
      dialogTitle: '添加产品',

      // 表单对象
      UserForm: {
        // 用户名
        username: '',
        // 姓名
        realname: '',
        // 手机号
        telephone: '',
        // 密码
        password: '',
        // 性别
        gender: ''
      },
      // 表单验证规则
      rules: {
        // 用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        // 姓名
        realname: [{ required: true, message: '请选择姓名', trigger: 'blur' }],
        // 手机号
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        // 密码
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 用户数组 - 表格的数据源的数据
      userData: [],
      // 用户名
      userName: '',
      // 用户状态
      userStatus: '',
      // 当前的页码
      currentPage: 1,
      // 每页要展示的数据条数
      pageSize: 8,
      // 页面展示数据的总条数
      total: 10,
      // 页面展示用户类型为顾客
      roleId: 6,
      // 定义一个查询参数
      queryData: {}
    }
  },
  computed: {},
  // 生命周期钩子函数
  created() {
    // 自动的获取用户数据
    this.getAllUserData()
  },
  mounted() {},
  methods: {
    // 模糊查询，根据条件查询用户的信息
    queryUser() {
      // 定义参数
      const data = {
        // 用户名
        username: this.userName,
        // 用户状态
        status: this.userStatus
      }
      // 格式参数  当某个属性没有数值的时候，查询时进行删除
      for (const key in data) {
        if (!data[key]) {
          delete data[key]
        }
      }
      // 将参数 赋值给 queryData
      this.queryData = data
      // 将页数强制回到第一页
      this.currentPage = 1
      // 重新加载用户数据
      this.getAllUserData()
    },

    // 表格颜色分割
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    // 控制每页数据条数  val 每页要展示的数据条数
    handleSizeChange(val) {
      // 将每页要展示的数据的条数 进行一个更新
      this.pageSize = val
      // 将当前的页数 重置到第一页
      this.currentPage = 1
      // 重新调用获取所有用户数据的方法
      this.getAllUserData()
    },

    //  控制当前显示的页数 val 当前的页码
    handleCurrentChange(val) {
      // 将当前页数 与 分页插件动态点击控制的页数相绑定
      this.currentPage = val
      // 重新调用获取所有用户数据的方法
      this.getAllUserData()
    },

    //  添加用户
    addUser() {
      // 清空表单对象
      this.UserForm = {}
      // 设置模态框标题
      this.dialogTitle = '添加顾客信息'
      // /让模态框显示出来
      this.dialogVisible = true
    },
    // 关闭模态框  调用表单重置的方法
    dialogClose() {
      // 重置表单
      this.$refs['User_form'].resetFields()
      // 关闭模态框
      setTimeout(() => {
        this.dialogVisible = false
      }, 200)
    },
    // 表单提交 更新或编辑产品信息
    submitForm() {
      this.$refs['User_form'].validate(async(valid) => {
        if (valid) {
          if (this.dialogTitle === '添加顾客信息') {
            // 发送表单验证请求  提交表单对象
            const res = await post('/baseUser/addUserWidthRole', {
              ...this.UserForm,
              roleId: 6
            })
            if (res.status === 200) {
              // 给用户一个成功地提示
              alert('顾客信息添加成功!')
              // 刷新表单
              this.$refs['User_form'].resetFields()
              // 自动的获取用户数据
              this.getAllUserData()
              // 调用关闭模态框
              setTimeout(() => {
                this.dialogVisible = false
              }, 200)
            } else {
              alert('提交shibai!')
            }
          } else if (this.dialogTitle === '编辑顾客信息') {
            // 发送表单验证请求  提交表单对象
            const res = await post('/baseUser/saveOrUpdate ', this.UserForm)
            if (res.status === 200) {
              // 给用户一个成功地提示
              alert('顾客信息更新成功!')
              // 刷新表单
              this.$refs['User_form'].resetFields()
              // 自动的获取用户数据
              this.getAllUserData()
              // 调用关闭模态框
              setTimeout(() => {
                this.dialogVisible = false
              }, 200)
            } else {
              alert('提交失败！')
            }
          }
        } else {
          // alert("提交失败!!");
          return false
        }
      })
    },
    // 编辑用户信息
    editUser(row) {
      // 将当前点击的这一行的对象 赋值到表单对象里
      // 浅拷贝  赋值对象的引用  对象的内存地址  用的还是一个
      // this.ProductForm = row;
      // 深拷贝
      this.UserForm = { ...row }
      // 设置模态框标题
      this.dialogTitle = '编辑顾客信息'
      // /让模态框显示出来
      this.dialogVisible = true
    },
    // 删除用户信息
    async clickDelete(id) {
      console.log(id)
      // 发送上架请求
      const res = await get('/baseUser/deleteById', { id })
      // 给用户一个成功或失败的提示
      if (res.status === 200) {
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面
        this.getAllUserData()
      } else {
        this.$message.error(res.message)
      }
    },
    // 用户信息详情
    clickDetail(id) {
      this.$router.push({
        path: '/admin/custome/Details',
        //   获取到我的id
        // 通过query进行传参
        query: {
          id
        }
      })
      console.log(id)
    },

    // 分页获取所有用户的数据
    async getAllUserData() {
      // 获取参数
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize,
        roleId: this.roleId
      }
      // 通过对应的参数发送网络请求 获取用户数组数据
      const res = await get('/baseUser/pageQuery', {
        ...data,
        ...this.queryData
      })

      // 将data中的产品数组 进行赋值
      this.userData = res.data.list
      // 页面总数据条数 赋值
      this.total = res.data.total
      console.log(res)
    }
  }
}
</script>
<style scoped>
@import "./style.css";
/* 表格上边距 */

.table_content {
  padding-top: 10px;
}
/* 设置header的样式 */
.header {
  line-height: 40px;
}
/* 分页区域的样式 */
.paginetion {
  position: fixed;
  bottom: 30px;
  right: 10px;
}
/* // 表格每行颜色设置 */
</style>
