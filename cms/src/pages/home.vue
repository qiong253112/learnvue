<template>
	<el-container>
		<el-header>
			<el-row>
				<el-col :span="6" class="logo" v-text="sysName"></el-col>
				<el-col :span="14" class="menu">
					<!--导航菜单-->
					<el-menu :default-active="activeIndex" background-color="#20a0ff" active-text-color="#fff" text-color="#fff" mode="horizontal">
						<el-menu-item @click="skip('deskTop')" index="deskTop">Desktop</el-menu-item>
						<!--<el-submenu index="deskTop">
							<template slot="title">Desktop</template>
							<el-menu-item @click="skip('deskTop')" index="deskTop">Desktop</el-menu-item>
							<el-menu-item @click="skip('blockList')" index="blockList">Block List</el-menu-item>
							<el-menu-item @click="skip('whitelist')" index="whitelist">White List</el-menu-item>
						</el-submenu>-->
						<el-menu-item @click="skip('autoJob')" index="autoJob">Job</el-menu-item>
						<el-submenu index="management">
							<template slot="title">Management</template>
							<el-menu-item @click="skip('blockList')" index="blockList">Block List</el-menu-item>
							<el-menu-item @click="skip('whitelist')" index="whitelist">White List</el-menu-item>
						</el-submenu>
						<!--<el-menu-item @click="skip('autoJob')" index="management">Management</el-menu-item>-->
						<!--<el-menu-item index="providerCreator">Provider creator</el-menu-item>-->
					</el-menu>
				</el-col>
				<el-col :span="4" class="userinfo">
					<svg class="icon" width="30px" height="30.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
						<path fill="#ffffff" d="M409.6 526.336c-79.872-40.96-135.168-122.88-135.168-219.136 0-135.168 110.592-245.76 245.76-245.76s245.76 110.592 245.76 245.76c0 96.256-55.296 178.176-135.168 219.136 184.32 49.152 319.488 217.088 319.488 415.744 0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48c0-215.04-174.08-389.12-389.12-389.12s-389.12 174.08-389.12 389.12c0 12.288-8.192 20.48-20.48 20.48s-20.48-8.192-20.48-20.48c0-198.656 135.168-366.592 319.488-415.744z m110.592-14.336c112.64 0 204.8-92.16 204.8-204.8s-92.16-204.8-204.8-204.8-204.8 92.16-204.8 204.8 92.16 204.8 204.8 204.8z">
						</path>
					</svg>
					<span>{{user}}</span>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			<transition name="fade" mode="out-in">
				<router-view/>
			</transition>
		</el-main>
	</el-container>
</template>

<script>
	//26,128,204          32,160,255
	export default {
		name: 'home',
		inject: ['user'],
		data() {
			return {
				sysName: 'MSN CN Automation Tool',
				//				activeIndex2: '1-1',
				activeIndex: 'deskTop',
				userName:'Li Meng'
			}
		},
		methods: {
			skip(a) {
				this.$router.push(a);
			},
		},
		mounted() {
//			let arr = location.pathname.split('/');
			let arr = location.hash.split('/');
			this.activeIndex = arr[arr.length - 1];
			if(localStorage.getItem("history")) {
				this.historyData = JSON.parse(localStorage.getItem("history"));
				this.isShowHistory = true;
				if(this.historyData.length === 0) {
					this.isShowHistory = false;
				}
			}
		}
	}
</script>

<style scoped lang="scss" type="text/css">
	.el-header {
		background: #20a0ff;
		height: 60px;
		line-height: 60px;
		color: #fff;
		z-index: 99;
		.userinfo {
			text-align: right;
			padding-right: 80px;
			float: right;
			overflow: hidden;
			white-space: nowrap;
			.userinfo-inner {
				cursor: pointer;
				color: #fff;
			}
		}
		.logo {
			height: 60px;
			font-size: 22px;
			padding-left: 20px;
			padding-right: 20px;
			text-align: center;
			border-color: rgba(238, 241, 146, 0.3);
			border-right-width: 1px;
			border-right-style: solid;
			overflow: hidden;
			.txt {
				color: #fff;
			}
		}
		.icon {
			vertical-align: middle;
			margin-right: 10px;
		}
	
	}
</style>