import axios from "axios";


export async function fetchData(endPoint, options) {
  return await fetch(`http://127.0.0.1:8000/${endPoint}`, options);
}

export function sendRequest(method, url, data, successCallback, errorCallback) {
  axios[method]('http://127.0.0.1:8000/' + url, data)
    .then((response) => {
      successCallback(response)
    })
    .catch((error) => {
      errorCallback(error)
    })
}

export async function login(data) {
  return axios.post('http://127.0.0.1:8000/api/users/login/', data)
    .then((response) => {
      return response
    })
    .catch((error) => {
      return error
    })
}
