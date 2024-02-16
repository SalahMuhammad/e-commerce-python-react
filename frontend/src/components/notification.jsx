import { toast } from "react-toastify";

// types ['info', 'warn', 'error', 'success']
export const notify = (message, type) => {
  toast[type](message, {
    // attributes...
  })
}
