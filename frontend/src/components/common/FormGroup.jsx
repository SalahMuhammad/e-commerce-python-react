import Form from 'react-bootstrap/Form';

const MyGroup = ({label, feedback = '', children}) => (
	<Form.Group className='mb-2'  md="4">
		<Form.Label>{label}</Form.Label>
		{children}
		<Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>
	</Form.Group>
)

export default MyGroup
