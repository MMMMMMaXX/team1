<template>
  <!-- 产品管理页 -->
  <div class="product">
    <div class="header">
      <!-- 添加按钮 -->
      <el-button type="primary" round @click="addProduct">添加</el-button>
      <!-- 产品名称输入框 -->
      <el-input
        style="width: 200px"
        placeholder="请输入产品名称"
        v-model="productName"
        clearable
      >
      </el-input>
      <!-- 产品状态下拉框 -->
      <el-select v-model="productStatus" clearable placeholder="请选择状态">
        <el-option label="正常" value="正常"> </el-option>
        <el-option label="下架" value="下架"> </el-option>
      </el-select>
      <!-- 产品栏目下拉框 -->
      <el-select v-model="productCategory" clearable placeholder="请选择栏目">
        <el-option
          v-for="category in categoryArr.filter((item) => !item.parentId)"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        >
        </el-option>
      </el-select>
      <!-- 查询按钮 -->
      <el-button type="primary" round @click="queryProduct">查询</el-button>
    </div>
    <div class="table_content">
      <el-table :data="productionArr" style="width: 100%">
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="id" label="产品编号" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-image
              style="width: 40px; height: 40px"
              :src="scope.row.photo"
              :preview-src-list="[scope.row.photo]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" align="center">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
        </el-table-column>
        <el-table-column prop="category.name" label="所属栏目" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="editProduct(scope.row)" type="text" size="small"
              >编辑</el-button
            >

            <el-button
              @click="clickOffline(scope.row.id)"
              v-if="scope.row.status == '正常'"
              style="color: blue"
              type="text"
              size="small"
              >下架</el-button
            >
            <el-button
              @click="clickOnline(scope.row.id)"
              v-else
              style="color: red"
              type="text"
              size="small"
              >上架</el-button
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
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 模态框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @close="dialogClose"
    >
      <!-- 表单区域 -->
      <!-- ：model 表单对象 最终我们要提交的那个表单对象 -->
      <!-- ：rules 表单验证的规则 -->
      <!-- ref类比与id 最终通过ref找到这个表单 -->
      <el-form
        :model="productForm"
        :rules="rules"
        ref="product_form"
        label-width="80px"
      >
        <!-- 产品名称 -->
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <!-- 所属栏目 -->
        <el-form-item label="所属栏目" prop="productCategoryId">
          <el-select
            v-model="productForm.productCategoryId"
            clearable
            placeholder="请选择栏目"
          >
            <el-option
              v-for="category in categoryArr.filter((item) => !item.parentId)"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 价格 -->
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="productForm.price"></el-input>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" prop="photo">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="imageUrl" :src="productForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 产品描述 -->
        <el-form-item label="产品描述" prop="description">
          <el-input
            type="textarea"
            v-model="productForm.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//引入axios
import { get, post } from "@/utils/request";
//引入辅助函数
import { mapActions, mapState } from "vuex";
// 引入一个文件上传路径 和文件预览的路径
import { showFileURL, uploadFileURL } from "@/utils/config";
export default {
  data() {
    return {
      //上传文件的服务器地址
      uploadFileURL,
      //产品数组
      productionArr: [],
      productName: "",
      productStatus: "",
      productCategory: "",
      //当前的页码
      currentPage: 1,
      //每页要展示的数据条数
      pageSize: 8,
      //页码展示数据的总条数
      total: 10,
      //查询的参数
      queryData: {},
      //控制模态框的显示和隐藏
      dialogVisible: false,
      //模态框的标题
      dialogTitle: "标题",
      //表单对象
      productForm: {
        name: "",
        productCategoryId: "",
        price: "",
        photo: "",
        description: "",
      },
      //表单验证规则
      rules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        productCategoryId: [
          { required: true, message: "请选择产品栏目区域", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { type: "number", required: true, message: "价格为数字" },
        ],
        photo: [{ required: true, message: "请选择图片", trigger: "change" }],
      },
      imageUrl: "",
    };
  },
  computed: {
    ...mapState("category", ["categoryArr"]),
  },
  methods: {
    submitForm() {
      this.$refs["product_form"].validate(async (valid) => {
        if (valid) {
          //发生表单验证的请求 提交表单对象
          let res = await post("/product/saveOrUpdate", this.productForm);
          if (res.status == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            this.getAllProductData();
            this.dialogClose();
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 上传成功之后 调用的方法
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      //上传成功之后 更新imgUrl预览图片的路径
      this.productForm.photo = showFileURL + res.data.id;
    },
    // 上传之前要做的限制
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
    },
    //通过命名空间找到category对应的vuex模块 调用它模块里的方法
    //...mapActions('category模块方法名'，['对应的方法名'])
    ...mapActions("category", ["getAllCategoryData"]),
    // 添加产品
    addProduct() {
      this.productForm = {};
      this.imageUrl = "";
      this.dialogVisible = true;
      this.dialogTitle = "添加产品";
    },
    //编辑产品
    editProduct(row) {
      //将当前点击的这一行的对象 赋值到表单对象里
      // 浅拷贝 赋值对象的
      this.productForm = { ...row };
      // 预览图片 地址赋值
      this.imageUrl = this.productForm.photo;
      this.dialogVisible = true;
      this.dialogTitle = "编辑产品";
    },
    //根据条件模糊查询产品信息
    queryProduct() {
      let data = {
        name: this.productName,
        status: this.productStatus,
        productCategoryId: this.productCategory,
      };
      // 格式化参数 当某个参数没有值的时候 将其删除
      for (const key in data) {
        if (!data[key]) {
          delete data[key];
        }
      }
      this.queryData = data;
      this.currentPage = 1;
      this.getAllProductData();
    },
    //获取产品栏目的方法
    queryCategoryData() {
      let data = {
        page: 1,
        pageSize: 100,
      };
      this.getAllCategoryData(data);
    },
    //下架操作
    async clickOffline(id) {
      let res = await get("/product/offline", { id });
      if (res.status == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getAllProductData();
      } else {
        this.$message.error(res.message);
      }
    },
    //上架操作
    async clickOnline(id) {
      let res = await get("/product/online", { id });
      if (res.status == 200) {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getAllProductData();
      } else {
        this.$message.error(res.message);
      }
    },
    //获取产品数据
    async getAllProductData() {
      //获取参数
      let data = {
        page: this.currentPage,
        pageSize: this.pageSize,
      };
      //通过对应的参数发送网络请求
      let res = await get("/product/pageQuery", { ...data, ...this.queryData });
      this.productionArr = res.data.list;
      this.total = res.data.total;
    },

    handleSizeChange(val) {
      //将每页要展示的数据的条数
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllProductData();
    },
    handleCurrentChange(val) {
      //将当前页数 与分页插件动态点击控制的页数绑定
      this.currentPage = val;
      //重新调用获取所以产品数据的方法
      this.getAllProductData();
    },
    // 关闭模态框 调用表单重置的方法
    dialogClose() {
      this.productForm = {};
      this.imageUrl = "";
      this.$refs["product_form"].resetFields();
      // 关闭模态框
      setTimeout(() => {
        this.dialogVisible = false;
      }, 200);
    },
  },
  created() {
    //自动获取产品数据
    this.getAllProductData();
    //自动获取产品栏目数据
    this.queryCategoryData();
  },
  mounted() {},
};
</script>
<style scoped>
/* 分页区域的样式 */
.paginetion {
  position: fixed;
  bottom: 30px;
  right: 30px;
}
</style>