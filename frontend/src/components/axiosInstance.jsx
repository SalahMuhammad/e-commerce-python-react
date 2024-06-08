import axios from "axios";

const axiosInstance = axios.create({
	// Set your default base URL here
	baseURL: "http://localhost:8000/",
	// You can also add default headers, interceptors, and other configurations here
});

axiosInstance.interceptors.request.use(
	(config) => {
		//   const token = localStorage.getItem('jwt'); // Assuming token is stored in localStorage
		const token = document.cookie
			.split(";")
			.filter((value) => value.includes("jwt="))[0]
		if (token) {
			config.headers.Authorization = token.split('=')[1];
		}
		config.headers["Content-Type"] = 'application/json'
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
