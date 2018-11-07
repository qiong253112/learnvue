<template>
	<el-row class="container">
		<div >
		<el-col :span="24" class="main">
			<transition name="el-fade-in">
				<el-col :span="6" class="search" v-if="isShowHistory">
					<el-row>
						<h4 class="title">History</h4>
					</el-row>
					<el-row style="max-height: 90%;overflow-y: auto; font-size: 13px;">
						<el-card class="historyCard" v-for="(o,index) in historyData" :key="index" shadow="never">
							<div style="margin-bottom: 10px;">
								<div style="margin: 0 0 10px 0;">
									<b>Keywords:</b><span style="margin-left: 5px;" class="searchQ"  v-text="o.searchQ"></span>
								</div>
								<div class="margin_10">
									<b>Search Top:</b><span style="margin-left: 5px;"  v-text="o.searchTop"></span>
								</div>
								<div class="margin_10">
									<b>Sort By:</b><span style="margin-left: 5px;" v-text="o.sortBy"></span>
								</div>
								<div class="margin_10">
									<b>Select Publish within:</b><span style="margin-left: 5px;" v-for="(item,index) in o.selectedPublishValue" :key="index" v-text="item.label"></span>
								</div>
								<div class="margin_10">
									<b>Provider:</b><span style="margin: 5px 5px 0 5px;white-space: nowrap;display:inline-block;padding: 3px 5px; background: #f0f2f5; border-radius: 3px;" v-for="(item,index) in o.addProvider" :key="index" v-text="item._name"></span>
								</div>
								<div class="margin_10">
									<b>Feed:</b> <div v-for="(item,index) in o.feedArr" :key="index" v-text="item._name"></div>
								</div>
								<div class="margin_10">
									<b>ListId:</b> <span style="margin-left: 5px;" class="searchQ"  v-text="o.listId"></span>
								</div>
							</div>
							<div class="bottom">
								<span style="color:#20a0ff;" @click="applyData(index)">Apply</span>
								<span style="color: red;" @click="delHistoryData(index)"><i class="el-icon-delete"></i></span>
							</div>
						</el-card>
					</el-row>
				</el-col>
			</transition>
			<!--左侧搜索栏-->
			<el-col :span="6" class="search">
				<el-row>
					<h4 class="title">Search</h4>
				</el-row>
				<el-row>
					<el-input size="small" placeholder="请输入内容" v-model="q">
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
				</el-row>
				<el-row>
					<div class="subTitle">Search Top</div>
					<el-input size="small" type="number" placeholder="请输入 TOP" v-model="top">
					</el-input>
				</el-row>
				<el-row>
					<div class="subTitle">Sort By</div>
					<el-select size="small" v-model="sortValue" placeholder="请选择">
						<el-option v-for="item in selectSortOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-row>
				<!--<el-row>
					<div class="subTitle">Select Content type</div>
					<el-select size="small" v-model="checkContentTypeList" multiple placeholder="All">
						<el-option v-for="item in contentType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-row>-->
				<el-row>
					<div class="subTitle">Select Publish within</div>
					<el-select size="small" v-model="publishValue" placeholder="请选择">
						<el-option v-for="item in selectPublishOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-row>
				<el-row>
					<div class="subTitle">Add Provider / Feed</div>
					<div style="margin-bottom: 10px;">
						<el-select size="mini" v-model="value5" @change="addProviderSelect" placeholder="请选择 Provider">
							<el-option v-for="item in provider" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div v-for="(item,index) in addProvider" :key="index" class="addProvider" v-if="addProvider.length>0">
						<el-row>
							<el-col :span="22">
								<el-select size="mini" v-model="providerList[index]" placeholder="请选择" @change="getFeeds">
									<el-option :key="item._id" :label="item._name" :value="item._id">
									</el-option>
								</el-select>
							</el-col>
							<el-col :span="2" style="line-height: 32px; text-align: center;">
								<i class="el-icon-close" @click="deleteProvider(index)"></i>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="22">
								<el-select size="mini" clearable v-model="feedList[index]" @change="changeFeed" placeholder="[all feeds]">
									<el-option v-for="obj in feedsData[index]" :key="obj._id" :label="obj._name" :value="obj._id" v-text="obj._name">
									</el-option>
								</el-select>
							</el-col>
						</el-row>
					</div>
				</el-row>
				<el-row>
					<el-button size="small" type="primary" style="width:100%;" @click.native.prevent="search('search')">Search</el-button>
				</el-row>
			</el-col>
			<transition name="bounceInLeft">
				<el-col :span="11" class="items" v-if="showList">
					<el-col :span="7" class="items">
						<i class="el-icon-d-arrow-right" style="font-size: 50px; color:#ccc"></i>
					</el-col>
					<el-col :span="17" class="list">
						<el-row>
							<h4 class="title" style="margin: 9px auto;">Search Result</h4>
						</el-row>
						<el-row v-if='itemData.length>0' style="display: flex;justify-content: flex-end;">
							<span id="target" v-text="selectedIdstr"></span>
							<a class="copyIds" data-clipboard-action="copy" data-clipboard-target="#target">Copy selected articles ids</a>
						</el-row>
						<p v-if='itemData.length===0'>暂无相关数据</p>
						<div v-if='itemData.length>0' class="box">
							<el-row class="box-card">
								<el-card v-for="o in itemData" :key="o.id" shadow="never" v-bind:class="{ active:o.checked }">
									<el-col :span='2' style="margin-top:35px;">
										<el-checkbox-group v-model="checkedItems">
											<el-checkbox :label="o.id" @change="updateSelection">&nbsp;</el-checkbox>
										</el-checkbox-group>
									</el-col>
									<el-col :span='22'>
										<div style="line-height: 22px; height: 44px;" v-text="o.title">
										</div>
										<div class="bottom">
											<div v-text="o.feedName"></div>
											<div class="text">
												<span v-text="o.author"></span>
												<span v-text="o.publishedAt"></span>
											</div>
										</div>
									</el-col>
								</el-card>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="10">
									<el-select size="mini" v-model="listIdValue" @change="changeListId" placeholder="请选择 List ID">
										<el-option v-for="(item,index) in listIdData" :key="index" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-col>
								<el-col :span="14">
									<el-input size="mini" placeholder="请输入List ID" v-model="listId">
									</el-input>
								</el-col>
							</el-row>
							<el-row style="margin-top:15px ;">
								<el-checkbox v-model="isPublish">是否发布</el-checkbox>
								<div style=" float: right; display: inline-block;" v-text="'共选中' + checkedItems.length + '条数据'"></div>
							</el-row>
							<el-button size="small" class='btn' type="primary" :disabled="listId==''" style="width:100%;" @click.native.prevent="checkin">Submit</el-button>
						</div>
					</el-col>
				</el-col>
			</transition>
			<transition name="bounceInLeft">
				<el-col :span="7" class="items" v-if="showSuccess">
					<el-col :span="10" style="text-align: center;">
						<i class="el-icon-d-arrow-right" style="font-size: 50px; color:#ccc"></i>
					</el-col>
					<el-col :span="14" style="text-align: center;">
						<div>
							<svg class="icon" width="100px" height="100.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
								<path fill="#1afa29" d="M60.217477 633.910561c0 0 250.197342 104.557334 374.563838 330.628186 149.378146-279.762705 436.109566-540.713972 521.05012-560.013527 0-115.776863 0-163.394371 0-341.442486-342.237595 226.070852-506.576477 642.342604-506.576477 642.342604l-180.049702-191.614086L60.217477 633.910561z">
								</path>
							</svg>
						</div>
						<div class="margin_10" v-text="'当前List ID下共有'+totalArticles+'篇文章'"></div>
						<div class="margin_10">
							<a target="_blank" :href="'https://www.microsoft-ice.com/amp/document/editor/'+this.listId" rel="noopener noreferrer nofollow">CMS Link</a>
						</div>
						<div>
							<el-button size="small" class='btn' type="primary" @click.native.prevent="saveHistory">Save search record</el-button>
						</div>
					</el-col>
				</el-col>
			</transition>
		</el-col>
		</div >
	</el-row>
</template>

<script>
	import Clipboard from 'clipboard';
	import { getCmsCards, getFeeds, getProvider, getState, checkoutAndCheckin } from '../api/api';
	export default {
		name: 'deskTop',
		data() {
			return {
				sysName: 'MSN CN Automation Tool',
				activeIndex: '1',
				showList: false, //显示search result
				showSuccess: false, //显示 最右侧
				q: '', // search 关键字
				top: 100,
				contentType: [{ //初始化 contentType 默认全部
					value: 'article',
					label: 'Article'
				}, {
					value: 'image',
					label: 'Image'
				}, {
					value: 'slideshow',
					label: 'Slideshow'
				}, {
					value: 'video',
					label: 'Video'
				}],
				checkContentTypeList: ['article', 'image', 'slideshow', 'video'], //默认全部选中
				selectSortOptions: [{ // sort by 数据
					value: 'Publish Date',
					label: 'Publish Date'
				}],
				sortValue: 'Publish Date', //选中的 sort by
				selectPublishOptions: [
					//					{ //  Select Publish within 选项数据
					//						value: '-1',
					//						label: 'Any Time'
					//					}, 
					{
						value: '24h',
						label: 'Past 24 hours'
					}, {
						value: '1h',
						label: 'Past hour'
					}, {
						value: '7d',
						label: 'Past week'
					}, {
						value: '30d',
						label: 'Past month'
					}, {
						value: '12M',
						label: 'Past year'
					}
				],
				publishValue: '24h', //  选中的Select Publish within
				itemData: [], //result 列表数据
				checkedItems: [], //被选中的需要 check in 的数据
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
				},{
					value: "people.com.cn",
					label: "People.com.cn",
				}],
				addProvider: [], // provider/feeds 组合列数据
				providerList: [], //provider/feeds 组合列 被选中的provider
				feedsData: [], //provider/feeds 组合列 feeds 数据
				feedList: [], //被选中的 feeds 
				selectedIdstr: '', //copyIds 的 id值
				clipboardJS: null, //粘贴板对象
				isSubmit: true, //是否禁用 submit按钮
				loading: true,
				totalArticles: 0, //checkin 成功后显示该listId下的文章数
				isShowHistory: false, //是否显示搜索 记录
				historyObj: null, //存放 搜索记录
				historyData: null, //localStorage里的 histroy
				listId: '', // 需要check in的 listId
				listIdValue: '', //被选中的listId
				listIdData: [{
						value: 'BBJEwJj',
						label: 'Infopane'
					},
					{
						value: 'AAwny2h',
						label: 'Finace'
					},
					{
						value: 'AAwmo8S',
						label: 'Technology'
					},
					{
						value: 'AAwmPtk',
						label: 'Health & Fitness'
					},
					{
						value: 'AAwmKd8',
						label: 'Sports'
					},
					{
						value: 'AAwmis8',
						label: 'Entertainment'
					},
					{
						value: 'AAwmt4O',
						label: 'International'
					},
					{
						value: 'AAwmPto',
						label: 'Food & Drinks'
					},
					{
						value: 'AAwmzTV',
						label: 'Autos'
					},
					{
						value: 'BBLo0Z4',
						label: 'Lifestyle'
					},
				], //预设listID
				isPublish: false,
			}
		},
		methods: {
			handleSelect(key, keyPath) {
			},
			//增加 一组 provider/feeds
			addProviderSelect: function() {
				//loading
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
				});
				console.log(this.value5);
				let para = {
					q: encodeURIComponent(this.value5)
				};
				//根据预设provider 获取对应provider 的 id
				getProvider(para).then(data => {
					loading.close();
					data.data.items.forEach((val, index) => {
						this.providerList.push(val._id);
						this.addProvider.push(val);
						this.getFeeds(val._id);
					});
				});
			},
			//删除 一组 provider/feeds
			deleteProvider: function(index) {
				this.feedList.splice(index, 1);
				this.addProvider.splice(index, 1);
				this.providerList.splice(index, 1);
				this.feedsData.splice(index, 1);
				this.value5 = '';
				this.historyData = JSON.parse(localStorage.getItem("history"));
			},
			changeFeed: function() {
				this.historyData = JSON.parse(localStorage.getItem("history"));
			},
			search: function(from) {
				//清空 result 列表数据 和 被选中的 列表数据
				this.checkedItems = [];
				this.itemData = [];
				this.showList = false;
				this.showSuccess = false;
				//销毁粘贴板对象
				if(this.clipboardJS) {
					this.clipboardJS.destroy();
				}

				//loading
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
				});
				//拼接时间范围 参数
				let now = new Date();
				let past_minutes;
				switch(this.publishValue) {
					case '-1':
						past_minutes = "";
						break;
					case '24h':
						past_minutes = 24 * 60;
						break;
					case '1h':
						past_minutes = 1 * 60;
						break;
					case '7d':
						past_minutes = 7 * 24 * 60;
						break;
					case '30d':
						past_minutes = 30 * 24 * 60;
						break;
					case '12M':
						past_minutes = 365 * 24 * 60;
						break;
				};
				//拼接 provider 参数
				let providerStr;
				let arrProvider = [];
				if(this.addProvider.length > 0) {
					providerStr = "";
					this.addProvider.forEach((item, index) => {
						if(arrProvider.indexOf(item._id) === -1) {
							arrProvider.push(item._id);
						}
					});
					arrProvider.forEach((item, index) => {
						if(index === arrProvider.length - 1) {
							providerStr += "cms/api/amp/provider/" + item;
						} else {
							providerStr += "cms/api/amp/provider/" + item + ",";
						}
					})
				} else {
					providerStr = "";
				};
				//拼接feeds参数
				let feedsStr;
				if(this.feedList.length === 0) {
					feedsStr = "";
				} else {
					feedsStr = "";
					let arrFeed = [];
					this.feedList.forEach((item, index) => {
						if(arrFeed.indexOf(item) === -1 && item !== '') {
							arrFeed.push(item);
						}
					});
					let len = arrFeed.length;
					arrFeed.forEach((item, index) => {
						if(index === len - 1) {
							feedsStr += "cms/api/amp/feed/" + item;
						} else {
							feedsStr += "cms/api/amp/feed/" + item + ",";
						}
					})
				};
				providerStr +=feedsStr!==''? ',' + feedsStr:'';
				let para = {
					top: this.top,
					providers: providerStr,
					pastMinutes: past_minutes,
					keywords: this.q,
					sortBy:this.sortValue
				}
				//请求 search 接口
				getCmsCards(para).then(data => {
					loading.close();
					this.itemData = data.data;
					
					//标题重复的默认只选一个
					let titleFilter = [];
					if(this.itemData.length > 0) {
						this.itemData.map(res => {
							if(titleFilter.indexOf(res.title) === -1) {
								this.checkedItems.push(res.id);
								titleFilter.push(res.title);
								res.checked = true;
							}
						});
					}
					this.showList = true;
					if(from==='history'){
						this.checkin();
					};
					//将选中的 id 转化为字符串
					this.selectedIdstr = this.checkedItems.join(',');
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
						console.log(e.action)
					});
				});
			},
			checkin: function() {
				//loading
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
				});
				let url = this.listId;
				if(Boolean(this.listId)) {
					let url = this.listId;
					//获取状态
					getState(url).then(data => {
						let listIdState = data.data.state;
						if(listIdState !== 'checkedOut') {
							let id = this.checkedItems.join(",");
							let formData = new FormData();
							formData.append('articles', id);
							formData.append('publish', Number(this.isPublish));
							// 提交
							checkoutAndCheckin(formData, url).then(data => {
								this.totalArticles = data.data.list.length;
								loading.close();
								this.showSuccess = true;
							}).catch(error => {
								loading.close();
								this.$message({
									showClose: true,
									message: 'Current status is checkout',
									type: 'error',
									center: true,
									duration: 0
								});
							})
						} else {
							this.$message({
								showClose: true,
								message: 'Current status is checkout',
								type: 'error',
								center: true,
								duration: 0
							});
						}
					})
					.catch(error => {
						loading.close();
						this.$message({
							showClose: true,
							message: 'Please fill in the correct List ID',
							type: 'error',
							center: true,
							duration: 0
						});
					});
				};
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
					let aaa = this.feedList;
					let feeds = data.data.items;
					this.feedList = [];
					this.feedsData.push(feeds);
					this.feedList = aaa;
				});
			},
			//选择 要 check in 的 query result 中的数据  默认全选
			updateSelection: function(val) {
				this.itemData.map(res => {
					if(this.checkedItems.indexOf(res.id) === -1) {
						res.checked = false; //未选中
					} else {
						res.checked = true; //选中
					}
				});
			},
			//保存 搜索  纪录
			saveHistory: function() {
				let feedArr = [];
				this.feedsData.forEach((item, index) => {
					item.forEach(i => {
						if(i._id == this.feedList[index]) {
							feedArr.push(i);
						}
					})
				});
				this.historyObj = {
					searchQ: this.q, //关键词
					searchTop: this.top,
					sortBy: this.sortValue,
					checkContentTypeList: this.checkContentTypeList, //content type
					publishValue: this.publishValue, //时间范围
					selectedPublishValue: this.selectPublishOptions.filter(item => item.value === this.publishValue),
					value5: this.value5,
					addProvider: this.addProvider, //选中的provider
					providerList: this.providerList,
					feedsData: this.feedsData,
					feedList: this.feedList, //被选中的feed
					feedArr: feedArr,
					listId:this.listId,
					isPublish:this.isPublish
					
				};
				if(localStorage.getItem("history") === null) {
					let obj = [this.historyObj];
					obj = JSON.stringify(obj); //转化为JSON字符串
					localStorage.setItem("history", obj);
					this.historyData = JSON.parse(localStorage.getItem("history"));
					this.isShowHistory = true;
				} else {
					this.historyData = JSON.parse(localStorage.getItem("history"));
					this.historyData.push(this.historyObj);
					localStorage.setItem("history", JSON.stringify(this.historyData));
					this.isShowHistory = true;
				}
			},
			//删除某一项搜索记录
			delHistoryData: function(index) {
				this.historyData = JSON.parse(localStorage.getItem("history"));
				this.historyData.splice(index, 1);
				if(this.historyData.length === 0) {
					this.isShowHistory = false;
				}
				localStorage.setItem("history", JSON.stringify(this.historyData));
			},
			//使用某一项记录
			applyData: function(index) {
				this.q = this.historyData[index].searchQ;
				this.top = this.historyData[index].searchTop;
				this.sortValue = this.historyData[index].sortBy;
				this.checkContentTypeList = this.historyData[index].checkContentTypeList;
				this.publishValue = this.historyData[index].publishValue;
				this.value5 = this.historyData[index].value5;
				this.addProvider = this.historyData[index].addProvider;
				this.providerList = this.historyData[index].providerList;
				this.feedsData = this.historyData[index].feedsData;
				this.feedList = this.historyData[index].feedList;
				this.listId=this.historyData[index].listId;
				this.isPublish=this.historyData[index].isPublish;
				this.search('history');
			},
			//把选中的预设listID 赋值给listId
			changeListId: function(val) {
				this.listId = val;
			}
		},
		mounted() {
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
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 95%;
		/*overflow-y: scroll;*/
		.main {
			display: flex;
			position: absolute;
			top: 70px;
			bottom: 0px;
			/*overflow-y: auto;*/
			.title {
				padding-bottom: 4px;
				border-bottom: 2px solid;
			}
			h4 {
				margin: 4px 0;
			}
			.search {
				/*background-color: #D3DCE6;*/
				color: #333;
				line-height: 100%;
				height: 100%;
				padding: 5px 10px 10px 50px;
				/*overflow-y: auto;*/
				.el-row {
					margin-bottom: 10px;
					&:last-child {
						margin-bottom: 0;
					}
					.subTitle {
						margin-bottom: 5px;
					}
					.el-select {
						width: 100%;
						margin: 2px auto;
					}
					.el-checkbox {
						display: block;
						margin-left: 5px;
					}
					.addProvider {
						margin-bottom: 6px;
						&:last-child {
							margin-bottom: 0;
						}
						.el-input {
							width: 90%;
							margin: 2px 10px 2px 0;
						}
						.el-select {
							width: 90%;
							margin: 2px 10px 2px 0;
						}
						i {
							font-weight: 700;
							cursor: pointer;
						}
					}
				}
			}
			.items {
				/*background-color: #E9EEF3;*/
				color: #333;
				line-height: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.list {
					align-self: flex-start;
					.copyIds {
						text-align: right;
						cursor: pointer;
						color: #e4393c;
					}
					.box-card {
						height: 500px;
						overflow-y: auto;
						margin: 10px auto;
						.el-card {
							margin: 5px auto;
							height: 125px;
							.el-card__body {
								.el-col .el-col-2 {
									overflow: hidden;
									.el-checkbox-group {
										.el-checkbox {
											.el-checkbox__label {
												display: none;
											}
										}
									}
								}
							}
							.bottom {
								font-size: 12px;
								margin-top: 13px;
								.text {
									margin-top: 6px;
									display: flex;
									justify-content: space-between;
								}
							}
						}
						.active {
							border: 1px solid #20a0ff;
						}
					}
					.listId {
						line-height: 40px;
					}
					.btn {
						margin: 10px auto;
					}
				}
				.duigou {
					width: 100px;
					height: 100px;
					background: #fff;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
	
	.margin_10 {
		margin: 10px auto;
	}
	
	.el-menu--horizontal>.el-menu-item.is-active {
		background-color: #000 !important;
		color: #fff !important;
		border-bottom: #000 !important;
	}
	
	.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
		background-color: #000 !important;
		color: #fff !important;
		border-bottom: #000 !important;
	}
	
	.el-card__body {
		padding: 10px 15px;
	}
	
	.historyCard {
		margin: 10px auto;
		border-top: 2px solid #ddd;
	}
	
	.historyCard .bottom {
		display: flex;
		justify-content: flex-end;
	}
	
	.historyCard .bottom span {
		padding: 5px 10px;
		cursor: pointer;
	}
	
	.searchQ {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}
</style>
