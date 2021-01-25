import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default new Router({
	// mode: 'history',
	routes: [{
			path: '/',
			redirect: '/index',
			name: '',
			hidden: true
		},
		{
			path: '/index',
			component: () => import('./views/Index.vue'),
			name: '',
			hidden: true
		},
		{
			path: '/login',
			component: () => import('./views/Login.vue'),
			name: '',
			hidden: true
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '个人资料',
			hidden: true,
			children: [{
				path: '/userInfo',
				component: () => import('./views/UserInfo.vue'),
				name: '基本信息',
				hidden: true
			}]
		},
		{
			path: '/404',
			component: () => import('./views/404.vue'),
			name: '',
			hidden: true
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '首页面板',
			iconCls: 'el-icon-monitor',
			children: [{
				path: '/main',
				component: () => import('./views/Main.vue'),
				name: '我的主页'
			}]
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '订单管理',
			iconCls: 'el-icon-document-checked',
			children: [{
				path: '/order',
				component: () => import('./views/orderManage/order.vue'),
				name: '订单列表'
			}]
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '任务管理',
			iconCls: 'el-icon-document',
			children: [{
				path: '/task',
				component: () => import('./views/taskManage/task.vue'),
				name: '任务列表'
			}]
		},
		{
			path: '/',
			component: () => import('./views/Home.vue'),
			name: '提现管理',
			iconCls: 'el-icon-bank-card',
			children: [{
					path: '/takeMoney',
					component: () => import('./views/moneyManage/takeMoney.vue'),
					name: '提现列表'
				},
				{
					path: '/moneyDetails',
					component: () => import('./views/moneyManage/moneyDetails.vue'),
					name: '我的账单'
				},
			]
		},
		{
			path: '*',
			hidden: true,
			redirect: {
				path: '/404'
			}
		}
	]
})
