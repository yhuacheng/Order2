import {
	get,
	post
} from './http'

export const login = (params) => post('/api/Login/UserLogin', params) //登录 

export const register = (params) => post('/api/CustomerUser/AddUser', params) //注册
export const regCode = (params) => post('/api/CustomerUser/zCSend', params) //注册获取验证码

export const findCode = (params) => post('/api/CustomerUser/ChangZCSeng', params) //找回密码获取验证码
export const findCodeCheck = (params) => post('/api/CustomerUser/RetrievePassWord', params) //找回密码手机验证码验证
export const resetPassWord = (params) => post('/api/CustomerUser/ChangeLoginPassWord', params) //找回密码重置密码

export const editPassword = (params) => post('/api/CustomerUser/ChangePassWord', params) //修改密码

export const editQQ = (params) => post('/api/CustomerUser/ChangeQQ', params) //修改QQ
export const editName = (params) => post('/api/CustomerUser/ChangeName', params) //修改姓名
export const editWeChat = (params) => post('/api/CustomerUser/ChangeWeChat', params) //修改微信

export const oldPhoneCode = (params) => post('/api/CustomerUser/ChangePhoneCode', params) //修改手机号获取验证码
export const oldPhoneCodeCheck = (params) => post('/api/CustomerUser/YzChangePhoneCode', params) //修改手机号验证码验证
export const newPhoneCode = (params) => post('/api/CustomerUser/ChangeNewPhoneCode', params) //新手机号获取验证码
export const editPhone = (params) => post('/api/CustomerUser/ChangePhone', params) //修改手机号

export const taskSum = (params) => get('/api/Task/GetAllTaskState', params) //首页任务数量
export const userInfo = (params) => get('/api/HomePage/GetUserInformation', params) //个人信息、余额
export const notice = (params) => get('/api/HomePage/GetHomePage') //首页公告

export const orderList = (params) => post('/api/Order/GetOrders', params) //订单列表
export const orderStateNum = (params) => post('/api/Order/GetOrderState', params) //各订单状态数量
export const addOrder = (params) => post('/api/Order/AddOrder', params) //创建订单
export const orderState = (params) => post('/api/Order/ChangeOrderState', params) //取消订单

export const payMent = (params) => get('/api/Order/GetPayment', params) //支付方式

export const taskList = (params) => post('/api/Task/GetMyTaskList', params) //任务管理
export const taskStateNum = (params) => post('/api/Task/MyTaskStates', params) //任务管理状态
export const taskConfirmOrder = (params) => post('/api/Task/ConfirmTaskThree', params) //任务确认出单
export const taskConfirmComment = (params) => post('/api/Task/ConfirmTaskFiveOrSeven', params) //任务确认评价

export const countryList = (params) => get('/api/Country/GetCountry', params) //国家

export const rateList = (params) => get('/api/Rate/GetRate', params) //汇率

export const feeList = (params) => get('/api/Fee/GetFee', params) //服务费

export const addFeeList = (params) => get('/api/IncrementServiceFee/GetIncrementServiceFee', params) //增值费

export const takeMoneyList = (params) => get('/api/DrawMoney/GetUserWithdrawal', params) //提现列表
export const takeMoneyAdd = (params) => post('/api/DrawMoney/UserWithdrawal', params) //提现新增
export const noDoMoney = (params) => get('/api/DrawMoney/GetMoney', params) //提现待处理金额总和(配合余额计算出可提现金额)

export const moneyList = (params) => get('/api/CustomerFinance/GetPayStateOne', params) //我的账单
