import { useState } from "react"
import { notify } from "../notification"
import MyGroup from "../common/FormGroup"
import { Form, Accordion, Button } from "react-bootstrap"
import { InvoiceFormSearchField } from '../common/SearchInput'
import Table from "../common/Table"
import { getCookie, setCookie } from "../utilities"
import { sendRequest } from "../api"


const initialData = (id) => [{uuid: id, is_purchase_invoice: 0, paid: 0, owner_name: '', repository_name: '', items: []}]
const InvoiceForm = () => {
	const [invoices, setInvoices] = useState(getCookie('invoices').length !== 0 ? getCookie('invoices') : initialData(crypto.randomUUID()))
	const [errors, setErrors] = useState([])

	if (JSON.stringify(getCookie('invoices')) != JSON.stringify(invoices)) {
		setCookie('invoices', JSON.stringify(invoices), 7)
	}

	const handleAddInvoice = () => {
		const a = invoices.length !== 0 ? invoices[invoices.length-1] : initialData(crypto.randomUUID())
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

	const handleSubmit = async (invoice) => {
		if (invoice.items.length === 0) {
			notify('error', 'يجب اختيارؤ صنف واحد على الاقل...')
			return
		}
		setErrors({})

		
		const {error, statusCode} = await sendRequest(
			invoice.id ? 'patch' : 'post', 
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
				setInvoices(invoices.filter((inv) => (inv.uuid || inv.id) != (invoice.uuid || invoice.id)))
			}
		} else if (statusCode === 400) {
			setErrors(error);
			notify('error', error?.detail ? error.detail[0] : null)
		}
	}	


	const handleDeleteInvoice = (id) => {
		setInvoices((prev) => prev.filter((i) => (i.uuid || i.id)!=id))
	}

	return (
		<div className="slider">
			{invoices.map((invoice) => (							
				<div key={invoice.uuid || invoice.id} className="invoice-form">
					<div className="controls mb-3">
						<Button variant="success" onClick={() => handleSubmit(invoice)}>{invoice.id ? 'تعديل': 'اضافه'}</Button>
						<button className="no-style" onClick={handleAddInvoice}><i className="fa-solid fa-plus" ></i></button>
						<button className="no-style" onClick={() => handleDeleteInvoice(invoice.id || invoice.uuid)}><i className="fa-solid fa-trash-can"></i></button>
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
								<InvoiceDetailForm invoice={invoice} setInvoices={setInvoices} errors={errors} />
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="1">
							<Accordion.Header>اضافه صنف</Accordion.Header>
							<Accordion.Body>
								<InvoiceItemsForm setInvoices={setInvoices} invoice={invoice} />
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


function checkIfItemExists(invoice, newItem) {
	let isOldItem = false
	const aaa = invoice.items.map((i) => {
		if (newItem.item === i.item) {
			isOldItem = true
			i.quantity = Number(i.quantity) + Number(newItem.quantity)
			i.unit_price = newItem.unit_price
		}
		return i
	})

	return [aaa, isOldItem]
}
const newInvoicesList = (oldList, newItem, invoiceId) => (
	oldList.map((inv) => {
		if ((inv.uuid || inv.id) === invoiceId) {
			let [newItems, isOldItem] = checkIfItemExists(inv, newItem)
			inv.items = isOldItem ? [...newItems] : [...inv.items, newItem]
			inv.paid += Number(newItem.quantity * newItem.unit_price)
		}
		return inv
	})
)
const aaa = {item: '', unit_price: 0, quantity: 1, item_name: ''}
const InvoiceItemsForm = ({ invoice, setInvoices }) => {
	const [item, setItem] = useState(aaa)
	const id = invoice.uuid || invoice.id


	const handleOnEnterKeyDown = (itemsData, _, value) => {
		if (value === '') return
		if (itemsData.results.length != 1) {
			notify('warning', `${value} غير موجود...`)
			return 
		}

		const newItem = {
			item: itemsData.results[0].id,
			item_name: itemsData.results[0].name,
			quantity: item?.quantity || 1,
			unit_price: item?.unit_price || itemsData.results[0].price4
		}
	
		setInvoices((prev) => newInvoicesList(prev, newItem, id))
		setItem(aaa)
	}

	const handleOnBlur = (itemsData, _, value) => {
		if (value === '') return
		if (itemsData.results.length != 1) {
			notify('error', `${value} غير موجود...`)
			return 
		}

		setItem((prev) => ({
			...prev,
			item: itemsData.results[0].id,
			item_name: itemsData.results[0].name,
			quantity: item?.quantity || 1,
			unit_price: item?.unit_price || itemsData.results[0].price4
		}))
	}

	const handleOnItemsChange = (e) => {
		let {name, value} = e.target
		setItem((prev) => ({
			...prev,
			[name]: value
		}))
	}

	const handleOnClickAdd = () => {
		setInvoices((prev) => newInvoicesList(prev, item, id))
		setItem(aaa)
	}

	return (
		<div className="items">
			<InvoiceFormSearchField label={'اسم الصنف'} onEnterKeyDown={handleOnEnterKeyDown} endpotin={'items'} onBlur={handleOnBlur} />
			<MyGroup label='عدد القطع' feedback={''}>
				<Form.Control
					type="number"
					name='quantity'
					onKeyDown={(e) => (e.key === 'Enter') && handleOnClickAdd()}
					value={item.quantity}
					placeholder="عدد القطع"
					onChange={handleOnItemsChange}
					isInvalid={false}
					onFocus={(e) => e.target.select()}
				/>
			</MyGroup>
			<MyGroup label='سعر القطعه' feedback={''}>
				<Form.Control
					type="number"
					name='unit_price'
					onKeyDown={(e) => (e.key === 'Enter') && handleOnClickAdd()}
					value={item.unit_price}
					placeholder="سعر القطعه"
					onChange={handleOnItemsChange}
					isInvalid={false}
					onFocus={(e) => e.target.select()}
				/>
			</MyGroup>	

			<button className="btn btn-success" onClick={handleOnClickAdd}><i className="fa-solid fa-plus" ></i></button>
		</div>
	)
}

const InvoiceDetailForm = ({ invoice, setInvoices, errors }) => {
	const id = invoice.uuid || invoice.id


	const handleOnChange = (e) => {
		const {name, value} = e.target
		setInvoices((prev) => prev.map((inv) => {
			if ((inv.uuid || inv.id) === id) {
				inv[name] = value
			}
			return inv
		}))
	}

	const handleOnBlur1 = (itemsData, name, value) => {
		if (itemsData.results?.length != 1) {
			notify('error', `${value} غير موجود...`)
			setInvoices((prev) => newInvoiceDetail(prev, null, name, id))
			return
		}

		setInvoices((prev) => newInvoiceDetail(prev, itemsData, name, id))
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

const newInvoiceDetail = (oldList, itemsData, name, selectedInvoiceId) => (
	oldList.map((v) => {
		if ((v.uuid || v.id) === selectedInvoiceId) {
			v[name] = itemsData?.results[0].id
			v[name + '_name'] = itemsData?.results[0].name
		}
		return v
	})
)


export default InvoiceForm