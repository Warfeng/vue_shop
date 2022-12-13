## shop_demo
vue2的后台管理项目
使用eslint、router、element-ui、axios
## 后台数据地址
axios.defaults.baseURL = https://lianghj.top:8888/api/private/v1/

## p11 登录组件
-- 创建一个分支
git checkout -b login
-- 再该分支下写登录组件
使用element-ui
-- 在根目录下创建路由
创建路由、路由导航守卫
-- 使用element-ui
按需引入需要的组件

## p41 用户列表的开发

## p67 权限管理开发
** 创建这个分支 git checkout -b rights
** 提交到github git push -u origin rights
** 创建power/Rights.vue 文件
** 使用面包屑 与 卡片
** 卡片视图使用table tag美化权限等级

-- 创建power/Roles.vue
get请求 'roles' 获取rolesList


## p97 商品管理开发
** 创建分支 goods_cate
** 首次推送到github git push -u origin goods_cate
** 在src/goods/Cate.vue 创建
** 在路由模块中引入
** Cate.vue 基本结构
-- 面包屑、卡片、表格、分页
-- created 钩子中发get请求
携带queryInfo参数
将数据保存到data中

** 引入table 插件 **
-- yarn add vue-table-with-tree-table
在main文件中引入这个插件，并挂载
根据文档描述添加需要的配置
data 中 columns 配置自定义列

添加分页区 el-pagination

添加分类 Dialog 与 Dialog页面表单的设计
点击添加按钮发送请求获取二级数据，保存到data
显示Dialog 将分类数据渲染到Cascader 多级联表

编辑 分类名称
this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
