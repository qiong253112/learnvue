<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="4">
				<el-select style="margin-left: 10px;" size="small" v-model="value5" @change="addProviderSelect" placeholder="请选择 Provider">
					<el-option v-for="item in provider" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>

			</el-col>
			<el-col :span="5">
				<el-select size="small" clearable v-model="feedList" @change="changeFeed" placeholder="[all feeds]">
					<el-option v-for="obj in feedsData" :key="obj._id" :label="obj._name" :value="obj._id" v-text="obj._name">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="8">
				<el-input size="small" placeholder="请输入要添加 Feed ID" v-model.trim="inputValue">
					<el-button slot="append" icon="el-icon-plus" @click="addFeedId">Create New White List</el-button>
				</el-input>
			</el-col>
			<el-col :span="5" style="color:red;line-height: 32px;" v-if="inputValue.length!==7">* feed长度必须为 7 位</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="6" class="box-card">
				<el-card shadow>
					<ul>
						<li v-for="(o,index) in whiteListData" :key="index" :class="index===activeIndex?'active':''" style="margin-bottom: 15px;">
							<div class="text">
								<div style="line-height: 40px;">{{o}}</div>
								<div>
									<span @click="delFeedId(o,index)"><i class="el-icon-delete" ></i></span>
									<el-button type="text" @click="getWhiteListByFeed(o,index)"><i class="el-icon-edit"></i></el-button>
								</div>
							</div>
						</li>
					</ul>
				</el-card>
			</el-col>
			<transition name="bounceInLeft">
				<el-col :span="18" v-if="showWhiteList">
					<el-row style="margin-top: 10px;" :gutter="20" type="flex" justify="space-between">
						<el-col :span="10" style="margin-left: 10px;">
							<el-input placeholder="请输入要添加的白名单" v-model.trim="inputKeywords">
								<el-button slot="append" icon="el-icon-plus" @click="addWhiteList">添加词条</el-button>
							</el-input>
						</el-col>
						<el-col :span="6">
							<el-row style="display: flex;justify-content:flex-start;cursor: pointer;align-content: center;">
								<span id="target" v-text="feedWhiteListStr"></span>
								<a style="line-height: 40px;cursor: pointer;" class="copyIds" data-clipboard-action="copy" data-clipboard-target="#target">复制全部词条</a>
							</el-row>
						</el-col>
					</el-row>
					<el-row>
						<el-card style="display:inline-block; margin: 10px;" v-for="(o,index) in feedWhiteListData" :key="index" shadow="hover">
							<div class="text">
								{{o}}
								<span @click="delWhiteList(o,index)" style="margin-left: 20px;margin-right: 0;">
						<i class="el-icon-delete"  ></i>
					</span>
							</div>
						</el-card>
					</el-row>

				</el-col>
			</transition>
		</el-row>
	</div>
</template>
<script>
	import Clipboard from 'clipboard';
	import { getWhiteList, modifyWhiteList, getWhiteListByFeed, deleteWhiteList, deleteFeedWhiteList, getProvider, getFeeds } from '../api/api';
	export default {
		name: 'blockList',
		data() {
			return {
				inputValue: '',
				inputKeywords: '',
				whiteListData: [],
				feedWhiteListData: [],
				activeIndex: '',
				clipboardJS: null, //粘贴板对象
				showWhiteList: false,
				activeFeedId: '',
				feedWhiteListStr: '',
				value5: '', //provider 被选中的数据
				provider: [{ // provider 数据
					value: 'eastday autos',
					label: 'Eastday Autos'
				}, {
					value: 'eastday entertainment',
					label: 'Eastday Entertainment'
				}, {
					value: 'eastday finance',
					label: 'Eastday Finance'
				}, {
					value: 'eastday fitness',
					label: 'Eastday Fitness'
				}, {
					value: 'eastday food',
					label: 'Eastday Food'
				}, {
					value: 'eastday health',
					label: 'Eastday Health'
				}, {
					value: 'eastday news',
					label: 'Eastday News'
				}, {
					value: 'eastday sports',
					label: 'Eastday Sports'
				}, {
					value: 'eastday top stories',
					label: 'Eastday Top Stories'
				}, {
					value: 'huanqiu.com',
					label: 'Huanqiu.com'
				}, {
					value: 'china daily ZH-CN',
					label: 'China Daily ZH-CN'
				}],
				feedsData: [], //provider/feeds 组合列 feeds 数据
				feedList: "", //被选中的 feeds  //要复制的白名单

			}
		},
		methods: {
			//获取feed id 列表
			getWhiteList() {
				getWhiteList().then(data => {
					this.whiteListData = data.data.keywords;

				}).catch(error => {
//					console.log(error);
				})
			},
			//获取白名单词条
			getWhiteListByFeed(item, index) {
				this.activeIndex = index;
				this.activeFeedId = item;
				this.showWhiteList = false;
				//销毁粘贴板对象
				if(this.clipboardJS) {
					this.clipboardJS.destroy();
				}
				let url = item;
				getWhiteListByFeed(url).then(data => {
					this.feedWhiteListData = data.data[url];
					this.showWhiteList = true;
					//将选中的 id 转化为字符串
					this.feedWhiteListStr = this.feedWhiteListData.join(',');
					//实例化 ClipboardJS对象; 实现copyId
					this.clipboardJS = new Clipboard('.copyIds');
					this.clipboardJS.on("success", e => {
						// 复制成功
						this.$message({
							showClose: true,
							message: 'Copy success',
							type: 'success',
							center: true,
							duration: 5000
						});
						e.clearSelection();
					});
					this.clipboardJS.on("error", e => {
						//复制失败；
//						console.log(e.action)
					});

				}).catch(error => {
//					console.log(error);
				})
			},
			//增加feed id
			addFeedId() {
				if(this.inputValue.length !== 7) {
					return this.$message({
						type: 'warning',
						message: 'feed 长度必须是7位!'
					});
				}
				this.whiteListData.push(this.inputValue);
				this.inputValue = "";
			},
			//删除 feedid
			delFeedId(item, index) {
				this.$confirm('此操作将删除该条feed, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let url = item;
					deleteWhiteList(url).then(data => {
						if(data.data.error) {
							this.$message({
								type: 'error',
								message: data.data.error
							});
						} else {
							this.getWhiteList();
							this.inputKeywords = "";
							if(this.activeIndex == index) {
								this.showWhiteList = false;
							}
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}

					}).catch(error => {
					})

				}).catch(() => {
				});

			},
			//增加白名单词条
			addWhiteList() {
				if(this.inputKeywords !== '') {
					if(this.feedWhiteListData.includes(this.inputKeywords)) {
						return this.$message({
							type: 'warning',
							message: "列表中已包含该名单"
						});
					};
					//					let arr = this.inputKeywords.split(',');
					let para = {
						action: "add",
						value: this.inputKeywords
					};
					let url = this.activeFeedId;
					deleteFeedWhiteList(url, para).then(data => {
						if(data.data.error) {
							this.$message({
								type: 'error',
								message: data.data.error
							});
						} else {
							this.getWhiteListByFeed(this.activeFeedId, this.activeIndex);
							this.inputKeywords = "";
						}

					}).catch(error => {
					})
				}
			},
			//删除白名单词条
			delWhiteList(item, index) {
				this.$confirm('此操作将删除该名单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let para = {
						action: "remove",
						value: item
					};
					let url = this.activeFeedId;
					deleteFeedWhiteList(url, para).then(data => {
						this.getWhiteListByFeed(this.activeFeedId, this.activeIndex);
						this.$message({
							type: 'success',
							message: '删除成功!'
						});

					}).catch(error => {
					})

				}).catch(() => {
				});
			}, //增加 一组 provider/feeds
			addProviderSelect: function() {
				this.feedsData = [];
				this.feedList = "";
				//loading
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
				});
				let para = {
					q: encodeURIComponent(this.value5)
				};
				//根据预设provider 获取对应provider 的 id
				getProvider(para).then(data => {
					data.data.items.forEach((val, index) => {
						this.getFeeds(val._id);
					});
					setTimeout(()=>{
						loading.close();
					},200);
					
				});
			},
			changeFeed: function() {
				this.inputValue = this.feedList;
			},
			//根据 provider ID 获取 feeds
			getFeeds: function(value) {
				//拼接filter参数
				let filter = "'_editorial.newsdeskDiscoverable'+eq+'true'and('_locale'eq'en-us'or'_locale'eq'ja-jp'or'_locale'eq'zh-cn'or'_locale'eq'zh-tw'or'_locale'eq'global')";
				//拼接orderby参数
				let orderby = '_name';
				//拼接select参数
				let $select = "_id,$type,_name,_links,_expirationDateTime,_isPublishingLocked,_locale,subscriptionType,_lastEditedDateTime,_lastPublishedDateTime,_lastPublishedSequence,siteConfig,_headers._latestVersion,_headers._created,_headers._version,_headers._state,_headers._tenant,_headers._lastModifiedBy,_headers._lastModified,_headers._publishedVersion,_headers._checkedOutVersion,_headers._checkedOutBy,_headers._publishedBy,subtype,fileMetadata,description,fileName,href,width,height,forceUserDownload";
				let para = {
					$filter: encodeURIComponent(filter),
					$orderBy: encodeURIComponent(orderby),
					$select: encodeURIComponent($select),
					$skip: 0,
					$top: 500
				};
				//接口地址
				let url = value;
				//发送请求
				getFeeds(para, url).then(data => {
					this.feedsData = data.data.items;
				});
			},

		},
		mounted() {
			this.getWhiteList();
		}
	}
</script>

<style scoped lang="scss" type="text/css">
	.box-card {
		.el-card {
			display: inline-block;
			margin: 10px;
			width: 100%;
			.el-card__body {
				padding: 0 !important;
				ul {
					li {
						border-bottom: 1px dashed #ddd;
						padding: 0 5px;
					}
				}
			}
		}
	}
	
	.text {
		display: flex;
		justify-content: space-between;
		align-content: center;
		span {
			color: red;
			margin-right: 15px;
			cursor: pointer;
			i {
				vertical-align: middle;
			}
		}
	}
	
	.el-select,
	.el-input-group {
		width: 100%;
	}
	
	.active {
		background: #ddd;
	}
</style>