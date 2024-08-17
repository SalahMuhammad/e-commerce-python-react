import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { getData } from '../api';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

const Tooltip = ({ endpoint }) => {
	const [detail, setDetail] = useState({})

	const handleClick = (e) => {
		e.stopPropagation()
		if (detail.created === undefined) {
			getDetail(endpoint)
				.then((res) => setDetail(res))
		}
	}

	const popover = <Popover id="popover-basic">
		<Popover.Header as="h3">التفاصيل</Popover.Header>
			<Popover.Body>
				{detail.created == undefined ? (
					<p className='loading'>جارى تحميل البيانات...</p> 
				) : (
						<>
							<span>اضيف: <strong>{new Date(detail.created).toString().split(' GMT')[0]}</strong></span>
							<hr />
							<span>اخر تحديث: <strong>{new Date(detail.updated).toString().split(' GMT')[0]}</strong></span>
							<hr />
							<span> بواسطه: <strong>{detail.by_username}</strong></span>
						</>
					)
				}
				
				{/* And here&apos;s some <strong>amazing</strong> content. It&apos;s very engaging.
				right? */}
			</Popover.Body>
		</Popover>

	return (
		<OverlayTrigger trigger="click" placement="auto" overlay={popover} rootClose onClick={() => console.log('fdsfs')}>
			<button className='no-style' onClick={handleClick}><i className="fa-solid fa-circle-info"></i></button>
			{/* <i className="fa-solid fa-circle-info" onClick={handleClick}></i> */}
		</OverlayTrigger>
	)
};

const getDetail = async (endpoint) => {
	const res = await getData(`api/${endpoint}/?fields=created,updated,by_username`)
	return res.data
}

export default Tooltip