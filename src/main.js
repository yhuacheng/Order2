import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/style.scss'
import router from './routes'

Vue.use(ElementUI)

Vue.prototype.$IMG_URL = 'http://203.195.212.239:90/' //统一设置页面上图片URL路径入口（前台图片,列表导出图片需要用到完整路径）

Vue.prototype.$IMG_URL_BACK = 'http://203.195.212.239:9090/' //统一设置页面上图片URL路径入口（后台图片）

router.beforeEach((to, from, next) => {
	let userId = sessionStorage.getItem('userId')
	if (!userId && to.path !== '/login') {
		next({
			path: '/login'
		})
	} else {
		next()
	}
})

new Vue({
	el: '#app',
	router,
	render: h => h(App)
}).$mount('#app')
