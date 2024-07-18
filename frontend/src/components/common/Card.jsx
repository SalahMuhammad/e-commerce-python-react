import Card from 'react-bootstrap/Card';
import MyCarousel from './carousel';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Tooltip from './Tooltip';


function HeaderAndFooterExample({ obj }) {
	// const targetDate = new Date(obj.updated)
	// const currentDate = new Date()
	// const diff = currentDate - targetDate
	// const from = `اخر تحديث منذ ${Math.floor(diff / (1000 * 60 * 60 * 24))} يوم و ${Math.floor(diff / (1000 * 60 * 60)) % 24} ساعه و ${Math.floor(diff / (1000 * 60)) % 60} دقيقه`
	return (
		<Card className="text-center my-card">
			<Card.Header>
				Featured
			</Card.Header>
			<Card.Body>
				<Card.Title>
					{obj.images.some((src) => src.includes('http')) && <MyCarousel srcs={obj.images} />}
				</Card.Title>
				<Card.Text style={{ color: 'green', fontWeight: 'bold' }}>
					{obj.name} (<span style={{color: obj.stock < 10 ? 'red' : 'green'}}>{obj.stock}</span>)
					{/* <div><br /></div> */}
					<SelectBasicExample values={[obj.price1, obj.price2, obj.price3, obj.price4]} />
				</Card.Text>
			</Card.Body>
			<Card.Footer className="text-muted">
				<Link to={`تعديل/${obj.id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
				<Tooltip obj={obj} />
			</Card.Footer>
		</Card>
	);
}

function SelectBasicExample({ values }) {
	return (
		<Form.Select aria-label="Default select example">
			<option>ق {values[3]}</option>
			<option>ج {values[2]}</option>
			<option>خ {values[1]}</option>
			<option>ش {values[0]}</option>
		</Form.Select>
	);
}

export default HeaderAndFooterExample;