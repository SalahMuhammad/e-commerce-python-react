import TableHead from "./TableHead.jsx"
import Dialog from "../../common/Dialog.jsx";
import ItemForm from "../ItemForm.jsx"
import { useEffect, useRef, useState } from "react";
import ProfitPercent from "../ProfitPercent.jsx";
import TableImages from "./Image.jsx";
import { fetchData } from "../../api.jsx";
import TableRow from "./TableRow.jsx";
import Image from "./Image.jsx";
import BigImage from "./BigImage.jsx";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom"



export default function ItemsTable() {
	const [items, setItems] = useState([])
	const [search, setSearch] = useState('')
	const [action, setAction] = useState('')
	const [selectedId, setSelectedId] = useState(0)
	const [url, setUrl] = useState('api/items/')
	const [isLoading, setIsLoading] = useState(false)
	const dialogRef = useRef(null)
	const bigImgRef = useRef(null)
	const responseDataRef = useRef(null)
	const selectedItem = items && items.find((i) => i.id === selectedId)
	const navigate = useNavigate()

	useEffect(() => {
		axios.get('http://localhost:8000/' + url)
			.then((response) => {
				if (response.data.previous) {
					setItems((prev) => [...prev, ...response.results])
				} else {
					setItems(response.data.results)
				}

				responseDataRef.current = {
					count: response.data.count,
					next: response.data.next,
					previous: response.data.previous
				}
			})
		// let ignored = false;

		// fetchData(url, { method: 'GET', } )
		//   .then((response) => {
		//     return response.json()
		//   })
		//   .then((response) => {
		//   if (! ignored) {
		//     if (response.previous) {
		//       setItems((prev) => [...prev, ...response.results])
		//     } else {
		//       setItems(response.results)
		//     }
		//     setIsLoading(false)

		//     responseDataRef.current = {
		//       count: response.count,
		//       next: response.next,
		//       previous: response.previous
		//     }
		//   }
		// });

		// return () => {
		//   ignored = true
		// };
	}, [url]);

	useEffect(() => {
		function handleScroll(e) {
			const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			const windowHeight = window.innerHeight || document.documentElement.clientHeight;
			const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

			if (scrollTop + windowHeight >= documentHeight) {
				if (responseDataRef.current.next) {
					setUrl(responseDataRef.current.next.split(':8000/')[1])
					setIsLoading(true)
				}
			}
		}

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}

	})

	let dialogTitle;
	if (action === 'add') {
		dialogTitle = 'اضافة صنف';
	}
	else if (action === 'edit') {
		dialogTitle = 'تحديث بيانات صنف';
	}
	else {
		dialogTitle = 'حذف صنف'
	}

	function handleClickOverButtons(e) {
		if (e.target.tagName === 'BUTTON') {
			switch (e.target.textContent) {
				case 'اضافه':
					setAction('add')
					setSelectedId(0);
					break;
				case 'تعديل':
					setAction('edit')
					break
				case 'حذف':
					setAction('delete')
					break
			}
			// dialogRef.current.showModal();
		}
	}

	function handleMouseOver(e) {
		if (!bigImgRef.current.classList.contains('clicked') && e.target.tagName !== 'IMG') {
			bigImgRef.current.classList.remove('active')
		}
	}

	function handleSearchInputOnChange(e) {
		let val = e.target.value.replace(/ {2}$/, '%26%26')
		setSearch(val)
		setUrl(`api/items/?name=${val}`)
	}

	return (
		<>
			<Outlet />
			{/* <Dialog
        ref={dialogRef}
        title={dialogTitle}>
        <ItemForm 
          key={selectedItem && selectedItem.id} 
          dialogRef={dialogRef} 
          action={action} 
          itemObject={selectedItem} />
      </Dialog> */}


			<div className="wrapper" onClick={handleClickOverButtons} onMouseOver={handleMouseOver}>
				<div className="top">
					<BigImage ref={bigImgRef} />
					<button className="btn btn-primary" onClick={() => navigate('اضافه-صنف-جديد')}>
						اضافه
					</button>
					<input className="form-control" type="text" placeholder="بحث" value={search}
						onChange={handleSearchInputOnChange} />
				</div>
				<table>
					<caption>الاصناف</caption>
					<TableHead headers={['', 'الصنف', 'السعر', 'الصور']} />
					<tbody>
						{items && items.map((item) => (
							<TableRow
								key={item.id}
								item={item}
								selectedId={selectedId}
								setSelectedId={setSelectedId}>
								<td>
									<Image bigImgRef={bigImgRef} src={item.img} />
								</td>
							</TableRow>
						))}
					</tbody>
				</table>
				{isLoading && <p className="loading-spinner">جار تحميل البيانات...</p>}
			</div>
		</>
	)
}

function itemsReducer(state, action) {
	switch (action.type) {
		case 'changed_selection': {
			return {
				...state,
				selectedId: action.contactId,
			};
		}
		case 'edited_message': {
			return {
				...state,
				messages: {
					...state.messages,
					[state.selectedId]: action.message,
				}
			};
		}
		case 'sent_message': {
			return {
				...state,
				messages: {
					...state.messages,
					[state.selectedId]: ''
				},
			};
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
