<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm" size="small">
				<el-form-item label="交易时间">
					<el-date-picker v-model="searchForm.time" :unlink-panels='true' type="datetimerange"
						range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
						value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="交易类型">
					<el-select v-model="searchForm.state" placeholder="交易类型">
						<el-option :value="0" label="全部"></el-option>
						<el-option :value="1" label="收入"></el-option>
						<el-option :value="2" label="支出"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="searchData">查询</el-button>
					<el-button @click="resetSearch">重置</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table border :data="tableData" v-loading="listLoading" id="exportTable" style="width: 100%"
			:header-cell-style="{background:'#fafafa'}" ref="table">
			<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
			<el-table-column prop="BusinessNumber" label="流水号" align="center" width='200px'></el-table-column>
			<el-table-column prop="TransactionAmount" label="交易金额" align="center"></el-table-column>
			<el-table-column prop="TransactionType" label="交易类型" align="center" :formatter="typeTxt"></el-table-column>
			<el-table-column prop="TransactionTime" label="交易时间" align="center"></el-table-column>
			<el-table-column prop="Remarks" label="备注" align="center"></el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<span style="position: relative;top: 5px;color: #606266;">
				<span>余额：{{balance}}</span>
				<span style="margin-left: 30px;">总收入：{{allIn}}</span>
				<span style="margin-left: 30px;">总支出：{{allOut}}</span>
			</span>
			<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="10"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
	import {
		moneyList,
	} from '@/api/api'

	export default {
		name: 'moneyDetails',
		data() {
			return {
				title: '',
				pageNum: 1,
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
					state: 0
				},
				balance: 0,
				allIn: 0,
				allOut: 0
			}
		},
		created() {
			this.getData()
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
					UserId: sessionStorage.getItem('userId'),
					Statetime: time1,
					Endtime: time2,
					State: _this.searchForm.state,
					pageNum: _this.pageNum,
					pagesize: _this.pageSize
				}
				moneyList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
					_this.balance = res.Account[0].AccountBalance
					_this.allIn = res.Account[0].AccumulatedIncome
					_this.allOut = res.Account[0].AccumulatedExpenditure
				}).catch((e) => {})
			},

			//查询
			searchData() {
				let _this = this
				_this.pageNum = 1
				_this.getData()
			},
			
			//重置
			resetSearch() {
				let _this = this
				_this.pageNum = 1
				_this.searchForm.time = []
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
				_this.pageNum = val
				_this.getData()
			}

		}
	}
</script>
