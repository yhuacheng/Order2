<template>
	<section class="main-box">
		<el-card class="userinfo">
			<el-form :model="infoForm" ref="infoForm" label-width='80px'>
				<el-form-item label="手机：" prop="phone">
					<span>{{infoForm.phone}}</span>
					<!-- <el-button type="text"><i class="el-icon-edit"></i> 修改</el-button> -->
				</el-form-item>
				<el-form-item label="姓名：" prop="name">
					<span>{{infoForm.name}}</span>
					<el-button type="text" @click="handleName"><i class="el-icon-edit"></i> 修改</el-button>
				</el-form-item>
				<el-form-item label="QQ：" prop="loginname">
					<span>{{infoForm.qq}}</span>
					<el-button type="text" @click="handleQQ"><i class="el-icon-edit"></i> 修改</el-button>
				</el-form-item>
				<el-form-item label="微信：" prop="wechat">
					<span>{{infoForm.wechart}}</span>
					<el-button type="text" @click="handleWeChat"><i class="el-icon-edit"></i> 修改</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</section>
</template>

<script>
	import {
		userInfo,
		editName,
		editQQ,
		editWeChat
	} from '@/api/api'

	export default {
		name: 'userInfo',
		data() {
			return {
				infoForm: {
					phone: '',
					name: '',
					qq: '',
					wechat: ''
				}
			}
		},
		created() {
			this.getUserInfo()
		},
		methods: {
			// 获取个人信息
			getUserInfo() {
				let _this = this
				let params = {
					Id: sessionStorage.getItem('userId')
				}
				userInfo(params).then(res => {
					_this.infoForm.phone = res[0].phone
					_this.infoForm.name = res[0].name
					_this.infoForm.qq = res[0].qq ? res[0].qq : '未填写'
					_this.infoForm.wechat = res[0].wecate ? res[0].wechat : '未填写'
				}).catch((e) => {})
			},

			//修改姓名
			handleName() {
				let _this = this
				_this.$prompt('请输入姓名', '信息提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /\S/,
					inputErrorMessage: '姓名不能为空'
				}).then(({
					value
				}) => {
					let params = {
						Id: sessionStorage.getItem('userId'),
						Name: value
					}
					editName(params).then(res => {
						sessionStorage.setItem('userName', value)
						_this.getUserInfo()
					}).catch(() => {})
				}).catch(() => {})
			},

			//修改QQ
			handleQQ() {
				let _this = this
				_this.$prompt('请输入QQ', '信息提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /\S/,
					inputErrorMessage: 'QQ不能为空'
				}).then(({
					value
				}) => {
					let params = {
						Id: sessionStorage.getItem('userId'),
						QQ: value
					}
					editQQ(params).then(res => {
						_this.getUserInfo()
					}).catch(() => {})
				}).catch(() => {})
			},

			//修改微信
			handleWeChat() {
				let _this = this
				_this.$prompt('请输入微信', '信息提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /\S/,
					inputErrorMessage: '微信不能为空'
				}).then(({
					value
				}) => {
					let params = {
						Id: sessionStorage.getItem('userId'),
						WeChat: value
					}
					editWeChat(params).then(res => {
						_this.getUserInfo()
					}).catch(() => {})
				}).catch(() => {})
			}
		}
	}
</script>

<style scoped>
	.userinfo {
		padding: 30px 10%;
	}

	.userinfo .el-form-item {
		border-bottom: 1px dashed #ccc;
	}

	.userinfo .el-form-item span {
		margin-right: 50px;
	}
</style>
