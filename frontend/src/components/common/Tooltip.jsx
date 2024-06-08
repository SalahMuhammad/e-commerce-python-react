import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const Tooltip = ({ obj }) => {
	const popover = <Popover id="popover-basic">
		<Popover.Header as="h3">التفاصيل</Popover.Header>
			<Popover.Body>
				<span>اضيف فى: <strong>{obj.created}</strong></span>
				<span> اخر تحديث فى: <strong>{obj.updated}</strong></span>
				<span> بواسطه: <strong>{obj.by_username}</strong></span>
				
				{/* And here&apos;s some <strong>amazing</strong> content. It&apos;s very engaging.
				right? */}
			</Popover.Body>
		</Popover>

	return (
	<OverlayTrigger trigger="click" placement="top" overlay={popover}>
		{/* <Button variant="success">{Children}</Button> */}
		<i className="fa-solid fa-circle-info"></i>
	</OverlayTrigger>
)};

export default Tooltip