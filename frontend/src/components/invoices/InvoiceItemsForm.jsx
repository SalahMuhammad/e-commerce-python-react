import { Form } from "react-bootstrap";
import MyGroup from "../common/FormGroup";
import { useRef } from "react";
import useData from "../custom-hooks/useData";
// import Dropdown from "./Dropdown";


const InvoiceItemsForm = ({ itemIndex, item, setItems, onDelete }) => {
    // const [item, setItem] = useState(initialItemState);
    const { data } = useData(`api/items/?s=${item.item_name}`);
    const results = data?.results || [];
    const isResultEmpty = results.length === 0 || results.length > 1;
    const countRef = useRef(null);
console.log('fds')
    const handleChange = (e, p = 4) => {
        const { name, value } = e.target;
        setItems(prev => {
            return prev.map((prevItem, index) => {
                if (itemIndex === index) {
                    if (name === 'item_name' && data?.count === 1 && prevItem.item != data.results[0].id) {
                        countRef.current.focus()
                        return {
                            ...prevItem,
                            item: data.results[0].id,
                            item_name: data.results[0].name,
                            unit_price: data.results[0][`price${p}`]
                        };
                    }
                    return {
                        ...prevItem,
                        [name]: value,
                        item: null
                    };
                }
                return prevItem;
            })
        });
    };

    const handleOnFocus = (e) => {
        e.target.select();
    };

    // const handleUnitPriceOnKeyDown = (e) => {
    //     if (e.altKey && e.keyCode === 49) {
    //         handleChange()

    //     } else if (e.altKey && e.keyCode === 50) {
            
    //     } else if (e.altKey && e.keyCode === 50) {
            
    //     } else if (e.altKey && e.keyCode === 50) {
            
    //     }
    // }
console.log(item.item)
    return (
        <tr>
            <td onClick={onDelete}>
                <i className="fa-solid fa-square-minus"></i>
            </td>
            <td>
                <MyGroup feedback={(isResultEmpty && !item.item_name == '') ? `${item.item_name} غير موجود... 😵` : ''}>
                    <Form.Control
                        // className={item.item !== null ? 'selected-item' : ''}
                        autoFocus
                        autoComplete={false}
                        type="text"
                        placeholder="اسم الصنف"
                        list={`items${itemIndex}`}
                        name="item_name"
                        value={item.item_name}
                        onChange={handleChange}
                        onFocus={handleOnFocus}
                        isInvalid={(isResultEmpty && !item.item_name == '')}
                    />
                    {/* <Dropdown items={results} placeholder="fds" onSelect={() => {
                        console.log(324432)
                    }} /> */}

                    <datalist id={`items${itemIndex}`}>
                        {results.map((item) => (
                            <option key={item.id} onMouseEnter={() => {alert('fds')}} value={item.name} />
                        ))}
                    </datalist>
                </MyGroup>
            </td>
            <td>
                <MyGroup feedback="">
                    <Form.Control
                        ref={countRef}
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        placeholder="عدد القطع"
                        onChange={handleChange}
                        onFocus={handleOnFocus}
                    />
                </MyGroup>
            </td>
            <td>
                <MyGroup feedback="">
                    <Form.Control
                        type="number"
                        name="unit_price"
                        value={item.unit_price}
                        placeholder="سعر القطعه"
                        onChange={handleChange}
                        onFocus={handleOnFocus}
                        // onKeyDown={}
                    />
                </MyGroup>
            </td>
        </tr>
    );
};

export default InvoiceItemsForm;

