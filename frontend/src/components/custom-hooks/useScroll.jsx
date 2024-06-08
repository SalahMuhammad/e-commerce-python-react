import { useEffect } from "react";

export default function useScroll(loading, nextUrl, setUrl) {
    useEffect(() => {
		function handleScroll() {
			if (loading || nextUrl === null) {
				return
			}

			const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			const windowHeight = window.innerHeight || document.documentElement.clientHeight;
			const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if (scrollTop + windowHeight >= documentHeight - 50) {
				setUrl(nextUrl.split('8000/')[1])
			}
		}

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	})
}