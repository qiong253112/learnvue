<template>
	<div id="app">
		<!--<router-view/>-->
		<transition name="fade" mode="out-in">
			<router-view v-if="isRouterAlive" />
		</transition>
	</div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
      user: "Meng Li"
    };
  },
  data() {
    return {
      isRouterAlive: true,
      // 全局数据 可以通过 this.user 查看
      user: {}
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  },
  created() {
    window.app = this;
  }
};
</script>

<style  lang="scss" type="text/css">
html,
body {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

ul,
ol {
  list-style: none;
  padding: 0;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 100%;
}

.el-submenu [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}

.el-menu-item [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}

.toolbar {
  background: #f2f2f2;
  padding: 10px;
  margin: 10px 0px;
  .el-form-item {
    margin-bottom: 10px;
  }
}

.el-icon-loading {
  font-size: 50px;
}

.el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
  color: #fff;
}

.el-menu-item.is-active {
  background-color: rgb(26, 128, 204) !important;
  border-bottom-color: rgb(26, 128, 204) !important;
}

.el-menu--horizontal.el-menu > .el-submenu.is-active > .el-submenu__title {
  background-color: rgb(26, 128, 204) !important;
  border-bottom-color: rgb(26, 128, 204) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.bounceInLeft-enter-active,
.bounceInLeft-enter {
  animation: bounceInLeft 0.5s;
}

.bounceInLeft-leave-active,
.bounceInLeft-leave-active {
  animation: bounceOutRight 0.5s;
}

@keyframes bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-3000px, 0, 0);
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(25px, 0, 0);
    transform: translate3d(25px, 0, 0);
  }
  75% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    -webkit-transform: translate3d(5px, 0, 0);
    transform: translate3d(5px, 0, 0);
  }
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@-webkit-keyframes bounceOutRight {
  20% {
    opacity: 1;
    -webkit-transform: translate3d(-20px, 0, 0);
    transform: translate3d(-20px, 0, 0);
  }
  to {
    opacity: 0;
    -webkit-transform: translate3d(2000px, 0, 0);
    transform: translate3d(2000px, 0, 0);
  }
}

@keyframes bounceOutRight {
  20% {
    opacity: 1;
    -webkit-transform: translate3d(-20px, 0, 0);
    transform: translate3d(-20px, 0, 0);
  }
  to {
    opacity: 0;
    -webkit-transform: translate3d(2000px, 0, 0);
    transform: translate3d(2000px, 0, 0);
  }
}

#target {
  display: inline-block;
  width: 10px;
  height: 20px;
  overflow: hidden;
  opacity: 0;
}
</style>