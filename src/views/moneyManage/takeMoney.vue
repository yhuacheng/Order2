<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm" size="small">
				<el-form-item label="申请时间">
					<el-date-picker v-model="searchForm.time" :unlink-panels='true' type="datetimerange"
						range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
						value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="提现状态">
					<el-select v-model="searchForm.state" placeholder="状态">
						<el-option :value="0" label="全部"></el-option>
						<el-option :value="1" label="待处理"></el-option>
						<el-option :value="2" label="提现成功"></el-option>
						<el-option :value="3" label="提现失败"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="searchData">查询</el-button>
					<el-button @click="resetSearch">重置</el-button>
				</el-form-item>
				<el-form-item label="账户余额"
					style="border: 1px solid #E6A23C;border-radius: 4px;padding: 0 15px;height: 30px;line-height: 30px;">
					<span class="success fz16 bold">{{balance}}</span>
				</el-form-item>
				<el-tooltip content="可用余额 = 账户余额 - 待处理提现金额" placement="top">
					<el-form-item label="可用余额"
						style="border: 1px solid #F56C6C;border-radius: 4px;padding: 0 15px;height: 30px;line-height: 30px;">
						<span class="success fz16 bold">{{OKbalance}}</span>
					</el-form-item>
				</el-tooltip>
				<el-form-item>
					<span v-if="OKbalance>0">
						<el-button type="primary" @click="handtakeModal">申请提现</el-button>
					</span>
					<span v-else>
						<el-tooltip content="可用余额不足，不可提现" placement="top">
							<el-button type="info">申请提现</el-button>
						</el-tooltip>
					</span>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table border :data="tableData" v-loading="listLoading" id="exportTable" style="width: 100%"
			:header-cell-style="{background:'#fafafa'}" ref="table">
			<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
			<el-table-column prop="RemoveMoenyNumber" label="流水号" align="center"></el-table-column>
			<el-table-column prop="RemoveMoeny" label="提现金额" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyTime" label="申请时间" align="center"></el-table-column>
			<el-table-column prop="BankAccount" label="银行账号" align="center"></el-table-column>
			<el-table-column prop="Bank" label="开户银行" align="center"></el-table-column>
			<el-table-column prop="BankName" label="开户姓名" align="center"></el-table-column>
			<el-table-column prop="RemoveMoenyStae" label="状态" align="center">
				<template v-slot="scope">
					<span v-if="scope.row.RemoveMoenyStae===1">待处理</span>
					<span class="success" v-if="scope.row.RemoveMoenyStae===2">提现成功</span>
					<span class="danger" v-if="scope.row.RemoveMoenyStae===3">提现失败</span>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="10"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-col>

		<!-- 提现 -->
		<el-dialog :title="title" :visible.sync="editModal" :close-on-click-modal="false" :before-close="closeModal"
			width="30%">
			<el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
				<el-form-item label="可用余额">
					<span class="danger">{{OKbalance}}</span>
					<span class="warning ml10">(可用余额 = 账户余额 - 待处理提现金额)</span>
				</el-form-item>
				<el-form-item label="提现金额" prop="money">
					<el-input v-model="editForm.money"></el-input>
				</el-form-item>
				<el-form-item label="银行账号" prop="account">
					<el-input v-model="editForm.account"></el-input>
				</el-form-item>
				<el-form-item label="开户银行" prop="bank">
					<el-input v-model="editForm.bank"></el-input>
				</el-form-item>
				<el-form-item label="开户姓名" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeModal">取消</el-button>
				<el-button type="primary" @click="addSubmit" :loading="btnLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import {
		takeMoneyList,
		takeMoneyAdd,
		userInfo,
		noDoMoney
	} from '@/api/api'

	export default {
		name: 'takeMoney',
		data() {
			let checkMoney = (rule, value, callback) => {
				const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
				if (!value) {
					return callback(new Error('提现金额不能为空'));
				} else if (!reg.test(value)) {
					callback(new Error('提现金额格式不正确'));
				} else if (Number(value) > Number(this.OKbalance)) {
					callback(new Error('提现金额不能大于剩余可提现金额'));
				} else {
					callback();
				}
			};
			return {
				title: '',
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				doType: '',
				editModal: false,
				listLoading: false,
				btnLoading: false,
				tableData: [],
				selsData: [],
				selectId: '',
				searchForm: {
					time: [],
					keyWord: '',
					state: 0
				},
				editForm: {
					money: '',
					account: '',
					bank: '',
					name: ''
				},
				rules: {
					money: [{
							required: true,
							message: '请输入提现金额',
							trigger: 'blur'
						},
						{
							validator: checkMoney,
							trigger: 'blur',
						}
					],
					account: [{
						required: true,
						message: '请输入提现银行账号',
						trigger: 'blur'
					}],
					bank: [{
						required: true,
						message: '请输入开户银行',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入开户姓名',
						trigger: 'blur'
					}]
				},
				balance: 0,
				OKbalance: 0
			}
		},
		created() {
			this.getData()
			this.getBalance()
		},
		methods: {
			// 获取列表数据
			getData() {
				let _this = this
				_this.listLoading = true
				let time = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (time != '' && time != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let params = {
					userId: sessionStorage.getItem('userId'),
					statetime: time1,
					endtime: time2,
					kWord: _this.searchForm.keyWord,
					state: _this.searchForm.state,
					pageIndex: _this.pageIndex,
					pageSize: _this.pageSize
				}
				takeMoneyList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.Entity
					_this.total = Number(res.TotalCount)
				}).catch((e) => {})
			},

			// 获取余额信息
			getBalance() {
				let _this = this
				let params = {
					Id: sessionStorage.getItem('userId')
				}
				userInfo(params).then(res => {
					_this.balance = Number(res.AccountBalance)
					_this.getNoDoMoney()
				}).catch((e) => {})
			},

			// 获取提现待处理总金额并计算剩余可提现金额
			getNoDoMoney() {
				let _this = this
				let params = {
					userId: sessionStorage.getItem('userId')
				}
				noDoMoney(params).then(res => {
					let money = Number(res.Money)
					_this.OKbalance = _this.balance - money
				}).catch((e) => {})
			},

			//打开提现弹窗
			handtakeModal() {
				let _this = this
				_this.editModal = true
				_this.title = '申请提现'
			},

			//提现新增
			addSubmit() {
				let _this = this
				_this.$refs.editForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							removeMoney: _this.editForm.money,
							BankAccount: _this.editForm.account,
							Bank: _this.editForm.bank,
							BankName: _this.editForm.name,
							Id: sessionStorage.getItem('userId')
						}
						takeMoneyAdd(params).then(res => {
							_this.btnLoading = false
							_this.closeModal()
							_this.getData()
							_this.getBalance()
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//关闭提现弹窗
			closeModal() {
				let _this = this
				_this.editModal = false
				_this.btnLoading = false
				_this.$refs['editForm'].resetFields()
				_this.editForm = {
					money: '',
					account: '',
					bank: '',
					name: ''
				}
			},

			//查询
			searchData() {
				let _this = this
				_this.pageIndex = 1
				_this.getData()
			},

			//重置
			resetSearch() {
				let _this = this
				_this.pageIndex = 1
				_this.searchForm.time = []
				_this.searchForm.keyWord = ''
				_this.searchForm.state = 0
				_this.getData()
			},

			//选中数据
			selsChange(selsData) {
				this.selsData = selsData
			},

			//翻页
			handleSizeChange(val) {
				let _this = this
				_this.pageSize = val
				_this.getData()
			},
			handleCurrentChange(val) {
				let _this = this
				_this.pageIndex = val
				_this.getData()
			}

		}
	}
</script>
