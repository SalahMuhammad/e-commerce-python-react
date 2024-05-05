import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";

const Dialog = ({ title, children }) => {
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    ref.current.showModal()
  })

  return (
    <dialog className="my-dialog-modal" ref={ref} onClick={(e) => {close(e, navigate)}}>
      <div className="header">
        <h1>{title}</h1>
      </div>
      <hr />
      <div className="modal-body">
        {children}
      </div>
    </dialog>
  )
};

Dialog.displayName = 'Dialog'; // Set the display name


function close(e, navigate) {
  if (e.target !== e.currentTarget)
    return
  const dialogDimensions = e.target.getBoundingClientRect()

  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    // e.target.close()
    navigate('/الاصناف', { replace: true })
  }
}

export default Dialog;
