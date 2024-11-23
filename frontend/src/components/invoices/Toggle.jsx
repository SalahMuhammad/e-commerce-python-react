import { useState } from "react";
import InvoiceForm from './InvoicesForm.jsx'
import Nav from 'react-bootstrap/Nav';
import InvoicesList from './InvoicesList.jsx'
import { Link } from "react-router-dom";




export default function Toogle() {
	// const [displayList, setDisplayList]  = useState(1)

	// onWheel
	// onWheel={(e) => {e.preventDefault(); e.currentTarget.scrollLeft += e.deltaY}}

	// const scrollToItem = (direction) => {
	// 	console.log('Scroll function called:', direction);
	// 	if (sliderRef.current) {
	// 		const container = sliderRef.current;
	// 		const itemWidth = container.offsetWidth;
	// 		const currentScrollPosition = container.scrollLeft;
	// 		const maxScroll = container.scrollWidth - container.clientWidth;
			
	// 		console.log('Current scroll position:', currentScrollPosition);
	// 		console.log('Max scroll:', maxScroll);
			
	// 		let newScrollPosition;
			
	// 		if (direction === 'right') {
	// 			newScrollPosition = Math.min(currentScrollPosition + itemWidth, maxScroll);
	// 		} else if (direction === 'left') {
	// 			newScrollPosition = Math.max(currentScrollPosition - itemWidth, 0);
	// 		}
			
	// 		console.log('New scroll position:', newScrollPosition);
			
	// 		container.scrollTo({
	// 			left: newScrollPosition,
	// 			behavior: 'smooth'
	// 		});
	// 	} else {
	// 		console.log('sliderRef.current is null');
	// 	}
	// };

	return (
		<div className="container">
			<div className="top">	
				
				{/* <Link className="btn btn-primary" to={'ادراج'} >
					ادراج
					</Link> */}
				{/* <input className="form-control" type="text" placeholder="بحث" onChange={handleSearchInputOnChange} /> */}
				{/* <div className="invoices-navs">
					<img src={next} alt="" onClick={() => scrollToItem('left')} />
					<img src={back} alt="" onClick={() => scrollToItem('right')} />
					</div> */}
				
				<Nav variant="pills" defaultActiveKey="1" >
					<Nav.Item>
						<Nav.Link as={Link} to={'list'} eventKey="1">القائمه</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link as={Link} to={'curd'} eventKey="2">اضافه-تعديل-حذف</Nav.Link>
					</Nav.Item>
				</Nav>
			</div>
			{/* {displayList == 1 ? (
				<InvoicesList />
			) : (
				<InvoiceForm/>
			)} */}
		</div>
	)
}



