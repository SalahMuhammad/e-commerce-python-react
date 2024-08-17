import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom"
import useData from "../custom-hooks/useData.jsx";
import useScroll from "../custom-hooks/useScroll.jsx";
import MyCard from "../common/Card.jsx";
// 
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import SearchInput from "../common/SearchInput.jsx";


let fields = 'id,name,price1,price2,price3,price4,has_img,images,stock,'
export default function Items() {
	const [url, setUrl] = useState(`api/items/?fields=${fields}`)
	const { data, loading } = useData(url)
	useScroll(loading, data.next, setUrl)


	function handleSearchInputOnChange(value) {
		setUrl(`api/items/?s=${value}&fields=${fields}`)
	}

	return (
		<>
			<Outlet />

			<div className="container">
				
				<div className="top">
					<SplitBasicExample />
					<SearchInput label={'اسم الصنف'} onChange={handleSearchInputOnChange} />
					<p>{data.count + '/' + data.results.length}</p>
				</div>
				<div className="inner-container">
					{data.results.map((item) => (
						<MyCard key={item.id} item={item} />
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
      <Button variant="success" as={Link} to='ادراج'>اضافه</Button>

      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

      <Dropdown.Menu>
		<Dropdown.Item as={Link} to='/الاصناف/نسب-الربح'>تحديد نسب الربح</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
