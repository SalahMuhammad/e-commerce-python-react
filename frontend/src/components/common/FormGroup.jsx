import Form from 'react-bootstrap/Form';

const MyGroup = ({label, feedback = '', children, isHidden=false}) => {
	return (
	<Form.Group className={`mb-2 ${isHidden ? 'hidden' : ''}`} style={{position: 'relative'}}>
		<Form.Label>{label}</Form.Label>
		{children}
		<Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>
	</Form.Group>
)}

export default MyGroup
