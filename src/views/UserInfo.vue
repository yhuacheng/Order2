<template>
	<section class="main-box">
		<el-card class="userinfo">
			<el-form :model="infoForm" ref="infoForm" label-width='80px'>
				<el-form-item label="手机：" prop="phone">
					<span>{{infoForm.phone}}</span>
					<el-button type="text" @click="editModal=true"><i class="el-icon-edit"></i> 修改</el-button>
				</el-form-item>
				<el-form-item label="姓名：" prop="name">
					<span>{{infoForm.name}}</span>
					<el-button type="text" @click="handleName"><i class="el-icon-edit"></i> 修改</el-button>
				</el-form-item>
				<el-form-item label="Q Q：" prop="loginname">
					<span>{{infoForm.qq}}</span><span v-if="!infoForm.qq">未填写</span>
					<el-button type="text" @click="handleQQ"><i class="el-icon-edit"></i> 修改</el-button>
				</el-form-item>
				<el-form-item label="微信：" prop="wechat">
					<span>{{infoForm.wechat}}</span><span v-if="!infoForm.wechat">未填写</span>
					<el-button type="text" @click="handleWeChat"><i class="el-icon-edit"></i> 修改</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 修改手机号 -->
		<el-dialog title="手机号修改" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal"
			width="500px">
			<div v-if="show=='step1'" :key='1'>
				<el-form :model="step1Form" :rules="step1Rules" ref="step1Form" label-width="100px">
					<el-form-item label="手机号：" prop="phone">
						<el-input v-model="step1Form.phone" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="验证码：" prop="phoneCode">
						<el-input v-model="step1Form.phoneCode" placeholder="请输入手机验证码" style="width: 200px;"></el-input>
						<el-button type="primary" :disabled="disabledClick" @click="handlePhoneCode"
							style="float: right">
							{{btnTxt}}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div v-if="show=='step2'" :key='2'>
				<el-form :model="step2Form" :rules="step2Rules" ref="step2Form" label-width="100px">
					<el-form-item label="新手机号：" prop="newPhone">
						<el-input v-model="step2Form.newPhone" placeholder="请输入新手机号"></el-input>
					</el-form-item>
					<el-form-item label="验证码：" prop="newCode">
						<el-input v-model="step2Form.newCode" placeholder="请输入新手机验证码" style="width: 200px;"></el-input>
						<el-button type="primary" :disabled="disabledClick2" @click="handlePhoneCode2"
							style="float: right">
							{{btnTxt2}}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div v-if="show=='step1'" slot="footer" class="dialog-footer">
				<el-button @click="closeModal">取消</el-button>
				<el-button type="primary" @click="nextStep">下一步</el-button>
			</div>
			<div v-if="show=='step2'" slot="footer" class="dialog-footer">
				<el-button @click="closeModal">取消</el-button>
				<el-button type="primary" @click="editPhone">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import {
		userInfo,
		editName,
		editQQ,
		editWeChat,
		oldPhoneCode,
		oldPhoneCodeCheck,
		newPhoneCode,
		editPhone
	} from '@/api/api'

	export default {
		name: 'userInfo',
		data() {
			// 手机号验证
			const validatePhone = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请输入手机号"));
					this.disabledClick2 = true
				} else {
					if (!/^1[3456789]\d{9}$/.test(value)) {
						callback(new Error("请输入正确的手机号"));
						this.disabledClick2 = true
					} else {
						callback()
						this.disabledClick2 = false
					}
				}
			}
			return {
				infoForm: {
					phone: '',
					name: '',
					qq: '',
					wechat: ''
				},
				editModal: false,
				show: 'step1',
				step1Form: {
					phone: '',
					phoneCode: '',
					newPhone: '',
					newCode: ''
				},
				step2Form: {
					newPhone: '',
					newCode: ''
				},
				step1Rules: {
					phone: {
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					phoneCode: {
						required: true,
						message: '请输入手机验证码',
						trigger: 'blur'
					}
				},
				step2Rules: {
					newPhone: [{
						required: true,
						message: '请输入新手机号',
						trigger: 'blur'
					}, {
						validator: validatePhone,
						trigger: "change"
					}],
					newCode: {
						required: true,
						message: '请输入新手机验证码',
						trigger: 'blur'
					}
				},
				btnTxt: "获取验证码",
				totalTime: 60,
				disabledClick: false, // 节流
				clockTimer: null, // 定时器
				btnTxt2: "获取验证码",
				totalTime2: 60,
				disabledClick2: true, // 节流
				clockTimer2: null // 定时器
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
					_this.infoForm.phone = res.Phone
					_this.infoForm.name = res.Name.trim()
					_this.infoForm.qq = res.QQ
					_this.infoForm.wechat = res.WeCate
					_this.step1Form.phone = res.Phone
				}).catch((e) => {})
			},

			//修改姓名
			handleName() {
				let _this = this
				_this.$prompt('请输入姓名', '信息提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					inputPattern: /\S/,
					inputErrorMessage: '姓名不能为空',
					inputValue: _this.infoForm.name
				}).then(({
					value
				}) => {
					let params = {
						Id: sessionStorage.getItem('userId'),
						Name: value
					}
					editName(params).then(res => {
						sessionStorage.setItem('userName', value)
						location.reload()
					}).catch(() => {})
				}).catch(() => {})
			},

			//修改QQ
			handleQQ() {
				let _this = this
				_this.$prompt('请输入QQ', '信息提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					inputPattern: /\S/,
					inputErrorMessage: 'QQ不能为空',
					inputValue: _this.infoForm.qq
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
					closeOnClickModal: false,
					inputPattern: /\S/,
					inputErrorMessage: '微信不能为空',
					inputValue: _this.infoForm.wechat
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
			},

			//修改手机号
			editPhone() {
				let _this = this
				_this.$refs.step2Form.validate((valid) => {
					if (valid) {
						let param = {
							Id: sessionStorage.getItem('userId'),
							Phone: _this.step2Form.newPhone,
							Code: _this.step2Form.newCode
						}
						editPhone(param).then(res => {
							_this.getUserInfo()
							_this.closeModal()
						}).catch(() => {})
					}
				})
			},

			// 关闭修改手机号弹窗
			closeModal() {
				let _this = this
				if (_this.show == 'step1') {
					_this.$refs['step1Form'].resetFields()
				} else {
					_this.$refs['step2Form'].resetFields()
				}
				_this.editModal = false
				_this.show = 'step1'
				_this.step1Form.phoneCode = ''
				_this.step2Form.newPhone = ''
				_this.step2Form.newCode = ''
			},

			//下一步
			nextStep() {
				let _this = this
				_this.$refs.step1Form.validate((valid) => {
					if (valid) {
						let param = {
							Code: _this.step1Form.phoneCode
						}
						oldPhoneCodeCheck(param).then(res => {
							_this.show = 'step2'
						}).catch((e) => {})
					}
				})
			},

			//点击获取旧手机验证码
			handlePhoneCode() {
				let _this = this
				window.clearInterval(_this.clockTimer)
				if (_this.disabledClick) return // 节流 防止频繁访问接口
				_this.getOldPhoneCode()
				_this.disabledClick = true
				_this.btnTxt = _this.totalTime + '秒后重新获取'
				_this.clockTimer = window.setInterval(() => {
					_this.totalTime--
					_this.btnTxt = _this.totalTime + '秒后重新获取'
					if (_this.totalTime === 0) {
						window.clearInterval(_this.clockTimer)
						_this.btnTxt = '获取验证码'
						_this.totalTime = 60
						_this.disabledClick = false
					}
				}, 1000)
			},

			//修改获取旧手机验证码
			getOldPhoneCode() {
				let _this = this
				let params = {
					Phone: _this.step1Form.phone
				}
				oldPhoneCode(params).then(res => {}).catch((e) => {})
			},

			//点击获取新验证码
			handlePhoneCode2() {
				let _this = this
				window.clearInterval(_this.clockTimer2)
				if (_this.disabledClick2) return // 节流 防止频繁访问接口
				_this.getNewPhoneCode()
				_this.disabledClick2 = true
				_this.btnTxt2 = _this.totalTime2 + '秒后重新获取'
				_this.clockTimer2 = window.setInterval(() => {
					_this.totalTime2--
					_this.btnTxt2 = _this.totalTime2 + '秒后重新获取'
					if (_this.totalTime2 === 0) {
						window.clearInterval(_this.clockTimer2)
						_this.btnTxt2 = '获取验证码'
						_this.totalTime2 = 60
						_this.disabledClick2 = false
					}
				}, 1000)
			},

			//注册获取新手机验证码
			getNewPhoneCode() {
				let _this = this
				let params = {
					Phone: _this.step2Form.newPhone
				}
				newPhoneCode(params).then(res => {}).catch((e) => {})
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
		width: 200px;
		display: block;
		float: left;
	}
</style>
