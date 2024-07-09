import { useNavigate } from "react-router-dom"
import MyGroup from "../common/FormGroup"
import Form from 'react-bootstrap/Form';
import MyModal from "../common/Modal"
import { useState } from "react"
import { useData2 } from "../custom-hooks/useData";
import { sendRequest } from "../api";
import { notify } from "../notification";
import { setCookie } from "../utilities";


export default function ProfitPercent() {
    const [data, setData] = useState({
        price2: '',
        price3: '',
        price4: '',
    })
    const { loading } = useData2('api/pp/', setData)
    const navigate = useNavigate()

    function handleChange(e) {
        const { name, value } = e.target;

        setData((prevData) => ({
                ...prevData,
                [name]: value
            })
        )
    }
    
    const commonAttribute = {
        type: "number",
        step: "any",
        onChange: handleChange,
    }

    const handleSubmit = async () => {
		
		const {error, statusCode} = await sendRequest('post', `api/pp/`, data, 'نسب الربح')

		if (statusCode === 201) {
            setCookie('pp', JSON.stringify(data), 365)
            navigate('../')
            return
		} else if (statusCode === 400) {
            notify('error', error['detail'] || '')

        }
	}	

    return (
        <MyModal title={"تحديد نسب الربح"} onSubmit={handleSubmit}>
            {loading && <span style={{color: 'red'}}>جار التحميل...</span>}
            <Form>
                <MyGroup label='خاص' feedback={'error'}> 
                    <Form.Control
                        name='price2'
                        value={data.price2}
                        placeholder="خاص"
                        {...commonAttribute}
                        autoFocus
                    />
                </MyGroup>

                <MyGroup label='جمله' feedback={'error'}> 
                    <Form.Control
                        name='price3'
                        value={data.price3}
                        placeholder="جمله"
                        {...commonAttribute}
                    />
                </MyGroup>

                <MyGroup label='قطاعى' feedback={'error'}> 
                    <Form.Control
                        name='price4'
                        value={data.price4}
                        placeholder="قطاعى"
                        {...commonAttribute}
                    />
                </MyGroup>
            </Form>
        </MyModal>
    )
}