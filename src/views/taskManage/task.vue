<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm" size="small">
				<el-form-item label="搜索内容">
					<el-input @keyup.native="searchToTrim" v-model="searchForm.searchWords" placeholder="任务编号/产品名称/购买单号"
						style="width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="任务类型">
					<el-select v-model="searchForm.type" placeholder="请选择" style="width: 120px;">
						<el-option :value="0" label="全部"></el-option>
						<el-option :value="1" label="评后返(代返)"></el-option>
						<el-option :value="2" label="评后返(自返)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="国家">
					<el-select v-model="searchForm.country" multiple placeholder="请选择国家" style="width: 120px;">
						<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName"
							:value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="购买时间">
					<el-date-picker v-model="searchForm.time" :unlink-panels='true' type="datetimerange"
						range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
						value-format="yyyy-MM-dd HH:mm:ss" style="width: 335px;"></el-date-picker>
				</el-form-item>
				<el-form-item label="返款时间">
					<el-date-picker v-model="searchForm.time2" :unlink-panels='true' type="datetimerange"
						range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
						value-format="yyyy-MM-dd HH:mm:ss" style="width: 335px;"></el-date-picker>
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
					<el-button size="mini" @click='searchStateData(0)' :class="{'active':searchForm.state==0}">全部
					</el-button>
				</el-badge>
				<el-badge :value="dfp" type="info" class="item">
					<el-button size="mini" @click='searchStateData(1)' :class="{'active':searchForm.state==1}">待分配
					</el-button>
				</el-badge>
				<el-badge :value="dgm" type="warning" class="item">
					<el-button size="mini" @click='searchStateData(2)' :class="{'active':searchForm.state==2}">待购买
					</el-button>
				</el-badge>
				<el-badge :value="dqrcd" type="primary" class="item">
					<el-button size="mini" @click='searchStateData(3)' :class="{'active':searchForm.state==3}">待确认出单
					</el-button>
				</el-badge>
				<el-badge :value="dpj" type="warning" class="item">
					<el-button size="mini" @click='searchStateData(4)' :class="{'active':searchForm.state==4}">待评价
					</el-button>
				</el-badge>
				<el-badge :value="dqrpj" type="primary" class="item">
					<el-button size="mini" @click='searchStateData(5)' :class="{'active':searchForm.state==5}">待确认评价
					</el-button>
				</el-badge>
				<el-badge :value="ywc" type="success" class="item">
					<el-button size="mini" @click='searchStateData(6)' :class="{'active':searchForm.state==6}">已完成
					</el-button>
				</el-badge>
				<el-badge :value="yqx" type="danger" class="item">
					<el-button size="mini" @click='searchStateData(7)' :class="{'active':searchForm.state==7}">已取消
					</el-button>
				</el-badge>
				<el-badge :value="error" type="warning">
					<el-button size="mini" @click='searchStateData(8)' :class="{'active':searchForm.state==8}">异常
					</el-button>
				</el-badge>
			</div>
		</el-col>

		<!--列表-->
		<el-table border :data="tableData" v-loading="listLoading" id="exportTable" style="width: 100%"
			:header-cell-style="{background:'#fafafa'}" ref="table">
			<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
			<el-table-column prop="OrderNumbers" label="任务编号" align="center" width="160">
				<template slot-scope="scope">
					<el-link type="primary" :underline="false" @click.stop="viewModalShow(scope.$index,scope.row)">
						{{scope.row.OrderNumbers}}
					</el-link>
					<div>
						<span v-if="scope.row.NoComment">
							<span class="danger fz10"> {{scope.row.ServiceName}}</span>
						</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="OrderProductPictures" label="产品图" align="center">
				<template slot-scope="scope">
					<el-image style="width: 40px;height: 40px;" v-if="scope.row.OrderProductPictures"
						:src="'/'+scope.row.OrderProductPictures">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="ServiceType" label="任务类型" align="center" width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.ServiceType==1">评后返(代返)</span>
					<span v-if="scope.row.ServiceType==2">评后返(自返)</span>
				</template>
			</el-table-column>
			<el-table-column prop="countryName" label="国家" align="center"></el-table-column>
			<el-table-column prop="ProductName" label="产品名称" align="center" :show-overflow-tooltip='true'>
			</el-table-column>
			<el-table-column prop="OrderShopName" label="店铺" align="center" :show-overflow-tooltip='true'>
			</el-table-column>
			<el-table-column prop="Asin" label="ASIN" align="center" width="110"></el-table-column>
			<el-table-column prop="AmazonNumber" label="购买单号" align="center"></el-table-column>
			<el-table-column prop="AmazonProductPrice" label="购买价格" align="center"></el-table-column>
			<el-table-column prop="BuyTime" label="购买时间" align="center" width="100"></el-table-column>
			<el-table-column prop="PayAccount" label="返款账号" align="center"></el-table-column>
			<el-table-column prop="DealTime" label="返款时间" align="center" width="100"></el-table-column>
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
				<!-- <template slot-scope="scope">
					<el-button size="small" v-if="scope.row.TaskState==1" type="danger"
						@click="cancelHandel(scope.$index,scope.row)">取消</el-button>
					<el-button size="small" v-if="scope.row.TaskState==3" type="primary"
						@click="confirmOrder(scope.$index,scope.row)">确认订单</el-button>
					<el-button size="small" v-if="scope.row.TaskState==5" type="success"
						@click="evalEdit(scope.$index,scope.row,1)">确认评价</el-button>
					<el-button size="small" v-if="scope.row.TaskState==6 && scope.row.ServiceType=='2'" type="success"
						@click="evalEdit(scope.$index,scope.row,2)">补充返款信息</el-button>
				</template> -->

				<template slot-scope="scope">
					<el-button size="small" type="danger" @click="cancelHandel(scope.$index,scope.row)">取消</el-button>
					<el-button size="small" type="primary" @click="confirmOrder(scope.$index,scope.row)">确认订单
					</el-button>
					<el-button size="small" type="success" @click="confirmComment(scope.$index,scope.row,1)">确认评价
					</el-button>
					<el-button size="small" type="success" @click="confirmComment(scope.$index,scope.row,2)">补充返款信息
					</el-button>
				</template>

			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageIndex" :page-sizes="[10, 20, 50, 100, 1000]" :page-size="10"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-col>

		<!-- 任务查看 -->
		<el-dialog width="70%" :append-to-body="true" :title="title" :visible.sync="viewModal"
			:close-on-click-modal="false">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>任务信息</span>
				</div>
				<el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
					<el-row>
						<el-col :span="12">
							<el-form-item label='任务编码：'>
								<span>{{viewTaskData.OrderNumbers}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务类型：' prop="ServiceType">
								<span v-if="viewTaskData.ServiceType==1">评后返（代返）</span>
								<span v-if="viewTaskData.ServiceType==2">评后返（自返）</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='国家：'>
								<span>{{viewTaskData.countryName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务状态：'>
								<span v-if="viewTaskData.TaskState==1">待分配</span>
								<span v-if="viewTaskData.TaskState==2" class="warning">待购买</span>
								<span v-if="viewTaskData.TaskState==3" class="primary">待确认出单</span>
								<span v-if="viewTaskData.TaskState==4" class="warning">待评价</span>
								<span v-if="viewTaskData.TaskState==5" class="primary">待确认评价</span>
								<span v-if="viewTaskData.TaskState==6" class="success">已完成</span>
								<span v-if="viewTaskData.TaskState==7" class="danger">已取消</span>
								<span v-if="viewTaskData.TaskState==8" class="warning">异常</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品ASIN：'>
								<span>{{viewTaskData.Asin}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品名称：'>
								<span>{{viewTaskData.ProductName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品评分：'>
								<el-rate style="margin-top: 10px;" v-model="viewTaskData.OrderProductScore" disabled
									show-score text-color="#ff9900"></el-rate>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if="viewTaskData.ServiceType == '2'">
							<el-form-item label='预计价格：'>
								<span
									v-show="viewTaskData.ProductPrice!=null"><span>{{viewTaskData.symbol}}</span>{{viewTaskData.ProductPrice}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务执行时间：'>
								<span>{{viewTaskData.ExecutionTime}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='备注：'>
								<span>{{viewTaskData.Remarks}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-card class="box-card mt20">
				<div slot="header" class="clearfix">
					<span>购买信息</span>
				</div>
				<el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
					<el-row>
						<el-col :span="12">
							<el-form-item label='购买单号：'>
								<span>{{viewTaskData.AmazonNumber}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='购买时间：'>
								<span>{{viewTaskData.BuyTime}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='购买价格：'>
								<span v-show="viewTaskData.AmazonProductPrice">
									<span>{{viewTaskData.symbol}}</span>
									{{viewTaskData.AmazonProductPrice}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if="viewTaskData.ServiceType==1">
							<el-form-item label='产品运费：'>
								<span v-show="viewTaskData.Freight"><span>{{viewTaskData.symbol}}</span>
									{{viewTaskData.Freight}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if="viewTaskData.ServiceType==1">
							<el-form-item label='产品税费：'>
								<span v-show="viewTaskData.Taxation"><span>{{viewTaskData.symbol}}</span>
									{{viewTaskData.Taxation}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if="viewTaskData.ServiceType==1">
							<el-form-item label='其他费用：'>
								<span v-show="viewTaskData.Other">{{viewTaskData.symbol}}</span>
								{{viewTaskData.Other}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if="viewTaskData.ServiceType==1">
							<el-form-item label='增值费：'>
								<span>{{viewTaskData.OrderAddedFee}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='服务费：'>
								<span>{{viewTaskData.OrderUnitPriceSerCharge}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if="viewTaskData.ServiceType==1">
							<el-form-item label='汇率：'>
								<span>{{viewTaskData.OrderExchangeRate}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if="viewTaskData.ServiceType==1">
							<el-form-item label='总额：'>
								<span style="color: red;" v-show="viewTaskData.Total"><span>￥</span>
									{{viewTaskData.Total}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='购买截图：' prop="BuyImage">
								<el-image style="width: 80px" class="pointer" v-if="viewTaskData.BuyImage"
									:src="viewTaskData.BuyImage"
									:preview-src-list="(viewTaskData.BuyImage || '').split(',')"></el-image>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-card class="box-card mt20">
				<div slot="header" class="clearfix">
					<span>评价信息</span>
				</div>
				<el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
					<el-row>
						<el-col :span="24">
							<el-form-item label='返款账号：' prop="PayAccount">
								<span>{{viewTaskData.PayAccount}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='评价链接：' prop="ProductLink">
								<a :href="viewTaskData.ProductLink">{{viewTaskData.ProductLink}}</a>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='评价截图：' prop="Remarks">
								<el-image style="width: 80px" class="pointer" v-if="viewTaskData.ProductImage"
									:src="viewTaskData.ProductImage"
									:preview-src-list="(viewTaskData.ProductImage || '').split(',')"></el-image>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-card class="box-card mt20">
				<div slot="header" class="clearfix">
					<span>返款信息</span>
				</div>
				<el-form :model='viewTaskData' ref='viewTaskData' label-width='150px'>
					<el-row>
						<el-col :span="24">
							<el-form-item label='返款金额：'>
								<span>{{viewTaskData.DealMoeny}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='返款截图：'>
								<el-image style="width: 100px;height: 100px;" v-if="viewTaskData.DealIamge"
									:src="viewTaskData.DealIamge"
									:preview-src-list="(viewTaskData.DealIamge || '').split(',')"></el-image>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<div slot="footer" class="dialog-footer">
				<el-button @click="viewModal=false">关 闭</el-button>
			</div>
		</el-dialog>

		<!-- 确认订单 -->
		<el-dialog title="确认订单" :visible.sync="orderModal" :close-on-click-modal="false" :before-close="closeOrderModal"
			width="30%">
			<el-form :model="orderForm" :rules="orderRules" ref="orderForm">
				<el-form-item label="订单状态：">
					<el-radio-group v-model="orderForm.orderStatus" @change="orderStateChange">
						<el-radio label="1">正常</el-radio>
						<el-radio label="0">异常</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="购买截图：">
					<el-image v-if="orderForm.buyImage" style="width: 100px;height: 100px;"
						:src="$IMG_URL_BACK + orderForm.buyImage"
						:preview-src-list="($IMG_URL_BACK + orderForm.buyImage || '').split(',')"></el-image>
				</el-form-item>
				<el-form-item label="购买单号：">
					<span>{{orderForm.buyNumber}}</span>
				</el-form-item>
				<el-form-item label="购买时间：">
					<span>{{orderForm.buyTime}}</span>
				</el-form-item>
				<el-form-item label="购买价格：" prop="buyMoney">
					<el-input v-model="orderForm.buyMoney" :disabled="orderForm.orderStatus=='0'"></el-input>
				</el-form-item>
				<el-form-item label="备注：" prop="remark" v-if="orderForm.orderStatus=='1'">
					<el-input type="textarea" rows="3" v-model="orderForm.remark"></el-input>
				</el-form-item>
				<el-form-item label="异常备注：" prop="orderRemark" v-if="orderForm.orderStatus=='0'">
					<el-input type="textarea" rows="3" v-model="orderForm.orderRemark"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeOrderModal">关闭</el-button>
				<el-button type="primary" @click='confirmOrderSubmit' :loading="btnLoading">确认</el-button>
			</span>
		</el-dialog>

		<!--确认评价-->
		<el-dialog :title="commentTitle" :visible.sync="commentModel" :close-on-click-modal="false"
			:before-close="closeCommentModel" width="30%">
			<el-form :model="commentForm" :rules="commentRules" ref="commentForm">
				<el-form-item label="返款账号：" v-if="serviceType==2">
					<span>{{commentForm.PPaccount}}</span>
				</el-form-item>
				<el-form-item label="评价链接：">
					<span>{{commentForm.productLink}}</span>
				</el-form-item>
				<el-form-item label="评价截图：">
					<el-image v-if="commentForm.ProductImage" style="width: 100px;height: 100px;"
						:src="$IMG_URL_BACK + commentForm.ProductImage"
						:preview-src-list="($IMG_URL_BACK + commentForm.ProductImage || '').split(',')"></el-image>
				</el-form-item>
				<div v-if="serviceType==2">
					<el-form-item label='返款截图：' class="mt20 p-img">
						<el-upload class="avatar-uploader" name="image" :action="uploadUrl" :show-file-list="false"
							:on-success="handleAvatarSuccess" :on-error="handleError"
							:before-upload="beforeAvatarUpload" accept="image/jpeg,image/png,image/gif,image/bmp">
							<img v-if="imageUrl" :src="imageUrl" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<el-input v-show="false" v-model='commentForm.ProductPictures'></el-input>
					</el-form-item>
					<!-- 编号小于100018是公司内人 -->
					<el-form-item label="返款金额：" prop="backMoney" v-if="loginUserId<=100018">
						<el-input v-model="commentForm.backMoney"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<span slot='footer' class='dialog-footer'>
				<el-button @click="closeCommentModel">关闭</el-button>
				<el-button type="primary" @click='confirmCommentSubmit' :loading="btnLoading">确认</el-button>
			</span>
		</el-dialog>

	</section>
</template>

<script>
	import table2excel from 'js-table2excel'

	import {
		taskList,
		taskStateNum,
		countryList,
		rateList,
		taskConfirmOrder,
		taskConfirmComment
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
					state: 0,
					type: 0,
					country: [],
					time: [],
					time2: []
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
				payModel: false,
				selectId: '',
				orderModal: false,
				orderForm: {
					orderStatus: '1', //确认订单状态
					buyImage: '',
					buyNumber: '',
					buyTime: '',
					buyMoney: '',
					remark: '', //正常备注
					errRemark: '', //异常备注
				},
				orderRules: {
					buyMoney: [{
							required: true,
							message: '请输入购买金额',
							trigger: 'blur'
						},
						{
							pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
							message: '金额式不正确',
							trigger: 'blur'
						}
					],
					orderRemark: [{
						required: true,
						message: '请输入异常备注',
						trigger: 'blur'
					}]
				},
				serviceType: '',
				commentModel: false,
				commentTitle: '',
				commentForm: {
					PPaccount: '',
					productLink: '', //产品链接
					ProductPictures: '', //返款截图
					backMoney: '' //返款金额
				},
				commentRules: {
					backMoney: [{
							required: true,
							message: '请输入返款金额',
							trigger: 'blur'
						},
						{
							pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
							message: '金额式不正确',
							trigger: 'blur'
						}
					]
				}
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
				let buyTime = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (buyTime != '' && buyTime != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let backTime = _this.searchForm.time2
				let time3 = ''
				let time4 = ''
				if (backTime != '' && backTime != null) {
					time3 = time[0]
					time4 = time[1]
				}
				let params = {
					userId: sessionStorage.getItem('userId'),
					kWord: _this.searchForm.searchWords,
					state: _this.searchForm.state,
					type: _this.searchForm.type,
					countryIdx: _this.searchForm.country,
					statetime: time1,
					endtime: time2,
					// backstatetime: time3,
					// backendtime: time4,
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
					type: _this.searchForm.type,
					statetime: time1,
					endtime: time2
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
				_this.viewTaskData.BuyImage = '/' + row.BuyImage
				_this.viewTaskData.ProductImage = '/' + row.ProductImage
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

			//确认订单窗口
			confirmOrder(index, row) {
				let _this = this
				_this.orderModal = true
				_this.selectId = row.Id
				_this.orderForm.buyImage = row.BuyImage
				_this.orderForm.buyNumber = row.AmazonNumber
				_this.orderForm.buyTime = row.BuyTime
				_this.orderForm.buyMoney = row.AmazonProductPrice
			},

			//确认订单提交
			confirmOrderSubmit() {
				let _this = this
				_this.$refs.orderForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let userId = sessionStorage.getItem('userId')
						let state = _this.orderForm.orderStatus
						let remark = ''
						if (state == '1') {
							remark = _this.orderForm.remark
						}
						if (state == '0') {
							remark = _this.orderForm.errRemark
						}
						let param = {
							Id: _this.selectId,
							UserId: userId,
							State: Number(state),
							Remark: remark,
							AmazonProductPrice: _this.orderForm.buyMoney
						}
						taskConfirmOrder(param).then(res => {
							_this.btnLoading = false
							_this.closeSubmit()
							_this.getAllData()
							_this.getAllStatus()
						}).catch(error => {
							_this.btnLoading = false
						})
					}
				})
			},

			//关闭订单确认
			closeOrderModal() {
				let _this = this
				_this.orderModal = false
				_this.$refs['orderForm'].resetFields()
				_this.orderForm = {
					orderStatus: '1',
					remark: '',
					errRemark: '',
					buyImage: '',
					buyNumber: '',
					buyTime: '',
					buyMoney: '',
				}
			},

			//切换订单确认状态
			orderStateChange() {
				let _this = this
				_this.$refs['orderForm'].resetFields()
			},

			// 确认评价窗口
			confirmComment(index, row, val) {
				let _this = this
				if (val == '1') {
					_this.commentTitle = '确认评价'
				}
				if (val == '2') {
					_this.commentTitle = '补充返款信息'
				}
				_this.commentModel = true
				_this.selectId = row.Id
				_this.serviceType = row.ServiceType
				_this.commentForm.PPaccount = row.PayAccount
				_this.commentForm.productLink = row.ProductLink
				_this.commentForm.ProductImage = row.ProductImage
				_this.commentForm.backMoney = row.DealMoeny
				_this.commentForm.ProductPictures = row.DealIamge
				_this.imageUrl = row.DealIamge
				_this.NoComment = Number(row.NoComment)
			},

			// 确认评价提交
			confirmCommentSubmit() {
				let _this = this
				_this.$refs.commentForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let money = _this.commentForm.backMoney
						if (!money) {
							money = 0
						}
						let type = _this.serviceType
						let uId = sessionStorage.getItem('userId')
						let JYimg = _this.commentForm.ProductPictures
						if (type == '2' && uId <= 100018 && !JYimg) {
							this.$message.error('自返内单必须上传返款截图！')
						} else {
							let param = {
								UserId: uId,
								Id: _this.selectId,
								UserImage: JYimg,
								BackMoney: money,
								NoComment: _this.NoComment
							}
							taskConfirmComment(param).then(res => {
								_this.btnLoading = false
								_this.colseCommentModel()
								_this.getAllData()
								_this.getAllStatus()
							}).catch(error => {
								_this.btnLoading = false
							})
						}
					}
				})
			},

			//确认评价窗口关闭
			closeCommentModel() {
				let _this = this
				_this.commentModel = false
				_this.commentForm = {
					PPaccount: '',
					productLink: '',
					ProductImage: '',
					ProductPictures: '',
					backMoney: 0
				}
				_this.imageUrl = ''
				_this.NoComment = ''
			},


			// 图片上传
			handleAvatarSuccess(res, file) {
				if (res.Data != '') {
					this.orderForm.ProductPictures = res.Data
				}
				this.imageUrl = URL.createObjectURL(file.raw);
				this.$message.success('图片上传成功！')
			},
			handleError(res) {
				this.$message.error('图片上传失败！')
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
				_this.searchForm.type = 0
				_this.searchForm.country = []
				_this.searchForm.time = []
				_this.searchForm.time2 = []
				_this.pageIndex = 1
				_this.getAllData()
				_this.getTaskStateNum()
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

			//查询条件去空格
			searchToTrim() {
				let _this = this
				_this.searchForm.searchWords = _this.searchForm.searchWords.trim()
			},

			//导出
			exportExcel() {
				const column = [{
						title: '任务编号',
						key: 'OrderNumbers',
						type: 'text'
					},
					{
						title: '产品图',
						key: 'ExpProductImg',
						type: 'image',
						width: 100,
						height: 100
					},
					{
						title: '任务类型',
						key: 'ExpServiceType',
						type: 'text'
					},
					{
						title: '国家',
						key: 'countryName',
						type: 'text'
					},
					{
						title: '产品名称',
						key: 'ProductName',
						type: 'text'
					},
					{
						title: '店铺',
						key: 'OrderShopName',
						type: 'text'
					},
					{
						title: 'ASIN',
						key: 'Asin',
						type: 'text'
					},
					{
						title: '购买单号',
						key: 'AmazonNumber',
						type: 'text'
					},
					{
						title: '购买价格',
						key: 'AmazonProductPrice',
						type: 'text'
					},
					{
						title: '购买时间',
						key: 'BuyTime',
						type: 'text'
					},
					{
						title: '返款账号',
						key: 'PayAccount',
						type: 'text'
					},
					{
						title: '返款时间',
						key: 'DealTime',
						type: 'text'
					},
					{
						title: '状态',
						key: 'ExpTaskState',
						type: 'text'
					},
				]

				// 1.title为列名
				// 2.key为data数据每个对象对应的key
				// 3.若为图片格式, 需要加type为image的说明,并且可以设置图片的宽高
				const data = this.tableData
				// data数据一些特殊处理
				for (const t in data) {
					data[t].ExpProductImg = this.$IMG_URL + data[t].OrderProductPictures

					if (data[t].DealIamge) {
						data[t].ExpDealIamge = this.$IMG_URL + data[t].DealIamge
					} else {
						data[t].ExpDealIamge = ''
					}

					let TxtServiceType = ''
					if (data[t].ServiceType == 1) {
						TxtServiceType = '评后返（代返）'
					}
					if (data[t].ServiceType == 2) {
						TxtServiceType = '评后返（自返）'
					}
					data[t].ExpServiceType = TxtServiceType

					let TxtTaskState = ''
					if (data[t].TaskState == 1) {
						TxtTaskState = '待分配'
					}
					if (data[t].TaskState == 2) {
						TxtTaskState = '待购买'
					}
					if (data[t].TaskState == 3) {
						TxtTaskState = '待确认出单'
					}
					if (data[t].TaskState == 4) {
						TxtTaskState = '待评价'
					}
					if (data[t].TaskState == 5) {
						TxtTaskState = '待确认评价'
					}
					if (data[t].TaskState == 6) {
						TxtTaskState = '已完成'
					}
					if (data[t].TaskState == 7) {
						TxtTaskState = '已取消'
					}
					if (data[t].TaskState == 8) {
						TxtTaskState = '异常'
					}
					data[t].ExpTaskState = TxtTaskState
				}
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
				let day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate()
				let time = year + '-' + month + '-' + day

				const excelName = '任务数据' + '_' + time + '.xls'
				table2excel(column, data, excelName)
			}
		}
	}
</script>
