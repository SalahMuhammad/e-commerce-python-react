import { useFormInput } from "../../custom-hooks/useFormInput"

export const percents = {
  price2: .10,
  price3: .2,
  price4: .4,
}

export default function ProfitPercent({ dialogRef }) {
  const price2PercentOptions = useFormInput('')
  const price3PercentOptions = useFormInput('')
  const price4PercentOptions = useFormInput('')

  return (
    <form>
      {/* <div className="profit-percent"> */}
        {/* <div> */}
          {/* <div className="mb-3">
            <span>عنما يكون سعر الشراء اقل من :</span> 
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="شراء" />
          </div> */}
          <div className="mb-3">
            <span>نسب الربح :</span>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="خاص" {...price2PercentOptions} />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="جمله" {...price3PercentOptions} />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="قطاعى" {...price4PercentOptions} />
          </div>
        {/* </div> */}

        <hr />

        <div className="mb-3">
            <input 
              type="button" 
              className="btn btn-danger" 
              value={'الغاء'} 
              onClick={
                () => {
                  dialogRef.current.close()
                  }
                } />
            <input type="submit" className="btn btn-success" value={'حفظ'} />
        </div>
      {/* </div> */}
    </form>
  )
}