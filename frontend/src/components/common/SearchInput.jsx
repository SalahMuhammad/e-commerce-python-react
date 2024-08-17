import { useEffect, useRef, useState } from "react";
import useData from "../custom-hooks/useData";
import MyGroup from "../common/FormGroup"
import Form from 'react-bootstrap/Form';
import CameraInput from "../items/CaptureVideo";


const SearchInput = ({ label, name, onChange, onBlur, endpotin }) => {
	const [value, setValue]	= useState('')
	const { data } = useData(endpotin ? `api/${endpotin}/?s=${value}` : null)

	const handleOnChange = (e) => {
		setValue(e.target.value)
		onChange && onChange(e.target.value, e.target.name)
	};

	const handleOnKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.target.blur()
		}
	}

	const handleOnBlur = () => {
		onBlur && onBlur(data, name)
	}

	const handleCameraInput = async (res) => {
		// const response = await res
		// response.data && set
	}

	return (
		<div className="search-input-wrapper">
			<label htmlFor="">اسم الصنف</label>
			<input 
				// readOnly={isReadOnly}
				className={'my-input'}
				autoComplete="off"
				// ref={inputRef} 
				type="text"
				name={name || ''}
				placeholder={label}
				list="items" 
				value={value} 
				onChange={handleOnChange}
				onKeyDown={handleOnKeyDown}
				onBlur={handleOnBlur}
				onFocus={(e) => e.target.select()} />
			{/* <CameraInput onSuccess={handleCameraInput} /> */}
			{endpotin &&
				<datalist id="items">
					{data.results && data.results.map((item) => (
						<option /*style={{whiteSpace: 'pre'}}*/ key={item.id} value={item.name} />
					))}
				</datalist>
			}
		</div>
	)
}

export const CustomSearchInput = ({ label, onChange, endpotin }) => {
	const [value, setValue]	= useState('')
	const { data } = useData(endpotin ? `api/${endpotin}` : null)
	// const ref = useRef(null);

	// useEffect(() => {
	// 	if (inputRef.current) {
	// 		inputRef.current.select();
	// 	}
	// }, [isViewMode]);

	const handleOnChange = (e) => {
		setValue(e.target.value)
		onChange(data)
	};

	return (
		<MyGroup label={label} feedback={''}> 
			<Form.Control
				// ref={ref}
				type="text"
				value={value}
				placeholder={label}
				onChange={handleOnChange}
				autoFocus
				// isInvalid={errors[]}
			/>
		</MyGroup>
	)
}

export default SearchInput


export const InvoiceFormSearchField = ({ label, name, v, onBlur, onEnterKeyDown, endpotin, errors }) => {
	const [value, setValue]	= useState(v)
	const { data } = useData(`api/${endpotin}/?s=${value}`)
	const id = crypto.randomUUID()
// idddidididididididididid generated on each state change
	const handleOnChange = (e) => {
		setValue(e.target.value)
	};

	const handleOnKeyDown = (e) => {
		if (e.key === 'Enter') {
			onEnterKeyDown && onEnterKeyDown(data, name, value)
			setValue('')
		}
	}

	const handleOnBlur = () => {
		onBlur && onBlur(data, name, value)
	}

	return (
		<MyGroup label={label} feedback={errors?.[name] ? errors?.[name][0] : ''}> 
			<Form.Control
				autoComplete="off"
				type="text"
				placeholder={label}
				list={id}
				name={name}
				value={value}
				onChange={handleOnChange}
				onKeyDown={handleOnKeyDown}
				onBlur={handleOnBlur}
				onFocus={(e) => e.target.select()}
				isInvalid={errors?.[name] ? true : false}
			/>
			<datalist id={id}>
				{data.results && data.results.map((item) => (
					<option key={item.id} value={item.name} />
				))}
			</datalist>
		</MyGroup>
	)
}