import { useState } from "react";
import useData from "../custom-hooks/useData.jsx";
import useScroll from "../custom-hooks/useScroll.jsx";
import { Link } from 'react-router-dom';
import Tooltip from "../common/Tooltip.jsx";
import Table from "../common/Table.jsx";
import InvoiceForm from './InvoicesForm.jsx'
import { getCookie, setCookie } from "../utilities.jsx";




export default function Invoices() {
	const [displayList, setDisplayList]  = useState(0)


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
				<div className="display" style={{display: 'flex', gap: '1rem', justifyContent: 'space-around'}}>
					<label onClick={() => setDisplayList(0)}>
						اضافه فاتوره
						<input type="radio" name="display" value="form" />
					</label>
					<label onClick={() => setDisplayList(1)}>
						قائمه الفواتير
						<input type="radio" name="display" value="list" />
					</label>
				</div>
			</div>
			{displayList ? (
				<InvoicesList />
			) : (
				<InvoiceForm/>
			)}
		</div>
	)
}

const InvoicesList = () => {
	const [url, setUrl] = useState(`api/invoices/`)
	const { data, loading } = useData(url)
	useScroll(loading, data.next, setUrl)
	const [selectedInvoice, setSelectedInvoice] = useState(-1)
	
	const handleOnEditClick = (invoice) => {
		const invoices = getCookie('invoices')
		setCookie('invoices', JSON.stringify([...invoices, invoice]), 7)
	}

	return (
		<Table theadList={['معرف', 'المخزن', 'مورد-عميل', 'مدفوع']} caption={`الفواتير ${data.count}/${data.results.length}`}>
			<tbody>
				{data.results && data.results.map((invoice) => (
					<>
					<tr key={invoice.id} onClick={() => setSelectedInvoice(invoice.id)}>
						<td className={invoice.is_purchase_invoice ? 'p-inv' : 's-inv'}>
							{invoice.id}
							{/* <Link to={`تعديل/${invoice.id}`}><i className="fa-solid fa-pen-to-square"></i></Link> */}
							<button className="no-style" onClick={() => handleOnEditClick(invoice)}><i className="fa-solid fa-pen-to-square"></i></button>
							<Tooltip endpoint={`invoices/${invoice.id}`} />
						</td>
						<td>{invoice.repository_name}</td>
						<td>{invoice.owner_name}</td>
						<td>{invoice.paid}</td>
					</tr>
					{selectedInvoice == invoice.id && (
						<tr className={`inv-items ${selectedInvoice === invoice.id ? 'active' : ''}`}>
							<td colSpan={2}>
								<Table theadList={['اسم الصنف', 'عدد القطع', 'سعر القطعه']}>
									{invoice.items.map((item, index) => (
										<tr key={index}>
											<td>{item.item_name}</td>
											<td>{item.quantity}</td>
											<td>{item.unit_price}</td>
										</tr>
									))}
								</Table>
							</td>
						</tr>
					)}
					</>
				))}
			</tbody>
		</Table>
	)
}

