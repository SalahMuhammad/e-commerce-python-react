import { useRef, useState } from "react";
import { sendRequest } from "../api";
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from "react-router-dom";
import MyModal from "../common/Modal";
import Button from 'react-bootstrap/Button';
import { useData2 } from "../custom-hooks/useData";
import { getCookie } from "../utilities";
import { notify } from "../notification";
import MyGroup from "../common/FormGroup"


const initialData = {name:'', price1: '', price2: '', price3: '', price4: ''}
export default function ItemsForm() {
	const { id } = useParams()
	let method = id ? 'put' : 'post'
	const [data, setData] = useState(initialData)
	const [errors, setErrors] = useState({})
	const [autoCalculatePrices, setAutoCalculatePrices] = useState(true);
	const { loading } = useData2(id ? `api/items/${id}/` : null, setData)
	const itemNameRef = useRef()
    const navigate = useNavigate()
	const pp = getCookie('pp') || {}

	const handleOnChange = (e, callback) => {
		const { name, value } = e.target
	
		setData((prev) => ({
			...prev,
			[name]: value
		}))
	
		callback && callback()
	}

	const handleSubmit = async () => {
		setErrors({})
		
		const {error, statusCode} = await sendRequest(
			method, 
			`api/items/${data.id ? `${data.id}/` : ''}`, 
			data, 
			'الصنف'
		)

		if ([200, 201, 204].includes(statusCode)) {
			// success
			if (method === 'post') {
				itemNameRef.current.focus()
				setData(initialData)
			} else {
				navigate('../')
			}
		} else if (statusCode === 400) {
			setErrors(error);
		}
	}	

	return (
		<MyModal title={id ? `تعديل ${data.name}` : "اضافه صنف"} onSubmit={handleSubmit}>
			<Form>
				{(loading && (method != 'post')) && <p style={{color: 'red'}}>جار تحميل البيانات...</p>}
				
				<MyGroup label='اسم الصنف' feedback={errors.name || ''}> 
					<Form.Control
						ref={itemNameRef}
						type="text"
						name='name'
						value={data.name}
						placeholder="اسم الصنف"
						onChange={handleOnChange}
						autoFocus
						isInvalid={errors.name}
					/>
				</MyGroup>

				<MyGroup label='شراء' feedback={errors.price1 || ''}>
					<Form.Control
						{...numberFieldAttr}
						name='price1'
						value={data.price1}
						placeholder="شراء"
						onChange={(e) => handleOnChange(e, () => {
							if (autoCalculatePrices) {
								const value = Number(e.target.value)
								setData((prev) => ({
									...prev,
									price2: value + value * pp.price2,
									price3: value + value * pp.price3,
									price4: value + value * pp.price4,
								}))
							}
						})}
						isInvalid={errors.price1}
						required
					/>
				</MyGroup>

				<div className="mt-4">
					<label htmlFor="f3" className="form-check-label">
						حساب الاسعار بالنسب المقرره مسبقا&nbsp;
					</label>
					<input id="f3" className="form-check-input" type="checkbox" onChange={(e) => {
							setAutoCalculatePrices(e.target.checked);
						}} checked={autoCalculatePrices} />
				</div>

				<MyGroup label='خاص' feedback={errors.price2 || ''}>
					<Form.Control
						{...numberFieldAttr}
						name='price2'
						value={data.price2}
						placeholder="خاص"
						onChange={handleOnChange}
						disabled={autoCalculatePrices}
						isInvalid={errors.price2}
						required
					/>
				</MyGroup>

				<MyGroup label='جمله' feedback={errors.price3 || ''}>
					<Form.Control
						{...numberFieldAttr}
						name='price3'
						value={data.price3}
						placeholder="جمله"
						onChange={handleOnChange}
						disabled={autoCalculatePrices}
						isInvalid={errors.price3}
						required
					/>
				</MyGroup>

				<MyGroup label='قطاعى' feedback={errors.price4 || ''}>
					<Form.Control
						{...numberFieldAttr}
						name='price4'
						value={data.price4}
						placeholder="قطاعى"
						onChange={handleOnChange}
						disabled={autoCalculatePrices}
						isInvalid={errors.price4}
						required
					/>
				</MyGroup>

				<MyGroup label='الصور' feedback=''>
					<input 
						style={{borderColor: errors.images_upload ? 'red' : 'inhrit'}}
						className="form-control" 
						type="file"
						onChange={(e) => {
							
							const files = e.target.files
							
							const readFile = (file) => {
								return new Promise((resolve, reject) => {
									const reader = new FileReader();
									reader.onload = () => {
										resolve(reader.result);
									};
									reader.onerror = reject;
									reader.readAsDataURL(file);
								});
							};

							const fileReadPromises = [];
							for (let file of files) {
								fileReadPromises.push(readFile(file));
							}

							Promise.all(fileReadPromises)
								.then((results) => {
									setData((prev) => ({
										...prev,
										images_upload: results // Ensure img is an array and add new images_upload
									}));
								})
								.catch((error) => {
									console.error('Error reading files:', error);
								});
							// const reader = new FileReader()
							// Set up an event listener for when the file is loaded
							// reader.onload = () => {
							// 	setData((prev) => ({
							// 		...prev,
							// 		img: reader.result // reader.result contains the base64 encoded string of the image
							// 	}))
							// }
							// Read the file as a data URL (base64 encoded)
							// reader.readAsDataURL(file);
						}}
						multiple
					/>
					{errors.images_upload && <span style={{color: 'red'}}>{errors.images_upload}</span>}
				</MyGroup>

				{method !== 'post' && <Button variant='danger' className="mt-3" onClick={() => {
					method = 'delete';
					if (handleDelete()) {
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

const handleDelete = () => {
	return confirm("هل انت متاكد من انك تريد حذف هذا الصنف !!؟")
}

const numberFieldAttr = {
	type: 'number',
	step: 'any',
}


// {
// 	return (
// 		<MyModal title={"اضافه صنف جديد"} onSubmit={handleSubmit}>

// 				{(loading && (method != 'post')) && <p style={{background: 'red'}}>جار تحميل البيانات...</p>}

// 				<button
// 					type="button"
// 					className="btn btn-secondary"
// 					onClick={() => {
// 						navigate("/الاصناف/نسب-الربح");
// 					}} >
// 					تحديد نسب الربح
// 				</button>


// 				<div className="input-boxxx mt-4">
// 					<input ref={itemNameRef} id='f-01' name="name" value={data.name} onChange={handleOnChange} />
// 					<label htmlFor='f-01' className={data.name && "active"}>
// 						اسم الصنف
// 					</label>
// 					<span>{errors.name || ''}</span>
// 				</div>

// 				<div className="input-boxxx mt-4">
// 					<input id='f-02' name="price1" {...commonNumberFieldAttributes} value={data.price1} onChange={(e) => {
// 						handleOnChange(e, () => {
// 							if (autoCalculatePrices) {
// 								const value = Number(e.target.value)
// 								setData((prev) => ({
// 									...prev,
// 									price2: value + value * pp.price2,
// 									price3: value + value * pp.price3,
// 									price4: value + value * pp.price4,
// 								}))
// 							}
// 						})
// 					}} />
// 					<label htmlFor='f-02' className={data.price1 && "active"}>
// 						شراء
// 					</label>
// 					<span>{errors.price1 || ''}</span>
// 				</div>

// 				<div className="mt-4">
// 					<label htmlFor="f3" className="form-check-label">
// 						حساب الاسعار بالنسب المقرره مسبقا&nbsp;
// 					</label>
// 					<input id="f3" className="form-check-input" type="checkbox" onChange={(e) => {
// 							setAutoCalculatePrices(e.target.checked);
// 						}} checked={autoCalculatePrices} />
// 				</div>

// 				<div className="input-boxxx mt-4">
// 					<input id='f-03' name="price2" {...commonNumberFieldAttributes} value={data.price2} onChange={handleOnChange} disabled={autoCalculatePrices} />
// 					<label htmlFor='f-03' className={data.price2 && "active"}>
// 						خاص
// 					</label>
// 					<span>{errors.price2 || ''}</span>
// 				</div>

// 				<div className="input-boxxx mt-4">
// 					<input id='f-04' name="price3" {...commonNumberFieldAttributes} value={data.price3} onChange={handleOnChange} disabled={autoCalculatePrices} />
// 					<label htmlFor='f-04' className={data.price3 && "active"}>
// 						جمله
// 					</label>
// 					<span>{errors.price3 || ''}</span>
// 				</div>

// 				<div className="input-boxxx mt-4">
// 					<input id='f-05' name="price4" {...commonNumberFieldAttributes} value={data.price4} onChange={handleOnChange} disabled={autoCalculatePrices} />
// 					<label htmlFor='f-05' className={data.price4 && "active"}>
// 						قطاعى
// 					</label>
// 					<span>{errors.price4 || ''}</span>
// 				</div>

// 				<div className="mt-4">
// 					{/* <label htmlFor="f7" className="form-label">
// 						الصور
// 					</label> */}
// 					<input 
// 						id="f7" 
// 						className="form-control" 
// 						type="file" 
// 						onChange={(e) => {
// 							const file = e.target.files[0]
// 							// Create a new FileReader
// 							const reader = new FileReader()
// 							// Set up an event listener for when the file is loaded
// 							reader.onload = () => {
// 								setData((prev) => ({
// 									...prev,
// 									img: reader.result // reader.result contains the base64 encoded string of the image
// 								}))
// 							}
// 							// Read the file as a data URL (base64 encoded)
// 							reader.readAsDataURL(file);
// 						}}
// 					/>
// 					<span style={{color: "red"}}>{errors.img || ''}</span>
// 				</div>

// 				{method !== 'post' && <Button variant='danger' className="mt-3" onClick={(e) => {
// 					method = 'delete';
// 					if (handleDelete()) {
// 						handleSubmit()
// 						navigate('../')
// 					} else {	
// 						method = 'put'
// 					}}}>حذف</Button>
// 				}

// 				{/* {modalFooter} */}
// 			{/* </form> */}
// 		</MyModal>
// 	);
// }