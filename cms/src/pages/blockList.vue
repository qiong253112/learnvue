<template>
	<div>
		<el-row>
			<el-input placeholder="请输入内容" v-model="inputValue">
				<el-button slot="append" icon="el-icon-plus" @click="add">新增词条</el-button>
			</el-input>
		</el-row>
		<el-row>
			<el-card v-for="(o,index) in blockListData" :key="index" shadow="hover">
				<div class="text">
					{{o}}
					<span @click="del(o,index)">
						<i class="el-icon-delete"></i>
					</span>
				</div>
			</el-card>
		</el-row>
	</div>
</template>
<script>
	import { getBlockList, modifyBlockList } from '../api/api';

	export default {
		name: 'blockList',
		data() {
			return {
				inputValue: '',
				blockListData: [],
			}
		},
		methods: {
			getBlockList() {
				getBlockList().then(data => {
					this.blockListData = data.data.keywords;

				}).catch(error => {
					console.log(error);
				})
			},
			add() {
				if(this.inputValue) {
					if(this.blockListData.includes(this.inputValue)){
						return this.$message({
								type: 'warning',
								message: "列表中已包含该名单"
							});
					};
					let para = {
						action: "add",
						value: this.inputValue
					}
					modifyBlockList(para).then(data => {
						if(data.data.error) {
							this.$message({
								type: 'error',
								message: data.data.error
							});
						} else {
							this.getBlockList();
							this.$message({
								type: 'success',
								message: '添加成功!'
							});
						}

					}).catch(error => {
						console.log(error);
					})
				}

			},
			del(item, index) {
				this.$confirm('此操作将删除该名单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let para = {
						action: "remove",
						value: item
					}
					modifyBlockList(para).then(data => {
						if(data.data.error) {
							this.$message({
								type: 'error',
								message: data.data.error
							});
						} else {
							this.getBlockList();
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}

					}).catch(error => {
						console.log(error);
					})

				}).catch(() => {
					console.log('取消');
				});

			}

		},
		mounted() {
			this.getBlockList();
		}
	}
</script>

<style scoped lang="scss" type="text/css">
	.el-card {
		display: inline-block;
		margin: 10px;
		/*width: 140px;*/
	}
	
	.el-card__body {
		padding: 0 !important;
	}
	
	.text {
		display: flex;
		justify-content: space-between;
		align-content: center;
		span {
			color: red;
			margin-left: 25px;
			i {
				vertical-align: middle;
			}
		}
	}
	
	.el-input-group {
		width: 30%;
		margin-left: 10px;
	}
</style>