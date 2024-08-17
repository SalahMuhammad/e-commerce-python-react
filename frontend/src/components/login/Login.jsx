import { useState } from "react"
import { useNavigate } from "react-router-dom";
// custom
import { useFormInput } from "../custom-hooks/useFormInput"
import { notify } from "../notification";
import { setCookie } from "../utilities";
import { login } from '../api';
import FieldBox from "../common/FieldBox";


export default function Login() {
	const usernameAttributes = useFormInput('')
	const passwordAttributes = useFormInput('')
	const [errors, setErrors] = useState({})
	const navigate = useNavigate();
	const data = {
		username: usernameAttributes.value,
		password: passwordAttributes.value
	}

	async function handleSubmit(e) {
		e.preventDefault()

		login(data)
			.then((response) => {
				if (response.status === 200) {
					setCookie('auth', response.data['jwt'], 1)
					navigate('/الاصناف', { replace: true })
					return
				}
				else if (response.response) {
					setErrors(response.response.data)
				} else {
					notify('error', response.message)
				}
			})
	}

	return (
		<div className="container padding-top">
			<form onSubmit={handleSubmit} className="login-form">
				<FieldBox
					id="username"
					label="اسم المستخدم"
					inputAttributes={{ ...usernameAttributes }}
					errorMessage={errors['username']} />

				<FieldBox
					id="password"
					label="كلمه المرور"
					inputAttributes={{ ...passwordAttributes, "type": "password" }}
					errorMessage={errors['password']} />

				<input className="btn btn-success" type="submit" value="تسجيل الدخول" />
			</form>		
		</div>
	)
}
