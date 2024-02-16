import Header from "./components/header/Header"
import Body from "./components/body/Body"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Header />
      <Body />
      <ToastContainer
        position="top-center"
        closeOnClick={true}
        limit={3} />
    </>
  )
}

export default App
