<template>
	<section class="main-box">
		<el-card>
			<div class="card-box">
				<el-row>
					<el-col :span="3" :xs="12">
						<el-card shadow="hover" class="item item1" :class="{'active':isActive==1}"
							@mouseenter.native="isActive=1" @mouseleave.native="isActive=null">
							<p>总任务</p>
							<div class="num primary">{{all}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item item2" :class="{'active':isActive==2}"
							@mouseenter.native="isActive=2" @mouseleave.native="isActive=null">
							<p>进行中</p>
							<div class="num warning">{{doing}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item item3" :class="{'active':isActive==3}"
							@mouseenter.native="isActive=3" @mouseleave.native="isActive=null">
							<p>已完成</p>
							<div class="num success">{{complete}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item item4" :class="{'active':isActive==4}"
							@mouseenter.native="isActive=4" @mouseleave.native="isActive=null">
							<p>已取消</p>
							<div class="num danger">{{cancel}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item item5" :class="{'active':isActive==5}"
							@mouseenter.native="isActive=5" @mouseleave.native="isActive=null">
							<p>余额</p>
							<div class="num success">{{balance}}</div>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item item6" :class="{'active':isActive==6}"
							@mouseenter.native="isActive=6" @mouseleave.native="isActive=null"
							@click.native="$router.push('/order')">
							<h3 class="primary">下单</h3>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item item7" :class="{'active':isActive==7}"
							@mouseenter.native="isActive=7" @mouseleave.native="isActive=null"
							@click.native="addMoneyModal=true">
							<h3 class="success">充值</h3>
						</el-card>
					</el-col>
					<el-col :md="3" :xs="12">
						<el-card shadow="hover" class="item item8" :class="{'active':isActive==8}"
							@mouseenter.native="isActive=8" @mouseleave.native="isActive=null"
							@click.native="$router.push('/moneyDetails')">
							<h3 class="warning">账单</h3>
						</el-card>
					</el-col>
				</el-row>
			</div>
		</el-card>

		<el-row :gutter="30">
			<el-col :md="18">
				<el-card class="mt30">
					<div slot="header">
						<span>系统公告</span>
					</div>
					<div v-html="notice"></div>
				</el-card>
			</el-col>
			<el-col :md="6">
				<el-card class="mt30">
					<div slot="header">
						<span>汇率 / 服务费 / 增值费</span>
					</div>
					<div class="tab-title">汇率</div>
					<el-table :data="rateData" v-loading="listLoading1" border style="width: 100%">
						<el-table-column prop="CurrencyName" label="币种" align="center"></el-table-column>
						<el-table-column prop="CurrencySymbol" label="符号" align="center"></el-table-column>
						<el-table-column prop="ExchangeRate" label="汇率" align="center"></el-table-column>
					</el-table>
					<div class="tab-title mt20">服务费</div>
					<el-table :data="feeData" v-loading="listLoading2" border style="width: 100%">
						<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
						<el-table-column prop="Probability" label="留评率" align="center"></el-table-column>
						<el-table-column prop="FeePrice" label="服务费" align="center"></el-table-column>
					</el-table>
					<div class="tab-title mt20">增值费</div>
					<el-table :data="addFeeData" v-loading="listLoading3" border style="width: 100%">
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

		<!-- 充值 -->
		<el-dialog title="充值" :visible.sync="addMoneyModal" :close-on-click-modal="false" width="20%" center>
			<div class="txt-c">
				<div class="mt10">请选择以下方式充值</div>
				<div v-for="(item,index) in payMentData" :key='index' class="mt20"
					style="border: 1px dashed #eee;padding: 15px 0;">
					<div class="warning" style="font-weight: bold;">
						<span v-if="item.PaymentState==1">支付宝</span>
						<span v-if="item.PaymentState==2">微信</span>
						<span v-if="item.PaymentState==3">银行卡</span>
					</div>
					<img v-if="item.Image" :src="$IMG_URL_BACK+item.Image" style="width: 150px;margin-top: 10px;">
					<div class="mt5">
						<div v-if="item.PaymentState==3 && item.Remarks">{{item.Remarks}}</div>
						<div class="mt5"><span>{{item.PaymentName}}</span><span
								class="ml5">{{item.AccountNumber}}</span></div>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addMoneyModal=false">关闭</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import {
		taskSum,
		userInfo,
		notice,
		rateList,
		feeList,
		addFeeList,
		payMent
	} from '@/api/api'

	export default {
		name: 'Main',
		data() {
			return {
				isActive: null,
				all: 0,
				doing: 0,
				complete: 0,
				cancel: 0,
				balance: 0,
				notice: '',
				listLoading1: false,
				listLoading2: false,
				listLoading3: false,
				rateData: [],
				feeData: [],
				addFeeData: [],
				addMoneyModal: false,
				payMentData: []
			}
		},
		created() {
			this.getTaskSum()
			this.getBalance()
			this.getNotice()
			this.getRateData()
			this.getFeeData()
			this.getAddFeeData()
			this.addMoney()
		},
		methods: {
			//获取各状态任务数量
			getTaskSum() {
				let _this = this
				let params = {
					uid: sessionStorage.getItem('userId')
				}
				taskSum(params).then(res => {
					_this.all = Number(res.TotalCount)
					_this.doing = Number(res.OrderStateInOne)
					_this.complete = Number(res.OrderStateInTwo)
					_this.cancel = Number(res.OrderStateInThree)
				}).catch(error => {})
			},

			// 获取余额信息
			getBalance() {
				let _this = this
				let params = {
					Id: sessionStorage.getItem('userId')
				}
				userInfo(params).then(res => {
					_this.balance = Number(res.AccountBalance)
				}).catch((e) => {})
			},

			// 获取公告数据
			getNotice() {
				let _this = this
				let params = {}
				notice(params).then(res => {
					_this.notice = res[0].Notice
				}).catch((e) => {})
			},

			//获取汇率数据
			getRateData() {
				let _this = this
				_this.listLoading1 = true
				rateList().then((res) => {
					_this.listLoading1 = false
					let data = res
					let unData = _this.unique(data, 'CurrencyName')
					_this.rateData = unData
				}).catch(err => {})
			},

			//去重方法
			unique(arr, u_key) {
				let map = new Map()
				arr.forEach((item, index) => {
					if (!map.has(item[u_key])) {
						map.set(item[u_key], item)
					}
				})
				return [...map.values()]
			},

			//获取服务费数据
			getFeeData() {
				let _this = this
				_this.listLoading2 = true
				feeList().then((res) => {
					_this.listLoading2 = false
					_this.feeData = res
				}).catch(err => {})
			},

			//获取增值服务费
			getAddFeeData() {
				let _this = this
				_this.listLoading3 = true
				addFeeList().then((res) => {
					_this.listLoading3 = false
					_this.addFeeData = res
				}).catch(err => {})
			},

			//获取充值方式
			addMoney() {
				let _this = this
				payMent().then(res => {
					_this.payMentData = res
				}).catch(err => {})
			}

		}
	}
</script>
