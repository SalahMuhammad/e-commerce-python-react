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
import InvoicesToggle from './components/invoices/Toggle';
import InvoiceForm from './components/invoices/InvoicesForm';
import InvoicesList from './components/invoices/InvoicesList';
import InvoiceItems from './components/invoices/InvoiceItems';
import Sidebar from './components/header/Header2';


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
						<Sidebar />
						<div className="custome-container">
							<Outlet />
						</div>
					</>
				}
				errorElement={<PageNotFound/>} >

	{/* loader={({ params }) => {console.log(params)}} */}
				{/* </Route> */}
				{/* <Route path="" element={<Login />} /> */}
				<Route path="/items" element={<Items />} />
				<Route path='/items/add' element={<ItemsForm />} />
				<Route path='/items/edit/:id' element={<ItemsForm />} />
				<Route path='/items/edit-profit-percentages' element={<ProfitPercent />} />

				<Route path="/repositories" element={<Repositories />} />
				<Route path='/repositories/add' element={<RepositoriesForm />} />
				<Route path='/repositories/edit/:id' element={<RepositoriesForm />} />

				<Route path='/clients-suppliers' element={<ClientSupplier isClient={true} />} />
				<Route path='/clients-suppliers/add' element={<ClientSupplierForm isClient={true} />}/>
				<Route path='/clients-suppliers/edit/:id' element={<ClientSupplierForm isClient={true} />}/>
				
				<Route path='/invoices' element={<InvoicesList />}>
					{/* <Route path='list' element={<InvoicesList />}> */}
					{/* </Route> */}
						<Route path=':id/items' element={<InvoiceItems />} />
				</Route>
				<Route path='/invoices/crud' element={<InvoiceForm />} />
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
