<template>
	<section class="main-box">
		<el-card>
			<div class="card-box">
				<el-row class="card-box">
					<el-col :span="3" :xs="12">
						<el-card shadow="hover" class="item">
							<p>总任务</p>
							<div class="num primary">{{all}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item">
							<p>进行中</p>
							<div class="num warning">{{doing}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item">
							<p>已完成</p>
							<div class="num success">{{complete}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item">
							<p>已取消</p>
							<div class="num danger">{{cancel}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item">
							<p>余额</p>
							<div class="num success">{{balance}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item">
							<el-button class="btn" plain type="primary" size="mini" @click="$router.push('/order')">下单</el-button>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item">
							<el-button class="btn" plain type="danger" size="mini" @click="$router.push('/takeMoney')">提现</el-button>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item">
							<el-button class="btn" plain type="warning" size="mini" @click="$router.push('/moneyDetails')">账单</el-button>
						</el-card>
					</el-col>
				</el-row>
			</div>
		</el-card>

		<el-row :gutter="30">
			<el-col :md="18">
				<el-card class="mt30">
					<div slot="header">
						<span>公告</span>
					</div>
					<div v-html="notice"></div>
				</el-card>
			</el-col>
			<el-col :md="6">
				<el-card class="mt30">
					<div slot="header">
						<span>汇率 / 服务费 / 增值费 公示</span>
					</div>
					<div class="tab-title">汇率</div>
					<el-table :data="rateData" border style="width: 100%">
						<el-table-column prop="CurrencyName" label="币种" align="center"></el-table-column>
						<el-table-column prop="CurrencySymbol" label="单位" align="center"></el-table-column>
						<el-table-column prop="ExchangeRate" label="汇率" align="center"></el-table-column>
					</el-table>
					<div class="tab-title mt20">服务费</div>
					<el-table :data="feeData" border style="width: 100%">
						<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
						<el-table-column prop="Probability" label="留评率" align="center" width='100'></el-table-column>
						<el-table-column prop="FeePrice" label="服务费" align="center" width='150'></el-table-column>
					</el-table>
					<div class="tab-title mt20">增值费</div>
					<el-table :data="addFeeData" border style="width: 100%">
						<el-table-column prop="productPrice" label="价格区间" align="center">
							<template slot-scope="scope">
								{{scope.row.Start}} - {{scope.row.Ent}}
							</template>
						</el-table-column>
						<el-table-column prop="IServiceFee" label="增值费" align="center"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>

	</section>
</template>

<script>
	import {
		taskSum,
		userInfo,
		notice,
		rateList,
		feeList,
		addFeeList
	} from '@/api/api'

	export default {
		name: 'Main',
		data() {
			return {
				all: 0,
				doing: 0,
				complete: 0,
				cancel: 0,
				balance: 0,
				notice: '',
				rateData: [],
				feeData: [],
				addFeeData: []
			}
		},
		created() {
			this.getTaskSum()
			this.getBalance()
			this.getNotice()
			this.getRateData()
			this.getFeeData()
			this.getAddFeeData()
		},
		methods: {
			//获取各状态任务数量
			getTaskSum() {
				let _this = this
				let params = {
					uid: sessionStorage.getItem('userId')
				}
				taskSum(params).then(res => {
					_this.all = Number(res.list[0].TotalCount)
					_this.doing = Number(res.list[0].HaveInHandByTask)
					_this.complete = Number(res.list[0].CompleteTask)
					_this.cancel = Number(res.list[0].CancelTask)
				}).catch(error => {})
			},

			// 获取余额信息
			getBalance() {
				let _this = this
				let params = {
					Id: sessionStorage.getItem('userId')
				}
				userInfo(params).then(res => {
					_this.balance = res[0].accountbalance
				}).catch((e) => {})
			},

			// 获取公告数据
			getNotice() {
				let _this = this
				_this.listLoading = true
				let params = {}
				notice(params).then(res => {
					_this.notice = res[0].Notice
				}).catch((e) => {})
			},

			//获取汇率数据
			getRateData() {
				let _this = this
				rateList().then((res) => {
					_this.rateData = res.list
				}).catch(err => {})
			},

			//获取服务费数据
			getFeeData() {
				let _this = this
				feeList().then((res) => {
					_this.feeData = res.list
				}).catch(err => {})
			},

			//获取增值服务费
			getAddFeeData() {
				let _this = this
				addFeeList().then((res) => {
					_this.addFeeData = res.list
				}).catch(err => {})
			}

		}
	}
</script>
