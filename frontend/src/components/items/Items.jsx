import { useState } from "react";
import { Outlet } from "react-router-dom"
import useData from "../custom-hooks/useData.jsx";
import useScroll from "../custom-hooks/useScroll.jsx";
import HeaderAndFooterExample from "../common/Card.jsx";
// 
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";


const fields = 'id,by_username,name,price1,price2,price3,price4,updated,created,has_img,images'
export default function Items() {
	const [url, setUrl] = useState(`api/items/?fields=${fields}`)
	const { data, loading } = useData(url)
	useScroll(loading, data.next, setUrl)


	function handleSearchInputOnChange(e) {
		let val = e.target.value.replace(/ {2}$/, '%26%26')
		setUrl(`api/items/?name=${val}&fields=${fields}`)
	}

	return (
		<>
			<Outlet />

			<div className="container">
				
				<div className="top">
					<SplitBasicExample />
					<input className="form-control" type="text" placeholder="بحث" onChange={handleSearchInputOnChange} />
					<p>{data.count + '/' + data.results.length}</p>
				</div>
				<div className="inner-container">
					{data.results.map((obj) => (
						<HeaderAndFooterExample key={obj.id} obj={obj} />
					))}
				</div>
				{loading && <p className="loading-spinner" style={{color: 'red'}}>جار تحميل البيانات...</p>}
			</div>
		</>
	)
}

function SplitBasicExample() {
  return (
    <Dropdown as={ButtonGroup}>
      <Button variant="primary" as={Link} to='ادراج'>ادراج</Button>

      <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

      <Dropdown.Menu>
		<Dropdown.Item as={Link} to='/الاصناف/نسب-الربح'>تحديد نسب الربح</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
