import { useRef, useState } from "react"
import useData from "../custom-hooks/useData"
import useScroll from "../custom-hooks/useScroll"
import { getCookie, setCookie } from "../utilities"
import Table from "../common/Table.jsx";
import Tooltip from "../common/Tooltip.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const InvoicesList = () => {
	document.title = 'الفواتير'
	const navigate = useNavigate();
	const [url, setUrl] = useState(`api/invoices/`)
	const { data, loading } = useData(url)
	const location = useLocation();
	useScroll(loading, data.next, setUrl)
	const tableRef = useRef()
	

	const handleOnEditClick = (e, invoice) => {
		const invoices = getCookie('invoices')
		console.log(invoice)
		setCookie('invoices', JSON.stringify(invoices ? [...invoices, invoice] : [invoice]), 7)
		navigate('/invoices/crud', {replace: true})
	}

	return (
		<>
			{/* {location.pathname === "/invoices/list" && ( */}
				<Table theadList={['معرف', 'المخزن', 'مورد-عميل', 'مدفوع']} caption={`الفواتير ${data.count}/${data.results.length}`}>
					<tbody className="invoices-list-tbody">
						{data.results && data.results.map((invoice) => (
							<tr key={invoice.id} onClick={() => navigate(`/invoices/${invoice.id}/items`)}>
								<td className={invoice.is_purchase_invoice ? 'p-inv' : 's-inv'}>
									{invoice.id}
									{/* <Link to={`تعديل/${invoice.id}`}><i className="fa-solid fa-pen-to-square"></i></Link> */}
									<button className="no-style" onClick={(e) => {e.stopPropagation(); handleOnEditClick(e, invoice)}}><i className="fa-solid fa-pen-to-square"></i></button>
									<Tooltip endpoint={`invoices/${invoice.id}`} />
								</td>
								<td>{invoice.repository_name}</td>
								<td>{invoice.owner_name}</td>
								<td>{invoice.paid}</td>
							</tr>
			
						))}
					</tbody>
				</Table>
			{/* )} */}
				<Outlet />
		</>
	)
}


export default InvoicesList
