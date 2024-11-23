import { useRef, useState } from "react"
import { notify } from "../notification"
import MyGroup from "../common/FormGroup"
import { Form, Accordion, Button } from "react-bootstrap"
import { InvoiceFormSearchField } from '../common/SearchInput'
import Table from "../common/Table"
import { getCookie, setCookie } from "../utilities"
import { sendRequest } from "../api"
import useData from "../custom-hooks/useData"


const initialData = (id) => [{uuid: id, is_purchase_invoice: 0, paid: 0, owner_name: '', repository_name: '', items: []}]
const InvoiceForm = () => {
	const [invoices, setInvoices] = useState(getCookie('invoices').length !== 0 ? getCookie('invoices') : initialData(crypto.randomUUID()))
	const [errors, setErrors] = useState([])

	if (JSON.stringify(getCookie('invoices')) != JSON.stringify(invoices)) {
		setCookie('invoices', JSON.stringify(invoices), 7)
	}

	const handleAddInvoice = () => {
		const a = invoices[invoices.length-1]
		setInvoices((prev) => ([
			...prev,
			{
				...a,
				uuid: crypto.randomUUID(),
				paid: 0,
				items: []
			}
		]))
	}

	const handleDeleteItem = (invoice, itemId) => {
		setInvoices((prev) => (
			prev.map((inv) => {
				if ((inv.uuid || inv.id) === (invoice.uuid || invoice.id)) {
					inv.items = inv.items.filter(i => {
						if (i.item === itemId) {
							inv.paid -= Number(i.quantity * i.unit_price)
							return false
						}
						return true
					})
				}
				return inv
			})
		))
	}

	const handleSubmit = async (invoice, method) => {
		if (invoice.items.length === 0) {
			notify('error', 'يجب اختيارؤ صنف واحد على الاقل...')
			return
		}
		setErrors({})

		
		const {error, statusCode} = await sendRequest(
			method, 
			`api/invoices/${invoice.id ? `${invoice.id}/` : ''}`, 
			invoice, 
			'الفاتوره'
		)

		if ([200, 201, 204].includes(statusCode)) {
			if (invoices.length === 1) {
				setInvoices([{
					...invoices[0],
					paid: 0,
					items: []
				}])
			} else {
				setInvoices([...invoices].filter((inv) => (inv.uuid || inv.id) != (invoice.uuid || invoice.id)))
			}
		} else if (statusCode === 400) {
			setErrors(error);
			notify('error', error?.detail ? error.detail[0] : null)
		}
	}	


	const handleDeleteInvoice = (index) => {
		if (invoices.length === 1) return
		setInvoices([...invoices].filter((_, index1) => index != index1))
	}

	return (
		<div className="slider">
			{invoices.map((invoice, index) => (							
				<div key={invoice.uuid || invoice.id} className="invoice-form">
					<div className="controls mb-3">
						<Button variant="success" onClick={() => handleSubmit(invoice, invoice.id ? 'patch' : 'post')}>{invoice.id ? 'تعديل': 'اضافه'} الفاتوره</Button>
						<button className="no-style" onClick={handleAddInvoice}><i className="fa-solid fa-plus" ></i></button>
						<button className="no-style" onClick={() => handleDeleteInvoice(index)}><i className="fa-solid fa-trash-can"></i></button>
						{invoice.id && <Button variant="danger" onClick={() => {confirm('هل انت متاكد من انك تريد حذف الفاتوره!؟') && handleSubmit(invoice, 'delete')}}>حذف</Button>}
					</div>
					<Accordion className="form">
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								التفاصيل:
								فاتوره: {invoice.is_purchase_invoice == 1 ? 'مشتريات' : 'مبيعات'}
								,&nbsp;{invoice.owner_name}
								,&nbsp;{invoice.repository_name}
							</Accordion.Header>
							<Accordion.Body>
								<InvoiceDetailForm invoice={invoice} setInvoices={setInvoices} errors={errors} index={index} />
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="1">
							<Accordion.Header>اضافه صنف</Accordion.Header>
							<Accordion.Body>
								<InvoiceItemsForm setInvoices={setInvoices} index={index} />
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					<Table theadList={['#', 'اسم الصنف', 'عدد القطع', 'سعر القطعه']}>
						<tbody>
							{invoice.items.map((item, index) => (
								<tr key={index}>
									<td><button className="no-style" onClick={() => handleDeleteItem(invoice, item.item)}><i className="fa-solid fa-trash-can"></i></button></td>
									<td>
										{item.item_name}
										{errors[index]?.item}
									</td>
									<td>{item.quantity}</td>
									<td>{item.unit_price}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr style={{alignItems: 'center'}}>
								<td>اجمالى</td>
								<td colSpan={3} style={{textAlign: 'center'}}>
									{invoice.items.reduce((sum, item) => {
										return sum + (item.quantity * item.unit_price);
									}, 0)}
								</td>
							</tr>
						</tfoot>
					</Table>
				</div>
			))}
		</div>
	)
}


const aaa = {item: '', unit_price: 0, quantity: 1, item_name: ''}
const InvoiceItemsForm = ({ setInvoices, index }) => {
	const [item, setItem] = useState(aaa)
	const { data } = useData(`api/items/?s=${item.item_name}`)
	const results = data.results
	const isResultEmpty = results.length === 0
	const itemRef = useRef(null)


	const isItemNull = () => {
		return item.item_name === '' || results.length !== 1
	}

	const handleKeyDown = (e) => {
		if (isItemNull()) return
		if (e.key === 'Enter') {
			const newItem = {
				item: results[0].id,
				item_name: results[0].name,
				quantity: item?.quantity || 1,
				unit_price: item?.unit_price || results[0].price4
			}
		
			setInvoices((prev) => updateInvoiceItems(prev, index, newItem))
			setItem(aaa)
			itemRef.current.focus();
		}
	}

	const handleOnBlur = () => {
		if (isItemNull()) return

		setItem((prev) => ({
			...prev,
			item: results[0].id,
			item_name: results[0].name,
			quantity: item?.quantity || 1,
			unit_price: item?.unit_price || results[0].price4
		}))
	}

	const handleChange = (e) => {
		let {name, value} = e.target
		setItem((prev) => ({
			...prev,
			[name]: value
		}))
	}

	const handleOnClickAdd = () => {
		if (isItemNull()) return
		
		setInvoices((prev) => updateInvoiceItems(prev, index, item))
		setItem(aaa)
		itemRef.current.focus();
	}

	const handleOnFocus = (e) => {
		e.target.select()
	}

	return (
		<div className="items">
			<MyGroup label={'اسم الصنف'} feedback={isResultEmpty ? `${item.item_name} غير موجود... 😵` : ''}> 
				<Form.Control
					ref={itemRef}
					autoComplete="off"
					type="text"
					placeholder={'اسم الصنف'}
					list='items'
					name='item_name'
					value={item.item_name}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onBlur={handleOnBlur}
					onFocus={handleOnFocus}
					isInvalid={isResultEmpty ? true : false}
				/>
				<datalist id='items'>
					{data.results && data.results.map((item) => (
						<option key={item.id} value={item.name} />
					))}
				</datalist>
			</MyGroup>
			{/* <InvoiceFormSearchField label={'اسم الصنف'} onEnterKeyDown={handleKeyDown} endpotin={'items'} onBlur={handleOnBlur} /> */}
			<MyGroup label='عدد القطع' feedback={''}>
				<Form.Control
					type="number"
					name='quantity'
					onKeyDown={(e) => (e.key === 'Enter') && handleOnClickAdd()}
					value={item.quantity}
					placeholder="عدد القطع"
					onChange={handleChange}
					isInvalid={false}
					onFocus={handleOnFocus}
				/>
			</MyGroup>
			<MyGroup label='سعر القطعه' feedback={''}>
				<Form.Control
					type="number"
					name='unit_price'
					onKeyDown={(e) => (e.key === 'Enter') && handleOnClickAdd()}
					value={item.unit_price}
					placeholder="سعر القطعه"
					onChange={handleChange}
					isInvalid={false}
					onFocus={handleOnFocus}
				/>
			</MyGroup>	

			<button className="btn btn-success" onClick={handleOnClickAdd}><i className="fa-solid fa-plus" ></i></button>
		</div>
	)
}

const InvoiceDetailForm = ({ invoice, setInvoices, errors, index }) => {
	const handleOnChange = (e) => {
		const {name, value} = e.target
		setInvoices((prev) => {
			const newInvoices = [...prev]
			const updatedInvoice = {...newInvoices[index]}
			updatedInvoice[name] = value
			newInvoices[index] = updatedInvoice
			return newInvoices
		})
	}

	const handleOnBlur1 = (itemsData, name) => {
		if (itemsData.results?.length != 1) {
			setInvoices((prev) => updateInvoiceDetail(prev, index, name, null))
			return
		}
		
		setInvoices((prev) => updateInvoiceDetail(prev, index, name, itemsData))
	}

	return (
		<div className="detail">
			<Form.Select className="" defaultValue={invoice.is_purchase_invoice ? 1 : 0} name="is_purchase_invoice" aria-label="Default select example" onChange={handleOnChange}>
				<option value="0">مبيعات</option>
				<option value="1">مشتريات</option>
			</Form.Select>
			<InvoiceFormSearchField label={'مورد/عميل'} v={invoice.owner_name} name={'owner'} onBlur={handleOnBlur1} endpotin={'owners'} errors={errors} />
			<InvoiceFormSearchField label={'مخزن'} v={invoice.repository_name} name={'repository'} onBlur={handleOnBlur1} endpotin={'repositories'} errors={errors} />
			<MyGroup label='مدفوع' feedback={errors?.['paid'] ? errors?.['paid'][0] : ''}>
				<Form.Control
					onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
					type="number"
					name='paid'
					value={invoice.paid}
					placeholder="مدفوع"
					onChange={handleOnChange}
					isInvalid={errors?.['paid'] ? true : false}
					onFocus={(e) => e.target.select()}
				/>
			</MyGroup>
		</div>
	)
}


export default InvoiceForm


function addItemToItemsList(items, newItem) {
	const index = items.findIndex((i) => i.item === newItem.item)

	if (index !== -1) {
		items[index].quantity = Number(items[index].quantity) + Number(newItem.quantity)
		items[index].unit_price = newItem.unit_price
		return items
	}

	items.push(newItem)
	return items
}

const updateInvoiceItems = (invoices, index, newItem) => {
	const newInvoices = [...invoices]
	const updatedInvoice = {...newInvoices[index]}
	updatedInvoice.items = addItemToItemsList(updatedInvoice.items, newItem);
	updatedInvoice.paid = updatedInvoice.items.reduce((sum, item) => 
		sum + (item.quantity * item.unit_price)
	, 0)
	newInvoices[index] = updatedInvoice;

	return newInvoices
}

const updateInvoiceDetail = (invoices, index, name, data) => {
	const newInvoices = [...invoices]
	const updatedInvoice = {...newInvoices[index]}
	updatedInvoice[name] = data?.results[0].id
	updatedInvoice[name + '_name'] = data?.results[0].name
	newInvoices[index] = updatedInvoice;

	return newInvoices
}