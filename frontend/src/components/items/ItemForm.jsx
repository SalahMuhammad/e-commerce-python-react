import { useRef, useState } from "react";
// import { useFormInput } from "../../custom-hooks/useFormInput"
import Dialog from "../common/Dialog";
import { fetchData } from "../api";
import { useNavigate } from "react-router-dom";
import FieldBox from "../common/FieldBox";

export default function ItemFormContent({ dialogRef, action, itemObject }) {
	const [data, setData] = useState({
		item: '',
		price1: 0,
		price2: 0,
		price3: 0,
		price4: 0,
	})
	const [name, setName] = useState(itemObject ? itemObject.name : "");
	const [price1, setPrice1] = useState(itemObject ? itemObject.price1 : "");
	const [price2, setPrice2] = useState(itemObject ? itemObject.price2 : "");
	const [price3, setPrice3] = useState(itemObject ? itemObject.price3 : "");
	const [price4, setPrice4] = useState(itemObject ? itemObject.price4 : "");
	const [autoCalculatePrices, setAutoCalculatePrices] = useState(true);
	const dataObject = useRef({});
	const navigate = useNavigate();
	// const [formData, setFormData]
	// console.log(dataObject.current)

	const commonNumberFieldAttributes = {
		type: "number",
		step: "any",
	}

	const handleOnChange = (e, callback) => {
		const key = e.target.name
		const value = e.target.value

		setData((prev) => ({
			...prev,
			[key]: value
		}))

		callback && callback()
	}

	const percents = {
		price2: 0.1,
		price3: 0.2,
		price4: 0.4,
	};

	let nameObj = name ? { name: name } : undefined;
	let price1Obj = price1 ? { price1: price1 } : undefined;
	let price2Obj = price2 ? { price2: price2 } : undefined;
	let price3Obj = price3 ? { price3: price3 } : undefined;
	let price4Obj = price4 ? { price4: price4 } : undefined;

	dataObject.current = {
		name: name,
		price1: price1,
		price2: price2,
		price3: price3,
		price4: price4,
	};

	const buttons = (
		<>
			<hr />

			<div className="mb-3">
				<button
					type="button"
					className="btn btn-danger"
					onClick={() => {
						dialogRef.current.close();
					}}
				>
					الغاء
				</button>
				<button type="submit" className="btn btn-success">
					حفظ
				</button>
			</div>
		</>
	);

	if (action === "delete") {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(e.target)
				}}
			>
				<p>هل انت متاكد من انك تريد حذف &quot;{itemObject.name}&quot; !?</p>

				{buttons}
			</form>
		);
	}

	return (
		<Dialog title={"اضافه صنف جديد"}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(e.target[1])
					if (action === "add") {
						fetchData("الاصناف/", {
							method: "POST",
							headers: {
								"Content-Type": "application/json", // Set the Content-Type header to JSON
							},
							body: JSON.stringify(dataObject.current), // Convert data to JSON string
						}).then((response) => {
							console.log(response);
						});
					}
				}} >
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => {
						navigate("/الاصناف/نسب-الربح");
					}} >
					تحديد نسب الربح
				</button>

				<FieldBox 
					label="اسم الصنف"
					inputAttributes={{
							value: data.item,
							name: "item",
							onChange: handleOnChange
						}
					} />

				<FieldBox 
					label={"شراء"} 
					inputAttributes={{
						value: data.price1,
						name: "price1",
						...commonNumberFieldAttributes,
						onChange: (e) => {
							handleOnChange(e, () => {
								if (autoCalculatePrices) {
									const value = Number(e.target.value)

									setData((prev) => ({
										...prev,
										price2: value + value * percents.price2,
										price3: value + value * percents.price3,
										price4: value + value * percents.price4,
									}))
								}
							})
						}
					}} />

				<div className="mb-3">
					<label htmlFor="f3" className="form-check-label">
						حساب الاسعار بالنسب المقرره مسبقا&nbsp;
					</label>
					<input
						id="f3"
						className="form-check-input"
						type="checkbox"
						onChange={(e) => {
							setAutoCalculatePrices(e.target.checked);
						}}
						checked={autoCalculatePrices}
					/>
				</div>

				<FieldBox 
					label="خاص"
					inputAttributes={{
						...commonNumberFieldAttributes,
						value: data.price2,
						name: "price2",
						onChange: handleOnChange,
						disabled: autoCalculatePrices,
					}
				} />

				<FieldBox 
					label="جمله"
					inputAttributes={{
						...commonNumberFieldAttributes,
						value: data.price3,
						name: "price3",
						onChange: handleOnChange,
						disabled: autoCalculatePrices,
					}
				} />

				<FieldBox 
					label="قطاعى"
					inputAttributes={{
						...commonNumberFieldAttributes,
						value: data.price4,
						name: "price4",
						onChange: handleOnChange,
						disabled: autoCalculatePrices,
					}
				} />
				
				{/* <InputFieldBox
					id="f1"
					label="اسم الصنف"
					value={name}
					setValue={setName}
					callbackOnChange={(e) => {
						if (e.target.value) {
							dataObject.current["name"] = e.target.value;
						} else {
							delete dataObject.current["name"];
						}
					}}
				/>

				<InputFieldBox
					id="f2"
					label="شراء"
					value={price1}
					setValue={setPrice1}
					callbackOnChange={(e) => {
						if (autoCalculatePrices) {
							setPrice2(calculatePrice(e.target.value, percents.price2));
							setPrice3(calculatePrice(e.target.value, percents.price3));
							setPrice4(calculatePrice(e.target.value, percents.price4));
						}
					}}
				/> */}

				{/* <InputFieldBox
					id="f4"
					label="خاص"
					disabled={autoCalculatePrices}
					value={price2}
					setValue={setPrice2}
				/>

				<InputFieldBox
					id="f5"
					label="جمله"
					disabled={autoCalculatePrices}
					value={price3}
					setValue={setPrice3}
				/>

				<InputFieldBox
					id="f6"
					label="قطاعى"
					disabled={autoCalculatePrices}
					value={price4}
					setValue={setPrice4}
				/> */}

				<div className="mb-3">
					<label htmlFor="f7" className="form-label">
						الصور
					</label>
					<input id="f7" className="form-control" type="file" />
				</div>

				{buttons}
			</form>
		</Dialog>
	);
}

function InputFieldBox({
	id,
	label,
	disabled = false,
	value,
	setValue,
	callbackOnChange,
}) {
	return (
		<div className="mb-3">
			<label htmlFor={id} className="form-label">
				{label}
			</label>
			<input
				id={id}
				className="form-control"
				type="text"
				disabled={disabled}
				placeholder={label}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					callbackOnChange && callbackOnChange(e);
				}}
			/>
		</div>
	);
}

function calculatePrice(purchasePrice, percent) {
	return Number(purchasePrice) + Number(purchasePrice) * percent;
}
