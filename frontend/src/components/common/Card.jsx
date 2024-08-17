import Card from 'react-bootstrap/Card';
import MyCarousel from './carousel';
import Form from 'react-bootstrap/Form';
	import { Link } from 'react-router-dom';
import Tooltip from './Tooltip';
import { MyModal2 } from './Modal';
import { useState } from 'react';
import Table from './Table';


function MyCard({ item }) {
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);

	return (
		<div>
			<Stocks show={show} setShow={setShow} data={item} />
			<Card className="text-center my-card">
				<Card.Header>
					Featured
				</Card.Header>
				<Card.Body>
					<Card.Title>
						{item.images/*.some((src) => src.includes('http'))*/ && <MyCarousel srcs={item.images} />}
					</Card.Title>
					<Card.Text style={{ color: 'green', fontWeight: 'bold' }}>
						{item.name}
						{/* <span style={{color: item.stock < 10 ? 'red' : 'green'}}>(
							{item.stock.map((i) => (
								i.repository_name + ': ' + i.quantity + ', '
							))}
						)</span> */}
						{/* <div><br /></div> */}
						<SelectBasicExample values={[item.price1, item.price2, item.price3, item.price4]} />
					</Card.Text>
				</Card.Body>
				<Card.Footer className="text-muted">
					<Link to={`تعديل/${item.id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
					<Tooltip endpoint={`items/${item.id}`} />
					<button className="no-style" onClick={handleShow}>
						<i className="fa-solid fa-warehouse"></i>
					</button>
				</Card.Footer>
			</Card>
		</div>
	);
}


function Stocks({ show, setShow, data }) {
    const handleClose = () => setShow(false);	
	return (
		<MyModal2 
			title="الارصده" 
			show={show}
			onHide={handleClose}
		>
			<Table theadList={['المخزن', 'الرصيد']}> 
				{data.stock.map((stock) => (
					<tr key={stock.id}>
						<td>{stock.repository_name}</td>
						<td>{stock.quantity}</td>
					</tr>
				))}
			</Table>
		</MyModal2>
	)	
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

export default MyCard;