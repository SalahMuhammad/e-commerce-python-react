import axiosInstance from "./axiosInstance";
import { notify } from "./notification";


export function getData(url, method='get', data={}, conf={}) {
	return axiosInstance[method](url, data, conf)
			.then((response) => {
				return response
			})
			.catch((error) => {
				notify('error', `${error.response.data.detail || error}`)
			})
}

export async function fetchData(endPoint, options) {
	return await fetch(`http://127.0.0.1:8000/${endPoint}`, options);
}

export function sendRequest(method, url, data, message) {
	return axiosInstance[method](url, data)
			.then((response) => {
				switch (method) {
					case 'post':
						notify('success', `تم ادراج ${message} بنجاح... 👍`)
						break
					case 'put':
						notify('success', `تم تعديل بيانات ${message} بنجاح... 👍`)
						break
					case 'delete':
						notify('success', `تم حذف ${message} بنجاح... 👍`)
						break
					default:
						return {success: response}
				}
				return {success: response, statusCode: response.status}
			})
			.catch((error) => {
				let err
				switch (error.response.status) {
					case 400:
						if (error.response.data.detail)
							notify('error', error.response.data.detail)
						err = error.response.data;
						break
					default:
						err = error
						console.log(error)
						notify('error', error.response.data.detail || error.message)
						break;
				}
				return {error: err, statusCode: error.response.status}
			})
}

export async function login(data) {
	return axiosInstance
		.post("api/users/login/", data)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error;
		});
}
