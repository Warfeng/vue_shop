<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click='showAddCateDialog'>添加分类</el-button>
        </el-col>
      </el-row>

<!--      分类 对话框 -->
      <el-dialog
        title='添加分类'
        :visible.sync='addDialogVisible'
        @close="addCateDialogClosed"
        width='50%'>
<!--        分类表单数据收集 -->
        <el-form
          ref='addCateFormRef'
          :model='addCateForm'
          :rules='addCateFormRules'
          label-width='100px'>
          <el-form-item prop='cat_name' label='分类名称'>
            <el-input v-model='addCateForm.cat_name'></el-input>
          </el-form-item>
          <el-form-item label='父级分类'>
            <el-cascader
              expend-trigger='hover'
              v-model="selectedKeys"
              :options="parentCateList"
              :props='cascaderProps'
              @change="parentCateChanged"
              clearable
              change-on-select></el-cascader>
          </el-form-item>
        </el-form>
        <span slot='footer' class='dialog-footer'>
          <el-button @click='addDialogVisible = false'>取 消</el-button>
          <el-button type='primary' @click='addCate'>确 定</el-button>
        </span>
      </el-dialog>

<!--    表格  -->
    <tree-table class='tab'
      :data='cateList'
      :columns='columns'
      :selection-type='false'
      :expand-type='false'
      show-index index-text='#'
      border
      :show-row-hover= false>
<!--      是否有效列 -->
      <template slot='isok' slot-scope='scope'>
        <i
          class='el-icon-success'
          v-if='scope.row.cat_deleted === false'
          style='color: lightgreen'></i>
        <i
          class='el-icon-error'
          v-else
          style='color: lightcoral'></i>
      </template>
<!--      排序列 -->
      <template slot='order' slot-scope='scope'>
        <el-tag size='mini' v-if='scope.row.cat_level===0'>一级</el-tag>
        <el-tag type='success' size='mini' v-else-if='scope.row.cat_level===1'>二级</el-tag>
        <el-tag type='warning' size='mini' v-else>三级</el-tag>
      </template>
      <template slot='opt' slot-scope='scope'>
        <el-button type='primary' icon='el-icon-edit' size='mini'>编辑</el-button>
        <el-button type='danger' icon='el-icon-delete' size='mini'>删除</el-button>
      </template>
    </tree-table>
<!--      分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据
      total: 0,
      // tree-tab 指定列
      columns: [
        { label: '分类名称', prop: 'cat_name'},
        // 模版列
        { label: '是否有效', type: 'template', template: 'isok'},
        { label: '排序', type: 'template', template: 'order'},
        { label: '操作', type: 'template', template: 'opt'}
      ],
      // 添加分类Dialog
      addDialogVisible: false,
      // 修改分类
      editDialogVisible: false,
      // 分类表单数据
      addCateForm: {
        cat_name: '',
        // 默认一级分类
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的表单效验
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入', trigger: 'blur'}
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定集联
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级id
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }

      this.$message.success(`${res.meta.msg}`)
      // 保存到data中
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类Dialog
    showAddCateDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2}})
      if(res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.$message.success('获取父级分类数据成功')
      this.parentCateList = res.data
    },
    // 选择项发生变化
    parentCateChanged() {
      // 如果 selectedKeys 的length 大于0
      if(this.selectedKeys.length > 0) {
        // 父级id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        // 当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类 确认事件
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if(res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }

        this.addDialogVisible = false
        this.$message.success('添加成功')
        await this.getCateList()

      })
    },
    // 监听对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style scoped>
.tab {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
