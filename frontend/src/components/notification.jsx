import { toast } from "react-toastify";

// types ['info', 'warn', 'error', 'success']
export const notify = (type, message) => {
  toast[type](message, {
    // attributes...
  })
}
