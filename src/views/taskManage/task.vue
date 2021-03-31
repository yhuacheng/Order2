<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm" size="small">
				<el-form-item label="搜索内容">
					<el-input @keyup.native="searchToTrim" v-model="searchForm.searchWords" placeholder="任务号/产品名称/购买单号" style="width: 220px;"></el-input>
				</el-form-item>
				<el-form-item label="国家">
					<el-select v-model="searchForm.country" placeholder="请选择国家" style="width: 120px;">
						<el-option :value="0" label="全部"></el-option>
						<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务类型">
					<el-select v-model="searchForm.serveType" placeholder="请选择" style="width: 140px;">
						<el-option value="0" label="全部"></el-option>
						<el-option value="1" label="评后返(代返)"></el-option>
						<el-option value="2" label="评后返(自返)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="购买时间">
					<el-date-picker v-model="searchForm.time" :unlink-panels='true' type="datetimerange" range-separator="至"
					 start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button @click="searchData">查询</el-button>
					<el-button @click="resetSearch">重置</el-button>
				</el-form-item>
				</el-row>
			</el-form>
		</el-col>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出任务</el-button>
			<div class="tagMenu">
				<el-badge :value="all" type="success" class="item">
					<el-button size="mini" @click='searchStateData(0)' :class="{'active':searchForm.state==0}">全部</el-button>
				</el-badge>
				<el-badge :value="dfp" type="info" class="item">
					<el-button size="mini" @click='searchStateData(1)' :class="{'active':searchForm.state==1}">待分配</el-button>
				</el-badge>
				<el-badge :value="dgm" type="warning" class="item">
					<el-button size="mini" @click='searchStateData(2)' :class="{'active':searchForm.state==2}">待购买</el-button>
				</el-badge>
				<el-badge :value="dqrcd" type="primary" class="item">
					<el-button size="mini" @click='searchStateData(3)' :class="{'active':searchForm.state==3}">待确认出单</el-button>
				</el-badge>
				<el-badge :value="dpj" type="warning" class="item">
					<el-button size="mini" @click='searchStateData(4)' :class="{'active':searchForm.state==4}">待评价</el-button>
				</el-badge>
				<el-badge :value="dqrpj" type="primary" class="item">
					<el-button size="mini" @click='searchStateData(5)' :class="{'active':searchForm.state==5}">待确认评价</el-button>
				</el-badge>
				<el-badge :value="ywc" type="success" class="item">
					<el-button size="mini" @click='searchStateData(6)' :class="{'active':searchForm.state==6}">已完成</el-button>
				</el-badge>
				<el-badge :value="yqx" type="danger" class="item">
					<el-button size="mini" @click='searchStateData(7)' :class="{'active':searchForm.state==7}">已取消</el-button>
				</el-badge>
				<el-badge :value="error" type="warning">
					<el-button size="mini" @click='searchStateData(8)' :class="{'active':searchForm.state==8}">异常</el-button>
				</el-badge>
			</div>
		</el-col>

		<!--列表-->
		<el-table border :data="tableData" v-loading="listLoading" id="exportTable" style="width: 100%" :header-cell-style="{background:'#fafafa'}"
		 ref="table">
			<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
			<el-table-column prop="OrderNumbers" label="任务编号" align="center" width="160">
				<template slot-scope="scope">
					<el-link type="primary" :underline="false" @click.stop="viewModalShow(scope.$index,scope.row)">{{scope.row.OrderNumbers}}</el-link>
				</template>
			</el-table-column>
			<el-table-column prop="ServiceType" label="任务类型" align="center" width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.ServiceType==1">评后返(代返)</span>
					<span v-if="scope.row.ServiceType==2">评后返(自返)</span>
				</template>
			</el-table-column>
			<el-table-column prop="countryName" label="国家" align="center"></el-table-column>
			<el-table-column prop="ProductName" label="产品名称" align="center" :show-overflow-tooltip='true'></el-table-column>
			<el-table-column prop="OrderShopName" label="店铺" align="center" :show-overflow-tooltip='true'></el-table-column>
			<el-table-column prop="Asin" label="ASIN" align="center" width="110"></el-table-column>
			<el-table-column prop="AmazonNumber" label="购买单号" align="center"></el-table-column>
			<el-table-column prop="AmazonProductPrice" label="购买价格" align="center"></el-table-column>
			<el-table-column prop="BuyTime" label="购买时间" align="center" width="160"></el-table-column>
			<el-table-column prop="PayAccount" label="返款账号" align="center"></el-table-column>
			<el-table-column prop="TaskState" label="状态" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.TaskState==1">待分配</span>
					<span v-if="scope.row.TaskState==2" class="warning">待购买</span>
					<span v-if="scope.row.TaskState==3" class="primary">待确认出单</span>
					<span v-if="scope.row.TaskState==4" class="warning">待评价</span>
					<span v-if="scope.row.TaskState==5" class="primary">待确认评价</span>
					<span v-if="scope.row.TaskState==6" class="success">已完成</span>
					<span v-if="scope.row.TaskState==7" class="danger">已取消</span>
					<span v-if="scope.row.TaskState==8" class="warning">异常</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="145">
				<template slot-scope="scope">
					<el-button size="small" v-if="scope.row.TaskState==1" type="danger" @click="cancelHandel(scope.$index,scope.row)">取消</el-button>
					<el-button size="small" type="primary" v-if="scope.row.TaskState==3" @click="confirmBtn(scope.$index,scope.row)">确认订单</el-button>
					<el-button size="small" v-if="scope.row.TaskState==5" type="success" @click="evalEdit(scope.$index,scope.row,1)">确认评价</el-button>
					<el-button size="small" v-if="scope.row.TaskState==6 && scope.row.ServiceType=='2'" type="success" @click="evalEdit(scope.$index,scope.row,2)">补充返款信息</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageIndex" :page-sizes="[10, 20, 50, 100, 1000]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</el-col>

		<!-- 任务查看 -->
		<el-dialog width="70%" :title="title" :visible.sync="viewModal" :close-on-click-modal="false">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>产品信息</span>
				</div>
				<el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
					<el-row>
						<el-col :span="12">
							<el-form-item label='订单编码：' prop="OrderNumbers">
								<span>{{viewTaskData.OrderNumber}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='下单类型：' prop="ServiceType">
								<span v-if="viewTaskData.ServiceType==1">评后返（代返）</span>
								<span v-if="viewTaskData.ServiceType==2">评后返（自返）</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='国家：' prop="CountryName">
								<span>{{viewTaskData.CountryName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='订单状态：' prop="OrderState">
								<span v-if="viewTaskData.OrderState==1">待确认</span>
								<span v-if="viewTaskData.OrderState==2">待分配</span>
								<span v-if="viewTaskData.OrderState==3">已分配</span>
								<span v-if="viewTaskData.OrderState==4">已完成</span>
								<span v-if="viewTaskData.OrderState==5">已取消</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='店铺名称：' prop="ShopName">
								<span>{{viewTaskData.ShopName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品ASIN：' prop="Asin">
								<span>{{viewTaskData.Asin}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品名称：' prop="ProductName">
								<span>{{viewTaskData.ProductName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品单价：' prop="ProductPrice">
								<span>{{viewTaskData.Currency}}{{viewTaskData.ProductPrice}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品链接：' prop="ProductLink">
								<a :href="viewTaskData.ProductLink">{{viewTaskData.ProductLink}}</a>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品评分：' prop="ProductScore">
								<el-rate style="margin-top: 10px;" v-model="viewTaskData.ProductScore" disabled show-score text-color="#ff9900"></el-rate>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品图片：' prop="ProductPictures">
								<img v-show="viewTaskData.ProductPictures" :src="'/'+viewTaskData.ProductPictures" class="eval_img">
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-card class="box-card mt20">
				<div slot="header" class="clearfix">
					<span>下单信息</span>
				</div>
				<el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
					<el-row>
						<el-col :span="12">
							<el-form-item label='关键词类型：' prop="KeywordType">
								<span v-if="viewTaskData.KeywordType==1">产品关键词</span>
								<span v-if="viewTaskData.KeywordType==2">CPC关键词</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='关键词：' prop="ProductKeyword">
								<span>{{viewTaskData.ProductKeyword}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务数量：' prop="Number">
								<span>{{viewTaskData.Number}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='留评率：' prop="ProductPosition">
								<span>{{viewTaskData.ProductPosition}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务开始时间：' prop="StartTimes">
								<span>{{viewTaskData.StartTimes}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务结束时间：' prop="EndTimes">
								<span>{{viewTaskData.EndTimes}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='汇率：' prop="ExchangeRate">
								<span>{{viewTaskData.ExchangeRate}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品总价：' prop="TotalProductPrice">
								<span>{{viewTaskData.TotalProductPrice}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='服务费单价：' prop="UnitPriceSerCharge">
								<span>{{viewTaskData.UnitPriceSerCharge}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='增值费单价：' prop="AddedFee">
								<span>{{viewTaskData.AddedFee}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='合计：' prop="Total">
								<span style="color: red;">{{viewTaskData.Total}}</span>
								<span style="margin-left: 15px;"> {{viewTaskData.TotalProductPrice}} (产品总价) +
									{{viewTaskData.UnitPriceSerCharge}}(服务费单价) * {{viewTaskData.Number}} (任务数量) + {{viewTaskData.AddedFee}}
									(增值费单价) * {{viewTaskData.Number}}(任务数量)</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='下单备注：' prop="Remarks">
								<span>{{viewTaskData.Remarks}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<div slot="footer" class="dialog-footer">
				<el-button @click="viewModal=false">关 闭</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'

	import {
		taskList,
		taskStateNum,
		countryList,
		rateList
	} from '@/api/api'
	export default {
		name: 'task',
		data() {
			return {
				title: '',
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				viewTaskData: {},
				viewModal: false,
				listLoading: false,
				btnLoading: false,
				tableData: [],
				checkBoxData: [], //选中数据
				countryData: [], //国家数据
				rateData: [], //汇率数据
				searchForm: {
					searchWords: '',
					state: '',
					country: 0,
					type: 0,
					time: []
				},
				all: 0, //全部
				dfp: 0, //待分配
				dgm: 0, //待购买
				dqrcd: 0, //待确认出单
				dpj: 0, //待评价
				dqrpj: 0, //待确认评价
				ywc: 0, //已完成
				yqx: 0, //已取消
				error: 0, //异常
				imageUrl: '',
				payModel: false
			}
		},
		created() {
			this.getAllData()
			this.getTaskStateNum()
			this.getCountryData()
			this.getRateData()
		},
		methods: {
			//获取数据
			getAllData() {
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
					kWord: _this.searchForm.searchWords,
					state: _this.searchForm.state,
					countryIdx: _this.searchForm.country,
					// statetime: time1,
					// endtime: time2,
					type: _this.searchForm.type,
					pageNum: _this.pageIndex,
					pagesize: _this.pageSize
				}
				taskList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//获取不同状态的订单数量
			getTaskStateNum() {
				let _this = this
				let time = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (time != '' && time != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let params = {
					userId: sessionStorage.getItem('userId'),
					kWord: _this.searchForm.searchWords,
					countryIdx: _this.searchForm.country,
					type: _this.searchForm.type
					// statetime: time1,
					// endtime: time2
				}
				taskStateNum(params).then(res => {
					_this.all = Number(res.list[0].TotalCount) //全部
					_this.dfp = Number(res.list[0].OrderStateInOne) //待分配
					_this.dgm = Number(res.list[0].OrderStateInTwo) //待购买
					_this.dqrcd = Number(res.list[0].OrderStateInThree) //待确认出单
					_this.dpj = Number(res.list[0].OrderStateInFour) //待评价
					_this.dqrpj = Number(res.list[0].OrderStateInFive) //待确认评价
					_this.ywc = Number(res.list[0].OrderStateInSix) //已完成
					_this.yqx = Number(res.list[0].OrderStateInSeven) //已取消
					_this.error = Number(res.list[0].OrderStateInEight) //异常
				}).catch((e) => {})
			},

			//获取国家数据
			getCountryData() {
				let _this = this
				let param = {
					Id: sessionStorage.getItem('userId')
				}
				countryList(param).then((res) => {
					_this.countryData = res.list
				}).catch(err => {})
			},

			//获取汇率数据
			getRateData() {
				let _this = this
				rateList().then((res) => {
					_this.rateData = res.list
				}).catch(err => {})
			},

			//任务详情
			viewModalShow(index, row) {
				let _this = this
				_this.title = '任务【' + row.OrderNumbers + '】详情'
				_this.viewTaskData = Object.assign({}, row)
				_this.viewModal = true //获取到数据后显示模态框
			},

			//取消订单
			cancelHandel(index, row) {
				let _this = this
				_this.$confirm('确定要取消任务【' + row.OrderNumbers + '】吗？', '信息提示', {
					type: 'warning'
				}).then(() => {
					let params = {
						Id: row.Id
					}
					orderState(params).then((res) => {
						_this.getAllData()
					})
				}).catch(() => {})
			},

			// 图片上传
			handleAvatarSuccess(res, file) {
				if (res.Data != '') {
					this.orderForm.ProductPictures = res.Data
				}
				this.imageUrl = URL.createObjectURL(file.raw);
				this.$message.success('产品图片上传成功！')
			},
			handleError(res) {
				this.$message.error('产品图片上传失败！')
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isGIF = file.type === 'image/gif';
				const isBMP = file.type === 'image/bmp';
				const isLt5M = file.size / 1024 / 1024 < 5;
				if (!isJPG && !isPNG && !isGIF && !isBMP) {
					this.$message.error('上传图片必须是JPG/PNG/GIF/BMP 格式!');
				} else if (!isLt5M) {
					this.$message.error('上传图片大小不能超过 5MB!');
				}
				return (isJPG || isPNG || isGIF || isBMP) && isLt5M;
			},

			//查询条件去空格
			searchToTrim() {
				let _this = this
				_this.searchForm.searchWords = _this.searchForm.searchWords.trim()
			},

			//查询
			searchData() {
				let _this = this
				_this.pageIndex = 1 //页码归1
				_this.getAllData()
				_this.getTaskStateNum()
			},

			//查询某任务状态下的数据
			searchStateData(val) {
				let _this = this
				_this.pageIndex = 1 //页码归1
				_this.searchForm.state = val
				_this.getAllData()
			},

			// 重置
			resetSearch() {
				let _this = this
				_this.searchForm.searchWords = ''
				_this.searchForm.country = 0
				_this.searchForm.type = 0
				_this.searchForm.time = []
				_this.pageIndex = 1
				_this.getAllData()
				_this.getOrderStateNum()
			},

			//翻页
			handleSizeChange(val) {
				let _this = this
				_this.pageSize = val
				_this.getAllData()
			},
			handleCurrentChange(val) {
				let _this = this
				_this.pageIndex = val
				_this.getAllData()
			},

			// 导出
			exportExcel() {
				var xlsxParam = {
					raw: true
				}
				var wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'), xlsxParam)
				var wbout = XLSX.write(wb, {
					bookType: 'xlsx',
					bookSST: true,
					type: 'array'
				})
				try {
					FileSaver.saveAs(new Blob([wbout], {
						type: 'application/octet-stream'
					}), '任务数据.xlsx')
				} catch (e) {
					if (typeof console !== 'undefined') {
						console.log(e, wbout)
					}
				}
				return wbout
			}
		}
	}
</script>
