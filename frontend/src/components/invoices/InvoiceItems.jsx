import MyModal from "../common/Modal"
import useData from "../custom-hooks/useData"
import { useParams } from "react-router-dom"
import Table from "../common/Table"

const InvoiceItems = () => {
    const { id } = useParams()
    const { data } = useData(`api/invoices/${id}/?fields=items`)

    return (
        <MyModal title={`اصناف فاتوره ${id}`}>
            <Table theadList={['اسم الصنف', 'العدد', 'سعر القطعه']}>
                <tbody>
                    {data && data.items && data.items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit_price}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>اجمالى</td>
                        <td colSpan={2}>{data && data.items && data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)}</td>
                    </tr>
                </tfoot>
            </Table>
        </MyModal>
    )
}

export default InvoiceItems