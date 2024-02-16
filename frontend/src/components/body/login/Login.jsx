import { useState } from "react"
import { useFormInput } from "../../custom-hooks/useFormInput"
import { fetchData } from '../../api'

export default function Login() {
  const usernameAttributes = useFormInput('s')
  const passwordAttributes = useFormInput('f')
  const data = {
    username: usernameAttributes.value,
    password: passwordAttributes.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    fetchData(
      'api/users/login/',
      {
        method: 'POST',
        Content_Type: 'application/json',
        body: JSON.stringify(data)
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <FormBoxField 
        id="username"
        type="text"
        label="اسم المستخدم"
        attributes={usernameAttributes}/>

      <FormBoxField 
        id="password"
        type="password"
        label="كلمه المرور"
        attributes={passwordAttributes}/>

      <input className="btn btn-success" type="submit" value="تسجيل الدخول" />
    </form>
  )
}

function FormBoxField({ id, type, label, attributes }) {
  return (
    <div className="input-boxxx">
      <input 
        id={id} 
        type={type} 
        {...attributes} />
        <label htmlFor={id} className={attributes.value && 'active'} >{label}</label>
    </div>
  )
}
