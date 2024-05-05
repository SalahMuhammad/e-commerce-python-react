export default function FieldBox({ label, inputAttributes, errorMessage = "" }) {
	const id = label.split(' ').join('-')

	if (!inputAttributes.type) {
		inputAttributes.type = "text";
	}

	if (!inputAttributes.disabled) {
		inputAttributes.disabled = false
	}

	return (
		<div className="input-boxxx mt-4">
			<input id={id} {...inputAttributes} />
			<label htmlFor={id} className={inputAttributes.value && "active"}>
				{label}
			</label>
			{errorMessage && <span>{errorMessage}</span>}
		</div>
	);
}
