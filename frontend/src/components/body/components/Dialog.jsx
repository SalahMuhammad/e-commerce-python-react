import { forwardRef } from "react"

const Dialog = forwardRef((props, ref) => (
    <dialog className="my-dialog-modal" ref={ref} onClick={close}>
      <div className="header">
        <h1>{props.title}</h1>
      </div>
      <hr />
      <div className="modal-body">
        {props.children}
      </div>
    </dialog>
  )
);

Dialog.displayName = 'Dialog'; // Set the display name


function close(e) {
  if (e.target !== e.currentTarget)
    return
  const dialogDimensions = e.target.getBoundingClientRect()

  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    e.target.close()
  }
}

export default Dialog;
