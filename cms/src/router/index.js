import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const vueRouter=new Router({
//	mode: 'history',
//	base: '/',  //添加的地方
	routes: [
		{
			path: '/',
			component: resolve => require(['@/pages/home'], resolve),
			children: [{
					path:'/deskTop',
					name:'deskTop',
					component: resolve => require(['@/pages/deskTop'], resolve),
				},
				{
					path:'/blockList',
					name:'blockList',
					component: resolve => require(['@/pages/blockList'], resolve)
				},
				{
					path:'/whitelist',
					name:'whitelist',
					component: resolve => require(['@/pages/whitelist'], resolve)
				},
				{
					path:'',
					component: resolve => require(['@/pages/deskTop'], resolve),
				},
			]
		},
		{
			path: '/',
			component: resolve => require(['@/pages/home'], resolve),
			children: [{
					path: '/autoJob',
					name:'autoJob',
					component: resolve => require(['@/pages/autoJob'], resolve),
				}
			]
		},
		{
			path: '*',
			hidden: true,
//			component: resolve => require(['@/pages/home'], resolve),
//			redirect: '/',
			redirect: { path: '/' }
		},
		
	]
});
//vueRouter.beforeEach(function (to, from, next) {   
//	const nextRoute = [ 'deskTop', 'blockList', 'whitelist','autoJob'];   
//	const auth = store.state.auth;   //跳转至上述3个页面    
//
//	
//	if (nextRoute.indexOf(to.name) >= 0) {      //未登录      
//		if (!store.state.auth.IsLogin) {          
//			vueRouter.push({name: 'login'})   
//		}   
//	}    
//	//已登录的情况再去登录页，跳转至首页
//	if (to.name === 'login') {       
//		if (auth.IsLogin) {  
//			vueRouter.push({name: 'home'});
//		}  
//	}   
//	next();
//});
export default vueRouter;