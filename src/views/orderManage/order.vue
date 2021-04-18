<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm" size="small">
				<el-form-item label="搜索内容">
					<el-input @keyup.native="searchToTrim" v-model="searchForm.searchWords"
						placeholder="订单编号/产品名称/ASIN/关键词" style="width: 232px;"></el-input>
				</el-form-item>
				<el-form-item label="国家">
					<el-select v-model="searchForm.country" multiple placeholder="请选择国家">
						<el-option v-for="item in countryData" :key="item.Id" :label="item.CountryName"
							:value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="下单时间">
					<el-date-picker v-model="searchForm.time" :unlink-panels='true' type="datetimerange"
						range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
						value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
			<el-button type="primary" size="small" @click="createOrder"><i class="el-icon-edit-outline"></i> 创建订单
			</el-button>
			<el-button type="warning" size="small" @click="exportExcel"><i class="el-icon-upload2"></i> 导出订单</el-button>
			<div class="tagMenu">
				<el-badge :value="all" type="success" class="item">
					<el-button size="small" @click='searchStateData("")' :class="{'active':searchForm.state==''}">全部
					</el-button>
				</el-badge>
				<el-badge :value="dqr" type="info" class="item">
					<el-button size="small" @click='searchStateData(1)' :class="{'active':searchForm.state==1}">待确认
					</el-button>
				</el-badge>
				<el-badge :value="dfp" type="primary" class="item">
					<el-button size="small" @click='searchStateData(2)' :class="{'active':searchForm.state==2}">待分配
					</el-button>
				</el-badge>
				<el-badge :value="yfp" type="warning" class="item">
					<el-button size="small" @click='searchStateData(3)' :class="{'active':searchForm.state==3}">已分配
					</el-button>
				</el-badge>
				<el-badge :value="ywc" type="success" class="item">
					<el-button size="small" @click='searchStateData(4)' :class="{'active':searchForm.state==4}">已完成
					</el-button>
				</el-badge>
				<el-badge :value="yqx" type="danger">
					<el-button size="small" @click='searchStateData(5)' :class="{'active':searchForm.state==5}">已取消
					</el-button>
				</el-badge>
			</div>
		</el-col>

		<!--列表-->
		<el-table border :data="tableData" v-loading="listLoading" id="exportTable" style="width: 100%"
			:header-cell-style="{background:'#fafafa'}" ref="table">
			<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
			<el-table-column prop="OrderNumber" label="订单编号" align="center" width="135">
				<template slot-scope="scope">
					<el-link type="primary" :underline="false" @click.stop="viewModalShow(scope.$index,scope.row)">
						{{scope.row.OrderNumber}}
					</el-link>
				</template>
			</el-table-column>
			<el-table-column prop="OrderProductPictures" label="产品图" align="center">
				<template slot-scope="scope">
					<el-image style="width: 40px;height: 40px;" v-if="scope.row.ProductPictures"
						:src="'/'+scope.row.ProductPictures">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="ServiceType" label="订单类型" align="center" width="110">
				<template slot-scope="scope">
					<span v-if="scope.row.ServiceType==1">评后返(代返)</span>
					<span v-if="scope.row.ServiceType==2">评后返(自返)</span>
				</template>
			</el-table-column>
			<el-table-column prop="CountryName" label="国家" align="center"></el-table-column>
			<el-table-column prop="ProductName" label="产品名称" align="center" :show-overflow-tooltip='true'>
			</el-table-column>
			<el-table-column prop="ShopName" label="店铺" align="center" :show-overflow-tooltip='true'></el-table-column>
			<el-table-column prop="Asin" label="ASIN" align="center" width="110"></el-table-column>
			<el-table-column prop="ProductKeyword" label="关键词" align="center" :show-overflow-tooltip='true'>
			</el-table-column>
			<el-table-column prop="ExchangeRate" label="汇率" align="center"></el-table-column>
			<el-table-column prop="Number" label="任务数" align="center"></el-table-column>
			<el-table-column prop="AddedFee" label="增值费" align="center"></el-table-column>
			<el-table-column prop="UnitPriceSerCharge" label="服务费" align="center"></el-table-column>
			<el-table-column prop="TotalProductPrice" label="产品总价" align="center"></el-table-column>
			<el-table-column prop="Total" label="合计" align="center">
				<template slot-scope="scope">
					<span class="danger">{{scope.row.Total}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="OrderTime" label="下单时间" align="center" width="100"></el-table-column>
			<el-table-column prop="OrderState" label="状态" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.OrderState==1">待确认</span>
					<span v-if="scope.row.OrderState==2" class="primary">待分配</span>
					<span v-if="scope.row.OrderState==3" class="warning">已分配</span>
					<span v-if="scope.row.OrderState==4" class="success">已完成</span>
					<span v-if="scope.row.OrderState==5" class="danger">已取消</span>
				</template>
			</el-table-column>
			<el-table-column prop="OrderState" label="操作" align="center" width="145">
				<template slot-scope="scope">
					<el-button size="small" @click="cancelHandel(scope.$index,scope.row)" type="danger"
						v-show="scope.row.state==1">取消</el-button>
					<el-button size="small" @click="createOrderAgain(scope.$index,scope.row)" type="primary">再来一单
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

		<!-- 创建订单 -->
		<el-dialog title="创建订单" :visible.sync="addOrderModal" width="70%" custom-class="fixed-dialog"
			:close-on-click-modal="false" :before-close="closeModel">
			<el-row>
				<el-col :span="24" :xs="24">
					<el-form :model="orderForm" ref="orderForm" :rules="orderRule" status-icon label-width="110px">
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<span>产品信息</span>
							</div>
							<el-col :span="24" :xs="24">
								<el-form-item label='产品图片' prop='ProductPictures' class="mt20 p-img">
									<el-upload class="avatar-uploader" name="image"
										action="/api/Order/GetProductPictures" :show-file-list="false"
										:on-success="handleAvatarSuccess" :on-error="handleError"
										:before-upload="beforeAvatarUpload"
										accept="image/jpeg,image/png,image/gif,image/bmp">
										<img v-if="imageUrl" :src="imageUrl" class="avatar">
										<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									</el-upload>
									<el-input v-show="false" v-model='orderForm.ProductPictures'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" :xs="24">
								<el-form-item label="订单类型" prop="ServiceType">
									<el-select v-model="orderForm.ServiceType" placeholder="请选择订单类型"
										style="width: 100%">
										<el-option value="1" label="评后返（代返）"></el-option>
										<el-option value="2" label="评后返（自返）"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8" :xs="24">
								<el-form-item label="国家" prop="CountryId">
									<el-select v-model="orderForm.CountryId" placeholder="请选择" @change='changeCountry'
										style="width: 100%">
										<el-option v-for="(item,index) in countryData" :key="index" :value="item.Id"
											:label="item.CountryName"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8" :xs="24">
								<el-form-item label="店铺名称" prop="ShopName">
									<el-input v-model="orderForm.ShopName" placeholder="请输入店铺名称">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" :xs="24">
								<el-form-item label="产品品牌" prop="Brand">
									<el-input v-model="orderForm.Brand" maxlength="50" show-word-limit
										placeholder="请输入产品品牌">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" :xs="24">
								<el-form-item label="产品ASIN" prop="Asin">
									<el-input v-model="orderForm.Asin" maxlength="10" show-word-limit
										placeholder="请输入产品ASIN"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" :xs="24">
								<el-form-item label="产品价格" prop="ProductPrice">
									<el-input v-model="orderForm.ProductPrice" @blur="getAddFee" placeholder="请输入产品价格">
										<template slot="append">{{symbol}}</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8" :xs="24">
								<el-form-item label="产品评分" prop="ProductPrice">
									<el-form-item>
										<el-rate v-model="orderForm.ProductScore"
											style="border: 1px solid #DCDFE6;padding: 8px;border-radius: 4px;position: relative;top: -3px;">
										</el-rate>
									</el-form-item>
								</el-form-item>
							</el-col>
							<el-col :span="16" :xs="24">
								<el-form-item label="产品位置" prop="Place">
									<el-input v-model="orderForm.Place" maxlength="500" show-word-limit
										class="limit-txt" placeholder="请输入产品所在位置"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24" :xs="24">
								<el-form-item label="产品名称" style="width: 100%;" prop="ProductName">
									<el-input v-model="orderForm.ProductName" maxlength="500" show-word-limit
										class="limit-txt" placeholder="请输入产品名称"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24" :xs="24">
								<el-form-item label="产品链接" style="width: 100%;" prop="ProductLink">
									<el-input v-model="orderForm.ProductLink" maxlength="500" show-word-limit
										class="limit-txt" placeholder="请以http://或者https://开头"></el-input>
								</el-form-item>
							</el-col>
						</el-card>
						<el-card class="box-card mt10">
							<div slot="header" class="clearfix">
								<span>下单信息</span>
							</div>
							<el-col :span="12" :xs="24">
								<el-form-item label="关键词类型" prop='KeywordType'>
									<el-radio-group v-model="orderForm.KeywordType">
										<el-radio label="1" value="2">产品关键词</el-radio>
										<el-radio label="2" value="2">CPC关键词</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="关键词" prop="ProductKeyword">
									<el-input v-model="orderForm.ProductKeyword" :rows="5" maxlength="500"
										show-word-limit placeholder='请输入关键词'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="留评比例" prop="ProductPosition">
									<el-select v-model="orderForm.ProductPosition" placeholder="请选择留评比例"
										@change="getFee" style="width: 246px;">
										<el-option v-for="(item,index) in biliData" :key="index" :value="item.bili"
											:label="item.bili"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="任务开始时间" prop="StartTime">
									<el-date-picker v-model="orderForm.StartTime" value-format="yyyy-MM-dd"
										style="display: inline-block;width: 100%;" type="date" placeholder="选择日期"
										:picker-options="startDataOp">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="12" :xs="24">
								<el-form-item label="订单数量" prop="Number">
									<el-input v-model="orderForm.Number" placeholder="请输入订单数量" style="width: 246px;">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12' :xs="24">
								<el-form-item label="任务结束时间">
									<el-date-picker v-model="orderForm.EndTime" value-format="yyyy-MM-dd"
										style="display: inline-block;width: 100%;" type="date" placeholder="选择日期"
										:picker-options="endDateOp">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span='24' :xs="24">
								<el-form-item label='下单备注' prop='Remarks'>
									<el-input type='textarea' :autosize="{ minRows: 5, maxRows: 8}"
										v-model='orderForm.Remarks'></el-input>
								</el-form-item>
							</el-col>
						</el-card>
						<el-col :span="24" :xs="24">
							<div class="mt30 fz14" v-show="this.orderForm.ServiceType">
								<div v-show="this.orderForm.ServiceType==1">
									<span>产品总价：</span>
									<span class="danger">￥{{productTotal}}</span>
									<span class="ml20">(产品总价) = {{orderForm.ProductPrice}} (产品价格) *
										{{Number(orderForm.Number)}} (数量) * {{rate}}
										(汇率)</span>
								</div>
								<div class="mt20">
									<span>服务费：</span>
									<span class="danger">￥{{serviceFeeTotal}}</span>
									<span class="ml20">(服务费) = {{fee}} (服务费单价) * {{Number(orderForm.Number)}} (数量) +
										{{addFee}}(增值费单价) *
										{{Number(orderForm.Number)}} (数量)</span>
								</div>
								<div class="mt20">
									<span>合计：</span>
									<span class="danger">￥{{allTotal}}</span>
									<span class="ml20">(合计) = <span
											v-show="this.orderForm.ServiceType==1">{{productTotal}} (产品总价) +</span>
										{{serviceFeeTotal}}(服务费)</span>
								</div>
							</div>
						</el-col>
					</el-form>
				</el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeModel">取消</el-button>
				<el-button type="primary" @click="submitOrder" :loading="btnLoading">确定</el-button>
			</span>
		</el-dialog>

		<!-- 付款-->
		<el-dialog title="付款" :visible.sync="payModel" :close-on-click-modal="false" width="20%" center
			:before-close="payClose">
			<div class="txt-c">
				<div>
					<span>账户余额：</span>
					<span class="success">￥{{balance}}</span>
				</div>
				<div class="mt10">
					<span>待付金额：</span>
					<span class="danger">￥{{payMoney}}</span>
				</div>
				<div class="mt20">请选择以下方式充值</div>
				<div v-for="(item,index) in payMentData" :key='index' class="center">
					<div class="mt10">
						<span v-if="item.PaymentState==1">支付宝</span>
						<span v-if="item.PaymentState==2">微信</span>
					</div>
					<img :src="'/'+item.Image" style="width: 150px;">
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="payClose">关闭</el-button>
			</div>
		</el-dialog>

		<!-- 订单查看 -->
		<el-dialog width="70%" :title="title" :visible.sync="viewModal" :close-on-click-modal="false">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>产品信息</span>
				</div>
				<el-form :model='viewOrderData' ref='viewOrderData' label-width='150px'>
					<el-row>
						<el-col :span="24">
							<el-form-item label='产品图片：' prop="ProductPictures">
								<el-image style="width: 80px" class="pointer" v-if="viewOrderData.ProductPictures"
									:src="'/'+viewOrderData.ProductPictures"
									:preview-src-list="('/'+viewOrderData.ProductPictures || '').split(',')"></el-image>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='产品链接：' prop="ProductLink">
								<el-link type="primary" :underline="false" :href="viewOrderData.ProductLink"
									target="_blank">{{viewOrderData.ProductLink}}</el-link>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='订单类型：' prop="ServiceType">
								<span v-if="viewOrderData.ServiceType==1">评后返（代返）</span>
								<span v-if="viewOrderData.ServiceType==2">评后返（自返）</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品名称：' prop="ProductName">
								<span>{{viewOrderData.ProductName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品ASIN：' prop="Asin">
								<span>{{viewOrderData.Asin}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='店铺名称：' prop="ShopName">
								<span>{{viewOrderData.ShopName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品单价：' prop="ProductPrice">
								<span>{{viewOrderData.symbol}}{{viewOrderData.ProductPrice}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='国家：' prop="CountryName">
								<span>{{viewOrderData.CountryName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='订单状态：' prop="OrderState">
								<span v-if="viewOrderData.OrderState==1">待确认</span>
								<span class="primary" v-if="viewOrderData.OrderState==2">待分配</span>
								<span class="warning" v-if="viewOrderData.OrderState==3">已分配</span>
								<span class="success" v-if="viewOrderData.OrderState==4">已完成</span>
								<span class="danger" v-if="viewOrderData.OrderState==5">已取消</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品评分：' prop="ProductScore">
								<el-rate style="margin-top: 10px;" v-model="viewOrderData.ProductScore" disabled
									show-score text-color="#ff9900"></el-rate>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-card class="box-card mt20">
				<div slot="header" class="clearfix">
					<span>下单信息</span>
				</div>
				<el-form :model='viewOrderData' ref='viewOrderData' label-width='150px'>
					<el-row>
						<el-col :span="12">
							<el-form-item label='订单编号：' prop="OrderNumbers">
								<span>{{viewOrderData.OrderNumber}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='关键词类型：' prop="KeywordType">
								<span v-if="viewOrderData.KeywordType==1">产品关键词</span>
								<span v-if="viewOrderData.KeywordType==2">CPC关键词</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='关键词：' prop="ProductKeyword">
								<span>{{viewOrderData.ProductKeyword}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务数量：' prop="Number">
								<span>{{viewOrderData.Number}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='留评率：' prop="ProductPosition">
								<span>{{viewOrderData.ProductPosition}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务开始时间：' prop="StartTimes">
								<span>{{viewOrderData.StartTimes}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='任务结束时间：' prop="EndTimes">
								<span>{{viewOrderData.EndTimes}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='汇率：' prop="ExchangeRate">
								<span>{{viewOrderData.ExchangeRate}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='产品总价：' prop="TotalProductPrice">
								<span>{{viewOrderData.TotalProductPrice}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='服务费单价：' prop="UnitPriceSerCharge">
								<span>{{viewOrderData.UnitPriceSerCharge}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label='增值费单价：' prop="AddedFee">
								<span>{{viewOrderData.AddedFee}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='合计：' prop="Total">
								<span style="color: red;">{{viewOrderData.Total}}</span>
								<span style="margin-left: 15px;"> {{viewOrderData.TotalProductPrice}} (产品总价) +
									{{viewOrderData.UnitPriceSerCharge}}(服务费单价) * {{viewOrderData.Number}} (任务数量) +
									{{viewOrderData.AddedFee}}
									(增值费单价) * {{viewOrderData.Number}}(任务数量)</span>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label='下单备注：' prop="Remarks">
								<span>{{viewOrderData.Remarks}}</span>
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
	import table2excel from 'js-table2excel'

	import {
		orderList,
		orderStateNum,
		countryList,
		rateList,
		feeList,
		addFeeList,
		addOrder,
		orderState,
		payMent,
		userInfo
	} from '@/api/api'
	export default {
		name: 'order',
		data() {
			return {
				title: '',
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				viewOrderData: {},
				viewModal: false,
				listLoading: false,
				btnLoading: false,
				tableData: [],
				checkBoxData: [], //选中数据
				countryData: [], //国家数据
				rateData: [], //汇率数据
				feeData: [], //服务费数据
				addFeeData: [], //增值费数据
				biliData: [], //留评比例数据
				payMentData: [], //支付方式数据
				searchForm: {
					searchWords: '',
					state: '',
					country: [],
					time: []
				},
				all: 0, //全部
				dqr: 0, //待确认
				dfp: 0, //待分配
				yfp: 0, //已分配
				ywc: 0, //已完成
				yqx: 0, //已取消
				addOrderModal: false,
				orderForm: {
					CountryId: '',
					ServiceType: '', //订单类型
					Asin: '', //产品ASIN
					ShopName: '', //店铺名称
					ProductName: '', //产品名称
					ProductPrice: '', //价格
					Brand: '', //品牌
					Place: '', //产品位置
					ProductScore: 0, //评分
					ProductLink: '', //产品链接
					ProductPictures: '', //产品图片
					KeywordType: '1', //关键词类型
					ProductKeyword: '', //搜索关键词
					ProductPosition: '', //留评比例,
					Number: '', //订单数量
					StartTime: '', //任务开始时间
					EndTime: '', //任务结束时间
					Remarks: '' //备注
				},
				symbol: '', //货币符号
				rate: 0, //汇率
				fee: 0, //服务费单价
				addFee: 0, //增值费
				startDataOp: this.startDate(),
				endDateOp: this.endDate(),
				imageUrl: '',
				payModel: false,
				balance: 0, //余额
				payMoney: 0, //应付金额
				orderRule: {
					Asin: [{
						required: true,
						message: '请输入产品ASIN',
						trigger: 'blur'
					}],
					CountryId: [{
						required: true,
						message: '请选择国家',
						trigger: 'blur'
					}],
					ServiceType: [{
						required: true,
						message: '请选择下单类型',
						trigger: 'blur'
					}],
					ShopName: [{
						required: true,
						message: '请输入店铺名称',
						trigger: 'blur'
					}],
					ProductPictures: [{
						required: true,
						message: '请选择产品图片',
						trigger: 'blur'
					}],
					StartTime: [{
						required: true,
						message: '请选择任务开始时间',
						trigger: 'blur'
					}],
					EndTime: [{
						required: true,
						message: '请选择任务结束时间',
						trigger: 'blur'
					}],
					ProductName: [{
						required: true,
						message: '请输入产品名称',
						trigger: 'blur'
					}],
					ProductLink: [{
						pattern: /(http|https):\/\/([\w.]+\/?)\S*/,
						message: '请输入以http:// 或 https://开头的正确产品链接',
						trigger: ['blur']
					}],
					ProductPrice: [{
							required: true,
							message: '请输入产品价格',
							trigger: 'blur'
						},
						{
							pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
							message: '金额格式不正确（大于0且最多2位小数）',
							trigger: 'blur'
						}
					],
					Number: [{
							required: true,
							message: '请输入订单数量',
							trigger: 'blur'
						},
						{
							pattern: /^[1-9]\d*$/,
							message: '订单数量必须为正整数',
							trigger: 'blur'
						}
					],
					PayAccount: [{
						required: true,
						message: '请输入付款账号',
						trigger: 'blur'
					}],
					ProductPosition: [{
						required: true,
						message: '请选择留评比例',
						trigger: 'blur'
					}],
					ProductKeyword: [{
						required: true,
						message: '请输入关键词',
						trigger: 'blur'
					}],
					Brand: [{
						required: true,
						message: '请输入产品品牌',
						trigger: 'blur'
					}],
					Place: [{
						required: true,
						message: '请输入产品位置',
						trigger: 'blur'
					}]
				},
			}
		},
		created() {
			this.getAllData()
			this.getOrderStateNum()
			this.getCountryData()
			this.getRateData()
			this.getFeeData()
			this.getAddFeeData()
		},
		computed: {
			//产品总价
			productTotal: function() {
				let type = this.orderForm.ServiceType
				if (type == '1') {
					return (Number(this.orderForm.ProductPrice) * Number(this.orderForm.Number) * Number(this.rate))
						.toFixed(2)
				} else {
					return Number(0).toFixed(2)
				}
			},
			//服务费
			serviceFeeTotal: function() {
				return (Number(this.addFee) * Number(this.orderForm.Number) + Number(this.fee) * Number(this.orderForm
					.Number)).toFixed(2)
			},
			//合计
			allTotal: function() {
				return (Number(this.productTotal) + Number(this.serviceFeeTotal)).toFixed(2)
			}
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
					statetime: time1,
					endtime: time2,
					pageNum: _this.pageIndex,
					pagesize: _this.pageSize
				}
				orderList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.list
					_this.total = Number(res.total)
				}).catch((e) => {})
			},

			//获取不同状态的订单数量
			getOrderStateNum() {
				let _this = this
				let time = _this.searchForm.time
				let time1 = ''
				let time2 = ''
				if (time != '' && time != null) {
					time1 = time[0]
					time2 = time[1]
				}
				let params = {
					Id: sessionStorage.getItem('userId'),
					kWord: _this.searchForm.searchWords,
					countryIdx: _this.searchForm.country,
					statetime: time1,
					endtime: time2
				}
				orderStateNum(params).then(res => {
					_this.all = Number(res[0].TotalCount) //全部
					_this.dqr = Number(res[0].TotalToBeParker) //待确认
					_this.dfp = Number(res[0].TotalToBeAllocated) //待分配
					_this.yfp = Number(res[0].TotalAlreadyAllocated) //已分配
					_this.ywc = Number(res[0].TotalCompleted) //已完成
					_this.yqx = Number(res[0].TotalCancel) //已取消
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
			},

			//根据国家取汇率和货币符号
			getRateSymbol() {
				let _this = this
				let rateData = _this.rateData
				let countryId = _this.orderForm.CountryId
				for (let x in rateData) {
					if (rateData[x].CountryId == countryId) {
						_this.rate = rateData[x].ExchangeRate
						_this.symbol = rateData[x].CurrencySymbol
					}
				}
			},

			//根据国家获取留评比例数据
			getBiliData() {
				let _this = this
				let bili = []
				let feeData = _this.feeData
				let countryId = _this.orderForm.CountryId
				for (let x in feeData) {
					if (feeData[x].CountryId == countryId) {
						bili.push({
							'bili': feeData[x].Probability
						})
					}
				}
				_this.biliData = bili
			},

			//切换国家
			changeCountry() {
				let _this = this
				_this.orderForm.ProductPosition = ''
				_this.getRateSymbol()
				_this.getBiliData()
			},

			// 根据国家和留评比例获取服务费单价
			getFee() {
				let _this = this
				let feeData = _this.feeData
				let countryId = _this.orderForm.CountryId
				let types = _this.orderForm.ProductPosition
				for (let x in feeData) {
					if (feeData[x].CountryId == countryId && feeData[x].Probability == types) {
						_this.fee = feeData[x].FeePrice
					}
				}
			},

			//根据产品价格获取增值费
			getAddFee() {
				let _this = this
				let addFeeData = _this.addFreeData
				let price = Number(_this.orderForm.ProductPrice)
				for (let x in addFeeData) {
					if (price >= addFeeData[x].Start && price <= addFeeData[x].Ent) {
						_this.addFee = addFeeData[x].ServiceFee
					} else if (price < addFeeData[x].Start) {
						_this.addFee = 0
					}
				}
			},

			// 创建订单弹窗
			createOrder() {
				let _this = this
				_this.addOrderModal = true
			},

			// 再来一单(再次创建订单)
			createOrderAgain(index, row) {
				let _this = this
				_this.addOrderModal = true

				//获取订单数据回显
				_this.orderForm.ServiceType = row.ServiceType.toString()
				_this.orderForm.CountryId = row.CountryId
				_this.orderForm.ShopName = row.ShopName
				_this.orderForm.Asin = row.Asin
				_this.orderForm.ProductName = row.ProductName
				_this.orderForm.ProductPrice = row.ProductPrice
				_this.orderForm.ProductLink = row.ProductLink
				_this.orderForm.Brand = row.Brand
				_this.orderForm.Place = row.Place
				_this.orderForm.ProductScore = row.ProductScore
				_this.orderForm.ProductPictures = row.ProductPictures
				_this.orderForm.KeywordType = row.KeywordType.toString()
				_this.orderForm.ProductKeyword = row.ProductKeyword
				_this.orderForm.ProductPosition = row.ProductPosition
				_this.orderForm.Number = row.Number
				_this.orderForm.StartTime = row.StartTimes
				_this.orderForm.EndTime = row.EndTimes
				_this.orderForm.Remarks = row.Remarks
				_this.imageUrl = row.ProductPictures
				_this.getRateSymbol() //汇率货币符号
				_this.getBiliData() //留评比例
				_this.getFee() //服务费
				_this.getAddFee() //增值费
			},

			// 创建订单关闭
			closeModel() {
				let _this = this
				_this.addOrderModal = false
				_this.$refs['orderForm'].resetFields()
				_this.addFee = 0
				_this.fee = 0
				_this.rate = 0
				_this.symbol = ''
				_this.orderForm = {
					CountryId: '',
					ServiceType: '',
					Asin: '',
					ShopName: '',
					ProductName: '',
					ProductPrice: '',
					Brand: '',
					Place: '',
					ProductScore: 0,
					ProductLink: '',
					ProductPictures: '',
					KeywordType: '1',
					ProductKeyword: '',
					ProductPosition: '',
					Number: '',
					StartTime: '',
					EndTime: '',
					Remarks: ''
				}
				_this.imageUrl = ''
				_this.commentTypeData = ''
			},

			// 提交订单到支付
			submitOrder() {
				let _this = this
				_this.$refs["orderForm"].validate((valid) => {
					if (valid) {
						_this.btnLoading = true

						let param = Object.assign({}, _this.orderForm)
						param.UserId = sessionStorage.getItem('userId')

						param.TotalProductPrice = _this.productTotal //产品总价
						param.ServiceCharge = _this.serviceFeeTotal //服务费
						param.Total = _this.allTotal //合计

						param.ExchangeRate = _this.rate //汇率
						param.UnitPriceSerCharge = _this.fee //服务费单价
						param.AddedFee = _this.addFee //增值费

						if (_this.orderForm.ServiceType == '2') {
							param.TotalProductPrice = 0 //产品总价
							param.ExchangeRate = 0 //汇率
						}

						addOrder(param).then((res) => {
							_this.btnLoading = false
							_this.closeModel()
							_this.showPay()
							_this.allOrderList()
							_this.allOrderStatus()
						}).catch((err) => {})
					}
				})
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

			//打开付款弹窗
			showPay() {
				let _this = this
				_this.payMoney = _this.allTotal
				_this.getBalance()
				_this.payModel = true
				payMent().then(res => {
					_this.payMentData = res.list
				}).catch(err => {})
			},

			//关闭支付弹窗
			payClose() {
				let _this = this
				_this.payModel = false
				_this.balance = 0
				_this.payMentData = []
			},

			//限制开始时间在今天之后
			startDate() {
				return {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7
					}
				}
			},

			// 任务结束时间
			endDate() {
				let _this = this
				return {
					disabledDate: time => {
						let beginDateVal = _this.orderForm.StartTime
						if (beginDateVal) {
							return (
								time.getTime() <
								new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
							)
						}
					}
				}
			},

			//取消订单
			cancelHandel(index, row) {
				let _this = this
				_this.$confirm('确定要取消订单【' + row.OrderNumber + '】吗？', '信息提示', {
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

			//订单详情
			viewModalShow(index, row) {
				let _this = this
				_this.title = '订单【' + row.OrderNumber + '】详情'
				_this.viewOrderData = Object.assign({}, row)
				//获取货币符号
				let rateData = _this.rateData
				let countryId = row.CountryId
				for (let x in rateData) {
					if (rateData[x].CountryId == countryId) {
						_this.viewOrderData.symbol = rateData[x].CurrencySymbol
					}
				}
				_this.viewModal = true //获取到数据后显示模态框
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
				_this.getOrderStateNum()
			},

			//查询某订单状态下的数据
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
				_this.searchForm.country = []
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

			//导出
			exportExcel() {
				const column = [{
						title: '订单编号',
						key: 'OrderNumber',
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
						title: '订单类型',
						key: 'ExpServiceType',
						type: 'text'
					},
					{
						title: '国家',
						key: 'CountryName',
						type: 'text'
					},
					{
						title: '产品名称',
						key: 'ProductName',
						type: 'text'
					},
					{
						title: '店铺',
						key: 'ShopName',
						type: 'text'
					},
					{
						title: 'ASIN',
						key: 'Asin',
						type: 'text'
					},
					{
						title: '关键词',
						key: 'ProductKeyword',
						type: 'text'
					},
					{
						title: '汇率',
						key: 'ExchangeRate',
						type: 'text'
					},
					{
						title: '任务数',
						key: 'Number',
						type: 'text'
					},
					{
						title: '增值费',
						key: 'AddedFee',
						type: 'text'
					},
					{
						title: '服务费',
						key: 'UnitPriceSerCharge',
						type: 'text'
					},
					{
						title: '产品总价',
						key: 'TotalProductPrice',
						type: 'text'
					},
					{
						title: '合计',
						key: 'Total',
						type: 'text'
					},
					{
						title: '下单时间',
						key: 'OrderTime',
						type: 'text'
					},
					{
						title: '状态',
						key: 'ExpOrderState',
						type: 'text'
					},
				]

				// 1.title为列名
				// 2.key为data数据每个对象对应的key
				// 3.若为图片格式, 需要加type为image的说明,并且可以设置图片的宽高
				const data = this.tableData
				// data数据一些特殊处理
				for (const t in data) {
					data[t].ExpProductImg = this.$IMG_URL + data[t].ProductPictures

					let TxtServiceType = ''
					if (data[t].ServiceType == 1) {
						TxtServiceType = '评后返（代返）'
					}
					if (data[t].ServiceType == 2) {
						TxtServiceType = '评后返（自返）'
					}
					data[t].ExpServiceType = TxtServiceType

					let TxtOrderState = ''
					if (data[t].OrderState == 1) {
						TxtOrderState = '待确认'
					}
					if (data[t].OrderState == 2) {
						TxtOrderState = '待分配'
					}
					if (data[t].OrderState == 3) {
						TxtOrderState = '已分配'
					}
					if (data[t].OrderState == 4) {
						TxtOrderState = '已完成'
					}
					if (data[t].OrderState == 5) {
						TxtOrderState = '已取消'
					}
					data[t].ExpOrderState = TxtOrderState
				}
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
				let day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate()
				let time = year + '-' + month + '-' + day

				const excelName = '订单数据' + '_' + time + '.xls'
				table2excel(column, data, excelName)
			}
		}
	}
</script>
