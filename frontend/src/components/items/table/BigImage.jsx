import { forwardRef } from "react"

const handleClick = (ref) => {
  ref.current.classList.remove('active', 'clicked')
}

const BigImage = forwardRef((_, ref) => (
  <img ref={ref} className="big-img" alt="" onClick={() => handleClick(ref)}/>
))

export default BigImage
// {
//   <img ref={bigImgRef} className="big-img" alt="" onClick={() => {
//     bigImgRef.current.classList.remove('active', 'clicked')
//   }}/>
// }