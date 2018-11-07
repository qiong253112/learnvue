import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users } from './data/user';
let _Users = Users;

export default {
	bootstrap() {
		let mock = new MockAdapter(axios);
		// mock success request
		mock.onGet('/success').reply(200, {
			msg: 'success'
		});

		// mock error request
		mock.onGet('/error').reply(500, {
			msg: 'failure'
		});
		//登录
		mock.onPost('/login').reply(config => {
			let {
				username,
				password
			} = JSON.parse(config.data);
			return new Promise((resolve, reject) => {
				let user = null;
				setTimeout(() => {
					let hasUser = LoginUsers.some(u => {
						if(u.username === username && u.password === password) {
							user = JSON.parse(JSON.stringify(u));
							user.password = undefined;
							return true;
						}
					});

					if(hasUser) {
						resolve([200, {
							code: 200,
							msg: '请求成功',
							user
						}]);
					} else {
						resolve([200, {
							code: 500,
							msg: '账号或密码错误'
						}]);
					}
				}, 1000);
			});
		});
				//修改密码
		mock.onPost('/changepwd').reply(config => {
			let {
				username,
				password,
				password2,
			} = JSON.parse(config.data);
			return new Promise((resolve, reject) => {
				let user = null;
				setTimeout(() => {
					let hasUser = LoginUsers.some(u => {
						if(u.username === username && password === password2) {
							user = JSON.parse(JSON.stringify(u));
							user.password = password;
							return true;
						}
					});

					if(hasUser) {
						resolve([200, {
							code: 200,
							msg: '修改密码成功',
							user
						}]);
					} else {
						resolve([200, {
							code: 500,
							msg: '两次密码输入不一致'
						}]);
					}
				}, 1000);
			});
		});
	}
}