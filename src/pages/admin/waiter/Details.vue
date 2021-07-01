<template>
  <div>
    <div>
      <el-image :src="waiterData.userFace" style="width: 100px; height: 100px" />
      <el-button type="text" size="small" @click="editUserface(waiterData.userFace)">修改头像</el-button>
    </div>
    <div>
      <p v-if="waiterData.username">登录用户 &nbsp;&nbsp; {{ waiterData.username }}</p>
      <p v-else>登录用户 &nbsp;&nbsp;暂无</p>
      <p v-if="waiterData.realname">用户姓名 &nbsp;&nbsp;{{ waiterData.realname }}</p>
      <p v-else>用户姓名 &nbsp;&nbsp;暂无</p>
      <p v-if="waiterData.telephone">用户手机 &nbsp;&nbsp;{{ waiterData.telephone }}</p>
      <p v-else>用户手机 暂无</p>
      <p v-if="waiterData.gender">
        <span v-if="waiterData.gender == 'female' || waiterData.gender == '女'">用户性别 &nbsp;&nbsp; 女</span>
        <span v-if="waiterData.gender == 'male' || waiterData.gender == '男'">用户性别 &nbsp;&nbsp; 男</span>
      </p>
      <p v-else>用户性别 &nbsp;&nbsp;暂无</p>

      <p v-if="waiterData.roles.name">用户角色 &nbsp;&nbsp;{{ waiterData.roles.name }}</p>
      <p v-else>用户角色 &nbsp;&nbsp; 暂无</p>
      <p v-if="waiterData.birth">用户生日 &nbsp;&nbsp;{{ waiterData.birth | fmtDate1 }}</p>
      <p v-else>用户生日 &nbsp;&nbsp;暂无</p>
      <p v-if="waiterData.registerTime">注册时间 &nbsp;&nbsp;{{ waiterData.registerTime | fmtDate1 }}</p>
      <p v-else>注册时间 &nbsp;&nbsp;暂无</p>
      <p v-if="waiterData.email">邮箱 &nbsp;&nbsp;{{ waiterData.email }}</p>
      <p v-else>邮箱 &nbsp;&nbsp; 暂无</p>
      <p v-if="waiterData.status">用户状态 &nbsp;&nbsp;{{ waiterData.status }}</p>
      <p v-else>用户状态 &nbsp;&nbsp;暂无</p>
    </div>
    <div>
      <el-button v-buttonThrotFromMx="()=>editUser(waiterData)" type="text" size="small">修改个人信息</el-button>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
      <!--  头像-->

      <el-upload
        class="avatar-uploader"
        :action="uploadFileURL"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeUpload"
      >
        <img v-if="imageUrl" :src="waiterData.userFace" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>

      <!-- 底部按钮操作区域 -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后 -->
        <el-button v-buttonThrotFromMx="submitForm" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitlee" :visible.sync="Visible" @close="dialogClose">
      <!-- 表单区域 -->
      <!-- 绑定的时我们最终要提交的表单对象model -->
      <!-- 表单验证的规则rule -->
      <!-- ref类似于id 最终通过ref找到这张表单 -->
      <el-form ref="waiter_detail" :model="waiterData" :rules="rules" label-width="80px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="waiterData.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="waiterData.realname" />
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model.number="waiterData.telephone" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="waiterData.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="waiterData.email" />
        </el-form-item>
        <el-form-item prop="birth" label="出生日期">
          <el-date-picker
            v-model="waiterData.birth"
            type="date"
            placeholder="出生日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <!-- 底部按钮操作区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <!-- 提交表单后 -->
        <el-button v-buttonThrotFromMx="submitForm1" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from '@/utils/request'
import { showFileURL, uploadFileURL } from '@/utils/config'
export default {
  data() {
    return {
      birth1: '',
      dialogTitlee: '更改个人信息',
      Visible: false,
      uploadFileURL,
      waiterData: {},
      dialogVisible: false,
      dialogTitle: '更改头像',
      imageUrl: '',
      waiterurl: '',
      rules: {
        // 产品名称
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.getWaiterData()
    // 2.调用通过用户id获取用户详情的方法
  },
  mounted() {},
  methods: {
    async submitForm1() {
      this.$refs['waiter_detail'].validate(async(valid) => {
        if (this.waiterData.birth !== this.birth1) {
          this.waiterData.birth = Date.parse(this.waiterData.birth)
        }

        // 发送表单验证请求，提交表单对象，给用户一个成功的提示，刷新页面  调用关闭模态框的方法
        const res = await post('/baseUser/saveOrUpdate', this.waiterData)
        if (valid) {
          // 重新刷新页面数据
          this.$message({
            message: res.message,
            type: 'success'
          })
          // 重新刷新页面数据
          this.getWaiterData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    async submitForm() {
      const res = await post('/baseUser/alterUserface', {
        userface: this.waiterData.userFace,
        id: this.waiterData.id
      })
      if (res.status === 200) {
        // 重新刷新页面数据
        this.$message({
          message: res.message,
          type: 'success'
        })
        // 重新刷新页面数据
        this.getWaiterData()
        this.dialogVisible = false
      } else {
        this.$message.error(res.message)
      }
    },
    dialogClose() {
      setTimeout(() => {
        this.dialogVisible = false
      }, 200)
      setTimeout(() => {
        this.Visible = false
      }, 200)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // 上传成功之后，更新imgurl预览图片的路径
      this.waiterData.userFace = showFileURL + res.data.id
    },
    // 上传之前的限制
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3

      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
    },
    editUserface() {
      this.dialogVisible = true
    },
    editUser() {
      this.Visible = true
    },
    async getWaiterData() {
      const id = this.$route.query.id
      const res = await get('/baseUser/findUserDetailsById', { id })
      this.waiterData = res.data
      this.birth1 = res.data.birth
    }
    // this.$route.query.id
    // 1.通过用户id 查询用户详情
  }
}
</script>
<style scoped>
</style>
