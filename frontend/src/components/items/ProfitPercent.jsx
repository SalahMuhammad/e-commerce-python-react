import { useNavigate } from "react-router-dom"
import Dialog from "../common/Dialog"
import { useEffect, useState } from "react"

export const percents = {
    2: .10,
    3: .2,
    4: .4,
}

export default function ProfitPercent() {
    const [data, setData] = useState({
        2: 0,
        3: 0,
        4: 0
    })
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()

    function handleChange(e) {
        const { name, value } = e.target;

        setData((prevData) => ({
                ...prevData,
                [name]: value
            })
        )
    }
// #######################################################################
//     Separation of Concerns: It's generally a good practice to separate your data fetching logic from your component rendering logic. This makes your code more modular and easier to maintain. Consider moving the data fetching logic to a separate function or a custom hook.
// Error Handling: You should handle errors that may occur during the data fetching process. Use try-catch blocks or .catch() methods to catch any errors and handle them gracefully, such as displaying an error message to the user or retrying the fetch operation.
// #######################################################################
    useEffect(() => {
        // fetch data from the server
        // data fetched
        try {
            setData(percents)
        } catch {
            console.log('error')
        } finally {
            setIsLoading(false)
        }
        
    }, [])

    return (
        <Dialog title={"تحديد نسب الربح"}>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={(e) => {
                    e.preventDefault()
                    navigate(-1)
                }}>
                    <div className="mb-3">
                        <span>نسب الربح :</span>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="خاص" name="2" value={data[2]} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="جمله" name="3" value={data[3]} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="قطاعى" name="4" value={data[4]} onChange={handleChange} />
                    </div>
    
                    <hr />
    
                    <div className="mb-3">
                        <input
                            type="button"
                            className="btn btn-danger"
                            value={'الغاء'}
                            onClick={() => {
                                    navigate(-1)
                                }
                            } />
                        <input type="submit" className="btn btn-success" value={'حفظ'} />
                    </div>
                </form>
            )}
        </Dialog>
    )
}