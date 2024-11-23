import { useRef, useState } from "react";
import { sendRequest } from "../api";
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from "react-router-dom";
import MyModal from "../common/Modal";
import Button from 'react-bootstrap/Button';
import { useData2 } from "../custom-hooks/useData";
import MyGroup from "../common/FormGroup"
import { useAltShortcut } from "../custom-hooks/useShorcut";


const initialData = {name:''}
export default function RepositoriesForm() {
	const { id } = useParams()
	let method = id ? 'put' : 'post'
	const [data, setData] = useState(initialData)
	const [errors, setErrors] = useState({})
	const { loading } = useData2(id ? `api/repositories/${id}/` : null, setData)
	const nameRef = useRef()
    const navigate = useNavigate()

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
			`api/repositories/${data.id ? `${data.id}/` : ''}`, 
			data, 
			'المخزن'
		)

		if ([200, 201, 204].includes(statusCode)) {
			// success
			if (method === 'post') {
				nameRef.current.focus()
				setData(initialData)
			} else {
				navigate('/repositories')
			}
		} else if (statusCode === 400) {
			setErrors(error);
		}
	}
	useAltShortcut(handleSubmit, 13)

	return (
		// <MyModal title={id ? `تعديل ${data.name}` : 'اضافه مخزن'} onSubmit={handleSubmit}>
			<Form onSubmit={(e) => e.preventDefault()}>
				{(loading && (method != 'post')) && <p style={{color: 'red'}}>جار تحميل البيانات...</p>}
				
				<MyGroup label='اسم المخزن' feedback={errors.name || ''}> 
					<Form.Control
						ref={nameRef}
						type="text"
						name='name'
						value={data.name}
						placeholder="اسم المخزن"
						onChange={handleOnChange}
						autoFocus
						isInvalid={errors.name}
					/>
				</MyGroup>

				{method !== 'post' && <Button variant='danger' className="mt-3" onClick={() => {
					method = 'delete';
					if (handleDelete()) {
						handleSubmit()
						navigate('/repositories')
					} else {	
						method = 'put'
					}}}>حذف</Button>
				}
				<hr />
				<Button variant="secondary" onClick={() => navigate(-1)}>
					الغاء
				</Button>
				<Button variant="primary" onClick={handleSubmit}>
					{/* {disabled && (
						<Spinner
							as="span"
							animation="border"
							size="sm"
							role="status"
							aria-hidden="true"
						/>
					)}{" "} */}
					<span>{true ? "حفظ" : "جار التحميل..."}</span>
				</Button>
			</Form>
	);
}

const handleDelete = () => {
	return confirm("هل انت متاكد من انك تريد حذف هذا الصنف !!؟")
}
