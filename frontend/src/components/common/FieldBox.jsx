
export default function FieldBox({ label, inputAttributes, errorMessage = "", focus }) {
	const id = label.split(' ').join('-')

	if (!inputAttributes.type) {
		inputAttributes.type = "text";
	}

	if (!inputAttributes.disabled) {
		inputAttributes.disabled = false
	}

	if (!focus) {
		focus = false
	}

	return (
		<div className="input-boxxx mt-4">
			<input id={id} {...inputAttributes} autoFocus={focus} />
			<label htmlFor={id} className={inputAttributes.value && "active"}>
				{label}
			</label>
			{errorMessage && <span>{errorMessage}</span>}
		</div>
	);
}

