import { useRef, useState } from "react"
import { notify } from "../notification"
import MyGroup from "../common/FormGroup"
import { Form, Accordion, Button } from "react-bootstrap"
import { InvoiceFormSearchField } from '../common/SearchInput'
import Table from "../common/Table"
import { getCookie, setCookie } from "../utilities"
import { sendRequest } from "../api"
import useData from "../custom-hooks/useData"
import { useAltShortcut } from "../custom-hooks/useShorcut"

import { useCallback } from "react"
import InvoiceItemsForm from "./InvoiceItemsForm"
import { useEffect } from "react"


const initialData = (id, is_purchase_invoice = false, owner_name = '', owner = null, repository_name = '', repository = null) => ({uuid: id, is_purchase_invoice: is_purchase_invoice, paid: 0, owner: owner, owner_name: owner_name, repository: repository, repository_name: repository_name, items: []})
const InvoiceForm = () => {
	// document.title = 'اضافه-تعديل-حذف'
	const [invoices, setInvoices] = useState(getCookie('invoices') ? getCookie('invoices') : [initialData(crypto.randomUUID())])
	const [errors, setErrors] = useState([])
	const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(0);
	const invoice = invoices[currentInvoiceIndex]
	// useAddItemShorcut(handleAddItem)
	const [items, setItems] = useState(invoice.items);


	invoices[currentInvoiceIndex].items = items
	if (JSON.stringify(getCookie('invoices')) != JSON.stringify(invoices)) {
		setCookie('invoices', JSON.stringify(invoices), 7)
	}

	const addNewItem = () => {
		setItems(prevItems => {
			// return [...prevItems, { ...initialItemState }]
			return [...prevItems, initialItemState]
		});
	};
	useAltShortcut(addNewItem, 73); // i

	const deleteItem = (indexToDelete) => {
		if (items.length <= 1) {
			return; // Don't delete if it's the last item
		}
		setItems(prevItems => {
            return prevItems.filter((_, index) => index !== indexToDelete);
        });
	};

	const handleDeleteInvoice = () => {
		if (invoices.length === 1) {
			setInvoices([initialData(crypto.randomUUID(), invoice?.is_purchase_invoice||false, invoice.owner_name, invoice.owner, invoice.repository_name, invoice.repository)])
			setItems([initialItemState])
			return
		}
		const newInvoiceIndex = currentInvoiceIndex > 0 ? currentInvoiceIndex - 1 : 0
		const invs = invoices.filter((_, index) => index !== currentInvoiceIndex)
		setInvoices(invs)
		setItems(invs[newInvoiceIndex].items)
		setCurrentInvoiceIndex(newInvoiceIndex)
		
	}
	useAltShortcut(handleDeleteInvoice, 46); // i

	const handleAddInvoice = () => {
		// const a = invoices[invoices.length-1]
		setInvoices((prev) => ([
			...prev,
			initialData(crypto.randomUUID(), invoice?.is_purchase_invoice||false, invoice.owner_name, invoice.owner, invoice.repository_name, invoice.repository)
		]))
		setItems([initialItemState])
		setCurrentInvoiceIndex(invoices.length)
	}
	useAltShortcut(handleAddInvoice, 78); // n
	
	const handleSubmit = async (method) => {
		setErrors({})
console.log(invoice)
		// invoice.items = items
		const {error, statusCode} = await sendRequest(
			method, 
			`api/invoices/${invoice.id ? `${invoice.id}/` : ''}`, 
			{
				...invoices[currentInvoiceIndex],
				items: items
			}, 
			'الفاتوره'
		)

		if ([200, 201, 204].includes(statusCode)) {
			handleDeleteInvoice()
		} else if (statusCode === 400) {
			setErrors(error);
			notify('error', error?.detail ? error.detail[0] : null)
		}
	}
	console.log(errors)
	useAltShortcut(() => handleSubmit(invoice.id ? 'patch' : 'post'), 13); // n

	return (
		<div className="slider">
			<FormNavigation invoices={invoices} currentInvoiceIndex={currentInvoiceIndex} setCurrentInvoiceIndex={setCurrentInvoiceIndex} setItems={setItems}>
				<button title="(Alt + n)" className="btn btn-secondary" onClick={handleAddInvoice}>فاتوره جديده <i className="fa-solid fa-plus" ></i></button>
			</FormNavigation>
		
			<div key={invoice.uuid || invoice.id} className="invoice-form">
				<div className="controls mb-3">
					<Button variant="success" onClick={() => handleSubmit(invoice.id ? 'patch' : 'post')}>{invoice?.id ? 'تعديل': 'اضافه'} الفاتوره</Button>
					<button className="no-style" onClick={handleDeleteInvoice}><i className="fa-solid fa-trash-can"></i></button>
					{invoice?.id && <Button variant="danger" onClick={() => {confirm('هل انت متاكد من انك تريد حذف الفاتوره!؟') && handleSubmit(invoice, 'delete')}}>حذف</Button>}
				</div>
				<form action="">
				{true ? (
					<>
						<InvoiceDetailForm invoice={invoice} setInvoices={setInvoices} errors={errors} index={currentInvoiceIndex} />
						{/* <InvoiceItemsForm setInvoices={setInvoices} index={currentInvoiceIndex} /> */}
					</>
				) : (
					<Accordion className="form">
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								التفاصيل:
								فاتوره: {invoice.is_purchase_invoice == 1 ? 'مشتريات' : 'مبيعات'}
								,&nbsp;{invoice.owner_name}
								,&nbsp;{invoice.repository_name}
							</Accordion.Header>
							<Accordion.Body>
								<InvoiceDetailForm invoice={invoice} setInvoices={setInvoices} errors={errors} index={currentInvoiceIndex} />
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="1">
							<Accordion.Header>اضافه صنف</Accordion.Header>
							<Accordion.Body>
								<InvoiceItemsForm setInvoices={setInvoices} index={currentInvoiceIndex} />
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}
				<Table theadList={['#', 'اسم الصنف', 'عدد القطع', 'سعر القطعه']}>
					<tbody>
						{items.map((item, index) => (
								// <InvoiceItemsForm key={index} setInvoices={setInvoices} itemIndex={index} invoiceIndex={currentInvoiceIndex} />
								<InvoiceItemsForm 
									key={index} 
									item={item}
									setItems={setItems} 
									itemIndex={index} 
									onDelete={() => deleteItem(index)}
								/>
							// <tr key={index}>
							
							// 	{/* <td>
							// 		{item.item_name}
							// 		{errors[index]?.item}
							// 	</td>
							// 	<td>{item.quantity}</td>
							// 	<td>{item.unit_price}</td> */}
							// </tr>
						))}
					</tbody>
					<tfoot>
						<tr style={{alignItems: 'center'}}>
							<td title="(ALT + i)" colSpan={2} onClick={addNewItem}><i className="fa-solid fa-plus"></i></td>
							<td>اجمالى</td>
							<td  style={{textAlign: 'center'}}>
								{invoice.items?.reduce((sum, item) => {
									return sum + (item.quantity * item.unit_price);
								}, 0)}
							</td>
						</tr>
					</tfoot>
				</Table>
			</form>
			</div>
		</div>
	)
}


const initialItemState = {
	item_name: '',
	item: null,
	quantity: 1,
	unit_price: 0
  };

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
			<Form.Select defaultValue={invoice.is_purchase_invoice || false} name="is_purchase_invoice" aria-label="Default select example" onChange={handleOnChange}>
				<option value={false}>مبيعات</option>
				<option value={true}>مشتريات</option>
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

const FormNavigation = ({ invoices, currentInvoiceIndex, setCurrentInvoiceIndex, setItems, children }) => {
	const handleToggleInvoice = useCallback((direction) => () => {
        setCurrentInvoiceIndex((prev) => {
            const val = direction === 'next'
                ? Math.min(prev + 1, invoices.length - 1)
                : Math.max(prev - 1, 0);
            
            if (val >= 0 && val < invoices.length) {
                setItems(invoices[val].items);
            }
            
            return val;
        });
    }, [invoices, setItems, setCurrentInvoiceIndex]);
	useAltShortcut(handleToggleInvoice('prev'), 190)
	useAltShortcut(handleToggleInvoice('next'), 188)

	return (
		<div className="invoice-navigation">
			<Button onClick={() => handleToggleInvoice('prev')()} disabled={currentInvoiceIndex === 0}>
				<i className="fa-solid fa-angles-right"></i>
			</Button>
			<span>
				فاتوره {currentInvoiceIndex + 1} من {invoices.length}
			</span>
			<Button onClick={() => handleToggleInvoice('next')()} disabled={currentInvoiceIndex === invoices.length - 1}>
				<i className="fa-solid fa-angles-left"></i>
			</Button>
			{children}
		</div>
	)
}


export default InvoiceForm


const updateInvoiceDetail = (invoices, index, name, data) => {
	const newInvoices = [...invoices]
	const updatedInvoice = {...newInvoices[index]}
	updatedInvoice[name] = data?.results[0].id
	updatedInvoice[name + '_name'] = data?.results[0].name
	newInvoices[index] = updatedInvoice;

	return newInvoices
}
