import TableHead from "./TableHead"
import { useFormInput } from '../../../custom-hooks/useFormInput'
import Dialog from "../../components/Dialog.jsx";
import ItemForm from "../ItemForm.jsx"
import { useEffect, useRef, useState } from "react";
import ProfitPercent from "../ProfitPercent";
import TableImages from "./Image";
import { fetchData } from "../../../api";

let items = [
  { id: 1, name: 'مقص', price1: 20, price2: 22, price3: 25, price4: 30, images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg'] },
  { id: 2, name: 'Shaver', price1: 15, price2: 18, price3: 2.20, price4: 25, images: ['https://example.com/shaver_image1.jpg', 'https://example.com/shaver_image2.jpg', 'https://example.com/shaver_image3.jpg'] },
  { id: 3, name: 'Scifffffffffffffffffffffffffffffffffss o rsSciffffffffffffff fffffffffffffffff ffssorsSciffffffffffffff fffffffffffffffffffssorsScifffffffffffffffffffffffffffffffffssorsScifffffffffffffffffffffffffffffffffssors', price1: 25, price2: 28, price3: 30, price4: 35, images: ['https://example.com/scissors_image1.jpg', 'https://example.com/scissors_image2.jpg', 'https://example.com/scissors_image3.jpg'] },
  { id: 4, name: 'Pen', price1: 5, price2: 10, price3: 12, price4: 15, images: ['https://example.com/pen_image1.jpg', 'https://example.com/pen_image2.jpg', 'https://example.com/pen_image3.jpg'] },
  { id: 5, name: 'Notebook', price1: 8, price2: 15, price3: 18, price4: 20, images: ['https://example.com/notebook_image1.jpg', 'https://example.com/notebook_image2.jpg', 'https://example.com/notebook_image3.jpg'] },
  { id: 6, name: 'Chair', price1: 50, price2: 55, price3: 60, price4: 65, images: ['https://example.com/chair_image1.jpg', 'https://example.com/chair_image2.jpg', 'https://example.com/chair_image3.jpg'] },
  { id: 7, name: 'Laptop', price1: 800, price2: 13, price3: 14, price4: 15, images: ['https://example.com/laptop_image1.jpg', 'https://example.com/laptop_image2.jpg', 'https://example.com/laptop_image3.jpg'] },
  { id: 8, name: 'Desk', price1: 120, price2: 70, price3: 75, price4: 80, images: ['https://example.com/desk_image1.jpg', 'https://example.com/desk_image2.jpg', 'https://example.com/desk_image3.jpg'] },
  { id: 9, name: 'Backpack', price1: 30, price2: 40, price3: 45, price4: 50, images: ['https://example.com/backpack_image1.jpg', 'https://example.com/backpack_image2.jpg', 'https://example.com/backpack_image3.jpg'] },
  { id: 10, name: 'Coffee Mug', price1: 12, price2: 8, price3: 10, price4: 12, images: ['https://example.com/mug_image1.jpg', 'https://example.com/mug_image2.jpg', 'https://example.com/mug_image3.jpg'] },
  // ... Add 20 more items with similar structure
];

export default function Table() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const dialogRef = useRef(null)
  const [action, setAction] = useState('')
  const [selectedId, setSelectedId] = useState(0)
  const bigImgRef = useRef(null)
  const selectedItem = items.find((i) => i.id === selectedId)
  const [isImageClicked, setIsImageClicked] = useState(false);
  const responseDataRef = useRef(null)
  const [url, setUrl] = useState('الاصناف/')
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    let ignored = false;

    fetchData(url, { method: 'GET', } ).then((response) => {
      if (! ignored) {
        if (response.previous) {
          setItems((prev) => [...prev, ...response.results])
        } else {
          setItems(response.results)
        }
        setIsLoading(false)

        responseDataRef.current = {
          count: response.count,
          next: response.next,
          previous: response.previous
        }
      }
    });

    return () => {
      console.log('canceld')
      ignored = true
    };
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

  return (
    <>
      
      <Dialog
        ref={dialogRef}
        title={dialogTitle}>
        <ItemForm 
          key={selectedItem && selectedItem.id} 
          dialogRef={dialogRef} 
          action={action} 
          itemObject={selectedItem} />
      </Dialog>

      

      <div 
        className="table-wrapper" 
        onMouseOver={() => {
          if (! isImageClicked) {
            bigImgRef.current.classList.remove('active');
          }
        }}>
        <div className="before-table">
          <img 
            className={isImageClicked 
              ? "big-img active" 
              : "big-img"} 
            onClick={() => 
              setIsImageClicked(false)
            } 
            ref={bigImgRef} 
            alt="" />
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setAction('add')
              setSelectedId(0);
              dialogRef.current.showModal()
          }}>
            اضافه
          </button>
          <input 
            className="form-control" 
            type="text" 
            placeholder="بحث" 
            value={search}
            onChange={(e) => {
              let val = e.target.value.replace(/ {2}$/, '%26%26')
              setSearch(val)
              setUrl(`الاصناف/?name=${val}`)
            }} />
        </div>
        <table>
          <caption>الاصناف</caption>
          <TableHead headers={['', 'الصنف', 'السعر', 'الصور']}/>
          <tbody>
            {items.map((item) => (
              <tr
                className={item.id === selectedId 
                  ? 'active' 
                  : ''} 
                onClick={() => {
                  setSelectedId(item.id)
                }}
                key={item.id}>
                <td>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setAction('edit')
                      dialogRef.current.showModal();
                    }}>
                    تعديل
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      setAction('delete')
                      dialogRef.current.showModal();
                    }}>
                    حذف
                  </button>
                </td>
                <td><span>{item.name}</span></td>
                <td className="prices">
                  <span>{item.price1} </span>
                  <span>{item.price2} </span>
                  <span>{item.price3} </span>
                  <span>{item.price4} </span>
                </td>
                <td>
                  <TableImages bigImgRef={bigImgRef} src="data:image/jpeg;base64,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" isImageClicked={isImageClicked} setIsImageClicked={setIsImageClicked} />
                </td>
              </tr>
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
