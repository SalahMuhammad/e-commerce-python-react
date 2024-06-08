
export function setCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

	document.cookie = `${name}=${value || ""}; expires=${date.toUTCString()}; path=/;`;
}


export function getCookie(key) {
    try {
        const stringData = document.cookie
            .split(';')
            .filter((v) => v.includes(key))[0]
            .split('=')[1]
        return JSON.parse(stringData)
    }
    catch (error) {
        console.log('getCookie() Error')
		console.error(error)
    }
}