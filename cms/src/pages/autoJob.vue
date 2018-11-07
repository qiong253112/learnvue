<template>
	<div>
		<!--#list_id|providers|keywords|top|past_minutes|trigger|minutes BBNBVHt|cms/api/amp/feed/AAvWiQ4,cms/api/amp/feed/AAwrZZ4,cms/api/amp/feed/AAAepWO||60|1440|interval|30-->
		<el-row>
			<el-button style="margin-left: 5%;" type="primary" icon="el-icon-plus" @click="addListID">Create New Job</el-button>
		</el-row>
		<el-table :data="tableData" border :header-cell-style="{background:'#90C3F8',color:'#fff'}" max-height="700" style="width: 90%;margin: 20px auto;">
			<el-table-column prop="name" width="100" label="Job Name" align='center'>
			</el-table-column>
			<el-table-column prop="listId" width="100" label="List ID" align='center'>
			</el-table-column>
			<el-table-column prop="providers" width="280" label="Providers" align="center">
			</el-table-column>
			<el-table-column prop="keywords" width="180" label="Keywords" align="center">
			</el-table-column>
			<el-table-column prop="top" width="70" label="Top" align="center">
			</el-table-column>
			<el-table-column prop="pastMinutes" width="120" label="Past Minutes" align="center">
			</el-table-column>
			<el-table-column prop="trigger" width="70" label="Trigger" align="center">
			</el-table-column>
			<el-table-column prop="triggerConfig" label="Trigger Config" width="120" align="center">
			</el-table-column>
			<el-table-column prop="filters" label="Filters" width="160" align="center">
			</el-table-column>
			<el-table-column prop="nextRunTime" label="Next Run Time" align="center">
			</el-table-column>
			<el-table-column fixed="right" label="Action" width="180">
				<template slot-scope="scope">
					<!--<el-button type="text" size="small" @click="editListID(scope)">编辑</el-button>-->
					<el-button type="text" size="small" v-if="scope.row.running==0" @click="resumeListID(scope)">启动</el-button>
					<el-button type="text" size="small" v-if="scope.row.running==1">已启动</el-button>
					<el-button type="text" size="small" v-if="scope.row.running==1" @click="pauseListID(scope)">停止</el-button>
					<el-button type="text" size="small" v-if="scope.row.running==0">已停止</el-button>
					<el-button type="text" size="small" @click="del(scope)" style="color: red;">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-row>
				<el-input size="small" placeholder="请输入jobName" v-model="jobName">
					<i slot="prefix" class="el-input__icon el-icon-search"></i>
				</el-input>
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
			<el-row>
				<el-input size="small" placeholder="请输入keywords" v-model="q">
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
			<el-row>
				<div class="subTitle">Select Publish within</div>
				<el-select size="small" v-model="publishValue" placeholder="请选择">
					<el-option v-for="item in selectPublishOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-row>
			<el-row>
				<div class="subTitle">Add Provider / Feed</div>
				<div v-loading="loading">

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
				</div>
			</el-row>
			<el-row>
				<div class="subTitle">Trigger</div>
				<el-select size="mini" v-model="triggerValue" placeholder="请选择 trigger">
					<el-option v-for="(item,index) in triggerData" :key="index" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-row>
			<el-row>
				<div class="subTitle">TriggerConfig(分钟数)</div>
				<el-input type="number" @change="changeTriggerConfig" size="mini" placeholder="请输入triggerConfig" v-model="triggerConfigValue">
				</el-input>
			</el-row>
			<el-row>
				<div class="subTitle">Filters</div>
				<el-input type="text" size="mini" placeholder="请输入filters" v-model="filters">
				</el-input>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="colseDialog">取 消</el-button>
				<el-button type="primary" @click="saveJob">保存</el-button>
			</div>
		</el-dialog>

	</div>

</template>

<script>
	import {
		getCmsCards,
		getFeeds,
		getProvider,
		deleteJobList,
		resumeJobList,
		pauseJobList,
		getJobList,
		saveJobList
	} from "../api/api";
	export default {
		name: "autoJob",
		data() {
			return {
				tableData: [],
				dialogFormVisible: false,
				dialogTitle: "",
				jobName: "",
				q: "", // search 关键字
				top: 30,
				contentType: [{
						//初始化 contentType 默认全部
						value: "article",
						label: "Article"
					},
					{
						value: "image",
						label: "Image"
					},
					{
						value: "slideshow",
						label: "Slideshow"
					},
					{
						value: "video",
						label: "Video"
					}
				],
				checkContentTypeList: ["article", "image", "slideshow", "video"], //默认全部选中
				selectSortOptions: [{
					// sort by 数据
					value: "Publish Date",
					label: "Publish Date"
				}],
				sortValue: "Publish Date", //选中的 sort by
				selectPublishOptions: [
					//					{ //  Select Publish within 选项数据
					//						value: '-1',
					//						label: 'Any Time'
					//					},
					{
						value: "24h",
						label: "Past 24 hours"
					},
					{
						value: "1h",
						label: "Past hour"
					},
					{
						value: "7d",
						label: "Past week"
					},
					{
						value: "30d",
						label: "Past month"
					},
					{
						value: "12M",
						label: "Past year"
					}
				],
				publishValue: "24h",
				value5: "", //provider 被选中的数据
				provider: [{
						//  常用 provider 数据
						value: "eastday autos",
						label: "Eastday Autos",
						id: "AAvWgkZ"
					},
					{
						value: "eastday entertainment",
						label: "Eastday Entertainment",
						id: "AAvVvIb"
					},
					{
						value: "eastday finance",
						label: "Eastday Finance",
						id: "AAvW4Lf"
					},
					{
						value: "eastday fitness",
						label: "Eastday Fitness",
						id: "AAvWej7"
					},
					{
						value: "eastday food",
						label: "Eastday Food",
						id: "AAvWbsb"
					},
					{
						value: "eastday health",
						label: "Eastday Health",
						id: "AAvWnH7"
					},
					{
						value: "eastday news",
						label: "Eastday News",
						id: "AAvLaOk"
					},
					{
						value: "eastday sports",
						label: "Eastday Sports",
						id: "AAvVVj0"
					},
					{
						value: "eastday top stories",
						label: "Eastday Top Stories",
						id: "AAvVrDz"
					},
					{
						value: "huanqiu.com",
						label: "Huanqiu.com",
						id: "AAA8Bhi"
					},
					{
						value: "china daily ZH-CN",
						label: "China Daily ZH-CN",
						id: "BBLWR3X"
					},
					{
						value: "people.com.cn",
						label: "People.com.cn",
						id: "BBNGQBq"
					}
				],
				addProvider: [], // provider/feeds 组合列数据
				providerList: [], //provider/feeds 组合列 被选中的provider
				feedsData: [], //provider/feeds 组合列 feeds 数据
				feedList: [], //被选中的 feeds
				listId: "", // 需要check in的 listId
				listIdValue: "", //被选中的listId
				listIdData: [{
						//预设listID
						value: "",
						label: "插入其他List ID"
					},
					{
						value: "BBNBVHt",
						label: "Test Autos"
					},
					{
						value: "BBNBR36",
						label: "Test Entertainment"
					},
					{
						value: "BBNEOdz",
						label: "Test Finace"
					},
					{
						value: "BBNEOiz",
						label: "Test food & drink"
					},
					{
						value: "BBNEEhL",
						label: "Test International"
					},
					{
						value: "BBNBN51",
						label: "Test Lifestyle"
					},
					{
						value: "BBNBTwt",
						label: "Test Sports"
					},
					{
						value: "BBNEGde",
						label: "Test Technology"
					},
					{
						value: "BBNGF18",
						label: "Test Huanqiu"
					},
					{
						value: "BBNGQBq",
						label: "Test People's"
					},
					{
						value: "BBNGQCt",
						label: "Test Chinadaily "
					}
				],
				triggerValue: "",
				triggerData: [{
						value: "interval",
						label: "interval"
					}
					//					{
					//						value: 'cron',
					//						label: 'cron'
					//					}
				],
				triggerConfigValue: "",
				filters: "",
				loading: false //加载中
			};
		},
		methods: {
			getJobList() {
				getJobList()
					.then(data => {
						if(Array.isArray(data.data)) {
							this.tableData = data.data;
							console.log(this.tableData);
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			async editListID(scope) {
				this.dialogTitle = "编辑List ID"; //模态框标题
				this.dialogFormVisible = true; //显示模态框
				//给模态框中各选项赋值
				this.jobId = scope.row.id;
				this.jobName = scope.row.name;
				this.listId = scope.row.listId;
				this.q = scope.row.keywords;
				this.top = scope.row.top;
				this.triggerConfigValue = scope.row.triggerConfig;
				this.triggerValue = scope.row.trigger;
				this.filters = scope.row.filters;
				switch(scope.row.pastMinutes) {
					case 1440:
						this.publishValue = "24h";
						break;
					case 60:
						this.publishValue = "1h";
						break;
					case 7 * 24 * 60:
						this.publishValue = "7d";
						break;
					case 30 * 24 * 60:
						this.publishValue = "30d";
						break;
					case 365 * 24 * 60:
						this.publishValue = "12M";
						break;
				}
				let arr = scope.row.providers.split(",");
				let providerArr = [];
				let feedArr = [];
				arr.forEach((item) => {
					if(item.startsWith('cms/api/amp/provider/')) {
						providerArr.push(item.split('cms/api/amp/provider/')[1]);
					}
					if(item.startsWith('cms/api/amp/feed/')) {
						feedArr.push(item.split('cms/api/amp/feed/')[1]);
					}

				});
				for(var item of this.provider) {
					if(providerArr.includes(item.id)) {
						this.loading = true;
						try {
							let providerPara = {
								q: encodeURIComponent(item.value)
							};
							const providerData = await getProvider(providerPara);
							this.providerList.push(providerData.data.items[0]._id);
							this.addProvider.push(providerData.data.items[0]);

							//获取feeds
							//拼接filter参数
							let filter =
								"'_editorial.newsdeskDiscoverable'+eq+'true'and('_locale'eq'en-us'or'_locale'eq'ja-jp'or'_locale'eq'zh-cn'or'_locale'eq'zh-tw'or'_locale'eq'global')";
							//拼接orderby参数
							let orderby = "_name";
							//拼接select参数
							let $select =
								"_id,$type,_name,_links,_expirationDateTime,_isPublishingLocked,_locale,subscriptionType,_lastEditedDateTime,_lastPublishedDateTime,_lastPublishedSequence,siteConfig,_headers._latestVersion,_headers._created,_headers._version,_headers._state,_headers._tenant,_headers._lastModifiedBy,_headers._lastModified,_headers._publishedVersion,_headers._checkedOutVersion,_headers._checkedOutBy,_headers._publishedBy,subtype,fileMetadata,description,fileName,href,width,height,forceUserDownload";
							let para = {
								$filter: encodeURIComponent(filter),
								$orderBy: encodeURIComponent(orderby),
								$select: encodeURIComponent($select),
								$skip: 0,
								$top: 500
							};
							//接口地址
							let url = providerData.data.items[0]._id;
							const data2 = await getFeeds(para, url);
							let feeds = data2.data.items;
							this.feedsData.push(feeds);
						} catch(err) {
							console.log(err);
						}

					}
				}
				this.feedList = feedArr;
				this.loading = false;
			},
//			async addProviderSelect(value) {
//				console.log(value);
//
//				try { //获取provider
//					let providerPara = {
//						q: encodeURIComponent(value)
//					};
//
//					const data = await getProvider(providerPara);
//					this.providerList.push(data.data.items[0]._id);
//					this.addProvider.push(data.data.items[0]);
//
//					//获取feeds
//					//拼接filter参数
//					let filter =
//						"'_editorial.newsdeskDiscoverable'+eq+'true'and('_locale'eq'en-us'or'_locale'eq'ja-jp'or'_locale'eq'zh-cn'or'_locale'eq'zh-tw'or'_locale'eq'global')";
//					//拼接orderby参数
//					let orderby = "_name";
//					//拼接select参数
//					let $select =
//						"_id,$type,_name,_links,_expirationDateTime,_isPublishingLocked,_locale,subscriptionType,_lastEditedDateTime,_lastPublishedDateTime,_lastPublishedSequence,siteConfig,_headers._latestVersion,_headers._created,_headers._version,_headers._state,_headers._tenant,_headers._lastModifiedBy,_headers._lastModified,_headers._publishedVersion,_headers._checkedOutVersion,_headers._checkedOutBy,_headers._publishedBy,subtype,fileMetadata,description,fileName,href,width,height,forceUserDownload";
//					let para = {
//						$filter: encodeURIComponent(filter),
//						$orderBy: encodeURIComponent(orderby),
//						$select: encodeURIComponent($select),
//						$skip: 0,
//						$top: 500
//					};
//					//接口地址
//					let url = data.data.items[0]._id;
//					const data2 = await getFeeds(para, url);
//					let feeds = data2.data.items;
//					this.feedsData.push(feeds);
//					this.loading = false;
//					console.log(this.feedsData);
//					console.log(this.feedList);
//				} catch(err) {
//					console.error(err);
//				}
//			},
			addListID() {
				this.dialogTitle = "新增 Job List";
				this.dialogFormVisible = true;
			},
			colseDialog() {
				this.dialogFormVisible = false;
				this.listIdValue = "";
				this.addProvider = [];
				this.providerList = [];
				this.feedList = [];
				this.feedsData = [];
				this.value5 = '';
			},
			saveJob() {
				//拼接时间范围 参数
				let now = new Date();
				let past_minutes;
				switch(this.publishValue) {
					case "-1":
						past_minutes = "";
						break;
					case "24h":
						past_minutes = 24 * 60;
						break;
					case "1h":
						past_minutes = 1 * 60;
						break;
					case "7d":
						past_minutes = 7 * 24 * 60;
						break;
					case "30d":
						past_minutes = 30 * 24 * 60;
						break;
					case "12M":
						past_minutes = 365 * 24 * 60;
						break;
				}
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
					});
				} else {
					providerStr = "";
				}
				//拼接feeds参数
				let feedsStr;
				if(this.feedList.length === 0) {
					feedsStr = "";
				} else {
					feedsStr = "";
					let arrFeed = [];
					this.feedList.forEach((item, index) => {
						if(arrFeed.indexOf(item) === -1 && item !== "") {
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
					});
				}
				providerStr += feedsStr !== "" ? "," + feedsStr : "";
				let para = {
					name: this.jobName,
					listId: this.listId,
					keywords: this.q,
					top: this.top,
					sortBy: this.sortValue,
					pastMinutes: past_minutes,
					providers: providerStr,
					triggerConfig: this.triggerConfigValue,
					trigger: this.triggerValue,
					filters: this.filters
				};
				//    console.log(para);
				saveJobList(para)
					.then(data => {
						if(data.data.error) {
							this.$message({
								type: "error",
								message: data.data.error
							});
						} else {
							this.getJobList();
							this.$message({
								type: "success",
								message: "保存成功!"
							});
						}
					})
					.catch(error => {
						this.$message({
							showClose: true,
							message: "保存失败",
							type: "error",
							center: true,
							duration: 10000
						});
					});
				this.colseDialog();
			},
			//恢复
			resumeListID(scope) {
				this.$confirm("是否启动该任务?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: false
					})
					.then(() => {
						let url = scope.row.id;
						// 提交
						resumeJobList(url)
							.then(data => {
								if(data.data.error) {
									this.$message({
										type: "error",
										message: data.data.error
									});
								} else {
									this.getJobList();
									this.$message({
										type: "success",
										message: "启动成功!"
									});
								}
							})
							.catch(error => {
								this.$message({
									showClose: true,
									message: "启动失败",
									type: "error",
									center: true,
									duration: 10000
								});
							});
					})
					.catch(() => {
						console.log("取消");
					});
			},
			//暂停
			pauseListID(scope) {
				this.$confirm("是否停止该任务?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: false
					})
					.then(() => {
						let url = scope.row.id;
						// 提交
						pauseJobList(url)
							.then(data => {
								if(data.data.error) {
									this.$message({
										type: "error",
										message: data.data.error
									});
								} else {
									this.getJobList();
									this.$message({
										type: "success",
										message: "停止成功!"
									});
								}
							})
							.catch(error => {
								this.$message({
									showClose: true,
									message: "停止失败",
									type: "error",
									center: true,
									duration: 10000
								});
							});
					})
					.catch(() => {
						console.log("取消");
					});
			},
			del(scope) {
				this.$confirm("此操作将删除此条任务, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: false
					})
					.then(() => {
						let url = scope.row.id;
						// 提交
						deleteJobList(url)
							.then(data => {
								if(data.data.error) {
									this.$message({
										type: "error",
										message: data.data.error
									});
								} else {
									this.tableData.splice(scope.$index, 1);
									this.$message({
										type: "success",
										message: "删除成功!"
									});
								}
							})
							.catch(error => {
								this.$message({
									showClose: true,
									message: "删除失败！",
									type: "error",
									center: true,
									duration: 10000
								});
							});
					})
					.catch(() => {
						console.log("取消");
					});
			},
			//把选中的预设listID 赋值给listId
			changeListId: function(val) {
				this.listId = val;
			},
			//增加 一组 provider/feeds
			  addProviderSelect: function() {
			    let para = {
			      q: encodeURIComponent(this.value5)
			    };
			    //根据预设provider 获取对应provider 的 id
			    getProvider(para).then(data => {
			    	console.log(data);
			    	this.loading=false;
			    	this.feedList=this.feedList;
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
				this.value5 = "";
				this.historyData = JSON.parse(localStorage.getItem("history"));
			},
			changeFeed: function() {
				this.historyData = JSON.parse(localStorage.getItem("history"));
			},
			//根据 provider ID 获取 feeds
			getFeeds: function(value) {
				//拼接filter参数
				let filter =
					"'_editorial.newsdeskDiscoverable'+eq+'true'and('_locale'eq'en-us'or'_locale'eq'ja-jp'or'_locale'eq'zh-cn'or'_locale'eq'zh-tw'or'_locale'eq'global')";
				//拼接orderby参数
				let orderby = "_name";
				//拼接select参数
				let $select =
					"_id,$type,_name,_links,_expirationDateTime,_isPublishingLocked,_locale,subscriptionType,_lastEditedDateTime,_lastPublishedDateTime,_lastPublishedSequence,siteConfig,_headers._latestVersion,_headers._created,_headers._version,_headers._state,_headers._tenant,_headers._lastModifiedBy,_headers._lastModified,_headers._publishedVersion,_headers._checkedOutVersion,_headers._checkedOutBy,_headers._publishedBy,subtype,fileMetadata,description,fileName,href,width,height,forceUserDownload";
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
			changeTriggerConfig: function() {
				if(typeof this.triggerConfigValue === String) {
					this.triggerConfigValue = "";
				}
				if(this.triggerConfigValue < 0) {
					this.triggerConfigValue = "";
					this.$message({
						type: "warning",
						message: "TriggerConfig(分钟数)必须为大于等于0的整数!"
					});
				}
			}
		},
		mounted() {
			this.getJobList();
		}
	};
</script>

<style scoped lang="scss" type="text/css">
	.el-dialog__body {
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
</style>