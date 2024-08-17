
import { useState } from "react";
import { Outlet } from "react-router-dom"
import useData from "../custom-hooks/useData.jsx";
import useScroll from "../custom-hooks/useScroll.jsx";
// 
import { Link } from "react-router-dom";
import Table from "../common/Table.jsx";
import Tooltip from "../common/Tooltip.jsx";


export default function ClientSupplier({ isClient }) {
	const [url, setUrl] = useState(`api/owners/`)
	const { data, loading } = useData(url)
	useScroll(loading, data.next, setUrl)
	// if (! url.includes(to)) {
	// 	setUrl(`api/${to}/`)
	// }

	// function handleSearchInputOnChange(e) {
	// 	let val = e.target.value.replace(/ {2}$/, '%26%26')
	// 	setUrl(`api/warehouses/?name=${val}`)
	// }

	return (
		<>
			<Outlet />
			<div className="container">
                <div className="top">	
                    <Link className="btn btn-success" to={'ادراج'} >
                        اضافه
                    </Link>
					{/* <input className="form-control" type="text" placeholder="بحث" onChange={handleSearchInputOnChange} /> */}
				</div>
				<Table theadList={['#', 'الاسم', 'التفاصيل']} caption={`${isClient ? 'العملاء' : 'الموردين'} ${data.count}/${data.results.length}`}>
					<tbody>
						{data.results && data.results.map((obj) => (
							<tr key={obj.id}>
								<th>
									<Link to={`تعديل/${obj.id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
									<Tooltip endpoint={`owners/${obj.id}`} />
								</th>
								<td>{obj.name}</td>
								<td>{obj.detail}</td>
							</tr>
						))}
					</tbody>
                </Table>
			</div>
		</>
	)
}

