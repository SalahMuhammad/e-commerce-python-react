
export async function fetchData(endPoint, options) {
  return await (await fetch(`http://127.0.0.1:8000/${endPoint}`, options)).json();
}
