import { useRef, useState } from "react"
// import { useFormInput } from "../../custom-hooks/useFormInput"
import Dialog from "../components/Dialog"
import ProfitPercent from "./ProfitPercent"
import { fetchData } from "../../api"

export default function ItemFormContent({ dialogRef, action, itemObject }) {
  const [name, setName] = useState(itemObject ? itemObject.name : '')
  const [price1, setPrice1] = useState(itemObject ? itemObject.price1 : '')
  const [price2, setPrice2] = useState(itemObject ? itemObject.price2 : '')
  const [price3, setPrice3] = useState(itemObject ? itemObject.price3 : '')
  const [price4, setPrice4] = useState(itemObject ? itemObject.price4 : '')
  const [autoCalculatePrices, setAutoCalculatePrices] = useState(true)
  const nestedDialogRef = useRef(null)
  const dataObject = useRef({})
  console.log(dataObject.current)
  
  const percents = {
    price2: .10,
    price3: .2,
    price4: .4,
  }

  let nameObj   = name    ? { 'name': name }      : undefined
  let price1Obj = price1  ? { 'price1': price1 }  : undefined
  let price2Obj = price2  ? { 'price2': price2 }  : undefined
  let price3Obj = price3  ? { 'price3': price3 }  : undefined
  let price4Obj = price4  ? { 'price4': price4 }  : undefined
  
  dataObject.current = {
    name: name,
    price1: price1,
    price2: price2,
    price3: price3,
    price4: price4,
  }

  const buttons = (
    <>
      <hr />

      <div className="mb-3">
        <button 
          type="button" 
          className="btn btn-danger"
          onClick={() => {
            dialogRef.current.close()
          }}>
            الغاء
        </button>
        <button 
          type="submit" 
          className="btn btn-success">
            حفظ
        </button>
      </div>
    </>
  );

  if (action === 'delete') {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()
        // console.log('s')
      }}>
        <p>
          هل انت متاكد من انك تريد حذف &quot;{itemObject.name}&quot; !?
        </p>

        {buttons}
      </form>
    )
  }

  return (
    <>
      <Dialog
        ref={nestedDialogRef}
        title={'تحديد نسب الربح'}
        >
        <ProfitPercent dialogRef={nestedDialogRef} />
      </Dialog>

      <form onSubmit={(e) => {
        e.preventDefault()
        console.log('ssssss')
        if (action === 'add') {
          fetchData(
            'الاصناف/', 
            { 
              method: 'POST' ,
              headers: {
                  'Content-Type': 'application/json' // Set the Content-Type header to JSON
              },
              body: JSON.stringify(dataObject.current) // Convert data to JSON string
            }
          ).then((response) => {
            console.log(response)
          })
        }
      }}>
        <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              nestedDialogRef.current.showModal()
            }}>
              تحديد نسب الربح
        </button>

        <div className="mb-3">
          <label 
            htmlFor="f1" 
            className="form-label">اسم الصنف</label>
          <input 
            // key={itemObject.id ? itemObject.id : 1}
            id="f1" 
            className="form-control" 
            type="text" 
            placeholder="اسم الصنف" 
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (e.target.value) {
                dataObject.current['name'] = e.target.value
              } else {
                delete dataObject.current['name']
              }
            }} />
        </div>

        <div className="mb-3">
          <label 
            htmlFor="f2" 
            className="form-label">
              شراء
            </label>
          <input 
            id="f2" 
            className="form-control" 
            type="text" 
            placeholder="شراء" 
            value={price1}
            onChange={(e) => {
              setPrice1(e.target.value)
              if (autoCalculatePrices) {
                setPrice2(calculatePrice(e.target.value, percents.price2))
                setPrice3(calculatePrice(e.target.value, percents.price3))
                setPrice4(calculatePrice(e.target.value, percents.price4))
              }
            }} />
        </div>

        <div className="mb-3">
          <label 
            htmlFor="f3" 
            className="form-check-label">
              حساب الاسعار بالنسب المقرره مسبقا&nbsp;
            </label>
          <input 
            id="f3" 
            className="form-check-input" 
            type="checkbox" 
            onChange={(e) => {
              setAutoCalculatePrices(e.target.checked)
            }}
            checked={autoCalculatePrices} />
        </div>

        <div className="mb-3">
          <label 
            htmlFor="f4" 
            className="form-label">
              خاص
            </label>
          <input 
            id="f4" 
            className="form-control" 
            type="text" 
            disabled={autoCalculatePrices} 
            placeholder="خاص" 
            value={price2}
            onChange={
              (e) => setPrice2(e.target.value)
            }/>
        </div>

        <div className="mb-3">
          <label 
            htmlFor="f5" 
            className="form-label">
              جمله
            </label>
          <input 
            id="f5" 
            className="form-control" 
            type="text" 
            disabled={autoCalculatePrices} 
            placeholder="جمله"
            value={price3} 
            onChange={
              (e) => setPrice3(e.target.value)
            }/>
        </div>

        <div className="mb-3">
          <label 
            htmlFor="f6" 
            className="form-label">
              قطاعى
            </label>
          <input 
            id="f6" 
            className="form-control" 
            type="text" 
            disabled={autoCalculatePrices} 
            placeholder="قطاعى" 
            value={price4}
            onChange={
              (e) => setPrice4(e.target.value)
            }/>
        </div>

        <div className="mb-3">
          <label 
            htmlFor="f7" 
            className="form-label">
              الصور
          </label>
          <input 
            id="f7" 
            className="form-control" 
            type="file" />
        </div>

        {buttons}
      </form>
    </>
  )
}

function calculatePrice(purchasePrice, percent) {
  return Number(purchasePrice) + (Number(purchasePrice) * percent)
}
