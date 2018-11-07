import axios from 'axios';

//let token=sessionStorage.getItem("token");
//axios.defaults.headers={"Authorization":token};

//		axios.defaults.baseURL = 'http://10.169.8.208:8083/api/';
//axios.defaults.baseURL = 'http://168.63.148.190:8084/api/';
axios.defaults.baseURL = process.env.API_HOST+'/api/';


//添加job http://168.63.148.190:8084/jobs/add post提交
//请求 query 接口
export const getCmsCards = params => {
	return axios.get('article/search', {
		params: params
	});
};
//请求 feeds 接口
export const getFeeds = (params, url) => {
	return axios.get('provider/query-feeds/' + url);
};
//请求 provider 接口
export const getProvider = params => {
	return axios.get('provider/query', {
		params: params
	})
}
//获取状态接口
//http://stcvm-f23:5000/api/list/state/BBMDmB8
export const getState = url => {
	return axios.get('list/state/' + url)
}
//		 http://stcvm-f23:5000/api/list/checkout-checkin/BBMDmB8
export const checkoutAndCheckin = (params, url) => {
	return axios.put('/list/checkout-checkin/' + url, params)
}
//@app.route('/jobs/delete/<id>', methods=['POST'])     删除job列表接口
export const deleteJobList = (url) => {
	return axios.delete('/jobs/' + url)
}
//​
//@app.route('/jobs/resume/<id>')  启动job列表接口
export const resumeJobList = (url) => {
	return axios.post('/jobs/resume/' + url)
}
//@app.route('/jobs/pause/<id>')  暂停job列表接口
export const pauseJobList = (url) => {
	return axios.post('/jobs/pause/' + url,)
}
//@app.route('/jobs/pause/<id>')  获取job列表接口
export const getJobList = () => {
	return axios.get('/jobs')
}
//http://localhost:8000/jobs
export const saveJobList = (params) => {
	return axios.post('/jobs',params)
}
//获取黑名单接口   /api/block-list/keywords
export const getBlockList= () => {
	return axios.get('/block-list/keywords')
}
// 修改黑名单
export const modifyBlockList= (params) => {
	return axios.put('/block-list/keywords',params)
}
//获取白名单列表 http://168.63.148.190:8084/api/white-list   feedID
export const getWhiteList= () => {
	return axios.get('/white-list')
}
// 增加 白名单 feedID
export const modifyWhiteList= (params) => {
	return axios.post('/white-list',params)
}
// 删除 白名单 feedID
export const deleteWhiteList= (url) => {
	return axios.delete('/white-list/'+url)
}
//获取白名单 http://168.63.148.190:8084/api/white-list/AAws4Uo
export const getWhiteListByFeed= (url) => {
	return axios.get('/white-list/'+url)
}

// 删除 白名单 feedID
export const deleteFeedWhiteList= (url,params) => {
	return axios.put('/white-list/'+url,params)
}