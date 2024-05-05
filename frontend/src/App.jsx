import { createBrowserRouter, BrowserRouter as Router, createRoutesFromElements, RouterProvider, Routes, Route, Outlet } from 'react-router-dom'
// toast norification init
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// custom components
import Header from "./components/header/Header"
import Login from './components/login/Login';
import ItemsTable from './components/items/table/ItemsTable';
import ItemForm from './components/items/ItemForm'
import ProfitPercent from './components/items/ProfitPercent';


const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			element={
				<>
					<Header />
					<Outlet />
				</>
			}
			errorElement={<p>404 هذا العنوان غير موجود &#128565;</p>
			}>
			<Route path="/"
				// the matching param might be available to the loader
				loader={({ params }) => {
					// console.log(params["lang"]); // get lang param, ? means optional /:lang?/categories
					return null
				}}
				// and the action
				action={({ params }) => { }}
				element={<Login />} />



			{/* </Route> */}
			{/* <Route path="" element={<Login />} /> */}
			<Route path="/الاصناف" element={<ItemsTable />}>
				<Route
					path='اضافه-صنف-جديد'
					element={
						<ItemForm />
					} />
				<Route 
					path='نسب-الربح' 
					element={
						<ProfitPercent />
				} />
			</Route>
		</Route>
	)
);


// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <p>fdsfdfffs</p>,
//     errorElement: <div>404 page not found</div>,
//   },
//   {
//     path: '/items',
//     element: <ItemsTable />,
//   }])

function App() {
	return (
		<>
			<RouterProvider router={router} />
			{/* <Router>
        <Routes>
          <Route path='/' element={<ItemsTable>

          </ItemsTable>}>
            <Route path='/aa' element={<p>fsa</p>}></Route>
          </Route>
        </Routes>
      </Router> */}
			<ToastContainer
				position="top-center"
				closeOnClick={true}
				limit={3} />
		</>
	)
}

export default App
