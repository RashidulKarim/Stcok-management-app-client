import {
  createBrowserRouter, Outlet, RouterProvider
} from "react-router-dom";
import './App.css';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import AddProductPage from "./components/pages/AddProduct";
import AddUser from "./components/pages/AddUser";
import AllProducts from "./components/pages/AllProducts";
import Dashboard from "./components/pages/Dashboard";
import ErrorPage from './components/pages/Error';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import ModifyProduct from "./components/pages/ModifyProduct";

const HeaderLayout = () => (
  <>
    <header>
      <Navbar />
    </header>
    <div className="main-container justify-center">
      <Outlet />
    </div>
    < Footer />
  </>
);

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/addProduct',
        element: <AddProductPage />,
      },
      {
        path: '/shortProducts',
        element: <AllProducts />,
      },
      {
        path: '/addUser',
        element: <AddUser />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/modifyProduct',
        element: <ModifyProduct />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className='bg-white body'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
