<template>
  <!-- 顾客详情页 -->

  <div>
    <!-- 头像信息 -->
    <div class="header">
      <template>
        <div class="demo-type">
          <el-avatar :size="80" :src="this.userDetail.userFace" @error="errorHandler">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
          </el-avatar>
        </div>
      </template>
      <span class="span_1" @click="editUserFace">修改头像</span>
    </div>

    <!-- 详细其他信息 -->
    <div class="foot">
      <!-- 登录用户 -->
      <div class="foot_1">
        <span>登录用户：</span>
        {{ this.userDetail.username }}
      </div>
      <!-- 用户姓名： -->
      <div class="foot_1">
        <span>用户姓名：</span>
        {{ this.userDetail.realname }}
      </div>
      <!-- 用户手机号： -->
      <div class="foot_1">
        <span>用户手机号：</span>
        {{ this.userDetail.telephone }}
      </div>
      <!-- 用户性别： -->
      <div class="foot_1">
        <span>用户性别：</span>

        <p v-if="this.userDetail.gender=='female'">
          女
          <span class="span_nv">♀</span>
        </p>
        <p v-else-if="this.userDetail.gender=='male'">
          男
          <span class="span_nan">♂</span>
        </p>
        <p v-else>暂无</p>
      </div>
      <!-- 用户角色： -->
      <div class="foot_1">
        <span>用户角色：</span>
        普通用户
      </div>
      <!-- 用户生日： -->
      <div class="foot_1">
        <span>用户生日：</span>
        <p v-if="this.userDetail.birth!=null">{{ this.userDetail.birth | fmtDate }}</p>
        <p v-else>暂无</p>
      </div>
      <!-- 注册时间 -->
      <div class="foot_1">
        <span>注册时间:</span>
        {{ this.userDetail.registerTime | fmtDate }}
      </div>
      <!-- 邮箱 -->
      <div class="foot_1">
        <span>邮箱:</span>
        <p v-if="this.userDetail.email!=''">{{ this.userDetail.email }}</p>
        <p v-else>暂无</p>
      </div>
      <!-- 注册状态 -->
      <div class="foot_1">
        <span>注册状态:</span>
        <el-tag v-if="this.userDetail.status=='正常'" type="success">正常</el-tag>
        <el-tag v-else-if="this.userDetail.status=='禁用'" type="danger">禁用</el-tag>
        <el-tag v-else type="info">暂无</el-tag>
      </div>
      <span class="span_1" @click="editUser">修改个人信息</span>
    </div>
    <!-- 模态框1 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
      <!-- 表单区域 -->
      <!-- model 表单对象， 最终我们要提交的那个表单对象 -->
      <!-- :rules 表单验证的规则 -->
      <!-- ref 类比与 id 最终通过ref 找到这张表单 -->
      <el-form ref="User_form" :model="UserForm" :rules="rules" label-width="80px">
        <!-- 登录用户 -->
        <el-form-item label="登录用户" prop="username">
          <el-input v-model="UserForm.username" />
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="UserForm.realname" />
          <!-- 性别 -->
          <el-form-item label="性别" prop="gender">
            <template>
              <el-radio v-model="UserForm.gender" label="male">男</el-radio>
              <el-radio v-model="UserForm.gender" label="female">女</el-radio>
            </template>
          </el-form-item>
        </el-form-item>
        <!-- 用户手机 -->
        <el-form-item label="用户手机" prop="telephone">
          <el-input v-model.number="UserForm.telephone" />
        </el-form-item>
        <!-- 用户邮箱 -->
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="UserForm.email" />
        </el-form-item>
        <!-- 出生日期 -->
        <el-form-item label="出生日期" prop="birth">
          <div class="block">
            <el-date-picker
              v-model="UserForm.birth"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            />
          </div>
        </el-form-item>
      </el-form>

      <!-- 底部操作按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后，调用重置表单的方法 -->
        <el-button v-buttonThrotFromMx="submitForm" type="primary">确定修改</el-button>
      </span>
    </el-dialog>
    <!-- 模态框2 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible2" @close="dialogClose2">
      <!-- 头像 -->
      <el-upload
        :action="uploadFileURL"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      >
        <img v-if="imageUrl" :src="this.userDetail.userFace" width="200px">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>

      <!-- 底部操作按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后，调用重置表单的方法 -->
        <el-button v-buttonThrotFromMx="submitForm2" type="primary">确定修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入axios
import { get, post } from '@/utils/request'

// 引入文件上传路径 和 文件预览的路径
import { showFileURL, uploadFileURL } from '@/utils/config'
export default {
  data() {
    return {
      // 图片预览的路径
      imageUrl: '',
      // 上传的服务器地址
      uploadFileURL,
      // 时间选择器的方法
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      // 头像
      userFace: '',
      // 从List.vue中获取到的id
      id: this.$route.query.id,
      // 用id 查询到的用户详情
      userDetail: {},
      // 模态框的主题
      dialogTitle: '123',
      // 控制模态框是否显示
      dialogVisible: false,
      // 控制模态框是否显示
      dialogVisible2: false,
      // 表单对象
      UserForm: {
        // 登录用户
        username: '',
        // 姓名
        realname: '',
        // 手机号
        telephone: '',

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
      }
    }
  },
  computed: {},
  // 生命周期钩子函数
  created() {
    this.getAllUserData()
  },
  mounted() {},
  methods: {
    // file 文件
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.userDetail.userFace = showFileURL + res.data.id
      // console.log(showFileURL + this.userDetail.id);
    },

    // 上传之前需要做的限制
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 3

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
    },
    // 表单提交2
    async submitForm2() {
      const res = await post('/baseUser/alterUserface ', {
        userface: this.userDetail.userFace,
        id: this.userDetail.id
      })
      console.log(this.userDetail.userFace)
      if (res.status === 200) {
        // 重新刷新页面数据
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面数据
        this.getAllUserData()
        this.dialogVisible2 = false
      } else {
        this.$message.error(res.message)
      }
    },

    // 表单1提交 更新或编辑产品信息
    submitForm() {
      this.$refs['User_form'].validate(async(valid) => {
        if (valid) {
          // 发送表单验证请求  提交表单对象
          // 将时间转为时间戳格式
          this.UserForm.birth = Date.parse(this.UserForm.birth)
          const res = await post('/baseUser/saveOrUpdate ', this.UserForm)
          if (res.status === 200) {
            // 给用户一个成功地提示
            alert('顾客信息修改成功!')
            // 刷新表单
            this.$refs['User_form'].resetFields()
            // 自动的获取用户数据
            this.getAllUserData()
            // 调用关闭模态框
            setTimeout(() => {
              this.dialogVisible = false
            }, 200)
          } else {
            alert('提交失败')
          }
        } else {
          return false
        }
      })
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
    dialogClose2() {
      // 关闭模态框
      setTimeout(() => {
        this.dialogVisible2 = false
      }, 200)
    },
    // 编辑个人信息
    editUser(row) {
      // 将当前点击的这一行的对象 赋值到表单对象里
      // 浅拷贝  赋值对象的引用  对象的内存地址  用的还是一个
      // this.ProductForm = row;
      // 深拷贝
      this.UserForm = { ...this.userDetail }
      // 设置模态框标题
      this.dialogTitle = '修改个人信息'
      // /让模态框显示出来
      this.dialogVisible = true
    },
    // 编辑
    editUserFace(row) {
      // 设置模态框标题
      this.dialogTitle = '修改头像'
      // /让模态框显示出来
      this.dialogVisible2 = true
    },
    // 默认头像显示
    errorHandler() {
      return true
    },
    // 通过id查询用户详情
    async getAllUserData() {
      const data = {
        id: this.id
      }
      // 通过对应的参数发送网络请求 获取用户数组数据
      const res = await get('/baseUser/findUserDetailsById', data)

      // 将data中的用户数组 进行赋值
      this.userDetail = res.data

      console.log(res, '1234')
    }
  }
}
</script>
<style >
.header {
  border-bottom: 2px solid rgb(211, 209, 209);
  padding: 20px;
}
.foot_1 {
  padding: 15px;
  font-size: 14px;
}
.foot_1 span {
  font-weight: bold;
  color: gray;
}
.foot_1 p {
  display: inline;
}
.demo-type {
  padding-left: 150px;
}
.span_1 {
  padding-left: 800px;
  font-size: 12px;
  color: #2cb5ac;
}
.span_nan {
  font-weight: bold;
  color: rgb(145, 250, 40) !important;
}
.span_nv {
  color: red !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
