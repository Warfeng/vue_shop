<template>
  <el-container id="home">
    <!-- 头部 -->
    <el-header>
      <div class="header">
        <img src="../assets/logo.png" alt="logo">
        <span>后台管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle" @click="toggleCollapse">| | |</div>
        <el-menu
          background-color="rgb(93,93,93)"
          text-color="#fff"
          active-text-color="#ffd04b" 
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级模版 -->
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="'/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 菜单栏
      menulist: [],
      icons: {
        '125': 'el-icon-user',
        '103': 'el-icon-finished',
        '101': 'el-icon-present',
        '102': 'el-icon-price-tag',
        '145': 'el-icon-date'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    // 折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
#home {
  height: 100%;
}
.el-header {
  background-color: rgb(150, 150, 150);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 22px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
    }
  }
  
  .el-button {
    background-color: skyblue;
  }
}
.el-aside {
  background-color: rgb(93, 93, 93);
  .el-menu {
    border: none;
  }
}

.toggle {
  background-color: rgba(110, 110, 110, 0);
  font-size: 10px;
  line-height: 24px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
}

</style>