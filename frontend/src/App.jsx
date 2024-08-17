import { createBrowserRouter, BrowserRouter as Router, createRoutesFromElements, RouterProvider, Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom'
// toast norification init
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// custom components
import Header from "./components/header/Header"
import Login from './components/login/Login';
import Items from './components/items/Items';

import ProfitPercent from './components/items/ProfitPercent';
import PageNotFound from './components/common/404';
import ItemsForm from './components/items/ItemsForm';
import Repositories from './components/repositories/Repositories';
import RepositoriesForm from './components/repositories/RepositoriesForm';
import ClientSupplier from './components/client-supplier/Client-supplier';
import ClientSupplierForm from './components/client-supplier/Client-supplierForm';
import Invoices from './components/invoices/Invoices';


const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route 
					path="/"
					// the matching param might be available to the loader
					loader={({ params }) => {
						// console.log(params["lang"]); // get lang param, ? means optional /:lang?/categories
						return null
					}}
					// and the naction
					action={({ params }) => { }}
					element={<Login />} />
			<Route
				element={
					<>
						<Header />
						<Outlet />
					</>
				}
				errorElement={<PageNotFound/>} >

	{/* loader={({ params }) => {console.log(params)}} */}
				{/* </Route> */}
				{/* <Route path="" element={<Login />} /> */}
				<Route path="/الاصناف" element={<Items />}>
					<Route path='ادراج' element={<ItemsForm />} />
					<Route path='تعديل/:id' element={<ItemsForm />} />
					<Route path='نسب-الربح' element={<ProfitPercent />} />
				</Route>
				<Route path="/المخازن" element={<Repositories />}>
					<Route path='ادراج' element={<RepositoriesForm />} />
					<Route path='تعديل/:id' element={<RepositoriesForm />} />
				</Route>
				<Route path='/العملاء-الموردين' element={<ClientSupplier isClient={true} />}>
					<Route path='ادراج' element={<ClientSupplierForm isClient={true} />}/>
					<Route path='تعديل/:id' element={<ClientSupplierForm isClient={true} />}/>
				</Route>
				<Route path='/الفواتير' element={<Invoices />}>
					{/* <Route path='ادراج' element={<ClientSupplierForm />}/> */}
					{/* <Route path='تعديل/:type/:id' element={<InvoiceForm />}/> */}
				</Route>
				<Route path="*" element={<PageNotFound />} />
			</Route>
		</>
	)
);



// const router = createBr owserRouter([
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
