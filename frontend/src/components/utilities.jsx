
export function setCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

	document.cookie = `${name}=${value || ""}; expires=${date.toUTCString()}; path=/;`;
}


export function getCookie(name) {
    if (isCookieExist(name)) {
        try {
            const stringData = document.cookie
                .split(';')
                .filter((v) => v.includes(name))[0]
                .split('=')[1]
            return JSON.parse(stringData)
        }
        catch (error) {
            console.log('getCookie() Error')
            console.error(error)
        }
    }
}


export function removeCookie(name, path='/', domain) {
    if( isCookieExist( name ) ) {
        document.cookie = name + "=" +
            ((path) ? ";path="+path:"")+
            // ((domain)?";domain="+domain:"") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

function isCookieExist(name){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
}