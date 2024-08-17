import { useRef, useState } from "react";
import { sendRequest } from "../api";
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from "react-router-dom";
import MyModal from "../common/Modal";
import Button from 'react-bootstrap/Button';
import { useData2 } from "../custom-hooks/useData";
import MyGroup from "../common/FormGroup"


const initialData = {name:'', detail: ''}
export default function ClientSupplierForm({ isClient }) {
	const { id } = useParams()
	let method = id ? 'put' : 'post'
	const [data, setData] = useState(initialData)
	const [errors, setErrors] = useState({})
	const { loading } = useData2(id ? `api/owners/${id}/` : null, setData)
	const nameRef = useRef()
    const navigate = useNavigate()
	const to = isClient ? 'عميل' : 'مورد'

	const handleOnChange = (e) => {
		const { name, value } = e.target
	
		setData((prev) => ({
			...prev,
			[name]: value
		}))
	}

	const handleSubmit = async () => {
		setErrors({})
		const {error, statusCode} = await sendRequest(
			method, 
			`api/owners/${data.id ? `${data.id}/` : ''}`, 
			data, 
			'ال' + to
		)

		if ([200, 201, 204].includes(statusCode)) {
			// success
			if (method === 'post') {
				nameRef.current.focus()
				setData(initialData)
			} else {
				navigate('../')
			}
		} else if (statusCode === 400) {
			setErrors(error);
		}
	}	

	return (
		<MyModal title={id ? `تعديل ${data.name}` : `اضافه ${to}`} onSubmit={handleSubmit}>
			<Form onSubmit={(e) => e.preventDefault()}>
				{(loading && (method != 'post')) && <p style={{color: 'red'}}>جار تحميل البيانات...</p>}
				
				<MyGroup label={`اسم ال${to}`} feedback={errors.name || ''}> 
					<Form.Control
						ref={nameRef}
						type="text"
						name='name'
						value={data.name}
						placeholder={`اسم ال${to}`}
						onChange={handleOnChange}
						autoFocus
						isInvalid={errors.name}
					/>
				</MyGroup>

				<MyGroup label='التفاصيل' feedback={errors.detail || ''}> 
					<Form.Control
						as="textarea"
						rows={3}
						// type="text"
						name='detail'
						value={data.detail}
						placeholder='التفاصيل'
						onChange={handleOnChange}
						isInvalid={errors.detail}
					/>
				</MyGroup>

				{method !== 'post' && <Button variant='danger' className="mt-3" onClick={() => {
					method = 'delete';
					if (handleDelete(to)) {
						handleSubmit()
						navigate('./')
					} else {	
						method = 'put'
					}}}>حذف</Button>
				}
			</Form>
		</MyModal>
	);
}

const handleDelete = (to) => {
	return confirm(`هل انت متاكد من انك تريد حذف هذا ال${to} !!؟`)
}
