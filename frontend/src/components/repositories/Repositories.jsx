
import { useState } from "react";
import { Outlet } from "react-router-dom"
import useData from "../custom-hooks/useData.jsx";
import useScroll from "../custom-hooks/useScroll.jsx";
// 
import { Link } from "react-router-dom";
import Table from "../common/Table.jsx";
import Tooltip from "../common/Tooltip.jsx";


export default function Warehouses() {
	const [url, setUrl] = useState(`api/repositories/`)
	const { data, loading } = useData(url)
	useScroll(loading, data.next, setUrl)


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
				<Table theadList={['#', 'الاسم']} caption={`المخازن ${data.count}/${data.results.length}`}>
					<tbody>
						{data.results && data.results.map((obj) => (
							<tr key={obj.id}>
								<th>
									<Link to={`تعديل/${obj.id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
									<Tooltip endpoint={`repositories/${obj.id}`} />
								</th>
								<td>{obj.name}</td>
							</tr>
						))}
					</tbody>
                </Table>
			</div>
		</>
	)
}

